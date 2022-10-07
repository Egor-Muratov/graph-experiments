namespace TopoSortLibrary
{
    public class TopoSortByKahnEnumerator<TNode, TKey> : IEnumerator<TNode>
    {
        private readonly IEnumerator<TNode> source;
        private readonly Func<TNode, TKey> getKey;
        private readonly Func<TNode, IEnumerable<TKey>> getDependencies;
        private readonly HashSet<TKey> sortedNodes;
        private readonly Queue<TNode> readyToOutputNodes;
        private readonly WaitList<TNode, TKey> waitingNodes = new WaitList<TNode, TKey>();

        private TNode current;

        public TopoSortByKahnEnumerator(IEnumerable<TNode> source, Func<TNode, TKey> getKey, Func<TNode, IEnumerable<TKey>> getDependencies)
        {
            this.source = source.GetEnumerator();
            this.getKey = getKey;
            this.getDependencies = getDependencies;

            readyToOutputNodes = new Queue<TNode>();
            sortedNodes = new HashSet<TKey>();
        }

        public TNode Current
        {
            get { return current; }
        }

        public void Dispose()
        {
            source.Dispose();
        }

        object System.Collections.IEnumerator.Current
        {
            get { return Current; }
        }

        public bool MoveNext()
        {
            while (true)
            {
                if (readyToOutputNodes.Count > 0)
                {
                    current = readyToOutputNodes.Dequeue();
                    Release(current);
                    return true;
                }

                if (!source.MoveNext())
                {
                    break;
                }

                Process(source.Current);
            }

            if (waitingNodes.Count > 0)
            {
                throw new ArgumentException("Cyclic dependency or missing dependency.");
            }

            return false;
        }

        public void Reset()
        {
            source.Reset();
            sortedNodes.Clear();
            readyToOutputNodes.Clear();
            current = default(TNode);
        }

        private void Process(TNode node)
        {
            var pendingDependencies = getDependencies(node)
                .Where(key => !sortedNodes.Contains(key))
                .ToArray();

            if (pendingDependencies.Length > 0)
            {
                waitingNodes.Add(node, pendingDependencies);
            }
            else
            {
                readyToOutputNodes.Enqueue(node);
            }
        }

        private void Release(TNode item)
        {
            var key = getKey(item);
            sortedNodes.Add(key);

            var releasedNodes = waitingNodes.Remove(key);
            if (releasedNodes != null)
            {
                foreach (var releasedNode in releasedNodes)
                {
                    readyToOutputNodes.Enqueue(releasedNode);
                }
            }
        }
    }
}