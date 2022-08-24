import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import { NodesLinks } from './NodesLinks';
import { Nodes } from './Nodes';
// import { GraphOrderControl, GraphParamControl } from './GraphForm';
// import customData from '../static/baseGraph.json';


export class GraphChart extends PureComponent {

  simulation = null;

  constructor(props) {
    super(props)
    this.GraphRef = React.createRef();
  }

  componentDidMount() {
    this.initForce();
    this.drawTicks();
    this.addZoomCapabilities();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.nodes !== this.props.nodes || prevProps.links !== this.props.links) {
      this.initForce();
      this.drawTicks();
    }
  }

  initForce = () => {
    this.simulation = d3
      .forceSimulation()
      .nodes(this.props.nodes)
      .force("charge", d3.forceManyBody().strength(-20))
      .force("link", d3.forceLink(this.props.links).strength(1).distance(20))
      .force("center", d3.forceCenter().x(this.props.width / 2).y(this.props.height / 2))
      .force("collide", d3.forceCollide(10).iterations(5));
  }

  drawTicks = () => {
    const nodes = d3.select(this.GraphRef.current).selectAll('.node');
    const links = d3.select(this.GraphRef.current).selectAll('.link');
    const { width, height } = this.props;

    if (this.simulation) {
      this.simulation.on('tick', onTickHandler)
    }

    function onTickHandler() {
      nodes
        .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
        // .attr('cx', (d) => { return d.x = Math.max(30, Math.min(width - 30, d.x)); })
        // .attr('cy', (d) => { return d.y = Math.max(30, Math.min(height - 30, d.y)); })
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)

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
  }

  restartDrag = () => { if (this.simulation) this.simulation.alphaTarget(0.1).restart() }
  stopDrag = () => { if (this.simulation) this.simulation.alphaTarget(0) }

  render() {
    console.log(`render ${this.constructor.name}`)
    return (
      <svg 
        className="graph"
        ref={this.GraphRef}
        width={this.props.displayWidth}
        height={this.props.displayHeight}
        viewBox={"0 0 " + this.props.width + " " + this.props.height}
      >
        <ArrowMemo />
        {this.props.loading && <text className={"loading-placeholder-txt"} x={this.props.displayWidth / 2} y={this.props.displayHeight / 4}>loading... </text>}
        <g>
          <NodesLinks links={this.props.links} />
          <Nodes 
            nodes={this.props.nodes} 
            currentOrder={this.props.currentOrder} 
            restartDrag={this.restartDrag} 
            stopDrag={this.stopDrag} 
          />
        </g>
      </svg>
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


