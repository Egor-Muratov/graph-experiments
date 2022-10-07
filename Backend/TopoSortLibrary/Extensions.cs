namespace TopoSortLibrary
{

    public static class Extensions
    {
        class DummyEnumerable<T> : IEnumerable<T>
        {
            private readonly Func<IEnumerator<T>> getEnumerator;

            public DummyEnumerable(Func<IEnumerator<T>> getEnumerator)
            {
                this.getEnumerator = getEnumerator;
            }

            public IEnumerator<T> GetEnumerator()
            {
                return getEnumerator();
            }

            System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
            {
                return GetEnumerator();
            }
        }

        public static IEnumerable<TNode> TopoSortByKahn<TNode, TKey>(this IEnumerable<TNode> source, Func<TNode, TKey> getKey, Func<TNode, IEnumerable<TKey>> getDependencies)
        {
            var enumerator = new TopoSortByKahnEnumerator<TNode, TKey>(source, getKey, getDependencies);
            return new DummyEnumerable<TNode>(() => enumerator);
        }

        public static IEnumerable<TNode> TopoSortByDFS<TNode, TKey>(this IEnumerable<TNode> source, Func<TNode, TKey> getKey, Func<TNode, IEnumerable<TKey>> getDependencies)
        {
            return TopoSortByDFSList.Sort(source, getDependencies, getKey);
        }
    }
}
