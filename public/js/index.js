
//////////////////////////////////////////// INITIALISATIONS ////////////////////////////////////////////


/********** Initialisation Firebase ***********/
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


/********** Initialisations pour traitements Dashboard ***********/
const refLink = "https://m.me/newspayper.fr";

var today = new Date();

var periodiciteInt = {
    'Quotidien' : 1,
    'Hebdomadaire' : 7,
    'Quinzomadaire' : 15,
    'Bimensuel' : 15,
    'Mensuel' : 30,
    'Bimestriel' : 60,
    'Trimestriel' : 90,
    'Semestriel' : 182 
};

var periodiciteAnnonce = {
    'Quotidien' : "Aujourd'hui",
    'Hebdomadaire' : "Cette semaine",
    'Quinzomadaire' : "Cette quinzaine",
    'Bimensuel' : "Ce mois-ci",
    'Mensuel' : "Ce mois-ci",
    'Bimestriel' : "Ce mois-ci",
    'Trimestriel' : "Ce mois-ci",
    'Semestriel' : "Ce semestre"
};

var hashtagsInsta = " | 📝 Sommaire complet en cliquant sur le lien dans la bio ! 🔝\n";
    hashtagsInsta += "#enkiosque #kiosque #alaune #une #laune #couverture #cover #coverjunkie #presse #papier #print #pressepapier #magazine #journal #journaux"

var arraychoixTitre = [];
var titresArray = [];
var searchtitresArray = [];




//////////////////////////////////////////// BIND EVENEMENTS ////////////////////////////////////////////


/********* Gestion des boutons des modaux *********/

/*** Boutons du modal d'édition publication ***/
$('.modal-edit-btn').click(function() {

    var keyPub = $('#editionModal').attr("data-value");
    var boutonClique = $(this).data("value");

    var edit_URL_couv = $("#modal-edit-URL_couv").val();
    var edit_numero = $("#modal-edit-numero").val();
    var edit_URL_achat = $("#modal-edit-URL_achat").val();
    var edit_tags = $("#modal-edit-tags").val();
    var edit_sommaire = $("#modal-edit-sommaire").val();

    var current_URL_couv = $("#modal-URL_couv").text();
    var current_URL_achat = $("#modal-URL_achat").text();
    var current_numero = $("#modal-numero").text();
    var current_tags = $("#modal-tags").text();
    var current_sommaire = $("#modal-sommaire-hidden").text();

    var titre = $("#modal-edit-titre").text();

    var date_parution = new Date(Date.parse($('.datepicker').calendar('get date')));

    date_parution.setHours(0,0,0); //on se met à minuit


    switch (boutonClique) {
        case 'fermer':
            if(edit_URL_couv != "" || edit_numero != "" || edit_tags != "" || edit_sommaire != "" || edit_URL_achat != "") {
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

                    if(edit_URL_achat != "") {URL_achat = edit_URL_achat;}
                    else {URL_achat = current_URL_achat;}

                    if(edit_numero != "") {numero = edit_numero;}
                    else {numero = current_numero;}

                    if(edit_tags != "") {tags = edit_tags;}
                    else {tags = current_tags;}

                    if(edit_sommaire != "") {sommaire = edit_sommaire;}
                    else {sommaire = current_sommaire;}

                    publication["URL_couv"] = URL_couv;
                    publication["URL_achat"] = URL_achat;
                    publication["numero"] = numero;
                    publication["tags"] = tags;
                    publication["sommaire"] = sommaire;
                    publication["date_parution"] = date_parution.getTime();

                    publicationRef = publicationsRef.child(keyPub);
                    
                    publicationRef.update(publication)
                    .then(function() {
                        modalForm(publication, keyPub); //le 3e argument est undefined si pas passé

                        titresRef.child(removeAccentsSpaces(titre)).child("publications").child(keyPub).update(publication);

                    });
                }
            }
            break;
    
        case 'creerSuivante':
            
            if(confirm("Confirmer la création de la publication suivante ?")) {
                
                var newProprietes = {};                
                arraychoixTitre = titresArray.find(k => k.nom==titre);
                newProprietes["titre_short"] = arraychoixTitre.nom_short;
                newProprietes["titre"] = titre;
                newProprietes["numero"] = parseInt(current_numero)+1;

                var newPublication = {};
                var keyPub = removeAccentsSpaces(titre + "_" + (parseInt(current_numero) + 1) );
                
                newPublication["/" + keyPub + "/"] = newProprietes;
                
                    publicationsRef.update(newPublication)
                    .then(function() {

                        titresRef.child(removeAccentsSpaces(titre)).child("publications").update(newPublication)
                        .then(function() {

                            // var publication = {};
                            // publication["URL_couv"] = "";
                            // publication["URL_achat"] = "";
                            // publication["numero"] = current_numero;
                            // publication["tags"] = "";
                            // publication["sommaire"] = "";
                            // publication["date_parution"] = "";

                            // console.log("Publication ajoutée : " + keyPub);
                            // modalForm(publication, keyPub);
                            $("#editionModal").modal("hide");
                        });

                    });
            }
            break;
    }
});

