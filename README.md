## Azure DevOps OAuth PKCE – Day 1 (PoC)
# Overview

This project is a Proof of Concept (PoC) for implementing OAuth 2.0 Authorization Code Flow with PKCE for Azure DevOps using Node.js + Express.

Since real Azure DevOps OAuth credentials (Client ID) require organization-level permissions, dummy client mode is used for Day-1 validation.

# The focus of Day-1 is:

* Understanding OAuth PKCE flow

* Implementing state & PKCE security

* Validating redirect & callback handling

* Preparing codebase for real Azure credentials

# Day-1 Objectives

* Setup Node.js Express server

* Implement OAuth /connect endpoint

* Generate and validate:

# OAuth state

PKCE code_verifier & code_challenge

* Handle OAuth /callback

* Simulate token exchange (Dummy Mode)

* Secure server-side state validation

* Real Azure token exchange (blocked due to missing client ID)

#  Project Structure
ado-oauth-lab/
│
├── node-poc/
│   ├── server.js        # Express server bootstrap
│   ├── oauth.js         # OAuth PKCE logic
│   ├── package.json
│   ├── .env             # Environment config
│   └── README.md

# Environment Configuration

* Create a .env file:

PORT=3000

ADO_CLIENT_ID=YOUR_CLIENT_ID   # Dummy value for Day-1
ADO_REDIRECT_URI=http://localhost:3000/callback

ADO_AUTHORIZE_URL=https://app.vssps.visualstudio.com/oauth2/authorize
ADO_TOKEN_URL=https://app.vssps.visualstudio.com/oauth2/token


** ADO_CLIENT_ID is intentionally dummy due to permission constraints.

# OAuth Flow (Day-1)
* /connect

- Generates secure state

- Generates PKCE verifier & challenge

- Stores verifier server-side

- Redirects to Azure DevOps OAuth URL

* /callback

- Validates state

- Validates PKCE verifier

- If Client ID missing → switches to Dummy Mode

- Simulates successful token exchange

# Dummy Mode (PoC)

* Since Azure DevOps OAuth requires:

- Organization admin access

- Approved OAuth app registration

* A Dummy OAuth Mode is implemented to validate:

- End-to-end OAuth flow

- PKCE security logic

- Callback correctness

# Sample Success Output:
Connected ✅ (Dummy Mode)

State validated
PKCE verifier verified
Token exchange simulated

# Security Considerations

- State is stored server-side and validated once

- PKCE verifier is never exposed to client

- Token values are never logged

- Dummy tokens used strictly for PoC

# Limitations

- Real Azure DevOps OAuth token exchange not executed

- Requires org-level Azure DevOps OAuth App permissions

- Client ID pending approval from admin

## Note:
This project currently runs in Dummy OAuth mode due to pending Azure DevOps organization-level OAuth Client ID access.
The complete PKCE flow is implemented and will work with real credentials without code changes.
