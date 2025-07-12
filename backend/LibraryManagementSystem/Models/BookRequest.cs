using System;

namespace LibraryManagementSystem.Models
{
    public class BookRequest
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public int BookId { get; set; }
        public required string BookTitle { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public DateTime RequestDate { get; set; } = DateTime.Now;
    }
}
