// VARIABLES GLOBALES

var h = 2950;
var w = 1750;
var wTG = 300;
var hTG = 300;
var inet = "localhost";
var donnees;

var coord = new Array(2);
coord[0] = new Array(21);
coord[1] = new Array(21);
var compteur = 0;

var svglobal = d3.select("body")
				 .append("svg")
				 .attr("width",w)
				 .attr("height",h);

svglobal.append("text").attr("x",10).attr("y",400)
								.text("Please wait, this can take a few minutes (seriously). Open the console to follow the progression").style("font-size","30")
								.attr("id","msg");

	// INITIALISATION DES COORDONNEES DES TAGCLOUDS //


var xCol1 = 400;
var xCol2 = 850;
var xCol3 = 1300;

var yLine1 = 100;


for (var i = 0; i < coord[0].length; i+=3)
{
	coord[0][i] = xCol1;
};
for (var i = 1; i < coord[0].length; i+=3) 
{
	coord[0][i] = xCol2;
};
for (var i = 2; i < coord[0].length; i+=3) 
{
	coord[0][i] = xCol3;
};

for (var i = 0; i < coord[0].length; i++) {
	if( i >= 0 && i<= 2 )
	{
		coord[1][i] = yLine1;
	}
	else if( i >= 3 && i<= 5 )
	{
		coord[1][i] = yLine1 + 400;
	}
	else if( i >= 6 && i<= 8 )
	{
		coord[1][i] = yLine1 + 800;
	}
	else if( i >= 9 && i<= 11 )
	{
		coord[1][i] = yLine1 + 1200;
	}
	else if( i >= 12 && i<= 14 )
	{
		coord[1][i] = yLine1 + 1600;
	}
	else if( i >= 15 && i<= 17 )
	{
		coord[1][i] = yLine1 + 2000;
	}
	else if( i >= 18 && i<= 20 )
	{
		coord[1][i] = yLine1 + 2400;
	};
};


	////////////////////////////


var stopwords = new Array("a","a's","able","about","above","according","accordingly","across","actually","after","afterwards","again","against","ain't","all","allow","allows","almost","alone","along","already","also","although","always","am","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","around","as","aside","ask","asking","associated","at","available","away","awfully","b","be","became","because","become","becomes","becoming","been","before","beforehand","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by","c","c'mon","c's","came","can","can't","cannot","cant","cause","causes","certain","certainly","changes","clearly","co","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","course","currently","d","definitely","described","despite","did","didn't","different","do","does","doesn't","doing","don't","done","down","downwards","during","e","each","edu","eg","eight","either","else","elsewhere","enough","entirely","especially","et","etc","even","ever","every","everybody","everyone","everything","everywhere","ex","exactly","example","except","f","far","few","fifth","first","five","followed","following","follows","for","former","formerly","forth","four","from","further","furthermore","g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings","h","had","hadn't","happens","hardly","has","hasn't","have","haven't","having","he","he's","hello","help","hence","her","here","here's","hereafter","hereby","herein","hereupon","hers","herself","hi","him","himself","his","hither","hopefully","how","howbeit","however","i","i'd","i'll","i'm","i've","ie","if","ignored","immediate","in","inasmuch","inc","indeed","indicate","indicated","indicates","inner","insofar","instead","into","inward","is","isn't","it","it'd","it'll","it's","its","itself","j","just","k","keep","keeps","kept","know","known","knows","l","last","lately","later","latter","latterly","least","less","lest","let","let's","like","liked","likely","little","look","looking","looks","ltd","m","mainly","many","may","maybe","me","mean","meanwhile","merely","might","more","moreover","most","mostly","much","must","my","myself","n","name","namely","nd","near","nearly","necessary","need","needs","neither","never","nevertheless","new","next","nine","no","nobody","non","none","noone","nor","normally","not","nothing","novel","now","nowhere","o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","only","onto","or","other","others","otherwise","ought","our","ours","ourselves","out","outside","over","overall","own","p","particular","particularly","per","perhaps","placed","please","plus","possible","presumably","probably","provides","q","que","quite","qv","r","rather","rd","re","really","reasonably","regarding","regardless","regards","relatively","respectively","right","s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","she","should","shouldn't","since","six","so","some","somebody","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure","t","t's","take","taken","tell","tends","th","than","thank","thanks","thanx","that","that's","thats","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","therefore","therein","theres","thereupon","these","they","they'd","they'll","they're","they've","think","third","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","to","together","too","took","toward","towards","tried","tries","truly","try","trying","twice","two","u","un","under","unfortunately","unless","unlikely","until","unto","up","upon","us","use","used","useful","uses","using","usually","uucp","v","value","various","very","via","viz","vs","w","want","wants","was","wasn't","way","we","we'd","we'll","we're","we've","welcome","well","went","were","weren't","what","what's","whatever","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","whereupon","wherever","whether","which","while","whither","who","who's","whoever","whole","whom","whose","why","will","willing","wish","with","within","without","won't","wonder","would","wouldn't","x","y","yes","yet","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","z","zero",",");

var parsingStopWords = function(extract)
{
	for (var i = 0; i < stopwords.length; i++) {
		var searched = new RegExp("\\b("+stopwords[i]+")\\b","gi"); // ce qu'on va chercher à virer
		// la bonne ER qui fait plaiz
		extract = extract.replace(searched,"").replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
	};
	return extract;
}





