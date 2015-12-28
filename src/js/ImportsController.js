//ImportsController.js

function ImportsController(){};

var p = ImportsController.prototype;

p.init = function(animations){

	// this._startTime = new Date.now();

	this.animations = animations.slice(0);

	this.running = false;

	// all times defined in seconds 
	// everythin controlled from playback of video


};



p.pause = function(){

	this.running = false;

};

p.start = function(){

	this.running = true;
};

p.update = function(currentVideoTimeIn){

	// debugger;

	if (!this.running) return;

	// var diff = now - this._startTime;
	var currVideoTime = currentVideoTimeIn;


	for (var i=0;i<this.animations.length;i++){
		var normalized = (currVideoTime - this.animations[i].startTime) / this.animations[i].totalDuration;
		// console.log(this.animations[i].startTime, this.animations[i].totalDuration, i, normalized);
		this.animations[i].update(Math.round(normalized * 100) / 100); 
	}

};

module.exports = ImportsController;