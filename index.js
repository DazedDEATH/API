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

  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
  })

  app.post('/create', async (req, res) => {
    const {TIEMPO, TEMPERATURA, HUMEDAD, LUZ, PUMP} = req.body
    client.query(`INSERT INTO mds (TIEMPO, TEMPERATURA, HUMEDAD, LUZ, PUMP) VALUES('${TIEMPO}', ${TEMPERATURA} , ${HUMEDAD} , ${LUZ} , '${PUMP}')`)
    res.send('NUEVOS DATOS CREADOS')
    //res.send(request.bodyParser);
  });

  app.get('/read', async (req, res) => {
    //const { id } = req.params
    const { rows } = await client.query('SELECT * FROM mds s');
    res.send(rows);
  });

  app.get('/read_last_20', async (req, res) => {
    const { rows } = await client.query('SELECT * FROM mds ORDER BY id DESC LIMIT 20;');
    res.send(rows);
  });

  app.get('/last_lumi', async(req, res) => {
    const {rows} = await client.query('SELECT id, TEMPERATURA FROM MDS ORDER BY id DESC LIMIT 1')
    res.send(rows);
  });
  
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
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  module.exports = app;