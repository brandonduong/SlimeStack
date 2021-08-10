const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const NEW_ACCOUNT_SLIME_COINS = 0;
const MAX_SLIME_COINS = 9999999;

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

      return snap.ref.set({slimeCoins: NEW_ACCOUNT_SLIME_COINS, dailyLogin: false, wins: 0, losses: 0}, {merge: true});
    });

exports.capSlimeCoins = functions.firestore.document("users/{documentId}")
    .onUpdate((change, context) => {
      let newValue = change.after.data().slimeCoins;

      functions.logger.log("Checking slimecoins for", context.params.documentId);
      if (newValue > MAX_SLIME_COINS) {
        newValue = MAX_SLIME_COINS;
      }
      return change.after.ref.set({slimeCoins: newValue}, {merge: true});
    });

exports.resetDailyLogin = functions.pubsub.schedule("every day 00:00")
    .onRun(async context => {
      const snapshot = await admin.firestore().collection("users").where("dailyLogin", "==", true).get();
      await snapshot.forEach((doc) => {
        admin.firestore().collection("users").doc(doc.id).update({dailyLogin: false}).then((r) => functions.logger.log("Reset daily login reward for", doc.id));
      });
    });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
