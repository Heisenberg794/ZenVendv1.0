const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['vendor', 'delivery'], default: 'vendor' },
});

module.exports = mongoose.model('User', userSchema);