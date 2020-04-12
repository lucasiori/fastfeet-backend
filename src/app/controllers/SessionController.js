import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao iniciar sessão, por favor verifique os dados',
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await user.checkPassword(password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    const { id, name } = user;

    return res.json({
      user: { id, name, email },
      token: jwt.sign(
        { id: user.id },
        authConfig.secret_key,
        authConfig.configurations
      ),
    });
  }
}

export default new SessionController();
