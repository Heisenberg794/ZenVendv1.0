require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Updated to authRoutes
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://zen-vend.vercel.app'], // Replace with Vercel URL after deployment
        methods: ['GET', 'POST', 'PUT'],
    },
});

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://zen-vend.vercel.app'], // Replace with Vercel URL
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Attach Socket.IO to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes); // Updated to authRoutes
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Mock ONDC API endpoint
app.get('/api/ondc/orders', (req, res) => {
    res.json([
        {
            customerName: 'John Doe',
            items: [{ name: 'Burger', quantity: 2 }],
            total: 200,
            status: 'pending',
        },
    ]);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});