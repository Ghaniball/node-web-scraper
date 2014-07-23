var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/list', function(req, res){
	// Let's scrape Anchorman 2
	var url = 'http://www.listal.com/vica-kerekes/pictures//',
		i = 1;
	
	var download = function(uri, filename, callback){
		request.head(uri, function(err, res, body){
			//console.log('content-type:', res.headers['content-type']);
			//console.log('content-length:', res.headers['content-length']);

			var r = request(uri).pipe(fs.createWriteStream(filename));
			
			if (callback) {
				r.on('close', callback);
			}
		});
	};
	
	var getPage = function (j) {
		request(url + j, function(error, response, html) {
			if(!error) {
				var $ = cheerio.load(html),
					list = [];

				$('.product-images img').each(function(idx) {
					var href = $(this).parent('a').attr('href')
					list.push(href);
					console.log(href);
					
					request(href, function(error, response, html) {
						if (!error) {
							var $ = cheerio.load(html);
							
							var src = $('center img').attr('src'),
								filename = "Vica Kerekes page" + j + " image" + idx + ".jpg";
							
							download (src, filename, function() {
								console.log(filename + " downloaded!");
							});
						}
					});
				});
				
				if (i <= 7) {
					getPage(i++);
				}
			} else {
				console.log('Error');
			}
		});
	};
	
	getPage(i);
	
	res.send('Check your console!')

});

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 	