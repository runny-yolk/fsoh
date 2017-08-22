const twit = require('twit');
const fs = require('fs');
// Removed my API keys from here since they're meant to be secret
const config =  {  
  "consumer_key": "",  
  "consumer_secret": "",
  "access_token": "",  
  "access_token_secret": ""
}

var Twitter = new twit(config);
var stream = Twitter.stream('statuses/sample');
stream.stop();

// This variable goes up by one when a request is made
// Goes down by one when a request is resolved
// Stream is only stopped when this is 0
var sessions = 0;

module.exports = function(){
    return new Promise (function(resolve, reject){
        sessions++
        
        var tweets = [];
        
        if(sessions == 1) stream.start();

        stream.on('tweet', function(e) {
            tweets.push(e);
        }).on('error', function(e){
            sessions--
            throw new Error(JSON.stringify(e));
        }).on('disconnect', function(e){
            sessions--
            throw new Error(JSON.stringify(e));
        }).on('warning', function(){
            console.log('warning', e)
        })

        setTimeout(function(){
            sessions--
            if (!sessions){
                stream.removeAllListeners();
                stream.stop();
            }
            resolve(tweets);
        }, 5250, stream, tweets);
        
    })
}