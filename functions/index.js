/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const logger = require("firebase-functions/logger");
const { onObjectFinalized } = require("firebase-functions/v2/storage");

const { v4: uuidv4 } = require("uuid");

admin.initializeApp();
// Create and deploy your function
// https://firebase.google.com/docs/functions/get-started
exports.importJSON = onObjectFinalized({ maxInstances: 1 }, async (event) => {
  logger.info("processing file", { structuredData: true });
  const db = admin.firestore();

  const fileBucket = event.data.bucket; // Storage bucket containing the file.
  const filePath = event.data.name;

  const bucket = getStorage().bucket(fileBucket);

  // Download file to memory
  const downloadResponse = await bucket.file(filePath).download();
  // Then convert the file to Json
  const json = JSON.parse(downloadResponse.toString());

  // Get batch client
  const batch = db.batch();

  // Perform updates
  json.forEach((todo) => {
    const ref = db.doc(`todos/${uuidv4()}`);
    batch.set(ref, todo);
  });

  // Commit updates
  await batch.commit();
});
