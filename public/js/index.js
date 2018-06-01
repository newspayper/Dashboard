
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

var publicationsRef = firebase.database().ref().child("publications");
var titresRef = firebase.database().ref().child("titres");

var today = new Date();

var periodiciteInt = {
    'Quotidien' : 1,
    'Hebdomadaire' : 7,
    'Quinzomadaire' : 15,
    'Bimensuel' : 15,
    'Mensuel' : 30,
    'Bimestriel' : 60,
    'Trimestriel' : 90 
};

var arraychoixTitre = [];
var titresArray = [];
var searchtitresArray = [];


// Association des actions souhaitées aux boutons du modal d'édition
$('.modal-edit-btn').click(function() {

    var keyPub = $('#editionModal').attr("data-value");
    var boutonClique = $(this).data("value");
    //console.log("Clic bouton '" + boutonClique + "' - " + keyPub);

    var edit_URL_couv = $("#modal-edit-URL_couv").val();
    var edit_numero = $("#modal-edit-numero").val();
    var edit_tags = $("#modal-edit-tags").val();
    var edit_sommaire = $("#modal-edit-sommaire").val();

    var current_URL_couv = $("#modal-URL_couv").text();
    var current_numero = $("#modal-numero").text();
    var current_tags = $("#modal-tags").text();
    var current_sommaire = $("#modal-sommaire-hidden").text();

    var titre = $("#modal-edit-titre").text();

    var date_parution = Date.parse($('.datepicker').calendar('get date'));

    switch (boutonClique) {
        case 'fermer':
            if(edit_URL_couv != "" || edit_numero != "" || edit_tags != "" || edit_sommaire != "") {
                if(confirm("Modifications non enregistrées.\nFermer malgré tout ?")) {
                    $("#editionModal").modal("hide");
                }
            }
            else {
                $("#editionModal").modal("hide");
            }
            break;

        case 'ajouter':
            if(confirm("Confirmer l'ajout ?")) {
                
                $("#editionModal").modal("hide");
            }
            break;

        case 'supprimer':
            if(confirm("Confirmer la suppression ?")) {
                
                publicationsRef.child(keyPub).remove();

                var checked = $("#modal-edit-deleteHisto").checkbox("is checked");
                
                
                if($("#modal-edit-deleteHisto").checkbox("is checked")) {
                    if(confirm("ATTENTION, suppression de la publication\n dans l'historique.\n Confirmer ?")) {
                        titresRef.child(removeAccentsSpaces(titre)).child("publications").child(keyPub).remove();
                    }
                }
                $("#editionModal").modal("hide");
                        
    
            }
            break;

        case 'modifier':

            if(date_parution == null) {
                alert("La date de parution ne peut pas être vide !")
            }
            else {
                if(confirm("Confirmer les modifications ?")) {

                    var publication = {};

                    if(edit_URL_couv != "") {URL_couv = edit_URL_couv;}
                    else {URL_couv = current_URL_couv;}

                    if(edit_numero != "") {numero = edit_numero;}
                    else {numero = current_numero;}

                    if(edit_tags != "") {tags = edit_tags;}
                    else {tags = current_tags;}

                    if(edit_sommaire != "") {sommaire = edit_sommaire;}
                    else {sommaire = current_sommaire;}

                    publication["URL_couv"] = URL_couv;
                    publication["numero"] = numero;
                    publication["tags"] = tags;
                    publication["sommaire"] = sommaire;
                    publication["date_parution"] = date_parution;

                    publicationRef = publicationsRef.child(keyPub);
                    
                    publicationRef.update(publication)
                    .then(function() {
                        modalForm(publication, keyPub);

                        titresRef.child(removeAccentsSpaces(titre)).child("publications").child(keyPub).update(publication);

                    });
                    // Save it!
                }
            }
            break;
    }
});

