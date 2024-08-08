'use strict';
const path = require('path');
const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'models.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const brands = [...new Set(jsonData.map(item => item.brand_name))];

    await queryInterface.bulkInsert('Brands',
      brands.map(name => ({
        name, createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
    console.log('Brands inserted');
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Brands', null, {});
  }
};
