import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { GraphChart } from './GraphChart'
import { GraphOrderControl } from './GraphForm'
import { GraphParamControl } from './GraphForm'
import { nanoid } from 'nanoid'
import { json } from 'd3'
import { Button, Offcanvas, OffcanvasHeader, OffcanvasBody, FormGroup, Input, InputGroupText, Form } from 'reactstrap';

export class GraphContainer extends PureComponent {
  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      nodes: [
        { "id": 0, "order": 0, "name": "0", fx: 0, fy: 0 },
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
      nodesCount: 100,
      minLinks: 1,
      maxLinks: 1,
      currentOrder: 0,
      orderLength: 0,
      hasCycle: false,
      loading: true,
      displayHeight: "70vh",
      displayWidth: "100%",
      height: 600,
      width: 600,
      fileData: null,
      showGraphParam: false
    }
    this.handleInputBind = this.handleInput.bind(this);
    this.addNodeBind = this.addNode.bind(this);
    this.delNodeBind = this.delNode.bind(this);
    this.updNodeBind = this.updNode.bind(this);
    this.addLinkBind = this.addLink.bind(this);
    this.delLinkBind = this.delLink.bind(this);
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

  addNode(x, y) {
    this.setState((prevState, props) => {
      let id = nanoid();
      console.log("addNode: ", id);
      return {
        nodes: [...prevState.nodes, {
          name: `${prevState.nodes.length + 1}`,
          id: id,
          startX: x,
          startY: y
        }]
      }
    })
  }
  updNode(node) {
    console.log("updNode: ", node);
    if (node === null) return;
    this.setState((prevState, props) => {
      let nodes = [...prevState.nodes]
      let nodeIndex = nodes.findIndex((prevNode => prevNode.id == node.id));
      nodes[nodeIndex].name = node.name;
      return {
        nodes: nodes
      }
    })
  }
  delNode(d) {
    console.log("delNode: ", d.id);
    let filteredNodes = this.state.nodes.filter(node => node.id !== d.id);
    let filteredLinks = this.state.links.filter(link => link.target.id !== d.id && link.source.id !== d.id)
    this.setState({
      nodes: filteredNodes,
      links: filteredLinks
    });
  }


  addLink(source, target) {
    console.log("addLink: ", source + "->" + target);
    this.setState(prevState => ({
      links: [...prevState.links, { source: source, target: target, id: nanoid(), }]
    }));
  }

  delLink(d) {
    console.log("delLink: ", d.id);
    let filteredLinks = this.state.links.filter(link => link.id !== d.id)
    this.setState({
      links: filteredLinks
    });
  }

  uploadFile = (event) => {
    const fileReader = new FileReader();

    fileReader.onload = e => {
      console.log("e.target.result", e.target.result);
      this.setState({ fileData: JSON.parse(e.target.result) })
    };
    fileReader.readAsText(event.target.files[0]);
  }

  updateData = (e) => {
    if (this.state.fileData != null)
      this.setState({ ...this.state.fileData })
  }

  toggleShowGraphParam = () => {
    this.setState((state) => { return { showGraphParam: !state.showGraphParam } })
  }

  render() {
    const { nodes, links } = this.state;
    const jsonLinks = links.map(link => {
      if (typeof link.target === 'object' && link.target !== null) {
        return { ...link, target: link.target.id, source: link.source.id }
      } else {
        return { ...link }
      }
    });
    const href = nodes ? `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ nodes: nodes, links: jsonLinks }))}` : '';

    return (
      <div>
        <Button color="primary" onClick={this.toggleShowGraphParam}>Параметры графа</Button>
        <Offcanvas isOpen={this.state.showGraphParam} toggle={this.toggleShowGraphParam}>
          <OffcanvasHeader toggle={this.toggleShowGraphParam}>
            Параметры графа
          </OffcanvasHeader>
          <OffcanvasBody>
            <Form>
              <FormGroup row>
                <Button color="primary" size='sm' href={href} download='filename.json'>Сохранить в JSON</Button>
              </FormGroup>
              <FormGroup row>
                <Input type="file" size='sm' name="myFile" onChange={this.uploadFile} />
                <Button color="primary" size='sm' onClick={this.updateData}>Загрузить из JSON</Button>
              </FormGroup>
            </Form>

            <GraphParamControl
              nodesCount={this.state.nodesCount}
              minLinks={this.state.minLinks}
              maxLinks={this.state.maxLinks}
              handleInputBind={this.handleInputBind}
              getNewGraphBind={this.getNewGraphBind}
              disabled={this.state.loading}
            />
          </OffcanvasBody>
        </Offcanvas>
        {/* <div className="row row-sm">
          <GraphOrderControl
            name="currentOrder"
            value={this.state.currentOrder}
            max={this.state.orderLength}
            label={this.state.hasCycle ? "Шаг обхода цикла" : "Шаг обхода графа"}
            onChange={this.handleInputBind}
            disabled={this.state.loading}
          />
        </div> */}
        <GraphChart
          delNodeBind={this.delNodeBind}
          addNodeBind={this.addNodeBind}
          updNodeBind={this.updNodeBind}
          delLinkBind={this.delLinkBind}
          addLinkBind={this.addLinkBind}
          {...this.state} />
      </div>
    )
  }
}
