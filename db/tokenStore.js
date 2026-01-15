const db = require("./db");
const { decrypt } = require("../utils/crypto");

// Fetch latest token for provider
function getLatestToken(provider) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT encrypted_token FROM tokens 
       WHERE provider = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [provider],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        if (!row) {
          return resolve(null);
        }

        // Decrypt before returning
        const decryptedToken = decrypt(row.encrypted_token);
        resolve(decryptedToken);
      }
    );
  });
}

module.exports = {
  getLatestToken
};
