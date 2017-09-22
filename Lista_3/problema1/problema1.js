// LES VARIABLES GLOBALES ET IMPORTATION

var ip_addr = "192.168.1.2"; // para trabalhar em rede local com 2 computadoras
var w = 1200;
var h = 1080;
var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h);



// FONCTION DE GESTION DE LA SELECTION


var selectionHandler = function(choix)
{
	if (choix == "vue_points") {
		svg.selectAll("*").remove();
		triggerView1();

	}
	else if (choix == "vue-Etats") {
		console.log("vue 2");
		svg.selectAll("*").remove();
		triggerView2();

	}
	else if (choix == "vue-Depart") {
		console.log("vue 3");
		svg.selectAll("*").remove();
		//triggerView3();
		/*svg.append("text").attr("x",130).attr("y",500).text("The database doesn't provide statistics for \"municipios\"")
		.style("font-size","45");*/
		triggerView3();
	};
}


// ----- VUE 1 : POINTS GEOGRAPHIQUES ----- //


var triggerView1 = function()
{
	//svg.remove();
	d3.json("http://"+ip_addr+":8000/geojs-100-mun.json.txt", function(error, json) {

		if(error){
			console.log(error)
		}
		else
		{
			svg.append("text").attr("x",100).attr("y",100)
								.text("Please wait...").style("font-size","30")
								.attr("id","msg");
			d3.csv("http://"+ip_addr+":8000/brasil-aircrash-data.csv", function(error, data){
				if(error) {
					console.log(error);
				}
				else
				{
					console.log("vue 1");

					var projection = d3.geoMercator()
												.translate([w/2, h/2])
												.center([-55, -10])
												.scale([1000]);

					var path = d3.geoPath().projection(projection);


					//svg.append("g").attr("transform","translate(50,50)");

					svg.selectAll("path")
					   .data(json.features)
					   .enter()
					   .append("path")
					   .attr("d", path)
					   .attr("fill","#aed75b")
					   .attr("stroke","#3d5214");

				   svg.selectAll("circle")
						.data(data)
						.enter()
						.append("circle")
						.attr("cx", function(d) {
						return projection([d.ocorrencia_longitude, d.ocorrencia_latitude])[0];
						})
						.attr("cy", function(d) {
						return projection([d.ocorrencia_longitude, d.ocorrencia_latitude])[1];
						})
						.attr("r", 5)
						.style("fill", function(d)
						{
							if(d.ocorrencia_classificacao == "ACIDENTE")
							{
								return "red";
							}
							else if( (d.ocorrencia_classificacao == "INCIDENTE") || (d.ocorrencia_classificacao == "INCIDENTE GRAVE"))
							{
								return "blue";
							}
						})
						.style("opacity", 0.75);

						svg.select("#msg").remove();
				}

			})
		}


	})
}



// ----- VUE 2 : COLORIAGE PAR ETATS ----- //


var triggerView2 = function()
{
	//svg.remove();
	d3.json("http://"+ip_addr+":8000/brazil-states.json", function(error, json)
	{
		svg.append("text").attr("x",100).attr("y",100)
								.text("Please wait...").style("font-size","30")
								.attr("id","msg");
		if( error)
		{
			console.log(error);
		}
		else
		{
			d3.csv("http://"+ip_addr+":8000/brasil-aircrash-data.csv", function(error, data)
			{
				if(error)
				{
					console.log(error)
				}
				else
				{
					var max = 0;
					var min = 0;
					stateInfo = new Array(2);
					stateInfo[0] = new Array("AC","AL","AP","AM","BA","CE","DF","ES",
					"GO","MA","MT","MS","MG","PA","PB","PR","PE","PI",
					"RJ","RN","RS","RO","RR","SC","SP","SE","TO");
					stateInfo[1] = new Array(stateInfo[0].length);

					for (var i = 0; i < stateInfo[1].length; i++) {
						stateInfo[1][i] = 0;
					}; // départ à 0 pour tous les Etats

					for (var i = stateInfo[0].length - 1; i >= 0; i--) {
						for (var  j = data.length - 1; j >= 0; j--) {
							if( data[j].ocorrencia_uf == stateInfo[0][i])
							{
								//console.log('test du comptage');
								stateInfo[1][i] = stateInfo[1][i] + 1;
							}
						};
					};

						min = d3.min(stateInfo[1]);
						max = d3.max(stateInfo[1]);

						console.log("minimum et maximum: "+min+" et "+max+"");


					var colorScale = d3.scaleQuantize().range(["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a"
						,"#ef3b2c","#cb181d","#99000d"]);
					colorScale.domain([min, max]);

					// dessiner la carte

					var projection = d3.geoMercator()
												.translate([w/2, h/2])
												.center([-55, -10])
												.scale([1000]);

					var path = d3.geoPath().projection(projection);


					//svg.append("g").attr("transform","translate(50,50)");
					//console.log("test avant svg");

					var carte = svg.selectAll("path")
					   .data(json.features)
					   .enter()
					   .append("path")
					   .attr("d", path)
					   .attr("fill", function(d,i)
					   {
					   	//console.log(stateInfo[1][i]);
					   	return colorScale(parseInt(stateInfo[1][i],10));
					   })
					   .attr("stroke","black");

				   	var legd_margin = 40;

				   	var legende = svg
				   					.append("rect")
				   					.attr("id","legende")
				   					.attr("x",50)
				   					.attr("y",300)
				   					.attr("width",200)
				   					.attr("height",410)
				   					.attr("fill","none")
				   					.attr("stroke","black");

   					svg.append("text").attr("x",110).attr("y",320).text("LEGENDE");

   					alonso = new Array(2);
   					alonso[0] = new Array("#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a"
						,"#ef3b2c","#cb181d","#99000d");
   					alonso[1] = new Array(alonso[0].length);

   					

   					for (var i = alonso[1].length - 1; i >= 0; i--) {
   						alonso[1][i] = 15 + (i*182);
   					};

   					for (var i = 8 - 1; i >= 0; i--)
   					{
   						svg.append("rect").attr("width",30).attr("height",30)
   										.attr("x",70)
   										.attr("y",function()
					   					{
					   						var posy = 350 + (i*legd_margin);
					   						return posy;
					   					})
					   					.attr("fill",alonso[0][i]);


	   					svg.append("text").attr("x",120)
					   					.attr("y", function()
					   					{
					   						var txty = 370 + (i*(legd_margin));
					   						return txty;
					   					})
					   					.text("More than "+alonso[1][i]+" events")
					   					.style("font-size","12");
   					}

   					svg.select("#msg").remove();

				}
			})
		}
	})
}



