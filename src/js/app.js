// app.js
// var dat = require("dat-gui");

Math.easeInExpo = function (t, b, c, d) {
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};


Math.easeOutExpo = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};

(function() {
	
	var SceneMain = require("./SceneMain");

	

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

	p._init = function() {

		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		this.canvas.id = 'gl';
		document.body.appendChild(this.canvas);
		// bongiovi.GL.init(this.canvas);

		window.NS = {};
		window.NS.GL = {};
		window.NS.GL.params = {};
		window.NS.GL.params.width = 70;
		window.NS.GL.params.height = 40;
		window.NS.GL.params.depth = 60;

		// this._scene = new SceneApp();
		// bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});

		// this._sceneMain = new SceneMain();
		// this._sceneMain.init();

		var self = this;
		window.NS.Concrete = new Image();
		window.NS.Concrete.onload = function(){
			// scene = new window.NS.GL.SceneMain();
			// scene.init();

			// trigger();

			self._sceneMain = new SceneMain();
			self._sceneMain.init();

			self._loop();

		};
		window.NS.Concrete.src = 'assets/mattefloor.jpg';

		// var self = this;
		// setTimeout(function(){

		// 	bongiovi.Scheduler.addEF(self, self._loop);
		// },200);
	};

	p._loop = function(){

		requestAnimationFrame(this._loop.bind(this));

		this._sceneMain.loop()
	};

	// p._loop = function() {
	// 	this._sceneMain.loop();
	// };

})();


new App();