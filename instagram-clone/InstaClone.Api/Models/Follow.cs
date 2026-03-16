namespace InstaClone.Api.Models;

public class Follow
{
    public long FollowerId { get; set; }
    public User? Follower { get; set; }

    public long FollowingId { get; set; }
    public User? Following { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
