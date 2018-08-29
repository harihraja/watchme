// routes/wl_routes.js

var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    app.get('/watchlist/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('watchlist').findOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send(item);
          } 
        });
    });

    app.post('/watchlist', (req, res) => {
        const watchlist = { type: req.body.type, language: req.body.language, title: req.body.title };
        db.collection('watchlist').insert(watchlist, (err, result) => {
          if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
          } else {
            res.send(result.ops[0]);
          }
        });
    });

    app.delete('/watchlist/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('watchlist').remove(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send('Watchlist ' + id + ' deleted!');
          } 
        });
    });

    app.put('/watchlist/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const watchlist = { type: req.body.type, language: req.body.language, title: req.body.title };
        db.collection('watchlist').update(details, watchlist, (err, result) => {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              res.send(watchlist);
          } 
        });
    });
};