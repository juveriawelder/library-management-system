import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Member'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //axios.post('https://localhost:7205/api/Auth/register', formData)
    api.post('/api/Auth/register', formData)
      .then(() => {
        setMessage('Registration successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(() => setError('Username already exists.'));
  };

  return (
    <div className="register-page d-flex flex-column flex-md-row">
      {/* Left Side – Form */}
      <div className="form-side p-5 d-flex flex-column justify-content-center">
        <h1 className="mb-4 text-center text-success fw-bold">📚 Library Registration</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>👤 Username</label>
            <input className="form-control" name="username" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>🔒 Password</label>
            <input type="password" className="form-control" name="password" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>👥 Role</label>
            <select className="form-select" name="role" onChange={handleChange}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button className="btn btn-success w-100">Register</button>
        </form>
        <div className="mt-3 text-center">
          Already registered?{' '}
          <span className="text-primary fw-semibold link" onClick={() => navigate('/login')}>
            Login here
          </span>
        </div>
      </div>

      {/* Right Side – Image */}
      <div className="image-side d-none d-md-block">
        <img src="/images/library-bg.jpg" alt="Library" className="img-fluid" />
      </div>
    </div>
  );
}

export default Register;
