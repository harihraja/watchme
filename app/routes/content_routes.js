// routes/content_routes.js

const request = require('request');
const cheerio = require('cheerio');

var ObjectID = require('mongodb').ObjectID;

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
    rating_limit : "3.5",
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

  app.get('/usercontentitem/:email/:language/:region/:type/:title', (req, res) => {

    const details = { 
      'userinfo.email': req.params.email, 
      'contentinfo.language': req.params.language,
      'contentinfo.region': req.params.region,
      'contentinfo.type': req.params.type,
     };

    db.collection('usercontentlist').findOne(details, (err, ucl_item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        contentitem = ucl_item.contentlist.find(function(element) {
          return element.title == req.params.title;
        });
        res.send(contentitem);
      } 
    });
  });


  app.put('/usercontentitem/:email/:language/:region/:type/:title', (req, res) => {

      const details = { 
        'userinfo.email': req.params.email, 
        'contentinfo.language': req.params.language,
        'contentinfo.region': req.params.region,
        'contentinfo.type': req.params.type,
      };

      db.collection('usercontentlist').findOne(details, (err, ucl_item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          var usercontentlist = ucl_item;
          usercontentlist.contentlist.forEach(function(item, index) {
            if (item.title == req.params.title) {
              item.action = req.body.action;
              usercontentlist.contentlist[index] = item;
              console.log({title: item.title, action: item.action});
            }
          });

          // console.log(usercontentlist);
          db.collection('usercontentlist').update({ '_id': new ObjectID(ucl_item._id) }, usercontentlist, (err, result) => {
            if (err) {
              res.send({ 'error': 'An error has occurred' }); 
            } else {
              res.send(result);
            }
          });
        } 
      });

    });


    app.get('/usercontentlist/:email/:language/:region/:type', (req, res) => {

      const details = { 
        'userinfo.email': req.params.email, 
        'contentinfo.language': req.params.language,
        'contentinfo.region': req.params.region,
        'contentinfo.type': req.params.type
       };
      db.collection('usercontentlist').findOne(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(item);
        } 
      });
    });


    app.get('/generatecontentlist/:language/:region/:type', (req, res) => {

      var contentinfo = CONTENT_INFO.find(function(item) {
        return item.language == req.params.language && 
          item.region == req.params.region && 
          item.type == req.params.type;
      });
      // console.log(contentinfo);

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

          // console.log(contentlist[i]);
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

        console.log(JSON.stringify(contentlist));
        res.send({contentinfo: contentinfo, contentlist: contentlist});
      });

    });


    app.put('/usercontentlist/:email/:language/:region/:type', (req, res) => {
      console.log(req.body);

      const details = { 
        'userinfo.email': req.params.email, 
        'contentinfo.language': req.params.language,
        'contentinfo.region': req.params.region,
        'contentinfo.type': req.params.type
      };
      console.log(details);
      
      var contentlist = JSON.parse(req.body.contentlist);
      var override = req.body.override=='True';
      var replace = req.body.replace=='True';

      db.collection('usercontentlist').findOne(details, (err, ucl_item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          // res.send(ucl_item);
          const usercontentlist = {'userinfo': ucl_item.userinfo, 'contentinfo': ucl_item.contentinfo};
          if (replace) {
            usercontentlist.contentlist = contentlist;
          } else if (override) {
            usercontentlist.contentlist = contentlist.concat(ucl_item.contentlist.filter(function (contentitem) {
              return contentlist.findIndex(i => i.title === contentitem.title) < 0;
            }));  
          } else {
            usercontentlist.contentlist = ucl_item.contentlist.concat(contentlist.filter(function (contentitem) {
              return ucl_item.contentlist.findIndex(i => i.title === contentitem.title) < 0;
            }));  
          }
          usercontentlist.contentlist.sort(function (content1, content2) {
            // Sort by rating
            // If the first item has a higher number, move it down
            // If the first item has a lower number, move it up
            if (Number(content1.rating) > Number(content2.rating)) return -1;
            if (Number(content1.rating) < Number(content2.rating)) return 1;
          });
  
          console.log(usercontentlist);
          db.collection('usercontentlist').update({ '_id': new ObjectID(ucl_item._id) }, usercontentlist, (err, result) => {
            if (err) {
              res.send({ 'error': 'An error has occurred' }); 
            } else {
              res.send(result);
            }
          });
        } 
      });


    });


    app.post('/usercontentlist/', (req, res) => {
      const userinfo = { email: req.body.email };
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
        // res.send(usercontentlist);

        db.collection('usercontentlist').insert(usercontentlist, (err, result) => {
          if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
          } else {
            res.send(result.ops[0]);
          }
        });

      });

    });

};