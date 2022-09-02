import React, { PureComponent } from 'react';
import * as d3 from "d3";
import './Graph.css';

export class Node extends PureComponent {
  constructor(props) {
    super(props);
    this.NodeRef = React.createRef();
  }
  componentDidMount() {
    if (this.NodeRef) {
      this.d3selection = d3.select(this.NodeRef.current).data([this.props.node])
      if (this.props.node.startX && this.props.node.startY)
        this.d3selection.attr("transform", (d) => {
          d.fx = d.startX
          d.fy = d.startY
          return "translate(" + d.fx + "," + d.fy + ")"
        })
    }
  }

  componentDidUpdate() {
    this.d3selection.data([this.props.node])
  }
  componentWillUnmount() {
    // this.d3delection.datum([])
  }

  render() {
    console.log(`render ${this.constructor.name}`)
    return (
      <g className='node' ref={this.NodeRef}>
        <circle 
          className={this.props.selected ? "node-circle-sel" : "node-circle-nosel"} 
          />
        <text className={this.props.inOrder ? "node-text-sel" : "node-text-nosel"} dx="10" dy="8">{this.props.label}</text>
      </g>
    );
  }
}
