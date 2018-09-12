// routes/content_routes.js

const request = require('request');

const CONTENT_INFO = [ 
  {
    language : "Hindi",
    type : "Movies",
    url : "https://timesofindia.indiatimes.com/entertainment/hindi/movie-reviews"
  },
  {
    language : "English",
    type : "Movies",
    url : "https://www.rottentomatoes.com/browse/in-theaters/"
  }
]

module.exports = function(app, db) {

    app.get('/contentlist/:language', (req, res) => {
        const lang = req.params.language;
        console.log(lang);

        var content_item = CONTENT_INFO.find(function(item) {
          return item.language == lang;
        });
        console.log(content_item.url);


        request(content_item.url, (err, response, body) => {
          if (err) { 
            res.send({'error':'An error has occurred'});
          }
          console.log(body);
          res.send({'url': content_item.url, 'body': body});
        });

    });

};