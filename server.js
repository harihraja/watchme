// server.js

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();


let db_url   = process.env.MONGOLAB_URI;
if (db_url == null || db_url == "") {
  const db = require('./config/db');
  db_url = db.url;
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db_url, (err, database) => {
    if (err) return console.log(err)
                        
    // Make sure you add the database name and not the collection name
    dbase = database.db("myriad_mdb")

    require('./app/routes')(app, dbase);
    app.listen(port, () => {
      console.log('We are live on ' + port);
    });             
  })

