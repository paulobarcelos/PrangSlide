var static = require('node-static');
var fs = require('fs');
var file = new static.Server('./www');

require('http').createServer(function (request, response) {

	if(request.url == '/list'){
		var groupNames = fs.readdirSync('./public/slides');
		var groups = [];
		groupNames.forEach(function(groupName){
			var group = {};
			var nameData = groupName.split('_');
			group.dir = '/slides/' + groupName + '/';
			group.index = nameData[0];
			group.interval = nameData[1];
			var rawSlides = fs.readdirSync('./public/slides/' + groupName);
			group.slides = [];
			rawSlides.forEach(function(rawSlide){
				var e = rawSlide.split('.').pop();
				if(e && (e == 'jpg' || e == 'jpeg' || e == 'png' || e == 'gif')){
					group.slides.push(rawSlide);
				}
			});
			groups.push(group);
		});

		response.writeHead(200, {'Content-Type': 'application/json'});
 		response.end(JSON.stringify(groups));
		return;
	}

	request.addListener('end', function () {
		file.serve(request, response);
	});
	
}).listen(process.env.VCAP_APP_PORT || process.env.PORT || 8080);