import express from "express";
import ProductManager from "./controllers/ProductManager.js";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js";
import router from "./routes/socket.routes.js";
import { Server } from 'socket.io'
import { engine } from 'express-handlebars';
import { __dirname } from "./path.js";
import * as path from 'path'

const productManager = new ProductManager('src/models/products.json');
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

// Socket.io
const io = new Server(server);
io.on('connection', async (socket) => {
  console.log('Client connected');

  socket.on('addProduct', async (info) => {
    const newProduct = await productManager.addProduct(
      info.title,
      info.description,
      info.code,
      info.price,
      true,
      info.stock,
      info.category,
      info.thumbnails
    );
    socket.emit('messageProductAdded', newProduct);
    socket.emit('getProducts', await productManager.getProducts());
  });

  socket.on('deleteProduct', async (id) => {
    const deletedProduct = await productManager.deleteProduct(parseInt(id));
    socket.emit('messageProductDeleted', deletedProduct);
    socket.emit('getProducts', await productManager.getProducts());
  });

  socket.emit('getProducts', await productManager.getProducts());
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Routes
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', router);
app.use('/api/products', routerProduct);
app.use('/api/carts', routerCart);
app.use('/realtimeproducts', router);