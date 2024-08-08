'use strict';
const path = require('path');
const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, '..', 'models.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const models = jsonData.map(item => ({
      name: item.name,
      averagePrice: item.average_price,
      brand_name: item.brand_name
    }));

    // Get the brand ids
    const brandRecords = await queryInterface.sequelize.query(
      `SELECT * FROM "Brands" b;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const brandMap = brandRecords.reduce((map, brand) => {
      map[brand.name] = brand.id;
      return map;
    }, {});

    // Insert the models
    await queryInterface.bulkInsert('Models',
      models.map(model => ({
        name: model.name,
        averagePrice: model.averagePrice,
        brandId: brandMap[model.brand_name],
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Models', null, {});
  }
};
