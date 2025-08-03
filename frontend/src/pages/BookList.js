// src/pages/BookList.js

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  returnBook,
  getMyIssuedBooks,
  getAllBookRequests,
  getAllUsers
} from '../services/BookService';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react'; // 👈 New
import { useNavigate } from 'react-router-dom';


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function BookList() {
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issuedBookIds, setIssuedBookIds] = useState([]);
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
  const [totalIssued, setTotalIssued] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [requestChartData, setRequestChartData] = useState(undefined);
  const [issuedBooksChartData, setIssuedBooksChartData] = useState(undefined);
  const bookTableRef = useRef(null);
  const location = useLocation();
  
const navigate = useNavigate();
const goToBooksTable = () => navigate('/#book-table'); // 👈 will scroll to ID
const goToRequests = () => navigate('/admin/requests');
const goToUsers = () => navigate('/admin/users');

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

  // const fetchMyRequests = useCallback(() => {
  //   axios
  //     .get(`https://localhost:7205/api/BookRequests/user/${username}`)
  //     .then(res => {
  //       const requests = res.data.map(r => ({ bookId: r.bookId, status: r.status }));
  //       const statusMap = {};
  //       requests.forEach(r => {
  //         statusMap[r.bookId] = r.status;
  //       });
  //       setRequestStatuses(statusMap);
  //     })
  //     .catch(err => console.log(err));
  // }, [username]);
