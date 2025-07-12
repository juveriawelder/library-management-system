import React, { useEffect, useState } from 'react';
import { getAllBookRequests, updateBookRequestStatus } from '../services/BookService';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mt-5">
     {/* <a href="/" className="btn btn-secondary mb-3">🏠 Back to Book List</a>  */}
      <Link to="/" className="btn btn-secondary mt-3">← Back to Book List</Link>

      <h2>📋 Book Requests</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Book Title</th>
            <th>Status</th>
            <th>Requested On</th>
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
                {req.status === 'Pending' ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(req.id, 'Approved')}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleAction(req.id, 'Rejected')}>Reject</button>
                  </>
                ) : (
                  <span className="text-muted">No action</span>
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
