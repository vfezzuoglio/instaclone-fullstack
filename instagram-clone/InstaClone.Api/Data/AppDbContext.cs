using Microsoft.EntityFrameworkCore;
using InstaClone.Api.Models;

namespace InstaClone.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Follow> Follows => Set<Follow>();

    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Composite key for Likes
        modelBuilder.Entity<Like>()
            .HasKey(l => new { l.UserId, l.PostId });
        modelBuilder.Entity<Follow>()
            .HasKey(f => new { f.FollowerId, f.FollowingId });

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId);



        base.OnModelCreating(modelBuilder);
    }
}
