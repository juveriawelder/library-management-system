import React, { useState, useEffect } from 'react';
import BookList from './pages/BookList';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBorrowedBooks from './pages/MyBorrowedBooks';
import AdminRequests from './pages/AdminRequests';
import RequestHistory from './pages/RequestHistory';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="container mt-3">
        {isLoggedIn && (
          <div className="d-flex justify-content-between mb-3">
            <h5>📛 Role: {role}</h5>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        )}
          {isLoggedIn && role === 'Admin' && (
  <div className="mb-3">
    <a href="/admin/requests" className="btn btn-outline-primary">
      📥 View Book Requests
    </a>
  </div>
)}

        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <BookList role={role} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/mybooks"
            element={isLoggedIn && role === 'Member' ? <MyBorrowedBooks /> : <Navigate to="/login" />}
          />
<Route
  path="/request-history"
  element={isLoggedIn && role === 'Member' ? <RequestHistory /> : <Navigate to="/login" />}
/>


        <Route path="/admin/requests" element={<AdminRequests />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
