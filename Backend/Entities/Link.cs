namespace GraphApp.Enteties
{
    public class Link
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public Guid Source { get; set; }
        public Guid Target { get; set; }
    }

}