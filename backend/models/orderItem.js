import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productName: {
        type: String,
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
    }
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;