## OAuth Flow Specification

1. User accesses /connect

2. Server generates:
    * cryptographically secure state
    * PKCE code_verifier and code_challenge

3. { state → code_verifier } stored server-side

4. Browser redirected to Azure DevOps authorize endpoint

5. User authenticates and consents

6. Azure redirects to /callback?code=...&state=...

7. Server validates state and retrieves verifier

8. Authorization code exchanged for token (gated until client_id available)

# Security Controls

* State used once and deleted

* PKCE S256 enforced

* Redirect URI strictly matched