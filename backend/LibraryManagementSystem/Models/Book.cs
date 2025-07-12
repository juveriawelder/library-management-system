namespace LibraryManagementSystem.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Category { get; set; }
        public int Quantity { get; set; }
        public string? ImageName { get; set; } // e.g., "acotar.jpg"

    }
}
