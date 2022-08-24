import React, { Component } from 'react';
import FORCE from './d3utils';
import { Node } from './Node';
import { NodesLink } from './NodesLink';
import { GraphOrderControl, GraphParamControl } from './GraphForm';

export class Graph extends Component {
  constructor(props) {
    super(props)
    this.GraphRef = React.createRef();
    this.state = {
      addLinkArray: [],
      newNodeName: "",
      nodes: [
        { "id": 0, "order": 0, "name": "0" },
        { "id": 1, "order": 1, "name": "1" },
        { "id": 2, "order": 2, "name": "2" },
        { "id": 3, "order": 3, "name": "3" },
        { "id": 4, "order": 4, "name": "4" },
        { "id": 5, "order": 5, "name": "5" },
        { "id": 6, "order": 6, "name": "6" },
        { "id": 7, "order": 7, "name": "7" },
        { "id": 8, "order": 8, "name": "8" }],
      links: [{ "id": 0, "name": "Link from node 4 N1", "source": 4, "target": 2 },
      { "id": 1, "name": "Link from node 8 N1", "source": 8, "target": 0 },
      { "id": 2, "name": "Link from node 8 N2", "source": 8, "target": 3 }],
      nodesCount: 10,
      minLinks: 0,
      maxLinks: 3,
      currentOrder: 0,
      orderLength: 0,
      hasCycle: false,
      loading: true,
      height: 0,
      width: 0,
    }
    this.handleInputBind = this.handleInput.bind(this);
    this.addNodeBind = this.addNode.bind(this);
    this.getNewGraphBind = this.getNewGraph.bind(this);
  }

  componentDidMount() {
    this.fetchGraph();
    const data = this.state;
    const height = this.GraphRef.current.clientHeight;
    this.setState({ height: height });
    const width = this.GraphRef.current.clientWidth;
    this.setState({ width: width });
    FORCE.initForce(data.nodes, data.links)
    FORCE.tick(this.GraphRef.current)
    FORCE.drag()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nodes !== this.state.nodes || prevState.links !== this.state.links) {
      const data = this.state;
      FORCE.initForce(data.nodes, data.links)
      FORCE.tick(this.GraphRef.current)
      FORCE.drag()
    }
    // if (prevState.currentOrder !== this.setState.currentOrder) {
    //   FORCE.setCurrentOrder(this.setState.currentOrder)
    // }
  }

  getNewGraph(e) {
    e.preventDefault();
    this.fetchGraph();
  }

  async fetchGraph() {
    this.setState({ loading: true });
    const response = await fetch(`api/graph/${this.state.nodesCount}/${this.state.minLinks}/${this.state.maxLinks}`);
    const data = await response.json();
    this.setState(
      {
        nodes: data.nodes,
        links: data.links,
        orderLength: data.orderLength,
        hasCycle: data.hasCycle,
        loading: false
      })
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addNode(e) {
    e.preventDefault();
    this.setState(prevState => ({
      nodes: [...prevState.nodes, { name: this.state.newNodeName, id: prevState.nodes.length + 1, }], newNodeName: ''
    }));
  }

  render() {
    return (
      <div>
        <div className="row row-sm">
          <GraphParamControl
            nodesCount={this.state.nodesCount}
            minLinks={this.state.minLinks}
            maxLinks={this.state.maxLinks}
            handleInputBind={this.handleInputBind}
            getNewGraphBind={this.getNewGraphBind}
            disabled={this.state.loading}
          />
          <GraphOrderControl
            name="currentOrder"
            value={this.state.currentOrder}
            max={this.state.orderLength}
            label={this.state.hasCycle ? "Шаг обхода цикла" : "Шаг обхода графа"}
            onChange={this.handleInputBind}
            disabled={this.state.loading}
          />
        </div>
        <svg className="graph" ref={this.GraphRef} width={FORCE.width} height={FORCE.height} viewBox={"0 0 " + this.state.width + " " + this.state.height}>
          <ArrowMemo />
          {this.state.loading ? <text className={"loading-placeholder-txt"} x={FORCE.width / 2} y={FORCE.height / 4}>loading... </text> : <text></text>}
          <LinksMemo links={this.state.links} />
          <NodesMemo nodes={this.state.nodes} currentOrder={this.state.currentOrder} />
        </svg>
      </div>
    );
  }
}

const ArrowMemo = React.memo(
  function Arrow() {
    return (
      <defs>
        <marker id="arrow-head" markerWidth="10" markerHeight="10" refX="6" refY="1" orient="auto">
          <path d="M0,0 L0,2 L3,1 L0,0" style={{ fill: '#000000' }} />
        </marker>
      </defs>
    )
  }
);

const NodesMemo = React.memo(
  function Nodes({ nodes, currentOrder }) {
    return (
      nodes.map((node) => {
        return (
          <Node
            data={node}
            name={node.name}
            key={node.id}
            currentOrder={currentOrder}
          />)
      })
    )
  }
);

const LinksMemo = React.memo(
  function Links({ links }) {
    return (
      links.map((link) => {
        return (
          <NodesLink
            key={link.id}
            data={link}
          />)
      })
    )
  }
);

function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map(i => ({ id: i })),
    links: [...Array(N).keys()]
      .filter(id => id)
      .map(id => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
      }))
  };
}