// Association des actions souhaitées aux boutons du modal de rajout de publication
$('.modal-newPub-btn').click(function() {

    var boutonClique = $(this).data("value");

    var newPub_titre = $("#modal-newPub-titre").val();
    var newPub_titreShort = $("#modal-newPub-titreShort").val();
    var newPub_numero = $("#modal-newPub-numero").val();

    console.log("Ajout publication, clic bouton '" + boutonClique);
    switch (boutonClique) {
        case 'Annuler':

            if(newPub_titre != "" || newPub_numero != "" || newPub_titreShort != "") {
                if(confirm("Modifications non enregistrées.\nFermer malgré tout ?")) {
                    emptyNewPubModal();
                    $("#newPubModal").modal("hide");
                }
            }
            else {
                emptyNewPubModal();
                $("#newPubModal").modal("hide");
            }

            break;

        case 'Valider' :

            if(newPub_titre == "" || newPub_numero == "") {
                alert("Les deux champs doivent être remplis !");
            }
            else {
                if(confirm("Confirmer l'ajout de la publication ?")) {
                    var newProprietes = {};

                    newProprietes["titre"] = newPub_titre;
                    newProprietes["titre_short"] = newPub_titreShort;
                    newProprietes["numero"] = newPub_numero;
                
                    var newPublication = {};
                    var keyPub = removeAccentsSpaces(newPub_titre + "_" + newPub_numero);

                    //console.log("keyPub = " + keyPub);
                    //console.log("newProprietes = " + JSON.stringify(newProprietes));

                    newPublication["/" + keyPub + "/"] = newProprietes;
                
                    publicationsRef.update(newPublication)
                    .then(function() {

                        titresRef.child(removeAccentsSpaces(newPub_titre)).child("publications").update(newPublication)
                        .then(function() {

                            console.log("Publication ajoutée : " + keyPub);
                            emptyNewPubModal();
                            $("#newPubModal").modal("hide");
                        });

                    });

                }
            }

            break;
    }

});

// Ouverture du modal sur clic sur le bouton d'ajout de publication
$('#btn-add_pub').click(function() {

    emptyNewPubModal();

    $('#newPubModal').modal({

        onApprove : function() { return false; },

        onHidden : function() {
            emptyNewPubModal();
        }
    }).modal('show');

});

//Remplissage des tableaux des titres et de recherche titres
titresRef.on("child_added", snap => {

    var URL_logo = snap.child("URL_logo").val();
    var description = snap.child("description").val();
    var nom = snap.child("nom").val();
    var nom_short = snap.child("nom_short").val();
    var periodicite = snap.child("periodicite").val();

    titresArray.push(
      {
        URL_logo: URL_logo,
        description: description,
        nom:nom,
        nom_short:nom_short,
        periodicite:periodicite
      }
     
    );

    searchtitresArray.push(
      {
        category:periodicite,
        title:nom
      }
     
    );

    //initialisation des élements de la fonction recherche (synchrone)
    $('.ui.search') 
    .search({
      type: 'category',
      source: searchtitresArray
    });

});

$("#search-bar").on("click", function() {
  displayTitre();
});

function displayTitre() {

  // on écrit le resultat de getvalue dans choixTitre
  var choixTitre = $('.ui.search').search('get value');

  // on cherche l'objet correspondant
  arraychoixTitre = titresArray.find(k => k.nom==choixTitre);
  $("#logo-publicationURL").attr("src", arraychoixTitre.URL_logo);
  $("#modal-newPub-titre").val(arraychoixTitre.nom);
  $("#modal-newPub-titreShort").val(arraychoixTitre.nom_short);
}

publicationsRef.on("child_removed", snapPub => {

    $('#' + snapPub.key).remove();

});

publicationsRef.on("child_added", snapPub => {

    var titre = snapPub.child("titre").val();
    
    // On récupère les infos du titre correspondant à la publication
    titresRef.orderByChild("nom").equalTo(titre).on("child_added", snapTitres => {

        // Rajout de la nouvelle carte à la suite de la précédente
        $("#cardGrid").append(createCard(snapTitres.val(), snapPub, snapPub.key));
        
        bindRibbon(snapPub);
        
    });

});

//Actualisation de la carte sur modification des données en base
publicationsRef.on("child_changed", snapPub => {
    
    var titre = snapPub.child("titre").val();
    var publication = snapPub.val();
    var key = snapPub.key;
    var date = new Date(parseInt(publication.date_parution));

    $('#card-' + key + '-header').text(titre + ' n° ' + publication.numero);
    $('#card-' + key + '-URL_couv').attr('src', publication.URL_couv);
    $('#card-' + key + '-date_parution').text(date.toLocaleDateString('fr-FR'));
    $('#card-' + key + '-tags').text(publication.tags);

    titresRef.orderByChild("nom").equalTo(titre).on("child_added", snapTitres => {

        var ribbonId = "#ribbon-" + snapPub.key;
        ribbonId = ribbonId.replace(/&/g, '\\&');

        $(ribbonId).remove();

        var periodeJours = periodiciteInt[snapTitres.val().periodicite];

        $('#card-' + key + '-URL_couv').after(ribbonAlert(publication.date_parution, periodeJours, key));

        bindRibbon(snapPub);
        
    });

});


