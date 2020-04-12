import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

import validateZipCode from '../../utils/validateZipCode';

class RecipientController {
  async index(req, res) {
    const { q: queryFilter, page = 1 } = req.query;

    const { count, rows: recipients } = await Recipient.findAndCountAll({
      where: {
        name: { [Op.iLike]: `%${queryFilter || ''}%` },
      },
      limit: 10,
      offset: (page - 1) * 10,
      order: [['updated_at', 'DESC']],
      attributes: { exclude: ['created_at', 'updated_at'] },
    });

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', count);

    return res.json(recipients);
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id, {
      attributes: { exclude: ['created_at', 'updated_at'] },
    });

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      address_number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao salvar destinatário, por favor verifique os dados',
      });
    }

    if (!(await validateZipCode(req.body.zip_code))) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      address_number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao salvar destinatário, por favor verifique os dados',
      });
    }

    if (!(await validateZipCode(req.body.zip_code))) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    let recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado' });
    }

    recipient.destroy();

    return res.send();
  }
}

export default new RecipientController();
