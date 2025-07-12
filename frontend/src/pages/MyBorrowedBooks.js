import React, { useEffect, useState, useCallback } from 'react';
import { getMyIssuedBooks, returnBook } from '../services/BookService';

function MyBorrowedBooks() {
  const username = localStorage.getItem('username');
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState('');

  // ✅ UseCallback to avoid missing dependency warning
  const fetchBooks = useCallback(() => {
    getMyIssuedBooks(username)
      .then(res => setBooks(res.data))
      .catch(() => setMessage('Failed to fetch borrowed books.'));
  }, [username]);

  const handleReturn = (bookId) => {
    returnBook(bookId, username)
      .then(() => {
        setMessage('Book returned successfully!');
        fetchBooks();
      })
      .catch(() => setMessage('Return failed.'));
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // ✅ safe and warning-free

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📖 My Borrowed Books</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {books.length > 0 ? (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Issue Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  {book.IssueDate
                    ? new Date(book.IssueDate).toLocaleDateString()
                    : '—'}
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleReturn(book.bookId)}>Return</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-secondary">You have no borrowed books at the moment.</div>
      )}
    </div>
  );
}

export default MyBorrowedBooks;