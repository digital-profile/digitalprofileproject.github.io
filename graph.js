document.addEventListener("DOMContentLoaded", function(event) {
var d3 = require("d3");
var dataList = document.getElementById('data');

document.getElementById("toggleRefs").addEventListener("click", toggleDisplay);
document.getElementById("toggleTags").addEventListener("click", toggleDisplay);
document.getElementById("clearData").addEventListener("click", function() {
  document.getElementById("data").innerHTML = "";
});

var tagsVisible = true;
var refsVisible = true;

function toggleDisplay(e) {
  if(e.target.id=="toggleTags"){
    tagsSwitch(tagsVisible)
  }
  if(e.target.id=="toggleRefs"){
    refsSwitch(refsVisible)
  }
}
function tagsSwitch(visible) { // consider using classList in refactor to add/remove class rather than attr of class
  var tags = document.getElementsByClassName('tags')
   if(visible){
    for (var i = 0; i < tags.length; i++) {
      tags[i].style.display = 'none'
    }
    tagsVisible = false;
   }else {
     for (var i = 0; i < tags.length; i++) {
       tags[i].style.display = 'block'
     }
     tagsVisible = true;
   }
}
 function refsSwitch(visible) {
   var refs = document.getElementsByClassName('refs')
    if(visible){
     for (var i = 0; i < refs.length; i++) {
       refs[i].style.display = 'none'
     }
     refsVisible = false;
    }else {
      for (var i = 0; i < refs.length; i++) {
        refs[i].style.display = 'block'
      }
      refsVisible = true;
    }
 }
var graph
var radius = 6;
//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal()
          .range(["#703030", "#2F343B" , "#7E827A", "#E3CDA4", "#C77966"]);;


d3.json("./output.json", function(json) {
  var graph = json
      console.log(graph);
      console.log(graph.nodes);

      var simulation =
      d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink().id(function(d, i) { return i;}).distance(20).strength(0.9))
      .force("center", d3.forceCenter(width/2, height/2))
      .force('X', d3.forceX(width/2).strength(0.15)) // retuirnx 100 d,group
      .force('Y', d3.forceY(height/2).strength(0.15));

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    //.attr("stroke-width", function(d) {return 0.5 });

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    node.append("title")
      .text(function(d) {return d.text})
      .style("text-anchor", "middle")


      d3.selectAll("circle")
          .on("click", function(d,i) { addNodes( d ); }) // plus change look of node so know it is selected. 
          //, on (mouseOver) create tooltip-like div, with name of datapoint, plus highlight edges towards centre.

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) {return d.source.x; })
        .attr("y1", function(d) {return d.source.y; })
        .attr("x2", function(d) {return d.target.x; })
        .attr("y2", function(d) {return d.target.y; })

    node
        .attr("cx", function(d) {return d.x  })
        .attr("cy", function(d) {return d.y; });
  }

  function dragstarted(d) {
      if(!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
  }
  function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }
  function dragended(d) {
      if(!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  }

  function addNodes(node) {
    //findParents(node)
    console.log(node.tags);
    if(node.group != 5) {
      dataList.innerHTML += '<li>'+node.text+'</li>'
    }else{
      var year = ''
      if(node.year>1) year = node.year;
      dataList.innerHTML += '<li> <p>'+node.text+'</p> <i class="tags">'+node.tags[0]+':</i> <p class="refs">['+node.reference+'] '+year+' </p></li>'
    }
  }
})





});
