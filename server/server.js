const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  connectionString: 'postgres://postgres:atrox123@localhost:5432/app',
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Attempting to login user with email:', email);
    console.log('Password received:', password);
    
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    client.release();

    console.log('email or password inccorrect:', user);

    if (!user) {
      console.log('email or password inccorrect');
      return res.status(400).json({ message: 'email or password inccorrect' });
    }

    if (password !== user.password) {
      console.log('email or password inccorrect');
      return res.status(400).json({ message: 'email or password inccorrect' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
