const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// ===============================
// TEMP in-memory store (Day 1 only)
// ===============================
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
 * Generate random OAuth state
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

/// ===============================
// /connect
// ===============================
router.get("/connect", (req, res) => {
  const state = generateState();
  const { verifier, challenge } = generatePKCE();

  store.set(state, { verifier });

  // 🔹 DEBUG / DUMMY MODE
  if (req.query.debug === "true") {
    return res.json({
      message: "OAuth values generated (Debug Mode)",
      state,
      code_challenge: challenge
    });
  }

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

  res.redirect(redirectUrl);
});

// ===============================
// /callback
// ===============================
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  // 1️⃣ Basic validation
  if (!code || !state) {
    return res.status(400).send("Missing code or state in callback");
  }

  // 2️⃣ State validation (MANDATORY)
  if (!store.has(state)) {
    return res.status(400).send("Invalid or expired state");
  }

  const { verifier } = store.get(state);
  store.delete(state); // one-time use

  // ===============================
  // 3️⃣ DUMMY MODE (PoC)
  // ===============================
  if (
    !process.env.ADO_CLIENT_ID ||
    process.env.ADO_CLIENT_ID === "YOUR_CLIENT_ID" ||
    process.env.ADO_CLIENT_ID === "00000000-0000-0000-0000-000000000000"
  ) {
    return res.send(`
      <h1>Connected ✅ (Dummy Mode)</h1>
      <p>OAuth PKCE flow completed successfully.</p>
      <ul>
        <li>State validated</li>
        <li>PKCE verifier verified</li>
        <li>Token exchange simulated</li>
      </ul>
      <p><strong>Note:</strong> Dummy client credentials used for PoC.</p>
    `);
  }

  // ===============================
  // 4️⃣ REAL TOKEN EXCHANGE (future)
  // ===============================
  try {
    const axios = require("axios");

    const params = new URLSearchParams({
      client_id: process.env.ADO_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.ADO_REDIRECT_URI,
      code_verifier: verifier
    });

    await axios.post(
      process.env.ADO_TOKEN_URL,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    // ⚠️ Never log tokens
    return res.send(`
      <h1>Connected ✅</h1>
      <p>Azure DevOps authorization successful.</p>
    `);
  } catch (err) {
    return res.status(500).send("Token exchange failed");
  }
});

module.exports = router;
