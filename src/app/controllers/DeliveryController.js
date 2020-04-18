import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';
import ChangeDeliveryMail from '../jobs/ChangeDeliveryMail';
import Queue from '../../lib/Queue';

import getDeliveryStatus from '../../utils/getDeliveryStatus';

class DeliveryController {
  async index(req, res) {
    const { q: queryFilter, status = '', page = 1 } = req.query;
    const { id: deliveryman_id } = req.params;
    const where = {};

    /** Adiciona o filtro por nome do produto */
    if (queryFilter) {
      where.product = { [Op.iLike]: `%${queryFilter}%` };
    }

    /** Adiciona o filtro de acordo com o status */
    if (status.toLowerCase() !== 'all') {
      if (status.toLowerCase() === 'canceled') {
        where.canceled_at = { [Op.not]: null };
      } else {
        where.canceled_at = null;

        if (status.toLowerCase() === 'pending') {
          where.end_date = null;
        } else if (status.toLowerCase() === 'finalized') {
          where.end_date = { [Op.not]: null };
        }
      }
    }

    /** Adiciona o filtro por entregador */
    if (deliveryman_id) {
      where.deliveryman_id = deliveryman_id;
    }

    const { count, rows: deliveries } = await Delivery.findAndCountAll({
      where,
      limit: 10,
      offset: (page - 1) * 10,
      order: [['updated_at', 'DESC']],
      attributes: { exclude: ['updated_at'] },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: { exclude: ['created_at', 'updated_at'] },
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', count);

    return res.json(
      deliveries.map(delivery => ({
        ...delivery.toJSON(),
        status: getDeliveryStatus(delivery),
        editable: delivery.canceled_at === null && delivery.start_date === null,
        deletable:
          delivery.canceled_at !== null ||
          delivery.start_date === null ||
          delivery.end_date !== null,
      }))
    );
  }

  async show(req, res) {
    const delivery = await Delivery.findByPk(req.params.id, {
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: { exclude: ['created_at', 'updated_at'] },
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });

    return res.json({
      ...delivery.toJSON(),
      status: getDeliveryStatus(delivery),
      editable: delivery.canceled_at === null && delivery.start_date === null,
      deletable:
        delivery.canceled_at !== null ||
        delivery.start_date === null ||
        delivery.end_date !== null,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao salvar entrega, por favor verifique os dados',
      });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const delivery = await Delivery.create(req.body);

    /** Envia um email informando ao entregador sobre a nova entrega */
    await Queue.add(NewDeliveryMail.key, {
      deliveryman,
      delivery,
      recipient,
    });

    return res.json({
      ...delivery.toJSON(),
      status: 'pending',
      editable: true,
      deletable: true,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao salvar entrega, por favor verifique os dados',
      });
    }

    let delivery = await Delivery.findOne({
      where: { id: req.params.id, canceled_at: null },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: { exclude: ['created_at', 'updated_at'] },
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Entrega já finalizada' });
    }

    if (delivery.start_date) {
      return res.status(400).json({ error: 'Entrega já iniciada' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const oldDelivery = { ...delivery.toJSON() };

    delivery = await delivery.update({
      recipient_id,
      deliveryman_id,
      product,
    });

    if (oldDelivery.deliveryman_id === Number(delivery.deliveryman_id)) {
      /** Envia um email informando ao entregador sobre a atualização na entrega */
      await Queue.add(ChangeDeliveryMail.key, {
        oldDelivery,
        newDelivery: delivery.toJSON(),
      });
    } else {
      /** Envia um email informando ao entregador sobre a nova entrega */
      await Queue.add(NewDeliveryMail.key, {
        deliveryman,
        delivery,
        recipient,
      });

      /** Envia um email de cancelamento para o antigo entregador */
      await Queue.add(DeliveryCancellationMail.key, {
        deliveryman: oldDelivery.deliveryman,
        delivery: oldDelivery,
        recipient: oldDelivery.recipient,
      });
    }

    const { deliveryman: d, recipient: r, ...rest } = delivery.toJSON(); // eslint-disable-line

    return res.json({
      ...rest,
      status: 'pending',
      editable: true,
      deletable: true,
    });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' });
    }

    if (delivery.start_date && !delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'Não é possível excluir entregas em andamento' });
    }

    delivery.destroy();

    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);
    const recipient = await Recipient.findByPk(delivery.recipient_id);

    await Queue.add(DeliveryCancellationMail.key, {
      deliveryman,
      delivery,
      recipient,
    });

    return res.send();
  }
}

export default new DeliveryController();
