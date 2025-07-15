import axios from 'axios';

const API_BASE = 'https://localhost:7205/api';

// 📚 Book APIs
export const getBooks = () => axios.get(`${API_BASE}/Books`);
export const addBook = (book) => axios.post(`${API_BASE}/Books`, book);
export const updateBook = (id, book) => axios.put(`${API_BASE}/Books/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_BASE}/Books/${id}`);

// 📦 Book Request & Issue APIs
export const requestBook = (bookId, username) =>
  axios.post(`${API_BASE}/Issue/request`, { bookId, username });

export const returnBook = (bookId, username) =>
  axios.post(`${API_BASE}/BookRequests/return`, {
    BookId: bookId,
    Username: username
  });

export const getMyIssuedBooks = (username) =>
  axios.get(`${API_BASE}/Issue/mybooks?username=${username}`);

export const getAllBookRequests = () =>
  axios.get(`${API_BASE}/BookRequests`);

export const updateBookRequestStatus = (id, status) =>
  axios.put(`${API_BASE}/BookRequests/${id}`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  });

export const getMyBookRequests = (username) =>
  axios.get(`${API_BASE}/BookRequests/user?username=${username}`);

// 👥 User API
export const getAllUsers = () =>
  axios.get(`${API_BASE}/Auth/users`);
