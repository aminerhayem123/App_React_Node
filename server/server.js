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

// Modify the /packs POST endpoint to accept item IDs
app.post('/packs', async (req, res) => {
  const { brand, items } = req.body;
  if (!brand || !items) {
    return res.status(400).json({ message: 'Brand and items are required' });
  }
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO packs (brand) VALUES ($1) RETURNING id', [brand]);
    const packId = result.rows[0].id;

    const itemQueries = items.map(itemId => {
      return client.query('INSERT INTO items (name, pack_id) VALUES ($1, $2)', [itemId, packId]);
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
