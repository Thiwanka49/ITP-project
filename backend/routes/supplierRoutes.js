const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Supplier = require('../models/Supplier');
const storage = require('../config/storage');

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, using local storage for suppliers');
            return res.json(storage.getSuppliers());
        }
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a supplier
router.post('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const newSupplier = storage.addSupplier(req.body);
            return res.status(201).json(newSupplier);
        }
        const supplier = new Supplier({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
        });
        const newSupplier = await supplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            storage.deleteSupplier(req.params.id);
            return res.json({ message: 'Supplier deleted from local storage' });
        }
        const supplier = await Supplier.findById(req.params.id);
        if (supplier) {
            await supplier.deleteOne();
            res.json({ message: 'Supplier deleted' });
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a supplier
router.put('/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const updated = storage.updateSupplier(req.params.id, req.body);
            if (updated) return res.json(updated);
            return res.status(404).json({ message: 'Supplier not found' });
        }
        const supplier = await Supplier.findById(req.params.id);
        if (supplier) {
            Object.assign(supplier, req.body);
            const updatedSupplier = await supplier.save();
            res.json(updatedSupplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
