const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false, // Desactiva el logging para pruebas
});

module.exports = sequelize;