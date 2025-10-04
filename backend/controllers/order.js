import express from 'express';
import User from '../models/user.js';

const orderRouter = express.Router();

orderRouter.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('orderHistory');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.orderHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default orderRouter;