import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './pool.js';

dotenv.config();

const app = express();

// Allow frontend (Vite) on 5173 or 5174
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    '*'
  ]
}));

app.use(express.json());

// Health check
app.get('/', (_req, res) => res.send('Todo API running'));

// GET all todos
app.get('/api/todos', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, text, completed FROM todos ORDER BY id DESC');
    res.json(rows.map(r => ({ ...r, completed: !!r.completed })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST create
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'text required' });

    const [result] = await pool.query(
      'INSERT INTO todos (text, completed) VALUES (?, ?)',
      [text.trim(), 0]
    );

    const [rows] = await pool.query(
      'SELECT id, text, completed FROM todos WHERE id = ?',
      [result.insertId]
    );

    const todo = rows[0];
    res.status(201).json({ ...todo, completed: !!todo.completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT update text/completed
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    await pool.query(
      'UPDATE todos SET text = COALESCE(?, text), completed = COALESCE(?, completed) WHERE id = ?',
      [text ?? null, completed === undefined ? null : (completed ? 1 : 0), id]
    );

    const [rows] = await pool.query('SELECT id, text, completed FROM todos WHERE id = ?', [id]);
    if (!rows.length) return res.sendStatus(404);

    const todo = rows[0];
    res.json({ ...todo, completed: !!todo.completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// PATCH toggle complete
app.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('UPDATE todos SET completed = NOT completed WHERE id = ?', [id]);

    const [rows] = await pool.query('SELECT id, text, completed FROM todos WHERE id = ?', [id]);
    if (!rows.length) return res.sendStatus(404);

    const todo = rows[0];
    res.json({ ...todo, completed: !!todo.completed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// DELETE
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
