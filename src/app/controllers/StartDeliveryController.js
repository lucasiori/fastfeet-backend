import {
  setMilliseconds,
  setSeconds,
  setMinutes,
  setHours,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

class StartDeliveryController {
  async update(req, res) {
    let delivery = await Delivery.findOne({
      where: { id: req.params.id, canceled_at: null },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Entrega já finalizada' });
    }

    if (delivery.start_date) {
      return res.status(400).json({ error: 'Entrega já iniciada' });
    }

    const date = new Date();

    /** Valida se o entregador não excedeu o limite de entregas por dia (5) */

    const { count: todayDeliveries } = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: delivery.deliveryman_id,
        start_date: { [Op.between]: [startOfDay(date), endOfDay(date)] },
      },
    });

    if (todayDeliveries === 5) {
      return res
        .status(400)
        .json({ error: 'Limite de entregas por dia excedido' });
    }

    /** Valida se a hora atual esta dentro do período permitido */

    const initialHour = setMilliseconds(
      setSeconds(setMinutes(setHours(new Date(), 8), 0), 0),
      0
    );

    const finalHour = setMilliseconds(
      setSeconds(setMinutes(setHours(new Date(), 18), 0), 0),
      0
    );

    if (isBefore(date, initialHour) || isAfter(date, finalHour)) {
      return res.status(400).json({
        error: 'Entregas só podem ser retiradas entre 08:00 e 18:00 horas',
      });
    }

    delivery = await delivery.update({ start_date: date });

    return res.json(delivery);
  }
}

export default new StartDeliveryController();
