import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schemaValidator = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schemaValidator.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const passwordMatch = await user.checkPassword(password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Password does not match' });
    }

    const { id } = user;

    return res.json({
      jwt: jwt.sign({ id }, authConfig.secret_key, authConfig.configurations),
    });
  }
}

export default new SessionController();
