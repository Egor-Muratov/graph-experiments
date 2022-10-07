namespace GraphApp.Enteties
{
    public class Node
    {
        public Guid Id { get; init; }
        public string Name { get; set; }
        public decimal Value { get; set; }
        public CustomFunction CustomFunction { get; set; }
        public Graph Graph { get; set; }
        public virtual List<Node> Dependencies { get; set; }

    }
}