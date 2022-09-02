import React,{ PureComponent } from 'react';
import { Node } from './Node'
import * as d3 from 'd3';

export class Nodes extends PureComponent {
    constructor(props) {
        super(props);
        this.NodesRef = React.createRef();
        this.state = {
            selectedNode: null
        };
      }

    componentDidMount() {
        
        this.drag();
        this.doubleClick();
        this.oneClick();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.nodes !== this.props.nodes) {
            this.drag();
            this.doubleClick();
            this.oneClick();
        }
    }

    drag = () => {
        const { props } = this
        d3.selectAll('.node')
            .call(d3.drag()
            .on("start", onDragStart)
            .on("drag", onDrag)
            .on("end", onDragEnd))

        function onDragStart(event, d) {
            if (!event.active) {
                console.log('onDragStart')
                props.restartDrag();
            }
            d.fx = d.x;
            d.fy = d.y;
            console.log(`onDragStart node ${d.name}`)
        }
        function onDrag(event, d) {
            d.fx = event.x;
            d.fy = event.y;
            d3.select(this)
            .attr("transform", (d) => "translate(" + event.x + "," + event.y + ")")

        }
        function onDragEnd(event, d) {
            if (!event.active) props.stopDrag();
            d.fx = null;
            d.fy = null;
        }
    }

    doubleClick = () => {
        d3.selectAll('.node').on("dblclick",(event, d) => {
            console.log("DoubleClickedNode: ", d);
            this.props.onDoubleClick(d)
        });
    }

    oneClick = () => {
        d3.selectAll('.node').on("click", (event,d) => {
            console.log("DoubleClickedNode: ", d);
            this.props.onClick(d);
        })
    }

    render() {
        console.log(`render ${this.constructor.name}`)
        const { currentOrder, selectedNodeId } = this.props;
        const nodes = this.props.nodes.map((node) => {
            return <Node
                key={node.id}
                label={node.name}
                node={node}
                inOrder = {node.order < currentOrder}
                selected = {selectedNodeId == node.id} />
        })
        return <g className='nodes' ref={this.NodesRef}>{nodes}</g>
    }
}