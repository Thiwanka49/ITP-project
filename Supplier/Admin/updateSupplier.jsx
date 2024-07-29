import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';  
import { Card, Form, Button } from 'react-bootstrap';


const UpdateSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();  
  const [supplier, setSupplier] = useState({});
  const [equipmentType, setEquipmentType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [status, setStatus] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
        setSupplier(response.data);
        setEquipmentType(response.data.equipmentType);
        setQuantity(response.data.quantity);
        setPrice(response.data.price);
        setTotalPrice(response.data.totalPrice);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching supplier:', error.message);
        setAlertMessage('Error fetching supplier');
      }
    };
    fetchSupplier();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate total price
      const calculatedTotalPrice = Number(quantity) * Number(price);
      const response = await axios.patch(`http://localhost:5000/api/suppliers/${id}`, {
        equipmentType,
        quantity,
        price,
        totalPrice: calculatedTotalPrice,
        status,
      });
      console.log(response.data);
      setAlertMessage('Supplier updated successfully!');
      setTimeout(() => {
        setAlertMessage('');
        navigate('/view-all');  
      }, 2000);  
    } catch (error) {
      console.error('Error updating supplier:', error.message);
      setAlertMessage('Error updating supplier');
    }
  };

  return (
    <div className="container" style={{ marginBottom: "250px", marginTop: "25px" }}>
      <h2>Update Supplier</h2>
      {alertMessage && (
        <div className="alert alert-success" role="alert">
          {alertMessage}
        </div>
      )}
      <Card style={{ width: '400px', margin: 'auto', padding: '20px' }}>
        <Card.Body>
          <Card.Img variant="top" />
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="equipmentType">
              <Form.Label>Equipment Type</Form.Label>
              <Form.Control as="select" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
                <option value="">Select Equipment Type</option>
                <option value="Treadmill">Treadmill</option>
                <option value="Exercise Bike">Exercise Bike</option>
                <option value="Dumbbells">Dumbbells</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="quality">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="text" placeholder="Enter Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="text" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="totalPrice">
              <Form.Label>Total Price</Form.Label>
              <Form.Control type="text" placeholder="Total Price" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} readOnly />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: "25px" }}>
              Update Supplier
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateSupplier;