async function fetchTasks() {
  const res = await fetch('/api/tasks');
  return res.json();
}

async function addTask(text) {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return res.json();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
}

const form = document.getElementById('todoForm');
const list = document.getElementById('taskList');

function render(tasks) {
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.className = 'delete';
    btn.onclick = async () => {
      await deleteTask(t.id);
      const updated = await fetchTasks();
      render(updated);
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

async function init() {
  const tasks = await fetchTasks();
  render(tasks);
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = document.getElementById('taskText').value.trim();
  if (!text) return;
  await addTask(text);
  const tasks = await fetchTasks();
  render(tasks);
  form.reset();
});

init();