// ----- VUE 3 : COLORIAGE PAR MUNICIPIOS ----- //


var triggerView3 = function()
{
	d3.json("http://"+ip_addr+":8000/geojs-100-mun.json.txt", function(error, json)
	{
		svg.append("text").attr("x",100).attr("y",100)
								.text("Please wait...").style("font-size","30")
								.attr("id","msg");
		if( error)
		{
			console.log(error);
		}
		else
		{
			d3.csv("http://"+ip_addr+":8000/brasil-aircrash-data.csv", function(error, data)
			{
				if(error)
				{
					console.log(error)
				}
				else
				{
					d3.csv("http://"+ip_addr+":8000/cidades.csv", function(error, municip)
					{
						if(error)
						{
							console.log(error)
						}
						else
						{
							console.log(municip);
							var max = 0;
							var min = 0;

							mncpInfo = new Array(2);
							mncpInfo[0] = new Array(municip.length); // nom des cidades
							mncpInfo[1] = new Array(mncpInfo[0].length); // occurences du nom 
							
							for (var i = mncpInfo[0].length - 1; i >= 0; i--) {
								mncpInfo[0][i] = municip[i].nome; // on a tous les noms de municipalités maintenant
							};
							// Next : compter le nombre d'occurences dans le fichier data
							//console.log(mncpInfo[0]);

							for (var i = 0; i < mncpInfo[1].length; i++) {
								mncpInfo[1][i] = 0;
							}; // départ à 0 pour toutes les villes

							for (var i = mncpInfo[0].length - 1; i >= 0; i--) {
								for (var  j = data.length - 1; j >= 0; j--) {
									if( data[j].ocorrencia_cidade == mncpInfo[0][i])
									{
										//console.log('test du comptage');
										mncpInfo[1][i] = mncpInfo[1][i] + 1;
									}	// les cidades qui ne sont pas dans le csv n'ont pas eu d'accident
								};
							};

							// bientôt l'heure de manger tkt
							// Next : le min / max et l'echelle de couleur

							var min = d3.min(mncpInfo[1]);
							var max = d3.max(mncpInfo[1]);

							// console.log("minimum :"+min+" maximum : "+max);

							var colorScale = d3.scaleQuantize().range(["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a"
							,"#ef3b2c","#cb181d","#99000d"]);
							colorScale.domain([min, max]);

							var projection = d3.geoMercator()
												.translate([w/2, h/2])
												.center([-55, -10])
												.scale([1000]);

							var path = d3.geoPath().projection(projection);


							//svg.append("g").attr("transform","translate(50,50)");

							svg.selectAll("path")
							   .data(json.features)
							   .enter()
							   .append("path")
							   .attr("d", path)
							   .attr("fill", function(d,i)
							   {
							   	
							   	for (var j = mncpInfo[0].length - 1; j >= 0; j--) {

							   		//console.log("comparaison : "+mncpInfo[0][j]+" et "+d.properties.name.toUpperCase());

							   		if(mncpInfo[0][j] == d.properties.name.toUpperCase())
							   		{
							   			//console.log("if string trouvée");
							   			return colorScale(parseInt(mncpInfo[1][j],10));
							   		}
							   	};
							   	// console.log(mncpInfo[1][i]); sinon, si c'est pas dans la tableau
							   	return colorScale(parseInt(0,10));
							   })
							   .attr("stroke","grey");

							   // la légende :

							   	var legd_margin = 40;

							   	var legende = svg
							   					.append("rect")
							   					.attr("id","legende")
							   					.attr("x",50)
							   					.attr("y",300)
							   					.attr("width",200)
							   					.attr("height",410)
							   					.attr("fill","none")
							   					.attr("stroke","black");

			   					svg.append("text").attr("x",110).attr("y",320).text("LEGENDE");

			   					alonso = new Array(2);
			   					alonso[0] = new Array("#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a"
									,"#ef3b2c","#cb181d","#99000d");
			   					alonso[1] = new Array(alonso[0].length);

			   					

			   					for (var i = alonso[1].length - 1; i >= 0; i--) {
			   						alonso[1][i] = 1 + (i*47);
			   					};

			   					for (var i = 8 - 1; i >= 0; i--)
			   					{
			   						svg.append("rect").attr("width",30).attr("height",30)
			   										.attr("x",70)
			   										.attr("y",function()
								   					{
								   						var posy = 350 + (i*legd_margin);
								   						return posy;
								   					})
								   					.attr("fill",alonso[0][i]);


				   					svg.append("text").attr("x",120)
								   					.attr("y", function()
								   					{
								   						var txty = 370 + (i*(legd_margin));
								   						return txty;
								   					})
								   					.text("More than "+alonso[1][i]+" events")
								   					.style("font-size","12");
			   					}

			   					svg.select("#msg").remove();

						}
					})


				}
			})
		}
	})
}