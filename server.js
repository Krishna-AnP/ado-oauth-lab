require("./db/db");
require("dotenv").config();
const express = require("express");

const oauthRoutes = require("./oauth");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is running");
});

// use oauth routes
app.use(oauthRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
