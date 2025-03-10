const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Inventory = require('./models/Inventory');
const { Server } = require('socket.io');
const cors = require('cors');

router.get('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'vendor') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const inventory = await Inventory.find({ vendor: req.user.id });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'vendor') return res.status(403).json({ message: 'Unauthorized' });
    const { name, quantity } = req.body;
    try {
        let item = await Inventory.findOne({ name, vendor: req.user.id });
        if (item) {
            item.quantity += quantity;
        } else {
            item = new Inventory({ name, quantity, vendor: req.user.id });
        }
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;