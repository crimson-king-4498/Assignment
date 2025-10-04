
import express from 'express';
import Product from '../models/product.js';

const productRouter = express.Router();

// Get all products with search, sort and filter functionality
productRouter.get('/', async (req, res) => {
    try {
        const { search, sortBy, type } = req.query;
        let query = {};

        if (search) {
            query.product = { $regex: search, $options: 'i' };
        }

        if (type) {
            query.type = type;
        }

        let sort = {};
        if (sortBy === 'price_asc') {
            sort.price = 1;
        } else if (sortBy === 'price_desc') {
            sort.price = -1;
        }

        const products = await Product.find(query).sort(sort);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
productRouter.post('/', async (req, res) => {
    try {
        const { productName, price, image, size, type } = req.body;

        const newProduct = new Product({
            productName,
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
