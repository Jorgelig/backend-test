const express = require('express');
const {
  createBrand, createModel,
  getBrands, getBrandModels,
  getBrandModel,
  getFilteredModels,
  updateModelPrice
} = require('./services/brandService');
const { Op } = require('sequelize');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/brands', async (req, res) => {
  try {
    const brands = await getBrands();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/brands/:id/models', async (req, res) => {
  try {
    console.log(req.params.id);
    const models = await getBrandModels(req.params.id);
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/brands', async (req, res) => {
  const { name } = req.body;
  try {
    const brand = await createBrand(name);
    res.status(201).json(brand);
  } catch (error) {
    if (error.message === 'Brand name already exists') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/brands/:id/models', async (req, res) => {
  const { id } = req.params;
  const { name, average_price } = req.body;
  try {
    const model = await createModel(id, name, average_price);
    res.status(201).json(model);
  } catch (error) {
    if (error.message === 'Brand not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Model name already exists for this brand') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Average price must be greater than 100,000') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/models', async (req, res) => {
  const { greater, lower } = req.query;
  console.log(greater, lower);
  try {
    const models = await getFilteredModels(greater, lower);
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/models/:id', async (req, res) => {
  try {
    const model = await getBrandModel(req.params.id);
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/models/:id', async (req, res) => {
  const { id } = req.params;
  const { average_price } = req.body;
  try {
    const model = await updateModelPrice(id, average_price);
    res.json(model);
  } catch (error) {
    if (error.message === 'Average price must be greater than 100,000') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Model not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});