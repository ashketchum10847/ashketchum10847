const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read data
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ transactions: [] }, null, 2));
  }
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/transactions', (req, res) => {
  const data = readData();
  res.json(data.transactions);
});

app.post('/api/transactions', (req, res) => {
  const data = readData();
  const tx = {
    id: Date.now(),
    type: req.body.type,
    category: req.body.category,
    amount: Number(req.body.amount),
    date: req.body.date || new Date().toISOString().slice(0,10)
  };
  data.transactions.push(tx);
  writeData(data);
  res.json(tx);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
