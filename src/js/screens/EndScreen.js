//EndScreen.js

function EndScreen(){};

var p = EndScreen.prototype;

p.init = function(onReplayClick, callbackScope){

	this.el = document.body.querySelector('.overlay.endScreen');
	this.titleEl = this.el.querySelector('.title');

	this.replayBtn = this.el.querySelector('.replay');
	this.replayBtn.addEventListener('click', this.onReplayClick.bind(this));

	this.onReplayClickCallback = onReplayClick;
	this.callbackScope = callbackScope;

	this.targetYPos = window.innerHeight;
	this.currentYPos = window.innerHeight;

	this.isShowing = false;

};

p.onReplayClick = function(){

	
	this.onReplayClickCallback.call(this.callbackScope);
};

p.hide = function(){

	this.isShowing = false;
	// this.el.style.display = 'none';
	this.targetYPos = window.innerHeight;

};

p.show = function(){

	this.isShowing = true;
	this.targetYPos = 0;
	// this.el.style.display = 'block';
};

p.update = function(){

	var translateV = 0;
	translateV = (this.targetYPos - this.currentYPos) * .04;
	this.currentYPos += Math.round(translateV * 100) / 100;

};

p.render = function(){

	
	this.el.style.top = this.currentYPos;
};

p.onResize = function(w,h){

	this.titleEl.style.left = w/2 - 20 + 'px';
	this.titleEl.style.top = h/2 - 40 + 'px';

	if (!this.isShowing){
		this.targetYPos = h;
		this.currentYPos = h;
	}
	

	this.titleEl.style.opacity = 1;
};

module.exports = EndScreen;