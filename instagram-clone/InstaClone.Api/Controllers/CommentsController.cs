using InstaClone.Api.Data;
using InstaClone.Api.Dtos;
using InstaClone.Api.Models;
using InstaClone.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/posts/{postId:long}/comments")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public CommentsController(AppDbContext db)
    {
        _db = db;
    }

    // Public: list comments for a post
    [HttpGet]
    [EnableRateLimiting("read")]
    public async Task<IActionResult> List(long postId)
    {
        var exists = await _db.Posts.AnyAsync(p => p.Id == postId);
        if (!exists)
            return NotFound("Post not found.");

        var comments = await _db.Comments
            .Where(c => c.PostId == postId)
            .Include(c => c.User)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Text,
                c.CreatedAt,
                c.UserId,
                Username = c.User!.Username
            })
            .ToListAsync();

        return Ok(comments);
    }

    // Protected: add a comment
    [Authorize]
    [HttpPost]
    [EnableRateLimiting("write")]
    public async Task<IActionResult> Create(long postId, CreateCommentRequest req)
    {
        var userId = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (userId is null)
            return Unauthorized();

        var exists = await _db.Posts.AnyAsync(p => p.Id == postId);
        if (!exists)
            return NotFound("Post not found.");

        var text = (req.Text ?? "").Trim();
        if (text.Length == 0)
            return BadRequest("Comment text is required.");
        if (text.Length > 500)
            return BadRequest("Comment too long (max 500).");

        var comment = new Comment
        {
            PostId = postId,
            UserId = userId.Value,
            Text = text
        };

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        // Return username too so the client can render without re-fetching
        var username = await _db.Users
            .Where(u => u.Id == userId.Value)
            .Select(u => u.Username)
            .FirstAsync();

        return Ok(new
        {
            comment.Id,
            comment.Text,
            comment.CreatedAt,
            comment.UserId,
            Username = username
        });
    }
}
