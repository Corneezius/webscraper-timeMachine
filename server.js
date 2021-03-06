var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var timestamps = [];
var statJSONEntries = [];

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


  // begin second round of ajax calls
  for (t = 100; t < timestamps.length; t++) {

    urlTwo = 'http://web.archive.org/web/' + timestamps[t] + '/https://www.coinbase.com/about';

    request(urlTwo, function(error, response, html) {
       if(!error){
         // load new dom with cheerio
         var $ = cheerio.load(html);

           var json = { users : "", wallets : "", merchants : "", apps : ""};

           var userRaw = $( "#stats h4" ).first().text().trim();
             // the regex removes unwanted text
             json.users = userRaw.replace(/\D/g,'');
             // console.log(json.users);

           var walletsRaw  = $("#stats :nth-child(3)" ).text().trim();
             json.wallets = walletsRaw.replace(/\D/g,'');
             // console.log(json.wallets);

           var merchantsRaw = $("#stats :nth-child(4)" ).text().trim();
             json.merchants = merchantsRaw.replace(/\D/g,'');
             // console.log(json.merchants);

           var appsRaw = $( "#stats h4").last().text().trim();
             json.apps = appsRaw.replace(/\D/g,'');
             // console.log(json.apps);

             statJSONEntries.push(json);
             console.log(json);
            }
         })
       }
     // for loop still needs async solution, but this will do for now to ensure results print
    //  setTimeout(function(){
    //   console.log("in case printing one by one takes too long, here is the array of objects so far");
    //   console.log("if this is empty, have no fear. the results will drip in one by one..");
    //   console.log(statJSONEntries);
    //
    // },90000);

    // fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
    // console.log('File successfully written! - Check your project directory for the output.json file');

// })

});

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