////////////////////////////////////
// ----- TAGCLOUDS GENERATOR----- //
////////////////////////////////////



var TagCloud = function(wordlist)
{
	var affiche = compteur + 1;
	console.log("Computing TagCloud "+affiche+"/21, please wait...");

	var fill = d3.scale.category20();
	var parsedWords = wordlist.split(" ");

	d3.layout.cloud().size([hTG,wTG])
		.words(parsedWords.map(function(d) {
			return {text: d, size: 10 + Math.random() * 30};
		}))
		.padding(5)
		.rotate(function() { return ~~(Math.random()*2)*45; })
    	.font("Impact")
    	.fontSize(function(d) { return d.size; })
    	.on("end", draw)
    	.start();

};


var draw = function(words)
{

	svglobal.append("rect").attr("x",coord[0][compteur])
						   .attr("y",coord[1][compteur])
						   .attr("width",wTG)
						   .attr("height",hTG)
						   .attr("stroke-width","2")
						   .attr("fill","rgba(0,0,0,0)")
						   .attr("stroke","black");

	svglobal.append("g")
					 .attr("transform","translate("+coord[0][compteur]+","+coord[1][compteur]+")")
					 .append("svg").attr("width",wTG)
					 .attr("height",hTG)
					 .selectAll("text")
					 .data(words).enter()
					 .append("g").attr("transform","translate("+(wTG/2)+","+(hTG/2)+")")
					 .append("text") 
					 .style("font-size", function(d) { 
					 	//console.log(d)
					 	return d.size+"px"; 
					 })
					 .style("font-family","Impact")
					 .style("fill", function(d,i) { 
					 	var c1 = Math.floor((Math.random() * 255) + 1);
					 	var c2 = Math.floor((Math.random() * 255) + 1);
					 	var c3 = Math.floor((Math.random() * 255) + 1);
					 	return "rgb("+c1+","+c2+","+c3+")"; })
					 .attr("text-anchor", "middle")
					 .attr("transform", function(d) {
					 	return "translate("+[d.x,d.y]+")rotate("+d.rotate+")"; 
					 })
					 .text( function(d,i){ 
					 	return d.text; }
					 	);
}




///////////////////////////////
// ----- DEBUT DU CODE ----- //
///////////////////////////////



d3.csv("http://"+inet+":8000/conferences.csv", function(error, data)
{
	if(error)
	{
		console.log(error);
	}
	else
	{
		donnees = data;

		//ON PREPARE LE DECORS
		svglobal.append("text").attr("x",485).attr("y",70).style("font-size","50").text("SciVis");
		svglobal.append("text").attr("x",930).attr("y",70).style("font-size","50").text("InfoVis");
		svglobal.append("text").attr("x",1380).attr("y",70).style("font-size","50").text("VAST");

		svglobal.append("text").attr("x", 100).attr("y",250).style("font-size","50").text("2010");
		svglobal.append("text").attr("x", 100).attr("y",650).style("font-size","50").text("2011");
		svglobal.append("text").attr("x", 100).attr("y",1050).style("font-size","50").text("2012");
		svglobal.append("text").attr("x", 100).attr("y",1450).style("font-size","50").text("2013");
		svglobal.append("text").attr("x", 100).attr("y",1850).style("font-size","50").text("2014");
		svglobal.append("text").attr("x", 100).attr("y",2250).style("font-size","50").text("2015");
		svglobal.append("text").attr("x", 100).attr("y",2650).style("font-size","50").text("2016");

		//console.log(donnees);

		var fratelos = new Array(21);

		var startyear = 2010;

		/*for (var y = 2010; i < 2017; i++) {
			for (var i = 0; i < data.length; i++) {
				if(data[i]["Year"])
			};
		};*/

		// miskine les boucles for 

		for (var i = 0; i <= 18; i+=3) {
			fratelos[i] = textGrouper(startyear.toString(),"SciVis");
			startyear = startyear + 1;
		};
		startyear = 2010;
		for (var i = 1; i <= 19; i+=3) {
			fratelos[i] = textGrouper(startyear.toString(),"InfoVis");
			startyear = startyear + 1;
		};
		startyear = 2010;
		for (var i = 2; i <= 20; i+=3) {
			fratelos[i] = textGrouper(startyear.toString(),"VAST");
			startyear = startyear + 1;
		};

		//console.log((parsingStopWords(fratelos[1])).split(" "));

		for (var i = 0; i < 21; i++) 
		{
			//console.log(parsingStopWords(data[i]["Abstract"]))
			TagCloud(parsingStopWords(fratelos[i]));
			//console.log(fratelos[i]);
			//console.log("COUPURE n°"+i);
			compteur = compteur + 1;
		};

		

		svglobal.select("#msg").remove();

		//console.log(coord);
	}
})




// FONCTION DE GROUPEMENT DE TEXTE


var textGrouper = function(annee,type)
{
	var res = "";


	for (var i = 0; i < donnees.length; i++) {
		if( (donnees[i]["Year"] === annee) && (donnees[i]["Conference"] === type))
		{
			res = res+donnees[i]["Abstract"];
		}
	};

	return res;
}
