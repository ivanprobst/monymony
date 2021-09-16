import * as functions from "firebase-functions";
import * as corsMod from "cors";
import { firestore, initializeApp } from "firebase-admin";

initializeApp();
const cors = corsMod({ origin: true });

// addTransaction
exports.addTransaction = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // ??? improve with JSON post?
    const transaction = req.query.transaction
      ? JSON.parse(req.query.transaction as string)
      : {};

    const writeResult = await firestore()
      .collection("transactions")
      .add(transaction);

    res.json({ id: writeResult.id });
  });
});

// getTransactions
exports.getTransactions = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const documentsRefs = await firestore()
      .collection("transactions")
      .listDocuments();

    const documents = await firestore().getAll(...documentsRefs);

    const data = documents.map((document) => [
      document.id,
      { ...document.data(), id: document.id },
    ]);

    res.json({ data });
  });
});
