const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// TEMP memory store (Day 1 only)
const store = new Map();

/**
 * Convert buffer to base64url
 */
function base64url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Generate random state
 */
function generateState() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate PKCE verifier + challenge
 */
function generatePKCE() {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(
    crypto.createHash("sha256").update(verifier).digest()
  );

  return { verifier, challenge };
}

// ===== /connect =====
router.get("/connect", (req, res) => {
  const state = generateState();
  const { verifier, challenge } = generatePKCE();

  // store verifier securely (server-side)
  store.set(state, { verifier });

  const params = new URLSearchParams({
    client_id: process.env.ADO_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.ADO_REDIRECT_URI,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256"
  });

  const redirectUrl =
    `${process.env.ADO_AUTHORIZE_URL}?${params.toString()}`;

  // 🚀 REAL REDIRECT
  res.redirect(redirectUrl);
});

// ===== /callback =====
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  // 1️⃣ Basic validation
  if (!code || !state) {
    return res.status(400).send("Missing code or state in callback");
  }

  // 2️⃣ Validate state
  if (!store.has(state)) {
    return res.status(400).send("Invalid or expired state");
  }

  const { verifier } = store.get(state);
  store.delete(state); // one-time use

  // 3️⃣ Check if client_id exists
  if (
    !process.env.ADO_CLIENT_ID ||
    process.env.ADO_CLIENT_ID === "YOUR_CLIENT_ID"
  ) {
    return res.send(`
      <h2>OAuth callback reached successfully ✅</h2>
      <p>Authorization code received.</p>
      <p><strong>Token exchange skipped</strong> because ADO_CLIENT_ID is not configured.</p>
      <p>This is expected due to missing org-level OAuth permissions.</p>
    `);
  }

  // 4️⃣ Token exchange (will work once client_id is available)
  try {
    const axios = require("axios");

    const tokenResponse = await axios.post(
      process.env.ADO_TOKEN_URL,
      new URLSearchParams({
        client_id: process.env.ADO_CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.ADO_REDIRECT_URI,
        code_verifier: verifier
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    // ⚠️ NEVER log token
    res.send(`
      <h1>Connected ✅</h1>
      <p>Azure DevOps authorization successful.</p>
    `);
  } catch (err) {
    res.status(500).send("Token exchange failed");
  }
});

module.exports = router;
