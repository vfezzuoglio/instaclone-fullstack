using InstaClone.Api.Data;
using InstaClone.Api.Models;
using InstaClone.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/users/{userId:long}/follow")]
public class FollowsController : ControllerBase
{
    private readonly AppDbContext _db;
    public FollowsController(AppDbContext db) => _db = db;

    [Authorize]
    [HttpPost]
    [EnableRateLimiting("write")]
    public async Task<IActionResult> FollowUser(long userId)
    {
        var me = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (me is null) return Unauthorized();

        if (me.Value == userId) return BadRequest("You cannot follow yourself.");

        if (!await _db.Users.AnyAsync(u => u.Id == userId))
            return NotFound("User not found.");

        var exists = await _db.Follows.AnyAsync(f => f.FollowerId == me.Value && f.FollowingId == userId);
        if (exists) return Ok(new { following = true });

        _db.Follows.Add(new Follow { FollowerId = me.Value, FollowingId = userId });
        await _db.SaveChangesAsync();

        return Ok(new { following = true });
    }

    [Authorize]
    [HttpDelete]
    [EnableRateLimiting("write")]
    public async Task<IActionResult> UnfollowUser(long userId)
    {
        var me = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (me is null) return Unauthorized();

        var row = await _db.Follows.FirstOrDefaultAsync(f => f.FollowerId == me.Value && f.FollowingId == userId);
        if (row is null) return Ok(new { following = false });

        _db.Follows.Remove(row);
        await _db.SaveChangesAsync();

        return Ok(new { following = false });
    }
}

