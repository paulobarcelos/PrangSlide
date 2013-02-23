define(
[
	'happy/app/BaseApp',
	'happy/utils/ajax',
	'happy/utils/keyCode'
],
function (
	BaseApp,

	ajax,
	keyCode
){
	var App = function(){
		var 
		self = this,
		groups,
		currentGroup,
		currentSlide;

		var setup = function(){
			self.setFPS(0);
			groups = [];
			reset();
			loadLoop();
		}

		var loadLoop = function(){
			ajax({
				url: '/list',
				method: 'GET',
				onSuccess: function(request){
					var data = JSON.parse(request.responseText);
					if(data.length) onGroupsLoaded(data);					
					setTimeout(loadLoop, 5000);
				},
				onError: function(){
					console.log('Error loading list')
					setTimeout(loadLoop, 5000);
				}
			});
		}

		var onGroupsLoaded = function(data){
			groups = data;
			if(currentGroup == -1) {
				currentGroup = 0;
				currentSlide = 0;
				slideLoop();
			}
		}

		var reset = function(){
			currentGroup = -1;
			currentSlide = -1;
			self.container.style.backgroundImage = 'none';
		}
		var slideLoop = function(){
			var group = groups[currentGroup];
			if(typeof group === 'undefined') return reset();
			var slide = group.slides[currentSlide];
			if(typeof slide === 'undefined') currentSlide = 0;
			slide = group.slides[currentSlide];
			if(typeof slide === 'undefined') reset();
	
			self.container.style.backgroundImage = 'url("' + group.dir + slide + '")';

			currentSlide++;
			if(currentSlide > group.slides.length - 1) currentSlide = 0;

			setTimeout(slideLoop, group.interval * 1000);
		}

		var onKeyUp = function(e) {	
			switch(keyCode.codeToChar(e.keyCode)){
				case 'SPACEBAR':
					self.toggleFullscreen();					
					break;
				case 'LEFT_ARROW':
					if(currentGroup == -1) break;
					currentGroup --;
					if(currentGroup < 0) currentGroup = groups.length -1;
					currentSlide = 0;			
					break;
				case 'RIGHT_ARROW':
					if(currentGroup == -1) break;
					currentGroup ++;
					if(currentGroup > groups.length -1) currentGroup = 0;
					currentSlide = 0;			
					break;
			}
		}

		self.setup = setup;
		self.onKeyUp = onKeyUp;
	}
	App.prototype = new BaseApp();
	return App;
});