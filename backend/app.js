import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './utils/config.js';
import userRouter from './controllers/user.js';
import productRouter from './controllers/product.js';
import cartItemRouter from './controllers/cartItem.js';
import orderRouter from './controllers/order.js';
import orderItemRouter from './controllers/orderItem.js';
import checkoutRouter from './controllers/checkout.js';

const app = express();

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartItemRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', orderRouter);
app.use('/api/orderItems', orderItemRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});


export default app;
