import { PureComponent } from 'react';
import { Node } from './Node'
import * as d3 from 'd3';

export class Nodes extends PureComponent {

    componentDidMount() {
        this.drag();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.nodes != this.props.nodes)
            this.drag();
    }
    drag = () => {
        const { props } = this
        d3.selectAll('.node')
            .call(d3.drag()
            .on("start", onDragStart)
            .on("drag", onDrag)
            .on("end", onDragEnd))

        function onDragStart(event, d) {
            if (!event.active) props.restartDrag();
            d.fx = d.x;
            d.fy = d.y;
            console.log(`onDragStart node ${d.name}`)
        }
        function onDrag(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function onDragEnd(event, d) {
            if (!event.active) props.stopDrag();
            d.fx = null;
            d.fy = null;
        }
    }

    render() {
        console.log(`render ${this.constructor.name}`)
        const { currentOrder } = this.props;
        const nodes = this.props.nodes.map((node) => {
            return <Node
                key={node.id}
                node={node}
                currentOrder={currentOrder} />
        })
        return <g className='nodes'>{nodes}</g>
    }
}