const fetchMyRequests = useCallback(() => {
  axios
    .get(`https://localhost:7205/api/BookRequests/user/${username}`)
    .then(res => {
      const statusMap = {};
      res.data.forEach(r => {
        const isApprovedButNotReturned =
          r.status === 'Approved' &&
          (!r.returnDate || r.returnDate === "0001-01-01T00:00:00");

        if (r.status === 'Pending' || isApprovedButNotReturned) {
          statusMap[r.bookId] = r.status; // ✅ Only mark as requested
        }
      });
      setRequestStatuses(statusMap);
    })
    .catch(err => console.log(err));
}, [username]);

  useEffect(() => {
    fetchBooks();
      if (location.hash === '#book-table' && bookTableRef.current) {
    // Smooth scroll into view
    bookTableRef.current.scrollIntoView({ behavior: 'smooth' });
  }

    if (role === 'Member') {
      fetchIssuedBooks();
      fetchMyRequests();
    }
    if (role === 'Admin') {
      getAllBookRequests().then(res => {
        const data = res.data || [];

console.log('---Book Requests---');
console.table(data.map(r => ({ bookTitle: r.bookTitle, status: r.status, returnDate: r.returnDate })));

console.log('--- Full Book Requests ---');
res.data.forEach(r => {
  if (r.status === 'Approved') {
    console.log(`Book: ${r.bookTitle}, ReturnDate: ${r.returnDate}`);
  }
});

const approvedNotReturned = data.filter(r => {
  if (r.status !== 'Approved') return false;

  if (!r.returnDate || r.returnDate === "0001-01-01T00:00:00") return true;

  const parsedDate = new Date(r.returnDate);
  return isNaN(parsedDate.getTime()); // Invalid = still not returned
}).length;

console.log('Approved (Not Returned) Count:', approvedNotReturned);




       const pending = data.filter(r => r.status === 'Pending').length;
        const rejected = data.filter(r => r.status === 'Rejected').length;

        setTotalIssued(approvedNotReturned);
        setPendingRequests(pending);

        setRequestChartData({
          labels: ['Borrowed (Not Returned)', 'Pending', 'Rejected'],
          datasets: [{
            data: [approvedNotReturned, pending, rejected],
            backgroundColor: ['#198754', '#ffc107', '#dc3545']
          }]
        });
console.log('Approved Requests:', data.filter(r => r.status === 'Approved'));
console.log('Approved Not Returned:', approvedNotReturned);

        const grouped = {};
        data.forEach(r => {
       if (
  r.status === 'Approved' &&
  (r.returnDate === undefined || r.returnDate === null || r.returnDate === "" || r.returnDate === "0001-01-01T00:00:00")
) {
  grouped[r.bookTitle] = (grouped[r.bookTitle] || 0) + 1;
}

        });

        setIssuedBooksChartData({
          labels: Object.keys(grouped),
          datasets: [{
            label: 'Books Issued',
            data: Object.values(grouped),
            backgroundColor: '#0d6efd'
          }]
        });
      });

      getAllUsers().then(res => setActiveUsers(res.data.length));
    }
  }, [role, fetchBooks, fetchIssuedBooks, fetchMyRequests,location]);


  const uploadImage = async () => {
    if (!selectedImage) return '';
    const formData = new FormData();
    formData.append('file', selectedImage);
    const response = await axios.post('https://localhost:7205/api/Books/upload', formData);
    return response.data.fileName;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setSelectedImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageName = formData.imageName;
      if (selectedImage) imageName = await uploadImage();
      const finalData = { ...formData, imageName };
      const action = isEditing ? updateBook(editId, finalData) : addBook(finalData);
      await action;
      fetchBooks();
      setFormData({ title: '', author: '', category: '', quantity: '', imageName: '' });
      setSelectedImage(null);
      setIsEditing(false);
      setMessage(isEditing ? 'Book updated successfully!' : 'Book added successfully!');
    } catch {
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

  // const handleRequestSubmit = async (bookId, bookTitle) => {
  //   try {
  //     await axios.post('https://localhost:7205/api/BookRequests', { bookId, bookTitle, username });
  //     setRequestStatuses(prev => ({ ...prev, [bookId]: 'Pending' }));
  //     await fetchMyRequests();
  //     setMessage('Request submitted for approval!');
  //   } catch {
  //     setMessage('Failed to submit request.');
  //   }
  // };

  const handleRequestSubmit = async (bookId, bookTitle) => {
  try {
    await axios.post('https://localhost:7205/api/BookRequests', { bookId, bookTitle, username });
    setRequestStatuses(prev => ({ ...prev, [bookId]: 'Pending' })); // Immediately update UI
    setMessage('Request submitted for approval!');
  } catch {
    setMessage('Failed to submit request.');
  }
};


  const handleReturn = (bookId) => {
    returnBook(bookId, username)
      .then(() => {
        fetchBooks();
        fetchIssuedBooks();
        setRequestStatuses(prev => {
          const updated = { ...prev };
          delete updated[bookId];
          return updated;
        });
        setMessage('Book returned successfully!');
      })
    .catch((err) => {
  console.error('Return failed:', err.response?.data || err.message);
  setMessage(`Return failed: ${err.response?.data || err.message}`);
});

  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

const getRequestStatus = (bookId) => requestStatuses[bookId] || null;


  return (
<>
  {/* 👋 Greeting only when logged in */}

 {localStorage.getItem("username") && (
  <div className="py-3 text-center">
    <h3 className="fw-semibold">
      👋 Hello, <span className="text-primary">{localStorage.getItem("username")}</span>! Welcome back.
    </h3>
  </div>
)}

    
    <div className="container mt-5">

      <h2 className="mb-4">📚 Library Management</h2>
      {message && <div className="alert alert-info">{message}</div>}

     {role === 'Admin' && (
        <>
          <div className="row mb-4 text-white">
            <div className="col-md-3"><div className="bg-primary p-3 rounded" onClick={goToBooksTable} style={{ cursor: 'pointer' }}>📚 Total Books: <strong>{books.length}</strong></div></div>
            <div className="col-md-3"><div className="bg-success p-3 rounded"onClick={goToRequests} style={{ cursor: 'pointer' }}>✅ Books Issued: <strong>{totalIssued}</strong></div></div>
            <div className="col-md-3"><div className="bg-warning p-3 rounded" onClick={goToRequests} style={{ cursor: 'pointer' }}>⏳ Pending Requests: <strong>{pendingRequests}</strong></div></div>
            <div className="col-md-3"><div className="bg-dark p-3 rounded"onClick={goToUsers} style={{ cursor: 'pointer' }}>👤 Active Users: <strong>{activeUsers}</strong></div></div>
          </div>

          <div className="row mb-5">
            <div className="col-md-6">
              <h6>📈 Request Status Overview</h6>
              {requestChartData && <Pie data={requestChartData} />}
            </div>
            <div className="col-md-6">
              <h6>📊 Books Issued by Title</h6>
              {issuedBooksChartData && <Bar data={issuedBooksChartData} />}
            </div>
          </div>

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
         <div id="book-table" ref={bookTableRef}>

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
                  <td><img src={`https://localhost:7205/Images/Books/${book.imageName}`} alt={book.title} style={{ width: '50px', height: '70px', objectFit: 'cover' }} /></td>
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
          </div>
        </>
      )}

      {role === 'Member' && (
        <>
          <div className="d-flex justify-content-between mb-3">
            <Link to="/request-history" className="btn btn-outline-primary">📄 View Request History</Link>
          </div>

          <input type="text" className="form-control mb-4" placeholder="Search by title or author..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {filteredBooks.map(book => {
              const requestStatus = getRequestStatus(book.id);

              return (
                <div key={book.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <img src={`https://localhost:7205/Images/Books/${book.imageName}`} alt={book.title} className="card-img-top" style={{ height: '300px', objectFit: 'cover' }} />
                    <div className="card-body">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="card-text text-muted">by {book.author}</p>
                     <p className="card-text">📦 Available: {book.quantity}</p>

{issuedBookIds.includes(book.id) ? (() => {
  const issuedBook = issuedBooks.find(b => b.bookId === book.id);
  let dueText = '';
  let dueClass = '';

  if (issuedBook && issuedBook.issueDate) {
    const issueDate = new Date(issuedBook.issueDate);
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 7);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) {
      dueText = `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      dueClass = diffDays <= 2 ? 'badge bg-warning text-dark' : 'badge bg-success';
    } else {
      dueText = 'Overdue';
      dueClass = 'badge bg-danger';
    }
  }

  return (
    <>
      <p className="card-text">
        📅 <span className={dueClass}>{dueText}</span>
      </p>
      <button className="btn btn-danger w-100" onClick={() => handleReturn(book.id)}>Return</button>
    </>
  );
})() : requestStatus === 'Pending' ? (

                        <button className="btn btn-secondary w-100" disabled>Requested</button>
                      ) : (
                        <button
                          className="btn btn-primary w-100"
                          disabled={book.quantity < 1}
                          onClick={() => handleRequestSubmit(book.id, book.title)}>
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
    </>
  );
}

export default BookList;
