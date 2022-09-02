import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import { NodesLinks } from './NodesLinks';
import { Nodes } from './Nodes';
import { Button, Offcanvas, OffcanvasHeader, OffcanvasBody, InputGroup, Input, InputGroupText } from 'reactstrap';
// import { GraphOrderControl, GraphParamControl } from './GraphForm';
// import customData from '../static/baseGraph.json';

const isNumber = (num) => {
  num = "" + num; //coerce num to be a string
  return !isNaN(num) && !isNaN(parseFloat(num));
}

export class GraphChart extends PureComponent {

  simulation = null;

  constructor(props) {
    super(props)
    this.GraphRef = React.createRef();
    this.state = {
      simulationParam: {
        chargeStrength: -50,
        linkStrength: 1,
        linkDistance: 40,
        collideRadius: '',
        collideStrength: '',
        xStrength: '',
        yStrength: '',
        centerStrength: '',
        radialStrength: '',
        radialRadius: '',
        alpha: '',
        alphaDecay: '',
        alphaTarget: ''
      },
      nodeParam: {
        id: '',
        name: '',
        x: '',
        y: '',
        fixit:false
      },
      stopped: false,
      showForceParam: false,
      showNodeParam: false,
      selectedNode: null,
      selectedLink: null
    }
    this.handleSimulationParamInputBind = this.handleSimulationParamInput.bind(this);
    this.toggleShowSimulationParamBind = this.toggleShowSimulationParam.bind(this);
  }

  componentDidMount() {
    this.initForce();
    this.setForceParam();
    this.drawTicks();
    this.addZoom();
    this.addDoubleClick();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.nodes !== this.props.nodes || prevProps.links !== this.props.links) {
      this.updateForce();
      this.drawTicks();
      // this.restartIfNeeded();
    }
    if (prevState.simulationParam !== this.state.simulationParam) {
      
      // this.restartIfNeeded();
    }

