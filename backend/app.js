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

// --- FIX: Explicit CORS Configuration ---
// The specific error "Redirect is not allowed for a preflight request" is often solved
// by explicitly configuring the CORS origin and methods.

// 1. Define the allowed origin. Ideally, this should be set in your Vercel
// environment variables (e.g., process.env.FRONTEND_URL)
// We use the URL from your error screenshot as the fallback default.
const allowedOrigin = process.env.BASE_URL || 'https://ecomm-frontend-theta.vercel.app'; 

const corsOptions = {
    // Only allow access from the deployed frontend URL
    origin: allowedOrigin,
    // Allows sending credentials (like cookies or Authorization headers)
    credentials: true,
    // Explicitly allow all necessary methods, including OPTIONS for preflight requests
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // Explicitly allow the required headers
    allowedHeaders: ['Content-Type', 'Authorization'],
};

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

// 2. Apply the configured CORS middleware
app.use(cors(corsOptions));
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
