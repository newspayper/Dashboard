// Initialize Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDg-vtPrUwFU1m7w-5RtCy-mAAFi-qJx8U",
    authDomain: "chatbot-npp.firebaseapp.com",
    databaseURL: "https://chatbot-npp.firebaseio.com",
    projectId: "chatbot-npp",
    storageBucket: "chatbot-npp.appspot.com",
    messagingSenderId: "11829130023"
};
firebase.initializeApp(config);



var today = new Date();

var periodiciteArray = [
    { periodicite: 'Hebdomadaire',  jours: 7 },
    { periodicite: 'Quinzomadaire',  jours: 15 },
    { periodicite: 'Bimensuel',  jours: 15 },
    { periodicite: 'Mensuel',  jours: 30 },
    { periodicite: 'Bimestriel',  jours: 60 },
    { periodicite: 'Trimestriel', jours: 90 },  
    //etc       
    ];

var titresArray = [];

//console.log(periodiciteArray);


// Call Database

var publicationsRef = firebase.database().ref().child("publications");
var titresRef = firebase.database().ref().child("titres");

// Get Snapshot

publicationsRef.on("child_added", snap => {

    // Collect Card Data

    var key = snap.key;
    var URL_couv = snap.child("URL_couv").val();
    // On enregistre la date de parution sous forme de date
    var date_parution = new Date(parseInt(snap.child("date_parution").val()));
    var numero = snap.child("numero").val();
    var sommaire = snap.child("sommaire").val();    
    var tags = snap.child("tags").val();
    var titre = snap.child("titre").val();

    // On parcourt ensuite la base Titres pour ajouter la periodicite

    titresRef.orderByChild("nom").equalTo(titre).on("child_added", snap => {

        // console.log(titre + " : " + snap.child("periodicite").val());

        var periodicite = snap.child("periodicite").val();

        var periodeJours = periodiciteArray.find( periode => periode.periodicite === periodicite).jours;

        // Creation de l'Array qui contient les infos de chaque titre

        titresArray.push(
            {
                key: key,
                URL_couv: URL_couv,
                date_parution: date_parution,
                numero: numero,
                sommaire: sommaire,
                tags: tags,
                titre: titre,
                periodicite: periodicite,
                periodeJours: periodeJours
            }
        );

        // Append to Card Grid

        $("#cardGrid").append(createCard(titresArray,titre));
    
        // jQuery pour afficher le modal en fonction du ribbon cliqué

        $(".ribbon").click(function() {
            //alert("cliquage");
            ribbonParent = $(this).parent().parent();
            pubId = ribbonParent.attr('id');
            console.log(pubId);

            var pubArray = createPubArray(pubId);
            modalForm (pubArray);

            // On affiche l'élément modal (fonction Semantic UI)
            $('.ui.modal').modal('show');

        });

    });

});



// la fonction suivante renvoie l'élement ribbon HTML/DOM à afficher en fonction de l'urgence de MAJ (utilisé par createCard)
function ribbonAlert (date_parution, periodeJours) {
    
    // Calcul de la difference entre les dates en jours (arrondi au supérieur)
    var diff = Math.ceil((today - date_parution) / 86400000);
    
    var reste = periodeJours - diff;
    if (reste < 3) {
      return '<a class="ui red ribbon label">MAJ REQUISE</a>';
    } else {
      return '<a class="ui green ribbon label">RESTE '+ reste + ' JOURS</a>' ;
    }
};

// la fonction suivante renvoie l'élement card HTML/DOM en fonction des infos de la publication
function createCard (titresArray, titre) {
    
    var key = titresArray.find ( titresArray => titresArray.titre === titre).key;    
    var URL_couv = titresArray.find ( titresArray => titresArray.titre === titre).URL_couv;
    var date_parution = titresArray.find ( titresArray => titresArray.titre === titre).date_parution;
    var numero = titresArray.find ( titresArray => titresArray.titre === titre).numero;
    // var sommaire = titresArray.find ( titresArray => titresArray.titre === titre).sommaire;
    var tags = titresArray.find ( titresArray => titresArray.titre === titre).tags;
    var titre = titresArray.find ( titresArray => titresArray.titre === titre).titre;
    var periodicite = titresArray.find ( titresArray => titresArray.titre === titre).periodicite;
    var periodeJours = titresArray.find ( titresArray => titresArray.titre === titre).periodeJours;

    cardString = '';
    cardString += '<div class="pubcard ui raised card" id="' + key + '">'
    cardString +=  '<div class="image">'
    cardString +=    '<img src="' + URL_couv + '">'
    cardString +=    ribbonAlert(date_parution, periodeJours)
    cardString +=   '</div>'
    cardString +=  '<div class="content">'
    cardString +=  '<a class="header">' + titre + ' n° ' + numero + '</a>'
    cardString +=    '<div class="meta">'
    // On transforme la date au format français avant de l'afficher
    cardString +=      '<span class="date">' + date_parution.toLocaleDateString('fr-FR') + '</span>'
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

    return(cardString);

}

function createPubArray(pubId){

    // fonction qui crée l'array d'elements qui seront utilisés dans l'affichage du modal (pop-up)
    var pubArray;

    return pubArray;
};

function modalForm(pubArray) {

    // fonction qui modifie / recrée le modal (voir HTML)

};

function submitPub() {

    // fonction qui enregistre en base le formulaire du modal

};