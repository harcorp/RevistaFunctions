const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
var nodemailer = require('nodemailer');
admin.initializeApp(functions.config().firebase);
const correo = "planteamientoseneducacion@gmail.com";
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: correo,
        pass: 'Planteamientos2017'
    }
});





exports.contadorComentarios = functions.database.ref('comentarios/{pushId}/{idDos}')
    .onCreate(event => {
        var upvotesRef = admin.database().ref('datos/numComments');
        upvotesRef.transaction(function (current_value) {
            return (current_value || 0) + 1;
        });
    });

exports.sendEmailAproved = functions.database.ref('comentarios/{pushId}/{idDos}')
    .onUpdate(event => {
        var dsnap = event.data;
        const original = event.data.val();

        if (original.aproved) {
            admin.auth().getUser(event.data.val().uid_user)
                .then(userRecord => {
                    var mailAproved = {
                        from: correo,
                        to: userRecord.email,
                        subject: 'Su comentario fue aprobado',
                        text: 'El comentario que realizo en nuestra plataforma fue aprobado por el administrador.'
                    };
                    transporter.sendMail(mailAproved, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            
                        }
                    });
                })
                .catch(function (error) {
                    console.log("Error fetching user data:", error);
                });
        }
    });

exports.sendEmailDelete = functions.database.ref('comentarios/{pushId}/{idDos}')
    .onDelete(event => {
        var file=event.data.previous.val();
        admin.auth().getUser(file.uid_user)
        .then(userRecord => {
            var mailDelete = {
                from: correo,
                to: userRecord.email,
                subject: 'Su comentario no fue aprobado',
                text: 'El comentario que realizo en nuestra plataforma no fue aprobado por el administrador.'
            };
            transporter.sendMail(mailDelete, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    
                }
            });
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
        });
    });