import { PureComponent } from 'react';
import { NodesLink } from './NodesLink'
import * as d3 from "d3";

export class NodesLinks extends PureComponent {
    componentDidMount() {
        this.oneClick();
        this.doubleClick();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.links !== this.props.links) {
            this.oneClick();
            this.doubleClick();
        }
    }

    oneClick = () => {
        d3.selectAll('.link').on("click", (event, d) => {
            console.log("ClickedLink: ", d);
            this.props.onClick(d);
        })
    }

    doubleClick = () => {
        d3.selectAll('.link').on("dblclick", (event, d) => {
            console.log("DoubleClickedLink: ", d);
            this.props.delLinkBind(d);
        })
    }
    render() {
        const links = this.props.links.map((link) => {
            return <NodesLink 
                key={link.id} 
                link={link} 
                selected = {this.props.selectedLinkId == link.id}
            />
        })
        return <g className='links'>{links}</g>
    }
}