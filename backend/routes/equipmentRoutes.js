const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
const storage = require('../config/storage');

// Get all equipment
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, using local storage for equipment');
            return res.json(storage.getEquipment());
        }
        const equipment = await Equipment.find().populate('supplierId').sort({ purchaseDate: -1 });
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add equipment
router.post('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const newEq = storage.addEquipment(req.body);
            return res.status(201).json(newEq);
        }
        const equipment = new Equipment({
            name: req.body.name,
            category: req.body.category,
            supplierId: req.body.supplierId,
            quantity: req.body.quantity,
            price: req.body.price,
            status: req.body.status,
            purchaseDate: req.body.purchaseDate
        });
        const newEquipment = await equipment.save();
        res.status(201).json(newEquipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            storage.deleteEquipment(req.params.id);
            return res.json({ message: 'Equipment deleted from local storage' });
        }
        const equipment = await Equipment.findById(req.params.id);
        if (equipment) {
            await equipment.deleteOne();
            res.json({ message: 'Equipment deleted' });
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update equipment
router.put('/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const updated = storage.updateEquipment(req.params.id, req.body);
            if (updated) return res.json(updated);
            return res.status(404).json({ message: 'Equipment not found' });
        }
        const equipment = await Equipment.findById(req.params.id);
        if (equipment) {
            Object.assign(equipment, req.body);
            const updatedEquipment = await equipment.save();
            res.json(updatedEquipment);
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
