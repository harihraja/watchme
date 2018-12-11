// routes/index.js

const express        = require('express');
const wlRoutes = require('./wl_routes');
const contentRoutes = require('./content_routes');

var path = require('path');
// var path = __dirname + '/views/';

module.exports = function(app, db) {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT");
    next();
  }); 
  
  wlRoutes(app, db);
  contentRoutes(app, db);
  // Other route groups could go here, in the future

  app.use(express.static(path.join(__dirname, '../../../client')));

  app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'));
  });

};