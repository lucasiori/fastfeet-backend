import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';
import Queue from '../../lib/Queue';

class DeliveryWithProblem {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { count, rows: deliveries } = await Delivery.findAndCountAll({
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: DeliveryProblem,
          as: 'problems',
          attributes: ['id', 'description'],
          required: true,
        },
      ],
    });

    res.header('X-Total-Count', count);

    return res.json(deliveries);
  }

  async delete(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(req.params.id);

    if (!deliveryProblem) {
      return res.status(400).json({ error: 'Delivery problem not found' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery already canceled' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Delivery already finished' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);
    const recipient = await Recipient.findByPk(delivery.recipient_id);

    await Queue.add(DeliveryCancellationMail.key, {
      deliveryman,
      delivery,
      recipient,
    });

    return res.json();
  }
}

export default new DeliveryWithProblem();
