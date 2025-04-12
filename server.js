const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const TASK_FILE = path.join(__dirname, 'tasks.txt');

app.use(express.static('public'));
app.use(bodyParser.json());

// List all tasks
app.get('/tasks', (req, res) => {
  try {
    const data = fs.readFileSync(TASK_FILE, 'utf8').trim();
    const tasks = data ? data.split('\n') : [];
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error reading task file');
  }
});

// Add a task
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).send('Task cannot be empty');
  fs.appendFile(TASK_FILE, `${task}\n`, (err) => {
    if (err) return res.status(500).send('Error writing task');
    res.send('Task added');
  });
});

// Remove a task by index
app.delete('/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index);
  try {
    const data = fs.readFileSync(TASK_FILE, 'utf8').trim();
    let tasks = data ? data.split('\n') : [];
    if (index < 0 || index >= tasks.length) return res.status(400).send('Invalid index');
    tasks.splice(index, 1);
    fs.writeFileSync(TASK_FILE, tasks.join('\n') + '\n');
    res.send('Task removed');
  } catch (err) {
    res.status(500).send('Error removing task');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