/*** Bouton validation création nouvelle publication ***/
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


/********* Gestion des boutons des modaux *********/

/****** Ouverture du modal d'ajout de nouvelle publication ******/
$('#btn-add_pub').click(function() {

    emptyNewPubModal();

    $('#newPubModal').modal({

        onApprove : function() { return false; },

        onHidden : function() {
            emptyNewPubModal();
        }
    }).modal('show');
});

/****** Lancement de la recherche de titre dans le pop-up de rajout nouvelle publication ******/
$("#search-bar").on("click", function() {
  displayTitre();
});

/****** Ouverture du modal de scraping couvertures ******/
$('#modal-edit-btnScrapingModal').click(function() {
    
    var toto= "ahaha";

    $('#scrapingModal').modal('setting', 'closable', false)
    .modal({
        allowMultiple : true
    }).modal('show');
});

/****** Bouton qui déclenche le scraping de la couverture ******/
$('#btn-launchScraping').click(function() {
});

/****** Bouton qui déclenche l'upload Cloudinary + update de la BDD ******/
$('#btn-uploadUpdate').click(function() {

    if(confirm("Confirmer l'upload sur Cloudinary")) {
        var url_image = $("#scrapingModal_scrapedCouv").attr("src");
        var idPublication = $('#editionModal').attr("data-value");

        var data = 
        {
          "url_image": url_image,
          "idPublication": idPublication
        };
     
        $.ajax({
            type: "POST",
            url: "https://hooks.zapier.com/hooks/catch/3041686/cjw5k3/",
            data: JSON.stringify(data),
            success: function(r1) {       
            },
            error: function(r1) { 
                alert("Echec de l'envoi du POST à Zapier");         
            }
        });
    }
});




//////////////////////////////////////////// AUTRES ////////////////////////////////////////////

/*** Gestion de la couleur des textes indiquant le nombre de caractères : sommaire ***/
$('#modal-edit-sommaire').on('input', function() {
    var nbcar = $('#modal-edit-sommaire').val().length;
    $('#modal-edit-nbcarSommaire').text(nbcar + "/2000 caractères");
    if(nbcar<=2000)
        $('#modal-edit-nbcarSommaire').css('color', 'green');
    else
        $('#modal-edit-nbcarSommaire').css('color', 'red');
});

/*** Gestion de la couleur des textes indiquant le nombre de caractères : tags ***/
$('#modal-edit-tags').on('input', function() {
    var nbcar = $('#modal-edit-tags').val().length;
    $('#modal-edit-nbcarTags').text(nbcar + "/80 caractères");
    if(nbcar<=80)
        $('#modal-edit-nbcarTags').css('color', 'green');
    else
        $('#modal-edit-nbcarTags').css('color', 'red');
});


/*** Edition de la couleur de bordure pour rajouter un suffixe Cloudinary ***/
$('#modal-edit-inpBorderColor').keyup(function() {
    var couleur = $('#modal-edit-inpBorderColor').val();
    if(/^#[0-9A-F]{6}$/i.test(couleur)) {
        $('#modal-edit-inpBorderColor').css('background-color', couleur);
    }
});




