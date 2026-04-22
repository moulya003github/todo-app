const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static('.'));

const client = new Client({
host: 'db',
user: 'postgres',
password: 'password',
database: 'testdb'
});

client.connect();

// create table
client.query(`
   CREATE TABLE IF NOT EXISTS todos (
     id SERIAL PRIMARY KEY,
     task TEXT
     )
`);

// add task
app.post('/add', async (req, res) => {
    const { task } = req.body;
    await client.query('INSERT INTO todos(task) VALUES($1)', [task]);
    res.send("Task added");
});

// get tasks
app.get('/todos', async (req, res) => {
    const result = await client.query('SELECT * FROM todos');
    res.json(result.rows);
});

// delete task
app.delete('/delete/:id', async (req, res) => {
    await client.query('DELETE FROM todos WHERE id=$1', [req.params.id]);
    res.send("Task deleted");
});

app.listen(3000, () => {
    console.log('Server running');
});

 
 
