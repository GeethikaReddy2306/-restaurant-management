require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { init: initSocket } = require('./config/socket');

// Route imports
const authRoutes = require('./routes/auth');
const tableRoutes = require('./routes/tables');
const reservationRoutes = require('./routes/reservations');
const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');
const advertisementRoutes = require('./routes/advertisements');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/advertisements', advertisementRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
