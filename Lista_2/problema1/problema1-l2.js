// Fichier javascript issu du pb3 liste 1
//RECUPERATION DES DONNEES

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
[2000,22.75,13.05],
[2001,22.66,13.81],
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


// CREATION DE L'ELEMENT SVG


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");


//  CREATION DES ECHELLES

var tmpscale = d3.scaleLinear().range([margin.left, (1024-50)]);
tmpscale.domain([1990, 2008]);

var timefrmt = d3.timeFormat('%b-%Y');

var realTime = d3.scaleTime().range([margin.left, (1024-50)]);
realTime.domain([new Date(1990,0), new Date(2007,11)]);

var absc = d3.scaleLinear().range([0, width]);
var ordo = d3.scaleLinear().range([height, 0]);
var absc1 = d3.scaleLinear().range([0, width]);
var ordo1 = d3.scaleLinear().range([height, 0]);

absc.domain(d3.extent(dataset, function(d) { return d[0]; }));
absc1.domain(d3.extent(dataset, function(d) { return d[0]; }));
ordo.domain([0, d3.max(dataset, function(d) {
  return Math.max(d[1], d[2]); })])
ordo1.domain([0, d3.max(dataset, function(d) {
  return Math.max(d[1], d[2]); })])



//CREATION DES AXES

var hommes = d3.line()
    .x(function(d) { 
    	console.log(absc(d[0]));
    	return absc(d[0]); 
    })
    .y(function(d) { return ordo(d[1]); });

var femmes = d3.line()
    .x(function(d) { 
    	console.log(absc(d[0]));
    	return absc(d[0]); 
    })
    .y(function(d) { return ordo(d[2]); });


// TRACAGE DES COURBES ET DES AXES

svg.append("path")
      .data([dataset])
      .attr("class", "line")
      .style("stroke","blue")
      .style("fill","none")
      .attr("d", hommes);

svg.append("path")
      .data([dataset])
      .attr("class", "line")
      .style("stroke","red")
      .style("fill","none")
      .attr("d", femmes);

svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(absc));

svg.append("g")
      .attr("class","axesec")
      .call(d3.axisBottom(absc1));

svg.append("g")
      .call(d3.axisLeft(ordo));

svg.append("g")
      .attr("transform", "translate("+width+", 0)")
      .attr("class","axesec")
      .call(d3.axisLeft(ordo1));

svg.append("g").attr("id","laxe")
      .append("line")
      .attr("x1",0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', height)
      .attr("stroke","gray")
      .attr('stroke-width', '5')
      .attr("display", false);

var Rdate = svg.append("g").style("visibility","hidden").append("text")
                    .attr("x",20)
                    .attr("y",30)
                    .attr("fill","gray")
                    .text(" ");

svg.append("g").attr("id","bcrc")
                    .style("visibility", "hidden").append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r",5)
                    .attr("fill","blue")
                    .attr("stroke","white")
                    .attr("stroke-width",2);

var texteB = svg.append("g").style("visibility","hidden").append("text")
                    .attr("x", 10)
                    .attr("y", 20)
                    .attr("fill","blue")
                    .text(" ");


svg.append("g").attr("id","rcrc")
                    .style("visibility", "hidden").append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r",5)
                    .attr("fill","red")
                    .attr("stroke","white")
                    .attr("stroke-width",2);

var texteR = svg.append("g").style("visibility","hidden").append("text")
                    .attr("x", 10)
                    .attr("y", 20)
                    .attr("fill","red")
                    .text(" ");


//AFFICHAGE DYNAMIQUE DE L'AXE MOBILE 

d3.select("svg").on("mousemove",function(d) { // gestion du dynamisme


      svg.select("#laxe")
          .transition().duration(0)
          .style("display", "inline")
          .attr("transform","translate("+(d3.mouse(this)[0] - 50)+",0)");

      mouse_x = d3.mouse(this)[0];
      mouse_y = d3.mouse(this)[1];

      var year = Math.round(tmpscale.invert(mouse_x));

      //console.log(year);

      var bY = circCalc(year);
      console.log(bY);

     svg.select("#bcrc").transition().duration(0)
                        .style("visibility","visible")
                        .attr("transform","translate("+(mouse_x - 50)+","+ordo(dataset[bY][1])+")");

    var timeStr = realTime.invert(mouse_x);
    console.log(timeStr);
    timeStr = timefrmt(timeStr);

    Rdate.style("visibility","visible").text(timeStr).attr("transform","translate("+(mouse_x - 40)+",20)");

    texteB.style("visibility","visible").text(dataset[bY][1]).attr("fill","blue")
                        .attr("transform","translate("+(mouse_x - 40)+","+(ordo(dataset[bY][1]) - 10)+")");


     svg.select("#rcrc").transition().duration(0)
                        .style("visibility","visible")
                        .attr("transform","translate("+(mouse_x - 50)+","+ordo(dataset[bY][2])+")");

    texteR.style("visibility","visible").text(dataset[bY][2]).attr("fill","red")
                        .attr("transform","translate("+(mouse_x - 40)+","+(ordo(dataset[bY][2]) - 10)+")");

});

d3.select("svg").on("mouseout", function() {
  svg.select("#laxe").style("display","none");
  svg.select("#bcrc").style("visibility","hidden");
  svg.select("#rcrc").style("visibility","hidden");
  Rdate.style("visibility","hidden");
  texteR.style("visibility","hidden");
  texteB.style("visibility","hidden");
});




// FONCTION DE CALCUL D'INDEX

var circCalc = function(annee) {
  for (var i = dataset.length - 1; i >= 0; i--) {
                        if(dataset[i][0] == annee)
                        {
                          return i;
                        }
                      }
}