var dataset = [[0,0],[20,25],[5,50],[30,20],[10,64],[27,39]];

var margin = {top:20,left:20,bottom:35,right:20};
var totalWidth = 500;
var totalHeight = 540;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

var svg = d3.select("body")
    .append("svg")
    .attr("width",totalWidth)
    .attr("height",totalHeight)
    .append("g")
    .attr("transform","translate("+margin.left+","+margin.top+")"); 

function updatePlot(){

    var n = document.getElementById("pontos").value
    console.log();
    var dataset = [];
    for(var i = 0 ; i < n ; ++i){
	   dataset.push([Math.random()*75,Math.random()*75]);
    }
    console.log(dataset);
    var circles = svg.selectAll("circle")
	.data(dataset)
	.attr("cx",function(d){return xScale(d[0]) +20;})
	.attr("cy",function(d){return yScale(d[1]);});

    circles
	.enter()
	.append("circle")
    .attr("r",5)
	.attr("cx",function(d){return xScale(d[0]) +20;})
	.attr("cy",function(d){return yScale(d[1]);});

    circles.exit().remove();
}

var xScale = d3.scaleLinear().domain([0,75]).range([0,width]);
var yScale = d3.scaleLinear().domain([0,70]).range([height,0]);
// var cScale = d3.scaleLinear().domain([0,50,100]).range(["blue","gray","red"]);

var xAxisGroup = svg.append("g")
    .attr("transform","translate(20,480)")
	.attr("class","Abs");
var xAxis = d3.axisBottom(xScale);
xAxis(xAxisGroup);

svg.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 5) + ")")
  .style("text-anchor", "middle")
  .text("Coordenada X");



var yAxisGroup = svg.append("g")
    .attr("transform","translate(20,0)");
	//.attr("class","Ord");
var yAxis = d3.axisLeft(yScale)
			.ticks(8);
yAxis(yAxisGroup);

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Coordenada Y");      

yAxisGroup.selectAll("svg g g g line")
    .attr("stroke-dasharray", "2,5")
    .attr("stroke-width", "0.5px")
    .attr("stroke","green")
	 .attr("x2",width);


svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("r",5)
    .attr("cx",function(d){return xScale(d[0]) +20;})
    .attr("cy",function(d){return yScale(d[1]);});
    //.attr("fill",function(d){return cScale(d[1])})