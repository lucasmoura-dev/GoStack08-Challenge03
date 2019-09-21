import * as Yup from 'yup';
import { parseISO, startOfHour, isBefore } from 'date-fns';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't subscribe your own meetup" });
    }

    const hourStart = startOfHour(parseISO(meetup.date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const hasSubscribed = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id,
      },
    });

    if (hasSubscribed) {
      return res
        .status(400)
        .json({ error: 'You are already registered for this event.' });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
