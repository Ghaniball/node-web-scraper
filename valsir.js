var express = require('express');
var fs = require('fs');
var request = require('request');
var app     = express();

app.get('/list', function(req, res){
	// Let's scrape
	
	var download = function(uri, filename, idx, callback){
		setTimeout(function() {
			request.head(uri, function(err, res, body){

				var r = request(uri).pipe(fs.createWriteStream(filename));
				
				if (callback) {
					r.on('close', callback);
				}
			});
		}, idx *500);
	};
	
	for (var i = 1; i <= 12; i++) {
		(function(j) {
			var filename = j + '.jpg';
			download ('http://valsir.it/images/news/2015_01_wallpaper/valsir_body_painting_2015_wallpaper_ipad_' + j + '.jpg', filename, j, function() {
				console.log(filename + " downloaded!");
			});
		})(i);
	}
	
	res.send('Check your console!')

});

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 	