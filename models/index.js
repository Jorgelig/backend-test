const sequelize = require('../config/sequelize');
const Brand = require('./brand');
const Model = require('./model');

Model.belongsTo(Brand, {
  foreignKey: 'brandId',
  as: 'brand',
});

Brand.hasMany(Model, {
  foreignKey: 'brandId',
  as: 'models',
});

module.exports = {
  Brand,
  Model,
  sequelize,
}