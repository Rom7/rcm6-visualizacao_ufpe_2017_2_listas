var voitures; // tableau global

d3.csv("http://127.0.0.1:8000/cars.csv", function(error, data) {
	if(error){
		console.log(error);
	}
	else{
		voitures = data; // recupéartion des données
		/*voitures.mpg = +voitures.mpg;
		voitures.cc = +voitures.cc;
		voitures.power = +voitures.power;
		voitures.lb = +voitures.lb;
		voitures.accel = +voitures.accel;
		voitures.year = +voitures.year;*/
		for (var i = voitures.length - 1; i >= 0; i--) {
			voitures[i].mpg = +voitures[i].mpg;
			voitures[i].cc = +voitures[i].cc;
			voitures[i].power = +voitures[i].power;
			voitures[i].lb = +voitures[i].lb;
			voitures[i].accel = +voitures[i].accel;
			voitures[i].year = +voitures[i].year;
		};
		start();
	}
});


//---------- SCATTERPLOT CLASS ----------//

class Scatterplot{

	// CONSTRUCTEUR DE CLASSE 
    constructor(name,container,posx,posy,width,height,datax,datay){
    		//this.zone = container.append("svg").attr("width",width).attr("height",height); 
			this.name = name;
			this.datax = datax;
			this.datay = datay;
			this.totalWidth = width;
			this.totalHeight = height;
			//this.subContainer = container.append("div")
			this.canvas = container.append("svg")
				.attr("name", this.name)
				.attr("width",width)
				.attr("height",height)
				.attr("x",posx)
				.attr("y",posy);
			    //.attr("transform","translate("+posx + "," + posy + ")");

		    this.grpData = new Array(2);
		    this.grpData[0] = new Array(datax.length);
		    this.grpData[1] = new Array(datay.length);
		    console.log("contenu et type de datax[i] : ");

		    //this.grpData[0] = datax;
		    for (var i = datax.length - 1; i >= 0; i--) {
		    	this.grpData[0][i] = datax[i];
		    	this.grpData[1][i] = datay[i];
		    	//console.log(datax[i]);		    
		    }; 

		    	

			//
			this.xScale = d3.scaleLinear().range([20,(this.totalWidth - 20)]);
			this.xAxis = d3.axisBottom(this.xScale);	
			this.canvas.append("g")
			    .attr("class","xAxis").call(this.xAxis)
			    .attr("transform","translate(0,200)");
			//
			this.yScale = d3.scaleLinear().range([(this.totalHeight - 20),20]);	
			this.yAxis = d3.axisLeft(this.yScale);	this.canvas.append("g")
			    .attr("class","yAxis").call(this.yAxis)
			    .attr("transform","translate(20,0)");

			//
			var that = this;
			this.brush = d3.brush();
			this.canvas.append("g").attr("class","brush").call(this.brush);
			/*this.brush.on("brush",
				      function(){
					  that.brushAction(that)});*/

			//this.updatePlot();
			this.setData();

			this.updatePlot();

			// TEST

			/*var grpCircles =  this.canvas
			    .selectAll("circle")
			    .data([this.grpData]);

		    for (var i = datax.length - 1; i >= 0; i--) {
		    	console.log("test");
		    	grpCircles.enter().append("circle").merge(grpCircles)
		    				.attr("r",3)
		    				.attr("cx", function(d) { return that.xScale(datax[i])})
		    				.attr("cy", this.yScale(datay[i]));
		    }; */


    }



        dessinCercles()
    {
    	
    }



    // GESTION DE SELECTION
    brushAction(mySelf){
    var screenSelection = d3.event.selection;
			var selectedIndices = [];
			var grpCircles = mySelf.canvas
			    .selectAll("circle");

			    for (var i = this.datax.length - 1; i >= 0; i--) {
			    	grpCircles.attr("fill",function(d,i){
						var x = mySelf.xScale(this.datax[i]);
						var y = mySelf.yScale(this.datay[i]);
						if(screenSelection[0][0] <= x
						   && x <= screenSelection[1][0]
						   && screenSelection[0][1] <= y
						   && y <= screenSelection[1][1]){
						    selectedIndices.push(i);
						    return "red";
						}
						else
						    return "black";
					    });
			    };
			    
			var myname = this.name;
			this.dispatcher.apply("selectionChanged",{callerID:myname,selectedIndices:selectedIndices});
		    	/*
			var screenSelection = d3.event.selection;
			var selectedIndices = [];
			mySelf.canvas
			    .selectAll("circle")
			    .attr("fill",function(d,i){
				var x = mySelf.xScale(d[0]);
				var y = mySelf.yScale(d[1]);
				if(screenSelection[0][0] <= x
				   && x <= screenSelection[1][0]
				   && screenSelection[0][1] <= y
				   && y <= screenSelection[1][1]){
				    selectedIndices.push(i);
				    return "red";
				}
				else
				    return "black";
			    });
			var myname = this.name;
			this.dispatcher.apply("selectionChanged",{callerID:myname,selectedIndices:selectedIndices});
			*/
    }




