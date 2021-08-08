const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const NEW_ACCOUNT_SLIME_COINS = 0;

// exports.makeUppercase = functions.firestore.document("/messages/{documentId}")
//     .onCreate((snap, context) => {
//       const original = snap.data().original;
//
//       functions.logger.log("Uppercasing", context.params.documentId, original);
//
//       const uppercase = original.toUpperCase();
//
//       return snap.ref.set({uppercase}, {merge: true});
//     });

exports.initializeNewAccount = functions.firestore.document("users/{documentId}")
    .onCreate((snap, context) => {
      functions.logger.log("Initializing slime coins for", context.params.documentId);

      return snap.ref.set({slimeCoins: NEW_ACCOUNT_SLIME_COINS, dailyLogin: false}, {merge: true});
    });

// exports.resetDailyLogin = functions.pubsub.schedule("every 5 minutes")
//     .onRun((context) => {
//       const snapshot = admin.firestore().collection("users").where("dailyLogin", "==", true).get();
//       snapshot.forEach((doc) => {
//         admin.firestore().collection("users").doc(doc.id).update({dailyLogin: false}).then((r) => functions.logger.log("Reset daily login reward for", doc.id));
//       });
//     });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
