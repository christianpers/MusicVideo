//SceneMain.js

var LoaderScreen = require('./screens/LoaderScreen');
var EndScreen = require('./screens/EndScreen');
var ViewWalls = require('./views/ViewWalls');
var ViewRoof = require('./views/ViewRoof');
var ViewFloor = require('./views/ViewFloor');
var ViewVideo = require('./views/ViewVideo');
var ViewPrism = require('./views/ViewPrism');
var ViewLeftWall = require('./views/ViewLeftWall');
var ViewPlain = require('./views/ViewPlain');
var ViewBackground = require('./views/ViewBackground');
var ViewImport = require('./views/ViewImport');
var Scene = require('./framework/Scene');
var KeyboardInteractor = require('./interaction/KeyboardInteractor');
var MouseInteractor = require('./interaction/MouseInteractor');
var SceneTransforms = require('./framework/SceneTransforms');
var Framebuffer = require('./framework/Framebuffer');
var Texture = require('./framework/Texture');
var AudioPlayer = require('./players/AudioPlayer');
var VideoPlayer = require('./players/VideoPlayer');
var SpectrumAnalyser = require('./framework/SpectrumAnalyzer');
var ColladaLoader = require('./framework/ColladaLoader');
var ImportAnimation = require('./framework/ImportAnimation');
var ImportsController = require('./ImportsController');
var glslify = require("glslify");

function SceneMain(){};

var p = SceneMain.prototype = new Scene();
var s = Scene.prototype;

var gl = null;

var grad3 = [[0,1,1],[0,1,-1],[0,-1,1],[0,-1,-1],
                   [1,0,1],[1,0,-1],[-1,0,1],[-1,0,-1],
                   [1,1,0],[1,-1,0],[-1,1,0],[-1,-1,0], // 12 cube edges
                   [1,0,-1],[-1,0,-1],[0,-1,1],[0,1,1]]; // 4 more to make 16

var perm = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

