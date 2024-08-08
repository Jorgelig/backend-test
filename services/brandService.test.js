const { createBrand, createModel, updateModelPrice, getBrands, getBrandModels, getModels } = require('../services/brandService');
const Brand = require('../models/brand');
const Model = require('../models/model');
const sequelize = require('sequelize');
const { Op } = sequelize;

jest.mock('../models/brand');
jest.mock('../models/model');

describe('Brand Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('createBrand', () => {
    it('should create a new brand if it does not already exist', async () => {
      Brand.findOne.mockResolvedValue(null);
      Brand.create.mockResolvedValue({ name: 'Toyota' });

      const brand = await createBrand('Toyota');
      expect(brand.name).toBe('Toyota');
      expect(Brand.create).toHaveBeenCalledWith({ name: 'Toyota' });
    });

    it('should throw an error if the brand already exists', async () => {
      Brand.findOne.mockResolvedValue({ name: 'Toyota' });

      await expect(createBrand('Toyota')).rejects.toThrow('Brand name already exists');
      expect(Brand.create).not.toHaveBeenCalled();
    });
  });

  describe('createModel', () => {
    it('should create a new model if it does not already exist', async () => {
      Brand.findByPk.mockResolvedValue({ id: 1 });
      Model.findOne.mockResolvedValue(null);

      Model.create.mockResolvedValue({ name: 'Prius', averagePrice: 406400 });

      const model = await createModel(1, 'Prius', 406400);
      expect(model.name).toBe('Prius');
      expect(Model.create).toHaveBeenCalledWith({ brandId: 1, name: 'Prius', averagePrice: 406400 });
    });

    it('should throw an error if the model already exists for the brand', async () => {
      Brand.findByPk.mockResolvedValue({ id: 1 });
      Model.findOne.mockResolvedValue({ name: 'Prius' });

      await expect(createModel(1, 'Prius', 406400)).rejects.toThrow('Model name already exists for this brand');
      expect(Model.create).not.toHaveBeenCalled();
    });

    it('should throw an error if the average price is too low', async () => {
      Brand.findByPk.mockResolvedValue({ id: 1 });
      Model.findOne.mockResolvedValue(null);

      await expect(createModel(1, 'Prius', 90000)).rejects.toThrow('Average price must be greater than 100,000');
      expect(Model.create).not.toHaveBeenCalled();
    });
  });

  describe('updateModelPrice', () => {
    it('should update the price of a model if valid', async () => {
      Model.findByPk.mockResolvedValue({ id: 1, averagePrice: 200000, save: jest.fn() });

      const model = await updateModelPrice(1, 300000);
      expect(model.averagePrice).toBe(300000);
      expect(model.save).toHaveBeenCalled();
    });

    it('should throw an error if the average price is too low', async () => {
      Model.findByPk.mockResolvedValue({ id: 1 });

      await expect(updateModelPrice(1, 90000)).rejects.toThrow('Average price must be greater than 100,000');
    });

    it('should throw an error if the model does not exist', async () => {
      Model.findByPk.mockResolvedValue(null);

      await expect(updateModelPrice(1, 300000)).rejects.toThrow('Model not found');
    });
  });

  describe('getModels', () => {
    it('should get models within the specified price range', async () => {
      Model.findAll.mockResolvedValue([{ id: 1, name: 'Model1', averagePrice: 150000 }]);

      const models = await getModels({ greater: 100000, lower: 200000 });
      expect(models).toEqual([{ id: 1, name: 'Model1', averagePrice: 150000 }]);
      expect(Model.findAll).toHaveBeenCalledWith({ where: { averagePrice: { [Op.gt]: 100000, [Op.lt]: 200000 } } });
    });
  });
});