    setSelected(indices){

			this.canvas.selectAll("circle")
			    .attr("fill",function(d,i){
				if(indices.indexOf(i)==-1)
				    return "black";
				else
				    return "red";
			    });
    }
		    


		    //newData = [[x,y],[x,y],...]
	setData(){
			//this.data = newData;

			//
			//var dataXExtent = d3.extent(this.data.map(d=>d[0]));
			this.xScale.domain([d3.min(this.datax),d3.max(this.datax)]);
			//var dataYExtent = d3.extent(this.data.map(d=>d[1]));
			this.yScale.domain([d3.min(this.datay),d3.max(this.datay)]);

			//this.updatePlot(); 
			//this.data = this.grpData;

	// 
			/*var dataXExtent = d3.extent(this.data.map(d=>d[0]));
			this.xScale.domain(dataXExtent);
			var dataYExtent = d3.extent(this.data.map(d=>d[1]));
			this.yScale.domain(dataYExtent);

			this.updatePlot(); */
		    }

    updatePlot(){
			//update axis
			this.xAxis.scale(this.xScale);
			this.canvas.select(".xAxis").call(this.xAxis);

			this.yAxis.scale(this.yScale);
			this.canvas.select(".yAxis").call(this.yAxis);
			
			//
			/*var circles = this.canvas
			    .selectAll("circle")
			    .data(this.data);*/
		    var that = this;

		    var circles = this.canvas
			    .selectAll("circle")
			    .data([this.grpData]);
			    //console.log(this.grpData[0]);
			    //console.log(this.grpData[1]);

			circles.exit().remove();
			
			/*circles.enter()
			    .append("circle")
			    .merge(circles)
			    .attr("r",3)
			    .attr("cx",d=>this.xScale(datax))
			    .attr("cy",d=>this.yScale(datay));*/

			/*circles.enter()
			    .append("circle")
			    .merge(circles)
			    .attr("r",3)
			    .attr("cx",function (d, i) {
			    	//console.log(d[i][i]);
			    	//return that.xScale(d[0][i]);
			    	//console.log(that.datax[i]);
			    	return that.xScale(that.datax[i]);
			})
			    .attr("cy",function (d, i) {
			    	//console.log(isNaN(d[1]));
			    	return that.yScale(d[1][i]);
			    });*/

			for (var i = this.datax.length - 1; i >= 0; i--) {

				var coordX = this.xScale(this.datax[i]);
				var coordY = this.yScale(this.datay[i]);

				circles.enter()
					.append("circle")
					.merge(circles)
					.attr("r", 3)
					.attr("cx", this.xScale(this.datax[i]))
					.attr("cy", this.yScale(this.datay[i]))
					.attr("fill", this.setColor(i,coordX,coordY));
			};

			/*this.brush.on("brush",
				      function(){
					  that.brushAction(that)}); */
	}


	setColor(rang,absc,ordo)
	{
		var vert = "#7fc97f";
		var violet = "#beaed4";
		var rouge = "#fdc086";
		var that = this;
		var isbrushed;


		this.brush.on("brush", function()
			{
				var screenSelection = d3.event.selection;
				var selectedIndices = [];
				var grpCircles = that.canvas
		    						.selectAll("circle");

		    	for (var i = that.datax.length - 1; i >= 0; i--) {
					var x = that.xScale(absc);
					var y = that.yScale(ordo);
					if(screenSelection[0][0] <= x
					   && x <= screenSelection[1][0]
					   && screenSelection[0][1] <= y
					   && y <= screenSelection[1][1]){
					    //selectedIndices.push(i);
					    isbrushed = true;
					}
					else
					    isbrushed = false;

		    	};
			});

			if(isbrushed == true)
			{
				return "#ffff00";
			}
			else
			{
				if(voitures[rang].cylinders == 8)
				{
					return vert;
				};
				if(voitures[rang].cylinders == 6)
				{
					return violet;
				};
				if(voitures[rang].cylinders == 4)
				{
					return rouge;
				};
			}

	}
}









