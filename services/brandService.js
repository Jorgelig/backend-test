const { Op } = require('sequelize');
const { Brand, Model, sequelize } = require('../models');

const getBrands = async () => {

  return Brand.findAll({
    from: 'brand',
    include: [
      {
        model: Model,
        attributes: [],
        required: true,
        as: 'model',
      },
    ],
    attributes: [
      'Brand.id',
      'name',
      [
        sequelize.fn('ROUND',
          sequelize.fn('avg', sequelize.col('model.averagePrice'))
          , 2)
        , 'averagePrice'],
    ],
    group: ['Brand.id'],
  });
}

const getBrandModels = async (brandId) => {
  return Model.findAll({ where: { brandId } });
}

const getBrandModel = async (modelId) => {
  return Model.findByPk(modelId);
}

async function createBrand(name) {
  const existingBrand = await Brand.findOne({ where: { name } });
  if (existingBrand) {
    throw new Error('Brand name already exists');
  }
  return Brand.create({ name });
}

const createModel = async (brandId, name, averagePrice) => {
  const brand = await Brand.findByPk(brandId);
  if (!brand) {
    throw new Error('Brand not found');
  }

  const existingModel = await Model.findOne({ where: { brandId, name } });
  if (existingModel) {
    throw new Error('Model name already exists for this brand');
  }

  if (averagePrice && averagePrice <= 100000) {
    throw new Error('Average price must be greater than 100,000');
  }

  return Model.create({ brandId, name, averagePrice });
}

const updateModelPrice = async (id, averagePrice) => {
  if (averagePrice <= 100000) {
    throw new Error('Average price must be greater than 100,000');
  }

  const model = await Model.findByPk(id);
  if (!model) {
    throw new Error('Model not found');
  }

  model.averagePrice = averagePrice;
  return model.save();
}

const getFilteredModels = async (greater, lower) => {
  const filters = {};
  if (greater) {
    filters.averagePrice = { [Op.gt]: greater };
  }
  if (lower) {
    filters.averagePrice = {
      ...(filters.averagePrice || {}),
      [Op.lt]: lower
    };
  }
  return await Model.findAll({ where: filters });
};

module.exports = {
  getBrands, getBrandModels, getBrandModel,
  createBrand, createModel,
  updateModelPrice, getFilteredModels
};