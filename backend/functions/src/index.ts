import * as functions from "firebase-functions";
import * as corsMod from "cors";
import { firestore, initializeApp } from "firebase-admin";

initializeApp();
const cors = corsMod({ origin: true });

// Helper
const getAllTransactions = async function () {
  const snapshot = await firestore().collection("transactions").get();
  return snapshot.docs.map((transaction) => ({
    ...transaction.data(),
    id: transaction.id,
  }));
};

// addTransaction
exports.addTransaction = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      // ??? improve with JSON post?
      const transaction = req.query.transaction
        ? JSON.parse(req.query.transaction as string)
        : {};

      await firestore().collection("transactions").add(transaction);

      const data = await getAllTransactions();
      res.json({ data });
    });
  });

// deleteTransactions
exports.deleteTransactions = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      // ??? improve with JSON post?
      const ids = req.query.ids ? JSON.parse(req.query.ids as string) : [];
      const writeBatch = firestore().batch();

      ids.forEach((id: string) => {
        writeBatch.delete(firestore().doc(`transactions/${id}`));
        functions.logger.info("added to batch: ", id);
      });
      await writeBatch.commit();

      const data = await getAllTransactions();
      res.json({ data });
    });
  });

// getTransactions
exports.getTransactions = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      const data = await getAllTransactions();
      res.json({ data });
    });
  });
