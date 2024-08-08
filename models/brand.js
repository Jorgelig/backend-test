const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Model = require('./model');

const Brand = sequelize.define('Brand', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  modelName: 'Brand',
  tableName: 'Brands',
  timestamps: true,
  sequelize
});

Brand.hasMany(Model, {
  foreignKey: 'brandId',
  as: 'model',
});

module.exports = Brand;