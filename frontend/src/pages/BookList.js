import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback } from 'react';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  returnBook,
  getMyIssuedBooks
} from '../services/BookService';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BookList() {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issuedBookIds, setIssuedBookIds] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [requestStatuses, setRequestStatuses] = useState({});
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    quantity: '',
    imageName: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchBooks = useCallback(() => {
    getBooks()
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  const fetchIssuedBooks = useCallback(() => {
    getMyIssuedBooks(username)
      .then(res => {
        const ids = res.data.map(b => b.bookId);
        setIssuedBookIds(ids);
        setIssuedBooks(res.data);
      })
      .catch(err => console.log(err));
  }, [username]);

  const fetchMyRequests = useCallback(() => {
    axios
      .get(`https://localhost:7205/api/BookRequests/user/${username}`)
      .then(res => {
        const requests = res.data.map(r => ({ bookId: r.bookId, status: r.status }));
        setMyRequests(requests);

        // ✅ Update local statuses for quick access
        const statusMap = {};
        requests.forEach(r => {
          statusMap[r.bookId] = r.status;
        });
        setRequestStatuses(statusMap);
      })
      .catch(err => console.log(err));
  }, [username]);

  useEffect(() => {
    fetchBooks();
    if (role === 'Member') {
      fetchIssuedBooks();
      fetchMyRequests();
    }
  }, [role, fetchBooks, fetchIssuedBooks, fetchMyRequests]);

  const uploadImage = async () => {
    if (!selectedImage) return '';
    const formData = new FormData();
    formData.append('file', selectedImage);
    const response = await axios.post('https://localhost:7205/api/Books/upload', formData);
    return response.data.fileName;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageName = formData.imageName;
      if (selectedImage) {
        imageName = await uploadImage();
      }
      const finalData = { ...formData, imageName };
      const action = isEditing ? updateBook(editId, finalData) : addBook(finalData);
      await action;
      fetchBooks();
      setFormData({ title: '', author: '', category: '', quantity: '', imageName: '' });
      setSelectedImage(null);
      setIsEditing(false);
      setMessage(isEditing ? 'Book updated successfully!' : 'Book added successfully!');
    } catch (err) {
      console.error('Add/Update failed:', err);
      setMessage('Something went wrong.');
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setIsEditing(true);
    setEditId(book.id);
  };

  const handleDelete = (id) => {
    deleteBook(id)
      .then(() => {
        fetchBooks();
        setMessage('Book deleted.');
      })
      .catch(() => setMessage('Delete failed.'));
  };

  const handleRequestSubmit = async (bookId, bookTitle) => {
    try {
      await axios.post('https://localhost:7205/api/BookRequests', {
        bookId,
        bookTitle,
        username
      });

      // ✅ Immediately update UI
      setRequestStatuses(prev => ({
        ...prev,
        [bookId]: 'Pending'
      }));

      await fetchMyRequests(); // sync with backend
      setMessage('Request submitted for approval!');
    } catch (err) {
      console.error('Request failed:', err);
      setMessage('Failed to submit request.');
    }
  };

const handleReturn = (bookId) => {
  returnBook(bookId, username)
    .then(() => {
      fetchBooks();
      fetchIssuedBooks(); // ✅ updates issuedBookIds

      // ✅ remove request status locally so button goes back to "Request"
      setRequestStatuses(prev => {
        const updated = { ...prev };
        delete updated[bookId]; // 🔑 remove book from local statuses
        return updated;
      });

      setMessage('Book returned successfully!');
    })
    .catch(() => setMessage('Return failed.'));
};


  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const getRequestStatus = (bookId) => {
    return requestStatuses[bookId] || null;
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📚 Library Management</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {role === 'Admin' && (
        <>
          <form className="mb-4" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-2">
              <div className="col"><input className="form-control" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required /></div>
              <div className="col"><input className="form-control" name="author" value={formData.author} onChange={handleChange} placeholder="Author" required /></div>
              <div className="col"><input className="form-control" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required /></div>
              <div className="col"><input className="form-control" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required type="number" /></div>
              <div className="col"><input className="form-control" type="file" onChange={handleImageChange} accept="image/*" /></div>
              <div className="col-auto">
                <button className={`btn ${isEditing ? 'btn-warning' : 'btn-success'}`} type="submit">
                  {isEditing ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </div>
          </form>

          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? filteredBooks.map(book => (
                <tr key={book.id}>
                  <td>
                    <img
                      src={`https://localhost:7205/Images/Books/${book.imageName}`}
                      alt={book.title}
                      style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(book)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center">No books found.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {role === 'Member' && (
        <>
          <div className="d-flex justify-content-between mb-3">
            <Link to="/request-history" className="btn btn-outline-primary">📄 View Request History</Link>
          </div>

          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredBooks.map(book => {
              const isIssued = issuedBookIds.includes(book.id);
              const requestStatus = getRequestStatus(book.id);

              return (
                <div key={book.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`https://localhost:7205/Images/Books/${book.imageName}`}
                      alt={book.title}
                      className="card-img-top"
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="card-text text-muted">by {book.author}</p>
                      <p className="card-text">📦 Available: {book.quantity}</p>

               {issuedBookIds.includes(book.id) ? (
  <button className="btn btn-danger w-100" onClick={() => handleReturn(book.id)}>Return</button>
) : requestStatus === 'Pending' ? (
  <button className="btn btn-secondary w-100" disabled>Requested</button>
) : (
  <button
    className="btn btn-primary w-100"
    disabled={book.quantity < 1}
    onClick={() => handleRequestSubmit(book.id, book.title)}
  >
    Request
  </button>
)}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default BookList;
