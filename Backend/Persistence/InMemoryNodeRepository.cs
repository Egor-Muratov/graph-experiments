using GraphApp.Enteties;
using GraphApp.GraphHelpers;

namespace GraphApp.Repositories
{
    class InMemoryNodeRepository
    {
        private List<Node> nodes;

        public InMemoryNodeRepository()
        {
            nodes = new();
        }

        public Node GetNode(Guid id)
        {
            return nodes.Where(node => node.Id == id).FirstOrDefault();
        }

        public List<Node> GetNodes()
        {
            return nodes;
        }

        public void CreateNode(Node node) {
            nodes.Add(node);
        }
        public void UpdateNode(Node node) {
            var index = nodes.FindIndex(ExistingNode => ExistingNode.Id == node.Id);
            nodes[index] = node;
        }

        public void DeleteNode(Guid id) {
            var index = nodes.FindIndex(ExistingNode => ExistingNode.Id == id);
            nodes.RemoveAt(index);
        }

        public void GenNodes(int count)
        {
            nodes = GraphHelper.genNodes(count);
        }

    }
}