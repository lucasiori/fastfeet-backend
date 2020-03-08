import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class DeliveryProblemController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: req.params.id },
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schemaValidator = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schemaValidator.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { description } = req.body;
    const { id: delivery_id } = req.params;

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'Delivery not started' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Delivery already finished' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