//////////////////////////////////////////// TRAITEMENTS LECTURE BDD ////////////////////////////////////////////

/*** Ajout des cartes de publication ***/
publicationsRef.orderByChild('date_parution').on("child_added", snapPub => {

    var titre = snapPub.child("titre").val();
    
    // On récupère les infos du titre correspondant à la publication
    titresRef.orderByChild("nom").equalTo(titre).on("child_added", snapTitre => {

        // Rajout de la nouvelle carte à la suite de la précédente
        $("#cardGrid").prepend(createCard(snapTitre.val(), snapPub, snapPub.key));
        
        bindRibbon(snapPub, snapTitre);
        
    });
});

/*** Actualisation des cartes de publication lorsque les données changent ***/
publicationsRef.on("child_changed", snapPub => {
    
    var titre = snapPub.child("titre").val();
    var publication = snapPub.val();
    var key = snapPub.key;
    var date = new Date(parseInt(publication.date_parution));

    $('#card-' + key + '-header').text(titre + ' n° ' + publication.numero);
    $('#card-' + key + '-URL_couv').attr('src', publication.URL_couv);
    //$('#card-' + key + '-URL_achat').attr('src', publication.URL_achat); vérifier si utile
    $('#card-' + key + '-date_parution').text(date.toLocaleDateString('fr-FR'));
    $('#card-' + key + '-tags').text(publication.tags);

    titresRef.orderByChild("nom").equalTo(titre).on("child_added", snapTitre => {

        var ribbonId = "#ribbon-" + snapPub.key;
        ribbonId = ribbonId.replace(/&/g, '\\&');

        $(ribbonId).remove();

        var periodeJours = periodiciteInt[snapTitre.val().periodicite];

        $('#card-' + key + '-URL_couv').after(ribbonAlert(publication.date_parution, periodeJours, key));

        bindRibbon(snapPub, snapTitre);
        
    });
});

/*** Récupération des données titres pour utilisation ultérieure ***/
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

/*** Gestion de la suppression de publication ***/
publicationsRef.on("child_removed", snapPub => {
    $('#' + snapPub.key).remove();
});




//////////////////////////////////////////// FONCTIONS ////////////////////////////////////////////

/*** Bind ou actualisation du bind des ribbons (pour ouverture et remplissage modal édition) ***/
function bindRibbon(snapPub, snapTitre) {

    //remplacement du caractère spécial '&' sinon jQuery le refuse
    var ribbonId = "#ribbon-" + snapPub.key;
    ribbonId = ribbonId.replace(/&/g, '\\&');

    // bind de l'événement click au ribbon de la publication qui vient d'être ajouté
    // sur clic, paramétrage puis affichage de l'élément modal
    $(ribbonId).off().click(function() {

        modalForm(snapPub.val(), snapPub.key, snapTitre.val());

        $('#editionModal').modal({
            allowmultiple  : true,
            onApprove : function() { return false; },

            onHidden : function() {
                emptyEditModal();
            }
        }).modal('setting', 'closable', false).modal('show');

    });
};

/*** RAZ du modal de création de nouvelle publication ***/
function emptyNewPubModal () {
    $("#modal-newPub-titre").val("");
    $("#modal-newPub-titreShort").val("");
    $("#modal-newPub-numero").val("");
    $("#inp-searchBar").val("");
    $("#logo-publicationURL").attr("src", "");
}

/*** RAZ du modal d'édition de publication ***/
function emptyEditModal () {
    $("#editionModal").attr("data-value", "");

    $("#modal-couv").attr("src", "");
    $("#modal-URL_couv").attr("href", "");
    $("#modal-URL_couv").text("");
    $("#modal-URL_achat").attr("href", "");
    $("#modal-URL_achat").text("");
    $("#modal-sommaire").text("");
    $("#modal-sommaire-hidden").text("");
    $("#modal-tags").text("");

    $("#modal-edit-numero").val("");
    $("#modal-edit-achat").val("");
    $("#modal-edit-URL_couv").val("");
    $("#modal-edit-URL_achat").val("");
    $("#modal-edit-sommaire").val("");
    $("#modal-edit-tags").val("");
    
    $("#modal-edit-deleteHisto").checkbox("set unchecked");
};

