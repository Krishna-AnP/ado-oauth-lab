const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create / open database
const dbPath = path.join(__dirname, "tokens.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite DB");
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tokens table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      encrypted_token TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
