import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div className="container mt-5" style={{marginBottom: "280px"}}>
      <h1>Welcome to Supplier Management System</h1>
      <p>
        This is a system to manage suppliers. You can view, update, and delete supplier details from this system.
      </p>
      <p>
        To get started, you can navigate to the <strong>All Suppliers</strong> page to see the list of suppliers.
      </p>
      <div className="row mt-4">
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>View All Suppliers</Card.Title>
              <Card.Text>
                Click below to view all suppliers in the system.
              </Card.Text>
              <Link to="/view-all">
                <Button variant="primary">View All Suppliers</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Add New Supplier</Card.Title>
              <Card.Text>
                Click below to add a new supplier to the system.
              </Card.Text>
              <Link to="/add">
                <Button variant="success">Add Supplier</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4 mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Generate Report</Card.Title>
              <Card.Text>
                Click below to generate a report for suppliers.
              </Card.Text>
              <Link to="/supplier-report">
                <Button variant="info">Generate Report</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;