import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class FinishDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Erro ao finalizar entrega, por favor verifique os dados',
      });
    }

    let delivery = await Delivery.findOne({
      where: { id: req.params.id, canceled_at: null },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Entrega já finalizada' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'Entrega não iniciada' });
    }

    const { signature_id } = req.body;

    const signature = await File.findByPk(signature_id);

    if (!signature) {
      return res
        .status(400)
        .json({ error: 'Assinatura do destinatário inválida' });
    }

    /** Valida se a assinatura não esta sendo usada por outro registro */

    const deliveryFile = await Delivery.findOne({ where: { signature_id } });

    const deliverymanFile = await Deliveryman.findOne({
      where: { avatar_id: signature_id },
    });

    if (deliveryFile || deliverymanFile) {
      return res
        .status(400)
        .json({ error: 'Assinatura do destinatário inválida' });
    }

    delivery = await delivery.update({
      signature_id,
      end_date: new Date(),
    });

    return res.json(delivery);
  }
}

export default new FinishDeliveryController();
