var width = 800,
    height = 600;
    barOffset = 3;

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

var xScale = d3.scaleBand()
  .range([margin.left, graphWidth])
  .round([0.05])
  .padding(0.3)

//var useLogScale = true;
var yLogScale = d3.scaleLog()
  .range([0, graphHeight/2])
var yLinearScale = d3.scaleLinear()
  .range([0, graphHeight/2])
var yScale = yLinearScale;
var yScaleRight = d3.scaleLinear()
  .range([20, graphHeight/2]);

/*
d3.json("http://ivis.southeastasia.cloudapp.azure.com:5000/currentPosition/?limit=10").then(function(data){
  console.log(data)
})
*/

update()

function update(){
  Promise.all([
    d3.csv("ncc-pdmr.csv"),
    d3.csv("ncc-curpos.csv"),
    d3.json("curpos.json")
  ]).then(function(data){
    var trades = data[0]
    //var curpos = data[1]
    var curpos = data[2]

    //console.log(curpos)

    xScale.domain(trades.map(function (d, i) { return i }));
    yScaleRight.domain(d3.extent(curpos, function(d) {
      console.log(+d["position_in_percent"])
      return +d["position_in_percent"]
    }));

    var bars = d3.select("#graph")
      .append("g")
        .attr("id", "trades")
        .selectAll("rect")
        .data(trades)

    var shorts = d3.select("#graph")
      .append("g")
        .attr("id", "shorts")
        .selectAll("circle")
          .data(curpos);

    //trades.forEach(function(d){
    //  d["Volume"] = +d["Volume"];
    //  if (d.Trade == "Avyttring"){
    //    d["Volume"]  = -d["Volume"];
    //  }
    //  console.log(d["Volume"]);
    //})

    xScale.domain(trades.map(function (d, i) { return i }));
    yScale.domain(d3.extent(trades, function(d) {
      return +d["Volume"]
    })).nice();

    bars.enter().append("rect")
      .attr("class", function(d) {
        var type;
        if (d.Trade == "Avyttring") {
          type = "negative"
        } else {
          type = "positive"
        }
        return "bar bar-" + type;
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
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return yScale(+d["Volume"])
      })

    shorts.enter().append("rect")
      .attr("class", "bar-short")
      .attr("x", function(d, i){
        return xScale(i)
      })
      .attr("y", function(d, i) {
        return graphHeight/2;
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d){
        console.log("test")
        console.log(yScaleRight(+d["position_in_percent"]))
        return yScaleRight(+d["position_in_percent"])
      })
      .attr("opacity", 1);

      bars.exit().remove()
      shorts.exit().remove()

      var yAxisCall = d3.axisLeft(yScale)
        .tickSize(3)
        .tickPadding(10)  //offset away from axis
      var yAxis = d3.select("#graph").append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + xScale(0) + "," + 0 + ")")
        .call(yAxisCall)

      //yAxis.append("text")
      //  .attr("class", "axis-title")
      //  .attr("transform", "rotate(-90)")
      //  .text("Height / Centimeters");

      var xAxisCall = d3.axisBottom(xScale)
        .tickSize(3)
        .tickPadding(3)
      var xAxis = d3.select("#graph").append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + 0 + "," + (graphHeight/2) + ")")
        .call(xAxisCall)
  });
}
