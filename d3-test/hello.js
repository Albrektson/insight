//define some constants
var barHeight = 5;
var barSpacing = 2;
var maxWidth = 1000;

//read and use csv data
d3.csv("curpos.csv").then(function(data){
  //create svg canvas
  //equivalent to <svg id="graph" width="760" height="100"></svg>
  d3.select("body").append("svg")
    .attr("width", maxWidth)
    .attr("height", function(){
      var items = data.length + 1;
      return (items*barHeight + items*barSpacing);
    })
    .attr("id", "graph");


  var bars = d3.select("#graph")
    .selectAll("rect")
      .data(data);

  bars.enter().append("rect")
    .attr("x", 0)
    .attr("y", function(d, i) {
      return (barHeight*i + barSpacing*i);
    })
    .attr("width", function(d, i) {
      return d["percent position"]*100
    })
    .attr("height", barHeight)
    .attr("fill", "steelblue");
});

/*
var div = document.createElement("div");
div.innerHTML = "Printing 'Hello, world!' from javascript.";
document.body.appendChild(div);
*/
