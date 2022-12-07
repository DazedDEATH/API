require('dotenv').config()
const { request } = require('express');
const express = require('express')
const bodyParser = require("body-parser");
const path = require('path');
const router = express.Router();
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.POSTGRESURI,
    ssl: {
      rejectUnauthorized: false
    }
  });

  client.connect();

  app.use('/static', express.static(path.join(__dirname, 'public')))

  app.post('/create', async (req, res) => {
    const { name, email } = req.body
    client.query(`INSERT INTO students (name, email) VALUES('${name}','${email}}')`)
    res.send('NUEVOS DATOS CREADOS')
    //res.send(request.bodyParser);
  });

  app.get('/read', async (req, res) => {
    //const { id } = req.params
    const { rows } = await client.query('SELECT * FROM students');
    res.send(rows);
  });
  
  app.put('/update', async (req, res) => {

  });

  app.delete('/delete', async (req, res) => {
    const { id } = req.body
    client.query(`DELETE from students where id = '${id}'`)
    res.send('DATOS ELIMINADOS')
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })