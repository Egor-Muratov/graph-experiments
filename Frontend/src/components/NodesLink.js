import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import * as d3 from "d3";
import FORCE from './d3utils';

export class NodesLink extends Component {
  constructor(props) {
    super(props);
    this.LinkRef = React.createRef();
  }
    componentDidMount() {
      this.d3Link = d3.select(this.LinkRef.current)
        .datum(this.props.data)
        .call(FORCE.enterLink);
    }
  
    componentDidUpdate() {
      this.d3Link.datum(this.props.data)
        .call(FORCE.updateLink);
    }

    render() {
      return (
        <g className='link' ref={this.LinkRef}>
          <line className='link-line-base'/>
        </g>
      );
    }
}
