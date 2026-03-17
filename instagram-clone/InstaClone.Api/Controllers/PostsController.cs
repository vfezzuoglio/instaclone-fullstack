using InstaClone.Api.Data;
using InstaClone.Api.Dtos;
using InstaClone.Api.Models;
using InstaClone.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        var userId = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (userId is null)
            return Unauthorized();

        var post = new Post
        {
            UserId = userId.Value,
            ImageUrl = req.ImageUrl,
            Caption = req.Caption
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        var username = await _db.Users
            .Where(u => u.Id == userId.Value)
            .Select(u => u.Username)
            .FirstAsync();

        return Ok(new
        {
            post.Id,
            post.ImageUrl,
            post.Caption,
            post.CreatedAt,
            post.UserId,
            Username = username,
            LikesCount = 0,
            LikedByMe = false,
            CommentsCount = 0,
            CanDelete = true
        });
    }

    [Authorize]
    [HttpGet("feed")]
    public async Task<IActionResult> Feed()
    {
        var me = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (me is null)
            return Unauthorized();

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
                p.UserId,
                Username = p.User!.Username,

                LikesCount = p.Likes.Count,
                LikedByMe = p.Likes.Any(l => l.UserId == me.Value),

                CommentsCount = p.Comments.Count,
                CanDelete = p.UserId == me.Value
            })
        .ToListAsync();

        return Ok(posts);
    }

    [Authorize]
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        var me = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (me is null)
            return Unauthorized();

        var post = await _db.Posts.FirstOrDefaultAsync(p => p.Id == id);
        if (post is null)
            return NotFound("Post not found.");

        if (post.UserId != me.Value)
            return Forbid();

        var likes = _db.Likes.Where(l => l.PostId == id);
        var comments = _db.Comments.Where(c => c.PostId == id);

        _db.Likes.RemoveRange(likes);
        _db.Comments.RemoveRange(comments);
        _db.Posts.Remove(post);

        await _db.SaveChangesAsync();
        return Ok(new { deleted = true });
    }
}
