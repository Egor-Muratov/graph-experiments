import * as d3 from "d3";
import * as ReactDOM from 'react-dom';
// import React, { Component } from 'react';

var FORCE = (function(nsp) {

    var
      width = 1080,
      height = 800,
      color = d3.schemeCategory10,
  
      initForce = (nodes, links) => {
        nsp.force = d3.forceSimulation(nodes)
          .force("charge", d3.forceManyBody().strength(-50))
          .force("link", d3.forceLink(links).distance(20))
          .force("center", d3.forceCenter().x(nsp.width / 2).y(nsp.height / 2))
          .force("collide", d3.forceCollide([10]).iterations([2]));
      },
  
      enterNode = (selection) => {
        // var circle = selection.select('circle')
        //   .attr("r", 8)
          // .style("stroke", "bisque")
          // .style("stroke-width", "2px")
  
        // selection.select('text')
        //   .style("fill", "honeydew")
        //   .style("font-weight", "600")
        //   .style("text-transform", "uppercase")
        //   .style("text-anchor", "middle")
        //   .style("alignment-baseline", "middle")
        //   .style("font-size", "7px")
        //   .style("font-family", "sans-serif")
      },
  
      updateNode = (selection) => {
        selection
          .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
          .attr("cx", function(d) {
            return d.x = Math.max(30, Math.min(width - 30, d.x));
          })
          .attr("cy", function(d) {
            return d.y = Math.max(30, Math.min(height - 30, d.y));
          })
          // selection.select('circle').style("fill", function (d) {
          //   return color[d.group] })
      },
  
      enterLink = (selection) => {
        // selection
        //   .attr("stroke-width", 3)
        //   .attr("stroke", "bisque")
        //   .attr('marker-end', 'url(#arrow-head)')
      },
  
      updateLink = (selection) => {
        selection.select("line")
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      },
  
      updateGraph = (selection) => {
        selection.selectAll('.node')
          .call(updateNode)
        selection.selectAll('.link')
          .call(updateLink);
      },
  
      dragStarted = (event, d) => {
        if (!event.active) nsp.force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y
      },
  
      dragging = (event, d) => {
        d.fx = event.x;
        d.fy = event.y
      },
  
      dragEnded = (event, d) => {
        if (!event.active) nsp.force.alphaTarget(0);
        d.fx = null;
        d.fy = null
      },
  
      drag = () => d3.selectAll('g.node')
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded)
      ),
  
      tick = (ref) => {
        nsp.force.on('tick', () => {
          d3.select(ref).call(updateGraph)
        });
      };
  
    nsp.width = width;
    nsp.height = height;
    nsp.enterNode = enterNode;
    nsp.updateNode = updateNode;
    nsp.enterLink = enterLink;
    nsp.updateLink = updateLink;
    nsp.updateGraph = updateGraph;
    nsp.initForce = initForce;
    nsp.dragStarted = dragStarted;
    nsp.dragging = dragging;
    nsp.dragEnded = dragEnded;
    nsp.drag = drag;
    nsp.tick = tick;
  
    return nsp
  
  })(FORCE || {})

  export default FORCE;