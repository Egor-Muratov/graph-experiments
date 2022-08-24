import React, { PureComponent } from 'react';
import * as d3 from "d3";
import './Graph.css';

export class Node extends PureComponent {
  constructor(props) {
    super(props);
    this.NodeRef = React.createRef();
  }
  componentDidMount() {
    if (this.NodeRef) d3.select(this.NodeRef.current).data([this.props.node])
  }

  componentDidUpdate() {
    if (this.NodeRef) d3.select(this.NodeRef.current).data([this.props.node])
  }

  render() {
    console.log(`render ${this.constructor.name}`)
    var selected = this.props.currentOrder 
                && this.props.node.order 
                && (this.props.node.order <= this.props.currentOrder)
    return (
      <g className='node' ref={this.NodeRef}>
        <circle 
          className={selected ? "node-circle-sel" : "node-circle-nosel"} 
          onClick={this.props.addLink}/>
        <text className={selected ? "node-text-sel" : "node-text-nosel"} >{this.props.node.name}</text>
      </g>
    );
  }
}
