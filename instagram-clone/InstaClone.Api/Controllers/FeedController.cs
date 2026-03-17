using InstaClone.Api.Data;
using InstaClone.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/feed")]
public class FeedController : ControllerBase
{
    private readonly AppDbContext _db;
    public FeedController(AppDbContext db) => _db = db;

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var me = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (me is null) return Unauthorized();

        var followingIds = _db.Follows
            .Where(f => f.FollowerId == me.Value)
            .Select(f => f.FollowingId);

        var posts = await _db.Posts
            .Where(p => p.UserId == me.Value || followingIds.Contains(p.UserId))
            .Include(p => p.User)
            .Include(p => p.Likes)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new
            {
                p.Id,
                p.ImageUrl,
                p.Caption,
                p.CreatedAt,
                p.UserId,
                Username = p.User!.Username,
                LikesCount = p.Likes.Count
            })
            .ToListAsync();

        return Ok(posts);
    }
}
