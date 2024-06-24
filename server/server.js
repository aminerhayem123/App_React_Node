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
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    client.release();

    if (!user || password !== user.password) {
      return res.status(400).json({ message: 'email or password incorrect' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/packs', async (req, res) => {
  const { brand, items } = req.body;
  if (!brand || !items) {
    return res.status(400).json({ message: 'Brand and items are required' });
  }
  try {
    const client = await pool.connect();

    // Generate a 3-letter uppercase random string
    const randomLetters = [...Array(3)].map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');

    // Generate a 5-digit random number
    const randomNumber = Math.floor(10000 + Math.random() * 90000);

    // Combine the random string and number to create the pack ID
    const packId = `${randomLetters}${randomNumber}`;

    // Insert the new pack with the generated ID
    const result = await client.query('INSERT INTO packs (id, brand) VALUES ($1, $2) RETURNING id', [packId, brand]);
    const insertedPackId = result.rows[0].id;

    const itemQueries = items.map((itemName, index) => {
      // Generate the item ID using the packId and the index
      const itemId = `${packId}${String(index + 1).padStart(5, '0')}`;
      return client.query('INSERT INTO items (id, name, pack_id) VALUES ($1, $2, $3)', [itemId, itemName, insertedPackId]);
    });

    await Promise.all(itemQueries);

    client.release();

    res.json({ message: 'Pack and items added successfully', packId });
  } catch (error) {
    console.error('Error during pack creation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/packs', async (req, res) => {
  try {
    const client = await pool.connect();
    const packsResult = await client.query('SELECT * FROM packs');
    const packs = packsResult.rows;

    const itemsResult = await client.query('SELECT * FROM items');
    const items = itemsResult.rows;

    const packsWithItems = packs.map(pack => {
      return {
        ...pack,
        items: items.filter(item => item.pack_id === pack.id)
      };
    });

    client.release();
    res.json(packsWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/items', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM items');
    const items = result.rows;
    client.release();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});