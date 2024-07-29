import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Form, FormControl, Button, Alert } from 'react-bootstrap'; // Import Alert from React Bootstrap

const ViewAllSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState(null); // Add alertMessage state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/suppliers');
        setSuppliers(response.data);
        setFilteredSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error.message);
        // You can add code to show an error message to the user
      }
    };
    fetchSuppliers();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
      setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
      setFilteredSuppliers(filteredSuppliers.filter((supplier) => supplier._id !== id));
      setAlertMessage('Supplier deleted successfully!'); // Set success message
      setTimeout(() => {
        setAlertMessage(null); // Clear alert message after 3 seconds
      }, 3000); // Clear alert after 3 seconds
      console.log('Supplier deleted:', id);
    } catch (error) {
      console.error('Error deleting supplier:', error.message);
      setAlertMessage('Error deleting supplier'); // Set error message
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.equipmentType.toLowerCase().includes(searchTerm) ||
        supplier.quantity.toLowerCase().includes(searchTerm) ||
        supplier.price.toLowerCase().includes(searchTerm) ||
        supplier.totalPrice.toLowerCase().includes(searchTerm) ||
        supplier.status.toLowerCase().includes(searchTerm)
    );
    setFilteredSuppliers(filtered);
  };

  return (
    <div style={{ marginBottom: '470px', marginTop: '25px' }}>
      <h2>All Suppliers</h2>
      {alertMessage && (
        <Alert variant={alertMessage.includes('Error') ? 'danger' : 'success'} style={{ marginBottom: '15px' }}>
          {alertMessage}
        </Alert>
      )}
      <Form inline className="mb-2">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" value={searchTerm} onChange={handleSearch} />
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Equipment Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.equipmentType}</td>
              <td>{supplier.quantity}</td>
              <td>{supplier.price}</td>
              <td>{supplier.totalPrice}</td>
              <td>{supplier.status}</td>
              <td>
                <Button variant="info" onClick={() => handleUpdate(supplier._id)} style={{ marginRight: '25px' }}>
                  Update
                </Button>
                <Button variant="success" onClick={() => handleView(supplier._id)} style={{ marginRight: '25px' }}>
                  View
                </Button>
                <Button variant="danger" onClick={() => handleDelete(supplier._id)} style={{ marginRight: '25px' }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViewAllSuppliers;