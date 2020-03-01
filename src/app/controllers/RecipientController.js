import * as Yup from 'yup';

import Recipient from '../models/Recipient';

import validationZipCode from '../../utils/validationZipCode';

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
      return res.status(400).json({ error: 'Validate fails' });
    }

    const zipCodeValid = await validationZipCode(req.body.zip_code);

    if (!zipCodeValid) {
      return res.status(400).json({ error: 'Zip Code invalid' });
    }

    const {
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    });
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
      return res.status(400).json({ error: 'Validate fails' });
    }

    const zipCodeValid = await validationZipCode(req.body.zip_code);

    if (!zipCodeValid) {
      return res.status(400).json({ error: 'Zip Code invalid' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const {
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      address,
      number,
      complement,
      state,
      city,
      zip_code,
    });
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
