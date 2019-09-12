import Sequelize, { Model } from 'sequelize';

class User extends Model {
  /**
   * Vai ser chamado automaticamente pelo Sequelize
   * @param {*} sequelize
   */
  static init(sequelize) {
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
