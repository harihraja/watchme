// routes/index.js

const wlRoutes = require('./wl_routes');
const contentRoutes = require('./content_routes');


var path = __dirname + '/views/';

module.exports = function(app, db) {

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); 
  
  wlRoutes(app, db);
  contentRoutes(app, db);
  // Other route groups could go here, in the future

  app.get('/api/info', (req, res) => {
    body = {};
    body.backend = 'NodeJS';
    console.log(body);
    res.send(body);
  });
  
  app.get('/', (req, res) => {
    console.log("/index.html");
    res.sendFile(path + "index.html");
  });  

  app.get('/about', (req, res) => {
    console.log("/about.html");
    res.sendFile(path + "about.html");
  });  

  app.get('/contact', (req, res) => {
    console.log("/contact.html");
    res.sendFile(path + "contact.html");
  });  
  
  app.get('*', (req, res) => {
    console.log("/404.html");
    res.sendFile(path + "404.html");
  });  

};