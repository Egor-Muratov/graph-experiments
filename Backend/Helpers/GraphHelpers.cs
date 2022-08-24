using MyApp.GraphExp.Models;
using System.Diagnostics;
using MyApp.GraphExp.Algorithm;

namespace MyApp.GraphExp.GraphHelpers;
public static class GraphHelper
{
    public static void FillTestValues(this Graph graph)
    {
        graph.Nodes.Add(new Node { Id = 0, Name = "0" });
        graph.Nodes.Add(new Node { Id = 1, Name = "1" });
        graph.Nodes.Add(new Node { Id = 2, Name = "2" });
        graph.Nodes.Add(new Node { Id = 3, Name = "3" });
        graph.Nodes.Add(new Node { Id = 4, Name = "4" });
        graph.Nodes.Add(new Node { Id = 5, Name = "5" });
        graph.Nodes.Add(new Node { Id = 6, Name = "6" });
        graph.Nodes.Add(new Node { Id = 7, Name = "7" });
        graph.Nodes.Add(new Node { Id = 8, Name = "8" });

        graph.Links.Add(new Link { Id = 0, Name = "Link from node 0-5", Target = 5, Source = 0 });
        graph.Links.Add(new Link { Id = 1, Name = "Link from node 0-7", Target = 7, Source = 0 });
        graph.Links.Add(new Link { Id = 2, Name = "Link from node 1-6", Target = 6, Source = 1 });
        graph.Links.Add(new Link { Id = 3, Name = "Link from node 1-4", Target = 4, Source = 1 });
        graph.Links.Add(new Link { Id = 4, Name = "Link from node 2-8", Target = 8, Source = 2 });
        graph.Links.Add(new Link { Id = 5, Name = "Link from node 2-1", Target = 1, Source = 2 });
        graph.Links.Add(new Link { Id = 6, Name = "Link from node 3-1", Target = 1, Source = 3 });
        graph.Links.Add(new Link { Id = 7, Name = "Link from node 4-5", Target = 5, Source = 4 });
        graph.Links.Add(new Link { Id = 8, Name = "Link from node 4-6", Target = 6, Source = 4 });
        graph.Links.Add(new Link { Id = 9, Name = "Link from node 5-2", Target = 2, Source = 5 });
        graph.Links.Add(new Link { Id = 10, Name = "Link from node 6-3", Target = 3, Source = 6 });
        graph.Links.Add(new Link { Id = 11, Name = "Link from node 6-5", Target = 5, Source = 6 });
        graph.Links.Add(new Link { Id = 12, Name = "Link from node 7-2", Target = 2, Source = 7 });
        graph.Links.Add(new Link { Id = 13, Name = "Link from node 8-2", Target = 2, Source = 8 });
        graph.Links.Add(new Link { Id = 14, Name = "Link from node 8-4", Target = 4, Source = 8 });
    }

    public static void FillRandom(this Graph Graph, int NodesCount, int MinLinkCount, int MaxLinkCount)
    {
        Debug.WriteLine("Start GenerateGraph()");
        Graph.Nodes = Enumerable.Range(0, NodesCount).Select(index => new Node
        {
            Id = index,
            Name = $"{index}"
        }).ToList();

        Graph.Links = new List<Link>();
        int linkIndex = 0;

        foreach (var node in Graph.Nodes)
        {
            Graph.Links.AddRange
            (
            Enumerable.Range(1, Random.Shared.Next(MinLinkCount, MaxLinkCount)).Select(index => new Link
            {
                Id = linkIndex++,
                Name = $"Link from node {node.Id} N{index}",
                Source = node.Id,
                Target = _getRandomExclude(node.Id, 0, NodesCount)
            }).ToList()
            );
        }
        Debug.WriteLine("Finish GenerateGraph()");
    }

    public static void FillRandomWithoutCycle(this Graph Graph, int NodesCount, int MinLinkCount, int MaxLinkCount)
    {
        Debug.WriteLine("Start GenerateGraph()");
        Graph.Nodes = Enumerable.Range(0, NodesCount).Select(index => new Node
        {
            Id = index,
            Name = $"{index}"
        }).ToList();

        Graph.Links = new List<Link>();
        int linkIndex = 0;

        foreach (var node in Graph.Nodes)
        {
            Graph.Links.AddRange
            (
                Enumerable.Range(1, Random.Shared.Next
                ( 
                    Math.Min(MinLinkCount, NodesCount - node.Id - 1 ), 
                    Math.Min(MaxLinkCount, NodesCount - node.Id - 1 )
                ))
                .Select(index => new Link
                {
                    Id = linkIndex++,
                    Name = $"Link from node {node.Id} N{index}",
                    Source = node.Id,
                    Target = Random.Shared.Next(node.Id + 1, NodesCount)
                })
                .ToList()
            );
        }
        Debug.WriteLine("Finish GenerateGraph()");
    }
    
    public static void FillOrderWithDfs(this Graph Graph)
    {
        var dfs = new Dfs(Graph);
        var order = dfs.HasCycle ?  dfs.GetCycle() : dfs.GetOrder();
        var orderDict = order
            .Select((nodeId,index) => new {nodeId, index})
            .ToDictionary(x => x.nodeId,x=> x.index + 1);

        foreach (var node in Graph.Nodes)
        {
            node.Order = orderDict.TryGetValue(node.Id, out var value) ? value : 0;
        }
        Graph.hasCycle = dfs.HasCycle;
        Graph.OrderLength = order.Count();
    }
    private static int _getRandomExclude(int Id, int Min, int Max)
    {
        int random_int;
        do
        {
            random_int = Random.Shared.Next(Min, Max);
        } while (random_int == Id);
        return random_int;
    }

}
