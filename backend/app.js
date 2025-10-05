import 'dotenv/config'; // <-- NEW: Load environment variables immediately
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

// --- Database Connection ---
// Check if URI is available. This helps debug if dotenv failed.
if (!config.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is undefined. Check .env and deployment settings.');
}

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        // A failure here means the MONGODB_URI is wrong OR the Network Access is blocked.
        console.error('Error connecting to MongoDB. Check URI and Atlas IP Whitelist (0.0.0.0/0):', error.message);
    });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Root Route (Health Check) ---
// This ensures that the deployment platform sees a successful response at the root.
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
app.use((req, res, next) => {
    res.status(404).send({ 
        error: 'Not Found', 
        message: `The requested endpoint [${req.method} ${req.originalUrl}] does not exist.`
    });
});


// --- Server Start ---
const PORT = process.env.PORT || 3001;

// Vercel requires the app itself to be exported for serverless functions
// However, the standard Express setup is kept for Vercel's Build/Deployment process
app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});


export default app;
