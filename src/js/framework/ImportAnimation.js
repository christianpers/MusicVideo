//ImportAnimation.js

function ImportAnimation(){};

var p = ImportAnimation.prototype;

p.init = function(animation){

	this.views = [];
	this.animation = animation;

	var tracks = animation.takes.default.tracks;
	this.tracks = tracks;
	
	// var startAnimation = {};
	// startAnimation.duration = 5;
	// startAnimation.viewId = 'ID4';
	// startAnimation.data = -5;
	// startAnimation.name = 'translate';
	
	// // this.tracks.push(startAnimation);
	
	// var endAnimation = {};
	// endAnimation.duration = 5;
	// endAnimation.viewId = 'ID4';
	// endAnimation.data = -40;
	// endAnimation.name = 'translate';
	// this.tracks.unshift(endAnimation);
	

	this._cue = [];

	// this.startYpos = -40;
	this.mainId = 'ID4';

	// this.currentYPos = -40;
	// this.targetYPos = this.currentYPos;

	// this.createCue(this.tracks);
	this.reset();

	// debugger;

	
};

p.createCue = function(tracks){

	this._cue = [];

	// debugger;

	this.totalDuration = 0;
	for (var i=tracks.length-1;i>=0;i--){
		
		var cue = {};
		cue.startTime = this.totalDuration;
		cue.duration = tracks[i].duration;
		cue.data = tracks[i].data;
		if (tracks[i].name == 'translate'){
			cue.viewId = tracks[i].viewId;
			cue.animationProp = tracks[i].name;
		}else{
			cue.viewId = tracks[i].property.substr(0, tracks[i].property.indexOf('/'));
			cue.animationProp = tracks[i].name.substr(0, tracks[i].name.indexOf('.'));
		}
		
		// if (cue.viewId == 'ID67' || cue.viewId == 'ID47')
		this._cue.push(cue);
		this.totalDuration += tracks[i].duration;
		// debugger;
	}

	for (var i=0;i<this._cue.length;i++){
		this._cue[i].normalizedStartTime = this._cue[i].startTime / this.totalDuration;
		this._cue[i].normalizedEndTime = (this._cue[i].startTime + this._cue[i].duration) / this.totalDuration;
	}
	
	// debugger;

};

p.reset = function(){

	this.startTranslateTime = undefined;
	this.endTranslateTime = undefined;

	this.createCue(this.tracks);

	this.currentTrack = this._cue.shift();

};



p.update = function(normalized){

	
	
	if (normalized > -.4 && normalized < 0){
		var now = Date.now();
		var duration = 2;
		if (this.startTranslateTime === undefined)
			this.startTranslateTime = now/1000;
		
		var currentSec = (now/1000 - this.startTranslateTime);
		var change = 35;
		var start = -20;
		// var change = 0;
		// var start = 20;

		var calcVal = Math.easeOutExpo(currentSec, start, change, duration);
		if (currentSec < 2)
			this.views[this.mainId].currentTranslate = calcVal;

		// console.log(calcVal, currentSec);
	}
	if (normalized > 1.2){
		var now = Date.now();
		var duration = 2;
		if (this.endTranslateTime === undefined)
			this.endTranslateTime = now/1000;
		
		var currentSec = (now/1000 - this.endTranslateTime);
		var change = -35;
		var start = 15;
		// var change = 0;
		// var start = 20;

		var calcVal = Math.easeInExpo(currentSec, start, change, duration);
		if (currentSec < 2)
			this.views[this.mainId].currentTranslate = calcVal;
	}
	if (normalized < 0 || normalized > 1) {
		// this.views[this.mainId].currentTranslate = this.startYpos;
		// this.targetYPos = -40;
		return;
	}

	// if (normalized < 1)
	// 	this.targetYPos = -5;


	

	var normalizedVal = (normalized - this.currentTrack.normalizedStartTime)/(this.currentTrack.normalizedEndTime - this.currentTrack.normalizedStartTime);
	// console.log(normalizedVal);

	if (this.currentTrack.animationProp == 'translate'){
		// this.views[this.mainId].currentTranslate = this.startYpos + ( normalizedVal * (Math.abs(this.startYpos) + this.currentTrack.data));
		// this.targetYPos = this.currentTrack.data;
	}
	else
		var val = normalizedVal * this.currentTrack.data[3];

	// console.log('idx: ', this.currentIdx ,'  diff: ',diff, ' val: ',val, ' duration: ',currentTrack.duration, ' goal val: ',currentTrack.data[3]);

	// if (this.views[this.currentTrack.viewId].currentAnimationProp[0] != this.currentTrack.animationProp)
	this.views[this.currentTrack.viewId].currentAnimationProp = this.currentTrack.animationProp;
	this.views[this.currentTrack.viewId].currentAnimationVal = val;


	if (normalizedVal >= 1){

		if (this._cue.length > 0)
			this.currentTrack = this._cue.shift();
		else
			this.run = false;

		
	}


};


module.exports = ImportAnimation;