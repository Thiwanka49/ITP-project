require('dotenv').config();
const mongoose = require('mongoose');
const Supplier = require('./models/Supplier');
const Equipment = require('./models/Equipment');
const storage = require('./config/storage');

const seedData = async () => {
    console.log('Starting seeding process...');

    const suppliersData = [
        { name: 'FitPro Equipment', email: 'contact@fitpro.com', phone: '+1 555-0101', address: '123 Fitness Ave, LA' },
        { name: 'Iron Works Ltd', email: 'sales@ironworks.com', phone: '+1 555-0102', address: '456 Gym Street, NY' },
        { name: 'CardioMax Supply', email: 'info@cardiomax.com', phone: '+1 555-0103', address: '789 Health Blvd, TX' },
    ];

    try {
        // Try connecting to MongoDB with a short timeout
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to MongoDB. Seeding database...');

        await Supplier.deleteMany({});
        await Equipment.deleteMany({});

        const suppliers = await Supplier.insertMany(suppliersData);

        const equipmentData = [
            { name: 'Commercial Treadmill X500', category: 'Cardio', supplierId: suppliers[2]._id, quantity: 5, price: 3500, status: 'available' },
            { name: 'Olympic Barbell Set', category: 'Free Weights', supplierId: suppliers[1]._id, quantity: 10, price: 450, status: 'available' },
            { name: 'Cable Crossover Machine', category: 'Strength', supplierId: suppliers[0]._id, quantity: 2, price: 5200, status: 'maintenance' },
            { name: 'Stationary Bike Pro', category: 'Cardio', supplierId: suppliers[2]._id, quantity: 8, price: 1200, status: 'available' },
            { name: 'Power Rack Elite', category: 'Strength', supplierId: suppliers[1]._id, quantity: 3, price: 2800, status: 'available' },
            { name: 'Dumbbell Set (5-50 lbs)', category: 'Free Weights', supplierId: suppliers[1]._id, quantity: 0, price: 1800, status: 'out-of-stock' },
        ];

        await Equipment.insertMany(equipmentData);
        console.log('MongoDB Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.log('MongoDB not reachable. Seeding to local JSON storage instead...');

        // Fallback to JSON
        const suppliers = suppliersData.map((s, i) => ({ ...s, _id: `s${i}`, createdAt: new Date() }));
        const equipment = [
            { name: 'Commercial Treadmill X500', category: 'Cardio', supplierId: 's2', quantity: 5, price: 3500, status: 'available', _id: 'e1', purchaseDate: new Date() },
            { name: 'Olympic Barbell Set', category: 'Free Weights', supplierId: 's1', quantity: 10, price: 450, status: 'available', _id: 'e2', purchaseDate: new Date() },
            { name: 'Cable Crossover Machine', category: 'Strength', supplierId: 's0', quantity: 2, price: 5200, status: 'maintenance', _id: 'e3', purchaseDate: new Date() },
            { name: 'Stationary Bike Pro', category: 'Cardio', supplierId: 's2', quantity: 8, price: 1200, status: 'available', _id: 'e4', purchaseDate: new Date() },
            { name: 'Power Rack Elite', category: 'Strength', supplierId: 's1', quantity: 3, price: 2800, status: 'available', _id: 'e5', purchaseDate: new Date() },
            { name: 'Dumbbell Set (5-50 lbs)', category: 'Free Weights', supplierId: 's1', quantity: 0, price: 1800, status: 'out-of-stock', _id: 'e6', purchaseDate: new Date() },
        ];

        storage.seed({ suppliers, equipment });
        console.log('Local JSON Seeding completed successfully');
        process.exit();
    }
};

seedData();
