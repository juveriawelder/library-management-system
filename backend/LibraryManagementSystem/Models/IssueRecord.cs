namespace LibraryManagementSystem.Models
{
    public class IssueRecord
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string Username { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime? ReturnDate { get; set; }

        public Book Book { get; set; }  // Navigation property
    }
}
