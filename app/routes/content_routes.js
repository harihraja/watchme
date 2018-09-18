// routes/content_routes.js

const request = require('request');
const cheerio = require('cheerio');

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
          $ = cheerio.load(body)

          var movies = [];
          $('.FIL_right').each(function(i, elem) {
            let rating = Number($(this).find('.star_count').text()).toFixed(1);
            movies[i] = [ $(this).find('h3').text(), rating];

            console.log(movies[i]);
          });

          movies = movies.filter(function(item) {
            return item.length == 2 && Number(item[1]) >= 3.5 && Number(item[1]) <= 5.0;
          });
          movies = Array.from(new Set(movies));
          movies.sort(function (movie1, movie2) {

            // Sort by votes
            // If the first item has a higher number, move it down
            // If the first item has a lower number, move it up
            if (Number(movie1[1]) > Number(movie2[1])) return -1;
            if (Number(movie1[1]) < Number(movie2[1])) return 1;
          
          });
          
          // res.send(body);
          // res.send({'url': content_item.url, 'body': body});
          res.send({'url': content_item.url, 'movies': movies});
        });

    });

};