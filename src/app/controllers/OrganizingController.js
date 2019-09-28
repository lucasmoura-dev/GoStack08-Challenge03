import { subHours, isBefore } from 'date-fns';

import Meetup from '../models/Meetup';

class OrganizingController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
    });

    return res.json(meetups);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to cancel this meetup." });
    }

    const dateWithSub = subHours(meetup.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel meetups 2 hours in advance.',
      });
    }

    meetup.destroy();
    return res.json(); // criar rota e remover
  }
}

export default new OrganizingController();
