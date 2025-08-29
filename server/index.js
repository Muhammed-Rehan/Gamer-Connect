import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

const db = new pg.Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "gamer-connect",
  password: process.env.DB_PASS || "rehaiStr@21", // load from .env in production
  port: process.env.DB_PORT || 5432,
});

db.connect();

// Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const checkResult = await db.query("SELECT 1 FROM users WHERE username = $1", [username]);

    if (checkResult.rows.length > 0) {
      return res.sendStatus(409); // Conflict
    }

    const hash = await bcrypt.hash(password, saltRounds);
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hash]);

    return res.sendStatus(201); // Created
  } catch (err) {
    console.error("Register error:", err);
    return res.sendStatus(500); // Internal Server Error
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.sendStatus(401); // Unauthorized - user not found
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.sendStatus(401); // Unauthorized - wrong password
    }

    return res.sendStatus(200); // OK
    // later: send JWT or session token instead of just 200
  } catch (err) {
    console.error("Login error:", err);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
