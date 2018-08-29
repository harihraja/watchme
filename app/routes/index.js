// routes/index.js

const wlRoutes = require('./wl_routes');

module.exports = function(app, db) {
  wlRoutes(app, db);
  // Other route groups could go here, in the future
};