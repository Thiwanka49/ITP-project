import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Badge, Row, Col } from 'react-bootstrap'; // Import Badge component for status


const ViewSupplier = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
        setSupplier(response.data);
      } catch (error) {
        console.error('Error fetching supplier:', error.message);
      }
    };
    fetchSupplier();
  }, [id]);

  return (
    <div style={{ padding: '20px', marginTop: '20px', marginBottom: "170px" }}>
      <h2>Supplier Details</h2>
      {supplier ? (
        <Card style={{ marginTop: '20px' }}>
          <Card.Img variant="top" src={Image.webp} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
          <Card.Body>
            <Card.Title>{supplier.equipmentType}</Card.Title>
            <Row>
              <Col xs={6} md={4}><strong>Quantity:</strong></Col>
              <Col xs={6} md={8}>{supplier.quantity}</Col>
            </Row>
            <Row>
              <Col xs={6} md={4}><strong>Price:</strong></Col>
              <Col xs={6} md={8}>{supplier.price}</Col>
            </Row>
            <Row>
              <Col xs={6} md={4}><strong>Total Price:</strong></Col>
              <Col xs={6} md={8}>{supplier.totalPrice}</Col>
            </Row>
            <Row>
              <Col xs={6} md={4}><strong>Status:</strong></Col>
              <Col xs={6} md={8}>
                <Badge variant={supplier.status === 'accepted' ? 'success' : 'danger'}>
                  {supplier.status}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewSupplier;