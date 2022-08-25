import { PureComponent } from 'react';
import { Node } from './Node'
import * as d3 from 'd3';

export class Nodes extends PureComponent {
    selectedNodes = [];

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
            if (!event.active) props.restartDrag();
            d.fx = d.x;
            d.fy = d.y;
            console.log(`onDragStart node ${d.name}`)
        }
        function onDrag(event, d) {
            d.fx = event.x;
            d.fy = event.y;
            // d3.select(this)
            // .attr("transform", (d) => "translate(" + event.x + "," + event.y + ")")
            // .attr('cx', (d) => event.x)
            // .attr('cy', (d) => event.y)
        }
        function onDragEnd(event, d) {
            if (!event.active) props.stopDrag();
            // d.x = d.fx;
            // d.y = d.fy;
            d.fx = null;
            d.fy = null;
        }
    }

    doubleClick = () => {
        const delNodeBind = this.props.delNodeBind;
        d3.selectAll('.node').on("dblclick",onDoubleClick);

        function onDoubleClick(event, d) {
            console.log("DoubleClicked: ", d);
            delNodeBind(d);
        }
    }

    oneClick = () => {
        d3.selectAll('.node').on("click", (event,d) => this.clickNode(d));
    }

    clickNode = (d) => { 
        this.selectedNodes.push(d);
        console.log("Selected: ", this.selectedNodes);  }

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