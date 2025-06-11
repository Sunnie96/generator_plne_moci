const express = require('express');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/api/ares/:ico', async (req, res) => {
  const { ico } = req.params;

  try {
    const url = `https://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=${ico}`;
    const response = await fetch(url);
    const text = await response.text();

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(text);

    const zaznam = result.ARES_odpoved?.Odpoved?.Vypis_BASIC?.ZAU;
    if (!zaznam) {
      return res.status(404).json({ error: 'IČO nebylo nalezeno.' });
    }

    const firma = {
      nazev: zaznam.OBCHODNI_FIRMA || '',
      ico: zaznam.IC || '',
      dic: zaznam.DIC || '',
      sidlo: {
        ulice: zaznam.ADRESA_ULICE || '',
        cisloDomovni: zaznam.ADRESA_CISLO_DOMOVNI || '',
        obec: zaznam.ADRESA_OBEC || '',
        psc: zaznam.ADRESA_PSC || ''
      }
    };

    res.json(firma);
  } catch (err) {
    console.error('Chyba při volání ARES XML:', err);
    res.status(500).json({ error: 'Chyba při načítání údajů z ARES XML.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend běží na http://localhost:${PORT}`);
});
