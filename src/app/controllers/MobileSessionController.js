import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao iniciar sessão, por favor verifique os dados',
      });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.id, {
      attributes: { exclude: ['password_hash', 'updated_at'] },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    return res.json({
      user: { ...deliveryman.toJSON() },
      token: jwt.sign(
        { id: deliveryman.id },
        authConfig.secret_key,
        authConfig.configurations
      ),
    });
  }
}

export default new SessionController();
