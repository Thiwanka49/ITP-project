import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddSupplier from '../components/addSupplier';
import ViewAllSuppliers from '../components/viewAllSuppliers';
import ViewSupplier from '../components/viewSupplier';
import UpdateSupplier from '../components/updateSupplier';
import SupplierReport from '../components/SupplierReport'; // Import SupplierReport
import Header from './Header';
import Footer from './Footer';
import Home from './Home';

const AppRouter = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddSupplier />} />
        <Route path="/view-all" element={<ViewAllSuppliers />} />
        <Route path="/view/:id" element={<ViewSupplier />} />
        <Route path="/update/:id" element={<UpdateSupplier />} />
        <Route path="/supplier-report" element={<SupplierReport />} /> {/* Add route for SupplierReport */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;