namespace InstaClone.Api.Services.ImageStorage;

public interface IImageStorageService
{
    Task<string> SaveImageAsync(IFormFile file, CancellationToken cancellationToken = default);
}