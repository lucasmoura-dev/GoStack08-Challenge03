module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate:
        'CASCADE' /* o que vai acontecer caso o user com esse id sofra update */,
      onDelete:
        'SET NULL' /* o que vai acontecer caso o user com esse id seja deletado */,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
