import express from 'express'
import cors from 'cors'
import pg from 'pg'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "gamer-connect",
  password: "rehaiStr@21",
  port: 5432,
});

db.connect();

app.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log('Login attempt:', { username, password })
  try{
    const query = 'SELECT * FROM public."users" WHERE username = $1 AND password = $2'
    db.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('Database query error:', err)
        res.status(500).send('Internal Server Error')
      } else if (result.rows.length > 0) {
        res.status(200).send('Login successful')
      } else {
        res.status(401).send('Invalid username or password')
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).send('Login failed. Please try again.')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})