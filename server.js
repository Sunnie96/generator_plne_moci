const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/api/ares/:ico', async (req, res) => {
  const { ico } = req.params;
  try {
    const response = await fetch(`https://generator-plne-moci.onrender.com/api/ares/${ico}`);
    if (!response.ok) return res.status(404).json({ error: 'IČO nebylo nalezeno.' });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Chyba na serveru ARES nebo síti.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
