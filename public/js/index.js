
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

publicationsRef.on("child_added", snapPub => {

    // Collect Card Data

    var key = snapPub.key;
    var URL_couv = snapPub.child("URL_couv").val();
    // On enregistre la date de parution sous forme de date
    var date_parution = new Date(parseInt(snapPub.child("date_parution").val()));
    var numero = snapPub.child("numero").val();
    var sommaire = snapPub.child("sommaire").val();    
    var tags = snapPub.child("tags").val();
    var titre = snapPub.child("titre").val();

    // On parcourt ensuite la base Titres pour ajouter la periodicite

    titresRef.orderByChild("nom").equalTo(titre).on("child_added", snapTitres => {

        // console.log(titre + " : " + snapTitres.child("periodicite").val());

        var periodicite = snapTitres.child("periodicite").val();

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
    
        
        //remplacement du caractère spécial '&' sinon jQuery le refuse
        var ribbonId = "#ribbon-" + key;
        ribbonId = ribbonId.replace(/&/g, '\\&');
        //console.log("ribbonId : " + ribbonId);

        // bind de l'événement click au ribbon de la publication qui vient d'être ajouté
        // sur clic, paramétrage puis affichage de l'élément modal
        
        $(ribbonId).click(function() {
            //alert("clic sur : " + ribbonId);
            ribbonParent = $(this).parent().parent();
            pubId = ribbonParent.attr('id');
            //console.log(pubId);

            modalForm(snapPub.val());

            // On affiche l'élément modal (fonction Semantic UI)
            $('.ui.modal').modal('show');

        });

    });

});



// la fonction suivante renvoie l'élement ribbon HTML/DOM à afficher en fonction de l'urgence de MAJ (utilisé par createCard)
function ribbonAlert (date_parution, periodeJours, key) {
    
    // Calcul de la difference entre les dates en jours (arrondi au supérieur)
    var diff = Math.ceil((today - date_parution) / 86400000);
    
    var reste = periodeJours - diff;
    if (reste < 3) {
      return '<a class="ui red ribbon label" id="ribbon-' + key + '">MAJ REQUISE</a>';
    } else {
      return '<a class="ui green ribbon label" id="ribbon-' + key + '">RESTE '+ reste + ' JOURS</a>' ;
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
    cardString +=    ribbonAlert(date_parution, periodeJours, key)
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



function modalForm(publication) {

    // fonction qui modifie / recrée le modal (voir HTML)

    //titre
    $("#modal-titre").text(publication.titre);

    //header sommaire
    $("#modal-headerSommaire").text("Sommaire du n°" + publication.numero);

    //URL couverture
    $("#modal-URL_couv").text(publication.URL_couv);
    $("#modal-URL_couv").attr("href", publication.URL_couv);
    $("#modal-URL_couv").attr("target", "_blank");

    //sommaire
    $("#modal-sommaire").text(publication.sommaire);

    //tags
    $("#modal-tags").text(publication.tags);

    //image couverture
    $("#modal-couv").attr("src", publication.URL_couv);
};

function submitPub() {

    // fonction qui enregistre en base le formulaire du modal

};

//sert pu à rien
function pubObject(pubId){

    // fonction qui crée l'array d'elements qui seront utilisés dans l'affichage du modal (pop-up)

    var publicationsRef = firebase.database().ref().child("publications");

    publicationsRef.child(pubId).once('value').then(function(snapshot) {

        //console.log(JSON.stringify(snapshot));

        this.sommaire = snapshot.child("sommaire").val();
        this.tags = snapshot.child("tags").val();
        this.numero = snapshot.child("numero").val();
        this.date_parution = snapshot.child("date_parution").val();
        this.URL_couv = snapshot.child("URL_couv").val();
        this.id = pubId;

        //console.log("Objet rempli à partir de la BDD : " + JSON.stringify(publication));

    });

};

//sert pu à rien
function createPubObject(pubId){

    // fonction qui crée l'array d'elements qui seront utilisés dans l'affichage du modal (pop-up)

    var publicationsRef = firebase.database().ref().child("publications");

    publicationsRef.child(pubId).once('value').then(function(snapshot) {

        //console.log(JSON.stringify(snapshot));
        
        var publication = {};

        publication["sommaire"] = snapshot.child("sommaire").val();
        publication["tags"] = snapshot.child("tags").val();
        publication["numero"] = snapshot.child("numero").val();
        publication["date_parution"] = snapshot.child("date_parution").val();
        publication["URL_couv"] = snapshot.child("URL_couv").val();
        publication["id"] = pubId;

        //console.log("Objet rempli à partir de la BDD : " + JSON.stringify(publication));

        return publication;

    });

};