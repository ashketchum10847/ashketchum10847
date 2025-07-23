async function fetchTransactions() {
  const res = await fetch('/api/transactions');
  return res.json();
}

async function addTransaction(tx) {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });
  return res.json();
}

const form = document.getElementById('txForm');
const chartCtx = document.getElementById('chart').getContext('2d');
let chart;

function renderChart(data) {
  const incomes = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const dataset = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [incomes, expenses],
      backgroundColor: ['#4caf50', '#f44336']
    }]
  };
  if (chart) chart.destroy();
  chart = new Chart(chartCtx, { type: 'pie', data: dataset });
}

async function init() {
  const data = await fetchTransactions();
  renderChart(data);
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const tx = {
    type: document.getElementById('type').value,
    category: document.getElementById('category').value,
    amount: parseFloat(document.getElementById('amount').value)
  };
  await addTransaction(tx);
  const data = await fetchTransactions();
  renderChart(data);
  form.reset();
});

init();
