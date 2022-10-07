using MediatR;

namespace GraphApp.Queries.Node
{
    public class GetNodeDetailsQuery : IRequest<NodeDetailsDTO>
    {
        public Guid Id { get; set; }
    }
}

