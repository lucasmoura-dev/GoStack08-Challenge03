import Sequelize, { Model } from 'sequelize';

class User extends Model {
  /**
   * Vai ser chamado automaticamente pelo Sequelize
   * @param {*} sequelize
   */
  static init(sequelize) {
    // Model define os dados que serão usados do req.body, os outros serão ignorados.
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default User;
