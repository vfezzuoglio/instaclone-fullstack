using InstaClone.Api.Data;
using InstaClone.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpPut("profile/bio")]
    [EnableRateLimiting("write")]
    public async Task<IActionResult> UpdateBio([FromBody] UpdateBioRequest req)
    {
        if (req == null)
            return BadRequest("Request body is required.");

        var userId = await CurrentUserResolver.GetLocalUserIdAsync(_db, User);
        if (userId is null)
            return Unauthorized();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId.Value);
        if (user is null)
            return NotFound("User not found.");

        user.Bio = (req.Bio ?? "").Trim();
        await _db.SaveChangesAsync();

        return Ok(new { bio = user.Bio });
    }
}

public class UpdateBioRequest
{
    public string? Bio { get; set; }
}
