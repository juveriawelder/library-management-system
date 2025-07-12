using LibraryManagementSystem.Data;
using LibraryManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IssueController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IssueController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Issue/request
        [HttpPost("request")]
        public async Task<IActionResult> RequestBook([FromBody] BookRequestDTO request)
        {
            var book = await _context.Books.FindAsync(request.BookId);
            if (book == null || book.Quantity < 1)
                return BadRequest("Book not available.");

            var alreadyIssued = await _context.IssueRecords
                .AnyAsync(i => i.BookId == request.BookId && i.Username == request.Username && i.ReturnDate == null);

            if (alreadyIssued)
                return BadRequest("Book already issued and not returned.");

            var issue = new IssueRecord
            {
                BookId = request.BookId,
                Username = request.Username,
                IssueDate = DateTime.Now
            };

            book.Quantity -= 1;

            _context.IssueRecords.Add(issue);
            await _context.SaveChangesAsync();

            return Ok("Book issued.");
        }

        // POST: api/Issue/return
        [HttpPost("return")]
        public async Task<IActionResult> ReturnBook([FromBody] BookRequestDTO request)
        {
            var record = await _context.IssueRecords
                .FirstOrDefaultAsync(i => i.BookId == request.BookId && i.Username == request.Username && i.ReturnDate == null);

            if (record == null)
                return BadRequest("No active issue found.");

            record.ReturnDate = DateTime.Now;

            var book = await _context.Books.FindAsync(request.BookId);
            if (book != null)
                book.Quantity += 1;

            await _context.SaveChangesAsync();

            return Ok("Book returned.");
        }

        // GET: api/Issue/mybooks?username=xyz
        [HttpGet("mybooks")]
        public async Task<IActionResult> GetMyBooks(string username)
        {
            var books = await _context.IssueRecords
                .Include(i => i.Book)
                .Where(i => i.Username == username && i.ReturnDate == null)
                .Select(i => new
                {
                    i.BookId,
                    i.Book.Title,
                    i.Book.Author,
                    i.IssueDate
                })
                .ToListAsync();

            return Ok(books);
        }
    }

    public class BookRequestDTO
    {
        public int BookId { get; set; }
        public string Username { get; set; }
    }
}
