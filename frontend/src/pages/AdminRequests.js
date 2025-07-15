import React, { useEffect, useState } from 'react';
import { getAllBookRequests, updateBookRequestStatus } from '../services/BookService';
import { Link } from 'react-router-dom';
import axios from 'axios';


function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  const fetchRequests = () => {
    getAllBookRequests()
      .then(res => setRequests(res.data))
      .catch(err => console.log(err));
  };

  const handleAction = (id, status) => {
    updateBookRequestStatus(id, status)
      .then(() => {
        setMessage(`Request ${status}.`);
        fetchRequests();
      })
      .catch(() => setMessage('Action failed.'));
  };
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this request?")) {
    try {
      await axios.delete(`https://localhost:7205/api/BookRequests/${id}`);
      console.log("Deleting request with ID:", id);
// Refresh request list after deletion
      fetchRequests(); // or manually remove from state
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request.");
    }
  }
};

const handleClearRejected = async () => {
  if (window.confirm("Are you sure you want to delete all rejected requests?")) {
    try {
      await axios.delete('https://localhost:7205/api/BookRequests/clear-rejected');
      fetchRequests();
      setMessage("All rejected requests cleared.");
    } catch (error) {
      console.error("Error clearing rejected requests:", error);
      alert("Failed to clear rejected requests.");
    }
  }
};

useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mt-5">
     {/* <a href="/" className="btn btn-secondary mb-3">🏠 Back to Book List</a>  */}
     
<div className="d-flex justify-content-between align-items-center mt-3 mb-3">
  <Link to="/" className="btn btn-secondary">← Back to Dashboard</Link>
  <button className="btn btn-warning" onClick={handleClearRejected}>🧹 Clear All Rejected</button>
</div>

      <h2>📋 Book Requests</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
  <tr>
    <th>Username</th>
    <th>Book Title</th>
    <th>Status</th>
    <th>Requested On</th>
    <th>Returned On</th> {/* NEW */}
    <th>Actions</th>
  </tr>
</thead>

        <tbody>
  {requests.map(req => (
    <tr key={req.id}>
      <td>{req.username}</td>
      <td>{req.bookTitle}</td>
      <td>{req.status}</td>
      <td>{new Date(req.requestDate).toLocaleString()}</td>
     <td>
  {req.status === 'Approved' ? (
    req.returnDate
      ? new Date(req.returnDate).toLocaleString()
      : <span className="text-danger fw-bold">Not Returned</span>
  ) : (
    <span className="text-muted">—</span>
  )}
</td>

    <td>
  {req.status === 'Pending' ? (
    <>
      <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(req.id, 'Approved')}>Approve</button>
      <button className="btn btn-danger btn-sm" onClick={() => handleAction(req.id, 'Rejected')}>Reject</button>
    </>
  ) : (
    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(req.id)}>
      Delete
    </button>
  )}
</td>

    

    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}

export default AdminRequests;
