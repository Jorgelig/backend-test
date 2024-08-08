const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Brand = require('./brand');

const Model = sequelize.define('Model', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  averagePrice: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'Model',
  tableName: 'Models',
  timestamps: true,
});

Model.associate = (models) => {
  Model.belongsTo(models.Brand, {
    foreignKey: 'brandId',
    as: 'brand',
  });
};

module.exports = Model;