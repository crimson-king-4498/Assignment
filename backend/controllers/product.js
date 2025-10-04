import express from 'express';
import Product from '../models/product.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    try {
        const { search, sortBy, type, page = 1, limit = 8 } = req.query;

        let query = {};

        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }

        if (type) {
            query.type = { $regex: `^${type}$`, $options: 'i' };
        }

        let sort = {};
        if (sortBy === 'price_asc') {
            sort.price = 1;
        } else if (sortBy === 'price_desc') {
            sort.price = -1;
        }

        const products = await Product.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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

productRouter.delete('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.productId);

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default productRouter;