using GraphApp.Enteties;
using Microsoft.EntityFrameworkCore;

namespace GraphApp.Persistence
{
    public interface IGraphDbContext
    {
        DbSet<Node> Nodes { get; set; }
        DbSet<Link> Links { get; set; }
        DbSet<CustomFunction> CustomFunctions { get; set; }
        DbSet<Graph> Graphs { get; set; }
    }

    public class GraphDbContext : DbContext, IGraphDbContext
    {
        public DbSet<Node> Nodes { get; set; }
        public DbSet<Link> Links { get; set; }
        public DbSet<CustomFunction> CustomFunctions { get; set; }
        public DbSet<Graph> Graphs { get; set; }

        public GraphDbContext(DbContextOptions<GraphDbContext> options)
            : base(options) { }

    }
}