// Bind ou actualise le ribbon concerné
function bindRibbon(snapPub) {

    //remplacement du caractère spécial '&' sinon jQuery le refuse
    var ribbonId = "#ribbon-" + snapPub.key;
    ribbonId = ribbonId.replace(/&/g, '\\&');

    // bind de l'événement click au ribbon de la publication qui vient d'être ajouté
    // sur clic, paramétrage puis affichage de l'élément modal
    $(ribbonId).off().click(function() {

        modalForm(snapPub.val(), snapPub.key);

        $('#editionModal').modal({
            //closable  : false,
            onApprove : function() { return false; },

            onHidden : function() {
                emptyEditModal();
            }
        }).modal('show');

    });

};


// Vide les champs d'édition du Modal de création d'une nouvelle publication
function emptyNewPubModal () {
    $("#modal-newPub-titre").val("");
    $("#modal-newPub-titreShort").val("");
    $("#modal-newPub-numero").val("");
    $("#inp-searchBar").val("");
    $("#logo-publicationURL").attr("src", "");
}

//Vide les champs du Modal d'édition, hormis la date de parution
function emptyEditModal () {
    $("#modal-couv").attr("src", "");
    $("#modal-URL_couv").attr("href", "");
    $("#modal-URL_couv").text("");
    $("#modal-sommaire").text("");
    $("#modal-tags").text("");

    $("#modal-edit-numero").val("");
    $("#modal-edit-URL_couv").val("");
    $("#modal-edit-sommaire").val("");
    $("#modal-edit-tags").val("");
    
    $("#modal-edit-deleteHisto").checkbox("set unchecked");

};


// Renvoie l'élement ribbon à afficher en fonction de l'urgence de MAJ
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

// Renvoie l'élement card en fonction des infos de la publication
function createCard (titre, snapPublication) {
    
    var publication = snapPublication.val();
    var key = snapPublication.key;

    var periodeJours = periodiciteInt[titre.periodicite];
    var date = new Date(parseInt(publication.date_parution));

    cardString = '';
    cardString += '<div class="pubcard ui raised card" id="' + key + '">'
    cardString +=  '<div class="image">'
    cardString +=    '<img src="' + publication.URL_couv + '" id="card-' + key + '-URL_couv">'
    cardString +=    ribbonAlert(publication.date_parution, periodeJours, key)
    cardString +=   '</div>'
    cardString +=  '<div class="content">'
    cardString +=  '<a class="header" id="card-' + key + '-header">' + publication.titre + ' n° ' + publication.numero + '</a>'
    cardString +=    '<div class="meta">'
    // On transforme la date au format français avant de l'afficher
    cardString +=      '<span class="date" id="card-' + key + '-date_parution">' + date.toLocaleDateString('fr-FR') + '</span>'
    cardString +=    '</div>'
    cardString +=  '</div>'
    cardString +=  '<div class="extra content">'
    cardString +=    '<a>'
    cardString +=      '<i class="hashtag icon"></i>'
    cardString +=      '<a id="card-' + key + '-tags">' + publication.tags + '</a>'
    cardString +=    '</a>'
    cardString +=  '</div>'
    //cardString +=  '<div class="ui bottom attached teal button">'
    //cardString +=    '<i class="list icon"></i>'
    //cardString +=    'Voir Sommaire'
    //cardString +=  '</div>'
    cardString += '</div>'

    return(cardString);

}


// Modification du modal d'édition en fonction de la publication concernée
function modalForm(publication, key) {

    emptyEditModal();

    //titre
    $("#modal-edit-titre").text(publication.titre);

    //header sommaire
    $("#modal-numero").text(publication.numero);

    //URL couverture
    $("#modal-URL_couv").text(publication.URL_couv);
    $("#modal-URL_couv").attr("href", publication.URL_couv);
    $("#modal-URL_couv").attr("target", "_blank");

    //Sommaire correctement mis en forme avec des sauts de ligne
    $("#modal-sommaire").html((publication.sommaire).replace(/\n\r?/g, '<br \\>'));

    //Sommaire caché pour avoir sa vraie valeur
    $("#modal-sommaire-hidden").text(publication.sommaire);

    //tags
    $("#modal-tags").text(publication.tags);

    //image couverture
    $("#modal-couv").attr("src", publication.URL_couv);

    $("#editionModal").attr("data-value", key);
   
    $(function() {
        $('.datepicker').calendar({
          type: 'date',
          formatter: {
            date: function (date, settings) {
              if (!date) return '';
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();
              return day + '/' + month + '/' + year;
            }
          }
        });

        $('.datepicker').calendar('set date', new Date(parseInt(publication.date_parution)));

    });
    
};


//Supprime les espaces & les accents, pour obtention des clés firebase associées aux publications
function removeAccentsSpaces(str) {
  var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split('');
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) != -1) {
      str[i] = accentsOut[x];
    }
  }
  
  str = str.join('');
  str = str.replace(/\s+/g, '');
  str = str.replace(/\'/g, '');
  str = str.replace(/,/g, '');
  
  return str;
}