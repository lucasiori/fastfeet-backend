import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Delivery from '../models/Delivery';

class DeliverymanController {
  async index(req, res) {
    const { q: deliverymanNameFiler, page = 1 } = req.query;
    const whereClausule = {};

    if (deliverymanNameFiler) {
      whereClausule.name = {
        [Op.iLike]: `%${deliverymanNameFiler}%`,
      };
    }

    const { count, rows: deliverymen } = await Deliveryman.findAndCountAll({
      where: whereClausule,
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    });

    res.header('X-Total-Count', count);

    return res.json(deliverymen);
  }

  async store(req, res) {
    const schemaValidator = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schemaValidator.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { name, email, avatar_id } = req.body;

    if (avatar_id) {
      const avatar = await File.findByPk(avatar_id);

      if (!avatar) {
        return res.status(400).json({ error: 'Avatar not found' });
      }

      /**
       * Check avatar isn't being use
       */
      const deliveryFile = await Delivery.findOne({
        where: { signature_id: avatar_id },
      });

      const deliverymanFile = await Deliveryman.findOne({
        where: { avatar_id },
      });

      if (deliveryFile || deliverymanFile) {
        return res.status(400).json({ error: 'Invalid avatar' });
      }
    }

    let deliveryman = await Deliveryman.findOne({ where: { email } });

    if (!deliveryman) {
      deliveryman = await Deliveryman.create({
        email,
        name,
        avatar_id,
      });
    }

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schemaValidator = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schemaValidator.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email, avatar_id } = req.body;
    const { id: deliveryman_id } = req.params;

    let deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    if (email) {
      const emailExists = await Deliveryman.findOne({ where: { email } });

      if (emailExists && emailExists.id !== deliveryman.id) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    if (avatar_id) {
      const avatar = await File.findByPk(avatar_id);

      if (!avatar) {
        return res.status(400).json({ error: 'Avatar not found' });
      }

      /**
       * Check avatar isn't being use
       */
      const deliveryFile = await Delivery.findOne({
        where: { signature_id: avatar_id },
      });

      const deliverymanFile = await Deliveryman.findOne({
        where: { avatar_id },
      });

      if (
        deliveryFile ||
        (deliverymanFile && deliverymanFile.id !== deliveryman_id)
      ) {
        return res.status(400).json({ error: 'Invalid avatar' });
      }
    }

    deliveryman = await deliveryman.update(req.body);

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    deliveryman.destroy();

    return res.send();
  }
}

export default new DeliverymanController();