var simplex4 = [
  [0,64,128,192],[0,64,192,128],[0,0,0,0],[0,128,192,64],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[64,128,192,0],
  [0,128,64,192],[0,0,0,0],[0,192,64,128],[0,192,128,64],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[64,192,128,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [64,128,0,192],[0,0,0,0],[64,192,0,128],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[128,192,0,64],[128,192,64,0],
  [64,0,128,192],[64,0,192,128],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[128,0,192,64],[0,0,0,0],[128,64,192,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [128,0,64,192],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [192,0,64,128],[192,0,128,64],[0,0,0,0],[192,64,128,0],
  [128,64,0,192],[0,0,0,0],[0,0,0,0],[0,0,0,0],
  [192,64,0,128],[0,0,0,0],[192,128,0,64],[192,128,64,0]
];

p.init = function(){

	s.init.call(this);

	this.loaderScreen = new LoaderScreen();
	this.loaderScreen.init();
	this.loaderScreen.show();
	// this.loaderScreen.hide();

	this.endScreen = new EndScreen();
	this.endScreen.init(this._onReplay, this);
	// this.endScreen.hide();

	this.onResize();
	window.addEventListener('resize', this.onResize.bind(this));

	gl = window.NS.GL.glContext;

	var derivative = gl.getExtension('OES_standard_derivatives');

	

	this.camera.setPosition(new Array(0.0, 5.0, 11.0));
    this.camera.setLookAtPoint(vec3.fromValues(0.0, 5.0, -1.0));
    // this.camera.yaw(Math.PI * -1.25);
    // this.camera.moveForward(4);

    // debugger;
    this.leftWallCamera.setPosition(new Array(0.0, 10.0, 0.0));
    this.leftWallCamera.setLookAtPoint(vec3.fromValues(-1.0, 10.0, 0.0));
    // this.leftWallCamera.yaw(Math.PI * .25);
    this.leftWallCamera.moveForward(-15.8);

  
    this.keyboardInteractor = new KeyboardInteractor();
    this.keyboardInteractor.init(this.camera, this.canvas);
    this.keyboardInteractor.setup();

    this.mouseInteractor = new MouseInteractor();
    this.mouseInteractor.init(this.camera, this.canvas);
    this.mouseInteractor.setup();

	this.transforms = new SceneTransforms();
	this.transforms.init(this.canvas);

	this.leftWallTransforms = new SceneTransforms();
	this.leftWallTransforms.init(this.canvas);


	this.orthoTransforms = new SceneTransforms();
	this.orthoTransforms.init(this.canvas);
	

	this._audioCtx = new AudioContext();

	
	this.videoPlayer = new VideoPlayer();
	this.videoPlayer.init(this._onAssetsLoaded, this._onVideoBuffering, this._onVideoPlaying, this._onVideoEnded, this);
	this.videoPlayer.load('assets/videoNew.mp4');

	this.audioPlayer = new AudioPlayer();
	this.audioPlayer.init(this._audioCtx, this._onAssetsLoaded, this);
	this.audioPlayer.load('assets/old.mp3');

	this.spectrumAnalyzer = new SpectrumAnalyser();
	this.spectrumAnalyzer.init(this._audioCtx);

	this._initViews();
	this.createNoiseTexture();

	this._concreteTexture = new Texture();
	this._concreteTexture.init(window.NS.Concrete, false);

	this.importsLoaded = false;

	this._imports = [];
	this.prismImport = new ColladaLoader();
	this.prismImport.load("separate.dae", 'prism', this._onImportLoaded, this);
	this._imports.push(this.prismImport);

	this.circlesImport = new ColladaLoader();
	this.circlesImport.load("wii2.dae", 'circles', this._onImportLoaded, this);
	this._imports.push(this.circlesImport);

	this.backgroundLoaderFader = 0.1;

	// this.testImport = new ColladaLoader();
	// this.testImport.load("../../imports/boxx.dae", 'test', this._onImportLoaded, this);
	// this._imports.push(this.testImport);


};



p.createNoiseTexture = function(){

	// PERM TEXTURE
	var pixels = new Uint8Array(256 * 256 * 4);
	
	permTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, permTexture);

	for(var i = 0; i<256; i++){
		for(var j = 0; j<256; j++) {
		  var offset = (i*256+j)*4;
		  var value = perm[(j+perm[i]) & 0xFF];
		  pixels[offset] = grad3[value & 0x0F][0] * 64 + 64;   // Gradient x
		  pixels[offset+1] = grad3[value & 0x0F][1] * 64 + 64; // Gradient y
		  pixels[offset+2] = grad3[value & 0x0F][2] * 64 + 64; // Gradient z
		  pixels[offset+3] = value;                     // Permuted index
		}
	}
	
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

	this._permTexture = new Texture();
	this._permTexture.init(permTexture, true);


	// SIMPLEX TEXTURE
	var test = new Uint8Array(64 * 1 * 4);
	
	var index = 0;
	for (var i=0;i<simplex4.length;i++){
		for (var j=0;j<simplex4[i].length;j++){

			test[index] = simplex4[i][j];

			index++;
		}
	}

	simplexTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, simplexTexture);

	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 64, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, test );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

	this._simplexTexture = new Texture();
	this._simplexTexture.init(simplexTexture, true);
};

p._onImportLoaded = function(loadedObj){

	// debugger;

	if (loadedObj.type == 'prism'){
		this._vPrism.createMesh(loadedObj.parentData);
		this.backgroundLoaderFader += .2;
	}else if (loadedObj.type == 'circles'){
		
		this._circlesAnimation = new ImportAnimation();
		this._circlesAnimation.init(loadedObj.animationData[0]);
		this._circlesAnimation.startTime = 10;

		this._circlesAnimation.views[loadedObj.parentData[0].id] = this._vCircle;

		var childViews = [];
		for (var i=0;i<loadedObj.parentData[0].children.length;i++){

			var childView = new ViewImport();
			childView.init(undefined, undefined);
			childView.createMesh(loadedObj.parentData[0].children[i]);
			childView.transforms = this.transforms;
			childView.id = loadedObj.parentData[0].children[i].id;
			childViews.push(childView);
			this._circlesAnimation.views[loadedObj.parentData[0].children[i].id] = childView;

		}

		this.importsController = new ImportsController();
		this.importsController.init([this._circlesAnimation]);

		// debugger;
		this._vCircle.id = loadedObj.parentData[0].id;
		this._vCircle.addSubViews(childViews);

		this.backgroundLoaderFader += .2;
	}else if (loadedObj.type == 'test'){

		// this._vTestImport.createMesh(loadedObj.parentData[0]);
	}
};


