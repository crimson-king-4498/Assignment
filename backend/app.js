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

// --- Database Connection Setup ---

// NOTE: The check here is now less critical since it's also in utils/config.js, 
// but we keep it for immediate local feedback.
if (!config.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is undefined. Check deployment environment variables.');
}

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        // Logging connection failure helps identify if the 404 is due to a crash caused by Mongo connection setup.
        console.error('Error connecting to MongoDB. Check URI and Atlas IP Whitelist:', error.message);
    });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Root Route (Health Check) ---
// CRITICAL: Ensures the deployment platform sees a successful response at the root, preventing a generic 404.
app.get('/', (req, res) => {
    res.status(200).send({
        status: 'ok', 
        environment: process.env.NODE_ENV || 'development',
        message: 'E-commerce API is running!',
        time: new Date().toISOString()
    });
});

// --- API Routes ---
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartItemRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/orders', orderRouter);
app.use('/api/orderItems', orderItemRouter);

// --- 404 Catch-All ---
// Handles any request that didn't match the routes above, providing a helpful JSON response.
app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).send({ 
        error: 'Not Found', 
        message: `The requested endpoint [${req.method} ${req.originalUrl}] does not exist on this server.`
    });
});


// --- Server Start (Optimized for Vercel) ---
// Use the PORT from the config file, which handles the default/env variable logic.
const PORT = config.PORT;

// IMPORTANT CHANGE: Only call app.listen() in a local environment.
// Vercel manages the server start process for the exported app.
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Vercel requires the Express app instance to be the default export for serverless functions
export default app;
