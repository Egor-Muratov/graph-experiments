namespace GraphApp.Queries.Node
{
    public class NodeDetailsDTO
    {
        public Guid Id { get; init; }
        public string Name { get; set; }
        public decimal Value { get; set; }
        public string CustomFunctionName { get; set; }
        public List<NodeDetailsDTO> Dependencies { get; set; }

    }
}