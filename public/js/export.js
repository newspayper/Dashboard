
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
var usersRef = firebase.database().ref().child("users");

var today = new Date();

var data_users = [];

var stockData = [  
        {
            Symbol: "AAPL",
            Company: "Apple Inc.",
            Price: 132.54
        },
        {
            Symbol: "INTC",
            Company: "Intel Corporation",
            Price: 33.45
        },
        {
            Symbol: "GOOG",
            Company: "Google Inc",
            Price: 554.52
        },
    ];

var nbUsers = 0;
var nbLogs = 0;
//recup des logs
usersRef.on("child_added", snapUser => {

    var user = snapUser.val();
    var logs = user.logs;
    var key = snapUser.key;

    if(logs != undefined) {

        //console.log(JSON.stringify(logs));

        for(var log in logs) { 
            var attr = logs[log];

            var last_input="", last_block="", contenu_envoye="", idPublication="";
            
            if(attr["contenu_envoye"] != undefined)
                contenu_envoye = attr["contenu_envoye"];

            if(attr["last_input"] != undefined)
                last_input = attr["last_input"];

            if(attr["last_block"] != undefined)
                last_block = attr["last_block"];

            if(attr["idPublication"] != undefined)
                idPublication = attr["idPublication"];

            //console.log(JSON.stringify(attr));
            data_users.push(
                {
                    messengerUserId: user.messengerUserId,
                    nom: user.nom,
                    timestamp: attr.timestamp,
                    contenu_envoye: contenu_envoye,
                    last_input: last_input,
                    last_block: last_block,
                    idPublication: idPublication
                }
            );
        }

        //console.log(JSON.stringify(data_users));

    }

});

$("#btn-export").click(function() {

    console.log("Export");

    //titresRef.orderByChild("nom").equalTo(titre).on("child_added", snapTitre => {

    //downloadCSV({ filename: "stock-data.csv" });
    
    // Start file download.
    download("test.csv","This is the content of my file :)");
});

function convertArrayOfObjectsToCSV(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ';';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }


function download(filename, text) {

    var csv = convertArrayOfObjectsToCSV({
            data: data_users
          });
    if (csv == null) return;

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


