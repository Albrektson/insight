var barSize = 15;
//var barSpacing = 1;

var width = 800,
    height = 600;

var margin = {top: 20, right: 20, bottom: 20, left: 40},
    graphWidth = width - margin.left - margin.right,
    graphHeight = height - margin.top - margin.bottom;

//create svg canvas
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("id", "canvas");

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "graph");

var xScale = d3.scaleLinear()
  .range([margin.left, graphWidth])

var yScale = d3.scaleLog()
  .range([0, (graphHeight/2)])

//read and use csv data
d3.csv("ncc-pdmr.csv").then(function(trades){
  var bars = d3.select("#graph")
    .selectAll("trades")
      .data(trades)

  xScale.domain([0, trades.length]).nice();
  yScale.domain(d3.extent(trades, function(d) {
    return +d["Volume"]
  })).nice();

  bars.enter().append("rect")
    .attr("class", function(d) {
      return "bar bar-" + (d.value < 0 ? "negative" : "positive");
    })
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d){
      mid = graphHeight/2
      if (d.Trade == "Avyttring") {
        return mid
      } else {
        return (mid - yScale(+d["Volume"]))
      }
    })
    .attr("width", barSize)
    .attr("height", function(d) {
      return yScale(+d["Volume"])
    })
    .attr("fill", "steelblue")
    .attr("opacity", 0.95);

    var yAxisCall = d3.axisLeft(yScale)
    var yAxis = d3.select("#graph").append("g")
      .attr("class", "y-axis")
      .call(yAxisCall)
/*
    yAxis.append("text")
      .attr("class", "axis-title")
      .attr("transform", "rotate(-90)")
      .text("Height / Centimeters");
*/
    var xAxisCall = d3.axisBottom(xScale)
    var xAxis = d3.select("#graph").append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(" + 0 + "," + (graphHeight/2) + ")")
      .call(xAxisCall)
    });

/*
d3.csv("ncc-curpos.csv").then(function(curpos){
  curpos.forEach(function (d) {
    console.log(d)
  });

  var xScale = d3.scaleLinear()
    .domain([d3.min(curpos, function(d) {
      return d["percent position"]
    }), d3.max(curpos, function(d) {
      return d["percent position"]
    })])
    .nice()
    .range([1, width]);

  var dots = d3.select("#graph")
    .selectAll("shortPos")
      .data(curpos);

  dots.enter().append("rect")
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
*/
