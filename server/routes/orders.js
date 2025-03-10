const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/Auth');
const Order = require('../models/Order');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const filter = req.user.role === 'vendor' ? { vendor: req.user.id } : { deliveryPerson: req.user.id };
        const orders = await Order.find(filter).populate('vendor deliveryPerson');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id/accept', authMiddleware, async (req, res) => {
    if (req.user.role !== 'vendor') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.vendor.toString() !== req.user.id) return res.status(404).json({ message: 'Order not found' });
        order.status = 'accepted';
        await order.save();
        req.io.emit('orderUpdate', order);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id/assign', authMiddleware, async (req, res) => {
    if (req.user.role !== 'vendor') return res.status(403).json({ message: 'Unauthorized' });
    const { deliveryPersonId } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.vendor.toString() !== req.user.id) return res.status(404).json({ message: 'Order not found' });
        order.deliveryPerson = deliveryPersonId;
        order.status = 'ready';
        await order.save();
        req.io.emit('orderUpdate', order);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
    if (req.user.role !== 'delivery') return res.status(403).json({ message: 'Unauthorized' });
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.deliveryPerson.toString() !== req.user.id) return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        await order.save();
        req.io.emit('orderUpdate', order);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;