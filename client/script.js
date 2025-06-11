async function handleSubmit() {
  const ico = document.getElementById('ico').value.trim();
  const status = document.getElementById('status');
  if (!ico) return alert('Zadejte IČO!');

  status.innerText = 'Načítání údajů z ARES...';

  try {
    const response = await fetch(`/api/ares/${ico}`);
    if (!response.ok) throw new Error('IČO nebylo nalezeno.');

    const data = await response.json();
    const firma = {
      nazev: data.obchodniJmeno,
      ico: data.ico,
      dic: data.dic || 'neuvedeno',
      sidlo: `${data.sidlo.ulice} ${data.sidlo.cisloDomovni || ''}, ${data.sidlo.psc} ${data.sidlo.obec}`
    };

    status.innerText = 'Generuji dokument...';

    const template = await fetch("Plna_moc_sablona.docx").then(res => res.arrayBuffer());
    const zip = new PizZip(template);
    const doc = new window.docxtemplater().loadZip(zip);

    doc.setData(firma);
    doc.render();

    const out = doc.getZip().generate({ type: "blob" });
    saveAs(out, `Plna_moc_${firma.ico}.docx`);

    // PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text(`Plná moc pro: ${firma.nazev}
IČO: ${firma.ico}
DIČ: ${firma.dic}
Sídlo: ${firma.sidlo}`, 10, 20);
    pdf.save(`Plna_moc_${firma.ico}.pdf`);

    status.innerText = 'Dokumenty byly úspěšně vygenerovány.';
    document.getElementById('ico').value = '';
  } catch (err) {
    console.error(err);
    status.innerText = 'Chyba: ' + err.message;
  }
}
