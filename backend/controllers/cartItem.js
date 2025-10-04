import express from 'express';
import CartItem from '../models/cartItem.js';
import User from '../models/user.js';
import Product from '../models/product.js';

const cartRouter = express.Router();

// Get all cart items for a user
cartRouter.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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

        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new item to the cart
cartRouter.post('/:userId', async (req, res) => {
    try {
        const { product, productName, price, quantity, size, gift } = req.body;
        const user = await User.findById(req.params.userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingCartItem = user.cart.find(
            (item) => item.product.toString() === product && item.size === size
        );

        if (existingCartItem) {
            return res.status(400).json({ message: 'Item already in cart' });
        }

        const cartItem = new CartItem({
            product,
            productName,
            price,
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
cartRouter.put('/:userId/:cartItemId', async (req, res) => {
    try {
        const { userId, cartItemId } = req.params;
        const { quantity, size, gift } = req.body;

        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItem = user.cart.find(item => item._id.toString() === cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found in this user\'s cart' });
        }

        // Update the properties of the cart item
        if (quantity) {
            cartItem.quantity = quantity;
        }
        if (size) {
            cartItem.size = size;
        }
        if (gift !== undefined) {
            cartItem.gift = gift;
        }

        // Save the parent user document to persist the changes to the subdocument
        await user.save();

        res.json(cartItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete a cart item
cartRouter.delete('/:userId/:cartItemId', async (req, res) => {
    try {
        const { userId, cartItemId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the cart item exists in the user's cart before attempting to remove it
        const cartItemIndex = user.cart.findIndex(item => item._id.toString() === cartItemId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Cart item not found in this user\'s cart' });
        }

        // Remove the cart item from the user's cart array
        user.cart.splice(cartItemIndex, 1);
        await user.save();

        // Delete the cart item from the CartItem collection
        await CartItem.findByIdAndDelete(cartItemId);

        res.json({ message: 'Cart item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default cartRouter;
