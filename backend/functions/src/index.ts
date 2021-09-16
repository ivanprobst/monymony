import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsMod from "cors";

admin.initializeApp();
const cors = corsMod({ origin: true });

// addTransaction
exports.addTransaction = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // ??? improve with JSON post?
    const transaction = req.query.transaction
      ? JSON.parse(req.query.transaction as string)
      : {};

    const writeResult = await admin
      .firestore()
      .collection("transactions")
      .add(transaction);

    res.json({ id: writeResult.id });
  });
});
