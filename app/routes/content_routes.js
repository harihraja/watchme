// routes/content_routes.js

const request = require('request');
const cheerio = require('cheerio');

const CONTENT_INFO = [ 
  {
    language : "Hindi",
    region : "IN",
    type : "Movies",
    rating_limit : "3.5",
    url : "https://timesofindia.indiatimes.com/entertainment/hindi/movie-reviews"
  },
  {
    language : "English",
    region : "US",
    type : "Movies",
    rating_limit : "80",
    url : "https://www.rottentomatoes.com/browse/in-theaters/"
  },
  {
    language : "Tamil",
    region : "IN",
    type : "Movies",
    rating_limit : "3.0",
    url : "https://timesofindia.indiatimes.com/entertainment/tamil/movie-reviews"
  },
  {
    language : "English",
    region : "IN",
    type : "Movies",
    rating_limit : "4.0",
    url : "https://timesofindia.indiatimes.com/entertainment/english/movie-reviews"
  }
]

module.exports = function(app, db) {

    app.get('/contentlist/:id/:language/:region/:type', (req, res) => {
        const lang = req.params.language;
        const region = req.params.region;
        console.log(lang);
        console.log(region);

        var content_item = CONTENT_INFO.find(function(item) {
          return item.language == lang && item.region == region && item.type == type;
        });
        console.log(content_item.url);


        request(content_item.url, (err, response, body) => {
          if (err) { 
            res.send({'error':'An error has occurred'});
          }
          $ = cheerio.load(body)

          var movies = [];
          $('.FIL_right').each(function(i, elem) {
            var movie = { watched : 'False' }
            movie.title = $(this).find('h3').text();
            movie.rating = Number($(this).find('.star_count').text()).toFixed(1);
            movie.release_date = $(this).find('h4').text().split(" | ")[0];
            movies[i] = movie;

            console.log(movies[i]);
          });

          movies = movies.filter(function(item) {
            return Number(item.rating) >= Number(content_item.rating_limit);
          });
          
          movies.sort(function (movie1, movie2) {
          
            // Sort by rating
            // If the first item has a higher number, move it down
            // If the first item has a lower number, move it up
            if (Number(movie1.rating) > Number(movie2.rating)) return -1;
            if (Number(movie1.rating) < Number(movie2.rating)) return 1;
          });

          res.send({'url': content_item.url, 'movies': movies});
        });

    });

};