using InstaClone.Api.Data;
using InstaClone.Api.Dtos;
using InstaClone.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PostsController(AppDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreatePostRequest req)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

        if (userId is null)
            return Unauthorized();

        var post = new Post
        {
            UserId = long.Parse(userId),
            ImageUrl = req.ImageUrl,
            Caption = req.Caption
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        return Ok(post);
    }

    [Authorize]
    [HttpGet("feed")]
    public async Task<IActionResult> Feed()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue("sub");

        if (userIdStr is null)
            return Unauthorized();

        var me = long.Parse(userIdStr);

        var posts = await _db.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.ImageUrl,
                p.Caption,
                p.CreatedAt,
                Username = p.User!.Username,

                LikesCount = p.Likes.Count,
                LikedByMe = p.Likes.Any(l => l.UserId == me),

                CommentsCount = p.Comments.Count
            })
        .ToListAsync();

        return Ok(posts);
    }
}
