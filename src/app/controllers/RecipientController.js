import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

import zipCodeValidation from '../../utils/zipCodeValidation';

class RecipientController {
  async index(req, res) {
    const { q: recipientNameFiler, page = 1 } = req.query;
    const whereClausule = {};

    if (recipientNameFiler) {
      whereClausule.name = {
        [Op.iLike]: `%${recipientNameFiler}%`,
      };
    }

    const { count, rows: recipients } = await Recipient.findAndCountAll({
      where: whereClausule,
      limit: 10,
      offset: (page - 1) * 10,
    });

    res.header('X-Total-Count', count);

    return res.json(recipients);
  }

  async store(req, res) {
    const schemaValidator = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schemaValidator.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { zip_code } = req.body;

    const zipCodeValid = await zipCodeValidation(zip_code);

    if (!zipCodeValid) {
      return res.status(400).json({ error: 'Invalid zip code' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schemaValidator = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schemaValidator.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { zip_code } = req.body;

    const zipCodeValid = await zipCodeValidation(zip_code);

    if (!zipCodeValid) {
      return res.status(400).json({ error: 'Invalid zip code' });
    }

    let recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    recipient = await recipient.update(req.body);

    return res.json(recipient);
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    recipient.destroy();

    return res.send();
  }
}

export default new RecipientController();
