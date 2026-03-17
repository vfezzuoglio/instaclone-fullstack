using InstaClone.Api.Data;
using InstaClone.Api.Models;
using InstaClone.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/posts/{postId:long}/like")]
public class LikesController : ControllerBase
{
    private readonly AppDbContext _db;

    public LikesController(AppDbContext db) => _db = db;

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Like(long postId)
    {
        var userId = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (userId is null) return Unauthorized();

        if (!await _db.Posts.AnyAsync(p => p.Id == postId))
            return NotFound("Post not found.");

        if (await _db.Likes.AnyAsync(l => l.UserId == userId.Value && l.PostId == postId))
            return Ok(new { liked = true }); // idempotent

        _db.Likes.Add(new Like { UserId = userId.Value, PostId = postId });
        await _db.SaveChangesAsync();

        return Ok(new { liked = true });
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> Unlike(long postId)
    {
        var userId = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (userId is null) return Unauthorized();

        var like = await _db.Likes.FirstOrDefaultAsync(l => l.UserId == userId.Value && l.PostId == postId);
        if (like is null) return Ok(new { liked = false }); // idempotent

        _db.Likes.Remove(like);
        await _db.SaveChangesAsync();

        return Ok(new { liked = false });
    }
}
