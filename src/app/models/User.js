import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class User extends Model {
  /**
   * Vai ser chamado automaticamente pelo Sequelize
   * @param {*} sequelize
   */
  static init(sequelize) {
    // Model define os dados que serão usados do req.body, os outros serão ignorados.
    // Não precisam ser reflexo da base de dados
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // não vai exitir no banco de dados
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    /**
     * Vai ser executado antes de salvar/editar um usuário.
     * O hash só será gerado quando estiver alterando uma senha.
     */
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this; // retorna o model que foi inicializado aqui
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.hasMany(models.Meetup);
    this.hasMany(models.Subscription);
    /*
    belongsTo -> tem a referência de um arquivo dentro da tabela Users;
    hasOne -> seria ao contrário, seria o Id do usuário dentro da tabela files;
    hasMany -> id de usuário dentro de vários registros de arquivos na tabela files;
    */
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
