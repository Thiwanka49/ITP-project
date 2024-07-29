import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';


const AddSupplier = () => {
  const [equipmentType, setEquipmentType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (quantity && price) {
      const calculatedTotalPrice = Number(quantity) * Number(price);
      setTotalPrice(calculatedTotalPrice.toString());
    } else {
      setTotalPrice('');
    }
  }, [quantity, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/suppliers', {
        equipmentType,
        quantity,
        price,
        totalPrice,
        status: 'accepted',
      });
      console.log(response.data);
      setAlertMessage('Supplier added successfully!');
      setTimeout(() => {
        setAlertMessage(null);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error adding supplier:', error.message);
      setAlertMessage('Error adding supplier');
    }
  };

  return (
    <div className="container" style={{ marginBottom: '250px', marginTop: '25px' }}>
      <h2>Add Supplier</h2>
      {alertMessage && (
        <Alert variant={alertMessage.includes('Error') ? 'danger' : 'success'} style={{ marginBottom: '15px' }}>
          {alertMessage}
        </Alert>
      )}
      <Card style={{ width: '400px', margin: 'auto', padding: '20px' }}>
        <Card.Body>
          <Card.Img
            variant="top"
            src={Image.webp}
            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
          />
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="equipmentType">
              <Form.Label>Equipment Type</Form.Label>
              <Form.Control
                as="select"
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
              >
                <option value="">Select Equipment Type</option>
                <option value="Treadmill">Treadmill</option>
                <option value="Exercise Bike">Exercise Bike</option>
                <option value="Dumbbells">Dumbbells</option>
                {/* Add more options as needed */}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="totalPrice">
              <Form.Label>Total Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Total Price"
                value={totalPrice}
                readOnly // Make it read-only since it's calculated
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: '25px' }}>
              Add Supplier
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddSupplier;