require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
        methods: ['GET', 'POST', 'PUT'],
    },
});

app.use(cors({
    origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
}));
app.use(express.json());
connectDB();

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/api/ondc/orders', (req, res) => {
    res.json([{ customerName: 'John Doe', items: [{ name: 'Burger', quantity: 2 }], total: 200, status: 'pending' }]);
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));