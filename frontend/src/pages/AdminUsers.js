import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/BookService';
import { Link } from 'react-router-dom';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(res => setUsers(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h2>👥 Registered Users</h2>
      {/* <Link to="/admin/dashboard" className="btn btn-outline-secondary mb-3">← Back to Dashboard</Link> */}
        <Link to="/" className="btn btn-secondary mb-3">← Back to Dashboard</Link>
      
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.username}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
