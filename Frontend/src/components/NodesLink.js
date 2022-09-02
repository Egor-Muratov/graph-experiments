import React, { PureComponent } from 'react';
import * as d3 from "d3";
import styles from './link.module.css';

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
    const label = this.props.selected? <text class={styles.label}>qwe</text> : '';
    return (
        <g className='link' ref={this.LinkRef}>
          <line class={this.props.selected ? styles.selected : styles.unselected}/>
          {label}
        </g>
    );
  }
}
