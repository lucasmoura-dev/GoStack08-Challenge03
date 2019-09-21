import Meetup from '../models/Meetup';

class MeetupController {
  // async index() {

  // }

  async store(req, res) {
    const { title, date, description, location, banner_id } = req.body;

    const meetup = Meetup.create({
      title,
      date,
      description,
      location,
      banner_id,
      user_id: req.userId,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
