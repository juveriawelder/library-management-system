// pages/RequestHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import api from '../services/api';


function RequestHistory() {
  const username = localStorage.getItem('username');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
   // axios.get(`https://localhost:7205/api/BookRequests/user/${username}`)- axios.get(`https://localhost:7205/api/BookRequests/user/${username}`)
    api.get(`/api/BookRequests/user/${username}`)

      .then(res => setRequests(res.data))
      .catch(err => console.error('Failed to load history', err));
  }, [username]);

  return (
    
    <div className="container mt-5">
      <h3>📑 My Book Requests</h3>
      <Link to="/" className="btn btn-outline-secondary mb-3">🔙 Back to Main Page</Link>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Book Title</th>
            <th>Status</th>
            <th>Requested Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map(r => (
              <tr key={r.id}>
                <td>{r.bookTitle}</td>
                <td>
                  <span className={`badge bg-${r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'danger' : 'secondary'}`}>
                    {r.status}
                  </span>
                </td>
                <td>{new Date(r.requestDate).toLocaleString()}</td>

              </tr>
            ))
          ) : (
            <tr><td colSpan="3" className="text-center">No requests found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RequestHistory;
