import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  // 200 OK – basic health check endpoint
  res.status(200).send("Hello World!");
});

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

db.connect();

// -------------------- REGISTER --------------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // 400 Bad Request – if username or password missing
  if (!username || !password) {
    return res.sendStatus(400);
  }

  try {
    const checkResult = await db.query("SELECT 1 FROM users WHERE username = $1", [username]);

    if (checkResult.rows.length > 0) {
      // 409 Conflict – username already exists
      return res.sendStatus(409);
    }

    const hash = await bcrypt.hash(password, saltRounds);
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hash]);

    // 201 Created – new user successfully registered
    return res.sendStatus(201);
  } catch (err) {
    console.error("Register error:", err);
    // 500 Internal Server Error – unexpected DB or server failure
    return res.sendStatus(500);
  }
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // 400 Bad Request – if username or password missing
  if (!username || !password) {
    return res.sendStatus(400);
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      // 404 Not Found – username does not exist
      return res.sendStatus(404);
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      // 401 Unauthorized – wrong password
      return res.sendStatus(401);
    }

    // 200 OK – login successful (later: return token/session)
    return res.sendStatus(200);
  } catch (err) {
    console.error("Login error:", err);
    // 500 Internal Server Error – unexpected DB or server failure
    return res.sendStatus(500);
  }
});

// -------------------- GET USERS --------------------
app.get("/profile/:username", async (req, res) => {
  const { username } = req.params;
  // fetch user on datebase
  try{
    const result = await db.query("SELECT username FROM users WHERE username = $1", [username]);
    console.log(result.rows)
    if(result.rows.length.length === 0){
      // 404 Not Found – username does not exist
      return res.sendStatus(404);
    }
    else{
      // 200 OK – return user profile
      console.log(json(result.rows[0]));
      return res.status(200).json(result.rows[0]);
    }
  }catch(err){
    console.error("Get user error:", err);
    // 500 Internal Server Error – unexpected DB or server failure
    return res.sendStatus(500);
  }
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
