import {
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
    const delivery = await Delivery.findOne({
      where: {
        id: req.params.delivery_id,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.start_date && !delivery.end_date) {
      return res.status(400).json({ error: 'Delivery already started' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Delivery already finished' });
    }

    const date = new Date();

    const { count: todayDeliveries } = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: delivery.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (todayDeliveries >= 5) {
      return res.status(400).json({
        error: 'Deliveries limit per day exceeded for the deliveryman',
      });
    }

    const validInitialTime = setSeconds(
      setMinutes(setHours(new Date(), 8), 0),
      0
    );

    const validFinalTime = setSeconds(
      setMinutes(setHours(new Date(), 18), 0),
      0
    );

    if (isBefore(date, validInitialTime) || isAfter(date, validFinalTime)) {
      return res
        .status(400)
        .json({ error: 'Delivery is only possible between 8 and 18 hours' });
    }

    delivery.start_date = date;

    await delivery.save();

    return res.json(delivery);
  }
}

export default new StartDeliveryController();
