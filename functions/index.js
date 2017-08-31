const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.contadorComentarios = functions.database.ref('comentarios/{pushId}/{idDos}')
    .onCreate(event => {
        var upvotesRef = admin.database().ref('datos/numComments');
        upvotesRef.transaction(function (current_value) {
          return (current_value || 0) + 1;
        });
    });