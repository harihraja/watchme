// routes/wl_routes.js

module.exports = function(app, db) {
    app.post('/watchlist', (req, res) => {
        console.log(req.body)
        res.send('Hello')
      });
};