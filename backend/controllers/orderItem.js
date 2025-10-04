import express from 'express';
import Order from '../models/order.js';

const orderItemRouter = express.Router();

orderItemRouter.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('items');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order.items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default orderItemRouter;
