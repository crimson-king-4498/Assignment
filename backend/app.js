import 'dotenv/config'; // Ensures environment variables are loaded first
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

if (!config.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is undefined. Check deployment environment variables.');
}

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB. Check URI and Atlas IP Whitelist:', error.message);
    });

// app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({
        status: 'ok', 
        environment: process.env.NODE_ENV || 'development',
        message: 'E-commerce API is running!',
        time: new Date().toISOString()
    });
});

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartItemRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', orderRouter);
app.use('/api/orderItems', orderItemRouter);

app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).send({ 
        error: 'Not Found', 
        message: `The requested endpoint [${req.method} ${req.originalUrl}] does not exist on this server.`
    });
});


const PORT = config.PORT;

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;