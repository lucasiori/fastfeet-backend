import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';
import Queue from '../../lib/Queue';

class DeliveryWithProblem {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { count, rows: deliveries } = await Delivery.findAndCountAll({
      where: { canceled_at: null },
      limit: 10,
      offset: (page - 1) * 10,
      order: [
        [{ model: DeliveryProblem, as: 'problems' }, 'updated_at', 'DESC'],
      ],
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
          model: DeliveryProblem,
          as: 'problems',
          attributes: ['id', 'description'],
          required: true,
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

    return res.json(deliveries);
  }

  async delete(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(req.params.id);

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ error: 'Problema na entrega não encontrado' });
    }

    let delivery = await Delivery.findByPk(deliveryProblem.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Entrega já cancelada' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Entrega já finalizada' });
    }

    delivery = await delivery.update({
      canceled_at: new Date(),
    });

    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);
    const recipient = await Recipient.findByPk(delivery.recipient_id);

    await Queue.add(DeliveryCancellationMail.key, {
      deliveryman,
      delivery,
      recipient,
    });

    return res.json(delivery);
  }
}

export default new DeliveryWithProblem();
