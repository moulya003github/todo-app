const express = require('express');

const { Pool } = require('pg');

const app = express();

app.use(express.json());

app.use(express.static(__dirname)); 

const pool = new Pool({

    user: 'postgres',

    host: '172.17.0.1', 

    database: 'todo_db',

    password: 'devops123',

    port: 5432,

});

app.get('/todos', async (req, res) => {

    const result = await pool.query('SELECT * FROM todos');

    res.json(result.rows);

});

app.post('/add', async (req, res) => {

    await pool.query('INSERT INTO todos (task) VALUES ($1)', [req.body.task]);

    res.sendStatus(201);

});

app.delete('/todos/:id', async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query('DELETE FROM todos WHERE id = $1', [id]);

        res.sendStatus(204);

    } catch (err) {

        console.error(err.message);

        res.status(500).send("Server Error");

    }

});
 

app.listen(3000, () => console.log('Running on 3000'));
 

 