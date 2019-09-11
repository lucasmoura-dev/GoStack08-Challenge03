import { Model } from 'sequelize';

class User extends Model {
  /**
   * Vai ser chamado automaticamente pelo Sequelize
   * @param {*} sequelize
   */
  static init(sequelize) {
    super.init(
      {
        name: sequelize.STRING,
        email: sequelize.STRING,
        password_hash: sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default User;
