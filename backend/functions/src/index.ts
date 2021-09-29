// Libs
import * as functions from "firebase-functions";
import { firestore, initializeApp } from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

// Types
interface IResponse {
  status: "success" | "fail" | "error";
  data?: {};
  message?: string;
  code?: number;
}

// Init
initializeApp();
const transactions = express();
transactions.use(cors({ origin: true }));
exports.transactions = functions
  .region("europe-west1")
  .https.onRequest(transactions);

// Helper
const docWithID = function (
  docSnapshot: firestore.DocumentSnapshot<firestore.DocumentData>,
) {
  return {
    ...docSnapshot.data(),
    id: docSnapshot.id,
  };
};

// GET /transactions/
transactions.get("/", (req, res) => {
  firestore()
    .collection("transactions")
    .get()
    .then((docSnapshots) => {
      const data = docSnapshots.docs.map((docSnapshot) =>
        docWithID(docSnapshot),
      );

      const response: IResponse = {
        status: "success",
        data: { transactions: data },
      };
      res.json(response);
    });
});

// GET /transactions/:id
// ??? Error handling: doc not found
transactions.get("/:id", (req, res) => {
  const id = req.params.id;

  firestore()
    .doc(`transactions/${id}`)
    .get()
    .then((docSnapshot) => {
      const response: IResponse = {
        status: "success",
        data: { transaction: docWithID(docSnapshot) },
      };
      res.json(response);
    });
});

// POST /transactions/
// ??? Error handling: failed to create
transactions.post("/", (req, res) => {
  const transaction = req.body.data;

  firestore()
    .collection("transactions")
    .add(transaction)
    .then((docRef) => docRef.get())
    .then((docSnapshot) => {
      const response: IResponse = {
        status: "success",
        data: { transaction: docWithID(docSnapshot) },
      };
      res.json(response);
    });
});

// DELETE /transactions/
// ??? Error handling: no doc found
transactions.delete("/", (req, res) => {
  const ids = req.body.data;
  const writeBatch = firestore().batch();

  ids.forEach((id: string) => {
    writeBatch.delete(firestore().doc(`transactions/${id}`));
  });

  writeBatch.commit().then((doc) => {
    const response: IResponse = {
      status: "success",
      code: 204,
    };
    res.json(response);
  });
});
