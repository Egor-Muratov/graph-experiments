using GraphApp.Enteties;
using System.Diagnostics;

namespace GraphApp.Algorithm;
public class Bfs
{
    private Dictionary<int, bool>? _used;
    private Dictionary<int, List<int>>? _sources;
    private Queue<int>? _order;
    private Stack<int>? _path;
    private int? _cycleNode;

    public bool HasCycle { get { return _cycleNode.HasValue; } }

    public Bfs(Enteties.Graph graph)
    {
        _sources = graph.Nodes.ToDictionary(x => x.Id, x => new List<int>());
        foreach (var link in graph.Links)
        {
            _sources[link.Target].Add(link.Source);
        };
        _used = graph.Nodes.ToDictionary(x => x.Id, x => false);

        _order = new Queue<int>();
        _path = new Stack<int>();
        _cycleNode = null;

        for (int NodeId = 0; NodeId < _sources.Count; NodeId++)
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
    }

    private void dfs(int NodeId) {
        _used[NodeId] = true;

        foreach (var sourceNodeId in _sources[NodeId]) {
            if ( HasCycle || _path.Contains(sourceNodeId)) {
                if (_path.Contains(sourceNodeId)) {
                    _cycleNode = sourceNodeId;
                }
                return;
            } else if (!_used[sourceNodeId]) {
                _path.Push(sourceNodeId);
                dfs(sourceNodeId);
            }
        }
        if (HasCycle) { return; }

        _path.Pop();
        _order.Enqueue(NodeId);
    }

    public int[] GetCycle()
    {
        if (HasCycle)
        {
            var cycle = new List<int>();
            cycle.Add((int)_cycleNode);
            cycle.AddRange( _path.TakeWhile(x => x != _cycleNode).ToList() );
            // Debug.WriteLine("Цикл: " + String.Join(",", cycle));
            return cycle.ToArray();
        }
        else { return new int[0]; }
    }

    public int[] GetOrder()
    {
        if (!HasCycle)
        {
            var order = _order.ToArray();
            // Debug.WriteLine("Обход: " + String.Join(",", order));
            return order;
        }
        else { return new int[0]; }

    }
}