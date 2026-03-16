namespace InstaClone.Api.Models;

public class Post
{
    public long Id { get; set; }

    public long UserId { get; set; }
    public User? User { get; set; }


    public string ImageUrl { get; set; } = "";
    public string? Caption { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Like> Likes { get; set; } = new();
    public List<Comment> Comments { get; set; } = new();

}