/*** Préparation de l'affichage d'informations sur le ribbon d'une card publication ***/
function ribbonAlert (date_parution, periodeJours, key) {
    
    // Calcul de la difference entre les dates en jours (arrondi au supérieur)
    var diff = Math.ceil((today - date_parution) / 86400000);
    
    var reste = periodeJours - diff;
    if (reste < 3) {
      return '<a class="ui red ribbon label" id="ribbon-' + key + '">RESTE '+ reste + ' JOURS</a>' ;
    } else {
      return '<a class="ui green ribbon label" id="ribbon-' + key + '">RESTE '+ reste + ' JOURS</a>' ;
    }
};

/*** Création HTML d'une carte en fonction des infos publications ***/
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
    cardString += '</div>'

    return(cardString);
}

/*** Préparation des modaux d'édition et de scraping en fonction de la publication sélectionnée ***/
function modalForm(publication, key, titre) {

    /*** Modal d'édition ***/

    emptyEditModal();

    //titre
    $("#modal-edit-titre").text(publication.titre);

    //header sommaire
    $("#modal-numero").text(publication.numero);

    //URL couverture
    $("#modal-URL_couv").text(publication.URL_couv);
    $("#modal-URL_couv").attr("href", publication.URL_couv);
    $("#modal-URL_couv").attr("target", "_blank");

    //URL couverture
    $("#modal-URL_achat").text(publication.URL_achat);
    $("#modal-URL_achat").attr("href", publication.URL_achat);
    $("#modal-URL_achat").attr("target", "_blank");

    $('#modal-edit-btnBorderColor').click(function() {
       
        var couleur = $('#modal-edit-inpBorderColor').val();
        if(/^#[0-9A-F]{6}$/i.test(couleur)) {
            
            if(publication.URL_couv !== "" && publication.URL_couv !== undefined) {
                
                var URL_couv = publication.URL_couv.split('/');

                var newURL  = "https://res.cloudinary.com/newspayper/image/upload/";
                    newURL += "b_rgb:474747,c_fit,e_shadow,h_970,q_90/b_rgb:";
                    newURL += couleur.substr(1);
                    newURL += ",c_lpad,h_1125,w_1125/";
                    newURL += URL_couv[URL_couv.length - 1];

                $('#modal-edit-URL_couv').val(newURL);
            }
        }
    });

    $('#btn-idPublication').click(function() {
        copyToClipboard(key);
    });

    //Copie dans le presse papier des hashtags Instagram
    $('#btn-insta').click(function() {

        var texteACopier  = periodiciteAnnonce[titre.periodicite] + " dans " + titre.at_insta + " | ";
            texteACopier += publication.tags;
            texteACopier += hashtagsInsta + " " + titre.hashtags;

        copyToClipboard(texteACopier);
    });

    //Copie dans le presse papier des hashtags Twitter
    $('#btn-twitter').click(function() {

        var tags = publication.tags.split('· ');

        //var texteACopier  = periodiciteAnnonce[titre.periodicite] + " dans " + titre.at_insta + "\n";
        var texteACopier  = "Retrouvez " + titre.at_insta;
            //texteACopier += hashtagsInsta + " " + titre.hashtags;
            texteACopier += ' dans la #revuedepresse de @newspayper_fr sur @messenger 🗨️ 📰\n👉 ';
            texteACopier += refLink + "?ref=sharedPublication%7C" + key;
            texteACopier += ' 👈\n\n';

            for (i = 0; i < tags.length; i++) {
                texteACopier += tags[i] + '\n';
            }

        copyToClipboard(texteACopier);
    });
    
    //Sommaire correctement mis en forme avec des sauts de ligne
    if(publication.sommaire != undefined) {
        $("#modal-sommaire").html((publication.sommaire).replace(/\n\r?/g, '<br \\>'));
    }
    
    //Sommaire caché pour avoir sa vraie valeur
    $("#modal-sommaire-hidden").text(publication.sommaire);

    //tags
    $("#modal-tags").text(publication.tags);

    //Copie dans le presse papier du point médian
    $('#btn-ptMedian').click(function() {
        copyToClipboard("·");
    });

    //Copie dans le presse papier de la terminaison URL pour éviter le redirect Facebook
    $('#btn-termRedirectFB').click(function() {
        copyToClipboard("?v=%20");
    });

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

    var cacher_sources = false;
    var epresse;
    if(titre != undefined) {
        if(titre.liens != undefined) {

            var source1 = titre.liens.source1;
            if(source1 == undefined) {
                $("#btn-source1").hide().off();
            }
            else {
                $("#btn-source1").show().off().click(function() {
                    var win = window.open(source1);
                });
            }
            
            var source2 = titre.liens.source2;
            if(source2 == undefined) {
                $("#btn-source2").hide().off();
            }
            else {
                $("#btn-source2").show().off().click(function() {
                    var win = window.open(source2);
                });
            }

            var journaux_fr = titre.liens.journaux_fr;
            if(journaux_fr == undefined) {
                $("#btn-journaux_fr").hide().off();
            }
            else {
                $("#btn-journaux_fr").show().off().click(function() {
                    var win = window.open(journaux_fr);
                });
            }

            epresse = titre.liens.epresse;
            if(epresse == undefined) {
                $("#btn-epresse").hide().off();
            }
            else {
                $("#btn-epresse").show().off().click(function() {
                    var win = window.open(epresse);
                });
            }

        }
        else {
            cacher_sources = true;
        }
    }
    else {
        cacher_sources = true;
    }

    if(cacher_sources) {
        $("#btn-source1").hide().off();
        $("#btn-source2").hide().off();
        $("#btn-journaux_fr").hide().off();
        $("#btn-epresse").hide().off();
    }


    /*** Modal de scraping couverture ***/
    //Remplissage des champs et affichage des images
    $("#scrapingModal_scrapedCouv").attr("src", "https://res.cloudinary.com/newspayper/image/upload/v1544628403/patrick_square.jpg");
    $("#scrapingModal_urlScrapedCouv").val("");
    if(undefined!==publication.URL_couv) {
        $("#scrapingModal_imageBDD").attr("src", publication.URL_couv);
        $("#scrapingModal_urlImageBDD").val(publication.URL_couv);
    }
    

    //Récupération des derniers résultats du scraping global d'epresse
    if(undefined!==epresse) {
        $.ajax({
          url: "https://api.apify.com/v1/mmB4sJ9GGuMfhp7sk/crawlers/CfgFNR6WKCbC3YYqm/lastExec/results?token=oW3ZePMZFjmdivSBrhw6LnMME",
          success: function(results) {
            for (var i = results.length - 1; i >= 0; i--) {
                //Si l'url epresse est bien celle qui a été scrapée
                if(results[i].loadedUrl == epresse) {
                    $("#scrapingModal_urlScrapedCouv").val(results[i].pageFunctionResult.imgUrl);
                    $("#scrapingModal_scrapedCouv").attr("src", results[i].pageFunctionResult.imgUrl);
                }
            }
          }
        });
    }
};

/*** Fonction de recherche et d'affichage du titre dans le pop-up de création nouvelle publication ***/
function displayTitre() {
  var choixTitre = $('.ui.search').search('get value');
  // Recherche du titre  et affichage
  arraychoixTitre = titresArray.find(k => k.nom==choixTitre);
  $("#logo-publicationURL").attr("src", arraychoixTitre.URL_logo);
  $("#modal-newPub-titre").val(arraychoixTitre.nom);
  $("#modal-newPub-titreShort").val(arraychoixTitre.nom_short);
}

/*** Suppression espaces & accents, pour obtention des clés firebase associées aux publications ***/
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
};

/*** Copie une chaîne de caractères dans le clipboard. Uniquement sur Google Chrome ***/
function copyToClipboard(str) {

    navigator.permissions.query({name: "clipboard-write"}).then(result => { 
        if (result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(str);
            console.log("String copied to clipboard : " + str);
        }
    });
};