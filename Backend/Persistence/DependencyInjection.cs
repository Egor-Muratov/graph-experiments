namespace GraphApp.Persistence
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddPersistence(this IServiceCollection
            services, IConfiguration configuration)
        {
            var connectionString = configuration["DbConnection"];
            services.AddDbContext<GraphDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
            });
            services.AddScoped<IGraphDbContext>(provider =>
                provider.GetService<GraphDbContext>());
            return services;
        }
    }
}