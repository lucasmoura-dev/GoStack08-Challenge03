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

    /* Verifca a validação dos campos */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

    /* Verifica se está se inscrevendo no próprio Meetup */
    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't subscribe your own meetup" });
    }

    const hourStart = startOfHour(parseISO(meetup.date));

    /* Verifica se o horário do Meetup já passou */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    const hasSubscribed = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id,
      },
    });

    /* Verifica se já está registrado no evento */
    if (hasSubscribed) {
      return res
        .status(400)
        .json({ error: 'You are already registered for this event.' });
    }

    const containsSameTimeMeetup = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: {
        model: Meetup,
        as: 'meetup',
        where: {
          date: meetup.date,
        },
      },
    });

    /* Verifica se já está inscrito em outro Meetup no mesmo horário */
    if (containsSameTimeMeetup) {
      return res.status(400).json({
        error: 'You are already registered for an event at the same time.',
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
