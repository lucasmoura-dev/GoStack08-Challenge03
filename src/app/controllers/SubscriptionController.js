import * as Yup from 'yup';
import { parseISO, startOfHour, isBefore } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionController {
  async index(req, res) {
    // new Date() < meetup.date
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: {
        model: Meetup,
        where: {
          date: {
            [Op.gt]: new Date(),
          },
        },
      },
      order: [[Meetup, 'date']],
    });
    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [User],
    });

    /* Verifica se está se inscrevendo no próprio Meetup */
    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't subscribe your own meetup" });
    }

    /* Verifica se o horário do Meetup já passou */
    if (meetup.past) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to past meetups." });
    }

    const hasSubscribed = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id,
      },
    });

    /* Verifica se já está registrado no evento */
    if (hasSubscribed) {
      return res
        .status(400)
        .json({ error: 'You are already registered for this event.' });
    }

    const containsSameTimeMeetup = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: {
        model: Meetup,
        required: true,
        where: {
          date: meetup.date,
        },
      },
    });

    /* Verifica se já está inscrito em outro Meetup no mesmo horário */
    if (containsSameTimeMeetup) {
      return res.status(400).json({
        error: "Can't subscribe to two meetups at the same time.",
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    const user = await User.findByPk(req.userId);

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
