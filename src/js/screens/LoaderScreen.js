//LoaderScreen.js

function LoaderScreen(){};

var p = LoaderScreen.prototype;

p.init = function(){

	this.el = document.body.querySelector('.overlay.loaderScreen');
	this.titleEl = this.el.querySelector('.title');

	this.targetYPos = window.innerHeight;
	this.currentYPos = window.innerHeight;

	this.isShowing = false;
};

p.hide = function(){

	// this.el.style.display = 'none';
	this.targetYPos = window.innerHeight;
	this.isShowing = false;
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

	this.titleEl.style.left = w/2 - 30 + 'px';
	this.titleEl.style.top = h/2 - 60 + 'px';

	if (!this.isShowing){
		this.targetYPos = h;
		this.currentYPos = h;
	}

	this.titleEl.style.opacity = 1;

	// this.titleEl.style.marginTop = h/2 - 40 + 'px';
};

module.exports = LoaderScreen;