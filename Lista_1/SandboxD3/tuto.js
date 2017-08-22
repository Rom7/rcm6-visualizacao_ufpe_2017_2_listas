
var dataset = [ 5, 10, 15, 20, 25 ]; // ma liste de données 

d3.select("body").selectAll("p") // s'il n'y a pas encore de paragraphes, la selection est vide
// Lorsqu'il y en aura, cette selection les prendra tous au fur et à mesure 
    .data(dataset) // on pointe le jeu de données qui va être utilisé
    .enter() // permet de créer "de 0" de nouveau élement s'il n'existe pas
    .append("p") // création d'un nouvel elmt HTML de type P
    .text(function(d) { return d; })// les données de dataset sont insérées dans les elmts HTML p correspondants 

    // on a utilisé une fonction anonyme. Le fait d'abvoir utilisé plutôt la méthode data nous permet de faire ensuite 
    // au jeu de données de manière implicte avec la lettre "d". d représente l'élément COURANT (très utile pour les itérations)

    // ATTENTION : d à besoin d'une fonction anonyme pour être définie, sans cette fonction la variabble d n'a pas de valeur 
    // tout ce qui fait référence à d doit se trouver dans cette fonction anonyme
    .style("color", function(d) { // style atten,d comme 2eme paramètre le nom d'une couleur 
    if (d > 15) {   // Seuil de 15
        return "red";
    } else {
        return "black";
    }
});

    // suite tuto : http://kaisersly.github.io/scottmurray-d3-fr/8-dessiner-des-divs.html 

