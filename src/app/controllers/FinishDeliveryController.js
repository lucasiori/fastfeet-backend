import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class FinishDeliveryController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { page = 1 } = req.query;

    const { count, rows: deliveries } = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: {
          [Op.not]: null,
        },
      },
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.header('X-Total-Count', count);

    return res.json(deliveries);
  }

  async update(req, res) {
    const schemaValidator = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schemaValidator.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { signature_id } = req.body;

    const signature = await File.findByPk(signature_id);

    if (!signature) {
      return res.status(400).json({ error: "Recipient's signature required" });
    }

    /**
     * Check signature isn't being use
     */
    const deliveryFile = await Delivery.findOne({ where: { signature_id } });

    const deliverymanFile = await Deliveryman.findOne({
      where: { avatar_id: signature_id },
    });

    if (deliveryFile || deliverymanFile) {
      return res.status(400).json({ error: "Invalid recipient's signature" });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: req.params.delivery_id,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Delivery already finished' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'Delivery not started' });
    }

    delivery.signature_id = signature_id;
    delivery.end_date = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new FinishDeliveryController();
