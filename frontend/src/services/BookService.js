// import axios from 'axios';

// const API_BASE = 'https://localhost:7205/api';

// // 📚 Book APIs
// export const getBooks = () => axios.get(`${API_BASE}/Books`);
// export const addBook = (book) => axios.post(`${API_BASE}/Books`, book);
// export const updateBook = (id, book) => axios.put(`${API_BASE}/Books/${id}`, book);
// export const deleteBook = (id) => axios.delete(`${API_BASE}/Books/${id}`);

// // 📦 Book Request & Issue APIs
// export const requestBook = (bookId, username) =>
//   axios.post(`${API_BASE}/Issue/request`, { bookId, username });

// export const returnBook = (bookId, username) =>
//   axios.post(`${API_BASE}/BookRequests/return`, {
//     BookId: bookId,
//     Username: username
//   });

// export const getMyIssuedBooks = (username) =>
//   axios.get(`${API_BASE}/Issue/mybooks?username=${username}`);

// export const getAllBookRequests = () =>
//   axios.get(`${API_BASE}/BookRequests`);

// export const updateBookRequestStatus = (id, status) =>
//   axios.put(`${API_BASE}/BookRequests/${id}`, JSON.stringify(status), {
//     headers: { 'Content-Type': 'application/json' }
//   });

// export const getMyBookRequests = (username) =>
//   axios.get(`${API_BASE}/BookRequests/user?username=${username}`);

// // 👥 User API
// export const getAllUsers = () =>
//   axios.get(`${API_BASE}/Auth/users`);
import api from "./api";

const IMG_BASE = process.env.REACT_APP_IMAGE_BASE_URL
  || "http://localhost:7205/Images/Books";

export const imageUrl = (name) => `${IMG_BASE}/${name}`;

// Books
export const getBooks = () => api.get("/api/Books");
export const addBook = (book) => api.post("/api/Books", book);
export const updateBook = (id, book) => api.put(`/api/Books/${id}`, book);
export const deleteBook = (id) => api.delete(`/api/Books/${id}`);

// Requests & Issue
export const requestBook = (bookId, username) =>
  api.post("/api/Issue/request", { bookId, username });

export const returnBook = (bookId, username) =>
  api.post("/api/BookRequests/return", { BookId: bookId, Username: username });

export const getMyIssuedBooks = (username) =>
  api.get(`/api/Issue/mybooks?username=${username}`);

export const getAllBookRequests = () => api.get("/api/BookRequests");
export const updateBookRequestStatus = (id, status) =>
  api.put(`/api/BookRequests/${id}`, JSON.stringify(status), {
    headers: { "Content-Type": "application/json" },
  });

export const getMyBookRequests = (username) =>
  api.get(`/api/BookRequests/user/${username}`);

// Users
export const getAllUsers = () => api.get("/api/Auth/users");
