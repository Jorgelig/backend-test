jest.mock('../models/brand', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock('../models/model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
}));