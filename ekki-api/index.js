const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const seeds = require('./seeds');
const contacts = require('./contacts');

server = async (port) => {

  const databaseClient = new MongoClient('mongodb://localhost:27017/anny-ekki');
  await databaseClient.connect();
  app.database = await databaseClient.db('anny-ekki');

  app.use(cors());
  app.use(bodyParser.json());

  seeds(app);
  contacts(app);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))

};

server(3001);
