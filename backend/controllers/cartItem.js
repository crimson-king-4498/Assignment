import express from 'express';
import CartItem from '../models/cartItem.js';
import User from '../models/user.js';

const cartRouter = express.Router();

// Get all cart items for a user
cartRouter.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new item to the cart
cartRouter.post('/:userId', async (req, res) => {
    try {
        const { product, quantity, size, gift } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItem = new CartItem({
            product,
            quantity,
            size,
            gift
        });

        const savedCartItem = await cartItem.save();

        user.cart.push(savedCartItem._id);
        await user.save();

        res.status(201).json(savedCartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a cart item
cartRouter.put('/:cartItemId', async (req, res) => {
    try {
        const { quantity, size, gift } = req.body;
        const cartItem = await CartItem.findById(req.params.cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        if (quantity) {
            cartItem.quantity = quantity;
        }
        if (size) {
            cartItem.size = size;
        }
        if (gift !== undefined) {
            cartItem.gift = gift;
        }

        const updatedCartItem = await cartItem.save();
        res.json(updatedCartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a cart item
cartRouter.delete('/:cartItemId', async (req, res) => {
    try {
        const cartItem = await CartItem.findById(req.params.cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Remove the cart item from the user's cart
        const user = await User.findOne({ cart: req.params.cartItemId });
        if (user) {
            user.cart.pull(req.params.cartItemId);
            await user.save();
        }

        await cartItem.remove();

        res.json({ message: 'Cart item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default cartRouter;