import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L'],
        required: true
    },
    gift: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('CartItem', cartItemSchema);
