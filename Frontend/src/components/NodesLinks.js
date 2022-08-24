import { PureComponent } from 'react';
import { NodesLink } from './NodesLink'

export class NodesLinks extends PureComponent {

    render() {
        const links = this.props.links.map((link) => {
            return <NodesLink key={link.id} link={link}/>
        })
        return <g className='links'>{links}</g>
    }
}