p._onAssetsLoaded = function(e){

	this.backgroundLoaderFader += .2;

	console.log('assets loaded');

	if (!this.audioPlayer.isLoaded || !this.videoPlayer.isLoaded) return;

	for (var i=0;i<this._imports.length;i++){
		if (!this._imports[i].dataLoaded) return;
	}

	this.importsLoaded = true;
	
	this._initTextures();

	this.loaderScreen.hide();
	
};

p._onVideoBuffering = function(){

	this.audioPlayer.pause();
	this.spectrumAnalyzer.disconnect(this.audioPlayer.getSourceNode());
	this.importsController.pause();

};

p._onVideoPlaying = function(){


	this.audioPlayer.play();
	this.spectrumAnalyzer.connect(this.audioPlayer.getSourceNode());
	this.importsController.start();
};

p._onVideoEnded = function(){

	this.endScreen.show();
	this.audioPlayer.pause();
	this.spectrumAnalyzer.disconnect(this.audioPlayer.getSourceNode());
	this.audioPlayer.reset();
	this.videoPlayer.reset();
	this.importsController.pause();

	this._vCircle.resetAnimation();

};

p._onReplay = function(){


	this.videoPlayer.play();
	this.endScreen.hide();

};



p._initTextures = function() {
	console.log( "Init Texture" );

	this.backgroundLoaderFader += .2;

	this._videoTexture = new Texture();
	this._videoTexture.init(this.videoPlayer.video, false);

	this.fboSize = {};
	this.fboSize.w = window.innerWidth * 2;
	this.fboSize.h = window.innerHeight * 2;

	this._leftWallFBO = new Framebuffer();
	this._leftWallFBO.init(this.fboSize.w/2, this.fboSize.h/2, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);

	this._prismFBO = new Framebuffer();
	this._prismFBO.init(this.fboSize.w, this.fboSize.h, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);
	
	

};

p._initViews = function() {
	console.log( "Init Views" );

	this._views = [];

	this.backgroundLoaderFader += .2;

	this._vBackground = new ViewBackground();
	this._vBackground.init(glslify('../shaders/background.vert'), glslify('../shaders/background.frag'));
	this._vBackground.transforms = this.orthoTransforms;

	this._vCopy = new ViewPlain();
	this._vCopy.init(glslify("../shaders/copy.vert"), glslify("../shaders/copy.frag"));
	this._vCopy.transforms = this.orthoTransforms;


	this._vWalls = new ViewWalls();
	this._vWalls.init(glslify("../shaders/room.vert"), glslify("../shaders/walls.frag"));
	this._vWalls.transforms = this.transforms;
	// this._views.push(this._vWalls);

	this._vRoof = new ViewRoof();
	this._vRoof.init(glslify("../shaders/room.vert"), glslify("../shaders/roof.frag"));
	this._vRoof.transforms = this.transforms;
	// this._views.push(this._vRoof);

	this._vFloor = new ViewFloor();
	this._vFloor.init(glslify("../shaders/room.vert"), glslify("../shaders/floor.frag"));
	this._vFloor.transforms = this.transforms;
	// this._views.push(this._vFloor);

// 		var gui = new dat.GUI({load: {
//   "preset": "Default",
//   "closed": false,
//   "remembered": {
//     "Default": {
//       "0": {
//         "colorNoiseMultiplier": 10,
//         "noiseBaseColor": [
//           200,
//           19.999999999999996,
//           62.35294117647059
//         ],
//         "audioLevelNoiseDivider": 26.377211683002106,
//         "vertexMultiplier": 0.3702049918442206,
//         "usePulse": false
//       }
//     }
//   },
//   "folders": {
//     "Noise": {
//       "preset": "Default",
//       "closed": false,
//       "folders": {}
//     }
//   }
// }});
// 		gui.remember(this._vRoom);
// 		var noise = gui.addFolder('Noise');
// 		noise.add(this._vRoom, 'colorNoiseMultiplier', 0, 2000);
// 		noise.addColor(this._vRoom, 'noiseBaseColor');
// 		noise.add(this._vRoom, 'audioLevelNoiseDivider', 1, 40);
// 		noise.add(this._vRoom, 'vertexMultiplier', .1, 5);
// 		noise.add(this._vRoom, 'usePulse');
// 		noise.open();

	this._vVideo = new ViewVideo();
	this._vVideo.init(glslify("../shaders/video.vert"), glslify("../shaders/video.frag"));
	this._vVideo.transforms = this.transforms;
	// this._views.push(this._vVideo);

	this._vPrism = new ViewPrism();
	this._vPrism.init(glslify("../shaders/prism.vert"), glslify("../shaders/prism.frag"));
	this._vPrism.transforms = this.leftWallTransforms;
	// this._views.push(this._vPrism);

	this._vLeftWall = new ViewLeftWall();
	this._vLeftWall.init(glslify("../shaders/room.vert"), glslify("../shaders/wall_fbo.frag"));
	this._vLeftWall.transforms = this.leftWallTransforms;
	// this._views.push(this._vLeftWall);

	// Imports
	this._vCircle = new ViewImport();
	this._vCircle.init(glslify("../shaders/plain.vert"), glslify("../shaders/plain.frag"));
	this._vCircle.transforms = this.transforms;
	// this._views.push(this._vCircle);


	// this._vTestImport = new ViewImport();
	// this._vTestImport.init("shaders/plain.vert", "shaders/plain.frag");
	// this._vTestImport.transforms = this.transforms;
	// this._views.push(this._vTestImport);



};