var start = function()
{

	var svg = d3.select("body").append("svg").attr("width",1800).attr("height",1800).attr("id","first");

	var myData = [];
	var myData2 = [];
	for(var i = 0 ; i < 10 ; ++i){
	    myData.push([i,i]);
	    myData2.push([9-i,i]);
	}

	var myDispatcher = d3.dispatch("selectionChanged");
	myDispatcher.on("selectionChanged", function(){
		for (var i = 0; i <= 35; i++) {
			if(this.callerID === "sct"+i+"")
			plots[i].setSelected(this.selectedIndices);
		};
	    /*if(this.callerID === "sct1")
		myPlot2.setSelected(this.selectedIndices);
	    if(this.callerID === "sct2")
		myPlot.setSelected(this.selectedIndices);*/
	});

	/*var myPlot = new Scatterplot("sct1",svg,100,100,200,200);
	myPlot.dispatcher = myDispatcher;
	myPlot.setData(myData); // sera inutile
	var myPlot2 = new Scatterplot("sct2",svg,100,310,200,200);
	myPlot2.setData(myData2); // sera inutile
	myPlot2.dispatcher = myDispatcher;*/

	var plots = []; 
	var unit = new Array(6);
	unit[0] = new Array(voitures.length);
	unit[1] = new Array(voitures.length);
	unit[2] = new Array(voitures.length);
	unit[3] = new Array(voitures.length);
	unit[4] = new Array(voitures.length);
	unit[5] = new Array(voitures.length);

	/*unit[0] = voitures.mpg;		// consommation
	unit[1] = voitures.cc;  	//
	unit[2] = voitures.power; 	// puissance
	unit[3] = voitures.lb;		// poids
	unit[4] = voitures.accel;	// 0 à 100 km/h
	unit[5] = voitures.year;	// année
	*/

	for (var i = voitures.length - 1; i >= 0; i--) {
		unit[0][i] = voitures[i].mpg;
		unit[1][i] = voitures[i].cc;
		unit[2][i] = voitures[i].power;
		unit[3][i] = voitures[i].lb;
		unit[4][i] = voitures[i].accel;
		unit[5][i] = voitures[i].year;
	};



	for (var i = 0; i <= 5; i++){ // 1ere colonne de la matrice
		plots[i] = new Scatterplot("sct"+i+"",svg,100,(100+(270*i)),220,220,unit[0],unit[i]);
		plots[i].dispatcher = myDispatcher;
	};

	for (var i = 6; i <= 11; i++){ // 2eme colonne de la matrice
		plots[i] = new Scatterplot("sct"+i+"",svg,370,(100+(270*(i-6))),220,220,unit[1],unit[(i-6)]);
		plots[i].dispatcher = myDispatcher;
	};

	for (var i = 12; i <= 17; i++){ // 3eme colonne de la matrice
		plots[i] = new Scatterplot("sct"+i+"",svg,620,(100+(270*(i-12))),220,220,unit[2],unit[(i-12)]);
		plots[i].dispatcher = myDispatcher;
	};

	for (var i = 18; i <= 23; i++){ // 4eme colonne de la matrice
		plots[i] = new Scatterplot("sct"+i+"",svg,870,(100+(270*(i-18))),220,220,unit[3],unit[(i-18)]);
		plots[i].dispatcher = myDispatcher;
	};

	for (var i = 24; i <= 29; i++){ // 5eme colonne de la matrice
		plots[i] = new Scatterplot("sct"+i+"",svg,1120,(100+(270*(i-24))),220,220,unit[4],unit[(i-24)]);
		plots[i].dispatcher = myDispatcher;
	};

	for (var i = 30; i <= 35; i++){ // 6eme colonne de la matrice
		plots[i] = new Scatterplot("sct"+i+"",svg,1370,(100+(270*(i-30))),220,220,unit[5],unit[(i-30)]);
		plots[i].dispatcher = myDispatcher;
	};
}