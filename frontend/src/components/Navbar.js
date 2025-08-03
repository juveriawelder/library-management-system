// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, role, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">📚 Library Management System</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          {isLoggedIn && (
            <ul className="navbar-nav mb-2 mb-lg-0">
              {role === 'admin' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/admin-users">Users</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/admin-requests">Requests</Link></li>
                </>
              )}
              {role === 'member' && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/">Books</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/my-borrowed">My Books</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/request-history">History</Link></li>
                </>
              )}
              <li className="nav-item">
                <button className="btn btn-outline-light ms-3" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
