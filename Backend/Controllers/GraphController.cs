using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
using MyApp.GraphExp.Models;
using System.Diagnostics;
using MyApp.GraphExp.GraphHelpers;

namespace MyApp.GraphExp.Controllers;
// comment
[ApiController]
[Route("api/[controller]")]
public class GraphController : ControllerBase
{
    public GraphController()
    {

    }
    [HttpGet]
    [Route("test")]
    public Graph GetTestGraph()
    {
        Debug.WriteLine("Start GetTestGraph()");
        var graph = new Graph();
        graph.FillTestValues();
        graph.FillOrderWithDfs();
        Debug.WriteLine("Finish GetTestGraph()");
        return graph;
    }
    
    [HttpGet]
    public Graph GetDefaultGraph()
    {
        Debug.WriteLine("Start GetDefaultGraph()");
        int nodeCount = 10;
        int minLinks = 0;
        int maxLinks = 3;
        var graph = new Graph();
        graph.FillRandom(nodeCount, minLinks, maxLinks);
        graph.FillOrderWithDfs();

        Debug.WriteLine("Finish GetDefaultGraph()");
        return graph;
    }

    [HttpGet]
    [Route("{nodeCount}/{minLinks}/{maxLinks}")]
    public Graph GetGraph(int NodeCount, int MinLinks, int MaxLinks)
    {
        Debug.WriteLine("Start GetGraph()");
        var graph = new Graph();
        graph.FillRandomWithoutCycle(NodeCount, MinLinks, MaxLinks);
        graph.FillOrderWithDfs();
        Debug.WriteLine("Finish GetGraph()");
        return graph;
    }

}