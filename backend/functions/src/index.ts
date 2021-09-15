import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// My test function
exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin
    .firestore()
    .collection("messages")
    .add({ original: original });
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});
