## Environment Configuration Runbook

** Required Variables

* PORT – Express server port

* ADO_CLIENT_ID – Azure DevOps OAuth client ID (org-provided)

* ADO_REDIRECT_URI – Must exactly match OAuth app configuration

* ADO_AUTHORIZE_URL – Azure DevOps authorize endpoint

* ADO_TOKEN_URL – Azure DevOps token endpoint

** Common Issues

* 400 / 404 from Azure → Client ID missing or invalid

* Cannot GET /callback → Expected before callback route implementation

* Tenant restrictions → Requires org admin provisioning

** Operational Notes

* Restart server after any .env change

* Never commit .env to version control