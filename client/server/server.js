const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/api/ares/:ico', async (req, res) => {
  const { ico } = req.params;

  try {
    const response = await fetch(`https://ares-proxy.vercel.app/api/ico/${ico}`);
    if (!response.ok) return res.status(404).json({ error: 'IČO nebylo nalezeno.' });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy chyba:", err);
    res.status(500).json({ error: 'Chyba při načítání údajů přes proxy.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend běží na http://localhost:${PORT}`);
});
