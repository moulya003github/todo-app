const express = require('express');

const { Pool } = require('pg');

const app = express();

const db = new Pool({ user: 'postgres', host: 'db', database: 'testdb', password: 'password', port: 5432 });

async function start() {

  while (true) {

    try {

      await db.query('CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, task TEXT)');

      console.log("DB Connected");

      break;

    } catch (e) {

      console.log("Waiting for DB...");

      await new Promise(r => setTimeout(r, 3000));

    }

  }

}

start();

app.use(express.json());

app.get('/', (req, res) => res.sendFile(require('path').join(__dirname, 'index.html')));

app.get('/todos', async (req, res) => res.json((await db.query('SELECT * FROM todos')).rows));

app.post('/add', async (req, res) => { await db.query('INSERT INTO todos(task) VALUES($1)', [req.body.task]); res.sendStatus(200); });

app.delete('/delete/:id', async (req, res) => { await db.query('DELETE FROM todos WHERE id=$1', [req.params.id]); res.sendStatus(200); });

app.listen(3000);

 