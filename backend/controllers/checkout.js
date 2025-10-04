import express from 'express';
import User from '../models/user.js';
import CartItem from '../models/cartItem.js';
import OrderItem from '../models/orderItem.js';
import Order from '../models/order.js';
import Product from '../models/product.js';

const checkoutRouter = express.Router();

checkoutRouter.post('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('cart');
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.cart.length === 0)
            return res.status(400).json({ message: 'Cart is empty' });

        const invalidItems = [];
        const validItems = [];
        for (const cartItem of user.cart) {
            const product = await Product.findById(cartItem.product);
            if (!product) {
                invalidItems.push(cartItem._id);
            } else {
                validItems.push(cartItem);
            }
        }

        if (invalidItems.length > 0) {
            user.cart = validItems;
            await user.save();
            await CartItem.deleteMany({ _id: { $in: invalidItems } });
            return res.status(400).json({
                message: 'Some items in your cart are no longer available and have been removed. Please review your cart.',
                invalidItems: invalidItems
            });
        }

        const populatedCart = await user.populate('cart.product').execPopulate();

        const orderItems = await Promise.all(
            populatedCart.cart.map(async (cartItem) => {
                const orderItem = new OrderItem({
                    productName: cartItem.product.productName || 'Unknown Product',
                    price: cartItem.price,
                    quantity: cartItem.quantity,
                    size: cartItem.size,
                    gift: cartItem.gift
                });
                await orderItem.save();
                return orderItem._id;
            })
        );

        const totalAmount = populatedCart.cart.reduce((sum, item) => sum + item.price * item.quantity + 10*(item.gift === true),0);

        const newOrder = new Order({
            items: orderItems,
            totalAmount
        });
        await newOrder.save();

        user.orderHistory.push(newOrder._id);

        const cartItemIds = user.cart.map(item => item._id);
        user.cart = [];
        await user.save();
        await CartItem.deleteMany({ _id: { $in: cartItemIds } });

        res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default checkoutRouter;