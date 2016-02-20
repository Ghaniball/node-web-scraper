var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Q	    = require('q');
var app     = express();

app.get('/list', function(req, res){
	// Let's scrape
	urls = [
				/* {
					url: 'http://www.definebabe.com/gallery/1leu/claire-castel/',
					name: '1leu'
				},
				{
					url: 'http://www.definebabe.com/gallery/1let/claire-castel/',
					name: '1let'
				},
				{
					url: 'http://www.definebabe.com/gallery/1lew/claire-castel/',
					name: '1lew'
				},
				{
					url: 'http://www.definebabe.com/gallery/1les/claire-castel/',
					name: '1les'
				},
				{
					url: 'http://www.definebabe.com/gallery/1lev/claire-castel/',
					name: '1lev'
				}, */
				{
					url: 'http://www.definebabe.com/gallery/1ler/claire-castel/',
					name: '1ler'
				}
			];
	var i = 0;
	
	process();
	
	function process() {
		if (i >= urls.length) {
			console.log('===========DONE==========');
			return;
		}
		getImgsFromPage(urls[i++])
			.finally(process);
	}
	
	function getImgsFromPage(pageObj) {
		var deferred = Q.defer();
		request(pageObj.url, function(error, response, html) {
			if(!error) {
				var $ = cheerio.load(html), j = 0, k = 0, anchors = $('#ModelMenu + .lblock ul li > a'), l = anchors.length;
				

				anchors.each(function(idx) {
					var imgUrl = $(this).attr('href'), filename;
					console.log(imgUrl);
					
					filename = pageObj.name + '_' + idx + '.jpg';
					
					j++;
					
					download (imgUrl, filename, idx, function() {
						console.log(filename + " downloaded!");
						
						k++;
						if (j == k && k == l) {
							deferred.resolve();
						}
					});
					
				});
			} else {
				console.log('Error');
			}
		});
		
		return deferred.promise;
	}
	
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
	
	res.send('Check your console!')

});

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 	