    if (prevState.stopped !== this.state.stopped) {
      this.state.stopped ? this.simulation.stop() : this.simulation.restart();
    }
  }

  initForce = () => {
    this.simulation = d3.forceSimulation()
      .nodes(this.props.nodes)
      .force("link", d3.forceLink(this.props.links).id(d => d.id))
  }

  updateForce = () => {
    this.simulation
      .nodes(this.props.nodes)
      .force("link").links(this.props.links);
    if (this.simulation.alpha() < 0.1) this.simulation.alpha(0.1).restart();
  }

  setForceParam = () => {
    const {
      chargeStrength,
      linkStrength,
      linkDistance,
      centerStrength,
      collideRadius,
      collideStrength,
      xStrength,
      yStrength,
      radialRadius,
      radialStrength,
      alpha,
      alphaDecay,
      alphaTarget
    } = this.state.simulationParam;

    if (isNumber(linkStrength) && isNumber(linkDistance))
      this.simulation.force("link")
        .strength(linkStrength)
        .distance(linkDistance)

    if (isNumber(chargeStrength)) {
      this.simulation.force(
        "charge",
        d3.forceManyBody().strength(chargeStrength)
      )
    } else {
      this.simulation
        .force("charge", null)
    }

    if (isNumber(centerStrength)) {
      this.simulation.force(
        "center",
        d3.forceCenter()
          .x(this.props.width / 2)
          .y(this.props.height / 2)
          .strength(centerStrength)
      )
    } else {
      this.simulation.force("center", null)
    }

    if (isNumber(collideRadius) && isNumber(collideStrength)) {
      this.simulation.force(
        "collide",
        d3.forceCollide()
          .radius(collideRadius)
          .strength(collideStrength)
      )
    } else {
      this.simulation.force("collide", null)
    }

    if (isNumber(xStrength)) {
      this.simulation.force(
        'x',
        d3.forceX()
          .x(this.props.width / 2)
          .strength(xStrength))
    } else {
      this.simulation.force("x", null)
    }

    if (isNumber(yStrength)) {
      this.simulation.force(
        'y',
        d3.forceY()
          .y(this.props.height / 2)
          .strength(yStrength))
    } else {
      this.simulation.force("y", null)
    }

    if (isNumber(radialRadius) && isNumber(radialStrength)) {
      this.simulation.force(
        "radial",
        d3.forceRadial()
          .radius(radialRadius)
          .x(this.props.width / 2)
          .y(this.props.height / 2)
          .strength(radialStrength)
      )
    } else {
      this.simulation.force("radial", null)
    }
    if (isNumber(alpha)) {
      console.log('setAlpha')
      this.simulation.alpha(alpha)
    }
    if (isNumber(alphaDecay)) {
      console.log('alphaDecay')
      this.simulation.alphaDecay(alphaDecay)
    }
    if (isNumber(alphaTarget)) {
      console.log('alphaTarget')
      this.simulation.alphaTarget(alphaTarget)
    }
    // this.simulation.alphaTarget(first ? 0 : 0.7)
    // this.simulation.alpha(first ? 1 : 0.7)
  }

  drawTicks = () => {
    const nodes = d3.select(this.GraphRef.current).selectAll('.node');
    const links = d3.select(this.GraphRef.current).selectAll('.link');
    const { width, height } = this.props;

    if (this.simulation) {
      this.simulation.on('tick', onTickHandler)
    }

    function onTickHandler() {
      nodes
        .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
      // .attr("fill", d => d.children ? null : "#000")
      // .attr("stroke", d => d.children ? null : "#fff")

      links
        .select('line')
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
      links
        .select('text')
        .attr("transform", (d) => `translate(${d.source.x + (d.target.x-d.source.x)/2},${d.source.y + (d.target.y-d.source.y)/2})`)
      // .attr("r", (d) =>d.target.length)
    }
  }

  addZoom = () => {
    const container = d3.select(this.GraphRef.current)
    const zoom = d3.zoom().on('zoom', handleZoom);

    container.call(zoom).on("dblclick.zoom", null);

    function handleZoom(e) {
      container.select('svg g')
        .attr('transform', e.transform);
    }
  }

  addDoubleClick = () => {
    const addNodeBind = this.props.addNodeBind;
    const simulation = this.simulation;
    d3.select(this.GraphRef.current).on("dblclick", onDoubleClick);

    function onDoubleClick(event, d) {
      console.log("DoubleClickedSVG: ", event);
      if (event.target == this) {
        let transform = d3.zoomTransform(this);
        let [x, y] = transform.invert(d3.pointer(event));
        console.log("DoubleClickedRealSVG_X_Y: ", x, y);
        simulation.alpha(0.2);
        addNodeBind(x, y);
      }
    }
  }

  restartDrag = () => {
    if (this.simulation) {
      this.simulation
        .alphaTarget(0.01)
        // .alpha(this.simulation.alpha() < 0.1 ? 0.1 : this.simulation.alpha())
        .restart()
    }
  }
  stopDrag = () => {
    if (this.simulation) this.simulation.alphaTarget(0)
  }

  stopStartSimulation = () => {
    // this.setState((state, props) => ({ stoped: !state.stopped }))
    this.setForceParam();
    this.simulation.alpha(1).restart()
  }

  updateNode = () => {
    this.props.updNodeBind(this.state.selectedNode)
  }

  handleSimulationParamInput(e) {
    this.setState((state, props) => ({
      simulationParam: {
        ...state.simulationParam,
        [e.target.name]: e.target.value
      }
    }))
  }
  
  handleNodeParamInput = (e) => {
    this.setState((state, props) => ({
      selectedNode: {
        ...state.selectedNode,
        [e.target.name]: e.target.value
      }
    }))
  } 

  toggleShowSimulationParam() { this.setState({ showForceParam: !this.state.showForceParam }) }

  toggleShowNodeParam = () => { this.setState({ showNodeParam: !this.state.showNodeParam }) }

  handleSelectNode(node) { this.setState({ selectedNode: node }) }

  clickNode = (d) => {
    if (!this.state.selectedNode) {
      console.log("Select source: ", d.id + ': ' + d.name);
    }
    else if (this.state.selectedNode.id == d.id) {
      console.log("Unselect: ", d.id + ': ' + d.name)
    }
    else {
      console.log("Select target: ", d.id + ': ' + d.name);
      this.props.addLinkBind(this.state.selectedNode.id, d.id)
    }
    this.handleSelectNode(this.state.selectedNode ? null : d)
  }

  clickLink = (d) => {
    if (this.state.selectedLink !== null && this.state.selectedLink.id == d.id) {
      console.log("Unselect link: ", d.id + ': ' + d.name)
      this.setState({ selectedLink: null })
    } 
    else {
      console.log("Select link: ", d.id + ': ' + d.name);
      this.setState({ selectedLink: d })
    }
    if (this.simulation.alpha() < 0.05) this.simulation.alpha(0.05).restart();
  }

  delAndUnselectNode = (d) => {
    this.handleSelectNode(null)
    this.props.delNodeBind(d)
  }

  render() {
    console.log(`render ${this.constructor.name}`)
    const paramInputs = Object
      .entries(this.state.simulationParam)
      .map(([paramName, value]) => (
        <InputGroup key={`ig_${paramName}`} size="sm">
          <InputGroupText key={`igt_${paramName}`}>{paramName}</InputGroupText>
          <Input key={`i_${paramName}`} value={this.state.simulationParam[paramName]} name={paramName} type="text" aria-label={paramName} className="form-control" onChange={this.handleSimulationParamInputBind} />
        </InputGroup>
      ))
    const nodeInputs = !this.state.selectedNode ? 'Выделите узел' : Object
      .entries(this.state.nodeParam)
      .map(([paramName, value]) => (
        <InputGroup key={`ig_${paramName}`} size="sm">
          <InputGroupText key={`igt_${paramName}`}>{paramName}</InputGroupText>
          <Input key={`i_${paramName}`} value={this.state.selectedNode[paramName]} name={paramName} type="text" aria-label={paramName} className="form-control" onChange={this.handleNodeParamInput} />
        </InputGroup>
      ))
    return (
      <div>
        <Button color="primary" onClick={this.toggleShowSimulationParamBind}>Параметры визуализации</Button>
        <Offcanvas isOpen={this.state.showForceParam} toggle={this.toggleShowSimulationParamBind}>
          <OffcanvasHeader toggle={this.toggleShowSimulationParamBind}>
            Параметры визуализации
          </OffcanvasHeader>
          <OffcanvasBody>
            <button onClick={this.stopStartSimulation} className="form-control">Обновить</button>
            {paramInputs}
          </OffcanvasBody>
        </Offcanvas>

        <Button color="primary" onClick={this.toggleShowNodeParam}>Параметры узла</Button>
        <Offcanvas fade={false} backdrop={false} isOpen={this.state.showNodeParam} toggle={this.toggleShowNodeParam}>
          <OffcanvasHeader toggle={this.toggleShowNodeParam}>
            Параметры узла
          </OffcanvasHeader>
          <OffcanvasBody>
            <Button onClick={this.updateNode} className="form-control">Применить</Button>
            {nodeInputs}
          </OffcanvasBody>
        </Offcanvas>

        <svg 
        // preserveAspectRatio="xMaxYMid meet"
          className="graph"
          outline="1px solid red"
          ref={this.GraphRef}
          width={this.props.displayWidth}
          height={this.props.displayHeight}
          viewBox={-this.props.width / 2 + " " + -this.props.height / 2 + " " + this.props.width + " " + this.props.height}
        // onDoubleClick={this.props.addNodeBind}
        >
          <ArrowMemo />
          {this.props.loading && <text className={"loading-placeholder-txt"} x='0' y='0'>loading...</text>}
          {/* {this.simulation && <text x={-this.props.width / 2} y={-this.props.height / 2+20}>Alpha:{this.simulation.alpha()}</text>} */}
          <g>
            <NodesLinks
              links={this.props.links}
              delLinkBind={this.props.delLinkBind} 
              onClick={this.clickLink}
              selectedLinkId={ this.state.selectedLink !== null ? this.state.selectedLink.id : null}
            />

            <Nodes
              nodes={this.props.nodes}
              currentOrder={this.props.currentOrder}
              selectedNodeId={ this.state.selectedNode !== null ? this.state.selectedNode.id : null}
              restartDrag={this.restartDrag}
              stopDrag={this.stopDrag}
              onDoubleClick={this.delAndUnselectNode}
              onClick={this.clickNode}
            />
          </g>
        </svg>
      </div>
    );
  }
}

const ArrowMemo = React.memo(
  function Arrow() {
    return (
      <defs>
        <marker id="arrow-black" markerWidth="10" markerHeight="10" refX="10" refY="2" orient="auto">
          <path d="M0,0 L0,4 L10,2 L0,0" style={{ fill: '#000000' }} />
        </marker>
        <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="10" refY="2" orient="auto">
          <path d="M0,0 L0,4 L10,2 L0,0" style={{ fill: '#be1717' }} />
        </marker>
        <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="10" refY="2" orient="auto">
          <path d="M0,0 L0,4 L10,2 L0,0" style={{ fill: '#1d3cb8' }} />
        </marker>
        
      </defs>
    )
  }
);


