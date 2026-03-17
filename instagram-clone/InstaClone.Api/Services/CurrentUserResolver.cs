using InstaClone.Api.Data;
using InstaClone.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InstaClone.Api.Services;

public static class CurrentUserResolver
{
    public static async Task<long?> GetLocalUserIdAsync(AppDbContext db, ClaimsPrincipal principal)
    {
        var nameId = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? principal.FindFirstValue("nameid");

        if (long.TryParse(nameId, out var parsedId))
        {
            var exists = await db.Users.AnyAsync(u => u.Id == parsedId);
            if (exists) return parsedId;
        }

        var email = principal.FindFirstValue(ClaimTypes.Email)
                    ?? principal.FindFirstValue("email");

        if (string.IsNullOrWhiteSpace(email))
            return null;

        email = email.Trim().ToLowerInvariant();

        var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (existingUser is not null)
            return existingUser.Id;

        var preferred = principal.FindFirstValue("name")
                        ?? email.Split('@')[0];

        var username = await BuildUniqueUsernameAsync(db, preferred);

        var user = new User
        {
            Email = email,
            Username = username,
            PasswordHash = "FIREBASE_AUTH"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return user.Id;
    }

    private static async Task<string> BuildUniqueUsernameAsync(AppDbContext db, string input)
    {
        var baseName = (input ?? "user").Trim();
        if (baseName.Length == 0) baseName = "user";

        var candidate = baseName;
        var suffix = 1;

        while (await db.Users.AnyAsync(u => u.Username == candidate))
        {
            suffix++;
            candidate = $"{baseName}{suffix}";
        }

        return candidate;
    }
}
