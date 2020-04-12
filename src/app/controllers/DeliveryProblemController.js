import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const { count, rows: problems } = await DeliveryProblem.findAndCountAll({
      limit: 10,
      offset: (page - 1) * 10,
      order: [['updated_at', 'DESC']],
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: Delivery,
          as: 'delivery',
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
          ],
        },
      ],
    });

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', count);

    return res.json(
      problems.map(problem => ({
        ...problem.toJSON(),
        delivery: {
          ...problem.toJSON().delivery,
          cancelable: problem.toJSON().delivery.canceled_at === null,
        },
      }))
    );
  }

  async show(req, res) {
    const { page = 1 } = req.query;

    const problem = await DeliveryProblem.findOne({
      where: { delivery_id: req.params.id },
      limit: 10,
      offset: (page - 1) * 10,
      order: [['updated_at', 'DESC']],
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: Delivery,
          as: 'delivery',
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
          ],
        },
      ],
    });

    return res.json({
      ...problem.toJSON(),
      delivery: {
        ...problem.toJSON().delivery,
        cancelable: problem.toJSON().delivery.canceled_at === null,
      },
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Erro ao salvar problema na entrega, por favor verifique os dados',
      });
    }

    const delivery = await Delivery.findOne({
      where: { id: req.params.id, canceled_at: null },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Entrega já finalizada' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: req.params.id,
      description: req.body.description,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
