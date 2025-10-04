import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    size: [{
        type: String,
        enum: ['S', 'M', 'L']
    }],
    type: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product