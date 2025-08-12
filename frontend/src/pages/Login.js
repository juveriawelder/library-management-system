import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Only send username and password (NO role)
    // axios.post('https://localhost:7205/api/Auth/login', {
    //   username: formData.username,
    //   password: formData.password
    // })
    api.post('/api/Auth/login', { username : formData.username, password :formData.password })
.then(res => {
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('role', res.data.role);
  localStorage.setItem('username', formData.username); // ✅ Add this
  onLogin();
  navigate('/');
})


    .catch(() => setError('Invalid username or password.'));
  };

  return (
    <div className="login-page d-flex flex-column flex-md-row">
      {/* Left Side – Login Form */}
      <div className="form-side p-5 d-flex flex-column justify-content-center">
        <h3 className="mb-4 text-center text-primary fw-bold">Library Management System</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">👤 Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">🔒 Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-center">
          New user?{' '}
          <span
            className="text-primary fw-semibold link"
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </div>
      </div>

      {/* Right Side – Image */}
      <div className="image-side d-none d-md-block">
<img src={`${process.env.PUBLIC_URL}/images/library-bg.jpg`} alt="Library" className="img-fluid" />
      </div>
    </div>
  );
}

export default Login;
