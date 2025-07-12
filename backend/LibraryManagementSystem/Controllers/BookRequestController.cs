using LibraryManagementSystem.Data;
using LibraryManagementSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/BookRequests (for Admin to view all requests)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookRequest>>> GetRequests()
        {
            return await _context.BookRequests.ToListAsync();
        }

        // ✅ POST: api/BookRequests (Member submits a request)
        [HttpPost]
        public async Task<IActionResult> SubmitRequest(BookRequest request)
        {
            request.Status = "Pending";
            request.RequestDate = DateTime.Now;
            _context.BookRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Request submitted." });
        }

        // ✅ GET: api/BookRequests/user/{username} (Member views their own requests)
        [HttpGet("user/{username}")]
        public async Task<ActionResult<IEnumerable<BookRequest>>> GetByUser(string username)
        {
            return await _context.BookRequests
                .Where(r => r.Username == username)
                .ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var req = await _context.BookRequests.FindAsync(id);
            if (req == null)
                return NotFound();

            req.Status = status;


            // ✅ If approved, allocate the book (insert into IssueRecords)
            if (status == "Approved")
            {
                var alreadyIssued = await _context.IssueRecords
                    .AnyAsync(r => r.BookId == req.BookId && r.Username == req.Username && r.ReturnDate == null);

                if (!alreadyIssued)
                {
                    _context.IssueRecords.Add(new IssueRecord
                    {
                        BookId = req.BookId,
                        Username = req.Username,
                        IssueDate = DateTime.Now,
                        ReturnDate = null
                    });

                    // Reduce book quantity
                    var book = await _context.Books.FindAsync(req.BookId);
                    if (book != null && book.Quantity > 0)
                    {
                        book.Quantity--;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Request {status}." });
        }

    }
}
