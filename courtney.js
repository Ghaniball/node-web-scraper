var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Q	    = require('q');
var app     = express();

app.get('/list', function(req, res){
	// Let's scrape
	urls = [
				/*{
					url: 'http://www.definebabe.com/gallery/2ifa/kortney-kane/',
					name: '2ifa'
				},
				{
					url: 'http://www.definebabe.com/gallery/2jc9/kortney-kane/',
					name: '2jc9'
				},
				{
					url: 'http://www.definebabe.com/gallery/2ifh/kortney-kane/',
					name: '2ifh'
				},
				{
					url: 'http://www.definebabe.com/gallery/2jcg/kortney-kane/',
					name: '2jcg'
				},
				{
					url: 'http://www.definebabe.com/gallery/2if8/kortney-kane/',
					name: '2if8'
				},
				{
					url: 'http://www.definebabe.com/gallery/2jc5/kortney-kane/',
					name: '2jc5'
				},
				{
					url: 'http://www.definebabe.com/gallery/2if9/kortney-kane/',
					name: '2if9'
				},
				{
					url: 'http://www.definebabe.com/gallery/2io2/kortney-kane/',
					name: '2io2'
				},*/
				{
					url: 'http://www.definebabe.com/gallery/28rn/kortney-kane/',
					name: '28rn'
				},
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