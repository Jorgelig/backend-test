'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Models', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      brandId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Brands',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      averagePrice: {
        type: Sequelize.INTEGER,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Models');
  }
};
