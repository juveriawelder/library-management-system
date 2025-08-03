import React, { useState, useEffect } from 'react';
import BookList from './pages/BookList';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBorrowedBooks from './pages/MyBorrowedBooks';
import AdminRequests from './pages/AdminRequests';
import RequestHistory from './pages/RequestHistory';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


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
<BrowserRouter basename={process.env.PUBLIC_URL}>
{/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <span className="navbar-brand fw-bold">📚 Library Management System</span>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
      {isLoggedIn && (
        <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
          <li className="nav-item me-3">
            <span className="nav-link">📛 Role: {role}</span>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  </div>
</nav> */}
  <Navbar isLoggedIn={isLoggedIn} role={role} handleLogout={handleLogout} />
      <Routes>
      <Route path="/" element={isLoggedIn ? <BookList role={role} /> : <Navigate to="/login" />}/>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-borrowed" element={<MyBorrowedBooks />} />
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/request-history" element={isLoggedIn && role === 'Member' ? <RequestHistory /> : <Navigate to="/login" />}/>
      <Route path="/mybooks" element={isLoggedIn && role === 'Member' ? <MyBorrowedBooks /> : <Navigate to="/login" />} />
      <Route path="/admin/requests" element={<AdminRequests />} />
      {/* <Route path="/admin/dashboard" element={isLoggedIn && role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />}/>  */}
      <Route path="/admin/users" element={isLoggedIn && role === 'Admin' ? <AdminUsers /> : <Navigate to="/" />}/> 
      <Route path="*" element={<Navigate to="/" />} />

</Routes>
      
</BrowserRouter>
  );
}

export default App;
