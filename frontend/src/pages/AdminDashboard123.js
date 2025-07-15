// src/pages/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { getBooks, getAllBookRequests, getAllUsers } from '../services/BookService';

function AdminDashboard() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalIssued, setTotalIssued] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  
  useEffect(() => {
    getBooks().then(res => setTotalBooks(res.data.length));

    getAllBookRequests().then(res => {
      const requests = res.data;
      const issued = requests.filter(r => r.status === 'Approved').length;
      const pending = requests.filter(r => r.status === 'Pending').length;
      setTotalIssued(issued);
      setPendingRequests(pending);
    });


    getAllUsers().then(res => setActiveUsers(res.data.length)); // Add getAllUsers() in service
  }, []);

  return (
    <div className="container mt-5">
      <h2>📊 Admin Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Books</h5>
              <p className="card-text fs-3">{totalBooks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Books Issued</h5>
              <p className="card-text fs-3">{totalIssued}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Pending Requests</h5>
              <p className="card-text fs-3">{pendingRequests}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-dark mb-3">
            <div className="card-body">
              <h5 className="card-title">Active Users</h5>
              <p className="card-text fs-3">{activeUsers}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
