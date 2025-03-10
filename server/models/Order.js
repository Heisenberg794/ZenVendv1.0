const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    items: [{ name: String, quantity: Number }],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'preparing', 'ready', 'picked', 'delivered'],
        default: 'pending',
    },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema); //good