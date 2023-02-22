import { Router } from 'express';
import ProductManager from '../controllers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('src/models/products.json');

router.get('/', async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();
  const data = limit ? products.slice(0, parseInt(limit)) : products;
  res.render('home', { data });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

export default router;
