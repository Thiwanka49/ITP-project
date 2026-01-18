const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
        type: String,
        enum: ['available', 'maintenance', 'out-of-stock'],
        default: 'available'
    },
    purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
