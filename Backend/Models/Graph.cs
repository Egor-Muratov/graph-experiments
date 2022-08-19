namespace MyApp.GraphExp.Models;

public class Node {
    public int Id {get;set;}
    public string ?Name {get;set;}

    public int Order {get;set;}
}

public class Link {
    public int Id {get;set;}
    public string ?Name {get;set;}
    public int Source {get;set;}
    public int Target {get;set;}
}

public class Graph {
    public List<Node> ?Nodes {get; set;}
    public List<Link> ?Links {get; set;}

    public bool ?hasCycle {get; set;}
    public int ?OrderLength {get; set;}
}
