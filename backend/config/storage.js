const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

const ensureDb = () => {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ suppliers: [], equipment: [] }, null, 2));
    }
};

const readDb = () => {
    ensureDb();
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        return { suppliers: [], equipment: [] };
    }
};

const writeDb = (data) => {
    ensureDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    getSuppliers: () => readDb().suppliers,
    getEquipment: () => {
        const db = readDb();
        // Simple population logic
        return db.equipment.map(e => ({
            ...e,
            supplierId: db.suppliers.find(s => s._id === e.supplierId) || e.supplierId
        }));
    },
    addSupplier: (supplier) => {
        const db = readDb();
        const newSupplier = { ...supplier, _id: Date.now().toString(), createdAt: new Date() };
        db.suppliers.push(newSupplier);
        writeDb(db);
        return newSupplier;
    },
    addEquipment: (eq) => {
        const db = readDb();
        const newEq = { ...eq, _id: Date.now().toString(), purchaseDate: eq.purchaseDate || new Date() };
        db.equipment.push(newEq);
        writeDb(db);
        return newEq;
    },
    deleteSupplier: (id) => {
        const db = readDb();
        db.suppliers = db.suppliers.filter(s => s._id !== id);
        // Cascading delete: Remove all equipment belonging to this supplier
        db.equipment = db.equipment.filter(e => e.supplierId !== id);
        writeDb(db);
    },
    deleteEquipment: (id) => {
        const db = readDb();
        db.equipment = db.equipment.filter(e => e._id !== id);
        writeDb(db);
    },
    updateSupplier: (id, supplierData) => {
        const db = readDb();
        const index = db.suppliers.findIndex(s => s._id === id);
        if (index !== -1) {
            db.suppliers[index] = { ...db.suppliers[index], ...supplierData, _id: id };
            writeDb(db);
            return db.suppliers[index];
        }
        return null;
    },
    updateEquipment: (id, eqData) => {
        const db = readDb();
        const index = db.equipment.findIndex(e => e._id === id);
        if (index !== -1) {
            db.equipment[index] = { ...db.equipment[index], ...eqData, _id: id };
            writeDb(db);
            return db.equipment[index];
        }
        return null;
    },
    seed: (data) => {
        writeDb(data);
    }
};
