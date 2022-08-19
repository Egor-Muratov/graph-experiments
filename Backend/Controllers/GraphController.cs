using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
using MyApp.GraphExp.Models;
using System.Diagnostics;

namespace MyApp.GraphExp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphController : ControllerBase
{

    public GraphController()
    {

    }

    [HttpGet]
    public Graph GetDefaultGraph()
    {
        Debug.WriteLine("Start GetDefaultGraph()");
        int nodeCount = 10;
        int minLinks = 0;
        int maxLinks = 3;
        var graph = genegrateGraph(nodeCount, minLinks, maxLinks);
        // var graph = getTestGraph();
        fillOrder(graph);
        Debug.WriteLine("Finish GetDefaultGraph()");
        return graph;
    }
    [HttpGet]
    [Route("{nodeCount}/{minLinks}/{maxLinks}")]
    public Graph GetGraph(int NodeCount, int MinLinks, int MaxLinks)
    {
        Debug.WriteLine("Start GetGraph()");
        var graph = genegrateGraph(NodeCount, MinLinks, MaxLinks);
        // var graph = getTestGraph();
        fillOrder(graph);
        Debug.WriteLine("Finish GetGraph()");
        return graph;
    }

        [HttpGet]
        [Route("test")]
    public Graph GetTestGraph()
    {
        Debug.WriteLine("Start GetGraph()");
        var graph = getTestGraph();
        fillOrder(graph);
        Debug.WriteLine("Finish GetGraph()");
        return graph;
    }

