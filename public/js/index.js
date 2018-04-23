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

  var publicationsRef = firebase.database().ref().child("publications");

  publicationsRef.on("child_added", snap => {

    var URL_couv = snap.child("URL_couv").val();
    var date_parution = snap.child("date_parution").val();
    var numero = snap.child("numero").val();
    var sommaire = snap.child("sommaire").val();
    var tags = snap.child("tags").val();
    var titre = snap.child("titre").val();

    cardString = '';
    cardString += '<div class="ui raised card">'
    cardString +=  '<div class="image">'
    cardString +=    '<img src="' + URL_couv + '">'
    cardString +=   '</div>'
    cardString +=  '<div class="content">'
    cardString +=  '<a class="header" id="nom">' + titre + ' n° ' + numero + '</a>'
    cardString +=    '<div class="meta">'
    cardString +=      '<span class="date" id="date_parution">' + date_parution + '</span>'
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

    $("#cardGrid").append(cardString);

    // alert(cardString);

  });