require('dotenv').config()
const express = require('express')
const path = require('path');
const app = express()
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

  app.get('/ctabla', async (req, res) => {
    //const { id } = req.params
    const { rows } = await client.query('SELECT * FROM students');
    res.send(rows);
  });
  
  app.get('/new', async (req, res) => {
    //const { id } = req.params
    const { rows } = await client.query('SELECT * FROM students');
    res.send(rows);
  });



  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })