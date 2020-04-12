import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Delivery from '../models/Delivery';

class DeliverymanController {
  async index(req, res) {
    const { q: queryFilter, page = 1 } = req.query;

    const { count, rows: deliverymen } = await Deliveryman.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${queryFilter || ''}%` },
      },
      limit: 10,
      offset: (page - 1) * 10,
      order: [['updated_at', 'DESC']],
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    });

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', count);

    return res.json(deliverymen);
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id, {
      attributes: { exclude: ['created_at', 'updated_at'] },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    });

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().nullable(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao salvar entregador, por favor verifique os dados',
      });
    }

    const { name, email, avatar_id } = req.body;

    const emailExists = await Deliveryman.findOne({ where: { email } });

    if (emailExists) {
      return res.status(400).json({ error: 'Email já esta sendo usado' });
    }

    if (avatar_id) {
      const avatar = await File.findByPk(avatar_id);

      if (!avatar) {
        return res.status(400).json({ error: 'Avatar inválido' });
      }

      /** Valida se o avatar não esta sendo usado por outro registro */

      const deliverymanFile = await Deliveryman.findOne({
        where: { avatar_id },
      });

      const deliveryFile = await Delivery.findOne({
        where: { signature_id: avatar_id },
      });

      if (deliverymanFile || deliveryFile) {
        return res.status(400).json({ error: 'Avatar inválido' });
      }
    }

    const deliveryman = await Deliveryman.create({
      email,
      name,
      avatar_id,
    });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().nullable(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao salvar entregador, por favor verifique os dados',
      });
    }

    const { name, email, avatar_id } = req.body;
    const { id } = req.params;

    let deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    if (email !== deliveryman.email) {
      const emailExists = await Deliveryman.findOne({ where: { email } });

      if (emailExists) {
        return res.status(400).json({ error: 'Email já esta sendo usado' });
      }
    }

    if (avatar_id) {
      const avatar = await File.findByPk(avatar_id);

      if (!avatar) {
        return res.status(400).json({ error: 'Avatar inválido' });
      }

      /** Valida se o avatar não esta sendo usado por outro registro */

      const deliverymanFile = await Deliveryman.findOne({
        where: { avatar_id },
      });

      const deliveryFile = await Delivery.findOne({
        where: { signature_id: avatar_id },
      });

      if (
        (deliverymanFile && deliverymanFile.id !== Number(id)) ||
        deliveryFile
      ) {
        return res.status(400).json({ error: 'Avatar inválido' });
      }
    }

    deliveryman = await deliveryman.update({
      name,
      email,
      avatar_id,
    });

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    deliveryman.destroy();

    return res.send();
  }
}

export default new DeliverymanController();
