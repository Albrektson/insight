//define some constants
var barHeight = 5;
var barSpacing = 2;
var maxWidth = 600;

//read and use csv data
d3.csv("curpos.csv").then(function(curpos){
  //create svg canvas
  d3.select("body").append("svg")
    .attr("width", maxWidth)
    .attr("height", function(){
      var items = curpos.length + 1;
      return (items*barHeight + items*barSpacing);
    })
    .attr("id", "graph")
    .append("g");

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
