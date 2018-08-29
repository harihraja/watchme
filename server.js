// server.js

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');

const app            = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
                        
    // Make sure you add the database name and not the collection name
    dbase = database.db("myriad_mdb")

    require('./app/routes')(app, dbase);
    app.listen(port, () => {
      console.log('We are live on ' + port);
    });             
  })

