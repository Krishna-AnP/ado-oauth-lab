# Overview

This project implements a production-style OAuth 2.0 Authorization Code flow with PKCE for Azure DevOps (ADO) using Node.js + Express.
The goal is to provide a secure, well-structured OAuth skeleton that can be promoted to production once organization-level credentials are provisioned.

# Status: Day-1 flow implemented end-to-end. Token exchange is gated due to pending org-provided client_id.

# Features (Day 1)

* OAuth 2.0 Authorization Code flow

* PKCE (S256) implementation

* State validation for CSRF protection

* Secure server-side storage of state → code_verifier

* Configurable redirect URIs (dev/stage/prod ready)

* Safe handling when credentials are unavailable

* No secrets logged

# Tech Stack

* Node.js

* Express

* Axios

* dotenv

# Project Structure
node-poc/
├── server.js          # App bootstrap
├── oauth.js           # OAuth routes (/connect, /callback)
├── .env               # Local environment variables (not committed)
├── .env.example       # Sample env file
├── package.json
├── node_modules/
└── docs/
    ├── 01_oauth_flow_spec.md
    ├── 02_token_strategy.md
    └── 03_env_setup_runbook.md
    
# Environment Setup

* Create a .env file based on .env.example:

PORT=3000
ADO_CLIENT_ID=YOUR_CLIENT_ID
ADO_REDIRECT_URI=http://localhost:3000/callback
ADO_AUTHORIZE_URL=https://app.vssps.visualstudio.com/oauth2/authorize
ADO_TOKEN_URL=https://app.vssps.visualstudio.com/oauth2/token

ADO_CLIENT_ID is currently a placeholder and will be provided by the organization admin.

# Run Locally
npm install
node server.js

# Open:

http://localhost:3000/connect

# Current Limitation

Token exchange requires an Azure DevOps OAuth Client ID, which must be created by an org admin.
Until that is provisioned, the callback route safely skips token exchange and renders a confirmation message.

# Security Notes

* PKCE + state validation are mandatory and enforced

* Tokens are never logged

* Secrets are externalized via environment variables
