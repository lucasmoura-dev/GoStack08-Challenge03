import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
  // async index() {

  // }

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
    /*
    Não deve ser possível cadastrar meetups com datas que já passaram.
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
}

export default new MeetupController();
