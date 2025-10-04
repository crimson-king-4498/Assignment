import express from 'express';
import Product from '../models/product.js';

const productRouter = express.Router();

// Get all products
productRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
productRouter.post('/', async (req, res) => {
    try {
        const { product, price, image, size, type } = req.body;

        const newProduct = new Product({
            product,
            price,
            image,
            size,
            type
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product
productRouter.delete('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default productRouter;