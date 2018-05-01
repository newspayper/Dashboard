  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAqCBAqOr76xKL-eMXZQxGfWVfLO7WIgw0",
    authDomain: "titres-presse-npp.firebaseapp.com",
    databaseURL: "https://titres-presse-npp.firebaseio.com",
    projectId: "titres-presse-npp",
    storageBucket: "titres-presse-npp.appspot.com",
    messagingSenderId: "73707316345"
  };
  firebase.initializeApp(config);


// Call Database

  var publicationsRef = firebase.database().ref().child("publications");

// Get Snapshot

  publicationsRef.on("child_added", snap => {

// Collect Card Data

    var URL_couv = snap.child("URL_couv").val();
    // On enregistre la date de parution sous forme de date
    var date_parution = new Date(snap.child("date_parution").val());
    var numero = snap.child("numero").val();
    var sommaire = snap.child("sommaire").val();
    var tags = snap.child("tags").val();
    var titre = snap.child("titre").val();
    /* Il faut ajouter la periodicité dans la base publication pour pouvoir la traiter
    var periodicite = snap.child("periodicite").val();

*/

    // Calcul Besoin de mise à jour publication

    var periodicite = 30; // A supprimer lorsque periodicite sera issu de la base

    var today = new Date(); // A placer avant d'entrer dans la boucle pour ne pas reset la variable a chaque child

    // Calcul de la difference entre les dates en jours (arrondi au supérieur)
    var diff = Math.ceil((today - date_parution) / 86400000);

    console.log(diff);
    
    console.log(ribbonAlert(diff, periodicite));

    // Append Array de titres à mettre à jour au fur et à mesure ?

// Create Card String

    cardString = '';
    cardString += '<div class="pubcard ui raised card">' // Ajouter ici l'ID de la publiaction pour pouvoir cibler le div
    cardString +=  '<div class="image">'
    cardString +=    '<img src="' + URL_couv + '">'
    cardString +=    ribbonAlert(diff, periodicite)
    cardString +=   '</div>'
    cardString +=  '<div class="content">'
    cardString +=  '<a class="header" id="nom">' + titre + ' n° ' + numero + '</a>'
    cardString +=    '<div class="meta">'
    // On transforme la date au format français avant de l'afficher
    cardString +=      '<span class="date" id="date_parution">' + date_parution.toLocaleDateString('fr-FR') + '</span>'
    cardString +=    '</div>'
    cardString +=  '</div>'
    cardString +=  '<div class="extra content">'
    cardString +=    '<a>'
    cardString +=      '<i class="hashtag icon"></i>'
    cardString +=      '<a>' + tags + '</a>'
    cardString +=    '</a>'
    cardString +=  '</div>'
    cardString +=  '<div class="ui bottom attached teal button">'
    cardString +=    '<i class="list icon"></i>'
    cardString +=    'Voir Sommaire'
    cardString +=  '</div>'      
    cardString += '</div>'

// Append to Card Grid

    $("#cardGrid").append(cardString);

    // alert(cardString);

  });


function ribbonAlert (diff, periodicite) {
    var reste = periodicite - diff;
    if (reste < 3) {
      return '<a class="ui red ribbon label" onclick="clique()">MAJ REQUISE</a>';
    } else {
      return '<a class="ui green ribbon label" onclick="clique()">RESTE '+ reste + ' JOURS</a>' ;
    }
};

function clique() { // fonction à renommer ? (displayForm ?)
    
    // On récupère l'ID de la carte (parent*2 de l'element cliqué [ribbon])
    ribbonParent = $(event.target).parent().parent();
    console.log(ribbonParent.attr('id'));
    
    // On modifie l'élement modal

        // code pour ajouter les élements 

    // On affiche l'élément modal (fonction Semantic UI)
    $('.ui.modal').modal('show');

    //displayForm();

};


