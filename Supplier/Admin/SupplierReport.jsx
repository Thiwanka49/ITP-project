import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';

const SupplierReport = () => {
  const [suppliers, setSuppliers] = useState([]);
  const componentRef = useRef();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error.message);
        // You can add code to show an error message to the user
      }
    };
    fetchSuppliers();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div style={{marginBottom: "470px", marginTop: "25px"}}>
      <h2>Supplier Report</h2>
      <div ref={componentRef}>
        <Table striped bordered hover responsive>
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
            {suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td>{supplier.equipmentType}</td>
              <td>{supplier.quantity}</td>
              <td>{supplier.price}</td>
              <td>{supplier.totalPrice}</td>
              <td>{supplier.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="button-container">
        <Button onClick={handlePrint}>Download as PDF</Button>
      </div>
    </div>
  );
};

export default SupplierReport;