import User from '../models/User';
import File from '../models/File';

/* Foi necessário criar essa classe para listar um tipo específico de usuário */
class ProviderControler {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true }, // condição
      attributes: ['id', 'name', 'email', 'avatar_id'], // define o que vai retornar
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderControler();
