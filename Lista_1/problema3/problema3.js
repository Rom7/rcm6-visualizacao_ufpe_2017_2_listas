//recuperation des données
var dataset = [
[1990,10.74,1.96],
[1991,13.75,2.87],
[1992,16.49,4.07],
[1993,18.04,5.1],
[1994,19.2,5.86],
[1995,20.83,7.45],
[1996,22.66,9.32],
[1997,23.38,11.12],
[1998,24.95,12.69],
[1999,22.01,11.96],
[2002,26.19,16.85],
[2003,25.54,16.55],
[2004,24.33,15.89],
[2005,23.22,15.5],
[2006,21.93,14.48],
[2007,22.03,13.93],
[2008,22.27,14.24],
];

var margin = {top: 50, bottom: 50, right: 50, left: 50},
    width = 1024 - margin.left - margin.right,
    height = 768 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var absc = d3.scaleTime().range([0, width]);
var ordo = d3.scaleLinear().range([height, 0]);


var hommes = d3.line()
    .absc(function(d) { 
    	console.log(absc(d[0]));
    	return absc(d[0]); 
    })
    .ordo(function(d) { return ordo(d[1]); });

var femmes = d3.line()
    .absc(function(d) { 
    	console.log(absc(d[0]));
    	return absc(d[0]); 
    })
    .ordo(function(d) { return ordo(d[2]); });

absc.domain(d3.extent(dataset, function(d) { return d[0]; }));
ordo.domain([0, d3.max(dataset, function(d) {
  return Math.max(d[1], d[2]); })])

svg.append("path")
      .attr("d", hommes(dataset))
      .attr("class", "line")
      .style("stroke","blue")
      .attr("d", hommes);

svg.append("path")
      .data(dataset)
      .attr("class", "line")
      .style("stroke","red")
      .attr("d", femmes);

svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(absc));

svg.append("g")
      .call(d3.axisLeft(ordo));



