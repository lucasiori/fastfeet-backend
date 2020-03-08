import * as Yup from 'yup';

import Recipient from '../models/Recipient';

import zipCodeValidation from '../../utils/zipCodeValidation';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll();

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
      return res.status(400).json({ error: 'Zip code invalid' });
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
      return res.status(400).json({ error: 'Zip code invalid' });
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
