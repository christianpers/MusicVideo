//VideoPlayer.js

function VideoPlayer(){};

var p = VideoPlayer.prototype;

p.init = function(onVideoLoadedCallback, onVideoPaused, onVideoPlaying, onVideoEnded, callbackScope){

	this.isLoaded = false;
	this.triggeredPlay = false;
	this.onVideoLoadedCallback = onVideoLoadedCallback;
	this.onVideoPaused = onVideoPaused;
	this.onVideoPlaying = onVideoPlaying;
	this.onVideoEnded = onVideoEnded;
	this.callbackScope = callbackScope;

	this._currentTime = -1;

	this.video = document.createElement('video');
	this.video.addEventListener('canplaythrough', this._onVideoLoaded.bind(this));
	this.video.addEventListener('ended', this.ended.bind(this));
	this.video.volume = 0.0;
	

	this._checkInterval  = 50.0;
	this._lastPlayPos    = 0;
	this._currentPlayPos = 0;
	this._bufferingDetected = true;

	this.checkBufferingInterval = null;
	this.checkBufferingBound = this.checkBuffering.bind(this);

};

p.ended = function(){

	this.onVideoEnded.call(this.callbackScope);
	
	
};

p.reset = function(){

	clearInterval(this.checkBufferingInterval);
	this._lastPlayPos    = 0;
	this._currentPlayPos = 0;
	this._bufferingDetected = true;
	this.video.currentTime = 0.001;
	//this.triggeredPlay = false;

};

p.load = function(path){

	this.video.src = path;
	this.video.load();
};

p.play = function(){

	this.video.play();
	this.triggeredPlay = true;
	this.checkBufferingInterval = setInterval(this.checkBufferingBound, this._checkInterval);
};

p._onVideoError = function(e){

	console.log('video error');
};

p._onVideoLoaded = function(e){

	if (this.isLoaded) return;
	console.log('video loaded');

	this.isLoaded = true;
	this.onVideoLoadedCallback.call(this.callbackScope);
};



p.checkBuffering = function(){

	var currentPlayPos = this.video.currentTime;

	var offset = 1 / this._checkInterval;

	if (!this._bufferingDetected && currentPlayPos < (this._lastPlayPos + offset)){
		console.log('buffering');
		this._bufferingDetected = true;
		this.onVideoPaused.call(this.callbackScope);
	}

	if (this._bufferingDetected && currentPlayPos > (this._lastPlayPos + offset)){
		console.log('not buffering anymore');
		this._bufferingDetected = false;
		this.onVideoPlaying.call(this.callbackScope);
	}

	this._lastPlayPos = currentPlayPos;




};

module.exports = VideoPlayer;