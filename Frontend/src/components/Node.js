import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import * as d3 from "d3";
import FORCE from './d3utils';
import './Graph.css';

export class Node extends Component {
  constructor(props) {
    super(props);
    this.NodeRef = React.createRef();
  }
  componentDidMount() {
    this.d3Node = d3.select(this.NodeRef.current)
      .datum(this.props.data)
      .call(FORCE.enterNode)
  }

  componentDidUpdate() {
    this.d3Node.datum(this.props.data)
      .call(FORCE.updateNode)
  }

  render() {
    var selected = this.props.currentOrder 
                && this.props.data.order 
                && (this.props.data.order <= this.props.currentOrder) 
    return (
      <g className='node' ref={this.NodeRef}>
        <circle 
          className={selected ? "node-circle-sel" : "node-circle-nosel"} 
          onClick={this.props.addLink} />
        <text className={selected ? "node-text-sel" : "node-text-nosel"} >{this.props.data.name}</text>
      </g>
    );
  }
}
