import React, { PureComponent } from 'react';
import * as d3 from "d3";

export class NodesLink extends PureComponent {
  constructor(props) {
    super(props);
    this.LinkRef = React.createRef();
  }
    componentDidMount() {
      if (this.LinkRef) d3.select(this.LinkRef.current).data([this.props.link]);
    }

    componentDidUpdate() {
      if (this.LinkRef) d3.select(this.LinkRef.current).data([this.props.link]);
    }

    render() {
      console.log(`render ${this.constructor.name}`)
      return (
        <g className='linkGroup' >
          <line className='link link-line-base' ref={this.LinkRef}/>
        </g>
      );
    }
}
