using InstaClone.Api.Services.ImageStorage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    private readonly IImageStorageService _imageStorage;

    public UploadsController(IImageStorageService imageStorage)
    {
        _imageStorage = imageStorage;
    }

    [Authorize]
    [HttpPost("images")]
    [Consumes("multipart/form-data")]
    [EnableRateLimiting("write")]
    [RequestSizeLimit(10_000_000)]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile image, CancellationToken cancellationToken)
    {
        if (image is null || image.Length == 0)
        {
            return BadRequest("Please select an image.");
        }

        if (string.IsNullOrWhiteSpace(image.ContentType) || !image.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only image files are supported.");
        }

        var storedPath = await _imageStorage.SaveImageAsync(image, cancellationToken);
        var publicUrl = ToPublicUrl(storedPath);

        return Ok(new
        {
            imageUrl = publicUrl
        });
    }

    private string ToPublicUrl(string storedPath)
    {
        if (Uri.TryCreate(storedPath, UriKind.Absolute, out var absoluteUri))
        {
            // If it's a file:// URL (happens in Expo web), convert to http://
            if (absoluteUri.Scheme == "file")
            {
                return $"http://{Request.Host}{storedPath}";
            }
            return absoluteUri.ToString();
        }

        // Use http as default if scheme is "file", otherwise use the actual scheme
        var scheme = Request.Scheme == "file" ? "http" : Request.Scheme;
        return $"{scheme}://{Request.Host}{storedPath}";
    }
}