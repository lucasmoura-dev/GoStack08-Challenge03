import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  startOfHour,
  parseISO,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const { date, page = 1, pageSize = 10 } = req.query;

    const parsedDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      attributes: ['id', 'title', 'date', 'description', 'location'],
      order: ['date'],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      date: Yup.date().required(),
      location: Yup.string().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, date, description, location, banner_id } = req.body;

    const hourStart = startOfHour(parseISO(date));

    /**
     * Check for past dates
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /*
    O usuário também deve poder editar todos dados de meetups que ainda não aconteceram e que ele é organizador.

    Crie uma rota para listar os meetups que são organizados pelo usuário logado.

    O usuário deve poder cancelar meetups organizados por ele e que ainda não aconteceram. O cancelamento deve deletar o meetup da base de dados.
    */

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

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      date: Yup.date(),
      location: Yup.string(),
      banner_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }

    const hourStart = startOfHour(meetup.date);

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to edit this meetup." });
    }

    const { id, title, date, location, banner_id } = await meetup.update(
      req.body
    );

    // O usuário também deve poder editar todos dados de meetups que ainda não aconteceram e que ele é organizador.
    return res.send({
      id,
      title,
      date,
      location,
      banner_id,
    });
  }
}

export default new MeetupController();
