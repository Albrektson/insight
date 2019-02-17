//define some constants
var barHeight = 15;
var barSpacing = 1;
var maxWidth = 600;
var maxHeight = 1200;

d3.select("body").append("svg")
  .attr("width", maxWidth)
  .attr("height", maxHeight)
  .attr("id", "graph")
  .append("g");

//read and use csv data
d3.csv("curpos.csv").then(function(curpos){
  //create svg canvas

  var xScale = d3.scaleLinear()
    .domain([d3.min(curpos, function(d) {
      return d["percent position"]
    }), d3.max(curpos, function(d) {
      return d["percent position"]
    })])
    .nice()
    .range([1, maxWidth]);

  var bars = d3.select("#graph")
    .selectAll("shortPos")
      .data(curpos);

  bars.enter().append("rect")
    .attr("x", 0)
    .attr("y", function(d, i) {
      return (barHeight*i + barSpacing*i);
    })
    .attr("width", function(d, i) {
      return xScale(d["percent position"])
    })
    .attr("height", barHeight)
    .attr("fill", "steelblue");
});

d3.csv("pdmr.csv").then(function(trades){
  var points = d3.select("#graph")
    .selectAll("trades")
      .data(trades)

  points.enter().append("circle")
    .attr("cx", function(d, i){
      return i
    })
    .attr("cy", function(d, i){
      return i
    })
    .attr("r", 2)
    .attr("fill", "red")
});