p.update = function(){

	s.update.call(this);

	if (this.importsController)
		this.importsController.update(this.videoPlayer.video.currentTime);
		// if (this._circlesAnimation)
		// 	this._circlesAnimation.update();

	this.endScreen.update();
	this.loaderScreen.update();
};


p.render = function() {

	// debugger;

	this.endScreen.render();
	this.loaderScreen.render();

	gl.clearColor( 0, 0, 0, 1 );
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	// FIX WITH GLSLIFY !!!!
	// var shadersLoaded = true;
	// for (var i=0;i<this._views.length;i++){
	// 	if (!this._views[i].shadersLoaded) shadersLoaded = false;
	// }
	// if (!shadersLoaded) return;
	
	this.transforms.push();
	this.transforms.setCamera(this.camera);

	this.camera.apply(gl.viewportWidth / gl.viewportHeight);
    this.transforms.calculateModelView();

	this.audioData = this.spectrumAnalyzer.getAudioData();
	// console.log(this.audioData);
	
	if (!this.loaderScreen.isShowing && !this.endScreen.isShowing){
		if (this.videoPlayer.isLoaded && this.audioPlayer.isLoaded && this.importsLoaded){

			if (!this.videoPlayer.triggeredPlay){
				this.videoPlayer.play();
				this.backgroundLoaderFader = 1.0;
				// setTimeout(function(){

					
				// },0);
				
				
			}
			
			this._videoTexture.updateTexture(this.videoPlayer.video);

			this.leftWallTransforms.push();
			
			this.leftWallTransforms.setCamera(this.leftWallCamera);
			this.leftWallCamera.apply(1024/768);

			this.leftWallTransforms.calculateModelView();

			//render wall with noise
			this._leftWallFBO.bind();

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			this._vLeftWall.render(this._videoTexture, this.audioData, this._permTexture, this._simplexTexture);

			this._leftWallFBO.unbind();

			//render prism with wall texture
			this._prismFBO.bind();

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			this._vPrism.render(this._leftWallFBO.getTexture(), this.audioData);

			this._prismFBO.unbind();

			this.leftWallTransforms.pop();

			



			// this.orthoTransforms.setCamera(this.orthoCamera);

			// this._vCopy.render(this._prismFBO.getTexture(), this.fboSize);



			// Render visible scene
			this._vWalls.render(this._prismFBO.getTexture(), this.fboSize);
			// // // this._vRoom.render(this._prismFBO.getTexture(), this._concreteTexture);

			this._vVideo.render(this._videoTexture);

			// console.log(this.audioData);
			// debugger;
			this._vFloor.render(this._prismFBO.getTexture(), this._concreteTexture, this.audioData, this.fboSize);

			this._vRoof.render(this._prismFBO.getTexture(), this._concreteTexture, this.audioData, this.fboSize);

			this._vCircle.render(this._leftWallFBO.getTexture(), this.audioData);

			// debugger;
			// this._vTestImport.render(this._concreteTexture, this.audioData);

		}
	}else{
		this.orthoTransforms.setCamera(this.orthoCamera);
		this._vBackground.render(this._permTexture, this._simplexTexture, this._concreteTexture, this.backgroundLoaderFader);
	}
		
	this.transforms.pop();
	
};

p.onResize = function(){

	s.onResize.call(this);

	var w = window.innerWidth;
	var h = window.innerHeight;
	this.loaderScreen.onResize(w,h);
	this.endScreen.onResize(w,h);

	

};

module.exports = SceneMain;