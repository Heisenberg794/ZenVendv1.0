const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Inventory', inventorySchema);