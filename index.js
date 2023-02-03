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

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRESURI,
    ssl: {
      rejectUnauthorized: false
    }
});

pool.connect();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.post('/create', async (req, res) => {
  const {TIEMPO, TEMPERATURA, HUMEDAD, LUZ, PUMP} = req.body;
  const client = await pool.connect();
  try {
    await client.query(`INSERT INTO mds (TIEMPO, TEMPERATURA, HUMEDAD, LUZ, PUMP) VALUES('${TIEMPO}', ${TEMPERATURA} , ${HUMEDAD} , ${LUZ} , '${PUMP}')`);
    res.send('NUEVOS DATOS CREADOS');
  } finally {
    client.release();
  }
});

app.get('/read', async (req, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM mds s');
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error reading from database' });
  } finally {
    client.release();
  }
});

app.get('/read_last_20', async (req, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM mds ORDER BY id DESC LIMIT 20');
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error reading from database' });
  } finally {
    client.release();
  }
});

app.get('/lumi', async (req, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT LUZ FROM MDS ORDER BY id DESC LIMIT 1');
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error reading from database' });
  } finally {
    client.release();
  }
});

app.get('/temp', async (req, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT TEMPERATURA FROM MDS ORDER BY id DESC LIMIT 1');
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error reading from database' });
  } finally {
    client.release();
  }
});

app.get('/hume', async (req, res) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query('SELECT HUMEDAD FROM MDS ORDER BY id DESC LIMIT 1');
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error reading from database' });
  } finally {
    client.release();
  }
});

  /*
  app.put('/update', async (req, res) => {
    const { TEMPERATURA, id } = req.body
    
    client.query(`UPDATE mds 
    SET TEMPERATURA = ${TEMPERATURA} 
    where id = ${id}`)

    res.send('DATOS ACTUALIZADOS')
  });

  app.delete('/delete', async (req, res) => {
    const { id } = req.body
    client.query(`DELETE from mds where id = '${id}'`)
    res.send('DATOS ELIMINADOS')
  });*/

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  module.exports = app;