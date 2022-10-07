using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
using GraphApp.Enteties;
using System.Diagnostics;
using GraphApp.GraphHelpers;

namespace GraphApp.Controllers;
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
    public Enteties.Graph GetTestGraph()
    {
        Debug.WriteLine("Start GetTestGraph()");
        var graph = new Enteties.Graph();
        graph.FillTestValues();
        graph.FillOrderWithDfs();
        Debug.WriteLine("Finish GetTestGraph()");
        return graph;
    }
    
    [HttpGet]
    public Enteties.Graph GetDefaultGraph()
    {
        Debug.WriteLine("Start GetDefaultGraph()");
        int nodeCount = 10;
        int minLinks = 0;
        int maxLinks = 3;
        var graph = new Enteties.Graph();
        graph.FillRandom(nodeCount, minLinks, maxLinks);
        graph.FillOrderWithDfs();

        Debug.WriteLine("Finish GetDefaultGraph()");
        return graph;
    }

    [HttpGet]
    [Route("{nodeCount}/{minLinks}/{maxLinks}")]
    public Enteties.Graph GetGraph(int NodeCount, int MinLinks, int MaxLinks)
    {
        Debug.WriteLine("Start GetGraph()");
        var graph = new Enteties.Graph();
        graph.FillRandomWithoutCycle(NodeCount, MinLinks, MaxLinks);
        graph.FillOrderWithDfs();
        Debug.WriteLine("Finish GetGraph()");
        return graph;
    }

}