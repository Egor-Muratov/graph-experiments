import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { GraphChart } from './GraphChart'
import { GraphOrderControl } from './GraphForm'
import { GraphParamControl } from './GraphForm'

export class GraphContainer extends PureComponent {
    static propTypes = {}

    constructor(props) {
        super(props)
        this.state = {
            nodes: [
                { "id": 0, "order": 0, "name": "0" },
                { "id": 1, "order": 1, "name": "1" },
                { "id": 2, "order": 2, "name": "2" },
                { "id": 3, "order": 3, "name": "3" },
                { "id": 4, "order": 4, "name": "4" },
                { "id": 5, "order": 5, "name": "5" },
                { "id": 6, "order": 6, "name": "6" },
                { "id": 7, "order": 7, "name": "7" },
                { "id": 8, "order": 8, "name": "8" }],
              links: [{ "id": 0, "name": "Link from node 4 N1", "source": 4, "target": 2 },
              { "id": 1, "name": "Link from node 8 N1", "source": 8, "target": 0 },
              { "id": 2, "name": "Link from node 8 N2", "source": 8, "target": 3 }],
            nodesCount: 10,
            minLinks: 0,
            maxLinks: 3,
            currentOrder: 0,
            orderLength: 0,
            hasCycle: false,
            loading: true,
            displayHeight: 600,
            displayWidth: 1000,
            height: 1200,
            width: 2000,
        }
        this.handleInputBind = this.handleInput.bind(this);
        this.addNodeBind = this.addNode.bind(this);
        this.getNewGraphBind = this.getNewGraph.bind(this);
    }

    componentDidMount() { 
        this.fetchGraph();
     }

    getNewGraph(e) {
        e.preventDefault();
        this.fetchGraph();
      }
    
      async fetchGraph() {
        this.setState({ loading: true });
        const response = await fetch(`api/graph/${this.state.nodesCount}/${this.state.minLinks}/${this.state.maxLinks}`);
        const data = await response.json();
        this.setState(
          {
            nodes: data.nodes,
            links: data.links,
            orderLength: data.orderLength,
            hasCycle: data.hasCycle,
            loading: false
          })
      }
    
      handleInput(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
      addNode(e) {
        e.preventDefault();
        this.setState(prevState => ({
          nodes: [...prevState.nodes, { name: this.state.newNodeName, id: prevState.nodes.length + 1, }], newNodeName: ''
        }));
      }

    render() {
        return (
            <div>
                <div className="row row-sm">
                    <GraphParamControl
                        nodesCount={this.state.nodesCount}
                        minLinks={this.state.minLinks}
                        maxLinks={this.state.maxLinks}
                        handleInputBind={this.handleInputBind}
                        getNewGraphBind={this.getNewGraphBind}
                        disabled={this.state.loading}
                    />
                    <GraphOrderControl
                        name="currentOrder"
                        value={this.state.currentOrder}
                        max={this.state.orderLength}
                        label={this.state.hasCycle ? "Шаг обхода цикла" : "Шаг обхода графа"}
                        onChange={this.handleInputBind}
                        disabled={this.state.loading}
                    />
                </div>
                <GraphChart {...this.state} />
            </div>
        )
    }
}
