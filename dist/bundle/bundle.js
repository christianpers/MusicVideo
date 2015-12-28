(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
//MeshPlain.js
function MeshPlain(){};

var gl = null;

var p = MeshPlain.prototype;

p.init = function(vertexSize, indexSize, drawType){

	gl = window.NS.GL.glContext;

	this.vertexSize = vertexSize;
	this.indexSize = indexSize;
	this.drawType = drawType;
	this.extraAttributes = [];
	this.nBufferPos = undefined;

	this._floatArrayVertex = undefined;

	this.textureUsed = false;
};

p.bufferVertex = function(aryVertices) {
	var vertices = [];

	// for(var i=0; i<aryVertices.length; i++) {
	// 	for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
	// }

	if(this.vBufferPos == undefined ) this.vBufferPos = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);

	// if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
	// else {
	// 	if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
	// 	else {
	// 		for(var i=0;i<aryVertices.length; i++) {
	// 			this._floatArrayVertex[i] = aryVertices[i];
	// 		}
	// 	}
	// }

	gl.bufferData(gl.ARRAY_BUFFER, aryVertices, gl.STATIC_DRAW);
	this.vBufferPos.itemSize = 3;
};

p.bufferNormals = function(aryNormals) {
	var normals = [];

	// for(var i=0; i<aryVertices.length; i++) {
	// 	for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
	// }

	if(this.nBufferPos == undefined ) this.nBufferPos = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBufferPos);

	// if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
	// else {
	// 	if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
	// 	else {
	// 		for(var i=0;i<aryVertices.length; i++) {
	// 			this._floatArrayVertex[i] = aryVertices[i];
	// 		}
	// 	}
	// }

	gl.bufferData(gl.ARRAY_BUFFER, aryNormals, gl.STATIC_DRAW);
	this.nBufferPos.itemSize = 3;
};


p.bufferTexCoords = function(aryTexCoords) {
	this.textureUsed = true;
	// var coords = [];

	// for(var i=0; i<aryTexCoords.length; i++) {
	// 	for(var j=0; j<aryTexCoords[i].length; j++) coords.push(aryTexCoords[i][j]);
	// }

	this.vBufferUV = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferUV);
	gl.bufferData(gl.ARRAY_BUFFER, aryTexCoords, gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};


p.bufferData = function(data, name, itemSize) {
	var index = -1
	for(var i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name == name) {
			this.extraAttributes[i].data = data;
			index = i;
			break;
		}
	}

	// var bufferData = [];
	// for(var i=0; i<data.length; i++) {
	// 	for(var j=0; j<data[i].length; j++) bufferData.push(data[i][j]);
	// }

	if(index == -1) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = data;
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
		this.extraAttributes.push({name:name, data:data, itemSize:itemSize, buffer:buffer, floatArray:floatArray});
	} else {
		var buffer = this.extraAttributes[index].buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = this.extraAttributes[index].floatArray;
		for(var i=0;i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
	}
	
};


p.bufferIndices = function(aryIndices) {

	this.iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, aryIndices, gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aryIndices.length;
};

module.exports = MeshPlain;
},{}],3:[function(require,module,exports){
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
	this._vBackground.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform float angleVert;\n\nvarying vec3 vVertexPos;\nvarying vec3 vTextureCoord;\n\nvoid main(void) {\n\n\tvec3 newPos = aVertexPosition;\n\tnewPos.xy *= angleVert*2.0;\n\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vVertexPos = aVertexPosition;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_1_0(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289_1_0(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute_1_1(vec3 x) {\n  return mod289_1_0(((x*34.0)+1.0)*x);\n}\n\nfloat snoise_1_2(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289_1_0(i); // Avoid truncation effects in permutation\n  vec3 p = permute_1_1( permute_1_1( i.y + vec3(0.0, i1.y, 1.0 ))\n    + i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n\n\n// varying vec2 vTextureCoord;\n// uniform sampler2D uSampler0;\n\nuniform float angle;\n\nuniform sampler2D permTexture;\nuniform sampler2D simplexTexture;\nuniform sampler2D floorTexture;\n\nuniform float faderVal;\n\nvarying vec3 vVertexPos;\nvarying vec3 vTextureCoord;\n\n#define PI 3.141592653589793\n#define ONE 0.00390625\n#define ONEHALF 0.001953125\n\n/*\n * 3D simplex noise. Comparable in speed to classic noise, better looking.\n */\nfloat snoise(vec3 P){\n\n\t// The skewing and unskewing factors are much simpler for the 3D case\n\t#define F3 0.333333333333\n\t#define G3 0.166666666667\n\n  // Skew the (x,y,z) space to determine which cell of 6 simplices we're in\n\tfloat s = (P.x + P.y + P.z) * F3; // Factor for 3D skewing\n\tvec3 Pi = floor(P + s);\n\tfloat t = (Pi.x + Pi.y + Pi.z) * G3;\n\tvec3 P0 = Pi - t; // Unskew the cell origin back to (x,y,z) space\n\tPi = Pi * ONE + ONEHALF; // Integer part, scaled and offset for texture lookup\n\n\tvec3 Pf0 = P - P0;  // The x,y distances from the cell origin\n\n  // // For the 3D case, the simplex shape is a slightly irregular tetrahedron.\n  // // To find out which of the six possible tetrahedra we're in, we need to\n  // // determine the magnitude ordering of x, y and z components of Pf0.\n  // // The method below is explained briefly in the C code. It uses a small\n  // // 1D texture as a lookup table. The table is designed to work for both\n  // // 3D and 4D noise, so only 8 (only 6, actually) of the 64 indices are\n  // // used here.\n\tfloat c1 = (Pf0.x > Pf0.y) ? 0.5078125 : 0.0078125; // 1/2 + 1/128\n\tfloat c2 = (Pf0.x > Pf0.z) ? 0.25 : 0.0;\n\tfloat c3 = (Pf0.y > Pf0.z) ? 0.125 : 0.0;\n\tfloat sindex = c1 + c2 + c3;\n \tvec3 offsets = texture2D(simplexTexture, vec2(sindex, 0)).rgb;\n\tvec3 o1 = step(0.375, offsets);\n\tvec3 o2 = step(0.125, offsets);\n\n  // Noise contribution from simplex origin\n  float perm0 = texture2D(permTexture, Pi.xy).a;\n  vec3  grad0 = texture2D(permTexture, vec2(perm0, Pi.z)).rgb * 4.0 - 1.0;\n  float t0 = 0.6 - dot(Pf0, Pf0);\n  float n0;\n  if (t0 < 0.0) n0 = 0.0;\n  else {\n    t0 *= t0;\n    n0 = t0 * t0 * dot(grad0, Pf0);\n  }\n\n  // Noise contribution from second corner\n  vec3 Pf1 = Pf0 - o1 + G3;\n  float perm1 = texture2D(permTexture, Pi.xy + o1.xy*ONE).a;\n  vec3  grad1 = texture2D(permTexture, vec2(perm1, Pi.z + o1.z*ONE)).rgb * 4.0 - 1.0;\n  float t1 = 0.6 - dot(Pf1, Pf1);\n  float n1;\n  if (t1 < 0.0) n1 = 0.0;\n  else {\n    t1 *= t1;\n    n1 = t1 * t1 * dot(grad1, Pf1);\n  }\n  \n  // Noise contribution from third corner\n  vec3 Pf2 = Pf0 - o2 + 2.0 * G3;\n  float perm2 = texture2D(permTexture, Pi.xy + o2.xy*ONE).a;\n  vec3  grad2 = texture2D(permTexture, vec2(perm2, Pi.z + o2.z*ONE)).rgb * 4.0 - 1.0;\n  float t2 = 0.6 - dot(Pf2, Pf2);\n  float n2;\n  if (t2 < 0.0) n2 = 0.0;\n  else {\n    t2 *= t2;\n    n2 = t2 * t2 * dot(grad2, Pf2);\n  }\n  \n  // Noise contribution from last corner\n  vec3 Pf3 = Pf0 - vec3(1.0-3.0*G3);\n  float perm3 = texture2D(permTexture, Pi.xy + vec2(ONE, ONE)).a;\n  vec3  grad3 = texture2D(permTexture, vec2(perm3, Pi.z + ONE)).rgb * 4.0 - 1.0;\n  float t3 = 0.6 - dot(Pf3, Pf3);\n  float n3;\n  if(t3 < 0.0) n3 = 0.0;\n  else {\n    t3 *= t3;\n    n3 = t3 * t3 * dot(grad3, Pf3);\n  }\n\n  // Sum up and scale the result to cover the range [-1,1]\n  return 32.0 * (n0 + n1 + n2 + n3);\n}\n\n\nfloat pulse(float time) {\n    // const float pi = 3.14;\n    float frequency = 1.0;\n    return 0.5*(1.0+sin(2.0 * PI * frequency * time));\n}\n\n\nvoid main(void) {\n    // gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));\n\n    vec3 floorColor = texture2D(floorTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;\n\n    float vertexMultiplier = 2.0 / angle;\n\n    // float brightness = snoise_1_2(floorColor.rb/((angle+.4)*1.2));\n\n    float n = snoise( (floorColor.rgb/((angle+.05)*2.2)) );\n\t// float n = snoise(vec3(vertexMultiplier * vVertexPos * ((angle/faderVal) *1.0 ) ));\n  // float n = snoise((vVertexPos/angle) * sin(vertexMultiplier * PI));\n\n\t// n = snoise(vec3(vertexMultiplier * vVertexPos * (audioLevelHigh/audioLevelNoiseDivider) ));\n\n    \n\n    vec3 finalColor = mix(vec3(n),floorColor,1.0 - faderVal);\n    // gl_FragColor = vec4(floorColor,1.0);\n    gl_FragColor = vec4(finalColor, 1.0);\n}");
	this._vBackground.transforms = this.orthoTransforms;

	this._vCopy = new ViewPlain();
	this._vCopy.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nprecision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler0;\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvoid main(void) {\n\n\tfloat scaleW = fboW / winW;\n\tfloat scaleH = fboH / winH;\n\n    gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s/scaleW, vTextureCoord.t/scaleH));\n    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}");
	this._vCopy.transforms = this.orthoTransforms;


	this._vWalls = new ViewWalls();
	this._vWalls.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\n\n\nvarying vec2 vTextureCoord;\n\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n\tvec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n    gl_Position = uPMatrix * mvPosition;\n  \n    vTextureCoord = aTextureCoord;\n\n    vVertexPos = aVertexPosition;\n  \n\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n\nuniform sampler2D videoTexture;\n\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvarying vec2 vTextureCoord;\n\n//not used\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n    \n    \n  // vec3 finalColor = vec3(.5, .5, .5);\n\n  float scaleW = fboW / winW;\n  float scaleH = fboH / winH;\n   \n  //walls\n  vec4 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s/scaleW, vTextureCoord.t/scaleH));\n  // finalColor = videoColor.rgb;\n    \n    \n\n  gl_FragColor = vec4(videoColor);\n   \n}");
	this._vWalls.transforms = this.transforms;
	// this._views.push(this._vWalls);

	this._vRoof = new ViewRoof();
	this._vRoof.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\n\n\nvarying vec2 vTextureCoord;\n\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n\tvec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n    gl_Position = uPMatrix * mvPosition;\n  \n    vTextureCoord = aTextureCoord;\n\n    vVertexPos = aVertexPosition;\n  \n\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n\nuniform sampler2D videoTexture;\nuniform sampler2D concreteTexture;\n\nuniform float audioLevelDeep;\nuniform float audioLevelHigh;\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\n\nvoid main(void) {\n    \n    vec3 finalColor = vec3(0.5, 0.5, 0.5);\n    float alpha = 1.0;\n    float reflLimit = .02;\n\n    float scaleW = fboW / winW;\n    float scaleH = fboH / winH;\n\n    vec4 concreteColor = texture2D(concreteTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n\n    vec2 coords = vTextureCoord;\n    coords.s = coords.s/scaleW;\n    coords.t = coords.t/scaleH;\n\n    float maxS = 1.0 / scaleW;\n    float maxT = 1.0 / scaleH;\n\n   \n    float reflLimitS = maxS - reflLimit;\n    float reflLimitT = maxT - reflLimit;\n\n    vec4 videoColorRight = texture2D(videoTexture, vec2(maxS - coords.s, coords.t));\n    vec4 videoColorBack = texture2D(videoTexture, vec2(coords.t, coords.s));\n    vec4 videoColorLeft = texture2D(videoTexture, vec2(maxS - coords.s, maxT - coords.t));\n    vec4 videoColorFront = texture2D(videoTexture, vec2(coords.t, maxS - coords.s));\n\n    vec3 reflFront = smoothstep(reflLimitS, maxS, maxS - coords.s) * videoColorFront.rgb;\n    vec3 reflLeft = smoothstep(reflLimitT, maxT, maxT - coords.t) * videoColorLeft.rgb;\n    vec3 reflRight = smoothstep(reflLimitT, maxT, coords.t) * videoColorRight.rgb;\n    vec3 reflBack = smoothstep(reflLimitS, maxS, coords.s) * videoColorBack.rgb;\n\n    finalColor = (concreteColor.rgb * (vec3(.5, .5, .5) * audioLevelDeep)) + (reflFront + reflLeft + reflRight + reflBack);\n\n    gl_FragColor = vec4(finalColor, alpha);\n   \n}");
	this._vRoof.transforms = this.transforms;
	// this._views.push(this._vRoof);

	this._vFloor = new ViewFloor();
	this._vFloor.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\n\n\nvarying vec2 vTextureCoord;\n\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n\tvec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n    gl_Position = uPMatrix * mvPosition;\n  \n    vTextureCoord = aTextureCoord;\n\n    vVertexPos = aVertexPosition;\n  \n\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n\nuniform sampler2D videoTexture;\nuniform sampler2D concreteTexture;\n\nuniform float audioLevelDeep;\nuniform float audioLevelHigh;\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\n\nvoid main(void) {\n    \n  vec3 finalColor = vec3(0.5, 0.5, 0.5);\n  float alpha = 1.0;\n  float reflLimit = .02;\n\n  float scaleW = fboW / winW;\n  float scaleH = fboH / winH;\n\n  //floor\n  vec4 concreteColor = texture2D(concreteTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n\n  vec2 coords = vTextureCoord;\n  coords.s = coords.s/scaleW;\n  coords.t = coords.t/scaleH;\n\n  float maxS = 1.0 / scaleW;\n  float maxT = 1.0 / scaleH;\n\n  float reflLimitS = maxS - reflLimit;\n  float reflLimitT = maxT - reflLimit;\n\n  vec4 videoColorLeft = texture2D(videoTexture, vec2(maxS - coords.s, coords.t));\n  vec4 videoColorFront = texture2D(videoTexture, vec2(coords.t, coords.s));\n  vec4 videoColorRight = texture2D(videoTexture, vec2(maxS - coords.s, maxT - coords.t));\n  vec4 videoColorBack = texture2D(videoTexture, vec2(coords.t, maxS - coords.s));\n    \n  vec3 reflFront = smoothstep(reflLimitS, maxS, maxS - coords.s) * videoColorFront.rgb;\n  vec3 reflLeft = smoothstep(reflLimitT, maxT, maxT - coords.t) * videoColorLeft.rgb;\n  vec3 reflRight = smoothstep(reflLimitT, maxT, coords.t) * videoColorRight.rgb;\n  vec3 reflBack = smoothstep(reflLimitS, maxS, coords.s) * videoColorBack.rgb;\n\n  finalColor = (concreteColor.rgb * (vec3(.5, .5, .5) * max(.5, audioLevelDeep))) + (reflFront + reflLeft + reflRight + reflBack);\n    \n\n\n  gl_FragColor = vec4(finalColor, alpha);\n\n}");
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
	this._vVideo.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\nuniform sampler2D videoTexture;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_FragColor = texture2D(videoTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}");
	this._vVideo.transforms = this.transforms;
	// this._views.push(this._vVideo);

	this._vPrism = new ViewPrism();
	this._vPrism.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aAdjIndex;\nattribute float aUseInverse;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nuniform float audioLevelDeep;\nuniform float audioLevelHigh;\n\nuniform float angle;\n\nvarying vec2 vTextureCoord;\n\n\nvoid main(void) {\n    \n    vec3 newPosition = aVertexPosition;\n\n    if (aUseInverse == 2.0)\n   \t\tnewPosition.xy += sin(1.5 * 3.14 * angle) * aAdjIndex.y;\n   \telse if (aUseInverse == 1.0){\n   \t\tnewPosition.xy += cos(.7 * 3.14 * angle) * aAdjIndex.y;\n   \t}\n    // if (aAdjIndex.x < 0.0)\n   \t// newPosition.x += audioLevelDeep * aAdjIndex.x;\n   \t// else if (aAdjIndex.x > 0.0)\n   \t\t// newPosition.y -= audioLevelDeep * aAdjIndex.x;\n  \n    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n\n\n}", "#define GLSLIFY 1\nprecision mediump float;\n\nuniform sampler2D videoTexture;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_FragColor = texture2D(videoTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}");
	this._vPrism.transforms = this.leftWallTransforms;
	// this._views.push(this._vPrism);

	this._vLeftWall = new ViewLeftWall();
	this._vLeftWall.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\n\n\nvarying vec2 vTextureCoord;\n\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n\tvec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n    gl_Position = uPMatrix * mvPosition;\n  \n    vTextureCoord = aTextureCoord;\n\n    vVertexPos = aVertexPosition;\n  \n\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n\nuniform sampler2D simplexTexture;\nuniform sampler2D permTexture;\nuniform sampler2D videoTexture;\n\n\nuniform float audioLevelDeep;\nuniform float audioLevelHigh;\n\n//datgui props\nuniform float colorNoiseMultiplier;\nuniform vec3 noiseBaseColor;\nuniform float audioLevelNoiseDivider;\nuniform float vertexMultiplier;\nuniform int usePulse;\n\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\n\n\n#define PI 3.141592653589793\n#define ONE 0.00390625\n#define ONEHALF 0.001953125\n\n/*\n * 3D simplex noise. Comparable in speed to classic noise, better looking.\n */\nfloat snoise(vec3 P){\n\n\t// The skewing and unskewing factors are much simpler for the 3D case\n\t#define F3 0.333333333333\n\t#define G3 0.166666666667\n\n  // Skew the (x,y,z) space to determine which cell of 6 simplices we're in\n\tfloat s = (P.x + P.y + P.z) * F3; // Factor for 3D skewing\n\tvec3 Pi = floor(P + s);\n\tfloat t = (Pi.x + Pi.y + Pi.z) * G3;\n\tvec3 P0 = Pi - t; // Unskew the cell origin back to (x,y,z) space\n\tPi = Pi * ONE + ONEHALF; // Integer part, scaled and offset for texture lookup\n\n\tvec3 Pf0 = P - P0;  // The x,y distances from the cell origin\n\n  // // For the 3D case, the simplex shape is a slightly irregular tetrahedron.\n  // // To find out which of the six possible tetrahedra we're in, we need to\n  // // determine the magnitude ordering of x, y and z components of Pf0.\n  // // The method below is explained briefly in the C code. It uses a small\n  // // 1D texture as a lookup table. The table is designed to work for both\n  // // 3D and 4D noise, so only 8 (only 6, actually) of the 64 indices are\n  // // used here.\n\tfloat c1 = (Pf0.x > Pf0.y) ? 0.5078125 : 0.0078125; // 1/2 + 1/128\n\tfloat c2 = (Pf0.x > Pf0.z) ? 0.25 : 0.0;\n\tfloat c3 = (Pf0.y > Pf0.z) ? 0.125 : 0.0;\n\tfloat sindex = c1 + c2 + c3;\n \tvec3 offsets = texture2D(simplexTexture, vec2(sindex, 0)).rgb;\n\tvec3 o1 = step(0.375, offsets);\n\tvec3 o2 = step(0.125, offsets);\n\n  // Noise contribution from simplex origin\n  float perm0 = texture2D(permTexture, Pi.xy).a;\n  vec3  grad0 = texture2D(permTexture, vec2(perm0, Pi.z)).rgb * 4.0 - 1.0;\n  float t0 = 0.6 - dot(Pf0, Pf0);\n  float n0;\n  if (t0 < 0.0) n0 = 0.0;\n  else {\n    t0 *= t0;\n    n0 = t0 * t0 * dot(grad0, Pf0);\n  }\n\n  // Noise contribution from second corner\n  vec3 Pf1 = Pf0 - o1 + G3;\n  float perm1 = texture2D(permTexture, Pi.xy + o1.xy*ONE).a;\n  vec3  grad1 = texture2D(permTexture, vec2(perm1, Pi.z + o1.z*ONE)).rgb * 4.0 - 1.0;\n  float t1 = 0.6 - dot(Pf1, Pf1);\n  float n1;\n  if (t1 < 0.0) n1 = 0.0;\n  else {\n    t1 *= t1;\n    n1 = t1 * t1 * dot(grad1, Pf1);\n  }\n  \n  // Noise contribution from third corner\n  vec3 Pf2 = Pf0 - o2 + 2.0 * G3;\n  float perm2 = texture2D(permTexture, Pi.xy + o2.xy*ONE).a;\n  vec3  grad2 = texture2D(permTexture, vec2(perm2, Pi.z + o2.z*ONE)).rgb * 4.0 - 1.0;\n  float t2 = 0.6 - dot(Pf2, Pf2);\n  float n2;\n  if (t2 < 0.0) n2 = 0.0;\n  else {\n    t2 *= t2;\n    n2 = t2 * t2 * dot(grad2, Pf2);\n  }\n  \n  // Noise contribution from last corner\n  vec3 Pf3 = Pf0 - vec3(1.0-3.0*G3);\n  float perm3 = texture2D(permTexture, Pi.xy + vec2(ONE, ONE)).a;\n  vec3  grad3 = texture2D(permTexture, vec2(perm3, Pi.z + ONE)).rgb * 4.0 - 1.0;\n  float t3 = 0.6 - dot(Pf3, Pf3);\n  float n3;\n  if(t3 < 0.0) n3 = 0.0;\n  else {\n    t3 *= t3;\n    n3 = t3 * t3 * dot(grad3, Pf3);\n  }\n\n  // Sum up and scale the result to cover the range [-1,1]\n  return 32.0 * (n0 + n1 + n2 + n3);\n}\n\nfloat pulse(float time) {\n    // const float pi = 3.14;\n    float frequency = 1.0;\n    return 0.5*(1.0+sin(2.0 * PI * frequency * time));\n}\n\n\nvoid main(void) {\n   \n    float n = 0.0;\n    if (usePulse == 1)\n      n = snoise(vec3(vertexMultiplier * vVertexPos * (pulse(audioLevelHigh/audioLevelNoiseDivider) )));\n    else\n      n = snoise(vec3(vertexMultiplier * vVertexPos * (audioLevelHigh/audioLevelNoiseDivider) ));\n\n    vec3 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;\n\n    // vec3 finalColor = vec3(audioLevelDeep, audioLevelDeep, 0.3);\n    vec3 finalColor = vec3(noiseBaseColor.r/255.0, noiseBaseColor.g/255.0, noiseBaseColor.b/255.0) * videoColor * (n * colorNoiseMultiplier);\n\n    float aVal = 1.0;\n    \n    gl_FragColor = vec4(finalColor, aVal);\n   \n}");
	this._vLeftWall.transforms = this.leftWallTransforms;
	// this._views.push(this._vLeftWall);

	// Imports
	this._vCircle = new ViewImport();
	this._vCircle.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec3 aVertexNormal;\nattribute vec3 aVertexColor;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat4 uNMatrix;\n\nuniform vec3 uLightPosition;\n\nuniform vec3 uMaterialDiffuse;\n\nvarying vec3 vNormal;\nvarying vec3 vLightRay;\nvarying vec3 vEyeVec;\nvarying vec3 vLighting;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\nvarying vec3 vColor;\n\nvoid main(void) {\n\n\t//Transformed vertex position\n\t// vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);\n\n\t// //Transformed normal position\n\t// vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));\n\n\t// //Transformed light position\n\t// vec4 light = uMVMatrix * vec4(uLightPosition,1.0);\n\n\t// //Light position\n\t// vLightRay = vertex.xyz-light.xyz;\n\n\t// //Vector Eye\n\t// vEyeVec = -vec3(vertex.xyz);\n\n\thighp vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n    highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);\n    highp vec3 directionalVector = vec3(0.05, 0.008, 0.005);\n    \n    highp vec4 transformedNormal = uNMatrix * vec4(aVertexNormal, 1.0);\n    \n    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n    vLighting = ambientLight + (directionalLightColor * directional);\n\n\n\n\tgl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n    vVertexPos = aVertexPosition;\n    vColor = aVertexColor;\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n// varying vec2 vTextureCoord;\n\n\nuniform mat4 uNMatrix;\n\n// uniform vec3 diffuse;\n\nuniform sampler2D videoTexture;\n\nuniform vec4 uLightAmbient;\nuniform vec4 uLightDiffuse;\nuniform vec4 uLightSpecular;\n\nuniform vec4 uMaterialAmbient;\nuniform vec3 uMaterialDiffuse;\nuniform vec3 uMaterialSpecular;\nuniform float uShininess;\n\nuniform float audioLevelDeep;\nuniform float audioLevelHigh;\n\nvarying vec3 vNormal;\nvarying vec3 vLightRay;\nvarying vec3 vEyeVec;\n\nvarying vec3 vLighting;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\nvarying vec3 vColor;\n\nvoid main(void) {\n\n\t// const vec3 lightCol1 = vec3( 0.0, 0.0, 0.0 );\n //    const vec3 lightDir1 = vec3( -1.0, 0.0, 0.0 );\n //    const float intensity1 = 1.0;\n\n //    vec4 lDirection1 = uNMatrix * vec4( lightDir1, 0.0 );\n //    vec3 lightVec1 = normalize( lDirection1.xyz );\n\n    // point light\n\n    // const vec3 lightPos2 = vec3( 0.0, 0.0, -200.0 );\n    // const vec3 lightCol2 = vec3( 1.0, 0.5, 0.2 );\n    // const float maxDistance2 = 20000.0;\n    // const float intensity2 = 1.5;\n\n    // vec4 lPosition = uNMatrix * vec4( lightPos2, 1.0 );\n    // vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\n    // vec3 lightVec2 = normalize( lVector );\n    // float lDistance2 = 1.0 - min( ( length( lVector ) / maxDistance2 ), 1.0 );\n\n    // // point light\n\n    // // const vec3 lightPos3 = vec3( 0.0, 0.0, -20.0 );\n    // // const vec3 lightCol3 = vec3(0.0, 1.0, 1.0 );\n    // // float maxDistance3 = audioEnergy * 40.0;\n    // // const float intensity3 = 1.5;\n\n    // // vec4 lPosition3 = uNMatrix * vec4( lightPos3, 1.0 );\n    // // vec3 lVector3 = lPosition3.xyz + vViewPosition.xyz;\n\n    // // vec3 lightVec3 = normalize( lVector3 );\n    // // float lDistance3 = 1.0 - min( ( length( lVector3 ) / maxDistance3 ), 1.0 );\n\n    // //\n\n    // vec3 normal = vNormal;\n\n    // // float diffuse1 = intensity1 * max( dot( normal, lightVec1 ), 0.0 );\n    // float diffuse2 = intensity2 * max( dot( normal, lightVec2 ), 0.0 ) * lDistance2;\n    // // float diffuse3 = intensity2 * max( dot( normal, lightVec3 ), 0.0 ) * lDistance3;\n\n    // // vec3 color = texture2D(testTexture, vec2(vTextureCoord.s, vTextureCoord.t )).rgb;\n\n    // gl_FragColor = vec4(diffuse2 * diffuse, 1.0 );\n    // gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(0.05, 0.8, 0.05, 1.0);\n\n    // vec3 L = normalize(vLightRay);\n    // vec3 N = normalize(vNormal);\n\n    // //Lambert's cosine law\n    // float lambertTerm = dot(N,-L);\n    \n    // //Ambient Term  \n    // vec4 Ia = uLightAmbient * uMaterialAmbient;\n\n    // //Diffuse Term\n    // vec4 Id = vec4(0.0,0.0,0.0,1.0);\n\n    // //Specular Term\n    // vec4 Is = vec4(0.0,0.0,0.0,1.0);\n\n    // if(lambertTerm > 0.0)\n    // {\n    //     Id = uLightDiffuse * vec4(uMaterialDiffuse,1.0) * lambertTerm; \n    //     vec3 E = normalize(vEyeVec);\n    //     vec3 R = reflect(L, N);\n    //     float specular = pow( max(dot(R, E), 0.0), uShininess);\n    //     Is = uLightSpecular * vec4(uMaterialSpecular,1.0) * specular;\n    // }\n\n    // //Final color\n    // vec4 finalColor = Ia + Id + Is;\n    // finalColor.a = 1.0;\n\n    // gl_FragColor = finalColor;\n\n //    vec4 Ia = uLightAmbient * uMaterialAmbient;\t//Ambient component: one for all\n //    vec4 finalColor = vec4(0.0,0.0,0.0,1.0);\t//Color that will be assigned to gl_FragColor\n\t\t\t\t\t\t\t\n\t// vec3 N = normalize(vNormal);\n\t// vec3 L = vec3(0.0);\n\t// float lambertTerm = 0.0;\n\t\n\t// // for(int i = 0; i < NUM_LIGHTS; i++){\t\t\t\t\t//For each light\n\t\t\n\t// L = normalize(vLightRay);\t\t\t//Calculate reflexion\n\t// lambertTerm = dot(N, -L);\n\t\n\t// if (lambertTerm > 0.4){\t\t\t\n\t// \tfinalColor += uLightDiffuse * vec4(uMaterialDiffuse,1.0) * lambertTerm; //Add diffuse component, one per light\n\t// }\n\t// // }\n\n\t// //Final color\n //    finalColor += Ia;\n //    finalColor.a = 1.0;\t\t\t\t//Add ambient component: one for all\t\t\t\t\t\n\t// gl_FragColor = finalColor;\t\t//The alpha value in this example will be 1.0\n    // vec3 finalColor = uMaterialDiffuse * vLighting;\n    vec3 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;\n\t// gl_FragColor = vec4(mix(videoColor, finalColor, .3), 1.0);\n    // smoothstep(0.8, 1.0, 1.0 - vTextureCoord.s) * videoColor.rgb;\n    float yPos = abs(min(vVertexPos.z, .2));\n    float audioLevel = audioLevelHigh/6.37;\n    vec3 finalColor = smoothstep(0.7, 1.0, audioLevelHigh/26.37) * vec3(0.5, 1.0, .7);\n    finalColor = vec3(.7, audioLevel, audioLevel) * yPos;\n    gl_FragColor = vec4(vColor * vLighting, 1.0);\n}");
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
},{"./ImportsController":1,"./framework/ColladaLoader":7,"./framework/Framebuffer":8,"./framework/ImportAnimation":9,"./framework/Scene":11,"./framework/SceneTransforms":12,"./framework/SpectrumAnalyzer":14,"./framework/Texture":15,"./interaction/KeyboardInteractor":17,"./interaction/MouseInteractor":18,"./players/AudioPlayer":19,"./players/VideoPlayer":20,"./screens/EndScreen":21,"./screens/LoaderScreen":22,"./views/ViewBackground":23,"./views/ViewFloor":24,"./views/ViewImport":25,"./views/ViewLeftWall":26,"./views/ViewPlain":27,"./views/ViewPrism":28,"./views/ViewRoof":29,"./views/ViewVideo":30,"./views/ViewWalls":31}],4:[function(require,module,exports){
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
},{"./SceneMain":3}],5:[function(require,module,exports){
//BaseCamera.js

function BaseCamera(){};

var p = BaseCamera.prototype;

function degToRadian(degrees) {
  return degrees * Math.PI / 180;
};

p.init = function(type){

	this.type = type;

	if (this.type == 'ortho'){
		this.projMatrix = mat4.create();
		this.viewMatrix = mat4.create();

		return;
	}

	// Raw Position Values
	this.left = vec3.fromValues(1.0, 0.0, 0.0); // Camera Left vector
	this.up = vec3.fromValues(0.0, 1.0, 0.0); // Camera Up vector
	this.dir = vec3.fromValues(0.0, 0.0, 1.0); // The direction its looking at
	this.pos = vec3.fromValues(0.0, 0.0, 0.0); // Camera eye position
	this.projectionTransform = null;
	this.projMatrix;
	this.viewMatrix;

	this.fieldOfView = 55;
	this.nearClippingPlane = 0.1;
	this.farClippingPlane = 1000.0;
};

p.apply = function(aspectRatio){

	var matView=mat4.create();
	var lookAtPosition=vec3.create();
	vec3.add(lookAtPosition, this.pos, this.dir);
	mat4.lookAt(matView, this.pos, lookAtPosition, this.up);
	mat4.translate(matView, matView, vec3.fromValues(-this.pos[0], -this.pos[1], -this.pos[2]));
	this.viewMatrix = matView;

	// console.log(this.dir, this.up);

	// Create a projection matrix and store it inside a globally accessible place.
	this.projMatrix=mat4.create();
	mat4.perspective(this.projMatrix, degToRadian(this.fieldOfView), aspectRatio, this.nearClippingPlane, this.farClippingPlane)

};

p.getFarClippingPlane = function(){
	return this.farClippingPlane;
};

p.getFieldOfView = function(){

	return this.fieldOfView;
};

p.getLeft = function(){

	return vec3.clone(this.left);
};

p.getNearClippingPlane = function(){

	return this.nearClippingPlane;
};

p.getPosition = function(){

	return vec3.clone(this.pos);
};

p.getProjectionMatrix = function(){

	return mat4.clone(this.projMatrix);
};

p.getViewMatrix = function(){

	return mat4.clone(this.viewMatrix);
};

p.getUp = function(){

	return vec3.clone(this.up);
};

p.setFarClippingPlane = function(){

	if (fcp > 0)
	{
		this.farClippingPlane = fcp;
	}
};

p.setFieldOfView = function(fov){

	if (fov > 0 && fov < 180)
	{
		this.fieldOfView = fov;
	}
};

p.setNearClippingPlane = function(ncp){

	if (ncp > 0)
	{
		this.nearClippingPlane = ncp;
	}
};

p.update = function(timeStep, lineVel, angularVel){

	if (vec3.squaredLength(linVel)==0 && vec3.squaredLength(angularVel)==0) return false;

	if (vec3.squaredLength(linVel) > 0.0)
	{
		// Add a velocity to the position
		vec3.scale(velVec,velVec, timeStep);

		vec3.add(this.pos, velVec, this.pos);
	}

	if (vec3.squaredLength(angularVel) > 0.0)
	{
		// Apply some rotations to the orientation from the angular velocity
		this.pitch(angularVel[0] * timeStep);
		this.yaw(angularVel[1] * timeStep);
		this.roll(angularVel[2] * timeStep);
	}

	return true;
};

module.exports = BaseCamera;
},{}],6:[function(require,module,exports){
//FreeCamera.js

var BaseCamera = require('../cameras/BaseCamera');

function FreeCamera(){};

function isVectorEqual(vecone,vectwo)
  {
   if(vecone[0]==vectwo[0]&&vecone[1]==vectwo[1]&&vecone[2]==vectwo[2])
   {
   return true;
   }
   else{
    return false;
   }
  }

var p = FreeCamera.prototype = new BaseCamera();
var s = BaseCamera.prototype;

p.init = function(){

  s.init.call(this);

  this.linVel = vec3.fromValues(0.0, 0.0, 0.0); // Animation of positions
  this.angVel = vec3.fromValues(0.0, 0.0, 0.0); // Animations of rotation around (side Vector, up Vector, dir Vector)


};

p.yaw = function(angle){

  this.rotateOnAxis(this.up, angle);
};

p.pitch = function(angle){

  this.rotateOnAxis(this.left, angle);
};

p.roll = function(angle){

  this.rotateOnAxis(this.dir, angle);
};

p.rotateOnAxis = function(axisVec, angle){

  // Create a proper Quaternion based on location and angle
  var quate=quat.create();
  quat.setAxisAngle(quate, axisVec, angle)
  
  // Create a rotation Matrix out of this quaternion
  vec3.transformQuat(this.dir, this.dir, quate)  
  vec3.transformQuat(this.left, this.left, quate)  
  vec3.transformQuat(this.up, this.up, quate)  
  vec3.normalize(this.up,this.up);
  vec3.normalize(this.left,this.left);
  vec3.normalize(this.dir,this.dir);

  this.up = vec3.fromValues(0.0, 1.0, 0.0); // Camera Up vector
};

p.setAngularVel = function(newVec){

  this.angVel[0] = newVec[0];
  this.angVel[1] = newVec[1];
  this.angVel[2] = newVec[2];
};

p.getAngularVel = function(){

  return vec3.clone(this.angVel);
};

p.getLinearVel = function(){

  return vec3.clone(this.linVel);
};

p.setLinearVel = function(){

  this.linVel[0] = newVec[0];
  this.linVel[1] = newVec[1];
  this.linVel[2] = newVec[2];
};

p.setLookAtPoint = function(newVec){

    // if the position hasn't yet been changed and they want the
  // camera to look at [0,0,0], that will create a problem.
  if (isVectorEqual(this.pos, [0, 0, 0]) && isVectorEqual(newVec, [0, 0, 0]))
  {
  
  }
  else
  {
    // Figure out the direction of the point we are looking at.
    vec3.subtract(this.dir,newVec, this.pos);
     vec3.normalize(this.dir,this.dir);
    // Adjust the Up and Left vectors accordingly
    vec3.cross(this.left,vec3.fromValues(0, 1, 0), this.dir );
    vec3.normalize(this.left,this.left);
    vec3.cross(this.up,this.dir, this.left);
    vec3.normalize(this.up,this.up);
  }
};

p.setPosition = function(newVec){

  this.pos=vec3.fromValues(newVec[0],newVec[1],newVec[2]);

  var xMax = 25;
  var zMax = 25;

  if (this.pos[0] > xMax)
    this.pos[0] = xMax;
  else if (this.pos[0] < -xMax)
    this.pos[0] = -xMax;
  else if (this.pos[2] > zMax)
    this.pos[2] = zMax;
  else if (this.pos[2] < -zMax)
    this.pos[2] = -zMax;

};

p.setUpVector = function(newVec){

  this.up[0] = newVec[0];
  this.up[1] = newVec[1];
  this.up[2] = newVec[2];
};

// p.moveSide = function(s){

//   var newPosition = [this.pos[0] - s*this.left[0],this.pos[1] - s*this.left[1],this.pos[2] - s*this.left[2]];

//   this.setPosition(newPosition);
// };


p.moveForward = function(s){

  var dirTemp = this.dir.slice(0);
  dirTemp[1] = 0;

  var newPosition = [this.pos[0] - s*this.dir[0],this.pos[1] - s*this.dir[1],this.pos[2] - s*this.dir[2]];

  this.setPosition(newPosition);
};

p.update = function(timeStep){

  if (vec3.squaredLength(this.linVel)==0 && vec3.squaredLength(this.angularVel)==0) 
  return false;

  if (vec3.squaredLength(this.linVel) > 0.0)
  {
    // Add a velocity to the position
    vec3.scale(this.velVec,this.velVec, timeStep);

    vec3.add(this.pos, this.velVec, this.pos);
  }

  if (vec3.squaredLength(this.angVel) > 0.0)
  {
    // Apply some rotations to the orientation from the angular velocity
    this.pitch(this.angVel[0] * timeStep);
    this.yaw(this.angVel[1] * timeStep);
    this.roll(this.angVel[2] * timeStep);
  }

  return true;
};

module.exports = FreeCamera;
},{"../cameras/BaseCamera":5}],7:[function(require,module,exports){
//ColladaLoader.js

function ColladaLoader(){};

var p = ColladaLoader.prototype;


p.load = function(path, type, onLoadedCallback, callbackScope){

	this.type = type;
	this.onLoadedCallback = onLoadedCallback;
	this.callbackScope = callbackScope;

	this.dataLoaded = false;

	this.childrenData = [];
	this.parentData = [];
	this.animationData = [];

	Collada.dataPath = 'imports/';
	Collada.load( path, this._onLoaded.bind(this) );

	
};

p.getParentData = function(){

	return this.parentData.slice(0);
};

p._onLoaded = function(e){

	var root = e.root;
	var subViews = [];
	for (var key in root){

		if (key == 'animations'){
			// animationID = root[key];
			// this._animation = new ViewAnimation();
			// this._animation.init(e.resources[root['animations']]);

			this.animationData.push(e.resources[root['animations']]);

		}

		if (key == 'children'){
			
			if (root[key].length > 0){
				var parent = root[key];

				for (var i=0;i<parent.length;i++){
					// if (root['animations']){
					// 	animation = e.resources[root['animations']];
					// }

					// var parentView = new ViewTest();
					// parentView.init(vertPath, fragPath, children[i], undefined, undefined);
					// this._parentView = parentView;
					// this._parentView.transforms = this.transforms;
					
					// var mesh = e.meshes

					// debugger;

					
					if (parent[i].children.length == 0){
						var mesh = e.meshes[parent[i].mesh];
						var material = e.materials[parent[i].material];

						this.parentData.push({id: parent[i].id, meshData: mesh, materialData: material, children: []});
						// this.parentData = {meshData: mesh, materialData: material};

					}else{
						var parentObj = {};

						parentObj.id = parent[i].id;
						var mesh = e.meshes[parent[i].mesh];
						var material = e.materials[parent[i].material];

						// parentObj.meshData = mesh;
						// parentObj.materialData = material;
						parentObj.children = [];
						for (var q=0;q<parent[i].children.length;q++){

							var childrenObj = {};

							var subViewData = parent[i].children[q];

							var mesh = e.meshes[subViewData.mesh];
							var material = e.materials[subViewData.material];

							childrenObj.meshData = mesh;
							childrenObj.materialData = material;
							childrenObj.id = subViewData.id;

							parentObj.children.push(childrenObj);
				
						}

						this.parentData.push(parentObj);
					}
				
				}

			}

		}

	}

	// this._animation.views[this._parentView.data.id] = this._parentView;
	// for (var i=0;i<subViews.length;i++){
	// 	this._animation.views[subViews[i].data.id] = subViews[i];
	// }

	// debugger;

	this.dataLoaded = true;

	this.onLoadedCallback.call(this.callbackScope, this);

	// var self = this;
	// setTimeout(function(){

	// 	self._animation.start();
	// },2000);
};


module.exports = ColladaLoader;
},{}],8:[function(require,module,exports){
//Framebuffer.js

var Texture = require('./Texture');

function Framebuffer(){};

var p = Framebuffer.prototype;

var gl = null;

p.init = function(width, height, magFilter, minFilter, texType){

	gl = window.NS.GL.glContext;

	this.id = '';

	this.texType = texType;
	this.width  = width;
	this.height = height;
	this.magFilter = magFilter==undefined ? gl.LINEAR : magFilter;
	this.minFilter = minFilter==undefined ? gl.LINEAR : minFilter;

	this.depthTextureExt 	= gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix

	this.texture            = gl.createTexture();
	this.depthTexture       = gl.createTexture();
	this.glTexture			= new Texture();
	this.glTexture.init(this.texture, true);
	this.glDepthTexture		= new Texture();
	this.glDepthTexture.init(this.depthTexture, true);
	this.frameBuffer        = gl.createFramebuffer();		
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
	this.frameBuffer.width  = this.width;
	this.frameBuffer.height = this.height;
	var size                = this.width;



	gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// if(this.magFilter == gl.NEAREST && this.minFilter == gl.NEAREST) 
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);
	// else
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, texType, null);

	gl.generateMipmap(gl.TEXTURE_2D);

	gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	if(this.depthTextureExt != null)gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    if(this.depthTextureExt == null) {
    	console.log( "no depth texture" );
    	var renderbuffer = gl.createRenderbuffer();
    	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
    	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
    } else {
    	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);
    }
    
    

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};



p.bind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
};


p.unbind = function() {
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};


p.getTexture = function() {
	return this.glTexture;
};


p.getDepthTexture = function() {
	return this.glDepthTexture;
};

module.exports = Framebuffer;

},{"./Texture":15}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
//Mesh.js

function Mesh(){};

var p = Mesh.prototype;

var gl = null;

p.init = function(vertexSize, indexSize, drawType){

	gl = window.NS.GL.glContext;

	this.vertexSize = vertexSize;
	this.indexSize = indexSize;
	this.drawType = drawType;
	this.extraAttributes = [];

	this.textureUsed = false;

	this._floatArrayVertex = undefined;
};

p.bufferVertex = function(aryVertices) {
	var vertices = [];

	for(var i=0; i<aryVertices.length; i++) {
		for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
	}

	if(this.vBufferPos == undefined ) this.vBufferPos = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);

	if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
	else {
		if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
		else {
			for(var i=0;i<aryVertices.length; i++) {
				this._floatArrayVertex[i] = aryVertices[i];
			}
		}
	}

	gl.bufferData(gl.ARRAY_BUFFER, this._floatArrayVertex, gl.STATIC_DRAW);
	this.vBufferPos.itemSize = 3;
};


p.bufferTexCoords = function(aryTexCoords) {
	var coords = [];

	this.textureUsed = true;

	for(var i=0; i<aryTexCoords.length; i++) {
		for(var j=0; j<aryTexCoords[i].length; j++) coords.push(aryTexCoords[i][j]);
	}

	this.vBufferUV = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferUV);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
	this.vBufferUV.itemSize = 2;
};


p.bufferData = function(data, name, itemSize, flat) {
	var index = -1
	for(var i=0; i<this.extraAttributes.length; i++) {
		if(this.extraAttributes[i].name == name) {
			this.extraAttributes[i].data = data;
			index = i;
			break;
		}
	}

	var bufferData = [];
	if (flat){
		bufferData = data.slice(0);
	}else{


		
		for(var i=0; i<data.length; i++) {
			
			for(var j=0; j<data[i].length; j++) bufferData.push(data[i][j]);
		}
	}

	if(index == -1) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = new Float32Array(bufferData);
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
		this.extraAttributes.push({name:name, data:data, itemSize:itemSize, buffer:buffer, floatArray:floatArray});
	} else {
		var buffer = this.extraAttributes[index].buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		var floatArray = this.extraAttributes[index].floatArray;
		for(var i=0;i<bufferData.length; i++) {
			floatArray[i] = bufferData[i];
		}
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
	}
	
};


p.bufferIndices = function(aryIndices) {
	this.iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryIndices), gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = aryIndices.length;
};

// var vertexBufferObject = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  


// if (object.perVertexColor){
// 	colorBufferObject = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
// 	object.cbo = colorBufferObject;
// }

// var indexBufferObject = gl.createBuffer();
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);

// object.vbo = vertexBufferObject;
// object.ibo = indexBufferObject;
// object.nbo = normalBufferObject;

// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
// gl.bindBuffer(gl.ARRAY_BUFFER,null);

// p.bufferVertex = function(aryVertices) {
// 	var vertices = [];

// 	// this.vBufferPos = gl.createBuffer();
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);
// 	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryVertices), gl.STATIC_DRAW);

// 	// for(var i=0; i<aryVertices.length; i++) {
// 	// 	for(var j=0; j<aryVertices[i].length; j++) vertices.push(aryVertices[i][j]);
// 	// }

// 	// if(this.vBufferPos == undefined ) this.vBufferPos = gl.createBuffer();
// 	// gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferPos);

// 	// if(this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);
// 	// else {
// 	// 	if(aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);
// 	// 	else {
// 	// 		for(var i=0;i<aryVertices.length; i++) {
// 	// 			this._floatArrayVertex[i] = aryVertices[i];
// 	// 		}
// 	// 	}
// 	// }

// 	// gl.bufferData(gl.ARRAY_BUFFER, this._floatArrayVertex, gl.STATIC_DRAW);
// 	this.vBufferPos.itemSize = 3;
// };


// p.bufferTexCoords = function(aryTexCoords) {
// 	var coords = [];

// 	// for(var i=0; i<aryTexCoords.length; i++) {
// 	// 	for(var j=0; j<aryTexCoords[i].length; j++) coords.push(aryTexCoords[i][j]);
// 	// }

// 	this.vBufferUV = gl.createBuffer();
// 	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBufferUV);
// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aryTexCoords), gl.STATIC_DRAW);
// 	this.vBufferUV.itemSize = 2;
// };


// p.bufferData = function(data, name, itemSize) {
// 	var index = -1
// 	for(var i=0; i<this.extraAttributes.length; i++) {
// 		if(this.extraAttributes[i].name == name) {
// 			this.extraAttributes[i].data = data;
// 			index = i;
// 			break;
// 		}
// 	}

// 	var bufferData = [];
// 	for(var i=0; i<data.length; i++) {
// 		for(var j=0; j<data[i].length; j++) bufferData.push(data[i][j]);
// 	}

// 	if(index == -1) {
// 		var buffer = gl.createBuffer();
// 		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 		var floatArray = new Float32Array(bufferData);
// 		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
// 		this.extraAttributes.push({name:name, data:data, itemSize:itemSize, buffer:buffer, floatArray:floatArray});
// 	} else {
// 		var buffer = this.extraAttributes[index].buffer;
// 		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 		var floatArray = this.extraAttributes[index].floatArray;
// 		for(var i=0;i<bufferData.length; i++) {
// 			floatArray[i] = bufferData[i];
// 		}
// 		gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STATIC_DRAW);	
// 	}
	
// };


// p.bufferIndices = function(aryIndices) {
// 	this.iBuffer = gl.createBuffer();
// 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
// 	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryIndices), gl.STATIC_DRAW);
// 	this.iBuffer.itemSize = 1;
// 	this.iBuffer.numItems = aryIndices.length;

// };


// // var vertexBufferObject = gl.createBuffer();
// // 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
// // 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  
	

// // 	var indexBufferObject = gl.createBuffer();
// // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
// // 	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);


module.exports = Mesh;
},{}],11:[function(require,module,exports){
// Scene.js

var BaseCamera = require('../cameras/BaseCamera');
var FreeCamera = require('../cameras/FreeCamera');

function Scene(){

	this.test = 0;
};

var p = Scene.prototype;

p.init = function(){

	this.objects = [];

	this.canvas = document.getElementById('gl');
	gl = this.canvas.getContext("webgl");

	window.NS.GL.glContext = gl;

	// this.transforms = new window.NS.GL.Framework.SceneTransforms();
	// this.transforms.init(this.canvas);


	

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.clearColor( 0, 0, 0, 1 );
	gl.clearDepth( 1 );
	this.depthTextureExt 	= gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	// this.floatTextureExt 	= gl.getExtension("OES_texture_float") // Or browser-appropriate prefix
	

	this._setCamera();

	

	

	
};

p._setCamera = function(){

	this.camera = new FreeCamera();
	this.camera.init();

	this.leftWallCamera = new FreeCamera();
	this.leftWallCamera.init();


	this.orthoCamera = new BaseCamera();
	this.orthoCamera.init('ortho');


	this.testCamera = new FreeCamera();
	this.testCamera.init();

	// this.camera = new window.NS.GL.Framework.Camera();
	// this.camera.init();

	// this.cameraOtho = new window.NS.GL.Framework.Camera();
	// this.cameraOtho.init('front');

	// this.camera.goHome([0,0,2]);
};

p.getObject = function(alias){

	for(var i=0; i<this.objects.length; i++){
		if (alias == this.objects[i].alias) return this.objects[i];
	}
	return null;
};

p.loadObject = function(filename,alias,attributes){

	var request = new XMLHttpRequest();
	console.info('Requesting ' + filename);
	request.open("GET",filename);

	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			if(request.status == 404) {
				console.info(filename + ' does not exist');
			}
			else {
				var o = JSON.parse(request.responseText);
				o.alias = (alias==null)?'none':alias;
				o.remote = true;
				this.addObject(o,attributes);
			}
		}
	}
	request.send();
};

p.loadObjectByParts = function(path, alias, parts){

	for(var i = 1; i <= parts; i++){
		var partFilename =  path+''+i+'.json';
		var partAlias = alias+''+i;
		this.loadObject(partFilename,partAlias);
	}

};

p.addObject = function(object, attributes){

	 //initialize with defaults
	if (object.perVertexColor   === undefined)    {   object.perVertexColor   = false;            }
    if (object.wireframe        === undefined)    {   object.wireframe        = false;            }
    if (object.diffuse          === undefined)    {   object.diffuse          = [1.0,1.0,1.0,1.0];}
    if (object.ambient          === undefined)    {   object.ambient          = [0.1,0.1,0.1,1.0];}
    if (object.specular         === undefined)    {   object.specular         = [1.0,1.0,1.0,1.0];}
	
	//set attributes
   for(var key in attributes){
		if(object.hasOwnProperty(key)) {object[key] = attributes[key];}
	}   


	var vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
	  
	var normalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(calculateNormals(object.vertices, object.indices)), gl.STATIC_DRAW);

	var colorBufferObject;

	if (object.perVertexColor){
		colorBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
		object.cbo = colorBufferObject;
	}

	var indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);
	
	object.vbo = vertexBufferObject;
	object.ibo = indexBufferObject;
	object.nbo = normalBufferObject;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);

	this.objects.push(object);
	
	if (object.remote){
		console.info(object.alias + ' has been added to the scene [Remote]');
	}
	else {
		console.info(object.alias + ' has been added to the scene [Local]');
	}
};

p.loop = function() {
	this.update();
	this.render();
};


p.update = function() {

	// gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// this.transforms.updatePerspective();
	

	// gl.uniformMatrix4fv(renderProgram.uMVMatrix, false, transforms.getMvMatrix());
	// gl.uniformMatrix4fv(renderProgram.uPMatrix, false, transforms.getProjectionMatrix());
	

	// this.sceneRotation.update();
	// GL.setMatrices(this.camera);
	// GL.rotate(this.sceneRotation.matrix);
};


p.render = function() {
	//OVERWRITE
};


p.onResize = function(){

	var w = window.innerWidth;
	var h = window.innerHeight;

	gl.viewportWidth = w;
	gl.viewportHeight = h;

	// var wrapper = document.getElementById('wrapper');
	// wrapper.style.height = h + 'px';
	// wrapper.style.width = w + 'px';

	this.canvas.width = w;
	this.canvas.height = h;

	this.canvas.style.height = h + 'px';
	this.canvas.style.width = w + 'px';

	

	// this.transforms.updatePerspective();

};

module.exports = Scene;
},{"../cameras/BaseCamera":5,"../cameras/FreeCamera":6}],12:[function(require,module,exports){
//SceneTranforms.js

function SceneTransforms(){};

var p = SceneTransforms.prototype;

SceneTransforms.FIELD_OF_VIEW = 45 * Math.PI/180;

p.init = function(canvas){

	this._stack = [];
	// this._camera = c;
	this._canvas = canvas;
	this._mvMatrix    = mat4.create();    // The Model-View matrix
	// this._pMatrix     = mat4.create();    // The projection matrix
	// this._nMatrix     = mat4.create();    // The normal matrix
	// this.cMatrix     = mat4.create();    // The camera matrix

	mat4.identity(this._mvMatrix);
	// mat4.identity(this._pMatrix);
};

p.setCamera = function(c){

	this._camera = c;
};

p.calculateModelView = function(){

	// this._mvMatrix = this._camera.getViewTransform();
	mat4.multiply(this._mvMatrix,this._mvMatrix, this._camera.getViewMatrix());

	// var m = mat4.create();
	// mat4.invert(m, this._camera.getViewMatrix());

	// this._mvMatrix = m;


	
};

p.calculateNormal = function(){

	mat4.identity(this._nMatrix);
	mat4.copy(this._nMatrix, this._mvMatrix);
	mat4.invert(this._nMatrix, this._nMatrix);
	mat4.transpose(this._nMatrix, this._nMatrix);


};

p.calculatePerspective = function(){

	mat4.identity(this._pMatrix);
	mat4.perspective(SceneTransforms.FIELD_OF_VIEW, this._canvas.width / this._canvas.height, 0.1, 1000, this._pMatrix);
};

p.updatePerspective = function(w, h){

	mat4.perspective(this._pMatrix, SceneTransforms.FIELD_OF_VIEW, w / h, 0.1, 1000);	
};

p.resetPerspective = function(){

	mat4.identity(this._pMatrix);
};


p.setMatrixUniforms = function(){

	this.calculateNormal();
		
};

p.getMvMatrix = function(){

	// var m = mat4.create();
	// mat4.copy(m, this._mvMatrix);

	// return m;
	return this._mvMatrix;	
};

p.getProjectionMatrix = function(){

	// return this._pMatrix;	
	return this._camera.getProjectionMatrix();
};

p.getNormalMatrix = function(){

	return this._nMatrix;	
};

p.pop = function(){

	if(this._stack.length == 0) return;
	this._mvMatrix = this._stack.pop();

};

p.push = function(){

	var memento = mat4.create();
	mat4.copy(memento, this._mvMatrix);
	this._stack.push(memento);

};

module.exports = SceneTransforms;
},{}],13:[function(require,module,exports){
//ShaderProgram.js

function ShaderProgram(){};

var p = ShaderProgram.prototype;

var gl = null;

p.init = function(vertexShader, fragmentShader){

	gl = window.NS.GL.glContext;

	this.idVertex   = 'vertex';
	this.idFragment = 'fragment';
	// this.getShader(this.idVertex, true);
	// this.getShader(this.idFragment, false);
	this.createShaderProgram(vertexShader, true);
	this.createShaderProgram(fragmentShader, false);
	this.parameters = [];
	// this._isReady = truee;

	

};

p.onShadersLoaded = function(){

	this.prg = gl.createProgram();
	gl.attachShader(this.prg, this.vertexShader);
	gl.attachShader(this.prg, this.fragmentShader);
	gl.linkProgram(this.prg);
	this._isReady = true;	
};

p.getShader = function(id, isVertexShader) {
	var req = new XMLHttpRequest();
	req.hasCompleted = false;
	var self = this;
	req.onreadystatechange = function(e) {
		if(e.target.readyState == 4) self.createShaderProgram(e.target.responseText, isVertexShader)
	};
	req.open("GET", id, true);
	req.send(null);
}


p.createShaderProgram = function(str, isVertexShader) {
	var shader = isVertexShader ? gl.createShader(gl.VERTEX_SHADER) : gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }


    if(isVertexShader) this.vertexShader = shader;
    else this.fragmentShader = shader;

    if(this.vertexShader!=undefined && this.fragmentShader!=undefined) this.onShadersLoaded();
};


p.bind = function() {
	gl.useProgram(this.prg);

	if (!this.prg) debugger;

	if(this.prg.pMatrixUniform == undefined) this.prg.pMatrixUniform = gl.getUniformLocation(this.prg, "uPMatrix");
	if(this.prg.mvMatrixUniform == undefined) this.prg.mvMatrixUniform = gl.getUniformLocation(this.prg, "uMVMatrix");

	// Global.
	// GL.shader 			= this;
	// GL.shader 	= this;

	this.uniformTextures = [];
};


p.uniform = function(name, type, value) {
	if(type == "texture") type = "uniform1i";
	
	var hasUniform = false;
	var oUniform;
	for(var i=0; i<this.parameters.length; i++) {
		oUniform = this.parameters[i];
		if(oUniform.name == name) {
			oUniform.value = value;
			hasUniform = true;
			break;
		}
	}

	if(!hasUniform) {
		this.prg[name] = gl.getUniformLocation(this.prg, name);
		this.parameters.push( {name:name, type:type, value:value, uniformLoc:this.prg[name]} );
	} else {
		this.prg[name] = oUniform.uniformLoc;
	}


	if(type.indexOf("Matrix") == -1) {
		gl[type](this.prg[name], value);
	} else {
		gl[type](this.prg[name], false, value);
	}

	if(type == "uniform1i") {	//	TEXTURE
		this.uniformTextures[value] = this.prg[name];
		// if(name == "textureForce") console.log( "Texture Force : ",  this.uniformTextures[value], value );
	}
}



p.unbind = function() {
	
};

p.isReady = function() {	return this._isReady;	};

module.exports = ShaderProgram;
},{}],14:[function(require,module,exports){
//SpectrumAnalyzer.js


function SpectrumAnalyzer(){

	this.node = null;
	this._parentEl = null;
	this._canvasObj = {};
	this._audioCtx = null;
	this._processArray = [];

	this._subbands = [];
	
	
	
	this.colorTheme = [];

	this._currMaxVal = 20;

	this._audioDataOut = [];
	this.subbandWidthTable = [2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12];
	this._currentSubbandTotWidth = 0;

	// console.log(this._subbandsHistory);

};

var p = SpectrumAnalyzer.prototype;

SpectrumAnalyzer.SUBBANDS = 64;
SpectrumAnalyzer.HISTORY_SIZE = 43;

p.init = function(ctx){

	this.node = ctx.createAnalyser();
	this.node.fftSize = 2048;
	this.node.maxDecibels = -30;
	this.node.minDecibels = -100;
	this._audioCtx = ctx;
	// this._parentEl = parent;
	// this._canvasObj = this.createCanvasObj();
	this._processArray = new Uint8Array(this.node.frequencyBinCount);


	for (var i=0; i<SpectrumAnalyzer.SUBBANDS;i++){
		var historyArr = [];
		for (var k=0;k<SpectrumAnalyzer.HISTORY_SIZE;k++){
			var val = 0;
			historyArr.push(val);
		}

		var obj = {
			current:{
				sum: 0
			},
			history:{
				arr : historyArr,
				sum : 0 
			},
			idx:i
		};
		this._subbands.push(obj);

	}




	this._scriptNode = this._audioCtx.createScriptProcessor(this.node.frequencyBinCount,2,1);
	// debugger;
	this._scriptNode.addEventListener('audioprocess', this._onAudioProcess.bind(this));

};

p.createCanvasObj = function(){

	var canvas = document.createElement('canvas');
	canvas.className = "waveformAnalyser";
	canvas.height = this._parentEl.clientHeight;
	canvas.width = this._parentEl.clientWidth;
	this._parentEl.appendChild(canvas);
	var context = canvas.getContext("2d");

	return {el: canvas, ctx: context};

};

p._onAudioProcess = function(e){

	// debugger;

	this.update();
	
	// this.render();
	this._audioDataOut = this.createAudioData();
};

p.getAudioData = function(){

	// return this._audioDataOut.slice(0);

	
	var audioData = [];
	if (this._audioDataOut.length > 8){
		var subbands = [1, 2, 4, 6, 8, 20, 30, 40, 50, 60];
	
		
		for (var i=0;i<subbands.length;i++){
			audioData[i] = this._audioDataOut[0][subbands[i]];
		}

		// console.log(audioData);
	}

	return audioData.slice(0);
};

p.connect = function(node){

	node.connect(this.node);
	node.connect(this._scriptNode);

	this._scriptNode.connect(this._audioCtx.destination);

};

p.disconnect = function(node){

	node.disconnect(this.node);
	node.disconnect(this._scriptNode);

	this._scriptNode.disconnect(this._audioCtx.destination);
};

p.update = function(){

	// this.node.getFloatFrequencyData(this._processArray);
	this.node.getByteFrequencyData(this._processArray);

	// console.log(this._processArray);
	
};

p.createAudioData = function(){

	// var ret = new Float32Array(SpectrumAnalyzer.SUBBANDS*3);
	var ret = [];

	this.calcSubbandEnergy();
	this.calcSubbandHistoryAverage();
	this.shiftHistory();

	var subbandRangeAverageSum = 0;
	var subbandRangeCurrentSum = 0;


	
	var currentRow = new Float32Array(SpectrumAnalyzer.SUBBANDS);
	for (var i=0;i<this._subbands.length;i++){
		
		var currentSum = this._subbands[i].current.sum;
		var averageSum = this._subbands[i].history.sum;

		// ret[i] = {};
		// ret[i].current = currentSum;
		currentRow[i] = currentSum;
		


	}

	ret.push(currentRow);

	// var historyRows = [];
	for (var i=0;i<11;i++){
		var historySubband = new Float32Array(SpectrumAnalyzer.SUBBANDS);
		for (var x=0;x<this._subbands.length;x++){
			historySubband[x] = this._subbands[x].history.arr[i]
		}
		ret.push(historySubband)
		// historyRows[i] = historySubband;
	}




	return ret;
	// debugger;
	// window.onAudioData(ret);
};

p.getFreqFromFFTIdx = function(idx){

	var ret = false;

	if (idx < 512){
		ret = idx * this._audioCtx.sampleRate / this.node.frequencyBinCount;
	}

	return ret;
};

p.render = function(){

	var ctx = this._canvasObj.ctx;
	var canvas = this._canvasObj.el;

	this.calcSubbandEnergy();
	this.calcSubbandHistoryAverage();
	this.shiftHistory();

	var subbandWidth = canvas.width / this._subbands.length;

	ctx.clearRect(0,0,canvas.width, canvas.height);
	
	var subbandRangeAverageSum = 0;
	var subbandRangeCurrentSum = 0;

	var wHeight = window.innerHeight * 2;

	for (var i=0;i<this._subbands.length;i++){
		
		var currentSum = this._subbands[i].current.sum;
		var averageSum = this._subbands[i].history.sum;

		if (currentSum > this._currMaxVal)
			this._currMaxVal = currentSum;

		var relHeightCurrent = currentSum / this._currMaxVal;
		relHeightCurrent = relHeightCurrent * wHeight;

		var relHeightAverage = averageSum / this._currMaxVal;
		relHeightAverage = relHeightAverage * wHeight;

		ctx.font = '10px Arial';
		ctx.fillStyle = this.colorTheme[1];
		ctx.fillText(i+1,subbandWidth*i+subbandWidth/4, 20);

		ctx.fillStyle = this.colorTheme[2];
		ctx.fillRect(subbandWidth*i, canvas.height, subbandWidth, -relHeightCurrent);

		ctx.fillStyle = this.colorTheme[3];
		ctx.fillRect(subbandWidth*i, canvas.height, subbandWidth, -relHeightAverage);

	}

};



p.calcSubbandEnergy = function(){


	this._currentSubbandTotWidth = 0;



	for (var i=0;i<this._subbands.length;i++){

		var subbandSize = this.subbandWidthTable[i];

		var obj = this._subbands[i].current;
		obj.sum = 0;
		obj.width = subbandSize;

	
		var range = this._currentSubbandTotWidth;
		
		
		for (var k=range;k<range+subbandSize;k++){
			obj.sum += this._processArray[k];
			// console.log(k);
			
		}
		var startFreq = this.getFreqFromFFTIdx(range);
		var endFreq = this.getFreqFromFFTIdx(range+subbandSize);



		obj.sum *= subbandSize/(this.node.fftSize/2);
	
		this._currentSubbandTotWidth += obj.width;

	}
};

p.calcSubbandHistoryAverage = function(){

	for (var i=0;i<this._subbands.length;i++){

		var subbandHistory = this._subbands[i].history.arr;
		var subbandHistorySum = this._subbands[i].history.sum;
	
		for (var k=0;k<subbandHistory.length-1;k++){
			subbandHistorySum += subbandHistory[k];
			
		}
		subbandHistorySum *= 1/subbandHistory.length;

		this._subbands[i].history.sum = subbandHistorySum;

		

	}

};


p.shiftHistory = function(){


	var subbandTempArr = this._subbands.slice();

	for (var i=0;i<this._subbands.length;i++){
	
		var historyArr = this._subbands[i].history.arr;
		historyArr.unshift(subbandTempArr[i].current.sum);
		if (historyArr.length > SpectrumAnalyzer.HISTORY_SIZE)
			historyArr.pop();

		
	}
	

};

module.exports = SpectrumAnalyzer;
},{}],15:[function(require,module,exports){
//Texture.js

function Texture(){};

var gl;

var p = Texture.prototype;

p.init = function(source, isTexture){

	gl = window.NS.GL.glContext;

	if (isTexture == undefined)
		isTexture = isTexture == undefined ? false : true;
	// gl = GL.gl;
	if(isTexture) {
		this.texture = source;
	} else {
		this.texture = gl.createTexture();
		this._isVideo = (source.tagName == "VIDEO");


		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

		if(!this._isVideo) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}

};

p.updateTexture = function(source) {


	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, texType, null);

	if(!this._isVideo) {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}

	gl.bindTexture(gl.TEXTURE_2D, null);
};


p.bind = function(shader, index, toDebug) {
	if(index == undefined) index = 0;

	gl.activeTexture(gl.TEXTURE0 + index);
	// console.log( gl.TEXTURE0 + i, this._textures[i].texture );
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	// gl.uniform1i(shaderProgram["samplerUniform"+i], i);
	// if(toDebug) console.log( GL.shader.uniformTextures[index], this );
	gl.uniform1i(shader.uniformTextures[index], index);
	this._bindIndex = index;
};


p.unbind = function() {
	gl.bindTexture(gl.TEXTURE_2D, null);
};

	
module.exports = Texture;
},{}],16:[function(require,module,exports){
//View.js

var ShaderProgram = require('./ShaderProgram');

function View(){};

var p = View.prototype;

var gl = null;

p.init = function(strVert, strFrag){

	gl = window.NS.GL.glContext;

	this.transforms = null;

	this._enabledVertexAttrib = [];

	if(strVert == undefined) return;
	this.shader = new ShaderProgram();
	this.shader.init(strVert, strFrag);

	
};

p.draw = function(mesh){

	// this.transforms.calculateModelView();

	gl.uniformMatrix4fv(this.shader.prg.pMatrixUniform, false, this.transforms.getProjectionMatrix());
	gl.uniformMatrix4fv(this.shader.prg.mvMatrixUniform, false, this.transforms.getMvMatrix());
	

	// 	VERTEX POSITIONS
	gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vBufferPos);
	var vertexPositionAttribute = getAttribLoc(gl, this.shader.prg, "aVertexPosition");
	gl.vertexAttribPointer(vertexPositionAttribute, mesh.vBufferPos.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
	if(this._enabledVertexAttrib.indexOf(vertexPositionAttribute) == -1) {
		gl.enableVertexAttribArray(vertexPositionAttribute);
		this._enabledVertexAttrib.push(vertexPositionAttribute);
	}

	

	if (mesh.textureUsed){
		//		TEXTURE COORDS
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vBufferUV);
		var textureCoordAttribute = getAttribLoc(gl, this.shader.prg, "aTextureCoord");
		gl.vertexAttribPointer(textureCoordAttribute, mesh.vBufferUV.itemSize, gl.FLOAT, gl.FALSE, 0, 0);
		// gl.enableVertexAttribArray(textureCoordAttribute);
		if(this._enabledVertexAttrib.indexOf(textureCoordAttribute) == -1) {
			gl.enableVertexAttribArray(textureCoordAttribute);
			this._enabledVertexAttrib.push(textureCoordAttribute);
		}
	}
	

	//	INDICES
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.iBuffer);

	//	EXTRA ATTRIBUTES
	for(var i=0; i<mesh.extraAttributes.length; i++) {
		gl.bindBuffer(gl.ARRAY_BUFFER, mesh.extraAttributes[i].buffer);
		var attrPosition = getAttribLoc(gl, this.shader.prg, mesh.extraAttributes[i].name);
		gl.vertexAttribPointer(attrPosition, mesh.extraAttributes[i].itemSize, gl.FLOAT, gl.FALSE, 0, 0);
		gl.enableVertexAttribArray(attrPosition);		

		if(this._enabledVertexAttrib.indexOf(attrPosition) == -1) {
			gl.enableVertexAttribArray(attrPosition);
			this._enabledVertexAttrib.push(attrPosition);
		}
	}

	//	DRAWING
	// gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	if(mesh.drawType == gl.POINTS ) {
		gl.drawArrays(mesh.drawType, 0, mesh.vertexSize);	
	} else{
		gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	} 


	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	

	function getAttribLoc(gl, shaderProgram, name) {
		if(shaderProgram.cacheAttribLoc  == undefined) shaderProgram.cacheAttribLoc = {};
		if(shaderProgram.cacheAttribLoc[name] == undefined) {
			shaderProgram.cacheAttribLoc[name] = gl.getAttribLocation(shaderProgram, name);
		}

		return shaderProgram.cacheAttribLoc[name];
	}
};

module.exports = View;
},{"./ShaderProgram":13}],17:[function(require,module,exports){
//KeyboardInteractor.js

function KeyboardInteractor(){};

var p = KeyboardInteractor.prototype;

p.init = function(camera, canvas){

    this.cam = camera;
    this.canvas = canvas;
};

p.setup = function(){

    var self=this;
    document.onkeydown = function(event) {

        self.handleKeys(event);
    }
};

p.handleKeys = function(event){



    if(event.shiftKey) {
        switch(event.keyCode) {//determine the key pressed
            case 65://a key
                this.cam.roll(-Math.PI * 0.025);//tilt to the left
                break;
            case 37://left arrow
                this.cam.yaw(Math.PI * 0.025);//rotate to the left
                break;
            case 68://d key
                this.cam.roll(Math.PI * 0.025);//tilt to the right
                break;
            case 39://right arrow
                this.cam.yaw(-Math.PI * 0.025);//rotate to the right
                break;
            case 83://s key
            case 40://down arrow
                this.cam.pitch(Math.PI * 0.025);//look down
                break;
            case 87://w key
            case 38://up arrow
                this.cam.pitch(-Math.PI * 0.025);//look up
                break;
        }
    }
    else {
        var pos = this.cam.getPosition();
        
        switch(event.keyCode) {//deterime the key pressed
            case 65://a key
                this.cam.yaw(Math.PI * 0.025);//rotate to the left
                break;
            // case 37://left arrow
            //     this.cam.setPosition([pos[0]-.3,pos[1],pos[2]]);//move - along the X axis
            //     break;
            case 68://d key
                this.cam.yaw(-Math.PI * 0.025);//rotate to the left
                break;
            // case 39://right arrow
            //     this.cam.setPosition([pos[0]+.3,pos[1],pos[2]]);//more + along the X axis
            //     break;
            // case 83://s key
            //     this.cam.setPosition([pos[0],pos[1]-.3,pos[2]]);//move - along the Y axis (down)
            //     break;
            case 40://down arrow
            case 83:
                this.cam.moveForward(.3);//move + on the Z axis
                break;
            // case 87://w key
            //     this.cam.setPosition([pos[0],pos[1]+.3,pos[2]]);//move + on the Y axis (up)
            //     break;
            case 38://up arrow
            case 87:
                this.cam.moveForward(-.3);//move - on the Z axis
                break;
        }

        
    }
};

    //this.cam.setPosition([pos[0],pos[1],pos[2]-.3]);//move - on the Z axis

module.exports = KeyboardInteractor;
},{}],18:[function(require,module,exports){
//MouseInteractor.js

function MouseInteractor(){};

var p = MouseInteractor.prototype;

p.init = function(camera, canvas){

    this.camera = camera;
    this.canvas = canvas;

    this.dragging = false;
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;
    this.lastX = 0;
    this.lastY = 0;
    this.button = 0;
    this.shift = false;
    this.key = 0;

    this.SENSITIVITY = 0.7;
};

p.setup = function(){

    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
};

p._onMouseDown = function(e){

    this.dragging = true;
    this.x = e.clientX;
    this.y = e.clientY;
    this.button = e.button;

};

p._onMouseUp = function(e){
    this.dragging = false;

};

p._onMouseMove = function(e){

    this.lastX = this.x;
    this.lastY = this.y;
    this.x = e.clientX;
    this.y = e.clientY;

    if (!this.dragging) return;
    // this.shift = e.shiftKey;



    // if (this.button == 0) {
        // if(this.shift){
    var dx=this.mousePosX(this.x) -this.mousePosX(this.lastX)
    var dy=this.mousePosY(this.y) -this.mousePosY(this.lastY)

    this.rotate(dx,dy);
        // }
        // else{
        //     var dy = this.y - this.lastY;
        //     this.translate(dy);
        // }
    // }

};

p.mousePosX = function(x){

    return 2 * (x / this.canvas.width) - 1;

};

p.mousePosY = function(y){

    return 2 * (y / this.canvas.height) - 1;

};

p.rotate = function(dx, dy){

    var camera = this.camera;
    camera.yaw(this.SENSITIVITY*dx);
    camera.pitch(this.SENSITIVITY*dy);
};

module.exports = MouseInteractor;

},{}],19:[function(require,module,exports){
//AudioPlayer.js

function AudioPlayer(){};

var p = AudioPlayer.prototype;

p.init = function(ctx, onBufferLoadedCallback, callbackScope){

	this._ctx = ctx;
	this._buffer = null;
	this._sourceNode = null;
	this.paused = false;
	this.pausedTimestamp = undefined;
	this.startedTimestamp = undefined;
	this.triggeredPlay = false;

	this.isLoaded = false;

	this._onBufferLoadedCallback = onBufferLoadedCallback;
	this._callbackScope = callbackScope;

	

};

p.load = function(url){

	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	var self = this;
	request.onload = function() {
	    self._ctx.decodeAudioData(request.response, self.onBufferLoaded.bind(self), self.onBufferError.bind(self));
	};
	request.send();

};

p.onBufferLoaded = function(buffer){


	// var leftPCM = buffer.getChannelData(0);
	// var rightPCM = buffer.getChannelData(1);

	// console.log(leftPCM.length);
	// debugger;

	// var firstHalf = leftPCM.slice(0, 1000000);

	// var str = firstHalf.join('%20');
	// var params = "array=" + str;
	// var http = new XMLHttpRequest();
	// http.open("POST", "save.php", true);

	// //Send the proper header information along with the request
	// http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// // http.setRequestHeader("Content-length", params.length);
	// // http.setRequestHeader("Connection", "close");

	// http.onreadystatechange = function() {
	//     if(http.readyState == 4 && http.status == 200) {
	//         // Do something on success?
	//         debugger;
	//     }
	// }
	// http.send(params);
	// // console.table(leftPCM)
	// debugger;
	// // console.log(buffer);

	this._buffer = buffer;
	this.isLoaded = true;
	this._onBufferLoadedCallback.call(this._callbackScope);
	
};

p.onBufferError = function(){


};

p.pause = function(){

	this._sourceNode.stop(0);
	this.pausedTimestamp = Date.now() - this.startedTimestamp;
	this.paused = true;

};

p.reset = function(){

	this.pausedTimestamp = undefined;

};

p.getSourceNode = function(){

	return this._sourceNode;
};

p.play = function(wait){

	this.triggeredPlay = true;

	this._sourceNode = this._ctx.createBufferSource();
	this._sourceNode.connect(this._ctx.destination);
	this._sourceNode.buffer = this._buffer;
	this.paused = false;

	if (this.pausedTimestamp !== undefined){
		this.startedTimestamp = Date.now() - this.pausedTimestamp;
		this._sourceNode.start(0, this.pausedTimestamp / 1000);
	}else{

		if (wait){
			var self = this;
			setTimeout(function(){
				self.startedTimestamp = Date.now();
				self._sourceNode.start(0);

			},wait);
		}else{
			this.startedTimestamp = Date.now();
			this._sourceNode.start(0);
		}
		
	}

};

module.exports = AudioPlayer;
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
//ViewBackground.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewBackground(){};

var p = ViewBackground.prototype = new View();
var s = View.prototype;

var gl = null;

var random = function(min, max) { return min + Math.random() * (max - min); }

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	this.angle = 0;
	this.angleVert = 0;

	var positions = [];
	var coords = [];
	var indices = [0, 1, 2, 0, 2, 3];

	var size = 1;
	positions.push([-size, -size, 0]);
	positions.push([ size, -size, 0]);
	positions.push([ size,  size, 0]);
	positions.push([-size,  size, 0]);

	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);
	coords.push([0, 0]);

	this.mesh = new Mesh();
	this.mesh.init(4, 6, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);


};

p.render = function(permTexture, simplexTexture, floorTexture, faderVal){

	this.shader.bind();

	this.shader.uniform("angle", "uniform1f",this.angle+=.001);
	this.shader.uniform("angleVert", "uniform1f", this.angleVert+=.01);
	// this.shader.uniform("uSampler0", "uniform1i", 0);
	 // this.shader.uniform("textureParticle", "uniform1i", 1);
	this.shader.uniform("permTexture", "uniform1i", 0);
	this.shader.uniform("simplexTexture", "uniform1i", 1);
	this.shader.uniform("floorTexture", "uniform1i", 2);
	this.shader.uniform("faderVal","uniform1f", faderVal);
	// texturePos.bind(this.shader, 0);
	// texture.bind(this.shader, 0);

	permTexture.bind(this.shader, 0);
	simplexTexture.bind(this.shader, 1);
	floorTexture.bind(this.shader, 2);

	this.draw(this.mesh);

};

module.exports = ViewBackground;
},{"../framework/Mesh":10,"../framework/View":16}],24:[function(require,module,exports){
//ViewFloor.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewFloor(){};

var p = ViewFloor.prototype = new View();
var s = View.prototype;

var gl = null;


p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [];
	
	var width = window.NS.GL.params.width;
	var height = window.NS.GL.params.height;
	var depth = window.NS.GL.params.depth;

	


	// //ROOF
	// positions.push([-width, height, -depth]);
	// positions.push([width, height, -depth]);
	// positions.push([width, height, depth]);

	// positions.push([-width, height, depth]);

	// coords.push([0, 0]);
	// coords.push([0, 1]);
	// coords.push([1, 1]);
	// coords.push([1, 0]);

	
	// indices.push(0,1,2,3,0,2);


	//FLOOR
	positions.push([-width, 0, -depth]);
	positions.push([width, 0, -depth]);
	positions.push([width, 0, depth]);

	positions.push([-width, 0, depth]);

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);
	
	

	indices.push(0,1,2,3,0,2);

	

	

	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

};

p.render = function(videoTexture, floorTexture, audioData, fboSize) {

	this.transforms.push();

	this.shader.bind();
	// console.log('floor');
	if (audioData.length > 8){
		this.shader.uniform("audioLevelDeep", "uniform1f", audioData[3]);
		this.shader.uniform("audioLevelHigh", "uniform1f", audioData[8]);

	}

	this.shader.uniform("videoTexture", "uniform1i", 0);
	this.shader.uniform("concreteTexture", "uniform1i", 1);

	this.shader.uniform("fboW", "uniform1f", fboSize.w);
	this.shader.uniform("fboH", "uniform1f", fboSize.h);

	this.shader.uniform("winW", "uniform1f", window.innerWidth);
	this.shader.uniform("winH", "uniform1f", window.innerHeight);
	
	videoTexture.bind(this.shader, 0);
	floorTexture.bind(this.shader, 1);
	
	this.draw(this.mesh);
	
	this.transforms.pop();
};

module.exports = ViewFloor;
},{"../framework/Mesh":10,"../framework/View":16}],25:[function(require,module,exports){
//ViewImport.js

var View = require('../framework/View');
var MeshPlain = require('../MeshPlain');

function ViewImport(){};

var p = ViewImport.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	this.subViews = [];
	this.hasSubViews = false;
	
	this.currentAnimationProp = null;
	this.currentAnimationVal = undefined;
	this.isAnimating = false;

	this.mesh = null;

	this.test = 0;

	this.currentTranslate = -20;

};

p.createMesh = function(data){

	var mesh = data.meshData;
	this.material = data.materialData;

	var coords = [];
	var verts = [];
	var faces = [];
	var max = {x:0, y:0};
	var min = {x:0, y:0};



	var colors = [];
	for (var i=0;i<mesh.vertices.length;i+= 3){
		if (i < 2000){
			colors.push(.5);
			colors.push(.1);
			colors.push(.8);
		}else if (i >= 2000 && i < 5500){
			colors.push(.1);
			colors.push(.9);
			colors.push(.8);
		}else{
			colors.push(1.0);
			colors.push(.3);
			colors.push(.7);
		}

	}

	// debugger;


	this.mesh = new MeshPlain();
	this.mesh.init(mesh.vertices.length/3, mesh.triangles.length, gl.TRIANGLES);
	this.mesh.bufferVertex(mesh.vertices);
	this.mesh.bufferTexCoords(mesh.coords);
	this.mesh.bufferIndices(mesh.triangles);
	this.mesh.bufferData(mesh.normals, "aVertexNormal", 3);
	this.mesh.bufferData(new Float32Array(colors), "aVertexColor", 3);


};

p.addSubViews = function(views){

	this.subViews = views.slice(0);
	this.hasSubViews = true;

	this._matrix = mat4.create();
};

p.resetAnimation = function(){

	this.currentAnimationProp = null;
	this.currentAnimationVal = undefined;

	for(var i=0;i<this.subViews.length;i++){
		this.subViews[i].currentAnimationVal = undefined;
		this.subViews[i].currentAnimationProp = null;
	}

};



p.render = function(videoTexture, audioData, shader, isChild) {

	if (isChild)
		this.shader = shader;

	this.transforms.push();
	

	// var nMatrix = mat4.create();
	var mvMatrix = this.transforms.getMvMatrix();


	if (!isChild){
		mat4.translate(mvMatrix, mvMatrix, [-40, this.currentTranslate, -20]);
		
	}
	// if (isChild){
	// 	// mat4.multiply(mvMatrix, mvMatrix, parentMatrix);
	// 	// mat4.scale(mvMatrix, mvMatrix, [0.08, 0.08, 0.08]);
	// 	// this.test+=0.1;
	// 	// mat4.rotate(mvMatrix, mvMatrix, this.test * Math.PI/180, [0,1,0]);
	// }

	if (this.currentAnimationVal){
		
		if (this.currentAnimationProp == 'rotateZ')
			mat4.rotate(mvMatrix, mvMatrix, this.currentAnimationVal *Math.PI/180, [0, 0, 1]);
		else if (this.currentAnimationProp == 'rotateX')
			mat4.rotate(mvMatrix, mvMatrix, this.currentAnimationVal *Math.PI/180, [1, 0, 0]);
	}

	if (this.hasSubViews){
		
		mat4.scale(mvMatrix, mvMatrix, [0.08, 0.08, 0.08]);
		// mat4.translate(mvMatrix, mvMatrix, [0, 15, 0]);

		// mat4.copy(this._matrix, mvMatrix);
		
		for (var i=0;i<this.subViews.length;i++){
			this.subViews[i].render(videoTexture, audioData, this.shader, true);
		}
		this.transforms.pop();
		return;
	}

	// if (!shader && !this.hasSubViews){
	// 	mat4.translate(mvMatrix, mvMatrix, [0,10, 0]);
	// 	mat4.scale(mvMatrix, mvMatrix, [0.05, 0.05, 0.05]);

	// }
	
	// mat4.copy(nMatrix, mvMatrix);
 //    mat4.invert(nMatrix, nMatrix);
 //    mat4.transpose(nMatrix, nMatrix);


    this.shader.bind();

    if (audioData.length > 8){
		this.shader.uniform("audioLevelDeep", "uniform1f", audioData[3]);
		this.shader.uniform("audioLevelHigh", "uniform1f", audioData[8]);

	}

	// this.shader.uniform("uNMatrix", "uniformMatrix4fv", nMatrix);
	// this.shader.uniform("diffuse", "uniform3fv", this.diffuse);
	this.shader.uniform("videoTexture", "uniform1i", 0);
	

	this.shader.uniform("uLightPosition", "uniform3fv", new Float32Array([0.0, 20.0, 20.0]) );
	this.shader.uniform("uLightAmbient", "uniform4fv", new Float32Array([1.0, 1.0, 1.0, 1.0]) );
	this.shader.uniform("uLightDiffuse", "uniform4fv", new Float32Array([1.0, 1.0, 1.0, 1.0]) );
	this.shader.uniform("uLightSpecular", "uniform4fv", new Float32Array([1.0, 1.0, 1.0, 1.0]) );

	this.shader.uniform("uMaterialAmbient", "uniform4fv", new Float32Array([0.1, 0.1, 0.1, 1.0]));
	if (this.material.diffuse)
		this.shader.uniform("uMaterialDiffuse", "uniform3fv", this.material.diffuse);
	this.shader.uniform("uMaterialSpecular", "uniform3fv", this.material.specular);
	this.shader.uniform("uShininess", "uniform1f", this.material.shininess);
	
	videoTexture.bind(this.shader, 0);

	this.draw(this.mesh);

	this.transforms.pop();
};

module.exports = ViewImport;
},{"../MeshPlain":2,"../framework/View":16}],26:[function(require,module,exports){
//ViewLeftWall.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');	

function ViewLeftWall(){};

var p = ViewLeftWall.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	//dat gui props
	this.colorNoiseMultiplier = 10;
	this.noiseBaseColor = [200,
      19.999999999999996,
      62.35294117647059];
	this.audioLevelNoiseDivider = 26.377211683002106;
	this.vertexMultiplier = 0.3702049918442206;
	this.usePulse = false;

	var positions = [];
	var coords = [];
	var indices = [];

	var width = window.NS.GL.params.width;
	var height = window.NS.GL.params.height;
	var depth = window.NS.GL.params.depth;


	


	
	

	//LEFT SIDEWALL
	positions.push([-width, 0, -depth]);
	positions.push([-width, 0, depth]);
	positions.push([-width, height, depth]);

	positions.push([-width, height, -depth]);
	// positions.push([-width, height, -depth]);
	// positions.push([-width, 0, depth]);

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);
	// coords.push([1, 1]);
	// coords.push([0, 0]);




	indices.push(0, 1, 2, 3, 0, 2);
	// indices.push(0,1,2,3,4,5);

	

	

	
	// debugger;

	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);



};





p.render = function(videoTexture, audioDataIn, permTexture, simplexTexture) {

	this.transforms.push();
	
	var mvMatrix = this.transforms.getMvMatrix();

	
	this.shader.bind();

	if (audioDataIn.length > 8){
		this.shader.uniform("audioLevelDeep", "uniform1f", audioDataIn[3]);
		this.shader.uniform("audioLevelHigh", "uniform1f", audioDataIn[8]);

	}

	this.shader.uniform("simplexTexture", "uniform1i", 0);
	this.shader.uniform("permTexture", "uniform1i", 1);
	this.shader.uniform("videoTexture", "uniform1i", 2);

	// dat gui props
	this.shader.uniform("colorNoiseMultiplier", "uniform1f", this.colorNoiseMultiplier);
	this.shader.uniform("noiseBaseColor", "uniform3fv", new Float32Array(this.noiseBaseColor));
	this.shader.uniform("audioLevelNoiseDivider", "uniform1f", this.audioLevelNoiseDivider);
	this.shader.uniform("vertexMultiplier", "uniform1f", this.vertexMultiplier);
	this.shader.uniform("usePulse", "uniform1i", this.usePulse ? 1 : 0);

	simplexTexture.bind(this.shader, 0);
	permTexture.bind(this.shader, 1);
	videoTexture.bind(this.shader, 2);

	this.draw(this.mesh);

	
	this.transforms.pop();
};



module.exports = ViewLeftWall;
},{"../framework/Mesh":10,"../framework/View":16}],27:[function(require,module,exports){
//ViewPlain.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewPlain(){};

var p = ViewPlain.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [0, 1, 2, 0, 2, 3];

	var size = 1;
	positions.push([-size, -size, 0]);
	positions.push([ size, -size, 0]);
	positions.push([ size,  size, 0]);
	positions.push([-size,  size, 0]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	this.mesh = new Mesh();
	this.mesh.init(4, 6, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

};



p.render = function(texture, fboSize) {

	// this.transforms.calculateModelView();

	// var mvMatrix = this.transforms.getMvMatrix();

	// mat4.rotate(mvMatrix, -.4*Math.PI, [1, 0, 0]);
    // mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    // mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
	// return;
	this.shader.bind();
	this.shader.uniform("uSampler0", "uniform1i", 0);

	this.shader.uniform("fboW", "uniform1f", fboSize.w);
	this.shader.uniform("fboH", "uniform1f", fboSize.h);

	this.shader.uniform("winW", "uniform1f", window.innerWidth);
	this.shader.uniform("winH", "uniform1f", window.innerHeight);
	 // this.shader.uniform("textureParticle", "uniform1i", 1);
	// texturePos.bind(this.shader, 0);
	texture.bind(this.shader, 0);
	this.draw(this.mesh);
};

module.exports = ViewPlain;
},{"../framework/Mesh":10,"../framework/View":16}],28:[function(require,module,exports){
//ViewPrism.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewPrism(){};

var p = ViewPrism.prototype = new View();
var s = View.prototype;

var gl = null;

var random = function(min, max) { return min + Math.random() * (max - min); }

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);


	this.material = null;
	this.mesh = null;

	this.angle = 0;

	this.midpoints = [];

};



p.calcAdjLevel = function(points){

	var midSize = 200;
	var foundPoints = [];
	var pointsToUse = [];
	var adjLevel = [];
	var adjLevelRef = [];
	var aUseInverse = [];
	var aUseInverseRef = [];
	for (var i=0;i<points.length;i++){
		if (points[i][1] > -midSize && points[i][1] < midSize){

			if (points[i][2] > -midSize && points[i][2] < midSize){

				// console.log(points[i]);
				// foundPoints.push(points[i]);
				var equals = this.checkForEquals(points[i], points, i);
				if (equals.found){
				// if (this.checkForEquals(points[i], points, i)){
					// console.log(points[i][1]);
				//	debugger;
					if (adjLevelRef[equals.idx]){
						adjLevel.push(adjLevelRef[equals.idx]);
						aUseInverse.push(aUseInverseRef[equals.idx]);
					}else{
						var randomNr = random(4, 10)
						adjLevel.push([randomNr, randomNr, randomNr]);
						adjLevelRef[i] = adjLevel[adjLevel.length-1];
						if (randomNr < 7)
							aUseInverse.push([2]);
						else
							aUseInverse.push([1]);
						aUseInverseRef[i] = aUseInverse[aUseInverse.length-1];
						
					}
					
					
				}else{
					adjLevel.push([0,0,0]);
					aUseInverse.push([0]);
				}
			}

		}else{
			adjLevel.push([0,0,0]);
			aUseInverse.push([0]);
		}
		
	}

	return {a: adjLevel, u: aUseInverse};
};

p.checkForEquals = function(point, points, pointIdx){

	var ret = {found: false, idx: undefined};
	for (var i=0;i<points.length;i++){

		if (point[0] == points[i][0] && point[1] == points[i][1] && point[2] == points[i][2]){

			if (pointIdx > i || pointIdx < i){
				ret.found = true;
				ret.idx = i;
				// console.log(pointIdx);
				return ret;
			}
			
		}
	}

	return ret;
};

p.createMesh = function(data){

	// debugger;

	var positions = [];
	var indices = [];
	var coords = [];
	var aAdjIndex = [];
	var iC = 0;
	for (var i=0;i<data.length;i++){

		var ind = data[i].meshData.triangles;
		for (var q=0;q<ind.length;q++){

			// ind[q] += iC;
			indices.push(ind[q] += iC);
		}

		// iC += ind.length;

		var meshPos = data[i].meshData.vertices;
		var tempPos = [];
		for (var q=0;q<meshPos.length;q+=3){

			var x = meshPos[q];
			var y = meshPos[q+1];
			var z = meshPos[q+2];

			positions.push([x,y,z]);
			tempPos.push([x,y]);
			// if (q == 6)
			// 	aAdjIndex.push([20.5, 2.5, 50.5]);
			// else
			// 	aAdjIndex.push([0,0,0]);


			coords.push([0,0]);

			iC++;

		}

		if (tempPos.length > 3){
			var topLeftPointIdx = 0;
			var bottomLeftPointIdx = 0;
			var topRightPointIdx = 0;
			var bottomRightPointIdx = 0;

			var currentTopLeft = tempPos[0];
			var currentTopRight = tempPos[0];
			var currentBottomLeft = tempPos[0];
			var currentBottomRight = tempPos[0];

		}else{
			var topLeftPointIdx = 0;
			var bottomLeftPointIdx = 0;
			var topRightPointIdx = 0;
			// var bottomRightPointIdx = -1;

			var currentTopLeft = tempPos[0];
			var currentTopRight = tempPos[0];
			var currentBottomLeft = tempPos[0];
			// var currentBottomRight = tempPos[0];
		}

		

		for (var q=0;q<tempPos.length;q++){


			//topleft
			if (tempPos[q][0] < currentTopLeft[0] && (tempPos[q][1] > currentTopLeft[1])){
				currentTopLeft = tempPos[q];
				topLeftPointIdx = q;
			}
			

			//topright
			if (tempPos[q][0] > currentTopRight[0] && (tempPos[q][1] > currentTopRight[1])){
				currentTopRight = tempPos[q];
				topRightPointIdx = q;
			}
			

			if (tempPos.length > 3){
				//bottomright
				if (tempPos[q][0] > currentBottomRight[0] && (tempPos[q][1] < currentBottomRight[1])){
					currentBottomRight = tempPos[q];
					bottomRightPointIdx = q;
				}
			
			}
			

			//bottomleft
			if (tempPos[q][0] < currentBottomLeft[0] && (tempPos[q][1] < currentBottomLeft[1])){
				currentBottomLeft = tempPos[q];
				bottomLeftPointIdx = q;
			}
		

		}

		// debugger;
		if (tempPos.length > 3){
			coords[coords.length - (tempPos.length - topLeftPointIdx)] = [.3, .7];
			coords[coords.length - (tempPos.length - topRightPointIdx)] = [.7, .7];
			coords[coords.length - (tempPos.length - bottomLeftPointIdx)] = [.3, .3];
			coords[coords.length - (tempPos.length - bottomRightPointIdx)] = [.7, .3];
		}else{
			coords[coords.length - (tempPos.length - topLeftPointIdx)] = [.3, .7];
			coords[coords.length - (tempPos.length - topRightPointIdx)] = [.7, .7];
			coords[coords.length - (tempPos.length - bottomLeftPointIdx)] = [.3, .3];
		}

		// console.log(tempPos.length);
		
	}

	// debugger;

	// this.findMidPoints(positions);
	extras = this.calcAdjLevel(positions);

	
	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(extras.a, "aAdjIndex", 3, false);
	this.mesh.bufferData(extras.u, "aUseInverse", 1, false);
	// this.mesh.bufferData(colors, "aVertexColor", 3, false);
	// this.mesh.bufferData(normals, "aVertexNormal", 3, true);

	
};

p.render = function(videoTexture, audioData) {

	this.transforms.push();
	
	var mvMatrix = this.transforms.getMvMatrix();

	

	mat4.translate(mvMatrix, mvMatrix, [-69.9,20,0])
	mat4.rotate(mvMatrix, mvMatrix, Math.PI * -.5, [0,1,0]);
	mat4.scale(mvMatrix, mvMatrix, [0.06, 0.1, 0.05]);


	this.shader.bind();

	if (audioData.length > 8){
		this.shader.uniform("audioLevelDeep", "uniform1f", audioData[3]);
		this.shader.uniform("audioLevelHigh", "uniform1f", audioData[8]);

	}

	this.shader.uniform("angle", "uniform1f", this.angle+=.005);
	this.shader.uniform("videoTexture", "uniform1i", 0);
	// this.shader.uniform("textureParticle", "uniform1i", 1);
	videoTexture.bind(this.shader, 0);
	// texture.bind(1);
	this.draw(this.mesh);

	this.transforms.pop();
};

module.exports = ViewPrism;
},{"../framework/Mesh":10,"../framework/View":16}],29:[function(require,module,exports){
//ViewRoof.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewRoof(){};

var p = ViewRoof.prototype = new View();
var s = View.prototype;

var gl = null;


p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [];
	
	var width = window.NS.GL.params.width;
	var height = window.NS.GL.params.height;
	var depth = window.NS.GL.params.depth;

	//ROOF
	positions.push([-width, height, -depth]);
	positions.push([width, height, -depth]);
	positions.push([width, height, depth]);

	positions.push([-width, height, depth]);

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);

	
	indices.push(0,1,2,3,0,2);

	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

};

p.render = function(videoTexture, floorTexture, audioData, fboSize) {

	this.transforms.push();

	this.shader.bind();

	if (audioData.length > 8){

		
		this.shader.uniform("audioLevelDeep", "uniform1f", audioData[3]);
		this.shader.uniform("audioLevelHigh", "uniform1f", audioData[8]);

	}

	this.shader.uniform("fboW", "uniform1f", fboSize.w);
	this.shader.uniform("fboH", "uniform1f", fboSize.h);

	this.shader.uniform("winW", "uniform1f", window.innerWidth);
	this.shader.uniform("winH", "uniform1f", window.innerHeight);

	this.shader.uniform("videoTexture", "uniform1i", 0);
	this.shader.uniform("concreteTexture", "uniform1i", 1);
	
	videoTexture.bind(this.shader, 0);
	floorTexture.bind(this.shader, 1);
	
	this.draw(this.mesh);
	
	this.transforms.pop();
};



module.exports = ViewRoof;
},{"../framework/Mesh":10,"../framework/View":16}],30:[function(require,module,exports){
//ViewVideo.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewVideo(){};

var p = ViewVideo.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [0, 1, 2, 0, 2, 3];

	var size = 30;

	var vidHeight = 30;
	var wallHeight = 40;

	positions.push([-size, (wallHeight-vidHeight)/2, -59]);
	positions.push([ size, (wallHeight-vidHeight)/2, -59]);
	positions.push([ size,  vidHeight + (wallHeight-vidHeight)/2, -59]);
	positions.push([-size,  vidHeight + (wallHeight-vidHeight)/2, -59]);

	coords.push([0, 0]);
	coords.push([1, 0]);
	coords.push([1, 1]);
	coords.push([0, 1]);

	this.mesh = new Mesh();
	this.mesh.init(4, 6, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

};



p.render = function(videoTexture) {

	this.transforms.push();

	// this.transforms.calculateModelView();

	var mvMatrix = this.transforms.getMvMatrix();

	// mat4.rotate(mvMatrix, mvMatrix, -.4*Math.PI, [0, 0, 1]);
    // mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    // mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
	// return;
	this.shader.bind();


	this.shader.uniform("videoTexture", "uniform1i", 0);
	// this.shader.uniform("textureParticle", "uniform1i", 1);
	videoTexture.bind(this.shader, 0);
	// texture.bind(1);
	this.draw(this.mesh);

	this.transforms.pop();
};

module.exports = ViewVideo;
},{"../framework/Mesh":10,"../framework/View":16}],31:[function(require,module,exports){
//ViewWalls.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewWalls(){};

var p = ViewWalls.prototype = new View();
var s = View.prototype;

var gl = null;


p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [];
	
	var width = window.NS.GL.params.width;
	var height = window.NS.GL.params.height;
	var depth = window.NS.GL.params.depth;

	//FRONTWALL
	positions.push([-width, 0, depth]);
	positions.push([-width, height, depth]);
	positions.push([width, height, depth]);

	positions.push([width, 0, depth]);
	// positions.push([width, height, depth]);
	// positions.push([-width, 0, depth]);

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);
	// coords.push([1, 1]);
	// coords.push([0, 0]);

	

	

	indices.push(0, 1, 2, 3, 0, 2);

	
	

	//LEFT SIDEWALL
	// positions.push([-width, 0, -depth]);
	// positions.push([-width, 0, depth]);
	// positions.push([-width, height, depth]);

	// positions.push([-width, height, -depth]);
	// positions.push([-width, height, -depth]);
	// positions.push([-width, 0, depth]);

	positions.push([-width, 0, depth]);
	positions.push([-width, height, depth]);
	positions.push([-width, height, -depth]);

	positions.push([-width, 0, -depth]);

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);




	indices.push(4, 5, 6, 7, 4, 6);

	//RIGHT SIDEWALL
	// positions.push([width, 0, -depth]);
	// positions.push([width, 0, depth]);
	// positions.push([width, height, depth]);

	// positions.push([width, height, -depth]);
	// // positions.push([width, height, -depth]);
	// positions.push([width, 0, depth]);
	positions.push([width, 0, depth]);
	positions.push([width, height, depth]);
	positions.push([width, height, -depth]);

	positions.push([width, 0, -depth]);
	

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);
	// coords.push([1, 1]);
	// coords.push([0, 0]);


	indices.push(8, 9, 10, 11, 8, 10);

	//BACKWALL
	positions.push([-width, 0, -depth]);
	positions.push([-width, height, -depth]);
	positions.push([width, height, -depth]);
	positions.push([width, 0, -depth]);

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);


	indices.push(12, 13, 14, 15, 12, 14);


	

	

	

	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

};

p.render = function(videoTexture, fboSize) {

	this.transforms.push();

	this.shader.bind();

	this.shader.uniform("videoTexture", "uniform1i", 0);

	this.shader.uniform("fboW", "uniform1f", fboSize.w);
	this.shader.uniform("fboH", "uniform1f", fboSize.h);

	this.shader.uniform("winW", "uniform1f", window.innerWidth);
	this.shader.uniform("winH", "uniform1f", window.innerHeight);
	
	videoTexture.bind(this.shader, 0);
	
	this.draw(this.mesh);
	
	this.transforms.pop();
};


module.exports = ViewWalls;
},{"../framework/Mesh":10,"../framework/View":16}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvSW1wb3J0c0NvbnRyb2xsZXIuanMiLCJzcmMvanMvTWVzaFBsYWluLmpzIiwic3JjL2pzL1NjZW5lTWFpbi5qcyIsInNyYy9qcy9hcHAuanMiLCJzcmMvanMvY2FtZXJhcy9CYXNlQ2FtZXJhLmpzIiwic3JjL2pzL2NhbWVyYXMvRnJlZUNhbWVyYS5qcyIsInNyYy9qcy9mcmFtZXdvcmsvQ29sbGFkYUxvYWRlci5qcyIsInNyYy9qcy9mcmFtZXdvcmsvRnJhbWVidWZmZXIuanMiLCJzcmMvanMvZnJhbWV3b3JrL0ltcG9ydEFuaW1hdGlvbi5qcyIsInNyYy9qcy9mcmFtZXdvcmsvTWVzaC5qcyIsInNyYy9qcy9mcmFtZXdvcmsvU2NlbmUuanMiLCJzcmMvanMvZnJhbWV3b3JrL1NjZW5lVHJhbnNmb3Jtcy5qcyIsInNyYy9qcy9mcmFtZXdvcmsvU2hhZGVyUHJvZ3JhbS5qcyIsInNyYy9qcy9mcmFtZXdvcmsvU3BlY3RydW1BbmFseXplci5qcyIsInNyYy9qcy9mcmFtZXdvcmsvVGV4dHVyZS5qcyIsInNyYy9qcy9mcmFtZXdvcmsvVmlldy5qcyIsInNyYy9qcy9pbnRlcmFjdGlvbi9LZXlib2FyZEludGVyYWN0b3IuanMiLCJzcmMvanMvaW50ZXJhY3Rpb24vTW91c2VJbnRlcmFjdG9yLmpzIiwic3JjL2pzL3BsYXllcnMvQXVkaW9QbGF5ZXIuanMiLCJzcmMvanMvcGxheWVycy9WaWRlb1BsYXllci5qcyIsInNyYy9qcy9zY3JlZW5zL0VuZFNjcmVlbi5qcyIsInNyYy9qcy9zY3JlZW5zL0xvYWRlclNjcmVlbi5qcyIsInNyYy9qcy92aWV3cy9WaWV3QmFja2dyb3VuZC5qcyIsInNyYy9qcy92aWV3cy9WaWV3Rmxvb3IuanMiLCJzcmMvanMvdmlld3MvVmlld0ltcG9ydC5qcyIsInNyYy9qcy92aWV3cy9WaWV3TGVmdFdhbGwuanMiLCJzcmMvanMvdmlld3MvVmlld1BsYWluLmpzIiwic3JjL2pzL3ZpZXdzL1ZpZXdQcmlzbS5qcyIsInNyYy9qcy92aWV3cy9WaWV3Um9vZi5qcyIsInNyYy9qcy92aWV3cy9WaWV3VmlkZW8uanMiLCJzcmMvanMvdmlld3MvVmlld1dhbGxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy9JbXBvcnRzQ29udHJvbGxlci5qc1xuXG5mdW5jdGlvbiBJbXBvcnRzQ29udHJvbGxlcigpe307XG5cbnZhciBwID0gSW1wb3J0c0NvbnRyb2xsZXIucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbihhbmltYXRpb25zKXtcblxuXHQvLyB0aGlzLl9zdGFydFRpbWUgPSBuZXcgRGF0ZS5ub3coKTtcblxuXHR0aGlzLmFuaW1hdGlvbnMgPSBhbmltYXRpb25zLnNsaWNlKDApO1xuXG5cdHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG5cdC8vIGFsbCB0aW1lcyBkZWZpbmVkIGluIHNlY29uZHMgXG5cdC8vIGV2ZXJ5dGhpbiBjb250cm9sbGVkIGZyb20gcGxheWJhY2sgb2YgdmlkZW9cblxuXG59O1xuXG5cblxucC5wYXVzZSA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5ydW5uaW5nID0gZmFsc2U7XG5cbn07XG5cbnAuc3RhcnQgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMucnVubmluZyA9IHRydWU7XG59O1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKGN1cnJlbnRWaWRlb1RpbWVJbil7XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0aWYgKCF0aGlzLnJ1bm5pbmcpIHJldHVybjtcblxuXHQvLyB2YXIgZGlmZiA9IG5vdyAtIHRoaXMuX3N0YXJ0VGltZTtcblx0dmFyIGN1cnJWaWRlb1RpbWUgPSBjdXJyZW50VmlkZW9UaW1lSW47XG5cblxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLmFuaW1hdGlvbnMubGVuZ3RoO2krKyl7XG5cdFx0dmFyIG5vcm1hbGl6ZWQgPSAoY3VyclZpZGVvVGltZSAtIHRoaXMuYW5pbWF0aW9uc1tpXS5zdGFydFRpbWUpIC8gdGhpcy5hbmltYXRpb25zW2ldLnRvdGFsRHVyYXRpb247XG5cdFx0Ly8gY29uc29sZS5sb2codGhpcy5hbmltYXRpb25zW2ldLnN0YXJ0VGltZSwgdGhpcy5hbmltYXRpb25zW2ldLnRvdGFsRHVyYXRpb24sIGksIG5vcm1hbGl6ZWQpO1xuXHRcdHRoaXMuYW5pbWF0aW9uc1tpXS51cGRhdGUoTWF0aC5yb3VuZChub3JtYWxpemVkICogMTAwKSAvIDEwMCk7IFxuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1wb3J0c0NvbnRyb2xsZXI7IiwiLy9NZXNoUGxhaW4uanNcbmZ1bmN0aW9uIE1lc2hQbGFpbigpe307XG5cbnZhciBnbCA9IG51bGw7XG5cbnZhciBwID0gTWVzaFBsYWluLnByb3RvdHlwZTtcblxucC5pbml0ID0gZnVuY3Rpb24odmVydGV4U2l6ZSwgaW5kZXhTaXplLCBkcmF3VHlwZSl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXG5cdHRoaXMudmVydGV4U2l6ZSA9IHZlcnRleFNpemU7XG5cdHRoaXMuaW5kZXhTaXplID0gaW5kZXhTaXplO1xuXHR0aGlzLmRyYXdUeXBlID0gZHJhd1R5cGU7XG5cdHRoaXMuZXh0cmFBdHRyaWJ1dGVzID0gW107XG5cdHRoaXMubkJ1ZmZlclBvcyA9IHVuZGVmaW5lZDtcblxuXHR0aGlzLl9mbG9hdEFycmF5VmVydGV4ID0gdW5kZWZpbmVkO1xuXG5cdHRoaXMudGV4dHVyZVVzZWQgPSBmYWxzZTtcbn07XG5cbnAuYnVmZmVyVmVydGV4ID0gZnVuY3Rpb24oYXJ5VmVydGljZXMpIHtcblx0dmFyIHZlcnRpY2VzID0gW107XG5cblx0Ly8gZm9yKHZhciBpPTA7IGk8YXJ5VmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0Ly8gXHRmb3IodmFyIGo9MDsgajxhcnlWZXJ0aWNlc1tpXS5sZW5ndGg7IGorKykgdmVydGljZXMucHVzaChhcnlWZXJ0aWNlc1tpXVtqXSk7XG5cdC8vIH1cblxuXHRpZih0aGlzLnZCdWZmZXJQb3MgPT0gdW5kZWZpbmVkICkgdGhpcy52QnVmZmVyUG9zID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnZCdWZmZXJQb3MpO1xuXG5cdC8vIGlmKHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPT0gdW5kZWZpbmVkKSB0aGlzLl9mbG9hdEFycmF5VmVydGV4ID0gbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyk7XG5cdC8vIGVsc2Uge1xuXHQvLyBcdGlmKGFyeVZlcnRpY2VzLmxlbmd0aCAhPSB0aGlzLl9mbG9hdEFycmF5VmVydGV4Lmxlbmd0aCkgdGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuXHQvLyBcdGVsc2Uge1xuXHQvLyBcdFx0Zm9yKHZhciBpPTA7aTxhcnlWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHQvLyBcdFx0XHR0aGlzLl9mbG9hdEFycmF5VmVydGV4W2ldID0gYXJ5VmVydGljZXNbaV07XG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXHQvLyB9XG5cblx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGFyeVZlcnRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XG5cdHRoaXMudkJ1ZmZlclBvcy5pdGVtU2l6ZSA9IDM7XG59O1xuXG5wLmJ1ZmZlck5vcm1hbHMgPSBmdW5jdGlvbihhcnlOb3JtYWxzKSB7XG5cdHZhciBub3JtYWxzID0gW107XG5cblx0Ly8gZm9yKHZhciBpPTA7IGk8YXJ5VmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0Ly8gXHRmb3IodmFyIGo9MDsgajxhcnlWZXJ0aWNlc1tpXS5sZW5ndGg7IGorKykgdmVydGljZXMucHVzaChhcnlWZXJ0aWNlc1tpXVtqXSk7XG5cdC8vIH1cblxuXHRpZih0aGlzLm5CdWZmZXJQb3MgPT0gdW5kZWZpbmVkICkgdGhpcy5uQnVmZmVyUG9zID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLm5CdWZmZXJQb3MpO1xuXG5cdC8vIGlmKHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPT0gdW5kZWZpbmVkKSB0aGlzLl9mbG9hdEFycmF5VmVydGV4ID0gbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyk7XG5cdC8vIGVsc2Uge1xuXHQvLyBcdGlmKGFyeVZlcnRpY2VzLmxlbmd0aCAhPSB0aGlzLl9mbG9hdEFycmF5VmVydGV4Lmxlbmd0aCkgdGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuXHQvLyBcdGVsc2Uge1xuXHQvLyBcdFx0Zm9yKHZhciBpPTA7aTxhcnlWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHQvLyBcdFx0XHR0aGlzLl9mbG9hdEFycmF5VmVydGV4W2ldID0gYXJ5VmVydGljZXNbaV07XG5cdC8vIFx0XHR9XG5cdC8vIFx0fVxuXHQvLyB9XG5cblx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGFyeU5vcm1hbHMsIGdsLlNUQVRJQ19EUkFXKTtcblx0dGhpcy5uQnVmZmVyUG9zLml0ZW1TaXplID0gMztcbn07XG5cblxucC5idWZmZXJUZXhDb29yZHMgPSBmdW5jdGlvbihhcnlUZXhDb29yZHMpIHtcblx0dGhpcy50ZXh0dXJlVXNlZCA9IHRydWU7XG5cdC8vIHZhciBjb29yZHMgPSBbXTtcblxuXHQvLyBmb3IodmFyIGk9MDsgaTxhcnlUZXhDb29yZHMubGVuZ3RoOyBpKyspIHtcblx0Ly8gXHRmb3IodmFyIGo9MDsgajxhcnlUZXhDb29yZHNbaV0ubGVuZ3RoOyBqKyspIGNvb3Jkcy5wdXNoKGFyeVRleENvb3Jkc1tpXVtqXSk7XG5cdC8vIH1cblxuXHR0aGlzLnZCdWZmZXJVViA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmZmVyVVYpO1xuXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgYXJ5VGV4Q29vcmRzLCBnbC5TVEFUSUNfRFJBVyk7XG5cdHRoaXMudkJ1ZmZlclVWLml0ZW1TaXplID0gMjtcbn07XG5cblxucC5idWZmZXJEYXRhID0gZnVuY3Rpb24oZGF0YSwgbmFtZSwgaXRlbVNpemUpIHtcblx0dmFyIGluZGV4ID0gLTFcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5leHRyYUF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRpZih0aGlzLmV4dHJhQXR0cmlidXRlc1tpXS5uYW1lID09IG5hbWUpIHtcblx0XHRcdHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2ldLmRhdGEgPSBkYXRhO1xuXHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Ly8gdmFyIGJ1ZmZlckRhdGEgPSBbXTtcblx0Ly8gZm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xuXHQvLyBcdGZvcih2YXIgaj0wOyBqPGRhdGFbaV0ubGVuZ3RoOyBqKyspIGJ1ZmZlckRhdGEucHVzaChkYXRhW2ldW2pdKTtcblx0Ly8gfVxuXG5cdGlmKGluZGV4ID09IC0xKSB7XG5cdFx0dmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuXHRcdHZhciBmbG9hdEFycmF5ID0gZGF0YTtcblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZmxvYXRBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1x0XG5cdFx0dGhpcy5leHRyYUF0dHJpYnV0ZXMucHVzaCh7bmFtZTpuYW1lLCBkYXRhOmRhdGEsIGl0ZW1TaXplOml0ZW1TaXplLCBidWZmZXI6YnVmZmVyLCBmbG9hdEFycmF5OmZsb2F0QXJyYXl9KTtcblx0fSBlbHNlIHtcblx0XHR2YXIgYnVmZmVyID0gdGhpcy5leHRyYUF0dHJpYnV0ZXNbaW5kZXhdLmJ1ZmZlcjtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKTtcblx0XHR2YXIgZmxvYXRBcnJheSA9IHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2luZGV4XS5mbG9hdEFycmF5O1xuXHRcdGZvcih2YXIgaT0wO2k8YnVmZmVyRGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZmxvYXRBcnJheVtpXSA9IGJ1ZmZlckRhdGFbaV07XG5cdFx0fVxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBmbG9hdEFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHRcblx0fVxuXHRcbn07XG5cblxucC5idWZmZXJJbmRpY2VzID0gZnVuY3Rpb24oYXJ5SW5kaWNlcykge1xuXG5cdHRoaXMuaUJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmlCdWZmZXIpO1xuXHRnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBhcnlJbmRpY2VzLCBnbC5TVEFUSUNfRFJBVyk7XG5cdHRoaXMuaUJ1ZmZlci5pdGVtU2l6ZSA9IDE7XG5cdHRoaXMuaUJ1ZmZlci5udW1JdGVtcyA9IGFyeUluZGljZXMubGVuZ3RoO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXNoUGxhaW47IiwiLy9TY2VuZU1haW4uanNcblxudmFyIExvYWRlclNjcmVlbiA9IHJlcXVpcmUoJy4vc2NyZWVucy9Mb2FkZXJTY3JlZW4nKTtcbnZhciBFbmRTY3JlZW4gPSByZXF1aXJlKCcuL3NjcmVlbnMvRW5kU2NyZWVuJyk7XG52YXIgVmlld1dhbGxzID0gcmVxdWlyZSgnLi92aWV3cy9WaWV3V2FsbHMnKTtcbnZhciBWaWV3Um9vZiA9IHJlcXVpcmUoJy4vdmlld3MvVmlld1Jvb2YnKTtcbnZhciBWaWV3Rmxvb3IgPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdGbG9vcicpO1xudmFyIFZpZXdWaWRlbyA9IHJlcXVpcmUoJy4vdmlld3MvVmlld1ZpZGVvJyk7XG52YXIgVmlld1ByaXNtID0gcmVxdWlyZSgnLi92aWV3cy9WaWV3UHJpc20nKTtcbnZhciBWaWV3TGVmdFdhbGwgPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdMZWZ0V2FsbCcpO1xudmFyIFZpZXdQbGFpbiA9IHJlcXVpcmUoJy4vdmlld3MvVmlld1BsYWluJyk7XG52YXIgVmlld0JhY2tncm91bmQgPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdCYWNrZ3JvdW5kJyk7XG52YXIgVmlld0ltcG9ydCA9IHJlcXVpcmUoJy4vdmlld3MvVmlld0ltcG9ydCcpO1xudmFyIFNjZW5lID0gcmVxdWlyZSgnLi9mcmFtZXdvcmsvU2NlbmUnKTtcbnZhciBLZXlib2FyZEludGVyYWN0b3IgPSByZXF1aXJlKCcuL2ludGVyYWN0aW9uL0tleWJvYXJkSW50ZXJhY3RvcicpO1xudmFyIE1vdXNlSW50ZXJhY3RvciA9IHJlcXVpcmUoJy4vaW50ZXJhY3Rpb24vTW91c2VJbnRlcmFjdG9yJyk7XG52YXIgU2NlbmVUcmFuc2Zvcm1zID0gcmVxdWlyZSgnLi9mcmFtZXdvcmsvU2NlbmVUcmFuc2Zvcm1zJyk7XG52YXIgRnJhbWVidWZmZXIgPSByZXF1aXJlKCcuL2ZyYW1ld29yay9GcmFtZWJ1ZmZlcicpO1xudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL2ZyYW1ld29yay9UZXh0dXJlJyk7XG52YXIgQXVkaW9QbGF5ZXIgPSByZXF1aXJlKCcuL3BsYXllcnMvQXVkaW9QbGF5ZXInKTtcbnZhciBWaWRlb1BsYXllciA9IHJlcXVpcmUoJy4vcGxheWVycy9WaWRlb1BsYXllcicpO1xudmFyIFNwZWN0cnVtQW5hbHlzZXIgPSByZXF1aXJlKCcuL2ZyYW1ld29yay9TcGVjdHJ1bUFuYWx5emVyJyk7XG52YXIgQ29sbGFkYUxvYWRlciA9IHJlcXVpcmUoJy4vZnJhbWV3b3JrL0NvbGxhZGFMb2FkZXInKTtcbnZhciBJbXBvcnRBbmltYXRpb24gPSByZXF1aXJlKCcuL2ZyYW1ld29yay9JbXBvcnRBbmltYXRpb24nKTtcbnZhciBJbXBvcnRzQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vSW1wb3J0c0NvbnRyb2xsZXInKTtcblxuXG5mdW5jdGlvbiBTY2VuZU1haW4oKXt9O1xuXG52YXIgcCA9IFNjZW5lTWFpbi5wcm90b3R5cGUgPSBuZXcgU2NlbmUoKTtcbnZhciBzID0gU2NlbmUucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG52YXIgZ3JhZDMgPSBbWzAsMSwxXSxbMCwxLC0xXSxbMCwtMSwxXSxbMCwtMSwtMV0sXG4gICAgICAgICAgICAgICAgICAgWzEsMCwxXSxbMSwwLC0xXSxbLTEsMCwxXSxbLTEsMCwtMV0sXG4gICAgICAgICAgICAgICAgICAgWzEsMSwwXSxbMSwtMSwwXSxbLTEsMSwwXSxbLTEsLTEsMF0sIC8vIDEyIGN1YmUgZWRnZXNcbiAgICAgICAgICAgICAgICAgICBbMSwwLC0xXSxbLTEsMCwtMV0sWzAsLTEsMV0sWzAsMSwxXV07IC8vIDQgbW9yZSB0byBtYWtlIDE2XG5cbnZhciBwZXJtID0gWzE1MSwxNjAsMTM3LDkxLDkwLDE1LFxuICAxMzEsMTMsMjAxLDk1LDk2LDUzLDE5NCwyMzMsNywyMjUsMTQwLDM2LDEwMywzMCw2OSwxNDIsOCw5OSwzNywyNDAsMjEsMTAsMjMsXG4gIDE5MCwgNiwxNDgsMjQ3LDEyMCwyMzQsNzUsMCwyNiwxOTcsNjIsOTQsMjUyLDIxOSwyMDMsMTE3LDM1LDExLDMyLDU3LDE3NywzMyxcbiAgODgsMjM3LDE0OSw1Niw4NywxNzQsMjAsMTI1LDEzNiwxNzEsMTY4LCA2OCwxNzUsNzQsMTY1LDcxLDEzNCwxMzksNDgsMjcsMTY2LFxuICA3NywxNDYsMTU4LDIzMSw4MywxMTEsMjI5LDEyMiw2MCwyMTEsMTMzLDIzMCwyMjAsMTA1LDkyLDQxLDU1LDQ2LDI0NSw0MCwyNDQsXG4gIDEwMiwxNDMsNTQsIDY1LDI1LDYzLDE2MSwgMSwyMTYsODAsNzMsMjA5LDc2LDEzMiwxODcsMjA4LCA4OSwxOCwxNjksMjAwLDE5NixcbiAgMTM1LDEzMCwxMTYsMTg4LDE1OSw4NiwxNjQsMTAwLDEwOSwxOTgsMTczLDE4NiwgMyw2NCw1MiwyMTcsMjI2LDI1MCwxMjQsMTIzLFxuICA1LDIwMiwzOCwxNDcsMTE4LDEyNiwyNTUsODIsODUsMjEyLDIwNywyMDYsNTksMjI3LDQ3LDE2LDU4LDE3LDE4MiwxODksMjgsNDIsXG4gIDIyMywxODMsMTcwLDIxMywxMTksMjQ4LDE1MiwgMiw0NCwxNTQsMTYzLCA3MCwyMjEsMTUzLDEwMSwxNTUsMTY3LCA0MywxNzIsOSxcbiAgMTI5LDIyLDM5LDI1MywgMTksOTgsMTA4LDExMCw3OSwxMTMsMjI0LDIzMiwxNzgsMTg1LCAxMTIsMTA0LDIxOCwyNDYsOTcsMjI4LFxuICAyNTEsMzQsMjQyLDE5MywyMzgsMjEwLDE0NCwxMiwxOTEsMTc5LDE2MiwyNDEsIDgxLDUxLDE0NSwyMzUsMjQ5LDE0LDIzOSwxMDcsXG4gIDQ5LDE5MiwyMTQsIDMxLDE4MSwxOTksMTA2LDE1NywxODQsIDg0LDIwNCwxNzYsMTE1LDEyMSw1MCw0NSwxMjcsIDQsMTUwLDI1NCxcbiAgMTM4LDIzNiwyMDUsOTMsMjIyLDExNCw2NywyOSwyNCw3MiwyNDMsMTQxLDEyOCwxOTUsNzgsNjYsMjE1LDYxLDE1NiwxODBdO1xuXG52YXIgc2ltcGxleDQgPSBbXG4gIFswLDY0LDEyOCwxOTJdLFswLDY0LDE5MiwxMjhdLFswLDAsMCwwXSxbMCwxMjgsMTkyLDY0XSxcbiAgWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sWzY0LDEyOCwxOTIsMF0sXG4gIFswLDEyOCw2NCwxOTJdLFswLDAsMCwwXSxbMCwxOTIsNjQsMTI4XSxbMCwxOTIsMTI4LDY0XSxcbiAgWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sWzY0LDE5MiwxMjgsMF0sXG4gIFswLDAsMCwwXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxcbiAgWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFxuICBbNjQsMTI4LDAsMTkyXSxbMCwwLDAsMF0sWzY0LDE5MiwwLDEyOF0sWzAsMCwwLDBdLFxuICBbMCwwLDAsMF0sWzAsMCwwLDBdLFsxMjgsMTkyLDAsNjRdLFsxMjgsMTkyLDY0LDBdLFxuICBbNjQsMCwxMjgsMTkyXSxbNjQsMCwxOTIsMTI4XSxbMCwwLDAsMF0sWzAsMCwwLDBdLFxuICBbMCwwLDAsMF0sWzEyOCwwLDE5Miw2NF0sWzAsMCwwLDBdLFsxMjgsNjQsMTkyLDBdLFxuICBbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sXG4gIFswLDAsMCwwXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxcbiAgWzEyOCwwLDY0LDE5Ml0sWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sXG4gIFsxOTIsMCw2NCwxMjhdLFsxOTIsMCwxMjgsNjRdLFswLDAsMCwwXSxbMTkyLDY0LDEyOCwwXSxcbiAgWzEyOCw2NCwwLDE5Ml0sWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sXG4gIFsxOTIsNjQsMCwxMjhdLFswLDAsMCwwXSxbMTkyLDEyOCwwLDY0XSxbMTkyLDEyOCw2NCwwXVxuXTtcblxucC5pbml0ID0gZnVuY3Rpb24oKXtcblxuXHRzLmluaXQuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmxvYWRlclNjcmVlbiA9IG5ldyBMb2FkZXJTY3JlZW4oKTtcblx0dGhpcy5sb2FkZXJTY3JlZW4uaW5pdCgpO1xuXHR0aGlzLmxvYWRlclNjcmVlbi5zaG93KCk7XG5cdC8vIHRoaXMubG9hZGVyU2NyZWVuLmhpZGUoKTtcblxuXHR0aGlzLmVuZFNjcmVlbiA9IG5ldyBFbmRTY3JlZW4oKTtcblx0dGhpcy5lbmRTY3JlZW4uaW5pdCh0aGlzLl9vblJlcGxheSwgdGhpcyk7XG5cdC8vIHRoaXMuZW5kU2NyZWVuLmhpZGUoKTtcblxuXHR0aGlzLm9uUmVzaXplKCk7XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblxuXHR2YXIgZGVyaXZhdGl2ZSA9IGdsLmdldEV4dGVuc2lvbignT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyk7XG5cblx0XG5cblx0dGhpcy5jYW1lcmEuc2V0UG9zaXRpb24obmV3IEFycmF5KDAuMCwgNS4wLCAxMS4wKSk7XG4gICAgdGhpcy5jYW1lcmEuc2V0TG9va0F0UG9pbnQodmVjMy5mcm9tVmFsdWVzKDAuMCwgNS4wLCAtMS4wKSk7XG4gICAgLy8gdGhpcy5jYW1lcmEueWF3KE1hdGguUEkgKiAtMS4yNSk7XG4gICAgLy8gdGhpcy5jYW1lcmEubW92ZUZvcndhcmQoNCk7XG5cbiAgICAvLyBkZWJ1Z2dlcjtcbiAgICB0aGlzLmxlZnRXYWxsQ2FtZXJhLnNldFBvc2l0aW9uKG5ldyBBcnJheSgwLjAsIDEwLjAsIDAuMCkpO1xuICAgIHRoaXMubGVmdFdhbGxDYW1lcmEuc2V0TG9va0F0UG9pbnQodmVjMy5mcm9tVmFsdWVzKC0xLjAsIDEwLjAsIDAuMCkpO1xuICAgIC8vIHRoaXMubGVmdFdhbGxDYW1lcmEueWF3KE1hdGguUEkgKiAuMjUpO1xuICAgIHRoaXMubGVmdFdhbGxDYW1lcmEubW92ZUZvcndhcmQoLTE1LjgpO1xuXG4gIFxuICAgIHRoaXMua2V5Ym9hcmRJbnRlcmFjdG9yID0gbmV3IEtleWJvYXJkSW50ZXJhY3RvcigpO1xuICAgIHRoaXMua2V5Ym9hcmRJbnRlcmFjdG9yLmluaXQodGhpcy5jYW1lcmEsIHRoaXMuY2FudmFzKTtcbiAgICB0aGlzLmtleWJvYXJkSW50ZXJhY3Rvci5zZXR1cCgpO1xuXG4gICAgdGhpcy5tb3VzZUludGVyYWN0b3IgPSBuZXcgTW91c2VJbnRlcmFjdG9yKCk7XG4gICAgdGhpcy5tb3VzZUludGVyYWN0b3IuaW5pdCh0aGlzLmNhbWVyYSwgdGhpcy5jYW52YXMpO1xuICAgIHRoaXMubW91c2VJbnRlcmFjdG9yLnNldHVwKCk7XG5cblx0dGhpcy50cmFuc2Zvcm1zID0gbmV3IFNjZW5lVHJhbnNmb3JtcygpO1xuXHR0aGlzLnRyYW5zZm9ybXMuaW5pdCh0aGlzLmNhbnZhcyk7XG5cblx0dGhpcy5sZWZ0V2FsbFRyYW5zZm9ybXMgPSBuZXcgU2NlbmVUcmFuc2Zvcm1zKCk7XG5cdHRoaXMubGVmdFdhbGxUcmFuc2Zvcm1zLmluaXQodGhpcy5jYW52YXMpO1xuXG5cblx0dGhpcy5vcnRob1RyYW5zZm9ybXMgPSBuZXcgU2NlbmVUcmFuc2Zvcm1zKCk7XG5cdHRoaXMub3J0aG9UcmFuc2Zvcm1zLmluaXQodGhpcy5jYW52YXMpO1xuXHRcblxuXHR0aGlzLl9hdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcblxuXHRcblx0dGhpcy52aWRlb1BsYXllciA9IG5ldyBWaWRlb1BsYXllcigpO1xuXHR0aGlzLnZpZGVvUGxheWVyLmluaXQodGhpcy5fb25Bc3NldHNMb2FkZWQsIHRoaXMuX29uVmlkZW9CdWZmZXJpbmcsIHRoaXMuX29uVmlkZW9QbGF5aW5nLCB0aGlzLl9vblZpZGVvRW5kZWQsIHRoaXMpO1xuXHR0aGlzLnZpZGVvUGxheWVyLmxvYWQoJ2Fzc2V0cy92aWRlb05ldy5tcDQnKTtcblxuXHR0aGlzLmF1ZGlvUGxheWVyID0gbmV3IEF1ZGlvUGxheWVyKCk7XG5cdHRoaXMuYXVkaW9QbGF5ZXIuaW5pdCh0aGlzLl9hdWRpb0N0eCwgdGhpcy5fb25Bc3NldHNMb2FkZWQsIHRoaXMpO1xuXHR0aGlzLmF1ZGlvUGxheWVyLmxvYWQoJ2Fzc2V0cy9vbGQubXAzJyk7XG5cblx0dGhpcy5zcGVjdHJ1bUFuYWx5emVyID0gbmV3IFNwZWN0cnVtQW5hbHlzZXIoKTtcblx0dGhpcy5zcGVjdHJ1bUFuYWx5emVyLmluaXQodGhpcy5fYXVkaW9DdHgpO1xuXG5cdHRoaXMuX2luaXRWaWV3cygpO1xuXHR0aGlzLmNyZWF0ZU5vaXNlVGV4dHVyZSgpO1xuXG5cdHRoaXMuX2NvbmNyZXRlVGV4dHVyZSA9IG5ldyBUZXh0dXJlKCk7XG5cdHRoaXMuX2NvbmNyZXRlVGV4dHVyZS5pbml0KHdpbmRvdy5OUy5Db25jcmV0ZSwgZmFsc2UpO1xuXG5cdHRoaXMuaW1wb3J0c0xvYWRlZCA9IGZhbHNlO1xuXG5cdHRoaXMuX2ltcG9ydHMgPSBbXTtcblx0dGhpcy5wcmlzbUltcG9ydCA9IG5ldyBDb2xsYWRhTG9hZGVyKCk7XG5cdHRoaXMucHJpc21JbXBvcnQubG9hZChcInNlcGFyYXRlLmRhZVwiLCAncHJpc20nLCB0aGlzLl9vbkltcG9ydExvYWRlZCwgdGhpcyk7XG5cdHRoaXMuX2ltcG9ydHMucHVzaCh0aGlzLnByaXNtSW1wb3J0KTtcblxuXHR0aGlzLmNpcmNsZXNJbXBvcnQgPSBuZXcgQ29sbGFkYUxvYWRlcigpO1xuXHR0aGlzLmNpcmNsZXNJbXBvcnQubG9hZChcIndpaTIuZGFlXCIsICdjaXJjbGVzJywgdGhpcy5fb25JbXBvcnRMb2FkZWQsIHRoaXMpO1xuXHR0aGlzLl9pbXBvcnRzLnB1c2godGhpcy5jaXJjbGVzSW1wb3J0KTtcblxuXHR0aGlzLmJhY2tncm91bmRMb2FkZXJGYWRlciA9IDAuMTtcblxuXHQvLyB0aGlzLnRlc3RJbXBvcnQgPSBuZXcgQ29sbGFkYUxvYWRlcigpO1xuXHQvLyB0aGlzLnRlc3RJbXBvcnQubG9hZChcIi4uLy4uL2ltcG9ydHMvYm94eC5kYWVcIiwgJ3Rlc3QnLCB0aGlzLl9vbkltcG9ydExvYWRlZCwgdGhpcyk7XG5cdC8vIHRoaXMuX2ltcG9ydHMucHVzaCh0aGlzLnRlc3RJbXBvcnQpO1xuXG5cbn07XG5cblxuXG5wLmNyZWF0ZU5vaXNlVGV4dHVyZSA9IGZ1bmN0aW9uKCl7XG5cblx0Ly8gUEVSTSBURVhUVVJFXG5cdHZhciBwaXhlbHMgPSBuZXcgVWludDhBcnJheSgyNTYgKiAyNTYgKiA0KTtcblx0XG5cdHBlcm1UZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBwZXJtVGV4dHVyZSk7XG5cblx0Zm9yKHZhciBpID0gMDsgaTwyNTY7IGkrKyl7XG5cdFx0Zm9yKHZhciBqID0gMDsgajwyNTY7IGorKykge1xuXHRcdCAgdmFyIG9mZnNldCA9IChpKjI1NitqKSo0O1xuXHRcdCAgdmFyIHZhbHVlID0gcGVybVsoaitwZXJtW2ldKSAmIDB4RkZdO1xuXHRcdCAgcGl4ZWxzW29mZnNldF0gPSBncmFkM1t2YWx1ZSAmIDB4MEZdWzBdICogNjQgKyA2NDsgICAvLyBHcmFkaWVudCB4XG5cdFx0ICBwaXhlbHNbb2Zmc2V0KzFdID0gZ3JhZDNbdmFsdWUgJiAweDBGXVsxXSAqIDY0ICsgNjQ7IC8vIEdyYWRpZW50IHlcblx0XHQgIHBpeGVsc1tvZmZzZXQrMl0gPSBncmFkM1t2YWx1ZSAmIDB4MEZdWzJdICogNjQgKyA2NDsgLy8gR3JhZGllbnQgelxuXHRcdCAgcGl4ZWxzW29mZnNldCszXSA9IHZhbHVlOyAgICAgICAgICAgICAgICAgICAgIC8vIFBlcm11dGVkIGluZGV4XG5cdFx0fVxuXHR9XG5cdFxuXHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCAyNTYsIDI1NiwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgcGl4ZWxzICk7XG5cdGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTkVBUkVTVCApO1xuXHRnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLk5FQVJFU1QgKTtcblxuXHR0aGlzLl9wZXJtVGV4dHVyZSA9IG5ldyBUZXh0dXJlKCk7XG5cdHRoaXMuX3Blcm1UZXh0dXJlLmluaXQocGVybVRleHR1cmUsIHRydWUpO1xuXG5cblx0Ly8gU0lNUExFWCBURVhUVVJFXG5cdHZhciB0ZXN0ID0gbmV3IFVpbnQ4QXJyYXkoNjQgKiAxICogNCk7XG5cdFxuXHR2YXIgaW5kZXggPSAwO1xuXHRmb3IgKHZhciBpPTA7aTxzaW1wbGV4NC5sZW5ndGg7aSsrKXtcblx0XHRmb3IgKHZhciBqPTA7ajxzaW1wbGV4NFtpXS5sZW5ndGg7aisrKXtcblxuXHRcdFx0dGVzdFtpbmRleF0gPSBzaW1wbGV4NFtpXVtqXTtcblxuXHRcdFx0aW5kZXgrKztcblx0XHR9XG5cdH1cblxuXHRzaW1wbGV4VGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgc2ltcGxleFRleHR1cmUpO1xuXG5cdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIDY0LCAxLCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCB0ZXN0ICk7XG5cdGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTkVBUkVTVCApO1xuXHRnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLk5FQVJFU1QgKTtcblxuXHR0aGlzLl9zaW1wbGV4VGV4dHVyZSA9IG5ldyBUZXh0dXJlKCk7XG5cdHRoaXMuX3NpbXBsZXhUZXh0dXJlLmluaXQoc2ltcGxleFRleHR1cmUsIHRydWUpO1xufTtcblxucC5fb25JbXBvcnRMb2FkZWQgPSBmdW5jdGlvbihsb2FkZWRPYmope1xuXG5cdC8vIGRlYnVnZ2VyO1xuXG5cdGlmIChsb2FkZWRPYmoudHlwZSA9PSAncHJpc20nKXtcblx0XHR0aGlzLl92UHJpc20uY3JlYXRlTWVzaChsb2FkZWRPYmoucGFyZW50RGF0YSk7XG5cdFx0dGhpcy5iYWNrZ3JvdW5kTG9hZGVyRmFkZXIgKz0gLjI7XG5cdH1lbHNlIGlmIChsb2FkZWRPYmoudHlwZSA9PSAnY2lyY2xlcycpe1xuXHRcdFxuXHRcdHRoaXMuX2NpcmNsZXNBbmltYXRpb24gPSBuZXcgSW1wb3J0QW5pbWF0aW9uKCk7XG5cdFx0dGhpcy5fY2lyY2xlc0FuaW1hdGlvbi5pbml0KGxvYWRlZE9iai5hbmltYXRpb25EYXRhWzBdKTtcblx0XHR0aGlzLl9jaXJjbGVzQW5pbWF0aW9uLnN0YXJ0VGltZSA9IDEwO1xuXG5cdFx0dGhpcy5fY2lyY2xlc0FuaW1hdGlvbi52aWV3c1tsb2FkZWRPYmoucGFyZW50RGF0YVswXS5pZF0gPSB0aGlzLl92Q2lyY2xlO1xuXG5cdFx0dmFyIGNoaWxkVmlld3MgPSBbXTtcblx0XHRmb3IgKHZhciBpPTA7aTxsb2FkZWRPYmoucGFyZW50RGF0YVswXS5jaGlsZHJlbi5sZW5ndGg7aSsrKXtcblxuXHRcdFx0dmFyIGNoaWxkVmlldyA9IG5ldyBWaWV3SW1wb3J0KCk7XG5cdFx0XHRjaGlsZFZpZXcuaW5pdCh1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG5cdFx0XHRjaGlsZFZpZXcuY3JlYXRlTWVzaChsb2FkZWRPYmoucGFyZW50RGF0YVswXS5jaGlsZHJlbltpXSk7XG5cdFx0XHRjaGlsZFZpZXcudHJhbnNmb3JtcyA9IHRoaXMudHJhbnNmb3Jtcztcblx0XHRcdGNoaWxkVmlldy5pZCA9IGxvYWRlZE9iai5wYXJlbnREYXRhWzBdLmNoaWxkcmVuW2ldLmlkO1xuXHRcdFx0Y2hpbGRWaWV3cy5wdXNoKGNoaWxkVmlldyk7XG5cdFx0XHR0aGlzLl9jaXJjbGVzQW5pbWF0aW9uLnZpZXdzW2xvYWRlZE9iai5wYXJlbnREYXRhWzBdLmNoaWxkcmVuW2ldLmlkXSA9IGNoaWxkVmlldztcblxuXHRcdH1cblxuXHRcdHRoaXMuaW1wb3J0c0NvbnRyb2xsZXIgPSBuZXcgSW1wb3J0c0NvbnRyb2xsZXIoKTtcblx0XHR0aGlzLmltcG9ydHNDb250cm9sbGVyLmluaXQoW3RoaXMuX2NpcmNsZXNBbmltYXRpb25dKTtcblxuXHRcdC8vIGRlYnVnZ2VyO1xuXHRcdHRoaXMuX3ZDaXJjbGUuaWQgPSBsb2FkZWRPYmoucGFyZW50RGF0YVswXS5pZDtcblx0XHR0aGlzLl92Q2lyY2xlLmFkZFN1YlZpZXdzKGNoaWxkVmlld3MpO1xuXG5cdFx0dGhpcy5iYWNrZ3JvdW5kTG9hZGVyRmFkZXIgKz0gLjI7XG5cdH1lbHNlIGlmIChsb2FkZWRPYmoudHlwZSA9PSAndGVzdCcpe1xuXG5cdFx0Ly8gdGhpcy5fdlRlc3RJbXBvcnQuY3JlYXRlTWVzaChsb2FkZWRPYmoucGFyZW50RGF0YVswXSk7XG5cdH1cbn07XG5cblxucC5fb25Bc3NldHNMb2FkZWQgPSBmdW5jdGlvbihlKXtcblxuXHR0aGlzLmJhY2tncm91bmRMb2FkZXJGYWRlciArPSAuMjtcblxuXHRjb25zb2xlLmxvZygnYXNzZXRzIGxvYWRlZCcpO1xuXG5cdGlmICghdGhpcy5hdWRpb1BsYXllci5pc0xvYWRlZCB8fCAhdGhpcy52aWRlb1BsYXllci5pc0xvYWRlZCkgcmV0dXJuO1xuXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2ltcG9ydHMubGVuZ3RoO2krKyl7XG5cdFx0aWYgKCF0aGlzLl9pbXBvcnRzW2ldLmRhdGFMb2FkZWQpIHJldHVybjtcblx0fVxuXG5cdHRoaXMuaW1wb3J0c0xvYWRlZCA9IHRydWU7XG5cdFxuXHR0aGlzLl9pbml0VGV4dHVyZXMoKTtcblxuXHR0aGlzLmxvYWRlclNjcmVlbi5oaWRlKCk7XG5cdFxufTtcblxucC5fb25WaWRlb0J1ZmZlcmluZyA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5hdWRpb1BsYXllci5wYXVzZSgpO1xuXHR0aGlzLnNwZWN0cnVtQW5hbHl6ZXIuZGlzY29ubmVjdCh0aGlzLmF1ZGlvUGxheWVyLmdldFNvdXJjZU5vZGUoKSk7XG5cdHRoaXMuaW1wb3J0c0NvbnRyb2xsZXIucGF1c2UoKTtcblxufTtcblxucC5fb25WaWRlb1BsYXlpbmcgPSBmdW5jdGlvbigpe1xuXG5cblx0dGhpcy5hdWRpb1BsYXllci5wbGF5KCk7XG5cdHRoaXMuc3BlY3RydW1BbmFseXplci5jb25uZWN0KHRoaXMuYXVkaW9QbGF5ZXIuZ2V0U291cmNlTm9kZSgpKTtcblx0dGhpcy5pbXBvcnRzQ29udHJvbGxlci5zdGFydCgpO1xufTtcblxucC5fb25WaWRlb0VuZGVkID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLmVuZFNjcmVlbi5zaG93KCk7XG5cdHRoaXMuYXVkaW9QbGF5ZXIucGF1c2UoKTtcblx0dGhpcy5zcGVjdHJ1bUFuYWx5emVyLmRpc2Nvbm5lY3QodGhpcy5hdWRpb1BsYXllci5nZXRTb3VyY2VOb2RlKCkpO1xuXHR0aGlzLmF1ZGlvUGxheWVyLnJlc2V0KCk7XG5cdHRoaXMudmlkZW9QbGF5ZXIucmVzZXQoKTtcblx0dGhpcy5pbXBvcnRzQ29udHJvbGxlci5wYXVzZSgpO1xuXG5cdHRoaXMuX3ZDaXJjbGUucmVzZXRBbmltYXRpb24oKTtcblxufTtcblxucC5fb25SZXBsYXkgPSBmdW5jdGlvbigpe1xuXG5cblx0dGhpcy52aWRlb1BsYXllci5wbGF5KCk7XG5cdHRoaXMuZW5kU2NyZWVuLmhpZGUoKTtcblxufTtcblxuXG5cbnAuX2luaXRUZXh0dXJlcyA9IGZ1bmN0aW9uKCkge1xuXHRjb25zb2xlLmxvZyggXCJJbml0IFRleHR1cmVcIiApO1xuXG5cdHRoaXMuYmFja2dyb3VuZExvYWRlckZhZGVyICs9IC4yO1xuXG5cdHRoaXMuX3ZpZGVvVGV4dHVyZSA9IG5ldyBUZXh0dXJlKCk7XG5cdHRoaXMuX3ZpZGVvVGV4dHVyZS5pbml0KHRoaXMudmlkZW9QbGF5ZXIudmlkZW8sIGZhbHNlKTtcblxuXHR0aGlzLmZib1NpemUgPSB7fTtcblx0dGhpcy5mYm9TaXplLncgPSB3aW5kb3cuaW5uZXJXaWR0aCAqIDI7XG5cdHRoaXMuZmJvU2l6ZS5oID0gd2luZG93LmlubmVySGVpZ2h0ICogMjtcblxuXHR0aGlzLl9sZWZ0V2FsbEZCTyA9IG5ldyBGcmFtZWJ1ZmZlcigpO1xuXHR0aGlzLl9sZWZ0V2FsbEZCTy5pbml0KHRoaXMuZmJvU2l6ZS53LzIsIHRoaXMuZmJvU2l6ZS5oLzIsIGdsLk5FQVJFU1QsIGdsLk5FQVJFU1QsIGdsLlVOU0lHTkVEX0JZVEUpO1xuXG5cdHRoaXMuX3ByaXNtRkJPID0gbmV3IEZyYW1lYnVmZmVyKCk7XG5cdHRoaXMuX3ByaXNtRkJPLmluaXQodGhpcy5mYm9TaXplLncsIHRoaXMuZmJvU2l6ZS5oLCBnbC5ORUFSRVNULCBnbC5ORUFSRVNULCBnbC5VTlNJR05FRF9CWVRFKTtcblx0XG5cdFxuXG59O1xuXG5wLl9pbml0Vmlld3MgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coIFwiSW5pdCBWaWV3c1wiICk7XG5cblx0dGhpcy5fdmlld3MgPSBbXTtcblxuXHR0aGlzLmJhY2tncm91bmRMb2FkZXJGYWRlciArPSAuMjtcblxuXHR0aGlzLl92QmFja2dyb3VuZCA9IG5ldyBWaWV3QmFja2dyb3VuZCgpO1xuXHR0aGlzLl92QmFja2dyb3VuZC5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMzIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxudW5pZm9ybSBmbG9hdCBhbmdsZVZlcnQ7XFxuXFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxudmFyeWluZyB2ZWMzIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXG5cXHR2ZWMzIG5ld1BvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG5cXHRuZXdQb3MueHkgKj0gYW5nbGVWZXJ0KjIuMDtcXG5cXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcblxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG4gICAgdlZlcnRleFBvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG4vL1xcbi8vIERlc2NyaXB0aW9uIDogQXJyYXkgYW5kIHRleHR1cmVsZXNzIEdMU0wgMkQgc2ltcGxleCBub2lzZSBmdW5jdGlvbi5cXG4vLyAgICAgIEF1dGhvciA6IElhbiBNY0V3YW4sIEFzaGltYSBBcnRzLlxcbi8vICBNYWludGFpbmVyIDogaWptXFxuLy8gICAgIExhc3Rtb2QgOiAyMDExMDgyMiAoaWptKVxcbi8vICAgICBMaWNlbnNlIDogQ29weXJpZ2h0IChDKSAyMDExIEFzaGltYSBBcnRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxcbi8vICAgICAgICAgICAgICAgRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgTElDRU5TRSBmaWxlLlxcbi8vICAgICAgICAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL2FzaGltYS93ZWJnbC1ub2lzZVxcbi8vXFxuXFxudmVjMyBtb2QyODlfMV8wKHZlYzMgeCkge1xcbiAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDtcXG59XFxuXFxudmVjMiBtb2QyODlfMV8wKHZlYzIgeCkge1xcbiAgcmV0dXJuIHggLSBmbG9vcih4ICogKDEuMCAvIDI4OS4wKSkgKiAyODkuMDtcXG59XFxuXFxudmVjMyBwZXJtdXRlXzFfMSh2ZWMzIHgpIHtcXG4gIHJldHVybiBtb2QyODlfMV8wKCgoeCozNC4wKSsxLjApKngpO1xcbn1cXG5cXG5mbG9hdCBzbm9pc2VfMV8yKHZlYzIgdilcXG4gIHtcXG4gIGNvbnN0IHZlYzQgQyA9IHZlYzQoMC4yMTEzMjQ4NjU0MDUxODcsICAvLyAoMy4wLXNxcnQoMy4wKSkvNi4wXFxuICAgICAgICAgICAgICAgICAgICAgIDAuMzY2MDI1NDAzNzg0NDM5LCAgLy8gMC41KihzcXJ0KDMuMCktMS4wKVxcbiAgICAgICAgICAgICAgICAgICAgIC0wLjU3NzM1MDI2OTE4OTYyNiwgIC8vIC0xLjAgKyAyLjAgKiBDLnhcXG4gICAgICAgICAgICAgICAgICAgICAgMC4wMjQzOTAyNDM5MDI0MzkpOyAvLyAxLjAgLyA0MS4wXFxuLy8gRmlyc3QgY29ybmVyXFxuICB2ZWMyIGkgID0gZmxvb3IodiArIGRvdCh2LCBDLnl5KSApO1xcbiAgdmVjMiB4MCA9IHYgLSAgIGkgKyBkb3QoaSwgQy54eCk7XFxuXFxuLy8gT3RoZXIgY29ybmVyc1xcbiAgdmVjMiBpMTtcXG4gIC8vaTEueCA9IHN0ZXAoIHgwLnksIHgwLnggKTsgLy8geDAueCA+IHgwLnkgPyAxLjAgOiAwLjBcXG4gIC8vaTEueSA9IDEuMCAtIGkxLng7XFxuICBpMSA9ICh4MC54ID4geDAueSkgPyB2ZWMyKDEuMCwgMC4wKSA6IHZlYzIoMC4wLCAxLjApO1xcbiAgLy8geDAgPSB4MCAtIDAuMCArIDAuMCAqIEMueHggO1xcbiAgLy8geDEgPSB4MCAtIGkxICsgMS4wICogQy54eCA7XFxuICAvLyB4MiA9IHgwIC0gMS4wICsgMi4wICogQy54eCA7XFxuICB2ZWM0IHgxMiA9IHgwLnh5eHkgKyBDLnh4eno7XFxuICB4MTIueHkgLT0gaTE7XFxuXFxuLy8gUGVybXV0YXRpb25zXFxuICBpID0gbW9kMjg5XzFfMChpKTsgLy8gQXZvaWQgdHJ1bmNhdGlvbiBlZmZlY3RzIGluIHBlcm11dGF0aW9uXFxuICB2ZWMzIHAgPSBwZXJtdXRlXzFfMSggcGVybXV0ZV8xXzEoIGkueSArIHZlYzMoMC4wLCBpMS55LCAxLjAgKSlcXG4gICAgKyBpLnggKyB2ZWMzKDAuMCwgaTEueCwgMS4wICkpO1xcblxcbiAgdmVjMyBtID0gbWF4KDAuNSAtIHZlYzMoZG90KHgwLHgwKSwgZG90KHgxMi54eSx4MTIueHkpLCBkb3QoeDEyLnp3LHgxMi56dykpLCAwLjApO1xcbiAgbSA9IG0qbSA7XFxuICBtID0gbSptIDtcXG5cXG4vLyBHcmFkaWVudHM6IDQxIHBvaW50cyB1bmlmb3JtbHkgb3ZlciBhIGxpbmUsIG1hcHBlZCBvbnRvIGEgZGlhbW9uZC5cXG4vLyBUaGUgcmluZyBzaXplIDE3KjE3ID0gMjg5IGlzIGNsb3NlIHRvIGEgbXVsdGlwbGUgb2YgNDEgKDQxKjcgPSAyODcpXFxuXFxuICB2ZWMzIHggPSAyLjAgKiBmcmFjdChwICogQy53d3cpIC0gMS4wO1xcbiAgdmVjMyBoID0gYWJzKHgpIC0gMC41O1xcbiAgdmVjMyBveCA9IGZsb29yKHggKyAwLjUpO1xcbiAgdmVjMyBhMCA9IHggLSBveDtcXG5cXG4vLyBOb3JtYWxpc2UgZ3JhZGllbnRzIGltcGxpY2l0bHkgYnkgc2NhbGluZyBtXFxuLy8gQXBwcm94aW1hdGlvbiBvZjogbSAqPSBpbnZlcnNlc3FydCggYTAqYTAgKyBoKmggKTtcXG4gIG0gKj0gMS43OTI4NDI5MTQwMDE1OSAtIDAuODUzNzM0NzIwOTUzMTQgKiAoIGEwKmEwICsgaCpoICk7XFxuXFxuLy8gQ29tcHV0ZSBmaW5hbCBub2lzZSB2YWx1ZSBhdCBQXFxuICB2ZWMzIGc7XFxuICBnLnggID0gYTAueCAgKiB4MC54ICArIGgueCAgKiB4MC55O1xcbiAgZy55eiA9IGEwLnl6ICogeDEyLnh6ICsgaC55eiAqIHgxMi55dztcXG4gIHJldHVybiAxMzAuMCAqIGRvdChtLCBnKTtcXG59XFxuXFxuXFxuXFxuLy8gdmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuLy8gdW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXIwO1xcblxcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgcGVybVRleHR1cmU7XFxudW5pZm9ybSBzYW1wbGVyMkQgc2ltcGxleFRleHR1cmU7XFxudW5pZm9ybSBzYW1wbGVyMkQgZmxvb3JUZXh0dXJlO1xcblxcbnVuaWZvcm0gZmxvYXQgZmFkZXJWYWw7XFxuXFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxudmFyeWluZyB2ZWMzIHZUZXh0dXJlQ29vcmQ7XFxuXFxuI2RlZmluZSBQSSAzLjE0MTU5MjY1MzU4OTc5M1xcbiNkZWZpbmUgT05FIDAuMDAzOTA2MjVcXG4jZGVmaW5lIE9ORUhBTEYgMC4wMDE5NTMxMjVcXG5cXG4vKlxcbiAqIDNEIHNpbXBsZXggbm9pc2UuIENvbXBhcmFibGUgaW4gc3BlZWQgdG8gY2xhc3NpYyBub2lzZSwgYmV0dGVyIGxvb2tpbmcuXFxuICovXFxuZmxvYXQgc25vaXNlKHZlYzMgUCl7XFxuXFxuXFx0Ly8gVGhlIHNrZXdpbmcgYW5kIHVuc2tld2luZyBmYWN0b3JzIGFyZSBtdWNoIHNpbXBsZXIgZm9yIHRoZSAzRCBjYXNlXFxuXFx0I2RlZmluZSBGMyAwLjMzMzMzMzMzMzMzM1xcblxcdCNkZWZpbmUgRzMgMC4xNjY2NjY2NjY2NjdcXG5cXG4gIC8vIFNrZXcgdGhlICh4LHkseikgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIGNlbGwgb2YgNiBzaW1wbGljZXMgd2UncmUgaW5cXG5cXHRmbG9hdCBzID0gKFAueCArIFAueSArIFAueikgKiBGMzsgLy8gRmFjdG9yIGZvciAzRCBza2V3aW5nXFxuXFx0dmVjMyBQaSA9IGZsb29yKFAgKyBzKTtcXG5cXHRmbG9hdCB0ID0gKFBpLnggKyBQaS55ICsgUGkueikgKiBHMztcXG5cXHR2ZWMzIFAwID0gUGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6KSBzcGFjZVxcblxcdFBpID0gUGkgKiBPTkUgKyBPTkVIQUxGOyAvLyBJbnRlZ2VyIHBhcnQsIHNjYWxlZCBhbmQgb2Zmc2V0IGZvciB0ZXh0dXJlIGxvb2t1cFxcblxcblxcdHZlYzMgUGYwID0gUCAtIFAwOyAgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cXG5cXG4gIC8vIC8vIEZvciB0aGUgM0QgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYSBzbGlnaHRseSBpcnJlZ3VsYXIgdGV0cmFoZWRyb24uXFxuICAvLyAvLyBUbyBmaW5kIG91dCB3aGljaCBvZiB0aGUgc2l4IHBvc3NpYmxlIHRldHJhaGVkcmEgd2UncmUgaW4sIHdlIG5lZWQgdG9cXG4gIC8vIC8vIGRldGVybWluZSB0aGUgbWFnbml0dWRlIG9yZGVyaW5nIG9mIHgsIHkgYW5kIHogY29tcG9uZW50cyBvZiBQZjAuXFxuICAvLyAvLyBUaGUgbWV0aG9kIGJlbG93IGlzIGV4cGxhaW5lZCBicmllZmx5IGluIHRoZSBDIGNvZGUuIEl0IHVzZXMgYSBzbWFsbFxcbiAgLy8gLy8gMUQgdGV4dHVyZSBhcyBhIGxvb2t1cCB0YWJsZS4gVGhlIHRhYmxlIGlzIGRlc2lnbmVkIHRvIHdvcmsgZm9yIGJvdGhcXG4gIC8vIC8vIDNEIGFuZCA0RCBub2lzZSwgc28gb25seSA4IChvbmx5IDYsIGFjdHVhbGx5KSBvZiB0aGUgNjQgaW5kaWNlcyBhcmVcXG4gIC8vIC8vIHVzZWQgaGVyZS5cXG5cXHRmbG9hdCBjMSA9IChQZjAueCA+IFBmMC55KSA/IDAuNTA3ODEyNSA6IDAuMDA3ODEyNTsgLy8gMS8yICsgMS8xMjhcXG5cXHRmbG9hdCBjMiA9IChQZjAueCA+IFBmMC56KSA/IDAuMjUgOiAwLjA7XFxuXFx0ZmxvYXQgYzMgPSAoUGYwLnkgPiBQZjAueikgPyAwLjEyNSA6IDAuMDtcXG5cXHRmbG9hdCBzaW5kZXggPSBjMSArIGMyICsgYzM7XFxuIFxcdHZlYzMgb2Zmc2V0cyA9IHRleHR1cmUyRChzaW1wbGV4VGV4dHVyZSwgdmVjMihzaW5kZXgsIDApKS5yZ2I7XFxuXFx0dmVjMyBvMSA9IHN0ZXAoMC4zNzUsIG9mZnNldHMpO1xcblxcdHZlYzMgbzIgPSBzdGVwKDAuMTI1LCBvZmZzZXRzKTtcXG5cXG4gIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbiBmcm9tIHNpbXBsZXggb3JpZ2luXFxuICBmbG9hdCBwZXJtMCA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgUGkueHkpLmE7XFxuICB2ZWMzICBncmFkMCA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgdmVjMihwZXJtMCwgUGkueikpLnJnYiAqIDQuMCAtIDEuMDtcXG4gIGZsb2F0IHQwID0gMC42IC0gZG90KFBmMCwgUGYwKTtcXG4gIGZsb2F0IG4wO1xcbiAgaWYgKHQwIDwgMC4wKSBuMCA9IDAuMDtcXG4gIGVsc2Uge1xcbiAgICB0MCAqPSB0MDtcXG4gICAgbjAgPSB0MCAqIHQwICogZG90KGdyYWQwLCBQZjApO1xcbiAgfVxcblxcbiAgLy8gTm9pc2UgY29udHJpYnV0aW9uIGZyb20gc2Vjb25kIGNvcm5lclxcbiAgdmVjMyBQZjEgPSBQZjAgLSBvMSArIEczO1xcbiAgZmxvYXQgcGVybTEgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIFBpLnh5ICsgbzEueHkqT05FKS5hO1xcbiAgdmVjMyAgZ3JhZDEgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIHZlYzIocGVybTEsIFBpLnogKyBvMS56Kk9ORSkpLnJnYiAqIDQuMCAtIDEuMDtcXG4gIGZsb2F0IHQxID0gMC42IC0gZG90KFBmMSwgUGYxKTtcXG4gIGZsb2F0IG4xO1xcbiAgaWYgKHQxIDwgMC4wKSBuMSA9IDAuMDtcXG4gIGVsc2Uge1xcbiAgICB0MSAqPSB0MTtcXG4gICAgbjEgPSB0MSAqIHQxICogZG90KGdyYWQxLCBQZjEpO1xcbiAgfVxcbiAgXFxuICAvLyBOb2lzZSBjb250cmlidXRpb24gZnJvbSB0aGlyZCBjb3JuZXJcXG4gIHZlYzMgUGYyID0gUGYwIC0gbzIgKyAyLjAgKiBHMztcXG4gIGZsb2F0IHBlcm0yID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCBQaS54eSArIG8yLnh5Kk9ORSkuYTtcXG4gIHZlYzMgIGdyYWQyID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCB2ZWMyKHBlcm0yLCBQaS56ICsgbzIueipPTkUpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICBmbG9hdCB0MiA9IDAuNiAtIGRvdChQZjIsIFBmMik7XFxuICBmbG9hdCBuMjtcXG4gIGlmICh0MiA8IDAuMCkgbjIgPSAwLjA7XFxuICBlbHNlIHtcXG4gICAgdDIgKj0gdDI7XFxuICAgIG4yID0gdDIgKiB0MiAqIGRvdChncmFkMiwgUGYyKTtcXG4gIH1cXG4gIFxcbiAgLy8gTm9pc2UgY29udHJpYnV0aW9uIGZyb20gbGFzdCBjb3JuZXJcXG4gIHZlYzMgUGYzID0gUGYwIC0gdmVjMygxLjAtMy4wKkczKTtcXG4gIGZsb2F0IHBlcm0zID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCBQaS54eSArIHZlYzIoT05FLCBPTkUpKS5hO1xcbiAgdmVjMyAgZ3JhZDMgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIHZlYzIocGVybTMsIFBpLnogKyBPTkUpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICBmbG9hdCB0MyA9IDAuNiAtIGRvdChQZjMsIFBmMyk7XFxuICBmbG9hdCBuMztcXG4gIGlmKHQzIDwgMC4wKSBuMyA9IDAuMDtcXG4gIGVsc2Uge1xcbiAgICB0MyAqPSB0MztcXG4gICAgbjMgPSB0MyAqIHQzICogZG90KGdyYWQzLCBQZjMpO1xcbiAgfVxcblxcbiAgLy8gU3VtIHVwIGFuZCBzY2FsZSB0aGUgcmVzdWx0IHRvIGNvdmVyIHRoZSByYW5nZSBbLTEsMV1cXG4gIHJldHVybiAzMi4wICogKG4wICsgbjEgKyBuMiArIG4zKTtcXG59XFxuXFxuXFxuZmxvYXQgcHVsc2UoZmxvYXQgdGltZSkge1xcbiAgICAvLyBjb25zdCBmbG9hdCBwaSA9IDMuMTQ7XFxuICAgIGZsb2F0IGZyZXF1ZW5jeSA9IDEuMDtcXG4gICAgcmV0dXJuIDAuNSooMS4wK3NpbigyLjAgKiBQSSAqIGZyZXF1ZW5jeSAqIHRpbWUpKTtcXG59XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyMCwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcblxcbiAgICB2ZWMzIGZsb29yQ29sb3IgPSB0ZXh0dXJlMkQoZmxvb3JUZXh0dXJlLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSkucmdiO1xcblxcbiAgICBmbG9hdCB2ZXJ0ZXhNdWx0aXBsaWVyID0gMi4wIC8gYW5nbGU7XFxuXFxuICAgIC8vIGZsb2F0IGJyaWdodG5lc3MgPSBzbm9pc2VfMV8yKGZsb29yQ29sb3IucmIvKChhbmdsZSsuNCkqMS4yKSk7XFxuXFxuICAgIGZsb2F0IG4gPSBzbm9pc2UoIChmbG9vckNvbG9yLnJnYi8oKGFuZ2xlKy4wNSkqMi4yKSkgKTtcXG5cXHQvLyBmbG9hdCBuID0gc25vaXNlKHZlYzModmVydGV4TXVsdGlwbGllciAqIHZWZXJ0ZXhQb3MgKiAoKGFuZ2xlL2ZhZGVyVmFsKSAqMS4wICkgKSk7XFxuICAvLyBmbG9hdCBuID0gc25vaXNlKCh2VmVydGV4UG9zL2FuZ2xlKSAqIHNpbih2ZXJ0ZXhNdWx0aXBsaWVyICogUEkpKTtcXG5cXG5cXHQvLyBuID0gc25vaXNlKHZlYzModmVydGV4TXVsdGlwbGllciAqIHZWZXJ0ZXhQb3MgKiAoYXVkaW9MZXZlbEhpZ2gvYXVkaW9MZXZlbE5vaXNlRGl2aWRlcikgKSk7XFxuXFxuICAgIFxcblxcbiAgICB2ZWMzIGZpbmFsQ29sb3IgPSBtaXgodmVjMyhuKSxmbG9vckNvbG9yLDEuMCAtIGZhZGVyVmFsKTtcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdmVjNChmbG9vckNvbG9yLDEuMCk7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZmluYWxDb2xvciwgMS4wKTtcXG59XCIpO1xuXHR0aGlzLl92QmFja2dyb3VuZC50cmFuc2Zvcm1zID0gdGhpcy5vcnRob1RyYW5zZm9ybXM7XG5cblx0dGhpcy5fdkNvcHkgPSBuZXcgVmlld1BsYWluKCk7XG5cdHRoaXMuX3ZDb3B5LmluaXQoXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cIiwgXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyMDtcXG5cXG51bmlmb3JtIGZsb2F0IGZib1c7XFxudW5pZm9ybSBmbG9hdCBmYm9IO1xcblxcbnVuaWZvcm0gZmxvYXQgd2luVztcXG51bmlmb3JtIGZsb2F0IHdpbkg7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXG5cXHRmbG9hdCBzY2FsZVcgPSBmYm9XIC8gd2luVztcXG5cXHRmbG9hdCBzY2FsZUggPSBmYm9IIC8gd2luSDtcXG5cXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyMCwgdmVjMih2VGV4dHVyZUNvb3JkLnMvc2NhbGVXLCB2VGV4dHVyZUNvb3JkLnQvc2NhbGVIKSk7XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDAuMCwgMS4wKTtcXG59XCIpO1xuXHR0aGlzLl92Q29weS50cmFuc2Zvcm1zID0gdGhpcy5vcnRob1RyYW5zZm9ybXM7XG5cblxuXHR0aGlzLl92V2FsbHMgPSBuZXcgVmlld1dhbGxzKCk7XG5cdHRoaXMuX3ZXYWxscy5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXHR2ZWM0IG12UG9zaXRpb24gPSB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIG12UG9zaXRpb247XFxuICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuXFxuICAgIHZWZXJ0ZXhQb3MgPSBhVmVydGV4UG9zaXRpb247XFxuICBcXG5cXG5cXG5cXG5cXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdmlkZW9UZXh0dXJlO1xcblxcblxcbnVuaWZvcm0gZmxvYXQgZmJvVztcXG51bmlmb3JtIGZsb2F0IGZib0g7XFxuXFxudW5pZm9ybSBmbG9hdCB3aW5XO1xcbnVuaWZvcm0gZmxvYXQgd2luSDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG4vL25vdCB1c2VkXFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgXFxuICAgIFxcbiAgLy8gdmVjMyBmaW5hbENvbG9yID0gdmVjMyguNSwgLjUsIC41KTtcXG5cXG4gIGZsb2F0IHNjYWxlVyA9IGZib1cgLyB3aW5XO1xcbiAgZmxvYXQgc2NhbGVIID0gZmJvSCAvIHdpbkg7XFxuICAgXFxuICAvL3dhbGxzXFxuICB2ZWM0IHZpZGVvQ29sb3IgPSB0ZXh0dXJlMkQodmlkZW9UZXh0dXJlLCB2ZWMyKHZUZXh0dXJlQ29vcmQucy9zY2FsZVcsIHZUZXh0dXJlQ29vcmQudC9zY2FsZUgpKTtcXG4gIC8vIGZpbmFsQ29sb3IgPSB2aWRlb0NvbG9yLnJnYjtcXG4gICAgXFxuICAgIFxcblxcbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2aWRlb0NvbG9yKTtcXG4gICBcXG59XCIpO1xuXHR0aGlzLl92V2FsbHMudHJhbnNmb3JtcyA9IHRoaXMudHJhbnNmb3Jtcztcblx0Ly8gdGhpcy5fdmlld3MucHVzaCh0aGlzLl92V2FsbHMpO1xuXG5cdHRoaXMuX3ZSb29mID0gbmV3IFZpZXdSb29mKCk7XG5cdHRoaXMuX3ZSb29mLmluaXQoXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG5cXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcdHZlYzQgbXZQb3NpdGlvbiA9IHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogbXZQb3NpdGlvbjtcXG4gIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG5cXG4gICAgdlZlcnRleFBvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gIFxcblxcblxcblxcblxcbn1cIiwgXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB2aWRlb1RleHR1cmU7XFxudW5pZm9ybSBzYW1wbGVyMkQgY29uY3JldGVUZXh0dXJlO1xcblxcbnVuaWZvcm0gZmxvYXQgYXVkaW9MZXZlbERlZXA7XFxudW5pZm9ybSBmbG9hdCBhdWRpb0xldmVsSGlnaDtcXG5cXG51bmlmb3JtIGZsb2F0IGZib1c7XFxudW5pZm9ybSBmbG9hdCBmYm9IO1xcblxcbnVuaWZvcm0gZmxvYXQgd2luVztcXG51bmlmb3JtIGZsb2F0IHdpbkg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgXFxuICAgIHZlYzMgZmluYWxDb2xvciA9IHZlYzMoMC41LCAwLjUsIDAuNSk7XFxuICAgIGZsb2F0IGFscGhhID0gMS4wO1xcbiAgICBmbG9hdCByZWZsTGltaXQgPSAuMDI7XFxuXFxuICAgIGZsb2F0IHNjYWxlVyA9IGZib1cgLyB3aW5XO1xcbiAgICBmbG9hdCBzY2FsZUggPSBmYm9IIC8gd2luSDtcXG5cXG4gICAgdmVjNCBjb25jcmV0ZUNvbG9yID0gdGV4dHVyZTJEKGNvbmNyZXRlVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcblxcbiAgICB2ZWMyIGNvb3JkcyA9IHZUZXh0dXJlQ29vcmQ7XFxuICAgIGNvb3Jkcy5zID0gY29vcmRzLnMvc2NhbGVXO1xcbiAgICBjb29yZHMudCA9IGNvb3Jkcy50L3NjYWxlSDtcXG5cXG4gICAgZmxvYXQgbWF4UyA9IDEuMCAvIHNjYWxlVztcXG4gICAgZmxvYXQgbWF4VCA9IDEuMCAvIHNjYWxlSDtcXG5cXG4gICBcXG4gICAgZmxvYXQgcmVmbExpbWl0UyA9IG1heFMgLSByZWZsTGltaXQ7XFxuICAgIGZsb2F0IHJlZmxMaW1pdFQgPSBtYXhUIC0gcmVmbExpbWl0O1xcblxcbiAgICB2ZWM0IHZpZGVvQ29sb3JSaWdodCA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIobWF4UyAtIGNvb3Jkcy5zLCBjb29yZHMudCkpO1xcbiAgICB2ZWM0IHZpZGVvQ29sb3JCYWNrID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMihjb29yZHMudCwgY29vcmRzLnMpKTtcXG4gICAgdmVjNCB2aWRlb0NvbG9yTGVmdCA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIobWF4UyAtIGNvb3Jkcy5zLCBtYXhUIC0gY29vcmRzLnQpKTtcXG4gICAgdmVjNCB2aWRlb0NvbG9yRnJvbnQgPSB0ZXh0dXJlMkQodmlkZW9UZXh0dXJlLCB2ZWMyKGNvb3Jkcy50LCBtYXhTIC0gY29vcmRzLnMpKTtcXG5cXG4gICAgdmVjMyByZWZsRnJvbnQgPSBzbW9vdGhzdGVwKHJlZmxMaW1pdFMsIG1heFMsIG1heFMgLSBjb29yZHMucykgKiB2aWRlb0NvbG9yRnJvbnQucmdiO1xcbiAgICB2ZWMzIHJlZmxMZWZ0ID0gc21vb3Roc3RlcChyZWZsTGltaXRULCBtYXhULCBtYXhUIC0gY29vcmRzLnQpICogdmlkZW9Db2xvckxlZnQucmdiO1xcbiAgICB2ZWMzIHJlZmxSaWdodCA9IHNtb290aHN0ZXAocmVmbExpbWl0VCwgbWF4VCwgY29vcmRzLnQpICogdmlkZW9Db2xvclJpZ2h0LnJnYjtcXG4gICAgdmVjMyByZWZsQmFjayA9IHNtb290aHN0ZXAocmVmbExpbWl0UywgbWF4UywgY29vcmRzLnMpICogdmlkZW9Db2xvckJhY2sucmdiO1xcblxcbiAgICBmaW5hbENvbG9yID0gKGNvbmNyZXRlQ29sb3IucmdiICogKHZlYzMoLjUsIC41LCAuNSkgKiBhdWRpb0xldmVsRGVlcCkpICsgKHJlZmxGcm9udCArIHJlZmxMZWZ0ICsgcmVmbFJpZ2h0ICsgcmVmbEJhY2spO1xcblxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGZpbmFsQ29sb3IsIGFscGhhKTtcXG4gICBcXG59XCIpO1xuXHR0aGlzLl92Um9vZi50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXHQvLyB0aGlzLl92aWV3cy5wdXNoKHRoaXMuX3ZSb29mKTtcblxuXHR0aGlzLl92Rmxvb3IgPSBuZXcgVmlld0Zsb29yKCk7XG5cdHRoaXMuX3ZGbG9vci5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXHR2ZWM0IG12UG9zaXRpb24gPSB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIG12UG9zaXRpb247XFxuICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuXFxuICAgIHZWZXJ0ZXhQb3MgPSBhVmVydGV4UG9zaXRpb247XFxuICBcXG5cXG5cXG5cXG5cXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdmlkZW9UZXh0dXJlO1xcbnVuaWZvcm0gc2FtcGxlcjJEIGNvbmNyZXRlVGV4dHVyZTtcXG5cXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxEZWVwO1xcbnVuaWZvcm0gZmxvYXQgYXVkaW9MZXZlbEhpZ2g7XFxuXFxudW5pZm9ybSBmbG9hdCBmYm9XO1xcbnVuaWZvcm0gZmxvYXQgZmJvSDtcXG5cXG51bmlmb3JtIGZsb2F0IHdpblc7XFxudW5pZm9ybSBmbG9hdCB3aW5IO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIFxcbiAgdmVjMyBmaW5hbENvbG9yID0gdmVjMygwLjUsIDAuNSwgMC41KTtcXG4gIGZsb2F0IGFscGhhID0gMS4wO1xcbiAgZmxvYXQgcmVmbExpbWl0ID0gLjAyO1xcblxcbiAgZmxvYXQgc2NhbGVXID0gZmJvVyAvIHdpblc7XFxuICBmbG9hdCBzY2FsZUggPSBmYm9IIC8gd2luSDtcXG5cXG4gIC8vZmxvb3JcXG4gIHZlYzQgY29uY3JldGVDb2xvciA9IHRleHR1cmUyRChjb25jcmV0ZVRleHR1cmUsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTtcXG5cXG4gIHZlYzIgY29vcmRzID0gdlRleHR1cmVDb29yZDtcXG4gIGNvb3Jkcy5zID0gY29vcmRzLnMvc2NhbGVXO1xcbiAgY29vcmRzLnQgPSBjb29yZHMudC9zY2FsZUg7XFxuXFxuICBmbG9hdCBtYXhTID0gMS4wIC8gc2NhbGVXO1xcbiAgZmxvYXQgbWF4VCA9IDEuMCAvIHNjYWxlSDtcXG5cXG4gIGZsb2F0IHJlZmxMaW1pdFMgPSBtYXhTIC0gcmVmbExpbWl0O1xcbiAgZmxvYXQgcmVmbExpbWl0VCA9IG1heFQgLSByZWZsTGltaXQ7XFxuXFxuICB2ZWM0IHZpZGVvQ29sb3JMZWZ0ID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMihtYXhTIC0gY29vcmRzLnMsIGNvb3Jkcy50KSk7XFxuICB2ZWM0IHZpZGVvQ29sb3JGcm9udCA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIoY29vcmRzLnQsIGNvb3Jkcy5zKSk7XFxuICB2ZWM0IHZpZGVvQ29sb3JSaWdodCA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIobWF4UyAtIGNvb3Jkcy5zLCBtYXhUIC0gY29vcmRzLnQpKTtcXG4gIHZlYzQgdmlkZW9Db2xvckJhY2sgPSB0ZXh0dXJlMkQodmlkZW9UZXh0dXJlLCB2ZWMyKGNvb3Jkcy50LCBtYXhTIC0gY29vcmRzLnMpKTtcXG4gICAgXFxuICB2ZWMzIHJlZmxGcm9udCA9IHNtb290aHN0ZXAocmVmbExpbWl0UywgbWF4UywgbWF4UyAtIGNvb3Jkcy5zKSAqIHZpZGVvQ29sb3JGcm9udC5yZ2I7XFxuICB2ZWMzIHJlZmxMZWZ0ID0gc21vb3Roc3RlcChyZWZsTGltaXRULCBtYXhULCBtYXhUIC0gY29vcmRzLnQpICogdmlkZW9Db2xvckxlZnQucmdiO1xcbiAgdmVjMyByZWZsUmlnaHQgPSBzbW9vdGhzdGVwKHJlZmxMaW1pdFQsIG1heFQsIGNvb3Jkcy50KSAqIHZpZGVvQ29sb3JSaWdodC5yZ2I7XFxuICB2ZWMzIHJlZmxCYWNrID0gc21vb3Roc3RlcChyZWZsTGltaXRTLCBtYXhTLCBjb29yZHMucykgKiB2aWRlb0NvbG9yQmFjay5yZ2I7XFxuXFxuICBmaW5hbENvbG9yID0gKGNvbmNyZXRlQ29sb3IucmdiICogKHZlYzMoLjUsIC41LCAuNSkgKiBtYXgoLjUsIGF1ZGlvTGV2ZWxEZWVwKSkpICsgKHJlZmxGcm9udCArIHJlZmxMZWZ0ICsgcmVmbFJpZ2h0ICsgcmVmbEJhY2spO1xcbiAgICBcXG5cXG5cXG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQoZmluYWxDb2xvciwgYWxwaGEpO1xcblxcbn1cIik7XG5cdHRoaXMuX3ZGbG9vci50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXHQvLyB0aGlzLl92aWV3cy5wdXNoKHRoaXMuX3ZGbG9vcik7XG5cbi8vIFx0XHR2YXIgZ3VpID0gbmV3IGRhdC5HVUkoe2xvYWQ6IHtcbi8vICAgXCJwcmVzZXRcIjogXCJEZWZhdWx0XCIsXG4vLyAgIFwiY2xvc2VkXCI6IGZhbHNlLFxuLy8gICBcInJlbWVtYmVyZWRcIjoge1xuLy8gICAgIFwiRGVmYXVsdFwiOiB7XG4vLyAgICAgICBcIjBcIjoge1xuLy8gICAgICAgICBcImNvbG9yTm9pc2VNdWx0aXBsaWVyXCI6IDEwLFxuLy8gICAgICAgICBcIm5vaXNlQmFzZUNvbG9yXCI6IFtcbi8vICAgICAgICAgICAyMDAsXG4vLyAgICAgICAgICAgMTkuOTk5OTk5OTk5OTk5OTk2LFxuLy8gICAgICAgICAgIDYyLjM1Mjk0MTE3NjQ3MDU5XG4vLyAgICAgICAgIF0sXG4vLyAgICAgICAgIFwiYXVkaW9MZXZlbE5vaXNlRGl2aWRlclwiOiAyNi4zNzcyMTE2ODMwMDIxMDYsXG4vLyAgICAgICAgIFwidmVydGV4TXVsdGlwbGllclwiOiAwLjM3MDIwNDk5MTg0NDIyMDYsXG4vLyAgICAgICAgIFwidXNlUHVsc2VcIjogZmFsc2Vcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIH0sXG4vLyAgIFwiZm9sZGVyc1wiOiB7XG4vLyAgICAgXCJOb2lzZVwiOiB7XG4vLyAgICAgICBcInByZXNldFwiOiBcIkRlZmF1bHRcIixcbi8vICAgICAgIFwiY2xvc2VkXCI6IGZhbHNlLFxuLy8gICAgICAgXCJmb2xkZXJzXCI6IHt9XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9fSk7XG4vLyBcdFx0Z3VpLnJlbWVtYmVyKHRoaXMuX3ZSb29tKTtcbi8vIFx0XHR2YXIgbm9pc2UgPSBndWkuYWRkRm9sZGVyKCdOb2lzZScpO1xuLy8gXHRcdG5vaXNlLmFkZCh0aGlzLl92Um9vbSwgJ2NvbG9yTm9pc2VNdWx0aXBsaWVyJywgMCwgMjAwMCk7XG4vLyBcdFx0bm9pc2UuYWRkQ29sb3IodGhpcy5fdlJvb20sICdub2lzZUJhc2VDb2xvcicpO1xuLy8gXHRcdG5vaXNlLmFkZCh0aGlzLl92Um9vbSwgJ2F1ZGlvTGV2ZWxOb2lzZURpdmlkZXInLCAxLCA0MCk7XG4vLyBcdFx0bm9pc2UuYWRkKHRoaXMuX3ZSb29tLCAndmVydGV4TXVsdGlwbGllcicsIC4xLCA1KTtcbi8vIFx0XHRub2lzZS5hZGQodGhpcy5fdlJvb20sICd1c2VQdWxzZScpO1xuLy8gXHRcdG5vaXNlLm9wZW4oKTtcblxuXHR0aGlzLl92VmlkZW8gPSBuZXcgVmlld1ZpZGVvKCk7XG5cdHRoaXMuX3ZWaWRlby5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB2aWRlb1RleHR1cmU7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDEuMCk7XFxufVwiKTtcblx0dGhpcy5fdlZpZGVvLnRyYW5zZm9ybXMgPSB0aGlzLnRyYW5zZm9ybXM7XG5cdC8vIHRoaXMuX3ZpZXdzLnB1c2godGhpcy5fdlZpZGVvKTtcblxuXHR0aGlzLl92UHJpc20gPSBuZXcgVmlld1ByaXNtKCk7XG5cdHRoaXMuX3ZQcmlzbS5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuYXR0cmlidXRlIHZlYzMgYUFkakluZGV4O1xcbmF0dHJpYnV0ZSBmbG9hdCBhVXNlSW52ZXJzZTtcXG5cXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXG5cXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxEZWVwO1xcbnVuaWZvcm0gZmxvYXQgYXVkaW9MZXZlbEhpZ2g7XFxuXFxudW5pZm9ybSBmbG9hdCBhbmdsZTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBcXG4gICAgdmVjMyBuZXdQb3NpdGlvbiA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG5cXG4gICAgaWYgKGFVc2VJbnZlcnNlID09IDIuMClcXG4gICBcXHRcXHRuZXdQb3NpdGlvbi54eSArPSBzaW4oMS41ICogMy4xNCAqIGFuZ2xlKSAqIGFBZGpJbmRleC55O1xcbiAgIFxcdGVsc2UgaWYgKGFVc2VJbnZlcnNlID09IDEuMCl7XFxuICAgXFx0XFx0bmV3UG9zaXRpb24ueHkgKz0gY29zKC43ICogMy4xNCAqIGFuZ2xlKSAqIGFBZGpJbmRleC55O1xcbiAgIFxcdH1cXG4gICAgLy8gaWYgKGFBZGpJbmRleC54IDwgMC4wKVxcbiAgIFxcdC8vIG5ld1Bvc2l0aW9uLnggKz0gYXVkaW9MZXZlbERlZXAgKiBhQWRqSW5kZXgueDtcXG4gICBcXHQvLyBlbHNlIGlmIChhQWRqSW5kZXgueCA+IDAuMClcXG4gICBcXHRcXHQvLyBuZXdQb3NpdGlvbi55IC09IGF1ZGlvTGV2ZWxEZWVwICogYUFkakluZGV4Lng7XFxuICBcXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIHVNVk1hdHJpeCAqIHZlYzQobmV3UG9zaXRpb24sIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcblxcblxcbn1cIiwgXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHZpZGVvVGV4dHVyZTtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodmlkZW9UZXh0dXJlLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSk7XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTtcXG59XCIpO1xuXHR0aGlzLl92UHJpc20udHJhbnNmb3JtcyA9IHRoaXMubGVmdFdhbGxUcmFuc2Zvcm1zO1xuXHQvLyB0aGlzLl92aWV3cy5wdXNoKHRoaXMuX3ZQcmlzbSk7XG5cblx0dGhpcy5fdkxlZnRXYWxsID0gbmV3IFZpZXdMZWZ0V2FsbCgpO1xuXHR0aGlzLl92TGVmdFdhbGwuaW5pdChcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0NCB1TVZNYXRyaXg7XFxudW5pZm9ybSBtYXQ0IHVQTWF0cml4O1xcblxcblxcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcblxcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuXFx0dmVjNCBtdlBvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtdlBvc2l0aW9uO1xcbiAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcblxcbiAgICB2VmVydGV4UG9zID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgXFxuXFxuXFxuXFxuXFxufVwiLCBcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHNpbXBsZXhUZXh0dXJlO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHBlcm1UZXh0dXJlO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHZpZGVvVGV4dHVyZTtcXG5cXG5cXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxEZWVwO1xcbnVuaWZvcm0gZmxvYXQgYXVkaW9MZXZlbEhpZ2g7XFxuXFxuLy9kYXRndWkgcHJvcHNcXG51bmlmb3JtIGZsb2F0IGNvbG9yTm9pc2VNdWx0aXBsaWVyO1xcbnVuaWZvcm0gdmVjMyBub2lzZUJhc2VDb2xvcjtcXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxOb2lzZURpdmlkZXI7XFxudW5pZm9ybSBmbG9hdCB2ZXJ0ZXhNdWx0aXBsaWVyO1xcbnVuaWZvcm0gaW50IHVzZVB1bHNlO1xcblxcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcblxcblxcbiNkZWZpbmUgUEkgMy4xNDE1OTI2NTM1ODk3OTNcXG4jZGVmaW5lIE9ORSAwLjAwMzkwNjI1XFxuI2RlZmluZSBPTkVIQUxGIDAuMDAxOTUzMTI1XFxuXFxuLypcXG4gKiAzRCBzaW1wbGV4IG5vaXNlLiBDb21wYXJhYmxlIGluIHNwZWVkIHRvIGNsYXNzaWMgbm9pc2UsIGJldHRlciBsb29raW5nLlxcbiAqL1xcbmZsb2F0IHNub2lzZSh2ZWMzIFApe1xcblxcblxcdC8vIFRoZSBza2V3aW5nIGFuZCB1bnNrZXdpbmcgZmFjdG9ycyBhcmUgbXVjaCBzaW1wbGVyIGZvciB0aGUgM0QgY2FzZVxcblxcdCNkZWZpbmUgRjMgMC4zMzMzMzMzMzMzMzNcXG5cXHQjZGVmaW5lIEczIDAuMTY2NjY2NjY2NjY3XFxuXFxuICAvLyBTa2V3IHRoZSAoeCx5LHopIHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBjZWxsIG9mIDYgc2ltcGxpY2VzIHdlJ3JlIGluXFxuXFx0ZmxvYXQgcyA9IChQLnggKyBQLnkgKyBQLnopICogRjM7IC8vIEZhY3RvciBmb3IgM0Qgc2tld2luZ1xcblxcdHZlYzMgUGkgPSBmbG9vcihQICsgcyk7XFxuXFx0ZmxvYXQgdCA9IChQaS54ICsgUGkueSArIFBpLnopICogRzM7XFxuXFx0dmVjMyBQMCA9IFBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcXG5cXHRQaSA9IFBpICogT05FICsgT05FSEFMRjsgLy8gSW50ZWdlciBwYXJ0LCBzY2FsZWQgYW5kIG9mZnNldCBmb3IgdGV4dHVyZSBsb29rdXBcXG5cXG5cXHR2ZWMzIFBmMCA9IFAgLSBQMDsgIC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXFxuXFxuICAvLyAvLyBGb3IgdGhlIDNEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGEgc2xpZ2h0bHkgaXJyZWd1bGFyIHRldHJhaGVkcm9uLlxcbiAgLy8gLy8gVG8gZmluZCBvdXQgd2hpY2ggb2YgdGhlIHNpeCBwb3NzaWJsZSB0ZXRyYWhlZHJhIHdlJ3JlIGluLCB3ZSBuZWVkIHRvXFxuICAvLyAvLyBkZXRlcm1pbmUgdGhlIG1hZ25pdHVkZSBvcmRlcmluZyBvZiB4LCB5IGFuZCB6IGNvbXBvbmVudHMgb2YgUGYwLlxcbiAgLy8gLy8gVGhlIG1ldGhvZCBiZWxvdyBpcyBleHBsYWluZWQgYnJpZWZseSBpbiB0aGUgQyBjb2RlLiBJdCB1c2VzIGEgc21hbGxcXG4gIC8vIC8vIDFEIHRleHR1cmUgYXMgYSBsb29rdXAgdGFibGUuIFRoZSB0YWJsZSBpcyBkZXNpZ25lZCB0byB3b3JrIGZvciBib3RoXFxuICAvLyAvLyAzRCBhbmQgNEQgbm9pc2UsIHNvIG9ubHkgOCAob25seSA2LCBhY3R1YWxseSkgb2YgdGhlIDY0IGluZGljZXMgYXJlXFxuICAvLyAvLyB1c2VkIGhlcmUuXFxuXFx0ZmxvYXQgYzEgPSAoUGYwLnggPiBQZjAueSkgPyAwLjUwNzgxMjUgOiAwLjAwNzgxMjU7IC8vIDEvMiArIDEvMTI4XFxuXFx0ZmxvYXQgYzIgPSAoUGYwLnggPiBQZjAueikgPyAwLjI1IDogMC4wO1xcblxcdGZsb2F0IGMzID0gKFBmMC55ID4gUGYwLnopID8gMC4xMjUgOiAwLjA7XFxuXFx0ZmxvYXQgc2luZGV4ID0gYzEgKyBjMiArIGMzO1xcbiBcXHR2ZWMzIG9mZnNldHMgPSB0ZXh0dXJlMkQoc2ltcGxleFRleHR1cmUsIHZlYzIoc2luZGV4LCAwKSkucmdiO1xcblxcdHZlYzMgbzEgPSBzdGVwKDAuMzc1LCBvZmZzZXRzKTtcXG5cXHR2ZWMzIG8yID0gc3RlcCgwLjEyNSwgb2Zmc2V0cyk7XFxuXFxuICAvLyBOb2lzZSBjb250cmlidXRpb24gZnJvbSBzaW1wbGV4IG9yaWdpblxcbiAgZmxvYXQgcGVybTAgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIFBpLnh5KS5hO1xcbiAgdmVjMyAgZ3JhZDAgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIHZlYzIocGVybTAsIFBpLnopKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICBmbG9hdCB0MCA9IDAuNiAtIGRvdChQZjAsIFBmMCk7XFxuICBmbG9hdCBuMDtcXG4gIGlmICh0MCA8IDAuMCkgbjAgPSAwLjA7XFxuICBlbHNlIHtcXG4gICAgdDAgKj0gdDA7XFxuICAgIG4wID0gdDAgKiB0MCAqIGRvdChncmFkMCwgUGYwKTtcXG4gIH1cXG5cXG4gIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbiBmcm9tIHNlY29uZCBjb3JuZXJcXG4gIHZlYzMgUGYxID0gUGYwIC0gbzEgKyBHMztcXG4gIGZsb2F0IHBlcm0xID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCBQaS54eSArIG8xLnh5Kk9ORSkuYTtcXG4gIHZlYzMgIGdyYWQxID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCB2ZWMyKHBlcm0xLCBQaS56ICsgbzEueipPTkUpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICBmbG9hdCB0MSA9IDAuNiAtIGRvdChQZjEsIFBmMSk7XFxuICBmbG9hdCBuMTtcXG4gIGlmICh0MSA8IDAuMCkgbjEgPSAwLjA7XFxuICBlbHNlIHtcXG4gICAgdDEgKj0gdDE7XFxuICAgIG4xID0gdDEgKiB0MSAqIGRvdChncmFkMSwgUGYxKTtcXG4gIH1cXG4gIFxcbiAgLy8gTm9pc2UgY29udHJpYnV0aW9uIGZyb20gdGhpcmQgY29ybmVyXFxuICB2ZWMzIFBmMiA9IFBmMCAtIG8yICsgMi4wICogRzM7XFxuICBmbG9hdCBwZXJtMiA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgUGkueHkgKyBvMi54eSpPTkUpLmE7XFxuICB2ZWMzICBncmFkMiA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgdmVjMihwZXJtMiwgUGkueiArIG8yLnoqT05FKSkucmdiICogNC4wIC0gMS4wO1xcbiAgZmxvYXQgdDIgPSAwLjYgLSBkb3QoUGYyLCBQZjIpO1xcbiAgZmxvYXQgbjI7XFxuICBpZiAodDIgPCAwLjApIG4yID0gMC4wO1xcbiAgZWxzZSB7XFxuICAgIHQyICo9IHQyO1xcbiAgICBuMiA9IHQyICogdDIgKiBkb3QoZ3JhZDIsIFBmMik7XFxuICB9XFxuICBcXG4gIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbiBmcm9tIGxhc3QgY29ybmVyXFxuICB2ZWMzIFBmMyA9IFBmMCAtIHZlYzMoMS4wLTMuMCpHMyk7XFxuICBmbG9hdCBwZXJtMyA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgUGkueHkgKyB2ZWMyKE9ORSwgT05FKSkuYTtcXG4gIHZlYzMgIGdyYWQzID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCB2ZWMyKHBlcm0zLCBQaS56ICsgT05FKSkucmdiICogNC4wIC0gMS4wO1xcbiAgZmxvYXQgdDMgPSAwLjYgLSBkb3QoUGYzLCBQZjMpO1xcbiAgZmxvYXQgbjM7XFxuICBpZih0MyA8IDAuMCkgbjMgPSAwLjA7XFxuICBlbHNlIHtcXG4gICAgdDMgKj0gdDM7XFxuICAgIG4zID0gdDMgKiB0MyAqIGRvdChncmFkMywgUGYzKTtcXG4gIH1cXG5cXG4gIC8vIFN1bSB1cCBhbmQgc2NhbGUgdGhlIHJlc3VsdCB0byBjb3ZlciB0aGUgcmFuZ2UgWy0xLDFdXFxuICByZXR1cm4gMzIuMCAqIChuMCArIG4xICsgbjIgKyBuMyk7XFxufVxcblxcbmZsb2F0IHB1bHNlKGZsb2F0IHRpbWUpIHtcXG4gICAgLy8gY29uc3QgZmxvYXQgcGkgPSAzLjE0O1xcbiAgICBmbG9hdCBmcmVxdWVuY3kgPSAxLjA7XFxuICAgIHJldHVybiAwLjUqKDEuMCtzaW4oMi4wICogUEkgKiBmcmVxdWVuY3kgKiB0aW1lKSk7XFxufVxcblxcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgXFxuICAgIGZsb2F0IG4gPSAwLjA7XFxuICAgIGlmICh1c2VQdWxzZSA9PSAxKVxcbiAgICAgIG4gPSBzbm9pc2UodmVjMyh2ZXJ0ZXhNdWx0aXBsaWVyICogdlZlcnRleFBvcyAqIChwdWxzZShhdWRpb0xldmVsSGlnaC9hdWRpb0xldmVsTm9pc2VEaXZpZGVyKSApKSk7XFxuICAgIGVsc2VcXG4gICAgICBuID0gc25vaXNlKHZlYzModmVydGV4TXVsdGlwbGllciAqIHZWZXJ0ZXhQb3MgKiAoYXVkaW9MZXZlbEhpZ2gvYXVkaW9MZXZlbE5vaXNlRGl2aWRlcikgKSk7XFxuXFxuICAgIHZlYzMgdmlkZW9Db2xvciA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKS5yZ2I7XFxuXFxuICAgIC8vIHZlYzMgZmluYWxDb2xvciA9IHZlYzMoYXVkaW9MZXZlbERlZXAsIGF1ZGlvTGV2ZWxEZWVwLCAwLjMpO1xcbiAgICB2ZWMzIGZpbmFsQ29sb3IgPSB2ZWMzKG5vaXNlQmFzZUNvbG9yLnIvMjU1LjAsIG5vaXNlQmFzZUNvbG9yLmcvMjU1LjAsIG5vaXNlQmFzZUNvbG9yLmIvMjU1LjApICogdmlkZW9Db2xvciAqIChuICogY29sb3JOb2lzZU11bHRpcGxpZXIpO1xcblxcbiAgICBmbG9hdCBhVmFsID0gMS4wO1xcbiAgICBcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNChmaW5hbENvbG9yLCBhVmFsKTtcXG4gICBcXG59XCIpO1xuXHR0aGlzLl92TGVmdFdhbGwudHJhbnNmb3JtcyA9IHRoaXMubGVmdFdhbGxUcmFuc2Zvcm1zO1xuXHQvLyB0aGlzLl92aWV3cy5wdXNoKHRoaXMuX3ZMZWZ0V2FsbCk7XG5cblx0Ly8gSW1wb3J0c1xuXHR0aGlzLl92Q2lyY2xlID0gbmV3IFZpZXdJbXBvcnQoKTtcblx0dGhpcy5fdkNpcmNsZS5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleE5vcm1hbDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4Q29sb3I7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxudW5pZm9ybSBtYXQ0IHVOTWF0cml4O1xcblxcbnVuaWZvcm0gdmVjMyB1TGlnaHRQb3NpdGlvbjtcXG5cXG51bmlmb3JtIHZlYzMgdU1hdGVyaWFsRGlmZnVzZTtcXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG52YXJ5aW5nIHZlYzMgdkxpZ2h0UmF5O1xcbnZhcnlpbmcgdmVjMyB2RXllVmVjO1xcbnZhcnlpbmcgdmVjMyB2TGlnaHRpbmc7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxudmFyeWluZyB2ZWMzIHZDb2xvcjtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcblxcdC8vVHJhbnNmb3JtZWQgdmVydGV4IHBvc2l0aW9uXFxuXFx0Ly8gdmVjNCB2ZXJ0ZXggPSB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG5cXG5cXHQvLyAvL1RyYW5zZm9ybWVkIG5vcm1hbCBwb3NpdGlvblxcblxcdC8vIHZOb3JtYWwgPSB2ZWMzKHVOTWF0cml4ICogdmVjNChhVmVydGV4Tm9ybWFsLCAxLjApKTtcXG5cXG5cXHQvLyAvL1RyYW5zZm9ybWVkIGxpZ2h0IHBvc2l0aW9uXFxuXFx0Ly8gdmVjNCBsaWdodCA9IHVNVk1hdHJpeCAqIHZlYzQodUxpZ2h0UG9zaXRpb24sMS4wKTtcXG5cXG5cXHQvLyAvL0xpZ2h0IHBvc2l0aW9uXFxuXFx0Ly8gdkxpZ2h0UmF5ID0gdmVydGV4Lnh5ei1saWdodC54eXo7XFxuXFxuXFx0Ly8gLy9WZWN0b3IgRXllXFxuXFx0Ly8gdkV5ZVZlYyA9IC12ZWMzKHZlcnRleC54eXopO1xcblxcblxcdGhpZ2hwIHZlYzMgYW1iaWVudExpZ2h0ID0gdmVjMygwLjYsIDAuNiwgMC42KTtcXG4gICAgaGlnaHAgdmVjMyBkaXJlY3Rpb25hbExpZ2h0Q29sb3IgPSB2ZWMzKDAuNSwgMC41LCAwLjc1KTtcXG4gICAgaGlnaHAgdmVjMyBkaXJlY3Rpb25hbFZlY3RvciA9IHZlYzMoMC4wNSwgMC4wMDgsIDAuMDA1KTtcXG4gICAgXFxuICAgIGhpZ2hwIHZlYzQgdHJhbnNmb3JtZWROb3JtYWwgPSB1Tk1hdHJpeCAqIHZlYzQoYVZlcnRleE5vcm1hbCwgMS4wKTtcXG4gICAgXFxuICAgIGhpZ2hwIGZsb2F0IGRpcmVjdGlvbmFsID0gbWF4KGRvdCh0cmFuc2Zvcm1lZE5vcm1hbC54eXosIGRpcmVjdGlvbmFsVmVjdG9yKSwgMC4wKTtcXG4gICAgdkxpZ2h0aW5nID0gYW1iaWVudExpZ2h0ICsgKGRpcmVjdGlvbmFsTGlnaHRDb2xvciAqIGRpcmVjdGlvbmFsKTtcXG5cXG5cXG5cXG5cXHRnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbiAgICB2VmVydGV4UG9zID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgICB2Q29sb3IgPSBhVmVydGV4Q29sb3I7XFxuXFxuXFxuXFxufVwiLCBcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbi8vIHZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcblxcbnVuaWZvcm0gbWF0NCB1Tk1hdHJpeDtcXG5cXG4vLyB1bmlmb3JtIHZlYzMgZGlmZnVzZTtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB2aWRlb1RleHR1cmU7XFxuXFxudW5pZm9ybSB2ZWM0IHVMaWdodEFtYmllbnQ7XFxudW5pZm9ybSB2ZWM0IHVMaWdodERpZmZ1c2U7XFxudW5pZm9ybSB2ZWM0IHVMaWdodFNwZWN1bGFyO1xcblxcbnVuaWZvcm0gdmVjNCB1TWF0ZXJpYWxBbWJpZW50O1xcbnVuaWZvcm0gdmVjMyB1TWF0ZXJpYWxEaWZmdXNlO1xcbnVuaWZvcm0gdmVjMyB1TWF0ZXJpYWxTcGVjdWxhcjtcXG51bmlmb3JtIGZsb2F0IHVTaGluaW5lc3M7XFxuXFxudW5pZm9ybSBmbG9hdCBhdWRpb0xldmVsRGVlcDtcXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxIaWdoO1xcblxcbnZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xcbnZhcnlpbmcgdmVjMyB2TGlnaHRSYXk7XFxudmFyeWluZyB2ZWMzIHZFeWVWZWM7XFxuXFxudmFyeWluZyB2ZWMzIHZMaWdodGluZztcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG52YXJ5aW5nIHZlYzMgdkNvbG9yO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuXFxuXFx0Ly8gY29uc3QgdmVjMyBsaWdodENvbDEgPSB2ZWMzKCAwLjAsIDAuMCwgMC4wICk7XFxuIC8vICAgIGNvbnN0IHZlYzMgbGlnaHREaXIxID0gdmVjMyggLTEuMCwgMC4wLCAwLjAgKTtcXG4gLy8gICAgY29uc3QgZmxvYXQgaW50ZW5zaXR5MSA9IDEuMDtcXG5cXG4gLy8gICAgdmVjNCBsRGlyZWN0aW9uMSA9IHVOTWF0cml4ICogdmVjNCggbGlnaHREaXIxLCAwLjAgKTtcXG4gLy8gICAgdmVjMyBsaWdodFZlYzEgPSBub3JtYWxpemUoIGxEaXJlY3Rpb24xLnh5eiApO1xcblxcbiAgICAvLyBwb2ludCBsaWdodFxcblxcbiAgICAvLyBjb25zdCB2ZWMzIGxpZ2h0UG9zMiA9IHZlYzMoIDAuMCwgMC4wLCAtMjAwLjAgKTtcXG4gICAgLy8gY29uc3QgdmVjMyBsaWdodENvbDIgPSB2ZWMzKCAxLjAsIDAuNSwgMC4yICk7XFxuICAgIC8vIGNvbnN0IGZsb2F0IG1heERpc3RhbmNlMiA9IDIwMDAwLjA7XFxuICAgIC8vIGNvbnN0IGZsb2F0IGludGVuc2l0eTIgPSAxLjU7XFxuXFxuICAgIC8vIHZlYzQgbFBvc2l0aW9uID0gdU5NYXRyaXggKiB2ZWM0KCBsaWdodFBvczIsIDEuMCApO1xcbiAgICAvLyB2ZWMzIGxWZWN0b3IgPSBsUG9zaXRpb24ueHl6ICsgdlZpZXdQb3NpdGlvbi54eXo7XFxuXFxuICAgIC8vIHZlYzMgbGlnaHRWZWMyID0gbm9ybWFsaXplKCBsVmVjdG9yICk7XFxuICAgIC8vIGZsb2F0IGxEaXN0YW5jZTIgPSAxLjAgLSBtaW4oICggbGVuZ3RoKCBsVmVjdG9yICkgLyBtYXhEaXN0YW5jZTIgKSwgMS4wICk7XFxuXFxuICAgIC8vIC8vIHBvaW50IGxpZ2h0XFxuXFxuICAgIC8vIC8vIGNvbnN0IHZlYzMgbGlnaHRQb3MzID0gdmVjMyggMC4wLCAwLjAsIC0yMC4wICk7XFxuICAgIC8vIC8vIGNvbnN0IHZlYzMgbGlnaHRDb2wzID0gdmVjMygwLjAsIDEuMCwgMS4wICk7XFxuICAgIC8vIC8vIGZsb2F0IG1heERpc3RhbmNlMyA9IGF1ZGlvRW5lcmd5ICogNDAuMDtcXG4gICAgLy8gLy8gY29uc3QgZmxvYXQgaW50ZW5zaXR5MyA9IDEuNTtcXG5cXG4gICAgLy8gLy8gdmVjNCBsUG9zaXRpb24zID0gdU5NYXRyaXggKiB2ZWM0KCBsaWdodFBvczMsIDEuMCApO1xcbiAgICAvLyAvLyB2ZWMzIGxWZWN0b3IzID0gbFBvc2l0aW9uMy54eXogKyB2Vmlld1Bvc2l0aW9uLnh5ejtcXG5cXG4gICAgLy8gLy8gdmVjMyBsaWdodFZlYzMgPSBub3JtYWxpemUoIGxWZWN0b3IzICk7XFxuICAgIC8vIC8vIGZsb2F0IGxEaXN0YW5jZTMgPSAxLjAgLSBtaW4oICggbGVuZ3RoKCBsVmVjdG9yMyApIC8gbWF4RGlzdGFuY2UzICksIDEuMCApO1xcblxcbiAgICAvLyAvL1xcblxcbiAgICAvLyB2ZWMzIG5vcm1hbCA9IHZOb3JtYWw7XFxuXFxuICAgIC8vIC8vIGZsb2F0IGRpZmZ1c2UxID0gaW50ZW5zaXR5MSAqIG1heCggZG90KCBub3JtYWwsIGxpZ2h0VmVjMSApLCAwLjAgKTtcXG4gICAgLy8gZmxvYXQgZGlmZnVzZTIgPSBpbnRlbnNpdHkyICogbWF4KCBkb3QoIG5vcm1hbCwgbGlnaHRWZWMyICksIDAuMCApICogbERpc3RhbmNlMjtcXG4gICAgLy8gLy8gZmxvYXQgZGlmZnVzZTMgPSBpbnRlbnNpdHkyICogbWF4KCBkb3QoIG5vcm1hbCwgbGlnaHRWZWMzICksIDAuMCApICogbERpc3RhbmNlMztcXG5cXG4gICAgLy8gLy8gdmVjMyBjb2xvciA9IHRleHR1cmUyRCh0ZXN0VGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCApKS5yZ2I7XFxuXFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHZlYzQoZGlmZnVzZTIgKiBkaWZmdXNlLCAxLjAgKTtcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHVTYW1wbGVyMCwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDAuMDUsIDAuOCwgMC4wNSwgMS4wKTtcXG5cXG4gICAgLy8gdmVjMyBMID0gbm9ybWFsaXplKHZMaWdodFJheSk7XFxuICAgIC8vIHZlYzMgTiA9IG5vcm1hbGl6ZSh2Tm9ybWFsKTtcXG5cXG4gICAgLy8gLy9MYW1iZXJ0J3MgY29zaW5lIGxhd1xcbiAgICAvLyBmbG9hdCBsYW1iZXJ0VGVybSA9IGRvdChOLC1MKTtcXG4gICAgXFxuICAgIC8vIC8vQW1iaWVudCBUZXJtICBcXG4gICAgLy8gdmVjNCBJYSA9IHVMaWdodEFtYmllbnQgKiB1TWF0ZXJpYWxBbWJpZW50O1xcblxcbiAgICAvLyAvL0RpZmZ1c2UgVGVybVxcbiAgICAvLyB2ZWM0IElkID0gdmVjNCgwLjAsMC4wLDAuMCwxLjApO1xcblxcbiAgICAvLyAvL1NwZWN1bGFyIFRlcm1cXG4gICAgLy8gdmVjNCBJcyA9IHZlYzQoMC4wLDAuMCwwLjAsMS4wKTtcXG5cXG4gICAgLy8gaWYobGFtYmVydFRlcm0gPiAwLjApXFxuICAgIC8vIHtcXG4gICAgLy8gICAgIElkID0gdUxpZ2h0RGlmZnVzZSAqIHZlYzQodU1hdGVyaWFsRGlmZnVzZSwxLjApICogbGFtYmVydFRlcm07IFxcbiAgICAvLyAgICAgdmVjMyBFID0gbm9ybWFsaXplKHZFeWVWZWMpO1xcbiAgICAvLyAgICAgdmVjMyBSID0gcmVmbGVjdChMLCBOKTtcXG4gICAgLy8gICAgIGZsb2F0IHNwZWN1bGFyID0gcG93KCBtYXgoZG90KFIsIEUpLCAwLjApLCB1U2hpbmluZXNzKTtcXG4gICAgLy8gICAgIElzID0gdUxpZ2h0U3BlY3VsYXIgKiB2ZWM0KHVNYXRlcmlhbFNwZWN1bGFyLDEuMCkgKiBzcGVjdWxhcjtcXG4gICAgLy8gfVxcblxcbiAgICAvLyAvL0ZpbmFsIGNvbG9yXFxuICAgIC8vIHZlYzQgZmluYWxDb2xvciA9IElhICsgSWQgKyBJcztcXG4gICAgLy8gZmluYWxDb2xvci5hID0gMS4wO1xcblxcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSBmaW5hbENvbG9yO1xcblxcbiAvLyAgICB2ZWM0IElhID0gdUxpZ2h0QW1iaWVudCAqIHVNYXRlcmlhbEFtYmllbnQ7XFx0Ly9BbWJpZW50IGNvbXBvbmVudDogb25lIGZvciBhbGxcXG4gLy8gICAgdmVjNCBmaW5hbENvbG9yID0gdmVjNCgwLjAsMC4wLDAuMCwxLjApO1xcdC8vQ29sb3IgdGhhdCB3aWxsIGJlIGFzc2lnbmVkIHRvIGdsX0ZyYWdDb2xvclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcblxcdC8vIHZlYzMgTiA9IG5vcm1hbGl6ZSh2Tm9ybWFsKTtcXG5cXHQvLyB2ZWMzIEwgPSB2ZWMzKDAuMCk7XFxuXFx0Ly8gZmxvYXQgbGFtYmVydFRlcm0gPSAwLjA7XFxuXFx0XFxuXFx0Ly8gLy8gZm9yKGludCBpID0gMDsgaSA8IE5VTV9MSUdIVFM7IGkrKyl7XFx0XFx0XFx0XFx0XFx0Ly9Gb3IgZWFjaCBsaWdodFxcblxcdFxcdFxcblxcdC8vIEwgPSBub3JtYWxpemUodkxpZ2h0UmF5KTtcXHRcXHRcXHQvL0NhbGN1bGF0ZSByZWZsZXhpb25cXG5cXHQvLyBsYW1iZXJ0VGVybSA9IGRvdChOLCAtTCk7XFxuXFx0XFxuXFx0Ly8gaWYgKGxhbWJlcnRUZXJtID4gMC40KXtcXHRcXHRcXHRcXG5cXHQvLyBcXHRmaW5hbENvbG9yICs9IHVMaWdodERpZmZ1c2UgKiB2ZWM0KHVNYXRlcmlhbERpZmZ1c2UsMS4wKSAqIGxhbWJlcnRUZXJtOyAvL0FkZCBkaWZmdXNlIGNvbXBvbmVudCwgb25lIHBlciBsaWdodFxcblxcdC8vIH1cXG5cXHQvLyAvLyB9XFxuXFxuXFx0Ly8gLy9GaW5hbCBjb2xvclxcbiAvLyAgICBmaW5hbENvbG9yICs9IElhO1xcbiAvLyAgICBmaW5hbENvbG9yLmEgPSAxLjA7XFx0XFx0XFx0XFx0Ly9BZGQgYW1iaWVudCBjb21wb25lbnQ6IG9uZSBmb3IgYWxsXFx0XFx0XFx0XFx0XFx0XFxuXFx0Ly8gZ2xfRnJhZ0NvbG9yID0gZmluYWxDb2xvcjtcXHRcXHQvL1RoZSBhbHBoYSB2YWx1ZSBpbiB0aGlzIGV4YW1wbGUgd2lsbCBiZSAxLjBcXG4gICAgLy8gdmVjMyBmaW5hbENvbG9yID0gdU1hdGVyaWFsRGlmZnVzZSAqIHZMaWdodGluZztcXG4gICAgdmVjMyB2aWRlb0NvbG9yID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpLnJnYjtcXG5cXHQvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KG1peCh2aWRlb0NvbG9yLCBmaW5hbENvbG9yLCAuMyksIDEuMCk7XFxuICAgIC8vIHNtb290aHN0ZXAoMC44LCAxLjAsIDEuMCAtIHZUZXh0dXJlQ29vcmQucykgKiB2aWRlb0NvbG9yLnJnYjtcXG4gICAgZmxvYXQgeVBvcyA9IGFicyhtaW4odlZlcnRleFBvcy56LCAuMikpO1xcbiAgICBmbG9hdCBhdWRpb0xldmVsID0gYXVkaW9MZXZlbEhpZ2gvNi4zNztcXG4gICAgdmVjMyBmaW5hbENvbG9yID0gc21vb3Roc3RlcCgwLjcsIDEuMCwgYXVkaW9MZXZlbEhpZ2gvMjYuMzcpICogdmVjMygwLjUsIDEuMCwgLjcpO1xcbiAgICBmaW5hbENvbG9yID0gdmVjMyguNywgYXVkaW9MZXZlbCwgYXVkaW9MZXZlbCkgKiB5UG9zO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZDb2xvciAqIHZMaWdodGluZywgMS4wKTtcXG59XCIpO1xuXHR0aGlzLl92Q2lyY2xlLnRyYW5zZm9ybXMgPSB0aGlzLnRyYW5zZm9ybXM7XG5cdC8vIHRoaXMuX3ZpZXdzLnB1c2godGhpcy5fdkNpcmNsZSk7XG5cblxuXHQvLyB0aGlzLl92VGVzdEltcG9ydCA9IG5ldyBWaWV3SW1wb3J0KCk7XG5cdC8vIHRoaXMuX3ZUZXN0SW1wb3J0LmluaXQoXCJzaGFkZXJzL3BsYWluLnZlcnRcIiwgXCJzaGFkZXJzL3BsYWluLmZyYWdcIik7XG5cdC8vIHRoaXMuX3ZUZXN0SW1wb3J0LnRyYW5zZm9ybXMgPSB0aGlzLnRyYW5zZm9ybXM7XG5cdC8vIHRoaXMuX3ZpZXdzLnB1c2godGhpcy5fdlRlc3RJbXBvcnQpO1xuXG5cblxufTtcblxucC51cGRhdGUgPSBmdW5jdGlvbigpe1xuXG5cdHMudXBkYXRlLmNhbGwodGhpcyk7XG5cblx0aWYgKHRoaXMuaW1wb3J0c0NvbnRyb2xsZXIpXG5cdFx0dGhpcy5pbXBvcnRzQ29udHJvbGxlci51cGRhdGUodGhpcy52aWRlb1BsYXllci52aWRlby5jdXJyZW50VGltZSk7XG5cdFx0Ly8gaWYgKHRoaXMuX2NpcmNsZXNBbmltYXRpb24pXG5cdFx0Ly8gXHR0aGlzLl9jaXJjbGVzQW5pbWF0aW9uLnVwZGF0ZSgpO1xuXG5cdHRoaXMuZW5kU2NyZWVuLnVwZGF0ZSgpO1xuXHR0aGlzLmxvYWRlclNjcmVlbi51cGRhdGUoKTtcbn07XG5cblxucC5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblxuXHQvLyBkZWJ1Z2dlcjtcblxuXHR0aGlzLmVuZFNjcmVlbi5yZW5kZXIoKTtcblx0dGhpcy5sb2FkZXJTY3JlZW4ucmVuZGVyKCk7XG5cblx0Z2wuY2xlYXJDb2xvciggMCwgMCwgMCwgMSApO1xuXHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cblx0Z2wudmlld3BvcnQoMCwgMCwgZ2wudmlld3BvcnRXaWR0aCwgZ2wudmlld3BvcnRIZWlnaHQpO1xuXG5cdC8vIEZJWCBXSVRIIEdMU0xJRlkgISEhIVxuXHQvLyB2YXIgc2hhZGVyc0xvYWRlZCA9IHRydWU7XG5cdC8vIGZvciAodmFyIGk9MDtpPHRoaXMuX3ZpZXdzLmxlbmd0aDtpKyspe1xuXHQvLyBcdGlmICghdGhpcy5fdmlld3NbaV0uc2hhZGVyc0xvYWRlZCkgc2hhZGVyc0xvYWRlZCA9IGZhbHNlO1xuXHQvLyB9XG5cdC8vIGlmICghc2hhZGVyc0xvYWRlZCkgcmV0dXJuO1xuXHRcblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblx0dGhpcy50cmFuc2Zvcm1zLnNldENhbWVyYSh0aGlzLmNhbWVyYSk7XG5cblx0dGhpcy5jYW1lcmEuYXBwbHkoZ2wudmlld3BvcnRXaWR0aCAvIGdsLnZpZXdwb3J0SGVpZ2h0KTtcbiAgICB0aGlzLnRyYW5zZm9ybXMuY2FsY3VsYXRlTW9kZWxWaWV3KCk7XG5cblx0dGhpcy5hdWRpb0RhdGEgPSB0aGlzLnNwZWN0cnVtQW5hbHl6ZXIuZ2V0QXVkaW9EYXRhKCk7XG5cdC8vIGNvbnNvbGUubG9nKHRoaXMuYXVkaW9EYXRhKTtcblx0XG5cdGlmICghdGhpcy5sb2FkZXJTY3JlZW4uaXNTaG93aW5nICYmICF0aGlzLmVuZFNjcmVlbi5pc1Nob3dpbmcpe1xuXHRcdGlmICh0aGlzLnZpZGVvUGxheWVyLmlzTG9hZGVkICYmIHRoaXMuYXVkaW9QbGF5ZXIuaXNMb2FkZWQgJiYgdGhpcy5pbXBvcnRzTG9hZGVkKXtcblxuXHRcdFx0aWYgKCF0aGlzLnZpZGVvUGxheWVyLnRyaWdnZXJlZFBsYXkpe1xuXHRcdFx0XHR0aGlzLnZpZGVvUGxheWVyLnBsYXkoKTtcblx0XHRcdFx0dGhpcy5iYWNrZ3JvdW5kTG9hZGVyRmFkZXIgPSAxLjA7XG5cdFx0XHRcdC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuXHRcdFx0XHRcdFxuXHRcdFx0XHQvLyB9LDApO1xuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuX3ZpZGVvVGV4dHVyZS51cGRhdGVUZXh0dXJlKHRoaXMudmlkZW9QbGF5ZXIudmlkZW8pO1xuXG5cdFx0XHR0aGlzLmxlZnRXYWxsVHJhbnNmb3Jtcy5wdXNoKCk7XG5cdFx0XHRcblx0XHRcdHRoaXMubGVmdFdhbGxUcmFuc2Zvcm1zLnNldENhbWVyYSh0aGlzLmxlZnRXYWxsQ2FtZXJhKTtcblx0XHRcdHRoaXMubGVmdFdhbGxDYW1lcmEuYXBwbHkoMTAyNC83NjgpO1xuXG5cdFx0XHR0aGlzLmxlZnRXYWxsVHJhbnNmb3Jtcy5jYWxjdWxhdGVNb2RlbFZpZXcoKTtcblxuXHRcdFx0Ly9yZW5kZXIgd2FsbCB3aXRoIG5vaXNlXG5cdFx0XHR0aGlzLl9sZWZ0V2FsbEZCTy5iaW5kKCk7XG5cblx0XHRcdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuXHRcdFx0dGhpcy5fdkxlZnRXYWxsLnJlbmRlcih0aGlzLl92aWRlb1RleHR1cmUsIHRoaXMuYXVkaW9EYXRhLCB0aGlzLl9wZXJtVGV4dHVyZSwgdGhpcy5fc2ltcGxleFRleHR1cmUpO1xuXG5cdFx0XHR0aGlzLl9sZWZ0V2FsbEZCTy51bmJpbmQoKTtcblxuXHRcdFx0Ly9yZW5kZXIgcHJpc20gd2l0aCB3YWxsIHRleHR1cmVcblx0XHRcdHRoaXMuX3ByaXNtRkJPLmJpbmQoKTtcblxuXHRcdFx0Z2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG5cdFx0XHR0aGlzLl92UHJpc20ucmVuZGVyKHRoaXMuX2xlZnRXYWxsRkJPLmdldFRleHR1cmUoKSwgdGhpcy5hdWRpb0RhdGEpO1xuXG5cdFx0XHR0aGlzLl9wcmlzbUZCTy51bmJpbmQoKTtcblxuXHRcdFx0dGhpcy5sZWZ0V2FsbFRyYW5zZm9ybXMucG9wKCk7XG5cblx0XHRcdFxuXG5cblxuXHRcdFx0Ly8gdGhpcy5vcnRob1RyYW5zZm9ybXMuc2V0Q2FtZXJhKHRoaXMub3J0aG9DYW1lcmEpO1xuXG5cdFx0XHQvLyB0aGlzLl92Q29weS5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLmZib1NpemUpO1xuXG5cblxuXHRcdFx0Ly8gUmVuZGVyIHZpc2libGUgc2NlbmVcblx0XHRcdHRoaXMuX3ZXYWxscy5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLmZib1NpemUpO1xuXHRcdFx0Ly8gLy8gLy8gdGhpcy5fdlJvb20ucmVuZGVyKHRoaXMuX3ByaXNtRkJPLmdldFRleHR1cmUoKSwgdGhpcy5fY29uY3JldGVUZXh0dXJlKTtcblxuXHRcdFx0dGhpcy5fdlZpZGVvLnJlbmRlcih0aGlzLl92aWRlb1RleHR1cmUpO1xuXG5cdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLmF1ZGlvRGF0YSk7XG5cdFx0XHQvLyBkZWJ1Z2dlcjtcblx0XHRcdHRoaXMuX3ZGbG9vci5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLl9jb25jcmV0ZVRleHR1cmUsIHRoaXMuYXVkaW9EYXRhLCB0aGlzLmZib1NpemUpO1xuXG5cdFx0XHR0aGlzLl92Um9vZi5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLl9jb25jcmV0ZVRleHR1cmUsIHRoaXMuYXVkaW9EYXRhLCB0aGlzLmZib1NpemUpO1xuXG5cdFx0XHR0aGlzLl92Q2lyY2xlLnJlbmRlcih0aGlzLl9sZWZ0V2FsbEZCTy5nZXRUZXh0dXJlKCksIHRoaXMuYXVkaW9EYXRhKTtcblxuXHRcdFx0Ly8gZGVidWdnZXI7XG5cdFx0XHQvLyB0aGlzLl92VGVzdEltcG9ydC5yZW5kZXIodGhpcy5fY29uY3JldGVUZXh0dXJlLCB0aGlzLmF1ZGlvRGF0YSk7XG5cblx0XHR9XG5cdH1lbHNle1xuXHRcdHRoaXMub3J0aG9UcmFuc2Zvcm1zLnNldENhbWVyYSh0aGlzLm9ydGhvQ2FtZXJhKTtcblx0XHR0aGlzLl92QmFja2dyb3VuZC5yZW5kZXIodGhpcy5fcGVybVRleHR1cmUsIHRoaXMuX3NpbXBsZXhUZXh0dXJlLCB0aGlzLl9jb25jcmV0ZVRleHR1cmUsIHRoaXMuYmFja2dyb3VuZExvYWRlckZhZGVyKTtcblx0fVxuXHRcdFxuXHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG5cdFxufTtcblxucC5vblJlc2l6ZSA9IGZ1bmN0aW9uKCl7XG5cblx0cy5vblJlc2l6ZS5jYWxsKHRoaXMpO1xuXG5cdHZhciB3ID0gd2luZG93LmlubmVyV2lkdGg7XG5cdHZhciBoID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR0aGlzLmxvYWRlclNjcmVlbi5vblJlc2l6ZSh3LGgpO1xuXHR0aGlzLmVuZFNjcmVlbi5vblJlc2l6ZSh3LGgpO1xuXG5cdFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lTWFpbjsiLCIvLyBhcHAuanNcbi8vIHZhciBkYXQgPSByZXF1aXJlKFwiZGF0LWd1aVwiKTtcblxuTWF0aC5lYXNlSW5FeHBvID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0cmV0dXJuIGMgKiBNYXRoLnBvdyggMiwgMTAgKiAodC9kIC0gMSkgKSArIGI7XG59O1xuXG5cbk1hdGguZWFzZU91dEV4cG8gPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuXHRyZXR1cm4gYyAqICggLU1hdGgucG93KCAyLCAtMTAgKiB0L2QgKSArIDEgKSArIGI7XG59O1xuXG4oZnVuY3Rpb24oKSB7XG5cdFxuXHR2YXIgU2NlbmVNYWluID0gcmVxdWlyZShcIi4vU2NlbmVNYWluXCIpO1xuXG5cdFxuXG5cdEFwcCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKGRvY3VtZW50LmJvZHkpIHRoaXMuX2luaXQoKTtcblx0XHRlbHNlIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCB0aGlzLl9pbml0LmJpbmQodGhpcykpO1xuXHRcdH1cblx0fVxuXG5cdHZhciBwID0gQXBwLnByb3RvdHlwZTtcblxuXHRwLl9pbml0ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdFx0dGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0dGhpcy5jYW52YXMuY2xhc3NOYW1lID0gXCJNYWluLUNhbnZhc1wiO1xuXHRcdHRoaXMuY2FudmFzLmlkID0gJ2dsJztcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKTtcblx0XHQvLyBib25naW92aS5HTC5pbml0KHRoaXMuY2FudmFzKTtcblxuXHRcdHdpbmRvdy5OUyA9IHt9O1xuXHRcdHdpbmRvdy5OUy5HTCA9IHt9O1xuXHRcdHdpbmRvdy5OUy5HTC5wYXJhbXMgPSB7fTtcblx0XHR3aW5kb3cuTlMuR0wucGFyYW1zLndpZHRoID0gNzA7XG5cdFx0d2luZG93Lk5TLkdMLnBhcmFtcy5oZWlnaHQgPSA0MDtcblx0XHR3aW5kb3cuTlMuR0wucGFyYW1zLmRlcHRoID0gNjA7XG5cblx0XHQvLyB0aGlzLl9zY2VuZSA9IG5ldyBTY2VuZUFwcCgpO1xuXHRcdC8vIGJvbmdpb3ZpLlNjaGVkdWxlci5hZGRFRih0aGlzLCB0aGlzLl9sb29wKTtcblxuXHRcdC8vIHRoaXMuZ3VpID0gbmV3IGRhdC5HVUkoe3dpZHRoOjMwMH0pO1xuXG5cdFx0Ly8gdGhpcy5fc2NlbmVNYWluID0gbmV3IFNjZW5lTWFpbigpO1xuXHRcdC8vIHRoaXMuX3NjZW5lTWFpbi5pbml0KCk7XG5cblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0d2luZG93Lk5TLkNvbmNyZXRlID0gbmV3IEltYWdlKCk7XG5cdFx0d2luZG93Lk5TLkNvbmNyZXRlLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHQvLyBzY2VuZSA9IG5ldyB3aW5kb3cuTlMuR0wuU2NlbmVNYWluKCk7XG5cdFx0XHQvLyBzY2VuZS5pbml0KCk7XG5cblx0XHRcdC8vIHRyaWdnZXIoKTtcblxuXHRcdFx0c2VsZi5fc2NlbmVNYWluID0gbmV3IFNjZW5lTWFpbigpO1xuXHRcdFx0c2VsZi5fc2NlbmVNYWluLmluaXQoKTtcblxuXHRcdFx0c2VsZi5fbG9vcCgpO1xuXG5cdFx0fTtcblx0XHR3aW5kb3cuTlMuQ29uY3JldGUuc3JjID0gJ2Fzc2V0cy9tYXR0ZWZsb29yLmpwZyc7XG5cblx0XHQvLyB2YXIgc2VsZiA9IHRoaXM7XG5cdFx0Ly8gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG5cdFx0Ly8gXHRib25naW92aS5TY2hlZHVsZXIuYWRkRUYoc2VsZiwgc2VsZi5fbG9vcCk7XG5cdFx0Ly8gfSwyMDApO1xuXHR9O1xuXG5cdHAuX2xvb3AgPSBmdW5jdGlvbigpe1xuXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX2xvb3AuYmluZCh0aGlzKSk7XG5cblx0XHR0aGlzLl9zY2VuZU1haW4ubG9vcCgpXG5cdH07XG5cblx0Ly8gcC5fbG9vcCA9IGZ1bmN0aW9uKCkge1xuXHQvLyBcdHRoaXMuX3NjZW5lTWFpbi5sb29wKCk7XG5cdC8vIH07XG5cbn0pKCk7XG5cblxubmV3IEFwcCgpOyIsIi8vQmFzZUNhbWVyYS5qc1xuXG5mdW5jdGlvbiBCYXNlQ2FtZXJhKCl7fTtcblxudmFyIHAgPSBCYXNlQ2FtZXJhLnByb3RvdHlwZTtcblxuZnVuY3Rpb24gZGVnVG9SYWRpYW4oZGVncmVlcykge1xuICByZXR1cm4gZGVncmVlcyAqIE1hdGguUEkgLyAxODA7XG59O1xuXG5wLmluaXQgPSBmdW5jdGlvbih0eXBlKXtcblxuXHR0aGlzLnR5cGUgPSB0eXBlO1xuXG5cdGlmICh0aGlzLnR5cGUgPT0gJ29ydGhvJyl7XG5cdFx0dGhpcy5wcm9qTWF0cml4ID0gbWF0NC5jcmVhdGUoKTtcblx0XHR0aGlzLnZpZXdNYXRyaXggPSBtYXQ0LmNyZWF0ZSgpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gUmF3IFBvc2l0aW9uIFZhbHVlc1xuXHR0aGlzLmxlZnQgPSB2ZWMzLmZyb21WYWx1ZXMoMS4wLCAwLjAsIDAuMCk7IC8vIENhbWVyYSBMZWZ0IHZlY3RvclxuXHR0aGlzLnVwID0gdmVjMy5mcm9tVmFsdWVzKDAuMCwgMS4wLCAwLjApOyAvLyBDYW1lcmEgVXAgdmVjdG9yXG5cdHRoaXMuZGlyID0gdmVjMy5mcm9tVmFsdWVzKDAuMCwgMC4wLCAxLjApOyAvLyBUaGUgZGlyZWN0aW9uIGl0cyBsb29raW5nIGF0XG5cdHRoaXMucG9zID0gdmVjMy5mcm9tVmFsdWVzKDAuMCwgMC4wLCAwLjApOyAvLyBDYW1lcmEgZXllIHBvc2l0aW9uXG5cdHRoaXMucHJvamVjdGlvblRyYW5zZm9ybSA9IG51bGw7XG5cdHRoaXMucHJvak1hdHJpeDtcblx0dGhpcy52aWV3TWF0cml4O1xuXG5cdHRoaXMuZmllbGRPZlZpZXcgPSA1NTtcblx0dGhpcy5uZWFyQ2xpcHBpbmdQbGFuZSA9IDAuMTtcblx0dGhpcy5mYXJDbGlwcGluZ1BsYW5lID0gMTAwMC4wO1xufTtcblxucC5hcHBseSA9IGZ1bmN0aW9uKGFzcGVjdFJhdGlvKXtcblxuXHR2YXIgbWF0Vmlldz1tYXQ0LmNyZWF0ZSgpO1xuXHR2YXIgbG9va0F0UG9zaXRpb249dmVjMy5jcmVhdGUoKTtcblx0dmVjMy5hZGQobG9va0F0UG9zaXRpb24sIHRoaXMucG9zLCB0aGlzLmRpcik7XG5cdG1hdDQubG9va0F0KG1hdFZpZXcsIHRoaXMucG9zLCBsb29rQXRQb3NpdGlvbiwgdGhpcy51cCk7XG5cdG1hdDQudHJhbnNsYXRlKG1hdFZpZXcsIG1hdFZpZXcsIHZlYzMuZnJvbVZhbHVlcygtdGhpcy5wb3NbMF0sIC10aGlzLnBvc1sxXSwgLXRoaXMucG9zWzJdKSk7XG5cdHRoaXMudmlld01hdHJpeCA9IG1hdFZpZXc7XG5cblx0Ly8gY29uc29sZS5sb2codGhpcy5kaXIsIHRoaXMudXApO1xuXG5cdC8vIENyZWF0ZSBhIHByb2plY3Rpb24gbWF0cml4IGFuZCBzdG9yZSBpdCBpbnNpZGUgYSBnbG9iYWxseSBhY2Nlc3NpYmxlIHBsYWNlLlxuXHR0aGlzLnByb2pNYXRyaXg9bWF0NC5jcmVhdGUoKTtcblx0bWF0NC5wZXJzcGVjdGl2ZSh0aGlzLnByb2pNYXRyaXgsIGRlZ1RvUmFkaWFuKHRoaXMuZmllbGRPZlZpZXcpLCBhc3BlY3RSYXRpbywgdGhpcy5uZWFyQ2xpcHBpbmdQbGFuZSwgdGhpcy5mYXJDbGlwcGluZ1BsYW5lKVxuXG59O1xuXG5wLmdldEZhckNsaXBwaW5nUGxhbmUgPSBmdW5jdGlvbigpe1xuXHRyZXR1cm4gdGhpcy5mYXJDbGlwcGluZ1BsYW5lO1xufTtcblxucC5nZXRGaWVsZE9mVmlldyA9IGZ1bmN0aW9uKCl7XG5cblx0cmV0dXJuIHRoaXMuZmllbGRPZlZpZXc7XG59O1xuXG5wLmdldExlZnQgPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiB2ZWMzLmNsb25lKHRoaXMubGVmdCk7XG59O1xuXG5wLmdldE5lYXJDbGlwcGluZ1BsYW5lID0gZnVuY3Rpb24oKXtcblxuXHRyZXR1cm4gdGhpcy5uZWFyQ2xpcHBpbmdQbGFuZTtcbn07XG5cbnAuZ2V0UG9zaXRpb24gPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiB2ZWMzLmNsb25lKHRoaXMucG9zKTtcbn07XG5cbnAuZ2V0UHJvamVjdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XG5cblx0cmV0dXJuIG1hdDQuY2xvbmUodGhpcy5wcm9qTWF0cml4KTtcbn07XG5cbnAuZ2V0Vmlld01hdHJpeCA9IGZ1bmN0aW9uKCl7XG5cblx0cmV0dXJuIG1hdDQuY2xvbmUodGhpcy52aWV3TWF0cml4KTtcbn07XG5cbnAuZ2V0VXAgPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiB2ZWMzLmNsb25lKHRoaXMudXApO1xufTtcblxucC5zZXRGYXJDbGlwcGluZ1BsYW5lID0gZnVuY3Rpb24oKXtcblxuXHRpZiAoZmNwID4gMClcblx0e1xuXHRcdHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSA9IGZjcDtcblx0fVxufTtcblxucC5zZXRGaWVsZE9mVmlldyA9IGZ1bmN0aW9uKGZvdil7XG5cblx0aWYgKGZvdiA+IDAgJiYgZm92IDwgMTgwKVxuXHR7XG5cdFx0dGhpcy5maWVsZE9mVmlldyA9IGZvdjtcblx0fVxufTtcblxucC5zZXROZWFyQ2xpcHBpbmdQbGFuZSA9IGZ1bmN0aW9uKG5jcCl7XG5cblx0aWYgKG5jcCA+IDApXG5cdHtcblx0XHR0aGlzLm5lYXJDbGlwcGluZ1BsYW5lID0gbmNwO1xuXHR9XG59O1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWVTdGVwLCBsaW5lVmVsLCBhbmd1bGFyVmVsKXtcblxuXHRpZiAodmVjMy5zcXVhcmVkTGVuZ3RoKGxpblZlbCk9PTAgJiYgdmVjMy5zcXVhcmVkTGVuZ3RoKGFuZ3VsYXJWZWwpPT0wKSByZXR1cm4gZmFsc2U7XG5cblx0aWYgKHZlYzMuc3F1YXJlZExlbmd0aChsaW5WZWwpID4gMC4wKVxuXHR7XG5cdFx0Ly8gQWRkIGEgdmVsb2NpdHkgdG8gdGhlIHBvc2l0aW9uXG5cdFx0dmVjMy5zY2FsZSh2ZWxWZWMsdmVsVmVjLCB0aW1lU3RlcCk7XG5cblx0XHR2ZWMzLmFkZCh0aGlzLnBvcywgdmVsVmVjLCB0aGlzLnBvcyk7XG5cdH1cblxuXHRpZiAodmVjMy5zcXVhcmVkTGVuZ3RoKGFuZ3VsYXJWZWwpID4gMC4wKVxuXHR7XG5cdFx0Ly8gQXBwbHkgc29tZSByb3RhdGlvbnMgdG8gdGhlIG9yaWVudGF0aW9uIGZyb20gdGhlIGFuZ3VsYXIgdmVsb2NpdHlcblx0XHR0aGlzLnBpdGNoKGFuZ3VsYXJWZWxbMF0gKiB0aW1lU3RlcCk7XG5cdFx0dGhpcy55YXcoYW5ndWxhclZlbFsxXSAqIHRpbWVTdGVwKTtcblx0XHR0aGlzLnJvbGwoYW5ndWxhclZlbFsyXSAqIHRpbWVTdGVwKTtcblx0fVxuXG5cdHJldHVybiB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQ2FtZXJhOyIsIi8vRnJlZUNhbWVyYS5qc1xuXG52YXIgQmFzZUNhbWVyYSA9IHJlcXVpcmUoJy4uL2NhbWVyYXMvQmFzZUNhbWVyYScpO1xuXG5mdW5jdGlvbiBGcmVlQ2FtZXJhKCl7fTtcblxuZnVuY3Rpb24gaXNWZWN0b3JFcXVhbCh2ZWNvbmUsdmVjdHdvKVxuICB7XG4gICBpZih2ZWNvbmVbMF09PXZlY3R3b1swXSYmdmVjb25lWzFdPT12ZWN0d29bMV0mJnZlY29uZVsyXT09dmVjdHdvWzJdKVxuICAge1xuICAgcmV0dXJuIHRydWU7XG4gICB9XG4gICBlbHNle1xuICAgIHJldHVybiBmYWxzZTtcbiAgIH1cbiAgfVxuXG52YXIgcCA9IEZyZWVDYW1lcmEucHJvdG90eXBlID0gbmV3IEJhc2VDYW1lcmEoKTtcbnZhciBzID0gQmFzZUNhbWVyYS5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgcy5pbml0LmNhbGwodGhpcyk7XG5cbiAgdGhpcy5saW5WZWwgPSB2ZWMzLmZyb21WYWx1ZXMoMC4wLCAwLjAsIDAuMCk7IC8vIEFuaW1hdGlvbiBvZiBwb3NpdGlvbnNcbiAgdGhpcy5hbmdWZWwgPSB2ZWMzLmZyb21WYWx1ZXMoMC4wLCAwLjAsIDAuMCk7IC8vIEFuaW1hdGlvbnMgb2Ygcm90YXRpb24gYXJvdW5kIChzaWRlIFZlY3RvciwgdXAgVmVjdG9yLCBkaXIgVmVjdG9yKVxuXG5cbn07XG5cbnAueWF3ID0gZnVuY3Rpb24oYW5nbGUpe1xuXG4gIHRoaXMucm90YXRlT25BeGlzKHRoaXMudXAsIGFuZ2xlKTtcbn07XG5cbnAucGl0Y2ggPSBmdW5jdGlvbihhbmdsZSl7XG5cbiAgdGhpcy5yb3RhdGVPbkF4aXModGhpcy5sZWZ0LCBhbmdsZSk7XG59O1xuXG5wLnJvbGwgPSBmdW5jdGlvbihhbmdsZSl7XG5cbiAgdGhpcy5yb3RhdGVPbkF4aXModGhpcy5kaXIsIGFuZ2xlKTtcbn07XG5cbnAucm90YXRlT25BeGlzID0gZnVuY3Rpb24oYXhpc1ZlYywgYW5nbGUpe1xuXG4gIC8vIENyZWF0ZSBhIHByb3BlciBRdWF0ZXJuaW9uIGJhc2VkIG9uIGxvY2F0aW9uIGFuZCBhbmdsZVxuICB2YXIgcXVhdGU9cXVhdC5jcmVhdGUoKTtcbiAgcXVhdC5zZXRBeGlzQW5nbGUocXVhdGUsIGF4aXNWZWMsIGFuZ2xlKVxuICBcbiAgLy8gQ3JlYXRlIGEgcm90YXRpb24gTWF0cml4IG91dCBvZiB0aGlzIHF1YXRlcm5pb25cbiAgdmVjMy50cmFuc2Zvcm1RdWF0KHRoaXMuZGlyLCB0aGlzLmRpciwgcXVhdGUpICBcbiAgdmVjMy50cmFuc2Zvcm1RdWF0KHRoaXMubGVmdCwgdGhpcy5sZWZ0LCBxdWF0ZSkgIFxuICB2ZWMzLnRyYW5zZm9ybVF1YXQodGhpcy51cCwgdGhpcy51cCwgcXVhdGUpICBcbiAgdmVjMy5ub3JtYWxpemUodGhpcy51cCx0aGlzLnVwKTtcbiAgdmVjMy5ub3JtYWxpemUodGhpcy5sZWZ0LHRoaXMubGVmdCk7XG4gIHZlYzMubm9ybWFsaXplKHRoaXMuZGlyLHRoaXMuZGlyKTtcblxuICB0aGlzLnVwID0gdmVjMy5mcm9tVmFsdWVzKDAuMCwgMS4wLCAwLjApOyAvLyBDYW1lcmEgVXAgdmVjdG9yXG59O1xuXG5wLnNldEFuZ3VsYXJWZWwgPSBmdW5jdGlvbihuZXdWZWMpe1xuXG4gIHRoaXMuYW5nVmVsWzBdID0gbmV3VmVjWzBdO1xuICB0aGlzLmFuZ1ZlbFsxXSA9IG5ld1ZlY1sxXTtcbiAgdGhpcy5hbmdWZWxbMl0gPSBuZXdWZWNbMl07XG59O1xuXG5wLmdldEFuZ3VsYXJWZWwgPSBmdW5jdGlvbigpe1xuXG4gIHJldHVybiB2ZWMzLmNsb25lKHRoaXMuYW5nVmVsKTtcbn07XG5cbnAuZ2V0TGluZWFyVmVsID0gZnVuY3Rpb24oKXtcblxuICByZXR1cm4gdmVjMy5jbG9uZSh0aGlzLmxpblZlbCk7XG59O1xuXG5wLnNldExpbmVhclZlbCA9IGZ1bmN0aW9uKCl7XG5cbiAgdGhpcy5saW5WZWxbMF0gPSBuZXdWZWNbMF07XG4gIHRoaXMubGluVmVsWzFdID0gbmV3VmVjWzFdO1xuICB0aGlzLmxpblZlbFsyXSA9IG5ld1ZlY1syXTtcbn07XG5cbnAuc2V0TG9va0F0UG9pbnQgPSBmdW5jdGlvbihuZXdWZWMpe1xuXG4gICAgLy8gaWYgdGhlIHBvc2l0aW9uIGhhc24ndCB5ZXQgYmVlbiBjaGFuZ2VkIGFuZCB0aGV5IHdhbnQgdGhlXG4gIC8vIGNhbWVyYSB0byBsb29rIGF0IFswLDAsMF0sIHRoYXQgd2lsbCBjcmVhdGUgYSBwcm9ibGVtLlxuICBpZiAoaXNWZWN0b3JFcXVhbCh0aGlzLnBvcywgWzAsIDAsIDBdKSAmJiBpc1ZlY3RvckVxdWFsKG5ld1ZlYywgWzAsIDAsIDBdKSlcbiAge1xuICBcbiAgfVxuICBlbHNlXG4gIHtcbiAgICAvLyBGaWd1cmUgb3V0IHRoZSBkaXJlY3Rpb24gb2YgdGhlIHBvaW50IHdlIGFyZSBsb29raW5nIGF0LlxuICAgIHZlYzMuc3VidHJhY3QodGhpcy5kaXIsbmV3VmVjLCB0aGlzLnBvcyk7XG4gICAgIHZlYzMubm9ybWFsaXplKHRoaXMuZGlyLHRoaXMuZGlyKTtcbiAgICAvLyBBZGp1c3QgdGhlIFVwIGFuZCBMZWZ0IHZlY3RvcnMgYWNjb3JkaW5nbHlcbiAgICB2ZWMzLmNyb3NzKHRoaXMubGVmdCx2ZWMzLmZyb21WYWx1ZXMoMCwgMSwgMCksIHRoaXMuZGlyICk7XG4gICAgdmVjMy5ub3JtYWxpemUodGhpcy5sZWZ0LHRoaXMubGVmdCk7XG4gICAgdmVjMy5jcm9zcyh0aGlzLnVwLHRoaXMuZGlyLCB0aGlzLmxlZnQpO1xuICAgIHZlYzMubm9ybWFsaXplKHRoaXMudXAsdGhpcy51cCk7XG4gIH1cbn07XG5cbnAuc2V0UG9zaXRpb24gPSBmdW5jdGlvbihuZXdWZWMpe1xuXG4gIHRoaXMucG9zPXZlYzMuZnJvbVZhbHVlcyhuZXdWZWNbMF0sbmV3VmVjWzFdLG5ld1ZlY1syXSk7XG5cbiAgdmFyIHhNYXggPSAyNTtcbiAgdmFyIHpNYXggPSAyNTtcblxuICBpZiAodGhpcy5wb3NbMF0gPiB4TWF4KVxuICAgIHRoaXMucG9zWzBdID0geE1heDtcbiAgZWxzZSBpZiAodGhpcy5wb3NbMF0gPCAteE1heClcbiAgICB0aGlzLnBvc1swXSA9IC14TWF4O1xuICBlbHNlIGlmICh0aGlzLnBvc1syXSA+IHpNYXgpXG4gICAgdGhpcy5wb3NbMl0gPSB6TWF4O1xuICBlbHNlIGlmICh0aGlzLnBvc1syXSA8IC16TWF4KVxuICAgIHRoaXMucG9zWzJdID0gLXpNYXg7XG5cbn07XG5cbnAuc2V0VXBWZWN0b3IgPSBmdW5jdGlvbihuZXdWZWMpe1xuXG4gIHRoaXMudXBbMF0gPSBuZXdWZWNbMF07XG4gIHRoaXMudXBbMV0gPSBuZXdWZWNbMV07XG4gIHRoaXMudXBbMl0gPSBuZXdWZWNbMl07XG59O1xuXG4vLyBwLm1vdmVTaWRlID0gZnVuY3Rpb24ocyl7XG5cbi8vICAgdmFyIG5ld1Bvc2l0aW9uID0gW3RoaXMucG9zWzBdIC0gcyp0aGlzLmxlZnRbMF0sdGhpcy5wb3NbMV0gLSBzKnRoaXMubGVmdFsxXSx0aGlzLnBvc1syXSAtIHMqdGhpcy5sZWZ0WzJdXTtcblxuLy8gICB0aGlzLnNldFBvc2l0aW9uKG5ld1Bvc2l0aW9uKTtcbi8vIH07XG5cblxucC5tb3ZlRm9yd2FyZCA9IGZ1bmN0aW9uKHMpe1xuXG4gIHZhciBkaXJUZW1wID0gdGhpcy5kaXIuc2xpY2UoMCk7XG4gIGRpclRlbXBbMV0gPSAwO1xuXG4gIHZhciBuZXdQb3NpdGlvbiA9IFt0aGlzLnBvc1swXSAtIHMqdGhpcy5kaXJbMF0sdGhpcy5wb3NbMV0gLSBzKnRoaXMuZGlyWzFdLHRoaXMucG9zWzJdIC0gcyp0aGlzLmRpclsyXV07XG5cbiAgdGhpcy5zZXRQb3NpdGlvbihuZXdQb3NpdGlvbik7XG59O1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKHRpbWVTdGVwKXtcblxuICBpZiAodmVjMy5zcXVhcmVkTGVuZ3RoKHRoaXMubGluVmVsKT09MCAmJiB2ZWMzLnNxdWFyZWRMZW5ndGgodGhpcy5hbmd1bGFyVmVsKT09MCkgXG4gIHJldHVybiBmYWxzZTtcblxuICBpZiAodmVjMy5zcXVhcmVkTGVuZ3RoKHRoaXMubGluVmVsKSA+IDAuMClcbiAge1xuICAgIC8vIEFkZCBhIHZlbG9jaXR5IHRvIHRoZSBwb3NpdGlvblxuICAgIHZlYzMuc2NhbGUodGhpcy52ZWxWZWMsdGhpcy52ZWxWZWMsIHRpbWVTdGVwKTtcblxuICAgIHZlYzMuYWRkKHRoaXMucG9zLCB0aGlzLnZlbFZlYywgdGhpcy5wb3MpO1xuICB9XG5cbiAgaWYgKHZlYzMuc3F1YXJlZExlbmd0aCh0aGlzLmFuZ1ZlbCkgPiAwLjApXG4gIHtcbiAgICAvLyBBcHBseSBzb21lIHJvdGF0aW9ucyB0byB0aGUgb3JpZW50YXRpb24gZnJvbSB0aGUgYW5ndWxhciB2ZWxvY2l0eVxuICAgIHRoaXMucGl0Y2godGhpcy5hbmdWZWxbMF0gKiB0aW1lU3RlcCk7XG4gICAgdGhpcy55YXcodGhpcy5hbmdWZWxbMV0gKiB0aW1lU3RlcCk7XG4gICAgdGhpcy5yb2xsKHRoaXMuYW5nVmVsWzJdICogdGltZVN0ZXApO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZyZWVDYW1lcmE7IiwiLy9Db2xsYWRhTG9hZGVyLmpzXG5cbmZ1bmN0aW9uIENvbGxhZGFMb2FkZXIoKXt9O1xuXG52YXIgcCA9IENvbGxhZGFMb2FkZXIucHJvdG90eXBlO1xuXG5cbnAubG9hZCA9IGZ1bmN0aW9uKHBhdGgsIHR5cGUsIG9uTG9hZGVkQ2FsbGJhY2ssIGNhbGxiYWNrU2NvcGUpe1xuXG5cdHRoaXMudHlwZSA9IHR5cGU7XG5cdHRoaXMub25Mb2FkZWRDYWxsYmFjayA9IG9uTG9hZGVkQ2FsbGJhY2s7XG5cdHRoaXMuY2FsbGJhY2tTY29wZSA9IGNhbGxiYWNrU2NvcGU7XG5cblx0dGhpcy5kYXRhTG9hZGVkID0gZmFsc2U7XG5cblx0dGhpcy5jaGlsZHJlbkRhdGEgPSBbXTtcblx0dGhpcy5wYXJlbnREYXRhID0gW107XG5cdHRoaXMuYW5pbWF0aW9uRGF0YSA9IFtdO1xuXG5cdENvbGxhZGEuZGF0YVBhdGggPSAnaW1wb3J0cy8nO1xuXHRDb2xsYWRhLmxvYWQoIHBhdGgsIHRoaXMuX29uTG9hZGVkLmJpbmQodGhpcykgKTtcblxuXHRcbn07XG5cbnAuZ2V0UGFyZW50RGF0YSA9IGZ1bmN0aW9uKCl7XG5cblx0cmV0dXJuIHRoaXMucGFyZW50RGF0YS5zbGljZSgwKTtcbn07XG5cbnAuX29uTG9hZGVkID0gZnVuY3Rpb24oZSl7XG5cblx0dmFyIHJvb3QgPSBlLnJvb3Q7XG5cdHZhciBzdWJWaWV3cyA9IFtdO1xuXHRmb3IgKHZhciBrZXkgaW4gcm9vdCl7XG5cblx0XHRpZiAoa2V5ID09ICdhbmltYXRpb25zJyl7XG5cdFx0XHQvLyBhbmltYXRpb25JRCA9IHJvb3Rba2V5XTtcblx0XHRcdC8vIHRoaXMuX2FuaW1hdGlvbiA9IG5ldyBWaWV3QW5pbWF0aW9uKCk7XG5cdFx0XHQvLyB0aGlzLl9hbmltYXRpb24uaW5pdChlLnJlc291cmNlc1tyb290WydhbmltYXRpb25zJ11dKTtcblxuXHRcdFx0dGhpcy5hbmltYXRpb25EYXRhLnB1c2goZS5yZXNvdXJjZXNbcm9vdFsnYW5pbWF0aW9ucyddXSk7XG5cblx0XHR9XG5cblx0XHRpZiAoa2V5ID09ICdjaGlsZHJlbicpe1xuXHRcdFx0XG5cdFx0XHRpZiAocm9vdFtrZXldLmxlbmd0aCA+IDApe1xuXHRcdFx0XHR2YXIgcGFyZW50ID0gcm9vdFtrZXldO1xuXG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPHBhcmVudC5sZW5ndGg7aSsrKXtcblx0XHRcdFx0XHQvLyBpZiAocm9vdFsnYW5pbWF0aW9ucyddKXtcblx0XHRcdFx0XHQvLyBcdGFuaW1hdGlvbiA9IGUucmVzb3VyY2VzW3Jvb3RbJ2FuaW1hdGlvbnMnXV07XG5cdFx0XHRcdFx0Ly8gfVxuXG5cdFx0XHRcdFx0Ly8gdmFyIHBhcmVudFZpZXcgPSBuZXcgVmlld1Rlc3QoKTtcblx0XHRcdFx0XHQvLyBwYXJlbnRWaWV3LmluaXQodmVydFBhdGgsIGZyYWdQYXRoLCBjaGlsZHJlbltpXSwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuXHRcdFx0XHRcdC8vIHRoaXMuX3BhcmVudFZpZXcgPSBwYXJlbnRWaWV3O1xuXHRcdFx0XHRcdC8vIHRoaXMuX3BhcmVudFZpZXcudHJhbnNmb3JtcyA9IHRoaXMudHJhbnNmb3Jtcztcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyB2YXIgbWVzaCA9IGUubWVzaGVzXG5cblx0XHRcdFx0XHQvLyBkZWJ1Z2dlcjtcblxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChwYXJlbnRbaV0uY2hpbGRyZW4ubGVuZ3RoID09IDApe1xuXHRcdFx0XHRcdFx0dmFyIG1lc2ggPSBlLm1lc2hlc1twYXJlbnRbaV0ubWVzaF07XG5cdFx0XHRcdFx0XHR2YXIgbWF0ZXJpYWwgPSBlLm1hdGVyaWFsc1twYXJlbnRbaV0ubWF0ZXJpYWxdO1xuXG5cdFx0XHRcdFx0XHR0aGlzLnBhcmVudERhdGEucHVzaCh7aWQ6IHBhcmVudFtpXS5pZCwgbWVzaERhdGE6IG1lc2gsIG1hdGVyaWFsRGF0YTogbWF0ZXJpYWwsIGNoaWxkcmVuOiBbXX0pO1xuXHRcdFx0XHRcdFx0Ly8gdGhpcy5wYXJlbnREYXRhID0ge21lc2hEYXRhOiBtZXNoLCBtYXRlcmlhbERhdGE6IG1hdGVyaWFsfTtcblxuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0dmFyIHBhcmVudE9iaiA9IHt9O1xuXG5cdFx0XHRcdFx0XHRwYXJlbnRPYmouaWQgPSBwYXJlbnRbaV0uaWQ7XG5cdFx0XHRcdFx0XHR2YXIgbWVzaCA9IGUubWVzaGVzW3BhcmVudFtpXS5tZXNoXTtcblx0XHRcdFx0XHRcdHZhciBtYXRlcmlhbCA9IGUubWF0ZXJpYWxzW3BhcmVudFtpXS5tYXRlcmlhbF07XG5cblx0XHRcdFx0XHRcdC8vIHBhcmVudE9iai5tZXNoRGF0YSA9IG1lc2g7XG5cdFx0XHRcdFx0XHQvLyBwYXJlbnRPYmoubWF0ZXJpYWxEYXRhID0gbWF0ZXJpYWw7XG5cdFx0XHRcdFx0XHRwYXJlbnRPYmouY2hpbGRyZW4gPSBbXTtcblx0XHRcdFx0XHRcdGZvciAodmFyIHE9MDtxPHBhcmVudFtpXS5jaGlsZHJlbi5sZW5ndGg7cSsrKXtcblxuXHRcdFx0XHRcdFx0XHR2YXIgY2hpbGRyZW5PYmogPSB7fTtcblxuXHRcdFx0XHRcdFx0XHR2YXIgc3ViVmlld0RhdGEgPSBwYXJlbnRbaV0uY2hpbGRyZW5bcV07XG5cblx0XHRcdFx0XHRcdFx0dmFyIG1lc2ggPSBlLm1lc2hlc1tzdWJWaWV3RGF0YS5tZXNoXTtcblx0XHRcdFx0XHRcdFx0dmFyIG1hdGVyaWFsID0gZS5tYXRlcmlhbHNbc3ViVmlld0RhdGEubWF0ZXJpYWxdO1xuXG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuT2JqLm1lc2hEYXRhID0gbWVzaDtcblx0XHRcdFx0XHRcdFx0Y2hpbGRyZW5PYmoubWF0ZXJpYWxEYXRhID0gbWF0ZXJpYWw7XG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuT2JqLmlkID0gc3ViVmlld0RhdGEuaWQ7XG5cblx0XHRcdFx0XHRcdFx0cGFyZW50T2JqLmNoaWxkcmVuLnB1c2goY2hpbGRyZW5PYmopO1xuXHRcdFx0XHRcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnREYXRhLnB1c2gocGFyZW50T2JqKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0Ly8gdGhpcy5fYW5pbWF0aW9uLnZpZXdzW3RoaXMuX3BhcmVudFZpZXcuZGF0YS5pZF0gPSB0aGlzLl9wYXJlbnRWaWV3O1xuXHQvLyBmb3IgKHZhciBpPTA7aTxzdWJWaWV3cy5sZW5ndGg7aSsrKXtcblx0Ly8gXHR0aGlzLl9hbmltYXRpb24udmlld3Nbc3ViVmlld3NbaV0uZGF0YS5pZF0gPSBzdWJWaWV3c1tpXTtcblx0Ly8gfVxuXG5cdC8vIGRlYnVnZ2VyO1xuXG5cdHRoaXMuZGF0YUxvYWRlZCA9IHRydWU7XG5cblx0dGhpcy5vbkxvYWRlZENhbGxiYWNrLmNhbGwodGhpcy5jYWxsYmFja1Njb3BlLCB0aGlzKTtcblxuXHQvLyB2YXIgc2VsZiA9IHRoaXM7XG5cdC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuXHQvLyBcdHNlbGYuX2FuaW1hdGlvbi5zdGFydCgpO1xuXHQvLyB9LDIwMDApO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxhZGFMb2FkZXI7IiwiLy9GcmFtZWJ1ZmZlci5qc1xuXG52YXIgVGV4dHVyZSA9IHJlcXVpcmUoJy4vVGV4dHVyZScpO1xuXG5mdW5jdGlvbiBGcmFtZWJ1ZmZlcigpe307XG5cbnZhciBwID0gRnJhbWVidWZmZXIucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5wLmluaXQgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBtYWdGaWx0ZXIsIG1pbkZpbHRlciwgdGV4VHlwZSl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXG5cdHRoaXMuaWQgPSAnJztcblxuXHR0aGlzLnRleFR5cGUgPSB0ZXhUeXBlO1xuXHR0aGlzLndpZHRoICA9IHdpZHRoO1xuXHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0dGhpcy5tYWdGaWx0ZXIgPSBtYWdGaWx0ZXI9PXVuZGVmaW5lZCA/IGdsLkxJTkVBUiA6IG1hZ0ZpbHRlcjtcblx0dGhpcy5taW5GaWx0ZXIgPSBtaW5GaWx0ZXI9PXVuZGVmaW5lZCA/IGdsLkxJTkVBUiA6IG1pbkZpbHRlcjtcblxuXHR0aGlzLmRlcHRoVGV4dHVyZUV4dCBcdD0gZ2wuZ2V0RXh0ZW5zaW9uKFwiV0VCS0lUX1dFQkdMX2RlcHRoX3RleHR1cmVcIik7IC8vIE9yIGJyb3dzZXItYXBwcm9wcmlhdGUgcHJlZml4XG5cblx0dGhpcy50ZXh0dXJlICAgICAgICAgICAgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdHRoaXMuZGVwdGhUZXh0dXJlICAgICAgID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHR0aGlzLmdsVGV4dHVyZVx0XHRcdD0gbmV3IFRleHR1cmUoKTtcblx0dGhpcy5nbFRleHR1cmUuaW5pdCh0aGlzLnRleHR1cmUsIHRydWUpO1xuXHR0aGlzLmdsRGVwdGhUZXh0dXJlXHRcdD0gbmV3IFRleHR1cmUoKTtcblx0dGhpcy5nbERlcHRoVGV4dHVyZS5pbml0KHRoaXMuZGVwdGhUZXh0dXJlLCB0cnVlKTtcblx0dGhpcy5mcmFtZUJ1ZmZlciAgICAgICAgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1x0XHRcblx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCB0aGlzLmZyYW1lQnVmZmVyKTtcblx0dGhpcy5mcmFtZUJ1ZmZlci53aWR0aCAgPSB0aGlzLndpZHRoO1xuXHR0aGlzLmZyYW1lQnVmZmVyLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuXHR2YXIgc2l6ZSAgICAgICAgICAgICAgICA9IHRoaXMud2lkdGg7XG5cblxuXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMubWFnRmlsdGVyKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy5taW5GaWx0ZXIpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcblx0Ly8gaWYodGhpcy5tYWdGaWx0ZXIgPT0gZ2wuTkVBUkVTVCAmJiB0aGlzLm1pbkZpbHRlciA9PSBnbC5ORUFSRVNUKSBcblx0Ly8gXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHRoaXMuZnJhbWVCdWZmZXIud2lkdGgsIHRoaXMuZnJhbWVCdWZmZXIuaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5GTE9BVCwgbnVsbCk7XG5cdC8vIGVsc2Vcblx0Ly8gXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHRoaXMuZnJhbWVCdWZmZXIud2lkdGgsIHRoaXMuZnJhbWVCdWZmZXIuaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsKTtcblxuXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHRoaXMuZnJhbWVCdWZmZXIud2lkdGgsIHRoaXMuZnJhbWVCdWZmZXIuaGVpZ2h0LCAwLCBnbC5SR0JBLCB0ZXhUeXBlLCBudWxsKTtcblxuXHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLmRlcHRoVGV4dHVyZSk7XG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5ORUFSRVNUKTtcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLk5FQVJFU1QpO1xuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdGlmKHRoaXMuZGVwdGhUZXh0dXJlRXh0ICE9IG51bGwpZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5ERVBUSF9DT01QT05FTlQsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCAwLCBnbC5ERVBUSF9DT01QT05FTlQsIGdsLlVOU0lHTkVEX1NIT1JULCBudWxsKTtcblxuICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlLCAwKTtcbiAgICBpZih0aGlzLmRlcHRoVGV4dHVyZUV4dCA9PSBudWxsKSB7XG4gICAgXHRjb25zb2xlLmxvZyggXCJubyBkZXB0aCB0ZXh0dXJlXCIgKTtcbiAgICBcdHZhciByZW5kZXJidWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcbiAgICBcdGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCByZW5kZXJidWZmZXIpO1xuICAgIFx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCB0aGlzLmZyYW1lQnVmZmVyLndpZHRoLCB0aGlzLmZyYW1lQnVmZmVyLmhlaWdodCk7XG4gICAgXHRnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCByZW5kZXJidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgXHRnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuVEVYVFVSRV8yRCwgdGhpcy5kZXB0aFRleHR1cmUsIDApO1xuICAgIH1cbiAgICBcbiAgICBcblxuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcbiAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xufTtcblxuXG5cbnAuYmluZCA9IGZ1bmN0aW9uKCkge1xuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIHRoaXMuZnJhbWVCdWZmZXIpO1xufTtcblxuXG5wLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuXHRnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xufTtcblxuXG5wLmdldFRleHR1cmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZ2xUZXh0dXJlO1xufTtcblxuXG5wLmdldERlcHRoVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nbERlcHRoVGV4dHVyZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWVidWZmZXI7XG4iLCIvL0ltcG9ydEFuaW1hdGlvbi5qc1xuXG5mdW5jdGlvbiBJbXBvcnRBbmltYXRpb24oKXt9O1xuXG52YXIgcCA9IEltcG9ydEFuaW1hdGlvbi5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKGFuaW1hdGlvbil7XG5cblx0dGhpcy52aWV3cyA9IFtdO1xuXHR0aGlzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbjtcblxuXHR2YXIgdHJhY2tzID0gYW5pbWF0aW9uLnRha2VzLmRlZmF1bHQudHJhY2tzO1xuXHR0aGlzLnRyYWNrcyA9IHRyYWNrcztcblx0XG5cdC8vIHZhciBzdGFydEFuaW1hdGlvbiA9IHt9O1xuXHQvLyBzdGFydEFuaW1hdGlvbi5kdXJhdGlvbiA9IDU7XG5cdC8vIHN0YXJ0QW5pbWF0aW9uLnZpZXdJZCA9ICdJRDQnO1xuXHQvLyBzdGFydEFuaW1hdGlvbi5kYXRhID0gLTU7XG5cdC8vIHN0YXJ0QW5pbWF0aW9uLm5hbWUgPSAndHJhbnNsYXRlJztcblx0XG5cdC8vIC8vIHRoaXMudHJhY2tzLnB1c2goc3RhcnRBbmltYXRpb24pO1xuXHRcblx0Ly8gdmFyIGVuZEFuaW1hdGlvbiA9IHt9O1xuXHQvLyBlbmRBbmltYXRpb24uZHVyYXRpb24gPSA1O1xuXHQvLyBlbmRBbmltYXRpb24udmlld0lkID0gJ0lENCc7XG5cdC8vIGVuZEFuaW1hdGlvbi5kYXRhID0gLTQwO1xuXHQvLyBlbmRBbmltYXRpb24ubmFtZSA9ICd0cmFuc2xhdGUnO1xuXHQvLyB0aGlzLnRyYWNrcy51bnNoaWZ0KGVuZEFuaW1hdGlvbik7XG5cdFxuXG5cdHRoaXMuX2N1ZSA9IFtdO1xuXG5cdC8vIHRoaXMuc3RhcnRZcG9zID0gLTQwO1xuXHR0aGlzLm1haW5JZCA9ICdJRDQnO1xuXG5cdC8vIHRoaXMuY3VycmVudFlQb3MgPSAtNDA7XG5cdC8vIHRoaXMudGFyZ2V0WVBvcyA9IHRoaXMuY3VycmVudFlQb3M7XG5cblx0Ly8gdGhpcy5jcmVhdGVDdWUodGhpcy50cmFja3MpO1xuXHR0aGlzLnJlc2V0KCk7XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0XG59O1xuXG5wLmNyZWF0ZUN1ZSA9IGZ1bmN0aW9uKHRyYWNrcyl7XG5cblx0dGhpcy5fY3VlID0gW107XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0dGhpcy50b3RhbER1cmF0aW9uID0gMDtcblx0Zm9yICh2YXIgaT10cmFja3MubGVuZ3RoLTE7aT49MDtpLS0pe1xuXHRcdFxuXHRcdHZhciBjdWUgPSB7fTtcblx0XHRjdWUuc3RhcnRUaW1lID0gdGhpcy50b3RhbER1cmF0aW9uO1xuXHRcdGN1ZS5kdXJhdGlvbiA9IHRyYWNrc1tpXS5kdXJhdGlvbjtcblx0XHRjdWUuZGF0YSA9IHRyYWNrc1tpXS5kYXRhO1xuXHRcdGlmICh0cmFja3NbaV0ubmFtZSA9PSAndHJhbnNsYXRlJyl7XG5cdFx0XHRjdWUudmlld0lkID0gdHJhY2tzW2ldLnZpZXdJZDtcblx0XHRcdGN1ZS5hbmltYXRpb25Qcm9wID0gdHJhY2tzW2ldLm5hbWU7XG5cdFx0fWVsc2V7XG5cdFx0XHRjdWUudmlld0lkID0gdHJhY2tzW2ldLnByb3BlcnR5LnN1YnN0cigwLCB0cmFja3NbaV0ucHJvcGVydHkuaW5kZXhPZignLycpKTtcblx0XHRcdGN1ZS5hbmltYXRpb25Qcm9wID0gdHJhY2tzW2ldLm5hbWUuc3Vic3RyKDAsIHRyYWNrc1tpXS5uYW1lLmluZGV4T2YoJy4nKSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIGlmIChjdWUudmlld0lkID09ICdJRDY3JyB8fCBjdWUudmlld0lkID09ICdJRDQ3Jylcblx0XHR0aGlzLl9jdWUucHVzaChjdWUpO1xuXHRcdHRoaXMudG90YWxEdXJhdGlvbiArPSB0cmFja3NbaV0uZHVyYXRpb247XG5cdFx0Ly8gZGVidWdnZXI7XG5cdH1cblxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9jdWUubGVuZ3RoO2krKyl7XG5cdFx0dGhpcy5fY3VlW2ldLm5vcm1hbGl6ZWRTdGFydFRpbWUgPSB0aGlzLl9jdWVbaV0uc3RhcnRUaW1lIC8gdGhpcy50b3RhbER1cmF0aW9uO1xuXHRcdHRoaXMuX2N1ZVtpXS5ub3JtYWxpemVkRW5kVGltZSA9ICh0aGlzLl9jdWVbaV0uc3RhcnRUaW1lICsgdGhpcy5fY3VlW2ldLmR1cmF0aW9uKSAvIHRoaXMudG90YWxEdXJhdGlvbjtcblx0fVxuXHRcblx0Ly8gZGVidWdnZXI7XG5cbn07XG5cbnAucmVzZXQgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMuc3RhcnRUcmFuc2xhdGVUaW1lID0gdW5kZWZpbmVkO1xuXHR0aGlzLmVuZFRyYW5zbGF0ZVRpbWUgPSB1bmRlZmluZWQ7XG5cblx0dGhpcy5jcmVhdGVDdWUodGhpcy50cmFja3MpO1xuXG5cdHRoaXMuY3VycmVudFRyYWNrID0gdGhpcy5fY3VlLnNoaWZ0KCk7XG5cbn07XG5cblxuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKG5vcm1hbGl6ZWQpe1xuXG5cdFxuXHRcblx0aWYgKG5vcm1hbGl6ZWQgPiAtLjQgJiYgbm9ybWFsaXplZCA8IDApe1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpO1xuXHRcdHZhciBkdXJhdGlvbiA9IDI7XG5cdFx0aWYgKHRoaXMuc3RhcnRUcmFuc2xhdGVUaW1lID09PSB1bmRlZmluZWQpXG5cdFx0XHR0aGlzLnN0YXJ0VHJhbnNsYXRlVGltZSA9IG5vdy8xMDAwO1xuXHRcdFxuXHRcdHZhciBjdXJyZW50U2VjID0gKG5vdy8xMDAwIC0gdGhpcy5zdGFydFRyYW5zbGF0ZVRpbWUpO1xuXHRcdHZhciBjaGFuZ2UgPSAzNTtcblx0XHR2YXIgc3RhcnQgPSAtMjA7XG5cdFx0Ly8gdmFyIGNoYW5nZSA9IDA7XG5cdFx0Ly8gdmFyIHN0YXJ0ID0gMjA7XG5cblx0XHR2YXIgY2FsY1ZhbCA9IE1hdGguZWFzZU91dEV4cG8oY3VycmVudFNlYywgc3RhcnQsIGNoYW5nZSwgZHVyYXRpb24pO1xuXHRcdGlmIChjdXJyZW50U2VjIDwgMilcblx0XHRcdHRoaXMudmlld3NbdGhpcy5tYWluSWRdLmN1cnJlbnRUcmFuc2xhdGUgPSBjYWxjVmFsO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coY2FsY1ZhbCwgY3VycmVudFNlYyk7XG5cdH1cblx0aWYgKG5vcm1hbGl6ZWQgPiAxLjIpe1xuXHRcdHZhciBub3cgPSBEYXRlLm5vdygpO1xuXHRcdHZhciBkdXJhdGlvbiA9IDI7XG5cdFx0aWYgKHRoaXMuZW5kVHJhbnNsYXRlVGltZSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5lbmRUcmFuc2xhdGVUaW1lID0gbm93LzEwMDA7XG5cdFx0XG5cdFx0dmFyIGN1cnJlbnRTZWMgPSAobm93LzEwMDAgLSB0aGlzLmVuZFRyYW5zbGF0ZVRpbWUpO1xuXHRcdHZhciBjaGFuZ2UgPSAtMzU7XG5cdFx0dmFyIHN0YXJ0ID0gMTU7XG5cdFx0Ly8gdmFyIGNoYW5nZSA9IDA7XG5cdFx0Ly8gdmFyIHN0YXJ0ID0gMjA7XG5cblx0XHR2YXIgY2FsY1ZhbCA9IE1hdGguZWFzZUluRXhwbyhjdXJyZW50U2VjLCBzdGFydCwgY2hhbmdlLCBkdXJhdGlvbik7XG5cdFx0aWYgKGN1cnJlbnRTZWMgPCAyKVxuXHRcdFx0dGhpcy52aWV3c1t0aGlzLm1haW5JZF0uY3VycmVudFRyYW5zbGF0ZSA9IGNhbGNWYWw7XG5cdH1cblx0aWYgKG5vcm1hbGl6ZWQgPCAwIHx8IG5vcm1hbGl6ZWQgPiAxKSB7XG5cdFx0Ly8gdGhpcy52aWV3c1t0aGlzLm1haW5JZF0uY3VycmVudFRyYW5zbGF0ZSA9IHRoaXMuc3RhcnRZcG9zO1xuXHRcdC8vIHRoaXMudGFyZ2V0WVBvcyA9IC00MDtcblx0XHRyZXR1cm47XG5cdH1cblxuXHQvLyBpZiAobm9ybWFsaXplZCA8IDEpXG5cdC8vIFx0dGhpcy50YXJnZXRZUG9zID0gLTU7XG5cblxuXHRcblxuXHR2YXIgbm9ybWFsaXplZFZhbCA9IChub3JtYWxpemVkIC0gdGhpcy5jdXJyZW50VHJhY2subm9ybWFsaXplZFN0YXJ0VGltZSkvKHRoaXMuY3VycmVudFRyYWNrLm5vcm1hbGl6ZWRFbmRUaW1lIC0gdGhpcy5jdXJyZW50VHJhY2subm9ybWFsaXplZFN0YXJ0VGltZSk7XG5cdC8vIGNvbnNvbGUubG9nKG5vcm1hbGl6ZWRWYWwpO1xuXG5cdGlmICh0aGlzLmN1cnJlbnRUcmFjay5hbmltYXRpb25Qcm9wID09ICd0cmFuc2xhdGUnKXtcblx0XHQvLyB0aGlzLnZpZXdzW3RoaXMubWFpbklkXS5jdXJyZW50VHJhbnNsYXRlID0gdGhpcy5zdGFydFlwb3MgKyAoIG5vcm1hbGl6ZWRWYWwgKiAoTWF0aC5hYnModGhpcy5zdGFydFlwb3MpICsgdGhpcy5jdXJyZW50VHJhY2suZGF0YSkpO1xuXHRcdC8vIHRoaXMudGFyZ2V0WVBvcyA9IHRoaXMuY3VycmVudFRyYWNrLmRhdGE7XG5cdH1cblx0ZWxzZVxuXHRcdHZhciB2YWwgPSBub3JtYWxpemVkVmFsICogdGhpcy5jdXJyZW50VHJhY2suZGF0YVszXTtcblxuXHQvLyBjb25zb2xlLmxvZygnaWR4OiAnLCB0aGlzLmN1cnJlbnRJZHggLCcgIGRpZmY6ICcsZGlmZiwgJyB2YWw6ICcsdmFsLCAnIGR1cmF0aW9uOiAnLGN1cnJlbnRUcmFjay5kdXJhdGlvbiwgJyBnb2FsIHZhbDogJyxjdXJyZW50VHJhY2suZGF0YVszXSk7XG5cblx0Ly8gaWYgKHRoaXMudmlld3NbdGhpcy5jdXJyZW50VHJhY2sudmlld0lkXS5jdXJyZW50QW5pbWF0aW9uUHJvcFswXSAhPSB0aGlzLmN1cnJlbnRUcmFjay5hbmltYXRpb25Qcm9wKVxuXHR0aGlzLnZpZXdzW3RoaXMuY3VycmVudFRyYWNrLnZpZXdJZF0uY3VycmVudEFuaW1hdGlvblByb3AgPSB0aGlzLmN1cnJlbnRUcmFjay5hbmltYXRpb25Qcm9wO1xuXHR0aGlzLnZpZXdzW3RoaXMuY3VycmVudFRyYWNrLnZpZXdJZF0uY3VycmVudEFuaW1hdGlvblZhbCA9IHZhbDtcblxuXG5cdGlmIChub3JtYWxpemVkVmFsID49IDEpe1xuXG5cdFx0aWYgKHRoaXMuX2N1ZS5sZW5ndGggPiAwKVxuXHRcdFx0dGhpcy5jdXJyZW50VHJhY2sgPSB0aGlzLl9jdWUuc2hpZnQoKTtcblx0XHRlbHNlXG5cdFx0XHR0aGlzLnJ1biA9IGZhbHNlO1xuXG5cdFx0XG5cdH1cblxuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gSW1wb3J0QW5pbWF0aW9uOyIsIi8vTWVzaC5qc1xuXG5mdW5jdGlvbiBNZXNoKCl7fTtcblxudmFyIHAgPSBNZXNoLnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24odmVydGV4U2l6ZSwgaW5kZXhTaXplLCBkcmF3VHlwZSl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXG5cdHRoaXMudmVydGV4U2l6ZSA9IHZlcnRleFNpemU7XG5cdHRoaXMuaW5kZXhTaXplID0gaW5kZXhTaXplO1xuXHR0aGlzLmRyYXdUeXBlID0gZHJhd1R5cGU7XG5cdHRoaXMuZXh0cmFBdHRyaWJ1dGVzID0gW107XG5cblx0dGhpcy50ZXh0dXJlVXNlZCA9IGZhbHNlO1xuXG5cdHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPSB1bmRlZmluZWQ7XG59O1xuXG5wLmJ1ZmZlclZlcnRleCA9IGZ1bmN0aW9uKGFyeVZlcnRpY2VzKSB7XG5cdHZhciB2ZXJ0aWNlcyA9IFtdO1xuXG5cdGZvcih2YXIgaT0wOyBpPGFyeVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Zm9yKHZhciBqPTA7IGo8YXJ5VmVydGljZXNbaV0ubGVuZ3RoOyBqKyspIHZlcnRpY2VzLnB1c2goYXJ5VmVydGljZXNbaV1bal0pO1xuXHR9XG5cblx0aWYodGhpcy52QnVmZmVyUG9zID09IHVuZGVmaW5lZCApIHRoaXMudkJ1ZmZlclBvcyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmZmVyUG9zKTtcblxuXHRpZih0aGlzLl9mbG9hdEFycmF5VmVydGV4ID09IHVuZGVmaW5lZCkgdGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuXHRlbHNlIHtcblx0XHRpZihhcnlWZXJ0aWNlcy5sZW5ndGggIT0gdGhpcy5fZmxvYXRBcnJheVZlcnRleC5sZW5ndGgpIHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcblx0XHRlbHNlIHtcblx0XHRcdGZvcih2YXIgaT0wO2k8YXJ5VmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dGhpcy5fZmxvYXRBcnJheVZlcnRleFtpXSA9IGFyeVZlcnRpY2VzW2ldO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl9mbG9hdEFycmF5VmVydGV4LCBnbC5TVEFUSUNfRFJBVyk7XG5cdHRoaXMudkJ1ZmZlclBvcy5pdGVtU2l6ZSA9IDM7XG59O1xuXG5cbnAuYnVmZmVyVGV4Q29vcmRzID0gZnVuY3Rpb24oYXJ5VGV4Q29vcmRzKSB7XG5cdHZhciBjb29yZHMgPSBbXTtcblxuXHR0aGlzLnRleHR1cmVVc2VkID0gdHJ1ZTtcblxuXHRmb3IodmFyIGk9MDsgaTxhcnlUZXhDb29yZHMubGVuZ3RoOyBpKyspIHtcblx0XHRmb3IodmFyIGo9MDsgajxhcnlUZXhDb29yZHNbaV0ubGVuZ3RoOyBqKyspIGNvb3Jkcy5wdXNoKGFyeVRleENvb3Jkc1tpXVtqXSk7XG5cdH1cblxuXHR0aGlzLnZCdWZmZXJVViA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmZmVyVVYpO1xuXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShjb29yZHMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cdHRoaXMudkJ1ZmZlclVWLml0ZW1TaXplID0gMjtcbn07XG5cblxucC5idWZmZXJEYXRhID0gZnVuY3Rpb24oZGF0YSwgbmFtZSwgaXRlbVNpemUsIGZsYXQpIHtcblx0dmFyIGluZGV4ID0gLTFcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5leHRyYUF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRpZih0aGlzLmV4dHJhQXR0cmlidXRlc1tpXS5uYW1lID09IG5hbWUpIHtcblx0XHRcdHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2ldLmRhdGEgPSBkYXRhO1xuXHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGJ1ZmZlckRhdGEgPSBbXTtcblx0aWYgKGZsYXQpe1xuXHRcdGJ1ZmZlckRhdGEgPSBkYXRhLnNsaWNlKDApO1xuXHR9ZWxzZXtcblxuXG5cdFx0XG5cdFx0Zm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XG5cdFx0XHRmb3IodmFyIGo9MDsgajxkYXRhW2ldLmxlbmd0aDsgaisrKSBidWZmZXJEYXRhLnB1c2goZGF0YVtpXVtqXSk7XG5cdFx0fVxuXHR9XG5cblx0aWYoaW5kZXggPT0gLTEpIHtcblx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XG5cdFx0dmFyIGZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlckRhdGEpO1xuXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBmbG9hdEFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHRcblx0XHR0aGlzLmV4dHJhQXR0cmlidXRlcy5wdXNoKHtuYW1lOm5hbWUsIGRhdGE6ZGF0YSwgaXRlbVNpemU6aXRlbVNpemUsIGJ1ZmZlcjpidWZmZXIsIGZsb2F0QXJyYXk6ZmxvYXRBcnJheX0pO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBidWZmZXIgPSB0aGlzLmV4dHJhQXR0cmlidXRlc1tpbmRleF0uYnVmZmVyO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuXHRcdHZhciBmbG9hdEFycmF5ID0gdGhpcy5leHRyYUF0dHJpYnV0ZXNbaW5kZXhdLmZsb2F0QXJyYXk7XG5cdFx0Zm9yKHZhciBpPTA7aTxidWZmZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRmbG9hdEFycmF5W2ldID0gYnVmZmVyRGF0YVtpXTtcblx0XHR9XG5cdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGZsb2F0QXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcdFxuXHR9XG5cdFxufTtcblxuXG5wLmJ1ZmZlckluZGljZXMgPSBmdW5jdGlvbihhcnlJbmRpY2VzKSB7XG5cdHRoaXMuaUJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmlCdWZmZXIpO1xuXHRnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkoYXJ5SW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcblx0dGhpcy5pQnVmZmVyLml0ZW1TaXplID0gMTtcblx0dGhpcy5pQnVmZmVyLm51bUl0ZW1zID0gYXJ5SW5kaWNlcy5sZW5ndGg7XG59O1xuXG4vLyB2YXIgdmVydGV4QnVmZmVyT2JqZWN0ID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4vLyBcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXJPYmplY3QpO1xuLy8gXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShvYmplY3QudmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cdCAgXG5cblxuLy8gaWYgKG9iamVjdC5wZXJWZXJ0ZXhDb2xvcil7XG4vLyBcdGNvbG9yQnVmZmVyT2JqZWN0ID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4vLyBcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlck9iamVjdCk7XG4vLyBcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KG9iamVjdC5jb2xvcnMpLCBnbC5TVEFUSUNfRFJBVyk7XG4vLyBcdG9iamVjdC5jYm8gPSBjb2xvckJ1ZmZlck9iamVjdDtcbi8vIH1cblxuLy8gdmFyIGluZGV4QnVmZmVyT2JqZWN0ID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4vLyBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleEJ1ZmZlck9iamVjdCk7XG4vLyBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkob2JqZWN0LmluZGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbi8vIG9iamVjdC52Ym8gPSB2ZXJ0ZXhCdWZmZXJPYmplY3Q7XG4vLyBvYmplY3QuaWJvID0gaW5kZXhCdWZmZXJPYmplY3Q7XG4vLyBvYmplY3QubmJvID0gbm9ybWFsQnVmZmVyT2JqZWN0O1xuXG4vLyBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcbi8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLG51bGwpO1xuXG4vLyBwLmJ1ZmZlclZlcnRleCA9IGZ1bmN0aW9uKGFyeVZlcnRpY2VzKSB7XG4vLyBcdHZhciB2ZXJ0aWNlcyA9IFtdO1xuXG4vLyBcdC8vIHRoaXMudkJ1ZmZlclBvcyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gXHQvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmZmVyUG9zKTtcbi8vIFx0Ly8gZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoYXJ5VmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbi8vIFx0Ly8gZm9yKHZhciBpPTA7IGk8YXJ5VmVydGljZXMubGVuZ3RoOyBpKyspIHtcbi8vIFx0Ly8gXHRmb3IodmFyIGo9MDsgajxhcnlWZXJ0aWNlc1tpXS5sZW5ndGg7IGorKykgdmVydGljZXMucHVzaChhcnlWZXJ0aWNlc1tpXVtqXSk7XG4vLyBcdC8vIH1cblxuLy8gXHQvLyBpZih0aGlzLnZCdWZmZXJQb3MgPT0gdW5kZWZpbmVkICkgdGhpcy52QnVmZmVyUG9zID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4vLyBcdC8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnZCdWZmZXJQb3MpO1xuXG4vLyBcdC8vIGlmKHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPT0gdW5kZWZpbmVkKSB0aGlzLl9mbG9hdEFycmF5VmVydGV4ID0gbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyk7XG4vLyBcdC8vIGVsc2Uge1xuLy8gXHQvLyBcdGlmKGFyeVZlcnRpY2VzLmxlbmd0aCAhPSB0aGlzLl9mbG9hdEFycmF5VmVydGV4Lmxlbmd0aCkgdGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuLy8gXHQvLyBcdGVsc2Uge1xuLy8gXHQvLyBcdFx0Zm9yKHZhciBpPTA7aTxhcnlWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuLy8gXHQvLyBcdFx0XHR0aGlzLl9mbG9hdEFycmF5VmVydGV4W2ldID0gYXJ5VmVydGljZXNbaV07XG4vLyBcdC8vIFx0XHR9XG4vLyBcdC8vIFx0fVxuLy8gXHQvLyB9XG5cbi8vIFx0Ly8gZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXgsIGdsLlNUQVRJQ19EUkFXKTtcbi8vIFx0dGhpcy52QnVmZmVyUG9zLml0ZW1TaXplID0gMztcbi8vIH07XG5cblxuLy8gcC5idWZmZXJUZXhDb29yZHMgPSBmdW5jdGlvbihhcnlUZXhDb29yZHMpIHtcbi8vIFx0dmFyIGNvb3JkcyA9IFtdO1xuXG4vLyBcdC8vIGZvcih2YXIgaT0wOyBpPGFyeVRleENvb3Jkcy5sZW5ndGg7IGkrKykge1xuLy8gXHQvLyBcdGZvcih2YXIgaj0wOyBqPGFyeVRleENvb3Jkc1tpXS5sZW5ndGg7IGorKykgY29vcmRzLnB1c2goYXJ5VGV4Q29vcmRzW2ldW2pdKTtcbi8vIFx0Ly8gfVxuXG4vLyBcdHRoaXMudkJ1ZmZlclVWID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4vLyBcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnZCdWZmZXJVVik7XG4vLyBcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGFyeVRleENvb3JkcyksIGdsLlNUQVRJQ19EUkFXKTtcbi8vIFx0dGhpcy52QnVmZmVyVVYuaXRlbVNpemUgPSAyO1xuLy8gfTtcblxuXG4vLyBwLmJ1ZmZlckRhdGEgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCBpdGVtU2l6ZSkge1xuLy8gXHR2YXIgaW5kZXggPSAtMVxuLy8gXHRmb3IodmFyIGk9MDsgaTx0aGlzLmV4dHJhQXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuLy8gXHRcdGlmKHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2ldLm5hbWUgPT0gbmFtZSkge1xuLy8gXHRcdFx0dGhpcy5leHRyYUF0dHJpYnV0ZXNbaV0uZGF0YSA9IGRhdGE7XG4vLyBcdFx0XHRpbmRleCA9IGk7XG4vLyBcdFx0XHRicmVhaztcbi8vIFx0XHR9XG4vLyBcdH1cblxuLy8gXHR2YXIgYnVmZmVyRGF0YSA9IFtdO1xuLy8gXHRmb3IodmFyIGk9MDsgaTxkYXRhLmxlbmd0aDsgaSsrKSB7XG4vLyBcdFx0Zm9yKHZhciBqPTA7IGo8ZGF0YVtpXS5sZW5ndGg7IGorKykgYnVmZmVyRGF0YS5wdXNoKGRhdGFbaV1bal0pO1xuLy8gXHR9XG5cbi8vIFx0aWYoaW5kZXggPT0gLTEpIHtcbi8vIFx0XHR2YXIgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4vLyBcdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XG4vLyBcdFx0dmFyIGZsb2F0QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlckRhdGEpO1xuLy8gXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBmbG9hdEFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHRcbi8vIFx0XHR0aGlzLmV4dHJhQXR0cmlidXRlcy5wdXNoKHtuYW1lOm5hbWUsIGRhdGE6ZGF0YSwgaXRlbVNpemU6aXRlbVNpemUsIGJ1ZmZlcjpidWZmZXIsIGZsb2F0QXJyYXk6ZmxvYXRBcnJheX0pO1xuLy8gXHR9IGVsc2Uge1xuLy8gXHRcdHZhciBidWZmZXIgPSB0aGlzLmV4dHJhQXR0cmlidXRlc1tpbmRleF0uYnVmZmVyO1xuLy8gXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuLy8gXHRcdHZhciBmbG9hdEFycmF5ID0gdGhpcy5leHRyYUF0dHJpYnV0ZXNbaW5kZXhdLmZsb2F0QXJyYXk7XG4vLyBcdFx0Zm9yKHZhciBpPTA7aTxidWZmZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4vLyBcdFx0XHRmbG9hdEFycmF5W2ldID0gYnVmZmVyRGF0YVtpXTtcbi8vIFx0XHR9XG4vLyBcdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGZsb2F0QXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcdFxuLy8gXHR9XG5cdFxuLy8gfTtcblxuXG4vLyBwLmJ1ZmZlckluZGljZXMgPSBmdW5jdGlvbihhcnlJbmRpY2VzKSB7XG4vLyBcdHRoaXMuaUJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmlCdWZmZXIpO1xuLy8gXHRnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkoYXJ5SW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcbi8vIFx0dGhpcy5pQnVmZmVyLml0ZW1TaXplID0gMTtcbi8vIFx0dGhpcy5pQnVmZmVyLm51bUl0ZW1zID0gYXJ5SW5kaWNlcy5sZW5ndGg7XG5cbi8vIH07XG5cblxuLy8gLy8gdmFyIHZlcnRleEJ1ZmZlck9iamVjdCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gLy8gXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmVydGV4QnVmZmVyT2JqZWN0KTtcbi8vIC8vIFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkob2JqZWN0LnZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXHQgIFxuXHRcblxuLy8gLy8gXHR2YXIgaW5kZXhCdWZmZXJPYmplY3QgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbi8vIC8vIFx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaW5kZXhCdWZmZXJPYmplY3QpO1xuLy8gLy8gXHRnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgVWludDE2QXJyYXkob2JqZWN0LmluZGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNZXNoOyIsIi8vIFNjZW5lLmpzXG5cbnZhciBCYXNlQ2FtZXJhID0gcmVxdWlyZSgnLi4vY2FtZXJhcy9CYXNlQ2FtZXJhJyk7XG52YXIgRnJlZUNhbWVyYSA9IHJlcXVpcmUoJy4uL2NhbWVyYXMvRnJlZUNhbWVyYScpO1xuXG5mdW5jdGlvbiBTY2VuZSgpe1xuXG5cdHRoaXMudGVzdCA9IDA7XG59O1xuXG52YXIgcCA9IFNjZW5lLnByb3RvdHlwZTtcblxucC5pbml0ID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLm9iamVjdHMgPSBbXTtcblxuXHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnbCcpO1xuXHRnbCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCJ3ZWJnbFwiKTtcblxuXHR3aW5kb3cuTlMuR0wuZ2xDb250ZXh0ID0gZ2w7XG5cblx0Ly8gdGhpcy50cmFuc2Zvcm1zID0gbmV3IHdpbmRvdy5OUy5HTC5GcmFtZXdvcmsuU2NlbmVUcmFuc2Zvcm1zKCk7XG5cdC8vIHRoaXMudHJhbnNmb3Jtcy5pbml0KHRoaXMuY2FudmFzKTtcblxuXG5cdFxuXG5cdGdsLnZpZXdwb3J0KDAsIDAsIGdsLnZpZXdwb3J0V2lkdGgsIGdsLnZpZXdwb3J0SGVpZ2h0KTtcblx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuICAgIC8vIGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xuXHRnbC5lbmFibGUoZ2wuQkxFTkQpO1xuXHRnbC5jbGVhckNvbG9yKCAwLCAwLCAwLCAxICk7XG5cdGdsLmNsZWFyRGVwdGgoIDEgKTtcblx0dGhpcy5kZXB0aFRleHR1cmVFeHQgXHQ9IGdsLmdldEV4dGVuc2lvbihcIldFQktJVF9XRUJHTF9kZXB0aF90ZXh0dXJlXCIpOyAvLyBPciBicm93c2VyLWFwcHJvcHJpYXRlIHByZWZpeFxuXHQvLyB0aGlzLmZsb2F0VGV4dHVyZUV4dCBcdD0gZ2wuZ2V0RXh0ZW5zaW9uKFwiT0VTX3RleHR1cmVfZmxvYXRcIikgLy8gT3IgYnJvd3Nlci1hcHByb3ByaWF0ZSBwcmVmaXhcblx0XG5cblx0dGhpcy5fc2V0Q2FtZXJhKCk7XG5cblx0XG5cblx0XG5cblx0XG59O1xuXG5wLl9zZXRDYW1lcmEgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMuY2FtZXJhID0gbmV3IEZyZWVDYW1lcmEoKTtcblx0dGhpcy5jYW1lcmEuaW5pdCgpO1xuXG5cdHRoaXMubGVmdFdhbGxDYW1lcmEgPSBuZXcgRnJlZUNhbWVyYSgpO1xuXHR0aGlzLmxlZnRXYWxsQ2FtZXJhLmluaXQoKTtcblxuXG5cdHRoaXMub3J0aG9DYW1lcmEgPSBuZXcgQmFzZUNhbWVyYSgpO1xuXHR0aGlzLm9ydGhvQ2FtZXJhLmluaXQoJ29ydGhvJyk7XG5cblxuXHR0aGlzLnRlc3RDYW1lcmEgPSBuZXcgRnJlZUNhbWVyYSgpO1xuXHR0aGlzLnRlc3RDYW1lcmEuaW5pdCgpO1xuXG5cdC8vIHRoaXMuY2FtZXJhID0gbmV3IHdpbmRvdy5OUy5HTC5GcmFtZXdvcmsuQ2FtZXJhKCk7XG5cdC8vIHRoaXMuY2FtZXJhLmluaXQoKTtcblxuXHQvLyB0aGlzLmNhbWVyYU90aG8gPSBuZXcgd2luZG93Lk5TLkdMLkZyYW1ld29yay5DYW1lcmEoKTtcblx0Ly8gdGhpcy5jYW1lcmFPdGhvLmluaXQoJ2Zyb250Jyk7XG5cblx0Ly8gdGhpcy5jYW1lcmEuZ29Ib21lKFswLDAsMl0pO1xufTtcblxucC5nZXRPYmplY3QgPSBmdW5jdGlvbihhbGlhcyl7XG5cblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5vYmplY3RzLmxlbmd0aDsgaSsrKXtcblx0XHRpZiAoYWxpYXMgPT0gdGhpcy5vYmplY3RzW2ldLmFsaWFzKSByZXR1cm4gdGhpcy5vYmplY3RzW2ldO1xuXHR9XG5cdHJldHVybiBudWxsO1xufTtcblxucC5sb2FkT2JqZWN0ID0gZnVuY3Rpb24oZmlsZW5hbWUsYWxpYXMsYXR0cmlidXRlcyl7XG5cblx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0Y29uc29sZS5pbmZvKCdSZXF1ZXN0aW5nICcgKyBmaWxlbmFtZSk7XG5cdHJlcXVlc3Qub3BlbihcIkdFVFwiLGZpbGVuYW1lKTtcblxuXHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT0gNCkge1xuXHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT0gNDA0KSB7XG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhmaWxlbmFtZSArICcgZG9lcyBub3QgZXhpc3QnKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR2YXIgbyA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuXHRcdFx0XHRvLmFsaWFzID0gKGFsaWFzPT1udWxsKT8nbm9uZSc6YWxpYXM7XG5cdFx0XHRcdG8ucmVtb3RlID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5hZGRPYmplY3QobyxhdHRyaWJ1dGVzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmVxdWVzdC5zZW5kKCk7XG59O1xuXG5wLmxvYWRPYmplY3RCeVBhcnRzID0gZnVuY3Rpb24ocGF0aCwgYWxpYXMsIHBhcnRzKXtcblxuXHRmb3IodmFyIGkgPSAxOyBpIDw9IHBhcnRzOyBpKyspe1xuXHRcdHZhciBwYXJ0RmlsZW5hbWUgPSAgcGF0aCsnJytpKycuanNvbic7XG5cdFx0dmFyIHBhcnRBbGlhcyA9IGFsaWFzKycnK2k7XG5cdFx0dGhpcy5sb2FkT2JqZWN0KHBhcnRGaWxlbmFtZSxwYXJ0QWxpYXMpO1xuXHR9XG5cbn07XG5cbnAuYWRkT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0LCBhdHRyaWJ1dGVzKXtcblxuXHQgLy9pbml0aWFsaXplIHdpdGggZGVmYXVsdHNcblx0aWYgKG9iamVjdC5wZXJWZXJ0ZXhDb2xvciAgID09PSB1bmRlZmluZWQpICAgIHsgICBvYmplY3QucGVyVmVydGV4Q29sb3IgICA9IGZhbHNlOyAgICAgICAgICAgIH1cbiAgICBpZiAob2JqZWN0LndpcmVmcmFtZSAgICAgICAgPT09IHVuZGVmaW5lZCkgICAgeyAgIG9iamVjdC53aXJlZnJhbWUgICAgICAgID0gZmFsc2U7ICAgICAgICAgICAgfVxuICAgIGlmIChvYmplY3QuZGlmZnVzZSAgICAgICAgICA9PT0gdW5kZWZpbmVkKSAgICB7ICAgb2JqZWN0LmRpZmZ1c2UgICAgICAgICAgPSBbMS4wLDEuMCwxLjAsMS4wXTt9XG4gICAgaWYgKG9iamVjdC5hbWJpZW50ICAgICAgICAgID09PSB1bmRlZmluZWQpICAgIHsgICBvYmplY3QuYW1iaWVudCAgICAgICAgICA9IFswLjEsMC4xLDAuMSwxLjBdO31cbiAgICBpZiAob2JqZWN0LnNwZWN1bGFyICAgICAgICAgPT09IHVuZGVmaW5lZCkgICAgeyAgIG9iamVjdC5zcGVjdWxhciAgICAgICAgID0gWzEuMCwxLjAsMS4wLDEuMF07fVxuXHRcblx0Ly9zZXQgYXR0cmlidXRlc1xuICAgZm9yKHZhciBrZXkgaW4gYXR0cmlidXRlcyl7XG5cdFx0aWYob2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtvYmplY3Rba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTt9XG5cdH0gICBcblxuXG5cdHZhciB2ZXJ0ZXhCdWZmZXJPYmplY3QgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlck9iamVjdCk7XG5cdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KG9iamVjdC52ZXJ0aWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcblx0ICBcblx0dmFyIG5vcm1hbEJ1ZmZlck9iamVjdCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbm9ybWFsQnVmZmVyT2JqZWN0KTtcblx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoY2FsY3VsYXRlTm9ybWFscyhvYmplY3QudmVydGljZXMsIG9iamVjdC5pbmRpY2VzKSksIGdsLlNUQVRJQ19EUkFXKTtcblxuXHR2YXIgY29sb3JCdWZmZXJPYmplY3Q7XG5cblx0aWYgKG9iamVjdC5wZXJWZXJ0ZXhDb2xvcil7XG5cdFx0Y29sb3JCdWZmZXJPYmplY3QgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXJPYmplY3QpO1xuXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KG9iamVjdC5jb2xvcnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cdFx0b2JqZWN0LmNibyA9IGNvbG9yQnVmZmVyT2JqZWN0O1xuXHR9XG5cblx0dmFyIGluZGV4QnVmZmVyT2JqZWN0ID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGluZGV4QnVmZmVyT2JqZWN0KTtcblx0Z2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KG9iamVjdC5pbmRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXHRcblx0b2JqZWN0LnZibyA9IHZlcnRleEJ1ZmZlck9iamVjdDtcblx0b2JqZWN0LmlibyA9IGluZGV4QnVmZmVyT2JqZWN0O1xuXHRvYmplY3QubmJvID0gbm9ybWFsQnVmZmVyT2JqZWN0O1xuXG5cdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUixudWxsKTtcblxuXHR0aGlzLm9iamVjdHMucHVzaChvYmplY3QpO1xuXHRcblx0aWYgKG9iamVjdC5yZW1vdGUpe1xuXHRcdGNvbnNvbGUuaW5mbyhvYmplY3QuYWxpYXMgKyAnIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBzY2VuZSBbUmVtb3RlXScpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGNvbnNvbGUuaW5mbyhvYmplY3QuYWxpYXMgKyAnIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBzY2VuZSBbTG9jYWxdJyk7XG5cdH1cbn07XG5cbnAubG9vcCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnVwZGF0ZSgpO1xuXHR0aGlzLnJlbmRlcigpO1xufTtcblxuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdC8vIGdsLnZpZXdwb3J0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuXHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cblx0Ly8gdGhpcy50cmFuc2Zvcm1zLnVwZGF0ZVBlcnNwZWN0aXZlKCk7XG5cdFxuXG5cdC8vIGdsLnVuaWZvcm1NYXRyaXg0ZnYocmVuZGVyUHJvZ3JhbS51TVZNYXRyaXgsIGZhbHNlLCB0cmFuc2Zvcm1zLmdldE12TWF0cml4KCkpO1xuXHQvLyBnbC51bmlmb3JtTWF0cml4NGZ2KHJlbmRlclByb2dyYW0udVBNYXRyaXgsIGZhbHNlLCB0cmFuc2Zvcm1zLmdldFByb2plY3Rpb25NYXRyaXgoKSk7XG5cdFxuXG5cdC8vIHRoaXMuc2NlbmVSb3RhdGlvbi51cGRhdGUoKTtcblx0Ly8gR0wuc2V0TWF0cmljZXModGhpcy5jYW1lcmEpO1xuXHQvLyBHTC5yb3RhdGUodGhpcy5zY2VuZVJvdGF0aW9uLm1hdHJpeCk7XG59O1xuXG5cbnAucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cdC8vT1ZFUldSSVRFXG59O1xuXG5cbnAub25SZXNpemUgPSBmdW5jdGlvbigpe1xuXG5cdHZhciB3ID0gd2luZG93LmlubmVyV2lkdGg7XG5cdHZhciBoID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdGdsLnZpZXdwb3J0V2lkdGggPSB3O1xuXHRnbC52aWV3cG9ydEhlaWdodCA9IGg7XG5cblx0Ly8gdmFyIHdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JhcHBlcicpO1xuXHQvLyB3cmFwcGVyLnN0eWxlLmhlaWdodCA9IGggKyAncHgnO1xuXHQvLyB3cmFwcGVyLnN0eWxlLndpZHRoID0gdyArICdweCc7XG5cblx0dGhpcy5jYW52YXMud2lkdGggPSB3O1xuXHR0aGlzLmNhbnZhcy5oZWlnaHQgPSBoO1xuXG5cdHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IGggKyAncHgnO1xuXHR0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuXG5cdFxuXG5cdC8vIHRoaXMudHJhbnNmb3Jtcy51cGRhdGVQZXJzcGVjdGl2ZSgpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjZW5lOyIsIi8vU2NlbmVUcmFuZm9ybXMuanNcblxuZnVuY3Rpb24gU2NlbmVUcmFuc2Zvcm1zKCl7fTtcblxudmFyIHAgPSBTY2VuZVRyYW5zZm9ybXMucHJvdG90eXBlO1xuXG5TY2VuZVRyYW5zZm9ybXMuRklFTERfT0ZfVklFVyA9IDQ1ICogTWF0aC5QSS8xODA7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKGNhbnZhcyl7XG5cblx0dGhpcy5fc3RhY2sgPSBbXTtcblx0Ly8gdGhpcy5fY2FtZXJhID0gYztcblx0dGhpcy5fY2FudmFzID0gY2FudmFzO1xuXHR0aGlzLl9tdk1hdHJpeCAgICA9IG1hdDQuY3JlYXRlKCk7ICAgIC8vIFRoZSBNb2RlbC1WaWV3IG1hdHJpeFxuXHQvLyB0aGlzLl9wTWF0cml4ICAgICA9IG1hdDQuY3JlYXRlKCk7ICAgIC8vIFRoZSBwcm9qZWN0aW9uIG1hdHJpeFxuXHQvLyB0aGlzLl9uTWF0cml4ICAgICA9IG1hdDQuY3JlYXRlKCk7ICAgIC8vIFRoZSBub3JtYWwgbWF0cml4XG5cdC8vIHRoaXMuY01hdHJpeCAgICAgPSBtYXQ0LmNyZWF0ZSgpOyAgICAvLyBUaGUgY2FtZXJhIG1hdHJpeFxuXG5cdG1hdDQuaWRlbnRpdHkodGhpcy5fbXZNYXRyaXgpO1xuXHQvLyBtYXQ0LmlkZW50aXR5KHRoaXMuX3BNYXRyaXgpO1xufTtcblxucC5zZXRDYW1lcmEgPSBmdW5jdGlvbihjKXtcblxuXHR0aGlzLl9jYW1lcmEgPSBjO1xufTtcblxucC5jYWxjdWxhdGVNb2RlbFZpZXcgPSBmdW5jdGlvbigpe1xuXG5cdC8vIHRoaXMuX212TWF0cml4ID0gdGhpcy5fY2FtZXJhLmdldFZpZXdUcmFuc2Zvcm0oKTtcblx0bWF0NC5tdWx0aXBseSh0aGlzLl9tdk1hdHJpeCx0aGlzLl9tdk1hdHJpeCwgdGhpcy5fY2FtZXJhLmdldFZpZXdNYXRyaXgoKSk7XG5cblx0Ly8gdmFyIG0gPSBtYXQ0LmNyZWF0ZSgpO1xuXHQvLyBtYXQ0LmludmVydChtLCB0aGlzLl9jYW1lcmEuZ2V0Vmlld01hdHJpeCgpKTtcblxuXHQvLyB0aGlzLl9tdk1hdHJpeCA9IG07XG5cblxuXHRcbn07XG5cbnAuY2FsY3VsYXRlTm9ybWFsID0gZnVuY3Rpb24oKXtcblxuXHRtYXQ0LmlkZW50aXR5KHRoaXMuX25NYXRyaXgpO1xuXHRtYXQ0LmNvcHkodGhpcy5fbk1hdHJpeCwgdGhpcy5fbXZNYXRyaXgpO1xuXHRtYXQ0LmludmVydCh0aGlzLl9uTWF0cml4LCB0aGlzLl9uTWF0cml4KTtcblx0bWF0NC50cmFuc3Bvc2UodGhpcy5fbk1hdHJpeCwgdGhpcy5fbk1hdHJpeCk7XG5cblxufTtcblxucC5jYWxjdWxhdGVQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XG5cblx0bWF0NC5pZGVudGl0eSh0aGlzLl9wTWF0cml4KTtcblx0bWF0NC5wZXJzcGVjdGl2ZShTY2VuZVRyYW5zZm9ybXMuRklFTERfT0ZfVklFVywgdGhpcy5fY2FudmFzLndpZHRoIC8gdGhpcy5fY2FudmFzLmhlaWdodCwgMC4xLCAxMDAwLCB0aGlzLl9wTWF0cml4KTtcbn07XG5cbnAudXBkYXRlUGVyc3BlY3RpdmUgPSBmdW5jdGlvbih3LCBoKXtcblxuXHRtYXQ0LnBlcnNwZWN0aXZlKHRoaXMuX3BNYXRyaXgsIFNjZW5lVHJhbnNmb3Jtcy5GSUVMRF9PRl9WSUVXLCB3IC8gaCwgMC4xLCAxMDAwKTtcdFxufTtcblxucC5yZXNldFBlcnNwZWN0aXZlID0gZnVuY3Rpb24oKXtcblxuXHRtYXQ0LmlkZW50aXR5KHRoaXMuX3BNYXRyaXgpO1xufTtcblxuXG5wLnNldE1hdHJpeFVuaWZvcm1zID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLmNhbGN1bGF0ZU5vcm1hbCgpO1xuXHRcdFxufTtcblxucC5nZXRNdk1hdHJpeCA9IGZ1bmN0aW9uKCl7XG5cblx0Ly8gdmFyIG0gPSBtYXQ0LmNyZWF0ZSgpO1xuXHQvLyBtYXQ0LmNvcHkobSwgdGhpcy5fbXZNYXRyaXgpO1xuXG5cdC8vIHJldHVybiBtO1xuXHRyZXR1cm4gdGhpcy5fbXZNYXRyaXg7XHRcbn07XG5cbnAuZ2V0UHJvamVjdGlvbk1hdHJpeCA9IGZ1bmN0aW9uKCl7XG5cblx0Ly8gcmV0dXJuIHRoaXMuX3BNYXRyaXg7XHRcblx0cmV0dXJuIHRoaXMuX2NhbWVyYS5nZXRQcm9qZWN0aW9uTWF0cml4KCk7XG59O1xuXG5wLmdldE5vcm1hbE1hdHJpeCA9IGZ1bmN0aW9uKCl7XG5cblx0cmV0dXJuIHRoaXMuX25NYXRyaXg7XHRcbn07XG5cbnAucG9wID0gZnVuY3Rpb24oKXtcblxuXHRpZih0aGlzLl9zdGFjay5sZW5ndGggPT0gMCkgcmV0dXJuO1xuXHR0aGlzLl9tdk1hdHJpeCA9IHRoaXMuX3N0YWNrLnBvcCgpO1xuXG59O1xuXG5wLnB1c2ggPSBmdW5jdGlvbigpe1xuXG5cdHZhciBtZW1lbnRvID0gbWF0NC5jcmVhdGUoKTtcblx0bWF0NC5jb3B5KG1lbWVudG8sIHRoaXMuX212TWF0cml4KTtcblx0dGhpcy5fc3RhY2sucHVzaChtZW1lbnRvKTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZVRyYW5zZm9ybXM7IiwiLy9TaGFkZXJQcm9ncmFtLmpzXG5cbmZ1bmN0aW9uIFNoYWRlclByb2dyYW0oKXt9O1xuXG52YXIgcCA9IFNoYWRlclByb2dyYW0ucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0ZXhTaGFkZXIsIGZyYWdtZW50U2hhZGVyKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cblx0dGhpcy5pZFZlcnRleCAgID0gJ3ZlcnRleCc7XG5cdHRoaXMuaWRGcmFnbWVudCA9ICdmcmFnbWVudCc7XG5cdC8vIHRoaXMuZ2V0U2hhZGVyKHRoaXMuaWRWZXJ0ZXgsIHRydWUpO1xuXHQvLyB0aGlzLmdldFNoYWRlcih0aGlzLmlkRnJhZ21lbnQsIGZhbHNlKTtcblx0dGhpcy5jcmVhdGVTaGFkZXJQcm9ncmFtKHZlcnRleFNoYWRlciwgdHJ1ZSk7XG5cdHRoaXMuY3JlYXRlU2hhZGVyUHJvZ3JhbShmcmFnbWVudFNoYWRlciwgZmFsc2UpO1xuXHR0aGlzLnBhcmFtZXRlcnMgPSBbXTtcblx0Ly8gdGhpcy5faXNSZWFkeSA9IHRydWVlO1xuXG5cdFxuXG59O1xuXG5wLm9uU2hhZGVyc0xvYWRlZCA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5wcmcgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG5cdGdsLmF0dGFjaFNoYWRlcih0aGlzLnByZywgdGhpcy52ZXJ0ZXhTaGFkZXIpO1xuXHRnbC5hdHRhY2hTaGFkZXIodGhpcy5wcmcsIHRoaXMuZnJhZ21lbnRTaGFkZXIpO1xuXHRnbC5saW5rUHJvZ3JhbSh0aGlzLnByZyk7XG5cdHRoaXMuX2lzUmVhZHkgPSB0cnVlO1x0XG59O1xuXG5wLmdldFNoYWRlciA9IGZ1bmN0aW9uKGlkLCBpc1ZlcnRleFNoYWRlcikge1xuXHR2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcS5oYXNDb21wbGV0ZWQgPSBmYWxzZTtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRyZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZSkge1xuXHRcdGlmKGUudGFyZ2V0LnJlYWR5U3RhdGUgPT0gNCkgc2VsZi5jcmVhdGVTaGFkZXJQcm9ncmFtKGUudGFyZ2V0LnJlc3BvbnNlVGV4dCwgaXNWZXJ0ZXhTaGFkZXIpXG5cdH07XG5cdHJlcS5vcGVuKFwiR0VUXCIsIGlkLCB0cnVlKTtcblx0cmVxLnNlbmQobnVsbCk7XG59XG5cblxucC5jcmVhdGVTaGFkZXJQcm9ncmFtID0gZnVuY3Rpb24oc3RyLCBpc1ZlcnRleFNoYWRlcikge1xuXHR2YXIgc2hhZGVyID0gaXNWZXJ0ZXhTaGFkZXIgPyBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUikgOiBnbC5jcmVhdGVTaGFkZXIoZ2wuRlJBR01FTlRfU0hBREVSKTtcblxuXHRnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzdHIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcblxuICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICAgIGFsZXJ0KGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuXG4gICAgaWYoaXNWZXJ0ZXhTaGFkZXIpIHRoaXMudmVydGV4U2hhZGVyID0gc2hhZGVyO1xuICAgIGVsc2UgdGhpcy5mcmFnbWVudFNoYWRlciA9IHNoYWRlcjtcblxuICAgIGlmKHRoaXMudmVydGV4U2hhZGVyIT11bmRlZmluZWQgJiYgdGhpcy5mcmFnbWVudFNoYWRlciE9dW5kZWZpbmVkKSB0aGlzLm9uU2hhZGVyc0xvYWRlZCgpO1xufTtcblxuXG5wLmJpbmQgPSBmdW5jdGlvbigpIHtcblx0Z2wudXNlUHJvZ3JhbSh0aGlzLnByZyk7XG5cblx0aWYgKCF0aGlzLnByZykgZGVidWdnZXI7XG5cblx0aWYodGhpcy5wcmcucE1hdHJpeFVuaWZvcm0gPT0gdW5kZWZpbmVkKSB0aGlzLnByZy5wTWF0cml4VW5pZm9ybSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByZywgXCJ1UE1hdHJpeFwiKTtcblx0aWYodGhpcy5wcmcubXZNYXRyaXhVbmlmb3JtID09IHVuZGVmaW5lZCkgdGhpcy5wcmcubXZNYXRyaXhVbmlmb3JtID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJnLCBcInVNVk1hdHJpeFwiKTtcblxuXHQvLyBHbG9iYWwuXG5cdC8vIEdMLnNoYWRlciBcdFx0XHQ9IHRoaXM7XG5cdC8vIEdMLnNoYWRlciBcdD0gdGhpcztcblxuXHR0aGlzLnVuaWZvcm1UZXh0dXJlcyA9IFtdO1xufTtcblxuXG5wLnVuaWZvcm0gPSBmdW5jdGlvbihuYW1lLCB0eXBlLCB2YWx1ZSkge1xuXHRpZih0eXBlID09IFwidGV4dHVyZVwiKSB0eXBlID0gXCJ1bmlmb3JtMWlcIjtcblx0XG5cdHZhciBoYXNVbmlmb3JtID0gZmFsc2U7XG5cdHZhciBvVW5pZm9ybTtcblx0Zm9yKHZhciBpPTA7IGk8dGhpcy5wYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XG5cdFx0b1VuaWZvcm0gPSB0aGlzLnBhcmFtZXRlcnNbaV07XG5cdFx0aWYob1VuaWZvcm0ubmFtZSA9PSBuYW1lKSB7XG5cdFx0XHRvVW5pZm9ybS52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0aGFzVW5pZm9ybSA9IHRydWU7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRpZighaGFzVW5pZm9ybSkge1xuXHRcdHRoaXMucHJnW25hbWVdID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJnLCBuYW1lKTtcblx0XHR0aGlzLnBhcmFtZXRlcnMucHVzaCgge25hbWU6bmFtZSwgdHlwZTp0eXBlLCB2YWx1ZTp2YWx1ZSwgdW5pZm9ybUxvYzp0aGlzLnByZ1tuYW1lXX0gKTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLnByZ1tuYW1lXSA9IG9Vbmlmb3JtLnVuaWZvcm1Mb2M7XG5cdH1cblxuXG5cdGlmKHR5cGUuaW5kZXhPZihcIk1hdHJpeFwiKSA9PSAtMSkge1xuXHRcdGdsW3R5cGVdKHRoaXMucHJnW25hbWVdLCB2YWx1ZSk7XG5cdH0gZWxzZSB7XG5cdFx0Z2xbdHlwZV0odGhpcy5wcmdbbmFtZV0sIGZhbHNlLCB2YWx1ZSk7XG5cdH1cblxuXHRpZih0eXBlID09IFwidW5pZm9ybTFpXCIpIHtcdC8vXHRURVhUVVJFXG5cdFx0dGhpcy51bmlmb3JtVGV4dHVyZXNbdmFsdWVdID0gdGhpcy5wcmdbbmFtZV07XG5cdFx0Ly8gaWYobmFtZSA9PSBcInRleHR1cmVGb3JjZVwiKSBjb25zb2xlLmxvZyggXCJUZXh0dXJlIEZvcmNlIDogXCIsICB0aGlzLnVuaWZvcm1UZXh0dXJlc1t2YWx1ZV0sIHZhbHVlICk7XG5cdH1cbn1cblxuXG5cbnAudW5iaW5kID0gZnVuY3Rpb24oKSB7XG5cdFxufTtcblxucC5pc1JlYWR5ID0gZnVuY3Rpb24oKSB7XHRyZXR1cm4gdGhpcy5faXNSZWFkeTtcdH07XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhZGVyUHJvZ3JhbTsiLCIvL1NwZWN0cnVtQW5hbHl6ZXIuanNcblxuXG5mdW5jdGlvbiBTcGVjdHJ1bUFuYWx5emVyKCl7XG5cblx0dGhpcy5ub2RlID0gbnVsbDtcblx0dGhpcy5fcGFyZW50RWwgPSBudWxsO1xuXHR0aGlzLl9jYW52YXNPYmogPSB7fTtcblx0dGhpcy5fYXVkaW9DdHggPSBudWxsO1xuXHR0aGlzLl9wcm9jZXNzQXJyYXkgPSBbXTtcblxuXHR0aGlzLl9zdWJiYW5kcyA9IFtdO1xuXHRcblx0XG5cdFxuXHR0aGlzLmNvbG9yVGhlbWUgPSBbXTtcblxuXHR0aGlzLl9jdXJyTWF4VmFsID0gMjA7XG5cblx0dGhpcy5fYXVkaW9EYXRhT3V0ID0gW107XG5cdHRoaXMuc3ViYmFuZFdpZHRoVGFibGUgPSBbMiwyLDMsMywzLDMsMywzLDMsMywzLDMsMywzLDQsNCw0LDQsNCw0LDQsNCw0LDQsNCw0LDQsNSw1LDUsNSw1LDUsNSw1LDUsNSw1LDUsNSw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNiw3LDcsNyw3LDcsNyw3LDcsNyw3LDcsNyw3LDgsOCw4LDgsOCw4LDgsOCw4LDgsOCw4LDgsOSw5LDksOSw5LDksOSw5LDksOSw5LDksMTAsMTAsMTAsMTAsMTAsMTAsMTAsMTAsMTAsMTAsMTAsMTAsMTAsMTEsMTEsMTEsMTEsMTEsMTEsMTEsMTEsMTEsMTEsMTEsMTEsMTEsMTIsMTIsMTIsMTIsMTIsMTIsMTIsMTIsMTIsMTIsMTIsMTJdO1xuXHR0aGlzLl9jdXJyZW50U3ViYmFuZFRvdFdpZHRoID0gMDtcblxuXHQvLyBjb25zb2xlLmxvZyh0aGlzLl9zdWJiYW5kc0hpc3RvcnkpO1xuXG59O1xuXG52YXIgcCA9IFNwZWN0cnVtQW5hbHl6ZXIucHJvdG90eXBlO1xuXG5TcGVjdHJ1bUFuYWx5emVyLlNVQkJBTkRTID0gNjQ7XG5TcGVjdHJ1bUFuYWx5emVyLkhJU1RPUllfU0laRSA9IDQzO1xuXG5wLmluaXQgPSBmdW5jdGlvbihjdHgpe1xuXG5cdHRoaXMubm9kZSA9IGN0eC5jcmVhdGVBbmFseXNlcigpO1xuXHR0aGlzLm5vZGUuZmZ0U2l6ZSA9IDIwNDg7XG5cdHRoaXMubm9kZS5tYXhEZWNpYmVscyA9IC0zMDtcblx0dGhpcy5ub2RlLm1pbkRlY2liZWxzID0gLTEwMDtcblx0dGhpcy5fYXVkaW9DdHggPSBjdHg7XG5cdC8vIHRoaXMuX3BhcmVudEVsID0gcGFyZW50O1xuXHQvLyB0aGlzLl9jYW52YXNPYmogPSB0aGlzLmNyZWF0ZUNhbnZhc09iaigpO1xuXHR0aGlzLl9wcm9jZXNzQXJyYXkgPSBuZXcgVWludDhBcnJheSh0aGlzLm5vZGUuZnJlcXVlbmN5QmluQ291bnQpO1xuXG5cblx0Zm9yICh2YXIgaT0wOyBpPFNwZWN0cnVtQW5hbHl6ZXIuU1VCQkFORFM7aSsrKXtcblx0XHR2YXIgaGlzdG9yeUFyciA9IFtdO1xuXHRcdGZvciAodmFyIGs9MDtrPFNwZWN0cnVtQW5hbHl6ZXIuSElTVE9SWV9TSVpFO2srKyl7XG5cdFx0XHR2YXIgdmFsID0gMDtcblx0XHRcdGhpc3RvcnlBcnIucHVzaCh2YWwpO1xuXHRcdH1cblxuXHRcdHZhciBvYmogPSB7XG5cdFx0XHRjdXJyZW50Ontcblx0XHRcdFx0c3VtOiAwXG5cdFx0XHR9LFxuXHRcdFx0aGlzdG9yeTp7XG5cdFx0XHRcdGFyciA6IGhpc3RvcnlBcnIsXG5cdFx0XHRcdHN1bSA6IDAgXG5cdFx0XHR9LFxuXHRcdFx0aWR4Omlcblx0XHR9O1xuXHRcdHRoaXMuX3N1YmJhbmRzLnB1c2gob2JqKTtcblxuXHR9XG5cblxuXG5cblx0dGhpcy5fc2NyaXB0Tm9kZSA9IHRoaXMuX2F1ZGlvQ3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3Nvcih0aGlzLm5vZGUuZnJlcXVlbmN5QmluQ291bnQsMiwxKTtcblx0Ly8gZGVidWdnZXI7XG5cdHRoaXMuX3NjcmlwdE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignYXVkaW9wcm9jZXNzJywgdGhpcy5fb25BdWRpb1Byb2Nlc3MuYmluZCh0aGlzKSk7XG5cbn07XG5cbnAuY3JlYXRlQ2FudmFzT2JqID0gZnVuY3Rpb24oKXtcblxuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdGNhbnZhcy5jbGFzc05hbWUgPSBcIndhdmVmb3JtQW5hbHlzZXJcIjtcblx0Y2FudmFzLmhlaWdodCA9IHRoaXMuX3BhcmVudEVsLmNsaWVudEhlaWdodDtcblx0Y2FudmFzLndpZHRoID0gdGhpcy5fcGFyZW50RWwuY2xpZW50V2lkdGg7XG5cdHRoaXMuX3BhcmVudEVsLmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuXHRyZXR1cm4ge2VsOiBjYW52YXMsIGN0eDogY29udGV4dH07XG5cbn07XG5cbnAuX29uQXVkaW9Qcm9jZXNzID0gZnVuY3Rpb24oZSl7XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0dGhpcy51cGRhdGUoKTtcblx0XG5cdC8vIHRoaXMucmVuZGVyKCk7XG5cdHRoaXMuX2F1ZGlvRGF0YU91dCA9IHRoaXMuY3JlYXRlQXVkaW9EYXRhKCk7XG59O1xuXG5wLmdldEF1ZGlvRGF0YSA9IGZ1bmN0aW9uKCl7XG5cblx0Ly8gcmV0dXJuIHRoaXMuX2F1ZGlvRGF0YU91dC5zbGljZSgwKTtcblxuXHRcblx0dmFyIGF1ZGlvRGF0YSA9IFtdO1xuXHRpZiAodGhpcy5fYXVkaW9EYXRhT3V0Lmxlbmd0aCA+IDgpe1xuXHRcdHZhciBzdWJiYW5kcyA9IFsxLCAyLCA0LCA2LCA4LCAyMCwgMzAsIDQwLCA1MCwgNjBdO1xuXHRcblx0XHRcblx0XHRmb3IgKHZhciBpPTA7aTxzdWJiYW5kcy5sZW5ndGg7aSsrKXtcblx0XHRcdGF1ZGlvRGF0YVtpXSA9IHRoaXMuX2F1ZGlvRGF0YU91dFswXVtzdWJiYW5kc1tpXV07XG5cdFx0fVxuXG5cdFx0Ly8gY29uc29sZS5sb2coYXVkaW9EYXRhKTtcblx0fVxuXG5cdHJldHVybiBhdWRpb0RhdGEuc2xpY2UoMCk7XG59O1xuXG5wLmNvbm5lY3QgPSBmdW5jdGlvbihub2RlKXtcblxuXHRub2RlLmNvbm5lY3QodGhpcy5ub2RlKTtcblx0bm9kZS5jb25uZWN0KHRoaXMuX3NjcmlwdE5vZGUpO1xuXG5cdHRoaXMuX3NjcmlwdE5vZGUuY29ubmVjdCh0aGlzLl9hdWRpb0N0eC5kZXN0aW5hdGlvbik7XG5cbn07XG5cbnAuZGlzY29ubmVjdCA9IGZ1bmN0aW9uKG5vZGUpe1xuXG5cdG5vZGUuZGlzY29ubmVjdCh0aGlzLm5vZGUpO1xuXHRub2RlLmRpc2Nvbm5lY3QodGhpcy5fc2NyaXB0Tm9kZSk7XG5cblx0dGhpcy5fc2NyaXB0Tm9kZS5kaXNjb25uZWN0KHRoaXMuX2F1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcbn07XG5cbnAudXBkYXRlID0gZnVuY3Rpb24oKXtcblxuXHQvLyB0aGlzLm5vZGUuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKHRoaXMuX3Byb2Nlc3NBcnJheSk7XG5cdHRoaXMubm9kZS5nZXRCeXRlRnJlcXVlbmN5RGF0YSh0aGlzLl9wcm9jZXNzQXJyYXkpO1xuXG5cdC8vIGNvbnNvbGUubG9nKHRoaXMuX3Byb2Nlc3NBcnJheSk7XG5cdFxufTtcblxucC5jcmVhdGVBdWRpb0RhdGEgPSBmdW5jdGlvbigpe1xuXG5cdC8vIHZhciByZXQgPSBuZXcgRmxvYXQzMkFycmF5KFNwZWN0cnVtQW5hbHl6ZXIuU1VCQkFORFMqMyk7XG5cdHZhciByZXQgPSBbXTtcblxuXHR0aGlzLmNhbGNTdWJiYW5kRW5lcmd5KCk7XG5cdHRoaXMuY2FsY1N1YmJhbmRIaXN0b3J5QXZlcmFnZSgpO1xuXHR0aGlzLnNoaWZ0SGlzdG9yeSgpO1xuXG5cdHZhciBzdWJiYW5kUmFuZ2VBdmVyYWdlU3VtID0gMDtcblx0dmFyIHN1YmJhbmRSYW5nZUN1cnJlbnRTdW0gPSAwO1xuXG5cblx0XG5cdHZhciBjdXJyZW50Um93ID0gbmV3IEZsb2F0MzJBcnJheShTcGVjdHJ1bUFuYWx5emVyLlNVQkJBTkRTKTtcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fc3ViYmFuZHMubGVuZ3RoO2krKyl7XG5cdFx0XG5cdFx0dmFyIGN1cnJlbnRTdW0gPSB0aGlzLl9zdWJiYW5kc1tpXS5jdXJyZW50LnN1bTtcblx0XHR2YXIgYXZlcmFnZVN1bSA9IHRoaXMuX3N1YmJhbmRzW2ldLmhpc3Rvcnkuc3VtO1xuXG5cdFx0Ly8gcmV0W2ldID0ge307XG5cdFx0Ly8gcmV0W2ldLmN1cnJlbnQgPSBjdXJyZW50U3VtO1xuXHRcdGN1cnJlbnRSb3dbaV0gPSBjdXJyZW50U3VtO1xuXHRcdFxuXG5cblx0fVxuXG5cdHJldC5wdXNoKGN1cnJlbnRSb3cpO1xuXG5cdC8vIHZhciBoaXN0b3J5Um93cyA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTwxMTtpKyspe1xuXHRcdHZhciBoaXN0b3J5U3ViYmFuZCA9IG5ldyBGbG9hdDMyQXJyYXkoU3BlY3RydW1BbmFseXplci5TVUJCQU5EUyk7XG5cdFx0Zm9yICh2YXIgeD0wO3g8dGhpcy5fc3ViYmFuZHMubGVuZ3RoO3grKyl7XG5cdFx0XHRoaXN0b3J5U3ViYmFuZFt4XSA9IHRoaXMuX3N1YmJhbmRzW3hdLmhpc3RvcnkuYXJyW2ldXG5cdFx0fVxuXHRcdHJldC5wdXNoKGhpc3RvcnlTdWJiYW5kKVxuXHRcdC8vIGhpc3RvcnlSb3dzW2ldID0gaGlzdG9yeVN1YmJhbmQ7XG5cdH1cblxuXG5cblxuXHRyZXR1cm4gcmV0O1xuXHQvLyBkZWJ1Z2dlcjtcblx0Ly8gd2luZG93Lm9uQXVkaW9EYXRhKHJldCk7XG59O1xuXG5wLmdldEZyZXFGcm9tRkZUSWR4ID0gZnVuY3Rpb24oaWR4KXtcblxuXHR2YXIgcmV0ID0gZmFsc2U7XG5cblx0aWYgKGlkeCA8IDUxMil7XG5cdFx0cmV0ID0gaWR4ICogdGhpcy5fYXVkaW9DdHguc2FtcGxlUmF0ZSAvIHRoaXMubm9kZS5mcmVxdWVuY3lCaW5Db3VudDtcblx0fVxuXG5cdHJldHVybiByZXQ7XG59O1xuXG5wLnJlbmRlciA9IGZ1bmN0aW9uKCl7XG5cblx0dmFyIGN0eCA9IHRoaXMuX2NhbnZhc09iai5jdHg7XG5cdHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXNPYmouZWw7XG5cblx0dGhpcy5jYWxjU3ViYmFuZEVuZXJneSgpO1xuXHR0aGlzLmNhbGNTdWJiYW5kSGlzdG9yeUF2ZXJhZ2UoKTtcblx0dGhpcy5zaGlmdEhpc3RvcnkoKTtcblxuXHR2YXIgc3ViYmFuZFdpZHRoID0gY2FudmFzLndpZHRoIC8gdGhpcy5fc3ViYmFuZHMubGVuZ3RoO1xuXG5cdGN0eC5jbGVhclJlY3QoMCwwLGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cdFxuXHR2YXIgc3ViYmFuZFJhbmdlQXZlcmFnZVN1bSA9IDA7XG5cdHZhciBzdWJiYW5kUmFuZ2VDdXJyZW50U3VtID0gMDtcblxuXHR2YXIgd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDI7XG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fc3ViYmFuZHMubGVuZ3RoO2krKyl7XG5cdFx0XG5cdFx0dmFyIGN1cnJlbnRTdW0gPSB0aGlzLl9zdWJiYW5kc1tpXS5jdXJyZW50LnN1bTtcblx0XHR2YXIgYXZlcmFnZVN1bSA9IHRoaXMuX3N1YmJhbmRzW2ldLmhpc3Rvcnkuc3VtO1xuXG5cdFx0aWYgKGN1cnJlbnRTdW0gPiB0aGlzLl9jdXJyTWF4VmFsKVxuXHRcdFx0dGhpcy5fY3Vyck1heFZhbCA9IGN1cnJlbnRTdW07XG5cblx0XHR2YXIgcmVsSGVpZ2h0Q3VycmVudCA9IGN1cnJlbnRTdW0gLyB0aGlzLl9jdXJyTWF4VmFsO1xuXHRcdHJlbEhlaWdodEN1cnJlbnQgPSByZWxIZWlnaHRDdXJyZW50ICogd0hlaWdodDtcblxuXHRcdHZhciByZWxIZWlnaHRBdmVyYWdlID0gYXZlcmFnZVN1bSAvIHRoaXMuX2N1cnJNYXhWYWw7XG5cdFx0cmVsSGVpZ2h0QXZlcmFnZSA9IHJlbEhlaWdodEF2ZXJhZ2UgKiB3SGVpZ2h0O1xuXG5cdFx0Y3R4LmZvbnQgPSAnMTBweCBBcmlhbCc7XG5cdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3JUaGVtZVsxXTtcblx0XHRjdHguZmlsbFRleHQoaSsxLHN1YmJhbmRXaWR0aCppK3N1YmJhbmRXaWR0aC80LCAyMCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvclRoZW1lWzJdO1xuXHRcdGN0eC5maWxsUmVjdChzdWJiYW5kV2lkdGgqaSwgY2FudmFzLmhlaWdodCwgc3ViYmFuZFdpZHRoLCAtcmVsSGVpZ2h0Q3VycmVudCk7XG5cblx0XHRjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvclRoZW1lWzNdO1xuXHRcdGN0eC5maWxsUmVjdChzdWJiYW5kV2lkdGgqaSwgY2FudmFzLmhlaWdodCwgc3ViYmFuZFdpZHRoLCAtcmVsSGVpZ2h0QXZlcmFnZSk7XG5cblx0fVxuXG59O1xuXG5cblxucC5jYWxjU3ViYmFuZEVuZXJneSA9IGZ1bmN0aW9uKCl7XG5cblxuXHR0aGlzLl9jdXJyZW50U3ViYmFuZFRvdFdpZHRoID0gMDtcblxuXG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fc3ViYmFuZHMubGVuZ3RoO2krKyl7XG5cblx0XHR2YXIgc3ViYmFuZFNpemUgPSB0aGlzLnN1YmJhbmRXaWR0aFRhYmxlW2ldO1xuXG5cdFx0dmFyIG9iaiA9IHRoaXMuX3N1YmJhbmRzW2ldLmN1cnJlbnQ7XG5cdFx0b2JqLnN1bSA9IDA7XG5cdFx0b2JqLndpZHRoID0gc3ViYmFuZFNpemU7XG5cblx0XG5cdFx0dmFyIHJhbmdlID0gdGhpcy5fY3VycmVudFN1YmJhbmRUb3RXaWR0aDtcblx0XHRcblx0XHRcblx0XHRmb3IgKHZhciBrPXJhbmdlO2s8cmFuZ2Urc3ViYmFuZFNpemU7aysrKXtcblx0XHRcdG9iai5zdW0gKz0gdGhpcy5fcHJvY2Vzc0FycmF5W2tdO1xuXHRcdFx0Ly8gY29uc29sZS5sb2coayk7XG5cdFx0XHRcblx0XHR9XG5cdFx0dmFyIHN0YXJ0RnJlcSA9IHRoaXMuZ2V0RnJlcUZyb21GRlRJZHgocmFuZ2UpO1xuXHRcdHZhciBlbmRGcmVxID0gdGhpcy5nZXRGcmVxRnJvbUZGVElkeChyYW5nZStzdWJiYW5kU2l6ZSk7XG5cblxuXG5cdFx0b2JqLnN1bSAqPSBzdWJiYW5kU2l6ZS8odGhpcy5ub2RlLmZmdFNpemUvMik7XG5cdFxuXHRcdHRoaXMuX2N1cnJlbnRTdWJiYW5kVG90V2lkdGggKz0gb2JqLndpZHRoO1xuXG5cdH1cbn07XG5cbnAuY2FsY1N1YmJhbmRIaXN0b3J5QXZlcmFnZSA9IGZ1bmN0aW9uKCl7XG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fc3ViYmFuZHMubGVuZ3RoO2krKyl7XG5cblx0XHR2YXIgc3ViYmFuZEhpc3RvcnkgPSB0aGlzLl9zdWJiYW5kc1tpXS5oaXN0b3J5LmFycjtcblx0XHR2YXIgc3ViYmFuZEhpc3RvcnlTdW0gPSB0aGlzLl9zdWJiYW5kc1tpXS5oaXN0b3J5LnN1bTtcblx0XG5cdFx0Zm9yICh2YXIgaz0wO2s8c3ViYmFuZEhpc3RvcnkubGVuZ3RoLTE7aysrKXtcblx0XHRcdHN1YmJhbmRIaXN0b3J5U3VtICs9IHN1YmJhbmRIaXN0b3J5W2tdO1xuXHRcdFx0XG5cdFx0fVxuXHRcdHN1YmJhbmRIaXN0b3J5U3VtICo9IDEvc3ViYmFuZEhpc3RvcnkubGVuZ3RoO1xuXG5cdFx0dGhpcy5fc3ViYmFuZHNbaV0uaGlzdG9yeS5zdW0gPSBzdWJiYW5kSGlzdG9yeVN1bTtcblxuXHRcdFxuXG5cdH1cblxufTtcblxuXG5wLnNoaWZ0SGlzdG9yeSA9IGZ1bmN0aW9uKCl7XG5cblxuXHR2YXIgc3ViYmFuZFRlbXBBcnIgPSB0aGlzLl9zdWJiYW5kcy5zbGljZSgpO1xuXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3N1YmJhbmRzLmxlbmd0aDtpKyspe1xuXHRcblx0XHR2YXIgaGlzdG9yeUFyciA9IHRoaXMuX3N1YmJhbmRzW2ldLmhpc3RvcnkuYXJyO1xuXHRcdGhpc3RvcnlBcnIudW5zaGlmdChzdWJiYW5kVGVtcEFycltpXS5jdXJyZW50LnN1bSk7XG5cdFx0aWYgKGhpc3RvcnlBcnIubGVuZ3RoID4gU3BlY3RydW1BbmFseXplci5ISVNUT1JZX1NJWkUpXG5cdFx0XHRoaXN0b3J5QXJyLnBvcCgpO1xuXG5cdFx0XG5cdH1cblx0XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3BlY3RydW1BbmFseXplcjsiLCIvL1RleHR1cmUuanNcblxuZnVuY3Rpb24gVGV4dHVyZSgpe307XG5cbnZhciBnbDtcblxudmFyIHAgPSBUZXh0dXJlLnByb3RvdHlwZTtcblxucC5pbml0ID0gZnVuY3Rpb24oc291cmNlLCBpc1RleHR1cmUpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblxuXHRpZiAoaXNUZXh0dXJlID09IHVuZGVmaW5lZClcblx0XHRpc1RleHR1cmUgPSBpc1RleHR1cmUgPT0gdW5kZWZpbmVkID8gZmFsc2UgOiB0cnVlO1xuXHQvLyBnbCA9IEdMLmdsO1xuXHRpZihpc1RleHR1cmUpIHtcblx0XHR0aGlzLnRleHR1cmUgPSBzb3VyY2U7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy50ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdHRoaXMuX2lzVmlkZW8gPSAoc291cmNlLnRhZ05hbWUgPT0gXCJWSURFT1wiKTtcblxuXG5cdFx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblx0XHRnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCB0cnVlKTtcblx0XHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHNvdXJjZSk7XG5cblx0XHRpZighdGhpcy5faXNWaWRlbykge1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLk1JUlJPUkVEX1JFUEVBVCk7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5NSVJST1JFRF9SRVBFQVQpO1xuXHRcdFx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5NSVJST1JFRF9SRVBFQVQpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuTUlSUk9SRURfUkVQRUFUKTtcblx0XHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHRcdH1cblxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuXHR9XG5cbn07XG5cbnAudXBkYXRlVGV4dHVyZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuXG5cblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdHJ1ZSk7XG5cdGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgc291cmNlKTtcblxuXHQvLyBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIHRoaXMuZnJhbWVCdWZmZXIud2lkdGgsIHRoaXMuZnJhbWVCdWZmZXIuaGVpZ2h0LCAwLCBnbC5SR0JBLCB0ZXhUeXBlLCBudWxsKTtcblxuXHRpZighdGhpcy5faXNWaWRlbykge1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVJfTUlQTUFQX05FQVJFU1QpO1xuXHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHR9IGVsc2Uge1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xuXHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xuXHR9XG5cblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG59O1xuXG5cbnAuYmluZCA9IGZ1bmN0aW9uKHNoYWRlciwgaW5kZXgsIHRvRGVidWcpIHtcblx0aWYoaW5kZXggPT0gdW5kZWZpbmVkKSBpbmRleCA9IDA7XG5cblx0Z2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIGluZGV4KTtcblx0Ly8gY29uc29sZS5sb2coIGdsLlRFWFRVUkUwICsgaSwgdGhpcy5fdGV4dHVyZXNbaV0udGV4dHVyZSApO1xuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuXHQvLyBnbC51bmlmb3JtMWkoc2hhZGVyUHJvZ3JhbVtcInNhbXBsZXJVbmlmb3JtXCIraV0sIGkpO1xuXHQvLyBpZih0b0RlYnVnKSBjb25zb2xlLmxvZyggR0wuc2hhZGVyLnVuaWZvcm1UZXh0dXJlc1tpbmRleF0sIHRoaXMgKTtcblx0Z2wudW5pZm9ybTFpKHNoYWRlci51bmlmb3JtVGV4dHVyZXNbaW5kZXhdLCBpbmRleCk7XG5cdHRoaXMuX2JpbmRJbmRleCA9IGluZGV4O1xufTtcblxuXG5wLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcbn07XG5cblx0XG5tb2R1bGUuZXhwb3J0cyA9IFRleHR1cmU7IiwiLy9WaWV3LmpzXG5cbnZhciBTaGFkZXJQcm9ncmFtID0gcmVxdWlyZSgnLi9TaGFkZXJQcm9ncmFtJyk7XG5cbmZ1bmN0aW9uIFZpZXcoKXt9O1xuXG52YXIgcCA9IFZpZXcucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5wLmluaXQgPSBmdW5jdGlvbihzdHJWZXJ0LCBzdHJGcmFnKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cblx0dGhpcy50cmFuc2Zvcm1zID0gbnVsbDtcblxuXHR0aGlzLl9lbmFibGVkVmVydGV4QXR0cmliID0gW107XG5cblx0aWYoc3RyVmVydCA9PSB1bmRlZmluZWQpIHJldHVybjtcblx0dGhpcy5zaGFkZXIgPSBuZXcgU2hhZGVyUHJvZ3JhbSgpO1xuXHR0aGlzLnNoYWRlci5pbml0KHN0clZlcnQsIHN0ckZyYWcpO1xuXG5cdFxufTtcblxucC5kcmF3ID0gZnVuY3Rpb24obWVzaCl7XG5cblx0Ly8gdGhpcy50cmFuc2Zvcm1zLmNhbGN1bGF0ZU1vZGVsVmlldygpO1xuXG5cdGdsLnVuaWZvcm1NYXRyaXg0ZnYodGhpcy5zaGFkZXIucHJnLnBNYXRyaXhVbmlmb3JtLCBmYWxzZSwgdGhpcy50cmFuc2Zvcm1zLmdldFByb2plY3Rpb25NYXRyaXgoKSk7XG5cdGdsLnVuaWZvcm1NYXRyaXg0ZnYodGhpcy5zaGFkZXIucHJnLm12TWF0cml4VW5pZm9ybSwgZmFsc2UsIHRoaXMudHJhbnNmb3Jtcy5nZXRNdk1hdHJpeCgpKTtcblx0XG5cblx0Ly8gXHRWRVJURVggUE9TSVRJT05TXG5cdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBtZXNoLnZCdWZmZXJQb3MpO1xuXHR2YXIgdmVydGV4UG9zaXRpb25BdHRyaWJ1dGUgPSBnZXRBdHRyaWJMb2MoZ2wsIHRoaXMuc2hhZGVyLnByZywgXCJhVmVydGV4UG9zaXRpb25cIik7XG5cdGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodmVydGV4UG9zaXRpb25BdHRyaWJ1dGUsIG1lc2gudkJ1ZmZlclBvcy5pdGVtU2l6ZSwgZ2wuRkxPQVQsIGdsLkZBTFNFLCAwLCAwKTtcblx0aWYodGhpcy5fZW5hYmxlZFZlcnRleEF0dHJpYi5pbmRleE9mKHZlcnRleFBvc2l0aW9uQXR0cmlidXRlKSA9PSAtMSkge1xuXHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHZlcnRleFBvc2l0aW9uQXR0cmlidXRlKTtcblx0XHR0aGlzLl9lbmFibGVkVmVydGV4QXR0cmliLnB1c2godmVydGV4UG9zaXRpb25BdHRyaWJ1dGUpO1xuXHR9XG5cblx0XG5cblx0aWYgKG1lc2gudGV4dHVyZVVzZWQpe1xuXHRcdC8vXHRcdFRFWFRVUkUgQ09PUkRTXG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG1lc2gudkJ1ZmZlclVWKTtcblx0XHR2YXIgdGV4dHVyZUNvb3JkQXR0cmlidXRlID0gZ2V0QXR0cmliTG9jKGdsLCB0aGlzLnNoYWRlci5wcmcsIFwiYVRleHR1cmVDb29yZFwiKTtcblx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRleHR1cmVDb29yZEF0dHJpYnV0ZSwgbWVzaC52QnVmZmVyVVYuaXRlbVNpemUsIGdsLkZMT0FULCBnbC5GQUxTRSwgMCwgMCk7XG5cdFx0Ly8gZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGV4dHVyZUNvb3JkQXR0cmlidXRlKTtcblx0XHRpZih0aGlzLl9lbmFibGVkVmVydGV4QXR0cmliLmluZGV4T2YodGV4dHVyZUNvb3JkQXR0cmlidXRlKSA9PSAtMSkge1xuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGV4dHVyZUNvb3JkQXR0cmlidXRlKTtcblx0XHRcdHRoaXMuX2VuYWJsZWRWZXJ0ZXhBdHRyaWIucHVzaCh0ZXh0dXJlQ29vcmRBdHRyaWJ1dGUpO1xuXHRcdH1cblx0fVxuXHRcblxuXHQvL1x0SU5ESUNFU1xuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBtZXNoLmlCdWZmZXIpO1xuXG5cdC8vXHRFWFRSQSBBVFRSSUJVVEVTXG5cdGZvcih2YXIgaT0wOyBpPG1lc2guZXh0cmFBdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG1lc2guZXh0cmFBdHRyaWJ1dGVzW2ldLmJ1ZmZlcik7XG5cdFx0dmFyIGF0dHJQb3NpdGlvbiA9IGdldEF0dHJpYkxvYyhnbCwgdGhpcy5zaGFkZXIucHJnLCBtZXNoLmV4dHJhQXR0cmlidXRlc1tpXS5uYW1lKTtcblx0XHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGF0dHJQb3NpdGlvbiwgbWVzaC5leHRyYUF0dHJpYnV0ZXNbaV0uaXRlbVNpemUsIGdsLkZMT0FULCBnbC5GQUxTRSwgMCwgMCk7XG5cdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0clBvc2l0aW9uKTtcdFx0XG5cblx0XHRpZih0aGlzLl9lbmFibGVkVmVydGV4QXR0cmliLmluZGV4T2YoYXR0clBvc2l0aW9uKSA9PSAtMSkge1xuXHRcdFx0Z2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoYXR0clBvc2l0aW9uKTtcblx0XHRcdHRoaXMuX2VuYWJsZWRWZXJ0ZXhBdHRyaWIucHVzaChhdHRyUG9zaXRpb24pO1xuXHRcdH1cblx0fVxuXG5cdC8vXHREUkFXSU5HXG5cdC8vIGdsLmRyYXdFbGVtZW50cyhtZXNoLmRyYXdUeXBlLCBtZXNoLmlCdWZmZXIubnVtSXRlbXMsIGdsLlVOU0lHTkVEX1NIT1JULCAwKTtcdFxuXHRpZihtZXNoLmRyYXdUeXBlID09IGdsLlBPSU5UUyApIHtcblx0XHRnbC5kcmF3QXJyYXlzKG1lc2guZHJhd1R5cGUsIDAsIG1lc2gudmVydGV4U2l6ZSk7XHRcblx0fSBlbHNle1xuXHRcdGdsLmRyYXdFbGVtZW50cyhtZXNoLmRyYXdUeXBlLCBtZXNoLmlCdWZmZXIubnVtSXRlbXMsIGdsLlVOU0lHTkVEX1NIT1JULCAwKTtcblx0fSBcblxuXG5cdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XG5cdFxuXG5cdGZ1bmN0aW9uIGdldEF0dHJpYkxvYyhnbCwgc2hhZGVyUHJvZ3JhbSwgbmFtZSkge1xuXHRcdGlmKHNoYWRlclByb2dyYW0uY2FjaGVBdHRyaWJMb2MgID09IHVuZGVmaW5lZCkgc2hhZGVyUHJvZ3JhbS5jYWNoZUF0dHJpYkxvYyA9IHt9O1xuXHRcdGlmKHNoYWRlclByb2dyYW0uY2FjaGVBdHRyaWJMb2NbbmFtZV0gPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRzaGFkZXJQcm9ncmFtLmNhY2hlQXR0cmliTG9jW25hbWVdID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oc2hhZGVyUHJvZ3JhbSwgbmFtZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNoYWRlclByb2dyYW0uY2FjaGVBdHRyaWJMb2NbbmFtZV07XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldzsiLCIvL0tleWJvYXJkSW50ZXJhY3Rvci5qc1xuXG5mdW5jdGlvbiBLZXlib2FyZEludGVyYWN0b3IoKXt9O1xuXG52YXIgcCA9IEtleWJvYXJkSW50ZXJhY3Rvci5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKGNhbWVyYSwgY2FudmFzKXtcblxuICAgIHRoaXMuY2FtID0gY2FtZXJhO1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xufTtcblxucC5zZXR1cCA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgc2VsZj10aGlzO1xuICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgc2VsZi5oYW5kbGVLZXlzKGV2ZW50KTtcbiAgICB9XG59O1xuXG5wLmhhbmRsZUtleXMgPSBmdW5jdGlvbihldmVudCl7XG5cblxuXG4gICAgaWYoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHsvL2RldGVybWluZSB0aGUga2V5IHByZXNzZWRcbiAgICAgICAgICAgIGNhc2UgNjU6Ly9hIGtleVxuICAgICAgICAgICAgICAgIHRoaXMuY2FtLnJvbGwoLU1hdGguUEkgKiAwLjAyNSk7Ly90aWx0IHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM3Oi8vbGVmdCBhcnJvd1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtLnlhdyhNYXRoLlBJICogMC4wMjUpOy8vcm90YXRlIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDY4Oi8vZCBrZXlcbiAgICAgICAgICAgICAgICB0aGlzLmNhbS5yb2xsKE1hdGguUEkgKiAwLjAyNSk7Ly90aWx0IHRvIHRoZSByaWdodFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOTovL3JpZ2h0IGFycm93XG4gICAgICAgICAgICAgICAgdGhpcy5jYW0ueWF3KC1NYXRoLlBJICogMC4wMjUpOy8vcm90YXRlIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4MzovL3Mga2V5XG4gICAgICAgICAgICBjYXNlIDQwOi8vZG93biBhcnJvd1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtLnBpdGNoKE1hdGguUEkgKiAwLjAyNSk7Ly9sb29rIGRvd25cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODc6Ly93IGtleVxuICAgICAgICAgICAgY2FzZSAzODovL3VwIGFycm93XG4gICAgICAgICAgICAgICAgdGhpcy5jYW0ucGl0Y2goLU1hdGguUEkgKiAwLjAyNSk7Ly9sb29rIHVwXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmNhbS5nZXRQb3NpdGlvbigpO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHsvL2RldGVyaW1lIHRoZSBrZXkgcHJlc3NlZFxuICAgICAgICAgICAgY2FzZSA2NTovL2Ega2V5XG4gICAgICAgICAgICAgICAgdGhpcy5jYW0ueWF3KE1hdGguUEkgKiAwLjAyNSk7Ly9yb3RhdGUgdG8gdGhlIGxlZnRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIGNhc2UgMzc6Ly9sZWZ0IGFycm93XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW0uc2V0UG9zaXRpb24oW3Bvc1swXS0uMyxwb3NbMV0scG9zWzJdXSk7Ly9tb3ZlIC0gYWxvbmcgdGhlIFggYXhpc1xuICAgICAgICAgICAgLy8gICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2ODovL2Qga2V5XG4gICAgICAgICAgICAgICAgdGhpcy5jYW0ueWF3KC1NYXRoLlBJICogMC4wMjUpOy8vcm90YXRlIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBjYXNlIDM5Oi8vcmlnaHQgYXJyb3dcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbS5zZXRQb3NpdGlvbihbcG9zWzBdKy4zLHBvc1sxXSxwb3NbMl1dKTsvL21vcmUgKyBhbG9uZyB0aGUgWCBheGlzXG4gICAgICAgICAgICAvLyAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBjYXNlIDgzOi8vcyBrZXlcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbS5zZXRQb3NpdGlvbihbcG9zWzBdLHBvc1sxXS0uMyxwb3NbMl1dKTsvL21vdmUgLSBhbG9uZyB0aGUgWSBheGlzIChkb3duKVxuICAgICAgICAgICAgLy8gICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0MDovL2Rvd24gYXJyb3dcbiAgICAgICAgICAgIGNhc2UgODM6XG4gICAgICAgICAgICAgICAgdGhpcy5jYW0ubW92ZUZvcndhcmQoLjMpOy8vbW92ZSArIG9uIHRoZSBaIGF4aXNcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vIGNhc2UgODc6Ly93IGtleVxuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FtLnNldFBvc2l0aW9uKFtwb3NbMF0scG9zWzFdKy4zLHBvc1syXV0pOy8vbW92ZSArIG9uIHRoZSBZIGF4aXMgKHVwKVxuICAgICAgICAgICAgLy8gICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzODovL3VwIGFycm93XG4gICAgICAgICAgICBjYXNlIDg3OlxuICAgICAgICAgICAgICAgIHRoaXMuY2FtLm1vdmVGb3J3YXJkKC0uMyk7Ly9tb3ZlIC0gb24gdGhlIFogYXhpc1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgfVxufTtcblxuICAgIC8vdGhpcy5jYW0uc2V0UG9zaXRpb24oW3Bvc1swXSxwb3NbMV0scG9zWzJdLS4zXSk7Ly9tb3ZlIC0gb24gdGhlIFogYXhpc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkSW50ZXJhY3RvcjsiLCIvL01vdXNlSW50ZXJhY3Rvci5qc1xuXG5mdW5jdGlvbiBNb3VzZUludGVyYWN0b3IoKXt9O1xuXG52YXIgcCA9IE1vdXNlSW50ZXJhY3Rvci5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKGNhbWVyYSwgY2FudmFzKXtcblxuICAgIHRoaXMuY2FtZXJhID0gY2FtZXJhO1xuICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuXG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMueCA9IHRoaXMuY2FudmFzLndpZHRoLzI7XG4gICAgdGhpcy55ID0gdGhpcy5jYW52YXMuaGVpZ2h0LzI7XG4gICAgdGhpcy5sYXN0WCA9IDA7XG4gICAgdGhpcy5sYXN0WSA9IDA7XG4gICAgdGhpcy5idXR0b24gPSAwO1xuICAgIHRoaXMuc2hpZnQgPSBmYWxzZTtcbiAgICB0aGlzLmtleSA9IDA7XG5cbiAgICB0aGlzLlNFTlNJVElWSVRZID0gMC43O1xufTtcblxucC5zZXR1cCA9IGZ1bmN0aW9uKCl7XG5cbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25Nb3VzZVVwLmJpbmQodGhpcykpO1xufTtcblxucC5fb25Nb3VzZURvd24gPSBmdW5jdGlvbihlKXtcblxuICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMueCA9IGUuY2xpZW50WDtcbiAgICB0aGlzLnkgPSBlLmNsaWVudFk7XG4gICAgdGhpcy5idXR0b24gPSBlLmJ1dHRvbjtcblxufTtcblxucC5fb25Nb3VzZVVwID0gZnVuY3Rpb24oZSl7XG4gICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuXG59O1xuXG5wLl9vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGUpe1xuXG4gICAgdGhpcy5sYXN0WCA9IHRoaXMueDtcbiAgICB0aGlzLmxhc3RZID0gdGhpcy55O1xuICAgIHRoaXMueCA9IGUuY2xpZW50WDtcbiAgICB0aGlzLnkgPSBlLmNsaWVudFk7XG5cbiAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVybjtcbiAgICAvLyB0aGlzLnNoaWZ0ID0gZS5zaGlmdEtleTtcblxuXG5cbiAgICAvLyBpZiAodGhpcy5idXR0b24gPT0gMCkge1xuICAgICAgICAvLyBpZih0aGlzLnNoaWZ0KXtcbiAgICB2YXIgZHg9dGhpcy5tb3VzZVBvc1godGhpcy54KSAtdGhpcy5tb3VzZVBvc1godGhpcy5sYXN0WClcbiAgICB2YXIgZHk9dGhpcy5tb3VzZVBvc1kodGhpcy55KSAtdGhpcy5tb3VzZVBvc1kodGhpcy5sYXN0WSlcblxuICAgIHRoaXMucm90YXRlKGR4LGR5KTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBlbHNle1xuICAgICAgICAvLyAgICAgdmFyIGR5ID0gdGhpcy55IC0gdGhpcy5sYXN0WTtcbiAgICAgICAgLy8gICAgIHRoaXMudHJhbnNsYXRlKGR5KTtcbiAgICAgICAgLy8gfVxuICAgIC8vIH1cblxufTtcblxucC5tb3VzZVBvc1ggPSBmdW5jdGlvbih4KXtcblxuICAgIHJldHVybiAyICogKHggLyB0aGlzLmNhbnZhcy53aWR0aCkgLSAxO1xuXG59O1xuXG5wLm1vdXNlUG9zWSA9IGZ1bmN0aW9uKHkpe1xuXG4gICAgcmV0dXJuIDIgKiAoeSAvIHRoaXMuY2FudmFzLmhlaWdodCkgLSAxO1xuXG59O1xuXG5wLnJvdGF0ZSA9IGZ1bmN0aW9uKGR4LCBkeSl7XG5cbiAgICB2YXIgY2FtZXJhID0gdGhpcy5jYW1lcmE7XG4gICAgY2FtZXJhLnlhdyh0aGlzLlNFTlNJVElWSVRZKmR4KTtcbiAgICBjYW1lcmEucGl0Y2godGhpcy5TRU5TSVRJVklUWSpkeSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vdXNlSW50ZXJhY3RvcjtcbiIsIi8vQXVkaW9QbGF5ZXIuanNcblxuZnVuY3Rpb24gQXVkaW9QbGF5ZXIoKXt9O1xuXG52YXIgcCA9IEF1ZGlvUGxheWVyLnByb3RvdHlwZTtcblxucC5pbml0ID0gZnVuY3Rpb24oY3R4LCBvbkJ1ZmZlckxvYWRlZENhbGxiYWNrLCBjYWxsYmFja1Njb3BlKXtcblxuXHR0aGlzLl9jdHggPSBjdHg7XG5cdHRoaXMuX2J1ZmZlciA9IG51bGw7XG5cdHRoaXMuX3NvdXJjZU5vZGUgPSBudWxsO1xuXHR0aGlzLnBhdXNlZCA9IGZhbHNlO1xuXHR0aGlzLnBhdXNlZFRpbWVzdGFtcCA9IHVuZGVmaW5lZDtcblx0dGhpcy5zdGFydGVkVGltZXN0YW1wID0gdW5kZWZpbmVkO1xuXHR0aGlzLnRyaWdnZXJlZFBsYXkgPSBmYWxzZTtcblxuXHR0aGlzLmlzTG9hZGVkID0gZmFsc2U7XG5cblx0dGhpcy5fb25CdWZmZXJMb2FkZWRDYWxsYmFjayA9IG9uQnVmZmVyTG9hZGVkQ2FsbGJhY2s7XG5cdHRoaXMuX2NhbGxiYWNrU2NvcGUgPSBjYWxsYmFja1Njb3BlO1xuXG5cdFxuXG59O1xuXG5wLmxvYWQgPSBmdW5jdGlvbih1cmwpe1xuXG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcblx0cmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdCAgICBzZWxmLl9jdHguZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIHNlbGYub25CdWZmZXJMb2FkZWQuYmluZChzZWxmKSwgc2VsZi5vbkJ1ZmZlckVycm9yLmJpbmQoc2VsZikpO1xuXHR9O1xuXHRyZXF1ZXN0LnNlbmQoKTtcblxufTtcblxucC5vbkJ1ZmZlckxvYWRlZCA9IGZ1bmN0aW9uKGJ1ZmZlcil7XG5cblxuXHQvLyB2YXIgbGVmdFBDTSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcblx0Ly8gdmFyIHJpZ2h0UENNID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKDEpO1xuXG5cdC8vIGNvbnNvbGUubG9nKGxlZnRQQ00ubGVuZ3RoKTtcblx0Ly8gZGVidWdnZXI7XG5cblx0Ly8gdmFyIGZpcnN0SGFsZiA9IGxlZnRQQ00uc2xpY2UoMCwgMTAwMDAwMCk7XG5cblx0Ly8gdmFyIHN0ciA9IGZpcnN0SGFsZi5qb2luKCclMjAnKTtcblx0Ly8gdmFyIHBhcmFtcyA9IFwiYXJyYXk9XCIgKyBzdHI7XG5cdC8vIHZhciBodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdC8vIGh0dHAub3BlbihcIlBPU1RcIiwgXCJzYXZlLnBocFwiLCB0cnVlKTtcblxuXHQvLyAvL1NlbmQgdGhlIHByb3BlciBoZWFkZXIgaW5mb3JtYXRpb24gYWxvbmcgd2l0aCB0aGUgcmVxdWVzdFxuXHQvLyBodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XG5cdC8vIC8vIGh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtbGVuZ3RoXCIsIHBhcmFtcy5sZW5ndGgpO1xuXHQvLyAvLyBodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb25uZWN0aW9uXCIsIFwiY2xvc2VcIik7XG5cblx0Ly8gaHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0Ly8gICAgIGlmKGh0dHAucmVhZHlTdGF0ZSA9PSA0ICYmIGh0dHAuc3RhdHVzID09IDIwMCkge1xuXHQvLyAgICAgICAgIC8vIERvIHNvbWV0aGluZyBvbiBzdWNjZXNzP1xuXHQvLyAgICAgICAgIGRlYnVnZ2VyO1xuXHQvLyAgICAgfVxuXHQvLyB9XG5cdC8vIGh0dHAuc2VuZChwYXJhbXMpO1xuXHQvLyAvLyBjb25zb2xlLnRhYmxlKGxlZnRQQ00pXG5cdC8vIGRlYnVnZ2VyO1xuXHQvLyAvLyBjb25zb2xlLmxvZyhidWZmZXIpO1xuXG5cdHRoaXMuX2J1ZmZlciA9IGJ1ZmZlcjtcblx0dGhpcy5pc0xvYWRlZCA9IHRydWU7XG5cdHRoaXMuX29uQnVmZmVyTG9hZGVkQ2FsbGJhY2suY2FsbCh0aGlzLl9jYWxsYmFja1Njb3BlKTtcblx0XG59O1xuXG5wLm9uQnVmZmVyRXJyb3IgPSBmdW5jdGlvbigpe1xuXG5cbn07XG5cbnAucGF1c2UgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMuX3NvdXJjZU5vZGUuc3RvcCgwKTtcblx0dGhpcy5wYXVzZWRUaW1lc3RhbXAgPSBEYXRlLm5vdygpIC0gdGhpcy5zdGFydGVkVGltZXN0YW1wO1xuXHR0aGlzLnBhdXNlZCA9IHRydWU7XG5cbn07XG5cbnAucmVzZXQgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMucGF1c2VkVGltZXN0YW1wID0gdW5kZWZpbmVkO1xuXG59O1xuXG5wLmdldFNvdXJjZU5vZGUgPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiB0aGlzLl9zb3VyY2VOb2RlO1xufTtcblxucC5wbGF5ID0gZnVuY3Rpb24od2FpdCl7XG5cblx0dGhpcy50cmlnZ2VyZWRQbGF5ID0gdHJ1ZTtcblxuXHR0aGlzLl9zb3VyY2VOb2RlID0gdGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuXHR0aGlzLl9zb3VyY2VOb2RlLmNvbm5lY3QodGhpcy5fY3R4LmRlc3RpbmF0aW9uKTtcblx0dGhpcy5fc291cmNlTm9kZS5idWZmZXIgPSB0aGlzLl9idWZmZXI7XG5cdHRoaXMucGF1c2VkID0gZmFsc2U7XG5cblx0aWYgKHRoaXMucGF1c2VkVGltZXN0YW1wICE9PSB1bmRlZmluZWQpe1xuXHRcdHRoaXMuc3RhcnRlZFRpbWVzdGFtcCA9IERhdGUubm93KCkgLSB0aGlzLnBhdXNlZFRpbWVzdGFtcDtcblx0XHR0aGlzLl9zb3VyY2VOb2RlLnN0YXJ0KDAsIHRoaXMucGF1c2VkVGltZXN0YW1wIC8gMTAwMCk7XG5cdH1lbHNle1xuXG5cdFx0aWYgKHdhaXQpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRzZWxmLnN0YXJ0ZWRUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXHRcdFx0XHRzZWxmLl9zb3VyY2VOb2RlLnN0YXJ0KDApO1xuXG5cdFx0XHR9LHdhaXQpO1xuXHRcdH1lbHNle1xuXHRcdFx0dGhpcy5zdGFydGVkVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblx0XHRcdHRoaXMuX3NvdXJjZU5vZGUuc3RhcnQoMCk7XG5cdFx0fVxuXHRcdFxuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW9QbGF5ZXI7IiwiLy9WaWRlb1BsYXllci5qc1xuXG5mdW5jdGlvbiBWaWRlb1BsYXllcigpe307XG5cbnZhciBwID0gVmlkZW9QbGF5ZXIucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbihvblZpZGVvTG9hZGVkQ2FsbGJhY2ssIG9uVmlkZW9QYXVzZWQsIG9uVmlkZW9QbGF5aW5nLCBvblZpZGVvRW5kZWQsIGNhbGxiYWNrU2NvcGUpe1xuXG5cdHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcblx0dGhpcy50cmlnZ2VyZWRQbGF5ID0gZmFsc2U7XG5cdHRoaXMub25WaWRlb0xvYWRlZENhbGxiYWNrID0gb25WaWRlb0xvYWRlZENhbGxiYWNrO1xuXHR0aGlzLm9uVmlkZW9QYXVzZWQgPSBvblZpZGVvUGF1c2VkO1xuXHR0aGlzLm9uVmlkZW9QbGF5aW5nID0gb25WaWRlb1BsYXlpbmc7XG5cdHRoaXMub25WaWRlb0VuZGVkID0gb25WaWRlb0VuZGVkO1xuXHR0aGlzLmNhbGxiYWNrU2NvcGUgPSBjYWxsYmFja1Njb3BlO1xuXG5cdHRoaXMuX2N1cnJlbnRUaW1lID0gLTE7XG5cblx0dGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cdHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCB0aGlzLl9vblZpZGVvTG9hZGVkLmJpbmQodGhpcykpO1xuXHR0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgdGhpcy5lbmRlZC5iaW5kKHRoaXMpKTtcblx0dGhpcy52aWRlby52b2x1bWUgPSAwLjA7XG5cdFxuXG5cdHRoaXMuX2NoZWNrSW50ZXJ2YWwgID0gNTAuMDtcblx0dGhpcy5fbGFzdFBsYXlQb3MgICAgPSAwO1xuXHR0aGlzLl9jdXJyZW50UGxheVBvcyA9IDA7XG5cdHRoaXMuX2J1ZmZlcmluZ0RldGVjdGVkID0gdHJ1ZTtcblxuXHR0aGlzLmNoZWNrQnVmZmVyaW5nSW50ZXJ2YWwgPSBudWxsO1xuXHR0aGlzLmNoZWNrQnVmZmVyaW5nQm91bmQgPSB0aGlzLmNoZWNrQnVmZmVyaW5nLmJpbmQodGhpcyk7XG5cbn07XG5cbnAuZW5kZWQgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMub25WaWRlb0VuZGVkLmNhbGwodGhpcy5jYWxsYmFja1Njb3BlKTtcblx0XG5cdFxufTtcblxucC5yZXNldCA9IGZ1bmN0aW9uKCl7XG5cblx0Y2xlYXJJbnRlcnZhbCh0aGlzLmNoZWNrQnVmZmVyaW5nSW50ZXJ2YWwpO1xuXHR0aGlzLl9sYXN0UGxheVBvcyAgICA9IDA7XG5cdHRoaXMuX2N1cnJlbnRQbGF5UG9zID0gMDtcblx0dGhpcy5fYnVmZmVyaW5nRGV0ZWN0ZWQgPSB0cnVlO1xuXHR0aGlzLnZpZGVvLmN1cnJlbnRUaW1lID0gMC4wMDE7XG5cdC8vdGhpcy50cmlnZ2VyZWRQbGF5ID0gZmFsc2U7XG5cbn07XG5cbnAubG9hZCA9IGZ1bmN0aW9uKHBhdGgpe1xuXG5cdHRoaXMudmlkZW8uc3JjID0gcGF0aDtcblx0dGhpcy52aWRlby5sb2FkKCk7XG59O1xuXG5wLnBsYXkgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMudmlkZW8ucGxheSgpO1xuXHR0aGlzLnRyaWdnZXJlZFBsYXkgPSB0cnVlO1xuXHR0aGlzLmNoZWNrQnVmZmVyaW5nSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aGlzLmNoZWNrQnVmZmVyaW5nQm91bmQsIHRoaXMuX2NoZWNrSW50ZXJ2YWwpO1xufTtcblxucC5fb25WaWRlb0Vycm9yID0gZnVuY3Rpb24oZSl7XG5cblx0Y29uc29sZS5sb2coJ3ZpZGVvIGVycm9yJyk7XG59O1xuXG5wLl9vblZpZGVvTG9hZGVkID0gZnVuY3Rpb24oZSl7XG5cblx0aWYgKHRoaXMuaXNMb2FkZWQpIHJldHVybjtcblx0Y29uc29sZS5sb2coJ3ZpZGVvIGxvYWRlZCcpO1xuXG5cdHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuXHR0aGlzLm9uVmlkZW9Mb2FkZWRDYWxsYmFjay5jYWxsKHRoaXMuY2FsbGJhY2tTY29wZSk7XG59O1xuXG5cblxucC5jaGVja0J1ZmZlcmluZyA9IGZ1bmN0aW9uKCl7XG5cblx0dmFyIGN1cnJlbnRQbGF5UG9zID0gdGhpcy52aWRlby5jdXJyZW50VGltZTtcblxuXHR2YXIgb2Zmc2V0ID0gMSAvIHRoaXMuX2NoZWNrSW50ZXJ2YWw7XG5cblx0aWYgKCF0aGlzLl9idWZmZXJpbmdEZXRlY3RlZCAmJiBjdXJyZW50UGxheVBvcyA8ICh0aGlzLl9sYXN0UGxheVBvcyArIG9mZnNldCkpe1xuXHRcdGNvbnNvbGUubG9nKCdidWZmZXJpbmcnKTtcblx0XHR0aGlzLl9idWZmZXJpbmdEZXRlY3RlZCA9IHRydWU7XG5cdFx0dGhpcy5vblZpZGVvUGF1c2VkLmNhbGwodGhpcy5jYWxsYmFja1Njb3BlKTtcblx0fVxuXG5cdGlmICh0aGlzLl9idWZmZXJpbmdEZXRlY3RlZCAmJiBjdXJyZW50UGxheVBvcyA+ICh0aGlzLl9sYXN0UGxheVBvcyArIG9mZnNldCkpe1xuXHRcdGNvbnNvbGUubG9nKCdub3QgYnVmZmVyaW5nIGFueW1vcmUnKTtcblx0XHR0aGlzLl9idWZmZXJpbmdEZXRlY3RlZCA9IGZhbHNlO1xuXHRcdHRoaXMub25WaWRlb1BsYXlpbmcuY2FsbCh0aGlzLmNhbGxiYWNrU2NvcGUpO1xuXHR9XG5cblx0dGhpcy5fbGFzdFBsYXlQb3MgPSBjdXJyZW50UGxheVBvcztcblxuXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWRlb1BsYXllcjsiLCIvL0VuZFNjcmVlbi5qc1xuXG5mdW5jdGlvbiBFbmRTY3JlZW4oKXt9O1xuXG52YXIgcCA9IEVuZFNjcmVlbi5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKG9uUmVwbGF5Q2xpY2ssIGNhbGxiYWNrU2NvcGUpe1xuXG5cdHRoaXMuZWwgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5LmVuZFNjcmVlbicpO1xuXHR0aGlzLnRpdGxlRWwgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xuXG5cdHRoaXMucmVwbGF5QnRuID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcucmVwbGF5Jyk7XG5cdHRoaXMucmVwbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vblJlcGxheUNsaWNrLmJpbmQodGhpcykpO1xuXG5cdHRoaXMub25SZXBsYXlDbGlja0NhbGxiYWNrID0gb25SZXBsYXlDbGljaztcblx0dGhpcy5jYWxsYmFja1Njb3BlID0gY2FsbGJhY2tTY29wZTtcblxuXHR0aGlzLnRhcmdldFlQb3MgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdHRoaXMuY3VycmVudFlQb3MgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0dGhpcy5pc1Nob3dpbmcgPSBmYWxzZTtcblxufTtcblxucC5vblJlcGxheUNsaWNrID0gZnVuY3Rpb24oKXtcblxuXHRcblx0dGhpcy5vblJlcGxheUNsaWNrQ2FsbGJhY2suY2FsbCh0aGlzLmNhbGxiYWNrU2NvcGUpO1xufTtcblxucC5oaWRlID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLmlzU2hvd2luZyA9IGZhbHNlO1xuXHQvLyB0aGlzLmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdHRoaXMudGFyZ2V0WVBvcyA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxufTtcblxucC5zaG93ID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLmlzU2hvd2luZyA9IHRydWU7XG5cdHRoaXMudGFyZ2V0WVBvcyA9IDA7XG5cdC8vIHRoaXMuZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG59O1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG5cblx0dmFyIHRyYW5zbGF0ZVYgPSAwO1xuXHR0cmFuc2xhdGVWID0gKHRoaXMudGFyZ2V0WVBvcyAtIHRoaXMuY3VycmVudFlQb3MpICogLjA0O1xuXHR0aGlzLmN1cnJlbnRZUG9zICs9IE1hdGgucm91bmQodHJhbnNsYXRlViAqIDEwMCkgLyAxMDA7XG5cbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24oKXtcblxuXHRcblx0dGhpcy5lbC5zdHlsZS50b3AgPSB0aGlzLmN1cnJlbnRZUG9zO1xufTtcblxucC5vblJlc2l6ZSA9IGZ1bmN0aW9uKHcsaCl7XG5cblx0dGhpcy50aXRsZUVsLnN0eWxlLmxlZnQgPSB3LzIgLSAyMCArICdweCc7XG5cdHRoaXMudGl0bGVFbC5zdHlsZS50b3AgPSBoLzIgLSA0MCArICdweCc7XG5cblx0aWYgKCF0aGlzLmlzU2hvd2luZyl7XG5cdFx0dGhpcy50YXJnZXRZUG9zID0gaDtcblx0XHR0aGlzLmN1cnJlbnRZUG9zID0gaDtcblx0fVxuXHRcblxuXHR0aGlzLnRpdGxlRWwuc3R5bGUub3BhY2l0eSA9IDE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVuZFNjcmVlbjsiLCIvL0xvYWRlclNjcmVlbi5qc1xuXG5mdW5jdGlvbiBMb2FkZXJTY3JlZW4oKXt9O1xuXG52YXIgcCA9IExvYWRlclNjcmVlbi5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5lbCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLm92ZXJsYXkubG9hZGVyU2NyZWVuJyk7XG5cdHRoaXMudGl0bGVFbCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignLnRpdGxlJyk7XG5cblx0dGhpcy50YXJnZXRZUG9zID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR0aGlzLmN1cnJlbnRZUG9zID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdHRoaXMuaXNTaG93aW5nID0gZmFsc2U7XG59O1xuXG5wLmhpZGUgPSBmdW5jdGlvbigpe1xuXG5cdC8vIHRoaXMuZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0dGhpcy50YXJnZXRZUG9zID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR0aGlzLmlzU2hvd2luZyA9IGZhbHNlO1xufTtcblxucC5zaG93ID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLmlzU2hvd2luZyA9IHRydWU7XG5cdHRoaXMudGFyZ2V0WVBvcyA9IDA7XG5cdC8vIHRoaXMuZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG59O1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG5cblx0dmFyIHRyYW5zbGF0ZVYgPSAwO1xuXHR0cmFuc2xhdGVWID0gKHRoaXMudGFyZ2V0WVBvcyAtIHRoaXMuY3VycmVudFlQb3MpICogLjA0O1xuXHR0aGlzLmN1cnJlbnRZUG9zICs9IE1hdGgucm91bmQodHJhbnNsYXRlViAqIDEwMCkgLyAxMDA7XG5cbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24oKXtcblxuXHRcblx0dGhpcy5lbC5zdHlsZS50b3AgPSB0aGlzLmN1cnJlbnRZUG9zO1xufTtcblxuXG5wLm9uUmVzaXplID0gZnVuY3Rpb24odyxoKXtcblxuXHR0aGlzLnRpdGxlRWwuc3R5bGUubGVmdCA9IHcvMiAtIDMwICsgJ3B4Jztcblx0dGhpcy50aXRsZUVsLnN0eWxlLnRvcCA9IGgvMiAtIDYwICsgJ3B4JztcblxuXHRpZiAoIXRoaXMuaXNTaG93aW5nKXtcblx0XHR0aGlzLnRhcmdldFlQb3MgPSBoO1xuXHRcdHRoaXMuY3VycmVudFlQb3MgPSBoO1xuXHR9XG5cblx0dGhpcy50aXRsZUVsLnN0eWxlLm9wYWNpdHkgPSAxO1xuXG5cdC8vIHRoaXMudGl0bGVFbC5zdHlsZS5tYXJnaW5Ub3AgPSBoLzIgLSA0MCArICdweCc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlclNjcmVlbjsiLCIvL1ZpZXdCYWNrZ3JvdW5kLmpzXG5cbnZhciBWaWV3ID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL1ZpZXcnKTtcbnZhciBNZXNoID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL01lc2gnKTtcblxuZnVuY3Rpb24gVmlld0JhY2tncm91bmQoKXt9O1xuXG52YXIgcCA9IFZpZXdCYWNrZ3JvdW5kLnByb3RvdHlwZSA9IG5ldyBWaWV3KCk7XG52YXIgcyA9IFZpZXcucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG52YXIgcmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHsgcmV0dXJuIG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKTsgfVxuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dGhpcy5hbmdsZSA9IDA7XG5cdHRoaXMuYW5nbGVWZXJ0ID0gMDtcblxuXHR2YXIgcG9zaXRpb25zID0gW107XG5cdHZhciBjb29yZHMgPSBbXTtcblx0dmFyIGluZGljZXMgPSBbMCwgMSwgMiwgMCwgMiwgM107XG5cblx0dmFyIHNpemUgPSAxO1xuXHRwb3NpdGlvbnMucHVzaChbLXNpemUsIC1zaXplLCAwXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFsgc2l6ZSwgLXNpemUsIDBdKTtcblx0cG9zaXRpb25zLnB1c2goWyBzaXplLCAgc2l6ZSwgMF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXNpemUsICBzaXplLCAwXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblxuXHR0aGlzLm1lc2ggPSBuZXcgTWVzaCgpO1xuXHR0aGlzLm1lc2guaW5pdCg0LCA2LCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cblxufTtcblxucC5yZW5kZXIgPSBmdW5jdGlvbihwZXJtVGV4dHVyZSwgc2ltcGxleFRleHR1cmUsIGZsb29yVGV4dHVyZSwgZmFkZXJWYWwpe1xuXG5cdHRoaXMuc2hhZGVyLmJpbmQoKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYW5nbGVcIiwgXCJ1bmlmb3JtMWZcIix0aGlzLmFuZ2xlKz0uMDAxKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImFuZ2xlVmVydFwiLCBcInVuaWZvcm0xZlwiLCB0aGlzLmFuZ2xlVmVydCs9LjAxKTtcblx0Ly8gdGhpcy5zaGFkZXIudW5pZm9ybShcInVTYW1wbGVyMFwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblx0IC8vIHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ0ZXh0dXJlUGFydGljbGVcIiwgXCJ1bmlmb3JtMWlcIiwgMSk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJwZXJtVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInNpbXBsZXhUZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDEpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmxvb3JUZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDIpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmFkZXJWYWxcIixcInVuaWZvcm0xZlwiLCBmYWRlclZhbCk7XG5cdC8vIHRleHR1cmVQb3MuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdC8vIHRleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cblx0cGVybVRleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdHNpbXBsZXhUZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDEpO1xuXHRmbG9vclRleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMik7XG5cblx0dGhpcy5kcmF3KHRoaXMubWVzaCk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld0JhY2tncm91bmQ7IiwiLy9WaWV3Rmxvb3IuanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3Rmxvb3IoKXt9O1xuXG52YXIgcCA9IFZpZXdGbG9vci5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBpbmRpY2VzID0gW107XG5cdFxuXHR2YXIgd2lkdGggPSB3aW5kb3cuTlMuR0wucGFyYW1zLndpZHRoO1xuXHR2YXIgaGVpZ2h0ID0gd2luZG93Lk5TLkdMLnBhcmFtcy5oZWlnaHQ7XG5cdHZhciBkZXB0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMuZGVwdGg7XG5cblx0XG5cblxuXHQvLyAvL1JPT0Zcblx0Ly8gcG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCBoZWlnaHQsIC1kZXB0aF0pO1xuXHQvLyBwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgZGVwdGhdKTtcblxuXHQvLyBwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDBdKTtcblxuXHRcblx0Ly8gaW5kaWNlcy5wdXNoKDAsMSwyLDMsMCwyKTtcblxuXG5cdC8vRkxPT1Jcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgZGVwdGhdKTtcblxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCBkZXB0aF0pO1xuXG5cdGNvb3Jkcy5wdXNoKFswLCAwXSk7XG5cdGNvb3Jkcy5wdXNoKFswLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAwXSk7XG5cdFxuXHRcblxuXHRpbmRpY2VzLnB1c2goMCwxLDIsMywwLDIpO1xuXG5cdFxuXG5cdFxuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBmbG9vclRleHR1cmUsIGF1ZGlvRGF0YSwgZmJvU2l6ZSkge1xuXG5cdHRoaXMudHJhbnNmb3Jtcy5wdXNoKCk7XG5cblx0dGhpcy5zaGFkZXIuYmluZCgpO1xuXHQvLyBjb25zb2xlLmxvZygnZmxvb3InKTtcblx0aWYgKGF1ZGlvRGF0YS5sZW5ndGggPiA4KXtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbERlZXBcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzNdKTtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbEhpZ2hcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzhdKTtcblxuXHR9XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInZpZGVvVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImNvbmNyZXRlVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAxKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0XG5cdHZpZGVvVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAwKTtcblx0Zmxvb3JUZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDEpO1xuXHRcblx0dGhpcy5kcmF3KHRoaXMubWVzaCk7XG5cdFxuXHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdGbG9vcjsiLCIvL1ZpZXdJbXBvcnQuanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2hQbGFpbiA9IHJlcXVpcmUoJy4uL01lc2hQbGFpbicpO1xuXG5mdW5jdGlvbiBWaWV3SW1wb3J0KCl7fTtcblxudmFyIHAgPSBWaWV3SW1wb3J0LnByb3RvdHlwZSA9IG5ldyBWaWV3KCk7XG52YXIgcyA9IFZpZXcucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dGhpcy5zdWJWaWV3cyA9IFtdO1xuXHR0aGlzLmhhc1N1YlZpZXdzID0gZmFsc2U7XG5cdFxuXHR0aGlzLmN1cnJlbnRBbmltYXRpb25Qcm9wID0gbnVsbDtcblx0dGhpcy5jdXJyZW50QW5pbWF0aW9uVmFsID0gdW5kZWZpbmVkO1xuXHR0aGlzLmlzQW5pbWF0aW5nID0gZmFsc2U7XG5cblx0dGhpcy5tZXNoID0gbnVsbDtcblxuXHR0aGlzLnRlc3QgPSAwO1xuXG5cdHRoaXMuY3VycmVudFRyYW5zbGF0ZSA9IC0yMDtcblxufTtcblxucC5jcmVhdGVNZXNoID0gZnVuY3Rpb24oZGF0YSl7XG5cblx0dmFyIG1lc2ggPSBkYXRhLm1lc2hEYXRhO1xuXHR0aGlzLm1hdGVyaWFsID0gZGF0YS5tYXRlcmlhbERhdGE7XG5cblx0dmFyIGNvb3JkcyA9IFtdO1xuXHR2YXIgdmVydHMgPSBbXTtcblx0dmFyIGZhY2VzID0gW107XG5cdHZhciBtYXggPSB7eDowLCB5OjB9O1xuXHR2YXIgbWluID0ge3g6MCwgeTowfTtcblxuXG5cblx0dmFyIGNvbG9ycyA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTxtZXNoLnZlcnRpY2VzLmxlbmd0aDtpKz0gMyl7XG5cdFx0aWYgKGkgPCAyMDAwKXtcblx0XHRcdGNvbG9ycy5wdXNoKC41KTtcblx0XHRcdGNvbG9ycy5wdXNoKC4xKTtcblx0XHRcdGNvbG9ycy5wdXNoKC44KTtcblx0XHR9ZWxzZSBpZiAoaSA+PSAyMDAwICYmIGkgPCA1NTAwKXtcblx0XHRcdGNvbG9ycy5wdXNoKC4xKTtcblx0XHRcdGNvbG9ycy5wdXNoKC45KTtcblx0XHRcdGNvbG9ycy5wdXNoKC44KTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvbG9ycy5wdXNoKDEuMCk7XG5cdFx0XHRjb2xvcnMucHVzaCguMyk7XG5cdFx0XHRjb2xvcnMucHVzaCguNyk7XG5cdFx0fVxuXG5cdH1cblxuXHQvLyBkZWJ1Z2dlcjtcblxuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoUGxhaW4oKTtcblx0dGhpcy5tZXNoLmluaXQobWVzaC52ZXJ0aWNlcy5sZW5ndGgvMywgbWVzaC50cmlhbmdsZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KG1lc2gudmVydGljZXMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVGV4Q29vcmRzKG1lc2guY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMobWVzaC50cmlhbmdsZXMpO1xuXHR0aGlzLm1lc2guYnVmZmVyRGF0YShtZXNoLm5vcm1hbHMsIFwiYVZlcnRleE5vcm1hbFwiLCAzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckRhdGEobmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCBcImFWZXJ0ZXhDb2xvclwiLCAzKTtcblxuXG59O1xuXG5wLmFkZFN1YlZpZXdzID0gZnVuY3Rpb24odmlld3Mpe1xuXG5cdHRoaXMuc3ViVmlld3MgPSB2aWV3cy5zbGljZSgwKTtcblx0dGhpcy5oYXNTdWJWaWV3cyA9IHRydWU7XG5cblx0dGhpcy5fbWF0cml4ID0gbWF0NC5jcmVhdGUoKTtcbn07XG5cbnAucmVzZXRBbmltYXRpb24gPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMuY3VycmVudEFuaW1hdGlvblByb3AgPSBudWxsO1xuXHR0aGlzLmN1cnJlbnRBbmltYXRpb25WYWwgPSB1bmRlZmluZWQ7XG5cblx0Zm9yKHZhciBpPTA7aTx0aGlzLnN1YlZpZXdzLmxlbmd0aDtpKyspe1xuXHRcdHRoaXMuc3ViVmlld3NbaV0uY3VycmVudEFuaW1hdGlvblZhbCA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLnN1YlZpZXdzW2ldLmN1cnJlbnRBbmltYXRpb25Qcm9wID0gbnVsbDtcblx0fVxuXG59O1xuXG5cblxucC5yZW5kZXIgPSBmdW5jdGlvbih2aWRlb1RleHR1cmUsIGF1ZGlvRGF0YSwgc2hhZGVyLCBpc0NoaWxkKSB7XG5cblx0aWYgKGlzQ2hpbGQpXG5cdFx0dGhpcy5zaGFkZXIgPSBzaGFkZXI7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblx0XG5cblx0Ly8gdmFyIG5NYXRyaXggPSBtYXQ0LmNyZWF0ZSgpO1xuXHR2YXIgbXZNYXRyaXggPSB0aGlzLnRyYW5zZm9ybXMuZ2V0TXZNYXRyaXgoKTtcblxuXG5cdGlmICghaXNDaGlsZCl7XG5cdFx0bWF0NC50cmFuc2xhdGUobXZNYXRyaXgsIG12TWF0cml4LCBbLTQwLCB0aGlzLmN1cnJlbnRUcmFuc2xhdGUsIC0yMF0pO1xuXHRcdFxuXHR9XG5cdC8vIGlmIChpc0NoaWxkKXtcblx0Ly8gXHQvLyBtYXQ0Lm11bHRpcGx5KG12TWF0cml4LCBtdk1hdHJpeCwgcGFyZW50TWF0cml4KTtcblx0Ly8gXHQvLyBtYXQ0LnNjYWxlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAuMDgsIDAuMDgsIDAuMDhdKTtcblx0Ly8gXHQvLyB0aGlzLnRlc3QrPTAuMTtcblx0Ly8gXHQvLyBtYXQ0LnJvdGF0ZShtdk1hdHJpeCwgbXZNYXRyaXgsIHRoaXMudGVzdCAqIE1hdGguUEkvMTgwLCBbMCwxLDBdKTtcblx0Ly8gfVxuXG5cdGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb25WYWwpe1xuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb25Qcm9wID09ICdyb3RhdGVaJylcblx0XHRcdG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgdGhpcy5jdXJyZW50QW5pbWF0aW9uVmFsICpNYXRoLlBJLzE4MCwgWzAsIDAsIDFdKTtcblx0XHRlbHNlIGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb25Qcm9wID09ICdyb3RhdGVYJylcblx0XHRcdG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgdGhpcy5jdXJyZW50QW5pbWF0aW9uVmFsICpNYXRoLlBJLzE4MCwgWzEsIDAsIDBdKTtcblx0fVxuXG5cdGlmICh0aGlzLmhhc1N1YlZpZXdzKXtcblx0XHRcblx0XHRtYXQ0LnNjYWxlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAuMDgsIDAuMDgsIDAuMDhdKTtcblx0XHQvLyBtYXQ0LnRyYW5zbGF0ZShtdk1hdHJpeCwgbXZNYXRyaXgsIFswLCAxNSwgMF0pO1xuXG5cdFx0Ly8gbWF0NC5jb3B5KHRoaXMuX21hdHJpeCwgbXZNYXRyaXgpO1xuXHRcdFxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuc3ViVmlld3MubGVuZ3RoO2krKyl7XG5cdFx0XHR0aGlzLnN1YlZpZXdzW2ldLnJlbmRlcih2aWRlb1RleHR1cmUsIGF1ZGlvRGF0YSwgdGhpcy5zaGFkZXIsIHRydWUpO1xuXHRcdH1cblx0XHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gaWYgKCFzaGFkZXIgJiYgIXRoaXMuaGFzU3ViVmlld3Mpe1xuXHQvLyBcdG1hdDQudHJhbnNsYXRlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAsMTAsIDBdKTtcblx0Ly8gXHRtYXQ0LnNjYWxlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAuMDUsIDAuMDUsIDAuMDVdKTtcblxuXHQvLyB9XG5cdFxuXHQvLyBtYXQ0LmNvcHkobk1hdHJpeCwgbXZNYXRyaXgpO1xuIC8vICAgIG1hdDQuaW52ZXJ0KG5NYXRyaXgsIG5NYXRyaXgpO1xuIC8vICAgIG1hdDQudHJhbnNwb3NlKG5NYXRyaXgsIG5NYXRyaXgpO1xuXG5cbiAgICB0aGlzLnNoYWRlci5iaW5kKCk7XG5cbiAgICBpZiAoYXVkaW9EYXRhLmxlbmd0aCA+IDgpe1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsRGVlcFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbM10pO1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsSGlnaFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbOF0pO1xuXG5cdH1cblxuXHQvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwidU5NYXRyaXhcIiwgXCJ1bmlmb3JtTWF0cml4NGZ2XCIsIG5NYXRyaXgpO1xuXHQvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwiZGlmZnVzZVwiLCBcInVuaWZvcm0zZnZcIiwgdGhpcy5kaWZmdXNlKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInZpZGVvVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblx0XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInVMaWdodFBvc2l0aW9uXCIsIFwidW5pZm9ybTNmdlwiLCBuZXcgRmxvYXQzMkFycmF5KFswLjAsIDIwLjAsIDIwLjBdKSApO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidUxpZ2h0QW1iaWVudFwiLCBcInVuaWZvcm00ZnZcIiwgbmV3IEZsb2F0MzJBcnJheShbMS4wLCAxLjAsIDEuMCwgMS4wXSkgKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInVMaWdodERpZmZ1c2VcIiwgXCJ1bmlmb3JtNGZ2XCIsIG5ldyBGbG9hdDMyQXJyYXkoWzEuMCwgMS4wLCAxLjAsIDEuMF0pICk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ1TGlnaHRTcGVjdWxhclwiLCBcInVuaWZvcm00ZnZcIiwgbmV3IEZsb2F0MzJBcnJheShbMS4wLCAxLjAsIDEuMCwgMS4wXSkgKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidU1hdGVyaWFsQW1iaWVudFwiLCBcInVuaWZvcm00ZnZcIiwgbmV3IEZsb2F0MzJBcnJheShbMC4xLCAwLjEsIDAuMSwgMS4wXSkpO1xuXHRpZiAodGhpcy5tYXRlcmlhbC5kaWZmdXNlKVxuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ1TWF0ZXJpYWxEaWZmdXNlXCIsIFwidW5pZm9ybTNmdlwiLCB0aGlzLm1hdGVyaWFsLmRpZmZ1c2UpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidU1hdGVyaWFsU3BlY3VsYXJcIiwgXCJ1bmlmb3JtM2Z2XCIsIHRoaXMubWF0ZXJpYWwuc3BlY3VsYXIpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidVNoaW5pbmVzc1wiLCBcInVuaWZvcm0xZlwiLCB0aGlzLm1hdGVyaWFsLnNoaW5pbmVzcyk7XG5cdFxuXHR2aWRlb1RleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cblx0dGhpcy5kcmF3KHRoaXMubWVzaCk7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3SW1wb3J0OyIsIi8vVmlld0xlZnRXYWxsLmpzXG5cbnZhciBWaWV3ID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL1ZpZXcnKTtcbnZhciBNZXNoID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL01lc2gnKTtcdFxuXG5mdW5jdGlvbiBWaWV3TGVmdFdhbGwoKXt9O1xuXG52YXIgcCA9IFZpZXdMZWZ0V2FsbC5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24odmVydFBhdGgsIGZyYWdQYXRoKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cdFxuXHRzLmluaXQuY2FsbCh0aGlzLCB2ZXJ0UGF0aCwgZnJhZ1BhdGgpO1xuXG5cdC8vZGF0IGd1aSBwcm9wc1xuXHR0aGlzLmNvbG9yTm9pc2VNdWx0aXBsaWVyID0gMTA7XG5cdHRoaXMubm9pc2VCYXNlQ29sb3IgPSBbMjAwLFxuICAgICAgMTkuOTk5OTk5OTk5OTk5OTk2LFxuICAgICAgNjIuMzUyOTQxMTc2NDcwNTldO1xuXHR0aGlzLmF1ZGlvTGV2ZWxOb2lzZURpdmlkZXIgPSAyNi4zNzcyMTE2ODMwMDIxMDY7XG5cdHRoaXMudmVydGV4TXVsdGlwbGllciA9IDAuMzcwMjA0OTkxODQ0MjIwNjtcblx0dGhpcy51c2VQdWxzZSA9IGZhbHNlO1xuXG5cdHZhciBwb3NpdGlvbnMgPSBbXTtcblx0dmFyIGNvb3JkcyA9IFtdO1xuXHR2YXIgaW5kaWNlcyA9IFtdO1xuXG5cdHZhciB3aWR0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMud2lkdGg7XG5cdHZhciBoZWlnaHQgPSB3aW5kb3cuTlMuR0wucGFyYW1zLmhlaWdodDtcblx0dmFyIGRlcHRoID0gd2luZG93Lk5TLkdMLnBhcmFtcy5kZXB0aDtcblxuXG5cdFxuXG5cblx0XG5cdFxuXG5cdC8vTEVGVCBTSURFV0FMTFxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCAtZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIGRlcHRoXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblxuXG5cblxuXHRpbmRpY2VzLnB1c2goMCwgMSwgMiwgMywgMCwgMik7XG5cdC8vIGluZGljZXMucHVzaCgwLDEsMiwzLDQsNSk7XG5cblx0XG5cblx0XG5cblx0XG5cdC8vIGRlYnVnZ2VyO1xuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cblxuXG59O1xuXG5cblxuXG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBhdWRpb0RhdGFJbiwgcGVybVRleHR1cmUsIHNpbXBsZXhUZXh0dXJlKSB7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblx0XG5cdHZhciBtdk1hdHJpeCA9IHRoaXMudHJhbnNmb3Jtcy5nZXRNdk1hdHJpeCgpO1xuXG5cdFxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0aWYgKGF1ZGlvRGF0YUluLmxlbmd0aCA+IDgpe1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsRGVlcFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFJblszXSk7XG5cdFx0dGhpcy5zaGFkZXIudW5pZm9ybShcImF1ZGlvTGV2ZWxIaWdoXCIsIFwidW5pZm9ybTFmXCIsIGF1ZGlvRGF0YUluWzhdKTtcblxuXHR9XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInNpbXBsZXhUZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDApO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwicGVybVRleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMSk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ2aWRlb1RleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMik7XG5cblx0Ly8gZGF0IGd1aSBwcm9wc1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiY29sb3JOb2lzZU11bHRpcGxpZXJcIiwgXCJ1bmlmb3JtMWZcIiwgdGhpcy5jb2xvck5vaXNlTXVsdGlwbGllcik7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJub2lzZUJhc2VDb2xvclwiLCBcInVuaWZvcm0zZnZcIiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLm5vaXNlQmFzZUNvbG9yKSk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsTm9pc2VEaXZpZGVyXCIsIFwidW5pZm9ybTFmXCIsIHRoaXMuYXVkaW9MZXZlbE5vaXNlRGl2aWRlcik7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ2ZXJ0ZXhNdWx0aXBsaWVyXCIsIFwidW5pZm9ybTFmXCIsIHRoaXMudmVydGV4TXVsdGlwbGllcik7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ1c2VQdWxzZVwiLCBcInVuaWZvcm0xaVwiLCB0aGlzLnVzZVB1bHNlID8gMSA6IDApO1xuXG5cdHNpbXBsZXhUZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHRwZXJtVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAxKTtcblx0dmlkZW9UZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDIpO1xuXG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xuXG5cdFxuXHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TGVmdFdhbGw7IiwiLy9WaWV3UGxhaW4uanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3UGxhaW4oKXt9O1xuXG52YXIgcCA9IFZpZXdQbGFpbi5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24odmVydFBhdGgsIGZyYWdQYXRoKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cdFxuXHRzLmluaXQuY2FsbCh0aGlzLCB2ZXJ0UGF0aCwgZnJhZ1BhdGgpO1xuXG5cdHZhciBwb3NpdGlvbnMgPSBbXTtcblx0dmFyIGNvb3JkcyA9IFtdO1xuXHR2YXIgaW5kaWNlcyA9IFswLCAxLCAyLCAwLCAyLCAzXTtcblxuXHR2YXIgc2l6ZSA9IDE7XG5cdHBvc2l0aW9ucy5wdXNoKFstc2l6ZSwgLXNpemUsIDBdKTtcblx0cG9zaXRpb25zLnB1c2goWyBzaXplLCAtc2l6ZSwgMF0pO1xuXHRwb3NpdGlvbnMucHVzaChbIHNpemUsICBzaXplLCAwXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFstc2l6ZSwgIHNpemUsIDBdKTtcblxuXHRjb29yZHMucHVzaChbMCwgMF0pO1xuXHRjb29yZHMucHVzaChbMSwgMF0pO1xuXHRjb29yZHMucHVzaChbMSwgMV0pO1xuXHRjb29yZHMucHVzaChbMCwgMV0pO1xuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KDQsIDYsIGdsLlRSSUFOR0xFUyk7XG5cdHRoaXMubWVzaC5idWZmZXJWZXJ0ZXgocG9zaXRpb25zKTtcblx0dGhpcy5tZXNoLmJ1ZmZlclRleENvb3Jkcyhjb29yZHMpO1xuXHR0aGlzLm1lc2guYnVmZmVySW5kaWNlcyhpbmRpY2VzKTtcblxufTtcblxuXG5cbnAucmVuZGVyID0gZnVuY3Rpb24odGV4dHVyZSwgZmJvU2l6ZSkge1xuXG5cdC8vIHRoaXMudHJhbnNmb3Jtcy5jYWxjdWxhdGVNb2RlbFZpZXcoKTtcblxuXHQvLyB2YXIgbXZNYXRyaXggPSB0aGlzLnRyYW5zZm9ybXMuZ2V0TXZNYXRyaXgoKTtcblxuXHQvLyBtYXQ0LnJvdGF0ZShtdk1hdHJpeCwgLS40Kk1hdGguUEksIFsxLCAwLCAwXSk7XG4gICAgLy8gbWF0NC5yb3RhdGUobXZNYXRyaXgsIGRlZ1RvUmFkKC15YXcpLCBbMCwgMSwgMF0pO1xuICAgIC8vIG1hdDQudHJhbnNsYXRlKG12TWF0cml4LCBbLXhQb3MsIC15UG9zLCAtelBvc10pO1xuXHQvLyByZXR1cm47XG5cdHRoaXMuc2hhZGVyLmJpbmQoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInVTYW1wbGVyMFwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0IC8vIHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ0ZXh0dXJlUGFydGljbGVcIiwgXCJ1bmlmb3JtMWlcIiwgMSk7XG5cdC8vIHRleHR1cmVQb3MuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdHRleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3UGxhaW47IiwiLy9WaWV3UHJpc20uanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3UHJpc20oKXt9O1xuXG52YXIgcCA9IFZpZXdQcmlzbS5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxudmFyIHJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7IHJldHVybiBtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7IH1cblxucC5pbml0ID0gZnVuY3Rpb24odmVydFBhdGgsIGZyYWdQYXRoKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cdFxuXHRzLmluaXQuY2FsbCh0aGlzLCB2ZXJ0UGF0aCwgZnJhZ1BhdGgpO1xuXG5cblx0dGhpcy5tYXRlcmlhbCA9IG51bGw7XG5cdHRoaXMubWVzaCA9IG51bGw7XG5cblx0dGhpcy5hbmdsZSA9IDA7XG5cblx0dGhpcy5taWRwb2ludHMgPSBbXTtcblxufTtcblxuXG5cbnAuY2FsY0FkakxldmVsID0gZnVuY3Rpb24ocG9pbnRzKXtcblxuXHR2YXIgbWlkU2l6ZSA9IDIwMDtcblx0dmFyIGZvdW5kUG9pbnRzID0gW107XG5cdHZhciBwb2ludHNUb1VzZSA9IFtdO1xuXHR2YXIgYWRqTGV2ZWwgPSBbXTtcblx0dmFyIGFkakxldmVsUmVmID0gW107XG5cdHZhciBhVXNlSW52ZXJzZSA9IFtdO1xuXHR2YXIgYVVzZUludmVyc2VSZWYgPSBbXTtcblx0Zm9yICh2YXIgaT0wO2k8cG9pbnRzLmxlbmd0aDtpKyspe1xuXHRcdGlmIChwb2ludHNbaV1bMV0gPiAtbWlkU2l6ZSAmJiBwb2ludHNbaV1bMV0gPCBtaWRTaXplKXtcblxuXHRcdFx0aWYgKHBvaW50c1tpXVsyXSA+IC1taWRTaXplICYmIHBvaW50c1tpXVsyXSA8IG1pZFNpemUpe1xuXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHBvaW50c1tpXSk7XG5cdFx0XHRcdC8vIGZvdW5kUG9pbnRzLnB1c2gocG9pbnRzW2ldKTtcblx0XHRcdFx0dmFyIGVxdWFscyA9IHRoaXMuY2hlY2tGb3JFcXVhbHMocG9pbnRzW2ldLCBwb2ludHMsIGkpO1xuXHRcdFx0XHRpZiAoZXF1YWxzLmZvdW5kKXtcblx0XHRcdFx0Ly8gaWYgKHRoaXMuY2hlY2tGb3JFcXVhbHMocG9pbnRzW2ldLCBwb2ludHMsIGkpKXtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhwb2ludHNbaV1bMV0pO1xuXHRcdFx0XHQvL1x0ZGVidWdnZXI7XG5cdFx0XHRcdFx0aWYgKGFkakxldmVsUmVmW2VxdWFscy5pZHhdKXtcblx0XHRcdFx0XHRcdGFkakxldmVsLnB1c2goYWRqTGV2ZWxSZWZbZXF1YWxzLmlkeF0pO1xuXHRcdFx0XHRcdFx0YVVzZUludmVyc2UucHVzaChhVXNlSW52ZXJzZVJlZltlcXVhbHMuaWR4XSk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR2YXIgcmFuZG9tTnIgPSByYW5kb20oNCwgMTApXG5cdFx0XHRcdFx0XHRhZGpMZXZlbC5wdXNoKFtyYW5kb21OciwgcmFuZG9tTnIsIHJhbmRvbU5yXSk7XG5cdFx0XHRcdFx0XHRhZGpMZXZlbFJlZltpXSA9IGFkakxldmVsW2FkakxldmVsLmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdGlmIChyYW5kb21OciA8IDcpXG5cdFx0XHRcdFx0XHRcdGFVc2VJbnZlcnNlLnB1c2goWzJdKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0YVVzZUludmVyc2UucHVzaChbMV0pO1xuXHRcdFx0XHRcdFx0YVVzZUludmVyc2VSZWZbaV0gPSBhVXNlSW52ZXJzZVthVXNlSW52ZXJzZS5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGFkakxldmVsLnB1c2goWzAsMCwwXSk7XG5cdFx0XHRcdFx0YVVzZUludmVyc2UucHVzaChbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9ZWxzZXtcblx0XHRcdGFkakxldmVsLnB1c2goWzAsMCwwXSk7XG5cdFx0XHRhVXNlSW52ZXJzZS5wdXNoKFswXSk7XG5cdFx0fVxuXHRcdFxuXHR9XG5cblx0cmV0dXJuIHthOiBhZGpMZXZlbCwgdTogYVVzZUludmVyc2V9O1xufTtcblxucC5jaGVja0ZvckVxdWFscyA9IGZ1bmN0aW9uKHBvaW50LCBwb2ludHMsIHBvaW50SWR4KXtcblxuXHR2YXIgcmV0ID0ge2ZvdW5kOiBmYWxzZSwgaWR4OiB1bmRlZmluZWR9O1xuXHRmb3IgKHZhciBpPTA7aTxwb2ludHMubGVuZ3RoO2krKyl7XG5cblx0XHRpZiAocG9pbnRbMF0gPT0gcG9pbnRzW2ldWzBdICYmIHBvaW50WzFdID09IHBvaW50c1tpXVsxXSAmJiBwb2ludFsyXSA9PSBwb2ludHNbaV1bMl0pe1xuXG5cdFx0XHRpZiAocG9pbnRJZHggPiBpIHx8IHBvaW50SWR4IDwgaSl7XG5cdFx0XHRcdHJldC5mb3VuZCA9IHRydWU7XG5cdFx0XHRcdHJldC5pZHggPSBpO1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhwb2ludElkeCk7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufTtcblxucC5jcmVhdGVNZXNoID0gZnVuY3Rpb24oZGF0YSl7XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgaW5kaWNlcyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBhQWRqSW5kZXggPSBbXTtcblx0dmFyIGlDID0gMDtcblx0Zm9yICh2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtcblxuXHRcdHZhciBpbmQgPSBkYXRhW2ldLm1lc2hEYXRhLnRyaWFuZ2xlcztcblx0XHRmb3IgKHZhciBxPTA7cTxpbmQubGVuZ3RoO3ErKyl7XG5cblx0XHRcdC8vIGluZFtxXSArPSBpQztcblx0XHRcdGluZGljZXMucHVzaChpbmRbcV0gKz0gaUMpO1xuXHRcdH1cblxuXHRcdC8vIGlDICs9IGluZC5sZW5ndGg7XG5cblx0XHR2YXIgbWVzaFBvcyA9IGRhdGFbaV0ubWVzaERhdGEudmVydGljZXM7XG5cdFx0dmFyIHRlbXBQb3MgPSBbXTtcblx0XHRmb3IgKHZhciBxPTA7cTxtZXNoUG9zLmxlbmd0aDtxKz0zKXtcblxuXHRcdFx0dmFyIHggPSBtZXNoUG9zW3FdO1xuXHRcdFx0dmFyIHkgPSBtZXNoUG9zW3ErMV07XG5cdFx0XHR2YXIgeiA9IG1lc2hQb3NbcSsyXTtcblxuXHRcdFx0cG9zaXRpb25zLnB1c2goW3gseSx6XSk7XG5cdFx0XHR0ZW1wUG9zLnB1c2goW3gseV0pO1xuXHRcdFx0Ly8gaWYgKHEgPT0gNilcblx0XHRcdC8vIFx0YUFkakluZGV4LnB1c2goWzIwLjUsIDIuNSwgNTAuNV0pO1xuXHRcdFx0Ly8gZWxzZVxuXHRcdFx0Ly8gXHRhQWRqSW5kZXgucHVzaChbMCwwLDBdKTtcblxuXG5cdFx0XHRjb29yZHMucHVzaChbMCwwXSk7XG5cblx0XHRcdGlDKys7XG5cblx0XHR9XG5cblx0XHRpZiAodGVtcFBvcy5sZW5ndGggPiAzKXtcblx0XHRcdHZhciB0b3BMZWZ0UG9pbnRJZHggPSAwO1xuXHRcdFx0dmFyIGJvdHRvbUxlZnRQb2ludElkeCA9IDA7XG5cdFx0XHR2YXIgdG9wUmlnaHRQb2ludElkeCA9IDA7XG5cdFx0XHR2YXIgYm90dG9tUmlnaHRQb2ludElkeCA9IDA7XG5cblx0XHRcdHZhciBjdXJyZW50VG9wTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHR2YXIgY3VycmVudFRvcFJpZ2h0ID0gdGVtcFBvc1swXTtcblx0XHRcdHZhciBjdXJyZW50Qm90dG9tTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHR2YXIgY3VycmVudEJvdHRvbVJpZ2h0ID0gdGVtcFBvc1swXTtcblxuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHRvcExlZnRQb2ludElkeCA9IDA7XG5cdFx0XHR2YXIgYm90dG9tTGVmdFBvaW50SWR4ID0gMDtcblx0XHRcdHZhciB0b3BSaWdodFBvaW50SWR4ID0gMDtcblx0XHRcdC8vIHZhciBib3R0b21SaWdodFBvaW50SWR4ID0gLTE7XG5cblx0XHRcdHZhciBjdXJyZW50VG9wTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHR2YXIgY3VycmVudFRvcFJpZ2h0ID0gdGVtcFBvc1swXTtcblx0XHRcdHZhciBjdXJyZW50Qm90dG9tTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHQvLyB2YXIgY3VycmVudEJvdHRvbVJpZ2h0ID0gdGVtcFBvc1swXTtcblx0XHR9XG5cblx0XHRcblxuXHRcdGZvciAodmFyIHE9MDtxPHRlbXBQb3MubGVuZ3RoO3ErKyl7XG5cblxuXHRcdFx0Ly90b3BsZWZ0XG5cdFx0XHRpZiAodGVtcFBvc1txXVswXSA8IGN1cnJlbnRUb3BMZWZ0WzBdICYmICh0ZW1wUG9zW3FdWzFdID4gY3VycmVudFRvcExlZnRbMV0pKXtcblx0XHRcdFx0Y3VycmVudFRvcExlZnQgPSB0ZW1wUG9zW3FdO1xuXHRcdFx0XHR0b3BMZWZ0UG9pbnRJZHggPSBxO1xuXHRcdFx0fVxuXHRcdFx0XG5cblx0XHRcdC8vdG9wcmlnaHRcblx0XHRcdGlmICh0ZW1wUG9zW3FdWzBdID4gY3VycmVudFRvcFJpZ2h0WzBdICYmICh0ZW1wUG9zW3FdWzFdID4gY3VycmVudFRvcFJpZ2h0WzFdKSl7XG5cdFx0XHRcdGN1cnJlbnRUb3BSaWdodCA9IHRlbXBQb3NbcV07XG5cdFx0XHRcdHRvcFJpZ2h0UG9pbnRJZHggPSBxO1xuXHRcdFx0fVxuXHRcdFx0XG5cblx0XHRcdGlmICh0ZW1wUG9zLmxlbmd0aCA+IDMpe1xuXHRcdFx0XHQvL2JvdHRvbXJpZ2h0XG5cdFx0XHRcdGlmICh0ZW1wUG9zW3FdWzBdID4gY3VycmVudEJvdHRvbVJpZ2h0WzBdICYmICh0ZW1wUG9zW3FdWzFdIDwgY3VycmVudEJvdHRvbVJpZ2h0WzFdKSl7XG5cdFx0XHRcdFx0Y3VycmVudEJvdHRvbVJpZ2h0ID0gdGVtcFBvc1txXTtcblx0XHRcdFx0XHRib3R0b21SaWdodFBvaW50SWR4ID0gcTtcblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblxuXHRcdFx0Ly9ib3R0b21sZWZ0XG5cdFx0XHRpZiAodGVtcFBvc1txXVswXSA8IGN1cnJlbnRCb3R0b21MZWZ0WzBdICYmICh0ZW1wUG9zW3FdWzFdIDwgY3VycmVudEJvdHRvbUxlZnRbMV0pKXtcblx0XHRcdFx0Y3VycmVudEJvdHRvbUxlZnQgPSB0ZW1wUG9zW3FdO1xuXHRcdFx0XHRib3R0b21MZWZ0UG9pbnRJZHggPSBxO1xuXHRcdFx0fVxuXHRcdFxuXG5cdFx0fVxuXG5cdFx0Ly8gZGVidWdnZXI7XG5cdFx0aWYgKHRlbXBQb3MubGVuZ3RoID4gMyl7XG5cdFx0XHRjb29yZHNbY29vcmRzLmxlbmd0aCAtICh0ZW1wUG9zLmxlbmd0aCAtIHRvcExlZnRQb2ludElkeCldID0gWy4zLCAuN107XG5cdFx0XHRjb29yZHNbY29vcmRzLmxlbmd0aCAtICh0ZW1wUG9zLmxlbmd0aCAtIHRvcFJpZ2h0UG9pbnRJZHgpXSA9IFsuNywgLjddO1xuXHRcdFx0Y29vcmRzW2Nvb3Jkcy5sZW5ndGggLSAodGVtcFBvcy5sZW5ndGggLSBib3R0b21MZWZ0UG9pbnRJZHgpXSA9IFsuMywgLjNdO1xuXHRcdFx0Y29vcmRzW2Nvb3Jkcy5sZW5ndGggLSAodGVtcFBvcy5sZW5ndGggLSBib3R0b21SaWdodFBvaW50SWR4KV0gPSBbLjcsIC4zXTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvb3Jkc1tjb29yZHMubGVuZ3RoIC0gKHRlbXBQb3MubGVuZ3RoIC0gdG9wTGVmdFBvaW50SWR4KV0gPSBbLjMsIC43XTtcblx0XHRcdGNvb3Jkc1tjb29yZHMubGVuZ3RoIC0gKHRlbXBQb3MubGVuZ3RoIC0gdG9wUmlnaHRQb2ludElkeCldID0gWy43LCAuN107XG5cdFx0XHRjb29yZHNbY29vcmRzLmxlbmd0aCAtICh0ZW1wUG9zLmxlbmd0aCAtIGJvdHRvbUxlZnRQb2ludElkeCldID0gWy4zLCAuM107XG5cdFx0fVxuXG5cdFx0Ly8gY29uc29sZS5sb2codGVtcFBvcy5sZW5ndGgpO1xuXHRcdFxuXHR9XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0Ly8gdGhpcy5maW5kTWlkUG9pbnRzKHBvc2l0aW9ucyk7XG5cdGV4dHJhcyA9IHRoaXMuY2FsY0FkakxldmVsKHBvc2l0aW9ucyk7XG5cblx0XG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cdHRoaXMubWVzaC5idWZmZXJEYXRhKGV4dHJhcy5hLCBcImFBZGpJbmRleFwiLCAzLCBmYWxzZSk7XG5cdHRoaXMubWVzaC5idWZmZXJEYXRhKGV4dHJhcy51LCBcImFVc2VJbnZlcnNlXCIsIDEsIGZhbHNlKTtcblx0Ly8gdGhpcy5tZXNoLmJ1ZmZlckRhdGEoY29sb3JzLCBcImFWZXJ0ZXhDb2xvclwiLCAzLCBmYWxzZSk7XG5cdC8vIHRoaXMubWVzaC5idWZmZXJEYXRhKG5vcm1hbHMsIFwiYVZlcnRleE5vcm1hbFwiLCAzLCB0cnVlKTtcblxuXHRcbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBhdWRpb0RhdGEpIHtcblxuXHR0aGlzLnRyYW5zZm9ybXMucHVzaCgpO1xuXHRcblx0dmFyIG12TWF0cml4ID0gdGhpcy50cmFuc2Zvcm1zLmdldE12TWF0cml4KCk7XG5cblx0XG5cblx0bWF0NC50cmFuc2xhdGUobXZNYXRyaXgsIG12TWF0cml4LCBbLTY5LjksMjAsMF0pXG5cdG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgTWF0aC5QSSAqIC0uNSwgWzAsMSwwXSk7XG5cdG1hdDQuc2NhbGUobXZNYXRyaXgsIG12TWF0cml4LCBbMC4wNiwgMC4xLCAwLjA1XSk7XG5cblxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0aWYgKGF1ZGlvRGF0YS5sZW5ndGggPiA4KXtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbERlZXBcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzNdKTtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbEhpZ2hcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzhdKTtcblxuXHR9XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImFuZ2xlXCIsIFwidW5pZm9ybTFmXCIsIHRoaXMuYW5nbGUrPS4wMDUpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidmlkZW9UZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDApO1xuXHQvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwidGV4dHVyZVBhcnRpY2xlXCIsIFwidW5pZm9ybTFpXCIsIDEpO1xuXHR2aWRlb1RleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdC8vIHRleHR1cmUuYmluZCgxKTtcblx0dGhpcy5kcmF3KHRoaXMubWVzaCk7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3UHJpc207IiwiLy9WaWV3Um9vZi5qc1xuXG52YXIgVmlldyA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9WaWV3Jyk7XG52YXIgTWVzaCA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9NZXNoJyk7XG5cbmZ1bmN0aW9uIFZpZXdSb29mKCl7fTtcblxudmFyIHAgPSBWaWV3Um9vZi5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBpbmRpY2VzID0gW107XG5cdFxuXHR2YXIgd2lkdGggPSB3aW5kb3cuTlMuR0wucGFyYW1zLndpZHRoO1xuXHR2YXIgaGVpZ2h0ID0gd2luZG93Lk5TLkdMLnBhcmFtcy5oZWlnaHQ7XG5cdHZhciBkZXB0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMuZGVwdGg7XG5cblx0Ly9ST09GXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCAtZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goW3dpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdGNvb3Jkcy5wdXNoKFswLCAwXSk7XG5cdGNvb3Jkcy5wdXNoKFswLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAwXSk7XG5cblx0XG5cdGluZGljZXMucHVzaCgwLDEsMiwzLDAsMik7XG5cblx0dGhpcy5tZXNoID0gbmV3IE1lc2goKTtcblx0dGhpcy5tZXNoLmluaXQocG9zaXRpb25zLmxlbmd0aCwgaW5kaWNlcy5sZW5ndGgsIGdsLlRSSUFOR0xFUyk7XG5cdHRoaXMubWVzaC5idWZmZXJWZXJ0ZXgocG9zaXRpb25zKTtcblx0dGhpcy5tZXNoLmJ1ZmZlclRleENvb3Jkcyhjb29yZHMpO1xuXHR0aGlzLm1lc2guYnVmZmVySW5kaWNlcyhpbmRpY2VzKTtcblxufTtcblxucC5yZW5kZXIgPSBmdW5jdGlvbih2aWRlb1RleHR1cmUsIGZsb29yVGV4dHVyZSwgYXVkaW9EYXRhLCBmYm9TaXplKSB7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0aWYgKGF1ZGlvRGF0YS5sZW5ndGggPiA4KXtcblxuXHRcdFxuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsRGVlcFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbM10pO1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsSGlnaFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbOF0pO1xuXG5cdH1cblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidmlkZW9UZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDApO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiY29uY3JldGVUZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDEpO1xuXHRcblx0dmlkZW9UZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHRmbG9vclRleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMSk7XG5cdFxuXHR0aGlzLmRyYXcodGhpcy5tZXNoKTtcblx0XG5cdHRoaXMudHJhbnNmb3Jtcy5wb3AoKTtcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdSb29mOyIsIi8vVmlld1ZpZGVvLmpzXG5cbnZhciBWaWV3ID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL1ZpZXcnKTtcbnZhciBNZXNoID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL01lc2gnKTtcblxuZnVuY3Rpb24gVmlld1ZpZGVvKCl7fTtcblxudmFyIHAgPSBWaWV3VmlkZW8ucHJvdG90eXBlID0gbmV3IFZpZXcoKTtcbnZhciBzID0gVmlldy5wcm90b3R5cGU7XG5cbnZhciBnbCA9IG51bGw7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRQYXRoLCBmcmFnUGF0aCl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXHRcblx0cy5pbml0LmNhbGwodGhpcywgdmVydFBhdGgsIGZyYWdQYXRoKTtcblxuXHR2YXIgcG9zaXRpb25zID0gW107XG5cdHZhciBjb29yZHMgPSBbXTtcblx0dmFyIGluZGljZXMgPSBbMCwgMSwgMiwgMCwgMiwgM107XG5cblx0dmFyIHNpemUgPSAzMDtcblxuXHR2YXIgdmlkSGVpZ2h0ID0gMzA7XG5cdHZhciB3YWxsSGVpZ2h0ID0gNDA7XG5cblx0cG9zaXRpb25zLnB1c2goWy1zaXplLCAod2FsbEhlaWdodC12aWRIZWlnaHQpLzIsIC01OV0pO1xuXHRwb3NpdGlvbnMucHVzaChbIHNpemUsICh3YWxsSGVpZ2h0LXZpZEhlaWdodCkvMiwgLTU5XSk7XG5cdHBvc2l0aW9ucy5wdXNoKFsgc2l6ZSwgIHZpZEhlaWdodCArICh3YWxsSGVpZ2h0LXZpZEhlaWdodCkvMiwgLTU5XSk7XG5cdHBvc2l0aW9ucy5wdXNoKFstc2l6ZSwgIHZpZEhlaWdodCArICh3YWxsSGVpZ2h0LXZpZEhlaWdodCkvMiwgLTU5XSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblxuXHR0aGlzLm1lc2ggPSBuZXcgTWVzaCgpO1xuXHR0aGlzLm1lc2guaW5pdCg0LCA2LCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cbn07XG5cblxuXG5wLnJlbmRlciA9IGZ1bmN0aW9uKHZpZGVvVGV4dHVyZSkge1xuXG5cdHRoaXMudHJhbnNmb3Jtcy5wdXNoKCk7XG5cblx0Ly8gdGhpcy50cmFuc2Zvcm1zLmNhbGN1bGF0ZU1vZGVsVmlldygpO1xuXG5cdHZhciBtdk1hdHJpeCA9IHRoaXMudHJhbnNmb3Jtcy5nZXRNdk1hdHJpeCgpO1xuXG5cdC8vIG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgLS40Kk1hdGguUEksIFswLCAwLCAxXSk7XG4gICAgLy8gbWF0NC5yb3RhdGUobXZNYXRyaXgsIGRlZ1RvUmFkKC15YXcpLCBbMCwgMSwgMF0pO1xuICAgIC8vIG1hdDQudHJhbnNsYXRlKG12TWF0cml4LCBbLXhQb3MsIC15UG9zLCAtelBvc10pO1xuXHQvLyByZXR1cm47XG5cdHRoaXMuc2hhZGVyLmJpbmQoKTtcblxuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ2aWRlb1RleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMCk7XG5cdC8vIHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ0ZXh0dXJlUGFydGljbGVcIiwgXCJ1bmlmb3JtMWlcIiwgMSk7XG5cdHZpZGVvVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAwKTtcblx0Ly8gdGV4dHVyZS5iaW5kKDEpO1xuXHR0aGlzLmRyYXcodGhpcy5tZXNoKTtcblxuXHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdWaWRlbzsiLCIvL1ZpZXdXYWxscy5qc1xuXG52YXIgVmlldyA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9WaWV3Jyk7XG52YXIgTWVzaCA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9NZXNoJyk7XG5cbmZ1bmN0aW9uIFZpZXdXYWxscygpe307XG5cbnZhciBwID0gVmlld1dhbGxzLnByb3RvdHlwZSA9IG5ldyBWaWV3KCk7XG52YXIgcyA9IFZpZXcucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRQYXRoLCBmcmFnUGF0aCl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXHRcblx0cy5pbml0LmNhbGwodGhpcywgdmVydFBhdGgsIGZyYWdQYXRoKTtcblxuXHR2YXIgcG9zaXRpb25zID0gW107XG5cdHZhciBjb29yZHMgPSBbXTtcblx0dmFyIGluZGljZXMgPSBbXTtcblx0XG5cdHZhciB3aWR0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMud2lkdGg7XG5cdHZhciBoZWlnaHQgPSB3aW5kb3cuTlMuR0wucGFyYW1zLmhlaWdodDtcblx0dmFyIGRlcHRoID0gd2luZG93Lk5TLkdMLnBhcmFtcy5kZXB0aDtcblxuXHQvL0ZST05UV0FMTFxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIGRlcHRoXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblxuXHRcblxuXHRcblxuXHRpbmRpY2VzLnB1c2goMCwgMSwgMiwgMywgMCwgMik7XG5cblx0XG5cdFxuXG5cdC8vTEVGVCBTSURFV0FMTFxuXHQvLyBwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIGRlcHRoXSk7XG5cblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIC1kZXB0aF0pO1xuXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIC1kZXB0aF0pO1xuXG5cdGNvb3Jkcy5wdXNoKFswLCAwXSk7XG5cdGNvb3Jkcy5wdXNoKFswLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAwXSk7XG5cblxuXG5cblx0aW5kaWNlcy5wdXNoKDQsIDUsIDYsIDcsIDQsIDYpO1xuXG5cdC8vUklHSFQgU0lERVdBTExcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCBkZXB0aF0pO1xuXHQvLyBwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgZGVwdGhdKTtcblxuXHQvLyBwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIC8vIHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIDAsIGRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cblx0cG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCAtZGVwdGhdKTtcblx0XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblxuXG5cdGluZGljZXMucHVzaCg4LCA5LCAxMCwgMTEsIDgsIDEwKTtcblxuXHQvL0JBQ0tXQUxMXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIC1kZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIC1kZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgLWRlcHRoXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblxuXG5cdGluZGljZXMucHVzaCgxMiwgMTMsIDE0LCAxNSwgMTIsIDE0KTtcblxuXG5cdFxuXG5cdFxuXG5cdFxuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBmYm9TaXplKSB7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInZpZGVvVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0XG5cdHZpZGVvVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAwKTtcblx0XG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xuXHRcblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdXYWxsczsiXX0=
