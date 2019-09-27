require('dotenv/config');

/* Credenciais para acessar o banco de dados */
module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // gera automaticamente as datas de edição e criação
    underscored: true, // define que irá utilizar o padrão de tabelas e colunas usando underlines
    underscoredAll: true, // underscore nas colunas
  },
};
