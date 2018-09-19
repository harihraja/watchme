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

    app.get('/contentlist/:user/:language/:region/:type', (req, res) => {
      const user = req.params.user;
      const lang = req.params.language;
      const region = req.params.region;
      const type = req.params.type;

      const details = { '_id': new ObjectID(id) };
      db.collection('watchlist').findOne(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(item);
        } 
      });
    });


    app.post('/usercontentlist/', (req, res) => {
      const userinfo = { email: req.body.useremail };
      const lang = req.body.language;
      const region = req.body.region;
      const type = req.body.type;

      var contentinfo = CONTENT_INFO.find(function(item) {
        return item.language == lang && item.region == region && item.type == type;
      });
      console.log(contentinfo);

      request(contentinfo.url, (err, response, body) => {
        if (err) { 
          res.send({'error':'An error has occurred'});
        }
        $ = cheerio.load(body);

        var contentlist = [];
        $('.FIL_right').each(function(i, elem) {
          var contentitem = {}
          contentitem.title = $(this).find('h3').text();
          contentitem.rating = Number($(this).find('.star_count').text()).toFixed(1);
          contentitem.release_date = $(this).find('h4').text().split(" | ")[0];
          contentitem.action = 'watch';
          contentlist[i] = contentitem;

          console.log(contentlist[i]);
        });

        contentlist = contentlist.filter(function(item) {
          return Number(item.rating) >= Number(contentinfo.rating_limit);
        });
        
        contentlist.sort(function (content1, content2) {
          // Sort by rating
          // If the first item has a higher number, move it down
          // If the first item has a lower number, move it up
          if (Number(content1.rating) > Number(content2.rating)) return -1;
          if (Number(content1.rating) < Number(content2.rating)) return 1;
        });

        const usercontentlist = {'userinfo': userinfo, 'contentinfo': contentinfo, 'contentlist': contentlist};
        res.send(usercontentlist);

        // db.collection('usercontentlist').insert(usercontentlist, (err, result) => {
        //   if (err) { 
        //     res.send({ 'error': 'An error has occurred' }); 
        //   } else {
        //     res.send({ 'id': result.ops[0], 'usercontentlist': usercontentlist});
        //   }
        // });
      });

    });

};