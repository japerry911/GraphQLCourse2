var admin = require("firebase-admin");

var serviceAccount = require("../config/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.authCheck = async (req) => {
  try {
    return await admin.auth().verifyIdToken(req.headers.authtoken);
  } catch (error) {
    throw new Error(`Invalid or Expired Token - ${error}`);
  }
};
