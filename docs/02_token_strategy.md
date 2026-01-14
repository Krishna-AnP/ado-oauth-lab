## oken Handling Strategy

** OAuth access tokens are treated as highly sensitive

* Tokens are never logged or exposed to the browser

* (Day-2) Tokens will be stored encrypted using AES-GCM in SQLite

* Master encryption key will be sourced from environment variables

** Future Enhancements

* Token refresh handling

* Token expiry tracking

* Multi-tenant token storage