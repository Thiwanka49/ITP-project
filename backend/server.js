require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const supplierRoutes = require('./routes/supplierRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/equipment', equipmentRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Fitplex Gym Management System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
