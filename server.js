var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var timestamps = [];

app.get('/scrape', function(req, res){

url = 'http://web.archive.org/web/timemap/json/http://www.coinbase.com/about';

// make first call to get timestamps
  request(url, function(error, response, html){
    if(!error){
      var parsedJSON = JSON.parse(response.body);

      for (i = 0; i < parsedJSON.length; i++) {
          timestamps.push(parsedJSON[i][1]);
        }
        console.log(timestamps);
      }
    })

});

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
