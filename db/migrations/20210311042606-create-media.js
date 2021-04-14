'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      mime_type: Sequelize.STRING,
      size: Sequelize.INTEGER,
      dimensions: Sequelize.STRING,
      path: Sequelize.STRING,
      alt: Sequelize.STRING,
      uploaded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('medias');
  }
};