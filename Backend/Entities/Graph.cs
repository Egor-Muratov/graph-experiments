namespace GraphApp.Enteties;

public class Graph {
    public Guid Id {get; init;}
    public string Name {get; init;}
    public List<Node> Nodes {get; set;}
    public List<Link> Links {get; set;}

    public virtual bool ?hasCycle {get; set;}
    public virtual int ?OrderLength {get; set;}
}
