namespace TopoSortLibrary
{
    public class WaitList<TNode, TKey>
    {
        class WaitingNode<T>
        {
            private int dependencyCount;
            public T Item { get; private set; }

            public WaitingNode(T item, int dependencyCount)
            {
                Item = item;
                this.dependencyCount = dependencyCount;
            }

            public bool DecreaseDependencyCount()
            {
                dependencyCount--;
                return (dependencyCount == 0);
            }
        }

        private readonly Dictionary<TKey, List<WaitingNode<TNode>>> dependencies = new Dictionary<TKey, List<WaitingNode<TNode>>>();

        public void Add(TNode item, ICollection<TKey> pendingDependencies)
        {
            var node = new WaitingNode<TNode>(item, pendingDependencies.Count);

            foreach (var dependency in pendingDependencies)
            {
                Add(dependency, node);
            }
        }

        public IEnumerable<TNode> Remove(TKey key)
        {
            List<WaitingNode<TNode>> nodeList;
            var found = dependencies.TryGetValue(key, out nodeList);

            if (found)
            {
                dependencies.Remove(key);
                return nodeList.Where(x => x.DecreaseDependencyCount()).Select(x => x.Item);
            }

            return null;
        }

        private void Add(TKey key, WaitingNode<TNode> node)
        {      
            List<WaitingNode<TNode>> nodeList;
            var found = dependencies.TryGetValue(key, out nodeList);

            if (!found)
            {
                nodeList = new List<WaitingNode<TNode>>();
                dependencies.Add(key, nodeList);
            }

            nodeList.Add(node);
        }

        public int Count
        {
            get { return dependencies.Count; }
        }
    }

    
}