    private Graph genegrateGraph(int NodesCount, int MinLinkCount, int MaxLinkCount)
    {

        Debug.WriteLine("Start generatGraph()");
        var nodesList = Enumerable.Range(0, NodesCount).Select(index => new Node
        {
            Id = index,
            Name = $"{index}"
        }).ToList();

        List<Link> linksList = new List<Link>();
        int linkIndex = 0;

        foreach (var node in nodesList)
        {
            linksList.AddRange
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
        Debug.WriteLine("Finish generatGraph()");
        return new Graph
        {
            Nodes = nodesList,
            Links = linksList
        };

    }

    private Graph getTestGraph()
    {
        Debug.WriteLine("Start getTestGraph()");
        List<Node> nodesList;
        nodesList = new List<Node>();
        nodesList.Add(new Node { Id = 0, Name = "0" });
        nodesList.Add(new Node { Id = 1, Name = "1" });
        nodesList.Add(new Node { Id = 2, Name = "2" });
        nodesList.Add(new Node { Id = 3, Name = "3" });
        nodesList.Add(new Node { Id = 4, Name = "4" });
        nodesList.Add(new Node { Id = 5, Name = "5" });
        nodesList.Add(new Node { Id = 6, Name = "6" });
        nodesList.Add(new Node { Id = 7, Name = "7" });
        nodesList.Add(new Node { Id = 8, Name = "8" });

        List<Link> linksList;
        linksList = new List<Link>();
        linksList.Add(new Link { Id = 0, Name = "Link from node 0-5", Target = 5, Source = 0 });
        linksList.Add(new Link { Id = 1, Name = "Link from node 0-7", Target = 7, Source = 0 });
        linksList.Add(new Link { Id = 2, Name = "Link from node 1-6", Target = 6, Source = 1 });
        linksList.Add(new Link { Id = 3, Name = "Link from node 1-4", Target = 4, Source = 1 });
        linksList.Add(new Link { Id = 4, Name = "Link from node 2-8", Target = 8, Source = 2 });
        linksList.Add(new Link { Id = 5, Name = "Link from node 2-1", Target = 1, Source = 2 });
        linksList.Add(new Link { Id = 6, Name = "Link from node 3-1", Target = 1, Source = 3 });
        linksList.Add(new Link { Id = 7, Name = "Link from node 4-5", Target = 5, Source = 4 });
        linksList.Add(new Link { Id = 8, Name = "Link from node 4-6", Target = 6, Source = 4 });
        linksList.Add(new Link { Id = 9, Name = "Link from node 5-2", Target = 2, Source = 5 });
        linksList.Add(new Link { Id = 10, Name = "Link from node 6-3", Target = 3, Source = 6 });
        linksList.Add(new Link { Id = 11, Name = "Link from node 6-5", Target = 5, Source = 6 });
        linksList.Add(new Link { Id = 12, Name = "Link from node 7-2", Target = 2, Source = 7 });
        linksList.Add(new Link { Id = 13, Name = "Link from node 8-2", Target = 2, Source = 8 });
        linksList.Add(new Link { Id = 14, Name = "Link from node 8-4", Target = 4, Source = 8 });

        Debug.WriteLine("Finish getTestGraph()");
        return new Graph
        {
            Nodes = nodesList,
            Links = linksList
        };
    }

    private int _getRandomExclude(int Id, int Min, int Max)
    {
        int random_int;
        do
        {
            random_int = Random.Shared.Next(Min, Max);
        } while (random_int == Id);
        return random_int;
    }

    private Dictionary<int, bool>? _used;
    private Dictionary<int, List<int>>? _sources;
    private Queue<int>? _order;
    private Stack<int>? _path;
    private Stack<int>? _cycle;
    private int? _cycleNode;

    private void fillOrder(Graph Graph)
    {
        _sources = Graph.Nodes.ToDictionary(x => x.Id, x => new List<int>());
        foreach (var link in Graph.Links)
        {
            _sources[link.Target].Add(link.Source);
        };
        _used = Graph.Nodes.ToDictionary(x => x.Id, x => false);
        _order = new Queue<int>();
        _path = new Stack<int>();
        _cycle = new Stack<int>();
        _cycleNode = null;

        for (int NodeId = 0; NodeId < Graph.Nodes.Count; NodeId++)
        {
            if (!_used[NodeId])
            {
                _path.Push(NodeId);
                dfs(NodeId);
                if (_cycleNode.HasValue)
                {
                    break;
                }
            }
        }

        if (_cycleNode.HasValue)
        {
            var orderDict = _path
                .Select((nodeId, index) => new { nodeId, index })
                .TakeWhile(x => x.nodeId != _cycleNode)
                .ToDictionary(x => x.nodeId, x => x.index + 2);
            orderDict.Add((int)_cycleNode,1);
            foreach (var node in Graph.Nodes)
            {
                node.Order = orderDict.TryGetValue(node.Id, out var value) ? value : 0;
            }
            Graph.hasCycle = true;
            Graph.OrderLength = orderDict.Count;
            Debug.WriteLine("Циклическая ссылка:");
            Debug.WriteLine(String.Join(",", orderDict));
        }
        else
        {
            var orderDict = _order.Select((nodeId, index) => new { nodeId, index }).ToDictionary(x => x.nodeId, x => x.index + 1);
            foreach (var node in Graph.Nodes)
            {
                node.Order = orderDict.TryGetValue(node.Id, out var value) ? value : 0;
            }
            Graph.hasCycle = false;
            Graph.OrderLength = orderDict.Count;
            Debug.WriteLine(String.Join(",", orderDict));
        }

    }
    private void dfs(int NodeId)
    {
        this._used[NodeId] = true;

        foreach (var sourceNodeId in _sources[NodeId])
        {
            if (_cycleNode.HasValue || _path.Contains(sourceNodeId))
            {
                if (_path.Contains(sourceNodeId)) {
                    _cycleNode = sourceNodeId;
                }
                return;
            }
            else if (!_used[sourceNodeId])
            {
                _path.Push(sourceNodeId);
                dfs(sourceNodeId);
            }
        }
        if (_cycleNode.HasValue) {return;}
        _path.Pop();
        _order.Enqueue(NodeId);
    }
}