import React, { Component } from 'react';
import FORCE from './d3utils';
import * as d3 from 'd3';
import { NodesLinks } from './NodesLinks';
import { Nodes } from './Nodes';
import { GraphOrderControl, GraphParamControl } from './GraphForm';

export class Graph extends Component {

  simulation = null;

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
      displayHeight: 600,
      displayWidth: 1000,
      height: 2000,
      width: 2000,
    }
    this.handleInputBind = this.handleInput.bind(this);
    this.addNodeBind = this.addNode.bind(this);
    this.getNewGraphBind = this.getNewGraph.bind(this);
  }

  componentDidMount() {
    this.fetchGraph();
    const data = this.state;
    this.initForce();
    this.drawTicks();
    this.addZoomCapabilities();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.nodes !== this.state.nodes || prevState.links !== this.state.links) {
      const data = this.state;
      this.initForce();
      this.drawTicks();
    }
  }

  initForce = () => {
    this.simulation = d3
      .forceSimulation()
      .nodes(this.state.nodes)
      .force("charge", d3.forceManyBody().strength(-20))
      .force("link", d3.forceLink(this.state.links).strength(2).distance(20))
      // .force("link", d3.forceLink(links).strength(2))
      .force("center", d3.forceCenter().x(this.state.width / 2).y(this.state.height / 2))
      .force("collide", d3.forceCollide(10).iterations(5));
  }

  drawTicks = () => {
    const nodes = d3.select(this.GraphRef.current).selectAll('.node');
    const links = d3.select(this.GraphRef.current).selectAll('.link');
    const {width, height} = this.state;

    if (this.simulation) {
      this.simulation.on('tick', onTickHandler)
    }
    
    function onTickHandler() {
      nodes
        .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
        // .attr('cx', (d) => { return d.x = Math.max(30, Math.min(width - 30, d.x)); })
        // .attr('cy', (d) => { return d.y = Math.max(30, Math.min(height - 30, d.y)); })
        .attr('cx', (d) => d.x )
        .attr('cy', (d) => d.y )

      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
    }
  }

  addZoomCapabilities = () => {
    const container = d3.select(this.GraphRef.current)
    const zoom = d3.zoom().on('zoom', handleZoom);

    container.call(zoom);

    function handleZoom(e) {
      container.select('svg g')
        .attr('transform', e.transform);
    }

    container.call(zoom)
  }

  restartDrag = () => { if (this.simulation) this.simulation.alphaTarget(0.1).restart() }

  stopDrag = () => { if (this.simulation) this.simulation.alphaTarget(0) }

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
    console.log(`render ${this.constructor.name}`)
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
        <svg className="graph" ref={this.GraphRef} width={"100%"} height={"100%"} viewBox={"0 0 "+this.state.width+" "+this.state.height}>
          <ArrowMemo />
          <g>
          {this.state.loading ? <text className={"loading-placeholder-txt"} x={this.state.width / 2} y={this.state.height / 4}>loading... </text> : <text></text>}
          <NodesLinks links={this.state.links} />
          <Nodes nodes={this.state.nodes} currentOrder={this.state.currentOrder} restartDrag={this.restartDrag} stopDrag={this.stopDrag} />
          </g>
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

