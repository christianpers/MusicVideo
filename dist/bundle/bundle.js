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
var ViewBlur = require('./views/ViewBlur');
var ViewLamp = require('./views/ViewLamp');
var ViewLeftWall = require('./views/ViewLeftWall');
var ViewPlain = require('./views/ViewPlain');
var ViewBackground = require('./views/ViewBackground');
var ViewLed = require('./views/ViewLed');
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

	this.fboSizeLed = {};
	this.fboSizeLed.w = 2;
	this.fboSizeLed.h = window.innerHeight;

	this._leftWallFBO = new Framebuffer();
	this._leftWallFBO.init(this.fboSize.w/2, this.fboSize.h/2, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);

	this._prismFBO = new Framebuffer();
	this._prismFBO.init(this.fboSize.w, this.fboSize.h, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);

	this._ledFBO = new Framebuffer();
	this._ledFBO.init(this.fboSizeLed.w, this.fboSizeLed.h, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);

	this._blurVFBO = new Framebuffer();
	this._blurVFBO.init(this.fboSizeLed.w, this.fboSizeLed.h, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);

	this._blurHFBO = new Framebuffer();
	this._blurHFBO.init(this.fboSizeLed.w, this.fboSizeLed.h, gl.NEAREST, gl.NEAREST, gl.UNSIGNED_BYTE);
	
	

};

p._initViews = function() {
	console.log( "Init Views" );

	this._views = [];

	this.backgroundLoaderFader += .2;

	this._vBackground = new ViewBackground();
	this._vBackground.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform float angleVert;\n\nvarying vec3 vVertexPos;\nvarying vec3 vTextureCoord;\n\nvoid main(void) {\n\n\tvec3 newPos = aVertexPosition;\n\tnewPos.xy *= angleVert*2.0;\n\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vVertexPos = aVertexPosition;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_1_0(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289_1_0(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute_1_1(vec3 x) {\n  return mod289_1_0(((x*34.0)+1.0)*x);\n}\n\nfloat snoise_1_2(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289_1_0(i); // Avoid truncation effects in permutation\n  vec3 p = permute_1_1( permute_1_1( i.y + vec3(0.0, i1.y, 1.0 ))\n    + i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n\n\n// varying vec2 vTextureCoord;\n// uniform sampler2D uSampler0;\n\nuniform float angle;\n\nuniform sampler2D permTexture;\nuniform sampler2D simplexTexture;\nuniform sampler2D floorTexture;\n\nuniform float faderVal;\n\nvarying vec3 vVertexPos;\nvarying vec3 vTextureCoord;\n\n#define PI 3.141592653589793\n#define ONE 0.00390625\n#define ONEHALF 0.001953125\n\n/*\n * 3D simplex noise. Comparable in speed to classic noise, better looking.\n */\nfloat snoise(vec3 P){\n\n\t// The skewing and unskewing factors are much simpler for the 3D case\n\t#define F3 0.333333333333\n\t#define G3 0.166666666667\n\n  // Skew the (x,y,z) space to determine which cell of 6 simplices we're in\n\tfloat s = (P.x + P.y + P.z) * F3; // Factor for 3D skewing\n\tvec3 Pi = floor(P + s);\n\tfloat t = (Pi.x + Pi.y + Pi.z) * G3;\n\tvec3 P0 = Pi - t; // Unskew the cell origin back to (x,y,z) space\n\tPi = Pi * ONE + ONEHALF; // Integer part, scaled and offset for texture lookup\n\n\tvec3 Pf0 = P - P0;  // The x,y distances from the cell origin\n\n  // // For the 3D case, the simplex shape is a slightly irregular tetrahedron.\n  // // To find out which of the six possible tetrahedra we're in, we need to\n  // // determine the magnitude ordering of x, y and z components of Pf0.\n  // // The method below is explained briefly in the C code. It uses a small\n  // // 1D texture as a lookup table. The table is designed to work for both\n  // // 3D and 4D noise, so only 8 (only 6, actually) of the 64 indices are\n  // // used here.\n\tfloat c1 = (Pf0.x > Pf0.y) ? 0.5078125 : 0.0078125; // 1/2 + 1/128\n\tfloat c2 = (Pf0.x > Pf0.z) ? 0.25 : 0.0;\n\tfloat c3 = (Pf0.y > Pf0.z) ? 0.125 : 0.0;\n\tfloat sindex = c1 + c2 + c3;\n \tvec3 offsets = texture2D(simplexTexture, vec2(sindex, 0)).rgb;\n\tvec3 o1 = step(0.375, offsets);\n\tvec3 o2 = step(0.125, offsets);\n\n  // Noise contribution from simplex origin\n  float perm0 = texture2D(permTexture, Pi.xy).a;\n  vec3  grad0 = texture2D(permTexture, vec2(perm0, Pi.z)).rgb * 4.0 - 1.0;\n  float t0 = 0.6 - dot(Pf0, Pf0);\n  float n0;\n  if (t0 < 0.0) n0 = 0.0;\n  else {\n    t0 *= t0;\n    n0 = t0 * t0 * dot(grad0, Pf0);\n  }\n\n  // Noise contribution from second corner\n  vec3 Pf1 = Pf0 - o1 + G3;\n  float perm1 = texture2D(permTexture, Pi.xy + o1.xy*ONE).a;\n  vec3  grad1 = texture2D(permTexture, vec2(perm1, Pi.z + o1.z*ONE)).rgb * 4.0 - 1.0;\n  float t1 = 0.6 - dot(Pf1, Pf1);\n  float n1;\n  if (t1 < 0.0) n1 = 0.0;\n  else {\n    t1 *= t1;\n    n1 = t1 * t1 * dot(grad1, Pf1);\n  }\n  \n  // Noise contribution from third corner\n  vec3 Pf2 = Pf0 - o2 + 2.0 * G3;\n  float perm2 = texture2D(permTexture, Pi.xy + o2.xy*ONE).a;\n  vec3  grad2 = texture2D(permTexture, vec2(perm2, Pi.z + o2.z*ONE)).rgb * 4.0 - 1.0;\n  float t2 = 0.6 - dot(Pf2, Pf2);\n  float n2;\n  if (t2 < 0.0) n2 = 0.0;\n  else {\n    t2 *= t2;\n    n2 = t2 * t2 * dot(grad2, Pf2);\n  }\n  \n  // Noise contribution from last corner\n  vec3 Pf3 = Pf0 - vec3(1.0-3.0*G3);\n  float perm3 = texture2D(permTexture, Pi.xy + vec2(ONE, ONE)).a;\n  vec3  grad3 = texture2D(permTexture, vec2(perm3, Pi.z + ONE)).rgb * 4.0 - 1.0;\n  float t3 = 0.6 - dot(Pf3, Pf3);\n  float n3;\n  if(t3 < 0.0) n3 = 0.0;\n  else {\n    t3 *= t3;\n    n3 = t3 * t3 * dot(grad3, Pf3);\n  }\n\n  // Sum up and scale the result to cover the range [-1,1]\n  return 32.0 * (n0 + n1 + n2 + n3);\n}\n\n\nfloat pulse(float time) {\n    // const float pi = 3.14;\n    float frequency = 1.0;\n    return 0.5*(1.0+sin(2.0 * PI * frequency * time));\n}\n\n\nvoid main(void) {\n    // gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));\n\n    vec3 floorColor = texture2D(floorTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;\n\n    float vertexMultiplier = 2.0 / angle;\n\n    // float brightness = snoise_1_2(floorColor.rb/((angle+.4)*1.2));\n\n    float n = snoise( (floorColor.rgb/((angle+.05)*2.2)) );\n\t// float n = snoise(vec3(vertexMultiplier * vVertexPos * ((angle/faderVal) *1.0 ) ));\n  // float n = snoise((vVertexPos/angle) * sin(vertexMultiplier * PI));\n\n\t// n = snoise(vec3(vertexMultiplier * vVertexPos * (audioLevelHigh/audioLevelNoiseDivider) ));\n\n    \n\n    vec3 finalColor = mix(vec3(n),floorColor,1.0 - faderVal);\n    // gl_FragColor = vec4(floorColor,1.0);\n    gl_FragColor = vec4(finalColor, 1.0);\n}");
	this._vBackground.transforms = this.orthoTransforms;

	this._vCopy = new ViewPlain();
	this._vCopy.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nprecision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler0;\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvoid main(void) {\n\n\tfloat scaleW = fboW / winW;\n\tfloat scaleH = fboH / winH;\n\n    // gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s/scaleW, vTextureCoord.t/scaleH));\n    gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n}");
	this._vCopy.transforms = this.orthoTransforms;

	this._vBlurVert = new ViewBlur();
	this._vBlurVert.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\nuniform sampler2D sceneTexture;\nuniform float rt_w;\nuniform float rt_h;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vertexPos;\nfloat offset[3];\n\n\nfloat weight[3];\n\n\n// float offset[3] = float[]( 0.0, 1.3846153846, 3.2307692308 );\n// float weight[3] = float[]( 0.2270270270, 0.3162162162, 0.0702702703 );\n\nvoid main(void) {\n\toffset[0] = 0.0;\n\toffset[1] = 1.3846153846;\n\toffset[2] = 3.2307692308;\n\n\tweight[0] = 0.2270270270;\n\tweight[1] = 0.3162162162;\n\tweight[2] = 0.0702702703;\n    // gl_FragColor = texture2D(sceneTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    vec3 tc = vec3(1.0, 0.0, 0.0);\n\tif (vTextureCoord.x<(0.5-0.01))\n\t{\n\tvec2 uv = vTextureCoord.xy;\n\ttc = texture2D(sceneTexture, uv).rgb * weight[0];\n\tfor (int i=1; i<3; i++) \n\t{\n\t  tc += texture2D(sceneTexture, uv + vec2(0.0, offset[i])/rt_h).rgb * weight[i];\n\t  tc += texture2D(sceneTexture, uv - vec2(0.0, offset[i])/rt_h).rgb * weight[i];\n\t}\n\t}\n\telse if (vTextureCoord.x>=(0.5+0.01))\n\t{\n\t\ttc = texture2D(sceneTexture, vTextureCoord.xy).rgb;\n\t}\n\tgl_FragColor = vec4(tc, 1.0);\n\n\n}");
	this._vBlurVert.transforms = this.orthoTransforms;

	this._vBlurHoriz = new ViewBlur();
	this._vBlurHoriz.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\nuniform sampler2D sceneTexture;\nuniform float rt_w;\nuniform float rt_h;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vertexPos;\nfloat offset[3];\n\n\nfloat weight[3];\n\n\n// float offset[3] = float[]( 0.0, 1.3846153846, 3.2307692308 );\n// float weight[3] = float[]( 0.2270270270, 0.3162162162, 0.0702702703 );\n\nvoid main(void) {\n\toffset[0] = 0.0;\n\toffset[1] = 1.3846153846;\n\toffset[2] = 3.2307692308;\n\n\tweight[0] = 0.2270270270;\n\tweight[1] = 0.3162162162;\n\tweight[2] = 0.0702702703;\n    // gl_FragColor = texture2D(sceneTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    vec3 tc = vec3(1.0, 0.0, 0.0);\n\tif (vTextureCoord.x<(0.5-0.01))\n\t{\n\tvec2 uv = vTextureCoord.xy;\n\ttc = texture2D(sceneTexture, uv).rgb * weight[0];\n\tfor (int i=1; i<3; i++) \n\t{\n\t  tc += texture2D(sceneTexture, uv + vec2(0.0, offset[i])/rt_w).rgb * weight[i];\n\t  tc += texture2D(sceneTexture, uv - vec2(0.0, offset[i])/rt_w).rgb * weight[i];\n\t}\n\t}\n\telse if (vTextureCoord.x>=(0.5+0.01))\n\t{\n\t\ttc = texture2D(sceneTexture, vTextureCoord.xy).rgb;\n\t}\n\tgl_FragColor = vec4(tc, 1.0);\n\n\n}");
	this._vBlurHoriz.transforms = this.orthoTransforms;

	this._vWalls = new ViewWalls();
	this._vWalls.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\n\n\nvarying vec2 vTextureCoord;\n\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n\tvec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n    gl_Position = uPMatrix * mvPosition;\n  \n    vTextureCoord = aTextureCoord;\n\n    vVertexPos = aVertexPosition;\n  \n\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n\nuniform sampler2D videoTexture;\n\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvarying vec2 vTextureCoord;\n\n//not used\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n    \n    \n  // vec3 finalColor = vec3(.5, .5, .5);\n\n  float scaleW = fboW / winW;\n  float scaleH = fboH / winH;\n   \n  //walls\n  vec4 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s/scaleW, vTextureCoord.t/scaleH));\n  // finalColor = videoColor.rgb;\n    \n    \n\n  gl_FragColor = vec4(videoColor);\n   \n}");
	this._vWalls.transforms = this.transforms;
	
	this._vRoof = new ViewRoof();
	this._vRoof.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\n\n\nvarying vec2 vTextureCoord;\n\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n\tvec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n    gl_Position = uPMatrix * mvPosition;\n  \n    vTextureCoord = aTextureCoord;\n\n    vVertexPos = aVertexPosition;\n  \n\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n\nuniform sampler2D videoTexture;\nuniform sampler2D concreteTexture;\n\nuniform float audioLevelDeep;\nuniform float audioLevelHigh;\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\n\nvoid main(void) {\n    \n    vec3 finalColor = vec3(0.5, 0.5, 0.5);\n    float alpha = 1.0;\n    float reflLimit = .02;\n\n    float scaleW = fboW / winW;\n    float scaleH = fboH / winH;\n\n    vec4 concreteColor = texture2D(concreteTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n\n    vec2 coords = vTextureCoord;\n    coords.s = coords.s/scaleW;\n    coords.t = coords.t/scaleH;\n\n    float maxS = 1.0 / scaleW;\n    float maxT = 1.0 / scaleH;\n\n   \n    float reflLimitS = maxS - reflLimit;\n    float reflLimitT = maxT - reflLimit;\n\n    vec4 videoColorRight = texture2D(videoTexture, vec2(maxS - coords.s, coords.t));\n    vec4 videoColorBack = texture2D(videoTexture, vec2(coords.t, coords.s));\n    vec4 videoColorLeft = texture2D(videoTexture, vec2(maxS - coords.s, maxT - coords.t));\n    vec4 videoColorFront = texture2D(videoTexture, vec2(coords.t, maxS - coords.s));\n\n    vec3 reflFront = smoothstep(reflLimitS, maxS, maxS - coords.s) * videoColorFront.rgb;\n    vec3 reflLeft = smoothstep(reflLimitT, maxT, maxT - coords.t) * videoColorLeft.rgb;\n    vec3 reflRight = smoothstep(reflLimitT, maxT, coords.t) * videoColorRight.rgb;\n    vec3 reflBack = smoothstep(reflLimitS, maxS, coords.s) * videoColorBack.rgb;\n\n    finalColor = (concreteColor.rgb * (vec3(.5, .5, .5) * audioLevelDeep)) + (reflFront + reflLeft + reflRight + reflBack);\n\n    gl_FragColor = vec4(finalColor, alpha);\n   \n}");
	this._vRoof.transforms = this.transforms;
	
	this._vFloor = new ViewFloor();
	this._vFloor.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\n\n\nvarying vec2 vTextureCoord;\n\nvarying vec3 vVertexPos;\n\n\nvoid main(void) {\n\tvec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);\n    gl_Position = uPMatrix * mvPosition;\n  \n    vTextureCoord = aTextureCoord;\n\n    vVertexPos = aVertexPosition;\n  \n\n\n\n\n}", "#define GLSLIFY 1\nprecision highp float;\n\nuniform sampler2D videoTexture;\nuniform sampler2D concreteTexture;\n\nuniform float audioLevelDeep;\nuniform float audioLevelHigh;\n\nuniform float fboW;\nuniform float fboH;\n\nuniform float winW;\nuniform float winH;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\n\nvoid main(void) {\n    \n  vec3 finalColor = vec3(0.5, 0.5, 0.5);\n  float alpha = 1.0;\n  float reflLimit = .02;\n\n  float scaleW = fboW / winW;\n  float scaleH = fboH / winH;\n\n  //floor\n  vec4 concreteColor = texture2D(concreteTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n\n  vec2 coords = vTextureCoord;\n  coords.s = coords.s/scaleW;\n  coords.t = coords.t/scaleH;\n\n  float maxS = 1.0 / scaleW;\n  float maxT = 1.0 / scaleH;\n\n  float reflLimitS = maxS - reflLimit;\n  float reflLimitT = maxT - reflLimit;\n\n  vec4 videoColorLeft = texture2D(videoTexture, vec2(maxS - coords.s, coords.t));\n  vec4 videoColorFront = texture2D(videoTexture, vec2(coords.t, coords.s));\n  vec4 videoColorRight = texture2D(videoTexture, vec2(maxS - coords.s, maxT - coords.t));\n  vec4 videoColorBack = texture2D(videoTexture, vec2(coords.t, maxS - coords.s));\n    \n  vec3 reflFront = smoothstep(reflLimitS, maxS, maxS - coords.s) * videoColorFront.rgb;\n  vec3 reflLeft = smoothstep(reflLimitT, maxT, maxT - coords.t) * videoColorLeft.rgb;\n  vec3 reflRight = smoothstep(reflLimitT, maxT, coords.t) * videoColorRight.rgb;\n  vec3 reflBack = smoothstep(reflLimitS, maxS, coords.s) * videoColorBack.rgb;\n\n  finalColor = (concreteColor.rgb * (vec3(.5, .5, .5) * max(.5, audioLevelDeep))) + (reflFront + reflLeft + reflRight + reflBack);\n    \n\n\n  gl_FragColor = vec4(finalColor, alpha);\n\n}");
	this._vFloor.transforms = this.transforms;

	this._vLed = new ViewLed();
	this._vLed.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute float aIndexData;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\nvarying float vIndexData;\n\nvoid main(void) {\n\n\tvec3 newPos = aVertexPosition;\n\t// newPos.z += aIndexData * 10.0;\n\n\t// vVertexPos.y = newPos.y + aIndexData;\n\n    gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);\n    // vTextureCoord = aTextureCoord;\n    vIndexData = aIndexData;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\nvarying float vIndexData;\n\nvarying vec3 vVertexPos;\n\nvoid main(void) {\n\n\t// vec2 pos = mod(vVertexPos.xy, vec2(50.0)) - vec2(35.0);\n // \tfloat dist_squared = dot(pos, pos);\n\n // \tif (dist_squared >= 100.0) discard;\n // \tvec4 color = vec4(.90, .90, .90, 1.0);\n  \n    gl_FragColor = vec4(vIndexData/4.0, .1, .90, 1.0);\n\n      // gl_FragColor = mix(vec4(.90, .90, .90, 1.0), vec4(.20, .20, .40, 0.0),\n      //                   smoothstep(380.25, 420.25, dist_squared));\n\t\n    // gl_FragColor = texture2D(sceneTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, .5, .5, 1.0);\n\n   \n\n\n}");
	this._vLed.transforms = this.orthoTransforms;

	this._vLamp = new ViewLamp();
	this._vLamp.init("#define GLSLIFY 1\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\nvarying float vIndexData;\n\nvoid main(void) {\n\n\tvec3 newPos = aVertexPosition;\n\t// newPos.z += aIndexData * 10.0;\n\n\t// vVertexPos.y = newPos.y + aIndexData;\n\n\tvVertexPos = newPos;\n\n    gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);\n    vTextureCoord = aTextureCoord;\n    // vIndexData = aIndexData;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\n\n\nuniform sampler2D lampTexture;\n\nuniform vec3 colorOne;\nuniform vec3 colorTwo;\nuniform vec3 colorThree;\nuniform vec3 colorFour;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertexPos;\n\n\n// float offset[3] = float[]( 0.0, 1.3846153846, 3.2307692308 );\n// float weight[3] = float[]( 0.2270270270, 0.3162162162, 0.0702702703 );\n\nvec4 fColor;\n\nvoid main(void) {\n\n\t\n    fColor = vec4(1.0, 1.0, 1.0, 0.0);\n    // vec4 circleColor = \n\n    // for(int row = 0; row < 2; row++) {\n        for(int col = 0; col < 4; col++) {\n            float dist = distance(vVertexPos.xy, vec2(0.0, 1.0 + float(col)*1.5));\n            float delta = 0.1;\n    \t\tfloat alpha = smoothstep(0.45-delta, 0.74, dist);\n    \t\t// float alpha = step(.45, dist);\n    \t\t// alpha -= .01;\n    \t\tvec3 circleColor = colorOne;\n    \t\tif (col == 1)\n    \t\t\tcircleColor = colorTwo;\n    \t\telse if (col == 2)\n    \t\t\tcircleColor = colorThree;\n    \t\telse if (col == 3)\n    \t\t\tcircleColor = colorFour;\n            fColor = mix(vec4(circleColor, 1.0), fColor, alpha);\n            // fColor = mix(colors[row*2+col], fColor, alpha);\n        }\n\n        gl_FragColor = fColor;\n    // }\n\n    // float dist = distance(vVertexPos.xy, vec2(-0.50 + 0.0, 0.50 - 0.0));\n    // float delta = 0.1;\n    // float alpha = smoothstep(0.45-delta, 0.45, dist);\n    // gl_FragColor = mix(vec4(0.5, 0.0, 1.0, 1.0), fColor, alpha);\n\n    // gl_FragColor = fColor;\n\n\t// vec2 uv = vTextureCoord.xy;\n\n\t// uv -= vec2(.5, .2);\n\n\t// float circle_radius = .2;\n\t// float border = .01;\n\n\t// float dist =  sqrt(dot(uv, uv));\n\t// if ( dist < circle_radius ){\n\t// \tvec3 textureColor = texture2D(lampTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;\n\t// \tgl_FragColor = vec4(textureColor, 1.0);\n\t// }\n\t// else{\n\t\t\n\n\t// \tgl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\t\t\n\t// }\n\t\n    // gl_FragColor = texture2D(lampTexture, vec2(vTextureCoord.s, vTextureCoord.t));\n    // gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);\n\n   \n\n\n}");
	this._vLamp.transforms = this.transforms;
	
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

	gl.enable(gl.DEPTH_TEST);

	gl.disable(gl.BLEND);

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

			// render prism with wall texture
			this._prismFBO.bind();

			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			this._vPrism.render(this._leftWallFBO.getTexture(), this.audioData);

			this._prismFBO.unbind();

			this.leftWallTransforms.pop();

			
			this.orthoTransforms.setCamera(this.orthoCamera);
			this._ledFBO.bind();
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			

			this._vLed.render();


			this._ledFBO.unbind();

			this._blurVFBO.bind();
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			this._vBlurVert.render(this._ledFBO.getTexture());

			this._blurVFBO.unbind();

			this._blurHFBO.bind();
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

			this._vBlurHoriz.render(this._blurVFBO.getTexture());

			this._blurHFBO.unbind();


			// this._vCopy.render(this._blurHFBO.getTexture(), this.fboSizeLed);

			// this.orthoTransforms.setCamera(this.orthoCamera);

			// this._vCopy.render(this._prismFBO.getTexture(), this.fboSize);



			// // Render visible scene
			this._vWalls.render(this._prismFBO.getTexture(), this.fboSize);
			// // // this._vRoom.render(this._prismFBO.getTexture(), this._concreteTexture);

			this._vVideo.render(this._videoTexture);



			
			// console.log(this.audioData);
			// debugger;
			this._vFloor.render(this._prismFBO.getTexture(), this._concreteTexture, this.audioData, this.fboSize);

			this._vRoof.render(this._prismFBO.getTexture(), this._concreteTexture, this.audioData, this.fboSize);

			this._vCircle.render(this._leftWallFBO.getTexture(), this.audioData);

			// gl.disable(gl.DEPTH_TEST);


            gl.enable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);

			this._vLamp.render(this._blurHFBO.getTexture());

			// debugger;
			// this._vTestImport.render(this._concreteTexture, this.audioData);

		}
	}else{
		this.orthoTransforms.setCamera(this.orthoCamera);
		// this._vBackground.render(this._permTexture, this._simplexTexture, this._concreteTexture, this.backgroundLoaderFader);
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
},{"./ImportsController":1,"./framework/ColladaLoader":7,"./framework/Framebuffer":8,"./framework/ImportAnimation":9,"./framework/Scene":11,"./framework/SceneTransforms":12,"./framework/SpectrumAnalyzer":14,"./framework/Texture":15,"./interaction/KeyboardInteractor":17,"./interaction/MouseInteractor":18,"./players/AudioPlayer":19,"./players/VideoPlayer":20,"./screens/EndScreen":21,"./screens/LoaderScreen":22,"./views/ViewBackground":23,"./views/ViewBlur":24,"./views/ViewFloor":25,"./views/ViewImport":26,"./views/ViewLamp":27,"./views/ViewLed":28,"./views/ViewLeftWall":29,"./views/ViewPlain":30,"./views/ViewPrism":31,"./views/ViewRoof":32,"./views/ViewVideo":33,"./views/ViewWalls":34}],4:[function(require,module,exports){
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
		window.NS.GL.params.height = 60;
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
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    // gl.enable(gl.CULL_FACE);
	// gl.enable(gl.BLEND);
	gl.clearColor( 0, 0, 0, 1 );
	gl.clearDepth( 1 );
	this.depthTextureExt 	= gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
	// this.floatTextureExt 	= gl.getExtension("OES_texture_float") // Or browser-appropriate prefix
	this.deravitives = gl.getExtension("GL_OES_standard_derivatives");
	

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
//ViewBlur.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewBlur(){};

var p = ViewBlur.prototype = new View();
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



p.render = function(texture) {

	// this.transforms.calculateModelView();

	// var mvMatrix = this.transforms.getMvMatrix();

	// mat4.rotate(mvMatrix, -.4*Math.PI, [1, 0, 0]);
    // mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    // mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
	// return;
	this.shader.bind();
	this.shader.uniform("sceneTexture", "uniform1i", 0);

	this.shader.uniform("rt_w","uniform1f",window.innerWidth);
	this.shader.uniform("rt_h","uniform1f",window.innerHeight);

	// this.shader.uniform("fboW", "uniform1f", fboSize.w);
	// this.shader.uniform("fboH", "uniform1f", fboSize.h);

	// this.shader.uniform("winW", "uniform1f", window.innerWidth);
	// this.shader.uniform("winH", "uniform1f", window.innerHeight);
	 // this.shader.uniform("textureParticle", "uniform1i", 1);
	// texturePos.bind(this.shader, 0);
	texture.bind(this.shader, 0);
	this.draw(this.mesh);
};

module.exports = ViewBlur;
},{"../framework/Mesh":10,"../framework/View":16}],25:[function(require,module,exports){
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
},{"../framework/Mesh":10,"../framework/View":16}],26:[function(require,module,exports){
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
},{"../MeshPlain":2,"../framework/View":16}],27:[function(require,module,exports){
//ViewLamp.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewLamp(){};

var p = ViewLamp.prototype = new View();
var s = View.prototype;

var gl = null;

var random = function(min, max) { return min + Math.random() * (max - min); }

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	this.colorOne = [random(0,1), random(0,1), .7];
	this.colorTwo = this.colorOne.slice(0);
	this.colorThree = this.colorOne.slice(0);
	this.colorFour = this.colorOne.slice(0);

	this.colorOneTimestamp = Date.now();
	this.colorTwoTimestamp = Date.now();
	this.colorThreeTimestamp = Date.now();
	this.colorFourTimestamp = Date.now();

	var positions = [];
	var coords = [];
	var indices = [];
	var indexData = [];
	
	var width = 1;
	var height = 6;
	var depth = 0;

	positions.push([-width, 0, depth]);
	positions.push([-width, 6, depth]);
	positions.push([width, 6, depth]);
	positions.push([width, 0, depth]);

	coords.push([0, 0]);
	coords.push([0, 1]);
	coords.push([1, 1]);
	coords.push([1, 0]);

	indices.push(0, 1, 2, 3, 0, 2);
	
	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	
};

p.render = function(lampTexture) {

	var now = Date.now();

	var colorOneDiff = now - this.colorOneTimestamp;
	var colorTwoDiff = now - this.colorTwoTimestamp;
	var colorThreeDiff = now - this.colorThreeTimestamp;
	var colorFourDiff = now - this.colorFourTimestamp;

	if (colorOneDiff >= 1200){
		this.colorOne = [random(0,1), random(0,1), random(0,1)];
		this.colorOneTimestamp = now;
		this.colorTwoTimestamp = now;
		this.colorThreeTimestamp = now;
		this.colorFourTimestamp = now;

	}
	else if (colorFourDiff >= 1000){
		this.colorFour = this.colorOne.slice(0);
		
		
	}
	else if (colorThreeDiff >= 900){
		this.colorThree = this.colorOne.slice(0);
		
	}
	else if (colorTwoDiff >= 600){
		this.colorTwo = this.colorOne.slice(0);
		
	}
	
	

	this.transforms.push();

	var mvMatrix = this.transforms.getMvMatrix();

	mat4.translate(mvMatrix, mvMatrix, [51,10,-59])
	// mat4.rotate(mvMatrix, mvMatrix, Math.PI * -.5, [0,1,0]);
	// mat4.scale(mvMatrix, mvMatrix, [0.06, 0.1, 0.05]);

	this.shader.bind();

	this.shader.uniform("lampTexture", "uniform1i", 0);

	this.shader.uniform("colorOne", "uniform3fv", new Float32Array(this.colorOne));
	this.shader.uniform("colorTwo", "uniform3fv", new Float32Array(this.colorTwo));
	this.shader.uniform("colorThree", "uniform3fv", new Float32Array(this.colorThree));
	this.shader.uniform("colorFour", "uniform3fv", new Float32Array(this.colorFour));

	

	lampTexture.bind(this.shader, 0);

	this.draw(this.mesh);
	
	this.transforms.pop();
};

module.exports = ViewLamp;
},{"../framework/Mesh":10,"../framework/View":16}],28:[function(require,module,exports){
//ViewLed.js

var View = require('../framework/View');
var Mesh = require('../framework/Mesh');

function ViewLed(){};

var p = ViewLed.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	var positions = [];
	var coords = [];
	var indices = [];
	var indexData = [];
	// this.normals = [];
	// this.indexData = [];

	// var latitudeBands = 10;
	// var longitudeBands = 10;
	// var radius = 1.4;
	var width = 1;
	var height = 6;
	var depth = 0;
	positions.push([-width, -1, depth]);
	positions.push([-width, -.5, depth]);
	positions.push([width, -.5, depth]);
	positions.push([width, -1, depth]);

	for (var i=0;i<4;i++){
		indexData.push([0]);
	}

	positions.push([-width, -.5, depth]);
	positions.push([-width, 0, depth]);
	positions.push([width, 0, depth]);
	positions.push([width, -.5, depth]);

	for (var i=0;i<4;i++){
		indexData.push([1]);
	}

	positions.push([-width, 0, depth]);
	positions.push([-width, .5, depth]);
	positions.push([width, .5, depth]);
	positions.push([width, 0, depth]);

	for (var i=0;i<4;i++){
		indexData.push([2]);
	}

	positions.push([-width, .5, depth]);
	positions.push([-width, 1, depth]);
	positions.push([width, 1, depth]);
	positions.push([width, .5, depth]);

	for (var i=0;i<4;i++){
		indexData.push([3]);
	}


	

	// coords.push([0, 0]);
	// coords.push([0, 1]);
	// coords.push([1, 1]);
	// coords.push([1, 0]);


	

	

	indices.push(0, 1, 2, 3, 0, 2);
	indices.push(4, 5, 6, 7, 4, 6);
	indices.push(8, 9, 10, 11, 8, 10);
	indices.push(12, 13, 14, 15, 12, 14);

	// for (var i=0;i<4;i++){

	// 	this.createLed(latitudeBands, longitudeBands, radius, i);
	// }

	
	this.mesh = new Mesh();
	this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	// this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(indexData, 'aIndexData', 1, false);

};

// p.createLed = function(latitudeBands, longitudeBands, radius, idx){

// 	for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
// 		var theta = latNumber * Math.PI / latitudeBands;
// 		var sinTheta = Math.sin(theta);
// 		var cosTheta = Math.cos(theta);

// 		for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
// 			var phi = longNumber * 2 * Math.PI / longitudeBands;
// 			var sinPhi = Math.sin(phi);
// 			var cosPhi = Math.cos(phi);

// 			var x = cosPhi * sinTheta;
// 			var y = cosTheta;
// 			var z = sinPhi * sinTheta;
// 			var u = 1 - (longNumber / longitudeBands);
// 			var v = 1 - (latNumber / latitudeBands);


// 			this.normals.push([x,y,z]);

// 			this.coords.push([u-.2,v]);

// 			this.positions.push([radius * x, radius * y, 10]);
// 			this.indexData.push([idx]);


// 		}
// 	}

// 	for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
// 		for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
// 			var first = (latNumber * (longitudeBands + 1)) + longNumber;
// 			var second = first + longitudeBands + 1;

// 			this.indices.push(first, second, first+1, second, second + 1, first + 1);
	
// 		}
// 	}
 

	

// };

p.render = function() {

	this.transforms.push();

	var mvMatrix = this.transforms.getMvMatrix();

	// mat4.translate(mvMatrix, mvMatrix, [51,10,-59])
	// mat4.rotate(mvMatrix, mvMatrix, Math.PI * -.5, [0,1,0]);
	// mat4.scale(mvMatrix, mvMatrix, [0.06, 0.1, 0.05]);

	this.shader.bind();
	
	this.draw(this.mesh);
	
	this.transforms.pop();
};

module.exports = ViewLed;
},{"../framework/Mesh":10,"../framework/View":16}],29:[function(require,module,exports){
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
},{"../framework/Mesh":10,"../framework/View":16}],30:[function(require,module,exports){
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
},{"../framework/Mesh":10,"../framework/View":16}],31:[function(require,module,exports){
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
},{"../framework/Mesh":10,"../framework/View":16}],32:[function(require,module,exports){
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
},{"../framework/Mesh":10,"../framework/View":16}],33:[function(require,module,exports){
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
},{"../framework/Mesh":10,"../framework/View":16}],34:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvSW1wb3J0c0NvbnRyb2xsZXIuanMiLCJzcmMvanMvTWVzaFBsYWluLmpzIiwic3JjL2pzL1NjZW5lTWFpbi5qcyIsInNyYy9qcy9hcHAuanMiLCJzcmMvanMvY2FtZXJhcy9CYXNlQ2FtZXJhLmpzIiwic3JjL2pzL2NhbWVyYXMvRnJlZUNhbWVyYS5qcyIsInNyYy9qcy9mcmFtZXdvcmsvQ29sbGFkYUxvYWRlci5qcyIsInNyYy9qcy9mcmFtZXdvcmsvRnJhbWVidWZmZXIuanMiLCJzcmMvanMvZnJhbWV3b3JrL0ltcG9ydEFuaW1hdGlvbi5qcyIsInNyYy9qcy9mcmFtZXdvcmsvTWVzaC5qcyIsInNyYy9qcy9mcmFtZXdvcmsvU2NlbmUuanMiLCJzcmMvanMvZnJhbWV3b3JrL1NjZW5lVHJhbnNmb3Jtcy5qcyIsInNyYy9qcy9mcmFtZXdvcmsvU2hhZGVyUHJvZ3JhbS5qcyIsInNyYy9qcy9mcmFtZXdvcmsvU3BlY3RydW1BbmFseXplci5qcyIsInNyYy9qcy9mcmFtZXdvcmsvVGV4dHVyZS5qcyIsInNyYy9qcy9mcmFtZXdvcmsvVmlldy5qcyIsInNyYy9qcy9pbnRlcmFjdGlvbi9LZXlib2FyZEludGVyYWN0b3IuanMiLCJzcmMvanMvaW50ZXJhY3Rpb24vTW91c2VJbnRlcmFjdG9yLmpzIiwic3JjL2pzL3BsYXllcnMvQXVkaW9QbGF5ZXIuanMiLCJzcmMvanMvcGxheWVycy9WaWRlb1BsYXllci5qcyIsInNyYy9qcy9zY3JlZW5zL0VuZFNjcmVlbi5qcyIsInNyYy9qcy9zY3JlZW5zL0xvYWRlclNjcmVlbi5qcyIsInNyYy9qcy92aWV3cy9WaWV3QmFja2dyb3VuZC5qcyIsInNyYy9qcy92aWV3cy9WaWV3Qmx1ci5qcyIsInNyYy9qcy92aWV3cy9WaWV3Rmxvb3IuanMiLCJzcmMvanMvdmlld3MvVmlld0ltcG9ydC5qcyIsInNyYy9qcy92aWV3cy9WaWV3TGFtcC5qcyIsInNyYy9qcy92aWV3cy9WaWV3TGVkLmpzIiwic3JjL2pzL3ZpZXdzL1ZpZXdMZWZ0V2FsbC5qcyIsInNyYy9qcy92aWV3cy9WaWV3UGxhaW4uanMiLCJzcmMvanMvdmlld3MvVmlld1ByaXNtLmpzIiwic3JjL2pzL3ZpZXdzL1ZpZXdSb29mLmpzIiwic3JjL2pzL3ZpZXdzL1ZpZXdWaWRlby5qcyIsInNyYy9qcy92aWV3cy9WaWV3V2FsbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbm9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vSW1wb3J0c0NvbnRyb2xsZXIuanNcblxuZnVuY3Rpb24gSW1wb3J0c0NvbnRyb2xsZXIoKXt9O1xuXG52YXIgcCA9IEltcG9ydHNDb250cm9sbGVyLnByb3RvdHlwZTtcblxucC5pbml0ID0gZnVuY3Rpb24oYW5pbWF0aW9ucyl7XG5cblx0Ly8gdGhpcy5fc3RhcnRUaW1lID0gbmV3IERhdGUubm93KCk7XG5cblx0dGhpcy5hbmltYXRpb25zID0gYW5pbWF0aW9ucy5zbGljZSgwKTtcblxuXHR0aGlzLnJ1bm5pbmcgPSBmYWxzZTtcblxuXHQvLyBhbGwgdGltZXMgZGVmaW5lZCBpbiBzZWNvbmRzIFxuXHQvLyBldmVyeXRoaW4gY29udHJvbGxlZCBmcm9tIHBsYXliYWNrIG9mIHZpZGVvXG5cblxufTtcblxuXG5cbnAucGF1c2UgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMucnVubmluZyA9IGZhbHNlO1xuXG59O1xuXG5wLnN0YXJ0ID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLnJ1bm5pbmcgPSB0cnVlO1xufTtcblxucC51cGRhdGUgPSBmdW5jdGlvbihjdXJyZW50VmlkZW9UaW1lSW4pe1xuXG5cdC8vIGRlYnVnZ2VyO1xuXG5cdGlmICghdGhpcy5ydW5uaW5nKSByZXR1cm47XG5cblx0Ly8gdmFyIGRpZmYgPSBub3cgLSB0aGlzLl9zdGFydFRpbWU7XG5cdHZhciBjdXJyVmlkZW9UaW1lID0gY3VycmVudFZpZGVvVGltZUluO1xuXG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5hbmltYXRpb25zLmxlbmd0aDtpKyspe1xuXHRcdHZhciBub3JtYWxpemVkID0gKGN1cnJWaWRlb1RpbWUgLSB0aGlzLmFuaW1hdGlvbnNbaV0uc3RhcnRUaW1lKSAvIHRoaXMuYW5pbWF0aW9uc1tpXS50b3RhbER1cmF0aW9uO1xuXHRcdC8vIGNvbnNvbGUubG9nKHRoaXMuYW5pbWF0aW9uc1tpXS5zdGFydFRpbWUsIHRoaXMuYW5pbWF0aW9uc1tpXS50b3RhbER1cmF0aW9uLCBpLCBub3JtYWxpemVkKTtcblx0XHR0aGlzLmFuaW1hdGlvbnNbaV0udXBkYXRlKE1hdGgucm91bmQobm9ybWFsaXplZCAqIDEwMCkgLyAxMDApOyBcblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEltcG9ydHNDb250cm9sbGVyOyIsIi8vTWVzaFBsYWluLmpzXG5mdW5jdGlvbiBNZXNoUGxhaW4oKXt9O1xuXG52YXIgZ2wgPSBudWxsO1xuXG52YXIgcCA9IE1lc2hQbGFpbi5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRleFNpemUsIGluZGV4U2l6ZSwgZHJhd1R5cGUpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblxuXHR0aGlzLnZlcnRleFNpemUgPSB2ZXJ0ZXhTaXplO1xuXHR0aGlzLmluZGV4U2l6ZSA9IGluZGV4U2l6ZTtcblx0dGhpcy5kcmF3VHlwZSA9IGRyYXdUeXBlO1xuXHR0aGlzLmV4dHJhQXR0cmlidXRlcyA9IFtdO1xuXHR0aGlzLm5CdWZmZXJQb3MgPSB1bmRlZmluZWQ7XG5cblx0dGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IHVuZGVmaW5lZDtcblxuXHR0aGlzLnRleHR1cmVVc2VkID0gZmFsc2U7XG59O1xuXG5wLmJ1ZmZlclZlcnRleCA9IGZ1bmN0aW9uKGFyeVZlcnRpY2VzKSB7XG5cdHZhciB2ZXJ0aWNlcyA9IFtdO1xuXG5cdC8vIGZvcih2YXIgaT0wOyBpPGFyeVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdC8vIFx0Zm9yKHZhciBqPTA7IGo8YXJ5VmVydGljZXNbaV0ubGVuZ3RoOyBqKyspIHZlcnRpY2VzLnB1c2goYXJ5VmVydGljZXNbaV1bal0pO1xuXHQvLyB9XG5cblx0aWYodGhpcy52QnVmZmVyUG9zID09IHVuZGVmaW5lZCApIHRoaXMudkJ1ZmZlclBvcyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmZmVyUG9zKTtcblxuXHQvLyBpZih0aGlzLl9mbG9hdEFycmF5VmVydGV4ID09IHVuZGVmaW5lZCkgdGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuXHQvLyBlbHNlIHtcblx0Ly8gXHRpZihhcnlWZXJ0aWNlcy5sZW5ndGggIT0gdGhpcy5fZmxvYXRBcnJheVZlcnRleC5sZW5ndGgpIHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcblx0Ly8gXHRlbHNlIHtcblx0Ly8gXHRcdGZvcih2YXIgaT0wO2k8YXJ5VmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0Ly8gXHRcdFx0dGhpcy5fZmxvYXRBcnJheVZlcnRleFtpXSA9IGFyeVZlcnRpY2VzW2ldO1xuXHQvLyBcdFx0fVxuXHQvLyBcdH1cblx0Ly8gfVxuXG5cdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBhcnlWZXJ0aWNlcywgZ2wuU1RBVElDX0RSQVcpO1xuXHR0aGlzLnZCdWZmZXJQb3MuaXRlbVNpemUgPSAzO1xufTtcblxucC5idWZmZXJOb3JtYWxzID0gZnVuY3Rpb24oYXJ5Tm9ybWFscykge1xuXHR2YXIgbm9ybWFscyA9IFtdO1xuXG5cdC8vIGZvcih2YXIgaT0wOyBpPGFyeVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdC8vIFx0Zm9yKHZhciBqPTA7IGo8YXJ5VmVydGljZXNbaV0ubGVuZ3RoOyBqKyspIHZlcnRpY2VzLnB1c2goYXJ5VmVydGljZXNbaV1bal0pO1xuXHQvLyB9XG5cblx0aWYodGhpcy5uQnVmZmVyUG9zID09IHVuZGVmaW5lZCApIHRoaXMubkJ1ZmZlclBvcyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5uQnVmZmVyUG9zKTtcblxuXHQvLyBpZih0aGlzLl9mbG9hdEFycmF5VmVydGV4ID09IHVuZGVmaW5lZCkgdGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuXHQvLyBlbHNlIHtcblx0Ly8gXHRpZihhcnlWZXJ0aWNlcy5sZW5ndGggIT0gdGhpcy5fZmxvYXRBcnJheVZlcnRleC5sZW5ndGgpIHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcblx0Ly8gXHRlbHNlIHtcblx0Ly8gXHRcdGZvcih2YXIgaT0wO2k8YXJ5VmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0Ly8gXHRcdFx0dGhpcy5fZmxvYXRBcnJheVZlcnRleFtpXSA9IGFyeVZlcnRpY2VzW2ldO1xuXHQvLyBcdFx0fVxuXHQvLyBcdH1cblx0Ly8gfVxuXG5cdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBhcnlOb3JtYWxzLCBnbC5TVEFUSUNfRFJBVyk7XG5cdHRoaXMubkJ1ZmZlclBvcy5pdGVtU2l6ZSA9IDM7XG59O1xuXG5cbnAuYnVmZmVyVGV4Q29vcmRzID0gZnVuY3Rpb24oYXJ5VGV4Q29vcmRzKSB7XG5cdHRoaXMudGV4dHVyZVVzZWQgPSB0cnVlO1xuXHQvLyB2YXIgY29vcmRzID0gW107XG5cblx0Ly8gZm9yKHZhciBpPTA7IGk8YXJ5VGV4Q29vcmRzLmxlbmd0aDsgaSsrKSB7XG5cdC8vIFx0Zm9yKHZhciBqPTA7IGo8YXJ5VGV4Q29vcmRzW2ldLmxlbmd0aDsgaisrKSBjb29yZHMucHVzaChhcnlUZXhDb29yZHNbaV1bal0pO1xuXHQvLyB9XG5cblx0dGhpcy52QnVmZmVyVVYgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudkJ1ZmZlclVWKTtcblx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGFyeVRleENvb3JkcywgZ2wuU1RBVElDX0RSQVcpO1xuXHR0aGlzLnZCdWZmZXJVVi5pdGVtU2l6ZSA9IDI7XG59O1xuXG5cbnAuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIGl0ZW1TaXplKSB7XG5cdHZhciBpbmRleCA9IC0xXG5cdGZvcih2YXIgaT0wOyBpPHRoaXMuZXh0cmFBdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYodGhpcy5leHRyYUF0dHJpYnV0ZXNbaV0ubmFtZSA9PSBuYW1lKSB7XG5cdFx0XHR0aGlzLmV4dHJhQXR0cmlidXRlc1tpXS5kYXRhID0gZGF0YTtcblx0XHRcdGluZGV4ID0gaTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdC8vIHZhciBidWZmZXJEYXRhID0gW107XG5cdC8vIGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcblx0Ly8gXHRmb3IodmFyIGo9MDsgajxkYXRhW2ldLmxlbmd0aDsgaisrKSBidWZmZXJEYXRhLnB1c2goZGF0YVtpXVtqXSk7XG5cdC8vIH1cblxuXHRpZihpbmRleCA9PSAtMSkge1xuXHRcdHZhciBidWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKTtcblx0XHR2YXIgZmxvYXRBcnJheSA9IGRhdGE7XG5cdFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGZsb2F0QXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcdFxuXHRcdHRoaXMuZXh0cmFBdHRyaWJ1dGVzLnB1c2goe25hbWU6bmFtZSwgZGF0YTpkYXRhLCBpdGVtU2l6ZTppdGVtU2l6ZSwgYnVmZmVyOmJ1ZmZlciwgZmxvYXRBcnJheTpmbG9hdEFycmF5fSk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGJ1ZmZlciA9IHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2luZGV4XS5idWZmZXI7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGJ1ZmZlcik7XG5cdFx0dmFyIGZsb2F0QXJyYXkgPSB0aGlzLmV4dHJhQXR0cmlidXRlc1tpbmRleF0uZmxvYXRBcnJheTtcblx0XHRmb3IodmFyIGk9MDtpPGJ1ZmZlckRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdGZsb2F0QXJyYXlbaV0gPSBidWZmZXJEYXRhW2ldO1xuXHRcdH1cblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZmxvYXRBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1x0XG5cdH1cblx0XG59O1xuXG5cbnAuYnVmZmVySW5kaWNlcyA9IGZ1bmN0aW9uKGFyeUluZGljZXMpIHtcblxuXHR0aGlzLmlCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5pQnVmZmVyKTtcblx0Z2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYXJ5SW5kaWNlcywgZ2wuU1RBVElDX0RSQVcpO1xuXHR0aGlzLmlCdWZmZXIuaXRlbVNpemUgPSAxO1xuXHR0aGlzLmlCdWZmZXIubnVtSXRlbXMgPSBhcnlJbmRpY2VzLmxlbmd0aDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzaFBsYWluOyIsIi8vU2NlbmVNYWluLmpzXG5cbnZhciBMb2FkZXJTY3JlZW4gPSByZXF1aXJlKCcuL3NjcmVlbnMvTG9hZGVyU2NyZWVuJyk7XG52YXIgRW5kU2NyZWVuID0gcmVxdWlyZSgnLi9zY3JlZW5zL0VuZFNjcmVlbicpO1xudmFyIFZpZXdXYWxscyA9IHJlcXVpcmUoJy4vdmlld3MvVmlld1dhbGxzJyk7XG52YXIgVmlld1Jvb2YgPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdSb29mJyk7XG52YXIgVmlld0Zsb29yID0gcmVxdWlyZSgnLi92aWV3cy9WaWV3Rmxvb3InKTtcbnZhciBWaWV3VmlkZW8gPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdWaWRlbycpO1xudmFyIFZpZXdQcmlzbSA9IHJlcXVpcmUoJy4vdmlld3MvVmlld1ByaXNtJyk7XG52YXIgVmlld0JsdXIgPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdCbHVyJyk7XG52YXIgVmlld0xhbXAgPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdMYW1wJyk7XG52YXIgVmlld0xlZnRXYWxsID0gcmVxdWlyZSgnLi92aWV3cy9WaWV3TGVmdFdhbGwnKTtcbnZhciBWaWV3UGxhaW4gPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdQbGFpbicpO1xudmFyIFZpZXdCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi92aWV3cy9WaWV3QmFja2dyb3VuZCcpO1xudmFyIFZpZXdMZWQgPSByZXF1aXJlKCcuL3ZpZXdzL1ZpZXdMZWQnKTtcbnZhciBWaWV3SW1wb3J0ID0gcmVxdWlyZSgnLi92aWV3cy9WaWV3SW1wb3J0Jyk7XG52YXIgU2NlbmUgPSByZXF1aXJlKCcuL2ZyYW1ld29yay9TY2VuZScpO1xudmFyIEtleWJvYXJkSW50ZXJhY3RvciA9IHJlcXVpcmUoJy4vaW50ZXJhY3Rpb24vS2V5Ym9hcmRJbnRlcmFjdG9yJyk7XG52YXIgTW91c2VJbnRlcmFjdG9yID0gcmVxdWlyZSgnLi9pbnRlcmFjdGlvbi9Nb3VzZUludGVyYWN0b3InKTtcbnZhciBTY2VuZVRyYW5zZm9ybXMgPSByZXF1aXJlKCcuL2ZyYW1ld29yay9TY2VuZVRyYW5zZm9ybXMnKTtcbnZhciBGcmFtZWJ1ZmZlciA9IHJlcXVpcmUoJy4vZnJhbWV3b3JrL0ZyYW1lYnVmZmVyJyk7XG52YXIgVGV4dHVyZSA9IHJlcXVpcmUoJy4vZnJhbWV3b3JrL1RleHR1cmUnKTtcbnZhciBBdWRpb1BsYXllciA9IHJlcXVpcmUoJy4vcGxheWVycy9BdWRpb1BsYXllcicpO1xudmFyIFZpZGVvUGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXJzL1ZpZGVvUGxheWVyJyk7XG52YXIgU3BlY3RydW1BbmFseXNlciA9IHJlcXVpcmUoJy4vZnJhbWV3b3JrL1NwZWN0cnVtQW5hbHl6ZXInKTtcbnZhciBDb2xsYWRhTG9hZGVyID0gcmVxdWlyZSgnLi9mcmFtZXdvcmsvQ29sbGFkYUxvYWRlcicpO1xudmFyIEltcG9ydEFuaW1hdGlvbiA9IHJlcXVpcmUoJy4vZnJhbWV3b3JrL0ltcG9ydEFuaW1hdGlvbicpO1xudmFyIEltcG9ydHNDb250cm9sbGVyID0gcmVxdWlyZSgnLi9JbXBvcnRzQ29udHJvbGxlcicpO1xuXG5cbmZ1bmN0aW9uIFNjZW5lTWFpbigpe307XG5cbnZhciBwID0gU2NlbmVNYWluLnByb3RvdHlwZSA9IG5ldyBTY2VuZSgpO1xudmFyIHMgPSBTY2VuZS5wcm90b3R5cGU7XG5cbnZhciBnbCA9IG51bGw7XG5cbnZhciBncmFkMyA9IFtbMCwxLDFdLFswLDEsLTFdLFswLC0xLDFdLFswLC0xLC0xXSxcbiAgICAgICAgICAgICAgICAgICBbMSwwLDFdLFsxLDAsLTFdLFstMSwwLDFdLFstMSwwLC0xXSxcbiAgICAgICAgICAgICAgICAgICBbMSwxLDBdLFsxLC0xLDBdLFstMSwxLDBdLFstMSwtMSwwXSwgLy8gMTIgY3ViZSBlZGdlc1xuICAgICAgICAgICAgICAgICAgIFsxLDAsLTFdLFstMSwwLC0xXSxbMCwtMSwxXSxbMCwxLDFdXTsgLy8gNCBtb3JlIHRvIG1ha2UgMTZcblxudmFyIHBlcm0gPSBbMTUxLDE2MCwxMzcsOTEsOTAsMTUsXG4gIDEzMSwxMywyMDEsOTUsOTYsNTMsMTk0LDIzMyw3LDIyNSwxNDAsMzYsMTAzLDMwLDY5LDE0Miw4LDk5LDM3LDI0MCwyMSwxMCwyMyxcbiAgMTkwLCA2LDE0OCwyNDcsMTIwLDIzNCw3NSwwLDI2LDE5Nyw2Miw5NCwyNTIsMjE5LDIwMywxMTcsMzUsMTEsMzIsNTcsMTc3LDMzLFxuICA4OCwyMzcsMTQ5LDU2LDg3LDE3NCwyMCwxMjUsMTM2LDE3MSwxNjgsIDY4LDE3NSw3NCwxNjUsNzEsMTM0LDEzOSw0OCwyNywxNjYsXG4gIDc3LDE0NiwxNTgsMjMxLDgzLDExMSwyMjksMTIyLDYwLDIxMSwxMzMsMjMwLDIyMCwxMDUsOTIsNDEsNTUsNDYsMjQ1LDQwLDI0NCxcbiAgMTAyLDE0Myw1NCwgNjUsMjUsNjMsMTYxLCAxLDIxNiw4MCw3MywyMDksNzYsMTMyLDE4NywyMDgsIDg5LDE4LDE2OSwyMDAsMTk2LFxuICAxMzUsMTMwLDExNiwxODgsMTU5LDg2LDE2NCwxMDAsMTA5LDE5OCwxNzMsMTg2LCAzLDY0LDUyLDIxNywyMjYsMjUwLDEyNCwxMjMsXG4gIDUsMjAyLDM4LDE0NywxMTgsMTI2LDI1NSw4Miw4NSwyMTIsMjA3LDIwNiw1OSwyMjcsNDcsMTYsNTgsMTcsMTgyLDE4OSwyOCw0MixcbiAgMjIzLDE4MywxNzAsMjEzLDExOSwyNDgsMTUyLCAyLDQ0LDE1NCwxNjMsIDcwLDIyMSwxNTMsMTAxLDE1NSwxNjcsIDQzLDE3Miw5LFxuICAxMjksMjIsMzksMjUzLCAxOSw5OCwxMDgsMTEwLDc5LDExMywyMjQsMjMyLDE3OCwxODUsIDExMiwxMDQsMjE4LDI0Niw5NywyMjgsXG4gIDI1MSwzNCwyNDIsMTkzLDIzOCwyMTAsMTQ0LDEyLDE5MSwxNzksMTYyLDI0MSwgODEsNTEsMTQ1LDIzNSwyNDksMTQsMjM5LDEwNyxcbiAgNDksMTkyLDIxNCwgMzEsMTgxLDE5OSwxMDYsMTU3LDE4NCwgODQsMjA0LDE3NiwxMTUsMTIxLDUwLDQ1LDEyNywgNCwxNTAsMjU0LFxuICAxMzgsMjM2LDIwNSw5MywyMjIsMTE0LDY3LDI5LDI0LDcyLDI0MywxNDEsMTI4LDE5NSw3OCw2NiwyMTUsNjEsMTU2LDE4MF07XG5cbnZhciBzaW1wbGV4NCA9IFtcbiAgWzAsNjQsMTI4LDE5Ml0sWzAsNjQsMTkyLDEyOF0sWzAsMCwwLDBdLFswLDEyOCwxOTIsNjRdLFxuICBbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxbNjQsMTI4LDE5MiwwXSxcbiAgWzAsMTI4LDY0LDE5Ml0sWzAsMCwwLDBdLFswLDE5Miw2NCwxMjhdLFswLDE5MiwxMjgsNjRdLFxuICBbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxbNjQsMTkyLDEyOCwwXSxcbiAgWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFxuICBbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sXG4gIFs2NCwxMjgsMCwxOTJdLFswLDAsMCwwXSxbNjQsMTkyLDAsMTI4XSxbMCwwLDAsMF0sXG4gIFswLDAsMCwwXSxbMCwwLDAsMF0sWzEyOCwxOTIsMCw2NF0sWzEyOCwxOTIsNjQsMF0sXG4gIFs2NCwwLDEyOCwxOTJdLFs2NCwwLDE5MiwxMjhdLFswLDAsMCwwXSxbMCwwLDAsMF0sXG4gIFswLDAsMCwwXSxbMTI4LDAsMTkyLDY0XSxbMCwwLDAsMF0sWzEyOCw2NCwxOTIsMF0sXG4gIFswLDAsMCwwXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxcbiAgWzAsMCwwLDBdLFswLDAsMCwwXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFxuICBbMTI4LDAsNjQsMTkyXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxcbiAgWzE5MiwwLDY0LDEyOF0sWzE5MiwwLDEyOCw2NF0sWzAsMCwwLDBdLFsxOTIsNjQsMTI4LDBdLFxuICBbMTI4LDY0LDAsMTkyXSxbMCwwLDAsMF0sWzAsMCwwLDBdLFswLDAsMCwwXSxcbiAgWzE5Miw2NCwwLDEyOF0sWzAsMCwwLDBdLFsxOTIsMTI4LDAsNjRdLFsxOTIsMTI4LDY0LDBdXG5dO1xuXG5wLmluaXQgPSBmdW5jdGlvbigpe1xuXG5cdHMuaW5pdC5jYWxsKHRoaXMpO1xuXG5cdHRoaXMubG9hZGVyU2NyZWVuID0gbmV3IExvYWRlclNjcmVlbigpO1xuXHR0aGlzLmxvYWRlclNjcmVlbi5pbml0KCk7XG5cdHRoaXMubG9hZGVyU2NyZWVuLnNob3coKTtcblx0Ly8gdGhpcy5sb2FkZXJTY3JlZW4uaGlkZSgpO1xuXG5cdHRoaXMuZW5kU2NyZWVuID0gbmV3IEVuZFNjcmVlbigpO1xuXHR0aGlzLmVuZFNjcmVlbi5pbml0KHRoaXMuX29uUmVwbGF5LCB0aGlzKTtcblx0Ly8gdGhpcy5lbmRTY3JlZW4uaGlkZSgpO1xuXG5cdHRoaXMub25SZXNpemUoKTtcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUuYmluZCh0aGlzKSk7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXG5cdHZhciBkZXJpdmF0aXZlID0gZ2wuZ2V0RXh0ZW5zaW9uKCdPRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnKTtcblxuXHRcblxuXHR0aGlzLmNhbWVyYS5zZXRQb3NpdGlvbihuZXcgQXJyYXkoMC4wLCA1LjAsIDExLjApKTtcbiAgICB0aGlzLmNhbWVyYS5zZXRMb29rQXRQb2ludCh2ZWMzLmZyb21WYWx1ZXMoMC4wLCA1LjAsIC0xLjApKTtcbiAgICAvLyB0aGlzLmNhbWVyYS55YXcoTWF0aC5QSSAqIC0xLjI1KTtcbiAgICAvLyB0aGlzLmNhbWVyYS5tb3ZlRm9yd2FyZCg0KTtcblxuICAgIC8vIGRlYnVnZ2VyO1xuICAgIHRoaXMubGVmdFdhbGxDYW1lcmEuc2V0UG9zaXRpb24obmV3IEFycmF5KDAuMCwgMTAuMCwgMC4wKSk7XG4gICAgdGhpcy5sZWZ0V2FsbENhbWVyYS5zZXRMb29rQXRQb2ludCh2ZWMzLmZyb21WYWx1ZXMoLTEuMCwgMTAuMCwgMC4wKSk7XG4gICAgLy8gdGhpcy5sZWZ0V2FsbENhbWVyYS55YXcoTWF0aC5QSSAqIC4yNSk7XG4gICAgdGhpcy5sZWZ0V2FsbENhbWVyYS5tb3ZlRm9yd2FyZCgtMTUuOCk7XG5cbiAgXG4gICAgdGhpcy5rZXlib2FyZEludGVyYWN0b3IgPSBuZXcgS2V5Ym9hcmRJbnRlcmFjdG9yKCk7XG4gICAgdGhpcy5rZXlib2FyZEludGVyYWN0b3IuaW5pdCh0aGlzLmNhbWVyYSwgdGhpcy5jYW52YXMpO1xuICAgIHRoaXMua2V5Ym9hcmRJbnRlcmFjdG9yLnNldHVwKCk7XG5cbiAgICB0aGlzLm1vdXNlSW50ZXJhY3RvciA9IG5ldyBNb3VzZUludGVyYWN0b3IoKTtcbiAgICB0aGlzLm1vdXNlSW50ZXJhY3Rvci5pbml0KHRoaXMuY2FtZXJhLCB0aGlzLmNhbnZhcyk7XG4gICAgdGhpcy5tb3VzZUludGVyYWN0b3Iuc2V0dXAoKTtcblxuXHR0aGlzLnRyYW5zZm9ybXMgPSBuZXcgU2NlbmVUcmFuc2Zvcm1zKCk7XG5cdHRoaXMudHJhbnNmb3Jtcy5pbml0KHRoaXMuY2FudmFzKTtcblxuXHR0aGlzLmxlZnRXYWxsVHJhbnNmb3JtcyA9IG5ldyBTY2VuZVRyYW5zZm9ybXMoKTtcblx0dGhpcy5sZWZ0V2FsbFRyYW5zZm9ybXMuaW5pdCh0aGlzLmNhbnZhcyk7XG5cblxuXHR0aGlzLm9ydGhvVHJhbnNmb3JtcyA9IG5ldyBTY2VuZVRyYW5zZm9ybXMoKTtcblx0dGhpcy5vcnRob1RyYW5zZm9ybXMuaW5pdCh0aGlzLmNhbnZhcyk7XG5cdFxuXG5cdHRoaXMuX2F1ZGlvQ3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuXG5cdFxuXHR0aGlzLnZpZGVvUGxheWVyID0gbmV3IFZpZGVvUGxheWVyKCk7XG5cdHRoaXMudmlkZW9QbGF5ZXIuaW5pdCh0aGlzLl9vbkFzc2V0c0xvYWRlZCwgdGhpcy5fb25WaWRlb0J1ZmZlcmluZywgdGhpcy5fb25WaWRlb1BsYXlpbmcsIHRoaXMuX29uVmlkZW9FbmRlZCwgdGhpcyk7XG5cdHRoaXMudmlkZW9QbGF5ZXIubG9hZCgnYXNzZXRzL3ZpZGVvTmV3Lm1wNCcpO1xuXG5cdHRoaXMuYXVkaW9QbGF5ZXIgPSBuZXcgQXVkaW9QbGF5ZXIoKTtcblx0dGhpcy5hdWRpb1BsYXllci5pbml0KHRoaXMuX2F1ZGlvQ3R4LCB0aGlzLl9vbkFzc2V0c0xvYWRlZCwgdGhpcyk7XG5cdHRoaXMuYXVkaW9QbGF5ZXIubG9hZCgnYXNzZXRzL29sZC5tcDMnKTtcblxuXHR0aGlzLnNwZWN0cnVtQW5hbHl6ZXIgPSBuZXcgU3BlY3RydW1BbmFseXNlcigpO1xuXHR0aGlzLnNwZWN0cnVtQW5hbHl6ZXIuaW5pdCh0aGlzLl9hdWRpb0N0eCk7XG5cblx0dGhpcy5faW5pdFZpZXdzKCk7XG5cdHRoaXMuY3JlYXRlTm9pc2VUZXh0dXJlKCk7XG5cblx0dGhpcy5fY29uY3JldGVUZXh0dXJlID0gbmV3IFRleHR1cmUoKTtcblx0dGhpcy5fY29uY3JldGVUZXh0dXJlLmluaXQod2luZG93Lk5TLkNvbmNyZXRlLCBmYWxzZSk7XG5cblx0dGhpcy5pbXBvcnRzTG9hZGVkID0gZmFsc2U7XG5cblx0dGhpcy5faW1wb3J0cyA9IFtdO1xuXHR0aGlzLnByaXNtSW1wb3J0ID0gbmV3IENvbGxhZGFMb2FkZXIoKTtcblx0dGhpcy5wcmlzbUltcG9ydC5sb2FkKFwic2VwYXJhdGUuZGFlXCIsICdwcmlzbScsIHRoaXMuX29uSW1wb3J0TG9hZGVkLCB0aGlzKTtcblx0dGhpcy5faW1wb3J0cy5wdXNoKHRoaXMucHJpc21JbXBvcnQpO1xuXG5cdHRoaXMuY2lyY2xlc0ltcG9ydCA9IG5ldyBDb2xsYWRhTG9hZGVyKCk7XG5cdHRoaXMuY2lyY2xlc0ltcG9ydC5sb2FkKFwid2lpMi5kYWVcIiwgJ2NpcmNsZXMnLCB0aGlzLl9vbkltcG9ydExvYWRlZCwgdGhpcyk7XG5cdHRoaXMuX2ltcG9ydHMucHVzaCh0aGlzLmNpcmNsZXNJbXBvcnQpO1xuXG5cdHRoaXMuYmFja2dyb3VuZExvYWRlckZhZGVyID0gMC4xO1xuXG5cdC8vIHRoaXMudGVzdEltcG9ydCA9IG5ldyBDb2xsYWRhTG9hZGVyKCk7XG5cdC8vIHRoaXMudGVzdEltcG9ydC5sb2FkKFwiLi4vLi4vaW1wb3J0cy9ib3h4LmRhZVwiLCAndGVzdCcsIHRoaXMuX29uSW1wb3J0TG9hZGVkLCB0aGlzKTtcblx0Ly8gdGhpcy5faW1wb3J0cy5wdXNoKHRoaXMudGVzdEltcG9ydCk7XG5cblxufTtcblxuXG5cbnAuY3JlYXRlTm9pc2VUZXh0dXJlID0gZnVuY3Rpb24oKXtcblxuXHQvLyBQRVJNIFRFWFRVUkVcblx0dmFyIHBpeGVscyA9IG5ldyBVaW50OEFycmF5KDI1NiAqIDI1NiAqIDQpO1xuXHRcblx0cGVybVRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHBlcm1UZXh0dXJlKTtcblxuXHRmb3IodmFyIGkgPSAwOyBpPDI1NjsgaSsrKXtcblx0XHRmb3IodmFyIGogPSAwOyBqPDI1NjsgaisrKSB7XG5cdFx0ICB2YXIgb2Zmc2V0ID0gKGkqMjU2K2opKjQ7XG5cdFx0ICB2YXIgdmFsdWUgPSBwZXJtWyhqK3Blcm1baV0pICYgMHhGRl07XG5cdFx0ICBwaXhlbHNbb2Zmc2V0XSA9IGdyYWQzW3ZhbHVlICYgMHgwRl1bMF0gKiA2NCArIDY0OyAgIC8vIEdyYWRpZW50IHhcblx0XHQgIHBpeGVsc1tvZmZzZXQrMV0gPSBncmFkM1t2YWx1ZSAmIDB4MEZdWzFdICogNjQgKyA2NDsgLy8gR3JhZGllbnQgeVxuXHRcdCAgcGl4ZWxzW29mZnNldCsyXSA9IGdyYWQzW3ZhbHVlICYgMHgwRl1bMl0gKiA2NCArIDY0OyAvLyBHcmFkaWVudCB6XG5cdFx0ICBwaXhlbHNbb2Zmc2V0KzNdID0gdmFsdWU7ICAgICAgICAgICAgICAgICAgICAgLy8gUGVybXV0ZWQgaW5kZXhcblx0XHR9XG5cdH1cblx0XG5cdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIDI1NiwgMjU2LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBwaXhlbHMgKTtcblx0Z2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5ORUFSRVNUICk7XG5cdGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTkVBUkVTVCApO1xuXG5cdHRoaXMuX3Blcm1UZXh0dXJlID0gbmV3IFRleHR1cmUoKTtcblx0dGhpcy5fcGVybVRleHR1cmUuaW5pdChwZXJtVGV4dHVyZSwgdHJ1ZSk7XG5cblxuXHQvLyBTSU1QTEVYIFRFWFRVUkVcblx0dmFyIHRlc3QgPSBuZXcgVWludDhBcnJheSg2NCAqIDEgKiA0KTtcblx0XG5cdHZhciBpbmRleCA9IDA7XG5cdGZvciAodmFyIGk9MDtpPHNpbXBsZXg0Lmxlbmd0aDtpKyspe1xuXHRcdGZvciAodmFyIGo9MDtqPHNpbXBsZXg0W2ldLmxlbmd0aDtqKyspe1xuXG5cdFx0XHR0ZXN0W2luZGV4XSA9IHNpbXBsZXg0W2ldW2pdO1xuXG5cdFx0XHRpbmRleCsrO1xuXHRcdH1cblx0fVxuXG5cdHNpbXBsZXhUZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBzaW1wbGV4VGV4dHVyZSk7XG5cblx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgNjQsIDEsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHRlc3QgKTtcblx0Z2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5ORUFSRVNUICk7XG5cdGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTkVBUkVTVCApO1xuXG5cdHRoaXMuX3NpbXBsZXhUZXh0dXJlID0gbmV3IFRleHR1cmUoKTtcblx0dGhpcy5fc2ltcGxleFRleHR1cmUuaW5pdChzaW1wbGV4VGV4dHVyZSwgdHJ1ZSk7XG59O1xuXG5wLl9vbkltcG9ydExvYWRlZCA9IGZ1bmN0aW9uKGxvYWRlZE9iail7XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0aWYgKGxvYWRlZE9iai50eXBlID09ICdwcmlzbScpe1xuXHRcdHRoaXMuX3ZQcmlzbS5jcmVhdGVNZXNoKGxvYWRlZE9iai5wYXJlbnREYXRhKTtcblx0XHR0aGlzLmJhY2tncm91bmRMb2FkZXJGYWRlciArPSAuMjtcblx0fWVsc2UgaWYgKGxvYWRlZE9iai50eXBlID09ICdjaXJjbGVzJyl7XG5cdFx0XG5cdFx0dGhpcy5fY2lyY2xlc0FuaW1hdGlvbiA9IG5ldyBJbXBvcnRBbmltYXRpb24oKTtcblx0XHR0aGlzLl9jaXJjbGVzQW5pbWF0aW9uLmluaXQobG9hZGVkT2JqLmFuaW1hdGlvbkRhdGFbMF0pO1xuXHRcdHRoaXMuX2NpcmNsZXNBbmltYXRpb24uc3RhcnRUaW1lID0gMTA7XG5cblx0XHR0aGlzLl9jaXJjbGVzQW5pbWF0aW9uLnZpZXdzW2xvYWRlZE9iai5wYXJlbnREYXRhWzBdLmlkXSA9IHRoaXMuX3ZDaXJjbGU7XG5cblx0XHR2YXIgY2hpbGRWaWV3cyA9IFtdO1xuXHRcdGZvciAodmFyIGk9MDtpPGxvYWRlZE9iai5wYXJlbnREYXRhWzBdLmNoaWxkcmVuLmxlbmd0aDtpKyspe1xuXG5cdFx0XHR2YXIgY2hpbGRWaWV3ID0gbmV3IFZpZXdJbXBvcnQoKTtcblx0XHRcdGNoaWxkVmlldy5pbml0KHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcblx0XHRcdGNoaWxkVmlldy5jcmVhdGVNZXNoKGxvYWRlZE9iai5wYXJlbnREYXRhWzBdLmNoaWxkcmVuW2ldKTtcblx0XHRcdGNoaWxkVmlldy50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXHRcdFx0Y2hpbGRWaWV3LmlkID0gbG9hZGVkT2JqLnBhcmVudERhdGFbMF0uY2hpbGRyZW5baV0uaWQ7XG5cdFx0XHRjaGlsZFZpZXdzLnB1c2goY2hpbGRWaWV3KTtcblx0XHRcdHRoaXMuX2NpcmNsZXNBbmltYXRpb24udmlld3NbbG9hZGVkT2JqLnBhcmVudERhdGFbMF0uY2hpbGRyZW5baV0uaWRdID0gY2hpbGRWaWV3O1xuXG5cdFx0fVxuXG5cdFx0dGhpcy5pbXBvcnRzQ29udHJvbGxlciA9IG5ldyBJbXBvcnRzQ29udHJvbGxlcigpO1xuXHRcdHRoaXMuaW1wb3J0c0NvbnRyb2xsZXIuaW5pdChbdGhpcy5fY2lyY2xlc0FuaW1hdGlvbl0pO1xuXG5cdFx0Ly8gZGVidWdnZXI7XG5cdFx0dGhpcy5fdkNpcmNsZS5pZCA9IGxvYWRlZE9iai5wYXJlbnREYXRhWzBdLmlkO1xuXHRcdHRoaXMuX3ZDaXJjbGUuYWRkU3ViVmlld3MoY2hpbGRWaWV3cyk7XG5cblx0XHR0aGlzLmJhY2tncm91bmRMb2FkZXJGYWRlciArPSAuMjtcblx0fWVsc2UgaWYgKGxvYWRlZE9iai50eXBlID09ICd0ZXN0Jyl7XG5cblx0XHQvLyB0aGlzLl92VGVzdEltcG9ydC5jcmVhdGVNZXNoKGxvYWRlZE9iai5wYXJlbnREYXRhWzBdKTtcblx0fVxufTtcblxuXG5wLl9vbkFzc2V0c0xvYWRlZCA9IGZ1bmN0aW9uKGUpe1xuXG5cdHRoaXMuYmFja2dyb3VuZExvYWRlckZhZGVyICs9IC4yO1xuXG5cdGNvbnNvbGUubG9nKCdhc3NldHMgbG9hZGVkJyk7XG5cblx0aWYgKCF0aGlzLmF1ZGlvUGxheWVyLmlzTG9hZGVkIHx8ICF0aGlzLnZpZGVvUGxheWVyLmlzTG9hZGVkKSByZXR1cm47XG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5faW1wb3J0cy5sZW5ndGg7aSsrKXtcblx0XHRpZiAoIXRoaXMuX2ltcG9ydHNbaV0uZGF0YUxvYWRlZCkgcmV0dXJuO1xuXHR9XG5cblx0dGhpcy5pbXBvcnRzTG9hZGVkID0gdHJ1ZTtcblx0XG5cdHRoaXMuX2luaXRUZXh0dXJlcygpO1xuXG5cdHRoaXMubG9hZGVyU2NyZWVuLmhpZGUoKTtcblx0XG59O1xuXG5wLl9vblZpZGVvQnVmZmVyaW5nID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLmF1ZGlvUGxheWVyLnBhdXNlKCk7XG5cdHRoaXMuc3BlY3RydW1BbmFseXplci5kaXNjb25uZWN0KHRoaXMuYXVkaW9QbGF5ZXIuZ2V0U291cmNlTm9kZSgpKTtcblx0dGhpcy5pbXBvcnRzQ29udHJvbGxlci5wYXVzZSgpO1xuXG59O1xuXG5wLl9vblZpZGVvUGxheWluZyA9IGZ1bmN0aW9uKCl7XG5cblxuXHR0aGlzLmF1ZGlvUGxheWVyLnBsYXkoKTtcblx0dGhpcy5zcGVjdHJ1bUFuYWx5emVyLmNvbm5lY3QodGhpcy5hdWRpb1BsYXllci5nZXRTb3VyY2VOb2RlKCkpO1xuXHR0aGlzLmltcG9ydHNDb250cm9sbGVyLnN0YXJ0KCk7XG59O1xuXG5wLl9vblZpZGVvRW5kZWQgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMuZW5kU2NyZWVuLnNob3coKTtcblx0dGhpcy5hdWRpb1BsYXllci5wYXVzZSgpO1xuXHR0aGlzLnNwZWN0cnVtQW5hbHl6ZXIuZGlzY29ubmVjdCh0aGlzLmF1ZGlvUGxheWVyLmdldFNvdXJjZU5vZGUoKSk7XG5cdHRoaXMuYXVkaW9QbGF5ZXIucmVzZXQoKTtcblx0dGhpcy52aWRlb1BsYXllci5yZXNldCgpO1xuXHR0aGlzLmltcG9ydHNDb250cm9sbGVyLnBhdXNlKCk7XG5cblx0dGhpcy5fdkNpcmNsZS5yZXNldEFuaW1hdGlvbigpO1xuXG59O1xuXG5wLl9vblJlcGxheSA9IGZ1bmN0aW9uKCl7XG5cblxuXHR0aGlzLnZpZGVvUGxheWVyLnBsYXkoKTtcblx0dGhpcy5lbmRTY3JlZW4uaGlkZSgpO1xuXG59O1xuXG5cblxucC5faW5pdFRleHR1cmVzID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCBcIkluaXQgVGV4dHVyZVwiICk7XG5cblx0dGhpcy5iYWNrZ3JvdW5kTG9hZGVyRmFkZXIgKz0gLjI7XG5cblx0dGhpcy5fdmlkZW9UZXh0dXJlID0gbmV3IFRleHR1cmUoKTtcblx0dGhpcy5fdmlkZW9UZXh0dXJlLmluaXQodGhpcy52aWRlb1BsYXllci52aWRlbywgZmFsc2UpO1xuXG5cdHRoaXMuZmJvU2l6ZSA9IHt9O1xuXHR0aGlzLmZib1NpemUudyA9IHdpbmRvdy5pbm5lcldpZHRoICogMjtcblx0dGhpcy5mYm9TaXplLmggPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAyO1xuXG5cdHRoaXMuZmJvU2l6ZUxlZCA9IHt9O1xuXHR0aGlzLmZib1NpemVMZWQudyA9IDI7XG5cdHRoaXMuZmJvU2l6ZUxlZC5oID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdHRoaXMuX2xlZnRXYWxsRkJPID0gbmV3IEZyYW1lYnVmZmVyKCk7XG5cdHRoaXMuX2xlZnRXYWxsRkJPLmluaXQodGhpcy5mYm9TaXplLncvMiwgdGhpcy5mYm9TaXplLmgvMiwgZ2wuTkVBUkVTVCwgZ2wuTkVBUkVTVCwgZ2wuVU5TSUdORURfQllURSk7XG5cblx0dGhpcy5fcHJpc21GQk8gPSBuZXcgRnJhbWVidWZmZXIoKTtcblx0dGhpcy5fcHJpc21GQk8uaW5pdCh0aGlzLmZib1NpemUudywgdGhpcy5mYm9TaXplLmgsIGdsLk5FQVJFU1QsIGdsLk5FQVJFU1QsIGdsLlVOU0lHTkVEX0JZVEUpO1xuXG5cdHRoaXMuX2xlZEZCTyA9IG5ldyBGcmFtZWJ1ZmZlcigpO1xuXHR0aGlzLl9sZWRGQk8uaW5pdCh0aGlzLmZib1NpemVMZWQudywgdGhpcy5mYm9TaXplTGVkLmgsIGdsLk5FQVJFU1QsIGdsLk5FQVJFU1QsIGdsLlVOU0lHTkVEX0JZVEUpO1xuXG5cdHRoaXMuX2JsdXJWRkJPID0gbmV3IEZyYW1lYnVmZmVyKCk7XG5cdHRoaXMuX2JsdXJWRkJPLmluaXQodGhpcy5mYm9TaXplTGVkLncsIHRoaXMuZmJvU2l6ZUxlZC5oLCBnbC5ORUFSRVNULCBnbC5ORUFSRVNULCBnbC5VTlNJR05FRF9CWVRFKTtcblxuXHR0aGlzLl9ibHVySEZCTyA9IG5ldyBGcmFtZWJ1ZmZlcigpO1xuXHR0aGlzLl9ibHVySEZCTy5pbml0KHRoaXMuZmJvU2l6ZUxlZC53LCB0aGlzLmZib1NpemVMZWQuaCwgZ2wuTkVBUkVTVCwgZ2wuTkVBUkVTVCwgZ2wuVU5TSUdORURfQllURSk7XG5cdFxuXHRcblxufTtcblxucC5faW5pdFZpZXdzID0gZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCBcIkluaXQgVmlld3NcIiApO1xuXG5cdHRoaXMuX3ZpZXdzID0gW107XG5cblx0dGhpcy5iYWNrZ3JvdW5kTG9hZGVyRmFkZXIgKz0gLjI7XG5cblx0dGhpcy5fdkJhY2tncm91bmQgPSBuZXcgVmlld0JhY2tncm91bmQoKTtcblx0dGhpcy5fdkJhY2tncm91bmQuaW5pdChcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMyBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0NCB1TVZNYXRyaXg7XFxudW5pZm9ybSBtYXQ0IHVQTWF0cml4O1xcbnVuaWZvcm0gZmxvYXQgYW5nbGVWZXJ0O1xcblxcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcbnZhcnlpbmcgdmVjMyB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuXFxuXFx0dmVjMyBuZXdQb3MgPSBhVmVydGV4UG9zaXRpb247XFxuXFx0bmV3UG9zLnh5ICo9IGFuZ2xlVmVydCoyLjA7XFxuXFxuICAgIGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG5cXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuICAgIHZWZXJ0ZXhQb3MgPSBhVmVydGV4UG9zaXRpb247XFxufVwiLCBcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxuLy9cXG4vLyBEZXNjcmlwdGlvbiA6IEFycmF5IGFuZCB0ZXh0dXJlbGVzcyBHTFNMIDJEIHNpbXBsZXggbm9pc2UgZnVuY3Rpb24uXFxuLy8gICAgICBBdXRob3IgOiBJYW4gTWNFd2FuLCBBc2hpbWEgQXJ0cy5cXG4vLyAgTWFpbnRhaW5lciA6IGlqbVxcbi8vICAgICBMYXN0bW9kIDogMjAxMTA4MjIgKGlqbSlcXG4vLyAgICAgTGljZW5zZSA6IENvcHlyaWdodCAoQykgMjAxMSBBc2hpbWEgQXJ0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cXG4vLyAgICAgICAgICAgICAgIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExJQ0VOU0UgZmlsZS5cXG4vLyAgICAgICAgICAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2hpbWEvd2ViZ2wtbm9pc2VcXG4vL1xcblxcbnZlYzMgbW9kMjg5XzFfMCh2ZWMzIHgpIHtcXG4gIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7XFxufVxcblxcbnZlYzIgbW9kMjg5XzFfMCh2ZWMyIHgpIHtcXG4gIHJldHVybiB4IC0gZmxvb3IoeCAqICgxLjAgLyAyODkuMCkpICogMjg5LjA7XFxufVxcblxcbnZlYzMgcGVybXV0ZV8xXzEodmVjMyB4KSB7XFxuICByZXR1cm4gbW9kMjg5XzFfMCgoKHgqMzQuMCkrMS4wKSp4KTtcXG59XFxuXFxuZmxvYXQgc25vaXNlXzFfMih2ZWMyIHYpXFxuICB7XFxuICBjb25zdCB2ZWM0IEMgPSB2ZWM0KDAuMjExMzI0ODY1NDA1MTg3LCAgLy8gKDMuMC1zcXJ0KDMuMCkpLzYuMFxcbiAgICAgICAgICAgICAgICAgICAgICAwLjM2NjAyNTQwMzc4NDQzOSwgIC8vIDAuNSooc3FydCgzLjApLTEuMClcXG4gICAgICAgICAgICAgICAgICAgICAtMC41NzczNTAyNjkxODk2MjYsICAvLyAtMS4wICsgMi4wICogQy54XFxuICAgICAgICAgICAgICAgICAgICAgIDAuMDI0MzkwMjQzOTAyNDM5KTsgLy8gMS4wIC8gNDEuMFxcbi8vIEZpcnN0IGNvcm5lclxcbiAgdmVjMiBpICA9IGZsb29yKHYgKyBkb3QodiwgQy55eSkgKTtcXG4gIHZlYzIgeDAgPSB2IC0gICBpICsgZG90KGksIEMueHgpO1xcblxcbi8vIE90aGVyIGNvcm5lcnNcXG4gIHZlYzIgaTE7XFxuICAvL2kxLnggPSBzdGVwKCB4MC55LCB4MC54ICk7IC8vIHgwLnggPiB4MC55ID8gMS4wIDogMC4wXFxuICAvL2kxLnkgPSAxLjAgLSBpMS54O1xcbiAgaTEgPSAoeDAueCA+IHgwLnkpID8gdmVjMigxLjAsIDAuMCkgOiB2ZWMyKDAuMCwgMS4wKTtcXG4gIC8vIHgwID0geDAgLSAwLjAgKyAwLjAgKiBDLnh4IDtcXG4gIC8vIHgxID0geDAgLSBpMSArIDEuMCAqIEMueHggO1xcbiAgLy8geDIgPSB4MCAtIDEuMCArIDIuMCAqIEMueHggO1xcbiAgdmVjNCB4MTIgPSB4MC54eXh5ICsgQy54eHp6O1xcbiAgeDEyLnh5IC09IGkxO1xcblxcbi8vIFBlcm11dGF0aW9uc1xcbiAgaSA9IG1vZDI4OV8xXzAoaSk7IC8vIEF2b2lkIHRydW5jYXRpb24gZWZmZWN0cyBpbiBwZXJtdXRhdGlvblxcbiAgdmVjMyBwID0gcGVybXV0ZV8xXzEoIHBlcm11dGVfMV8xKCBpLnkgKyB2ZWMzKDAuMCwgaTEueSwgMS4wICkpXFxuICAgICsgaS54ICsgdmVjMygwLjAsIGkxLngsIDEuMCApKTtcXG5cXG4gIHZlYzMgbSA9IG1heCgwLjUgLSB2ZWMzKGRvdCh4MCx4MCksIGRvdCh4MTIueHkseDEyLnh5KSwgZG90KHgxMi56dyx4MTIuencpKSwgMC4wKTtcXG4gIG0gPSBtKm0gO1xcbiAgbSA9IG0qbSA7XFxuXFxuLy8gR3JhZGllbnRzOiA0MSBwb2ludHMgdW5pZm9ybWx5IG92ZXIgYSBsaW5lLCBtYXBwZWQgb250byBhIGRpYW1vbmQuXFxuLy8gVGhlIHJpbmcgc2l6ZSAxNyoxNyA9IDI4OSBpcyBjbG9zZSB0byBhIG11bHRpcGxlIG9mIDQxICg0MSo3ID0gMjg3KVxcblxcbiAgdmVjMyB4ID0gMi4wICogZnJhY3QocCAqIEMud3d3KSAtIDEuMDtcXG4gIHZlYzMgaCA9IGFicyh4KSAtIDAuNTtcXG4gIHZlYzMgb3ggPSBmbG9vcih4ICsgMC41KTtcXG4gIHZlYzMgYTAgPSB4IC0gb3g7XFxuXFxuLy8gTm9ybWFsaXNlIGdyYWRpZW50cyBpbXBsaWNpdGx5IGJ5IHNjYWxpbmcgbVxcbi8vIEFwcHJveGltYXRpb24gb2Y6IG0gKj0gaW52ZXJzZXNxcnQoIGEwKmEwICsgaCpoICk7XFxuICBtICo9IDEuNzkyODQyOTE0MDAxNTkgLSAwLjg1MzczNDcyMDk1MzE0ICogKCBhMCphMCArIGgqaCApO1xcblxcbi8vIENvbXB1dGUgZmluYWwgbm9pc2UgdmFsdWUgYXQgUFxcbiAgdmVjMyBnO1xcbiAgZy54ICA9IGEwLnggICogeDAueCAgKyBoLnggICogeDAueTtcXG4gIGcueXogPSBhMC55eiAqIHgxMi54eiArIGgueXogKiB4MTIueXc7XFxuICByZXR1cm4gMTMwLjAgKiBkb3QobSwgZyk7XFxufVxcblxcblxcblxcbi8vIHZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbi8vIHVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyMDtcXG5cXG51bmlmb3JtIGZsb2F0IGFuZ2xlO1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHBlcm1UZXh0dXJlO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHNpbXBsZXhUZXh0dXJlO1xcbnVuaWZvcm0gc2FtcGxlcjJEIGZsb29yVGV4dHVyZTtcXG5cXG51bmlmb3JtIGZsb2F0IGZhZGVyVmFsO1xcblxcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcbnZhcnlpbmcgdmVjMyB2VGV4dHVyZUNvb3JkO1xcblxcbiNkZWZpbmUgUEkgMy4xNDE1OTI2NTM1ODk3OTNcXG4jZGVmaW5lIE9ORSAwLjAwMzkwNjI1XFxuI2RlZmluZSBPTkVIQUxGIDAuMDAxOTUzMTI1XFxuXFxuLypcXG4gKiAzRCBzaW1wbGV4IG5vaXNlLiBDb21wYXJhYmxlIGluIHNwZWVkIHRvIGNsYXNzaWMgbm9pc2UsIGJldHRlciBsb29raW5nLlxcbiAqL1xcbmZsb2F0IHNub2lzZSh2ZWMzIFApe1xcblxcblxcdC8vIFRoZSBza2V3aW5nIGFuZCB1bnNrZXdpbmcgZmFjdG9ycyBhcmUgbXVjaCBzaW1wbGVyIGZvciB0aGUgM0QgY2FzZVxcblxcdCNkZWZpbmUgRjMgMC4zMzMzMzMzMzMzMzNcXG5cXHQjZGVmaW5lIEczIDAuMTY2NjY2NjY2NjY3XFxuXFxuICAvLyBTa2V3IHRoZSAoeCx5LHopIHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBjZWxsIG9mIDYgc2ltcGxpY2VzIHdlJ3JlIGluXFxuXFx0ZmxvYXQgcyA9IChQLnggKyBQLnkgKyBQLnopICogRjM7IC8vIEZhY3RvciBmb3IgM0Qgc2tld2luZ1xcblxcdHZlYzMgUGkgPSBmbG9vcihQICsgcyk7XFxuXFx0ZmxvYXQgdCA9IChQaS54ICsgUGkueSArIFBpLnopICogRzM7XFxuXFx0dmVjMyBQMCA9IFBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcXG5cXHRQaSA9IFBpICogT05FICsgT05FSEFMRjsgLy8gSW50ZWdlciBwYXJ0LCBzY2FsZWQgYW5kIG9mZnNldCBmb3IgdGV4dHVyZSBsb29rdXBcXG5cXG5cXHR2ZWMzIFBmMCA9IFAgLSBQMDsgIC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXFxuXFxuICAvLyAvLyBGb3IgdGhlIDNEIGNhc2UsIHRoZSBzaW1wbGV4IHNoYXBlIGlzIGEgc2xpZ2h0bHkgaXJyZWd1bGFyIHRldHJhaGVkcm9uLlxcbiAgLy8gLy8gVG8gZmluZCBvdXQgd2hpY2ggb2YgdGhlIHNpeCBwb3NzaWJsZSB0ZXRyYWhlZHJhIHdlJ3JlIGluLCB3ZSBuZWVkIHRvXFxuICAvLyAvLyBkZXRlcm1pbmUgdGhlIG1hZ25pdHVkZSBvcmRlcmluZyBvZiB4LCB5IGFuZCB6IGNvbXBvbmVudHMgb2YgUGYwLlxcbiAgLy8gLy8gVGhlIG1ldGhvZCBiZWxvdyBpcyBleHBsYWluZWQgYnJpZWZseSBpbiB0aGUgQyBjb2RlLiBJdCB1c2VzIGEgc21hbGxcXG4gIC8vIC8vIDFEIHRleHR1cmUgYXMgYSBsb29rdXAgdGFibGUuIFRoZSB0YWJsZSBpcyBkZXNpZ25lZCB0byB3b3JrIGZvciBib3RoXFxuICAvLyAvLyAzRCBhbmQgNEQgbm9pc2UsIHNvIG9ubHkgOCAob25seSA2LCBhY3R1YWxseSkgb2YgdGhlIDY0IGluZGljZXMgYXJlXFxuICAvLyAvLyB1c2VkIGhlcmUuXFxuXFx0ZmxvYXQgYzEgPSAoUGYwLnggPiBQZjAueSkgPyAwLjUwNzgxMjUgOiAwLjAwNzgxMjU7IC8vIDEvMiArIDEvMTI4XFxuXFx0ZmxvYXQgYzIgPSAoUGYwLnggPiBQZjAueikgPyAwLjI1IDogMC4wO1xcblxcdGZsb2F0IGMzID0gKFBmMC55ID4gUGYwLnopID8gMC4xMjUgOiAwLjA7XFxuXFx0ZmxvYXQgc2luZGV4ID0gYzEgKyBjMiArIGMzO1xcbiBcXHR2ZWMzIG9mZnNldHMgPSB0ZXh0dXJlMkQoc2ltcGxleFRleHR1cmUsIHZlYzIoc2luZGV4LCAwKSkucmdiO1xcblxcdHZlYzMgbzEgPSBzdGVwKDAuMzc1LCBvZmZzZXRzKTtcXG5cXHR2ZWMzIG8yID0gc3RlcCgwLjEyNSwgb2Zmc2V0cyk7XFxuXFxuICAvLyBOb2lzZSBjb250cmlidXRpb24gZnJvbSBzaW1wbGV4IG9yaWdpblxcbiAgZmxvYXQgcGVybTAgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIFBpLnh5KS5hO1xcbiAgdmVjMyAgZ3JhZDAgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIHZlYzIocGVybTAsIFBpLnopKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICBmbG9hdCB0MCA9IDAuNiAtIGRvdChQZjAsIFBmMCk7XFxuICBmbG9hdCBuMDtcXG4gIGlmICh0MCA8IDAuMCkgbjAgPSAwLjA7XFxuICBlbHNlIHtcXG4gICAgdDAgKj0gdDA7XFxuICAgIG4wID0gdDAgKiB0MCAqIGRvdChncmFkMCwgUGYwKTtcXG4gIH1cXG5cXG4gIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbiBmcm9tIHNlY29uZCBjb3JuZXJcXG4gIHZlYzMgUGYxID0gUGYwIC0gbzEgKyBHMztcXG4gIGZsb2F0IHBlcm0xID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCBQaS54eSArIG8xLnh5Kk9ORSkuYTtcXG4gIHZlYzMgIGdyYWQxID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCB2ZWMyKHBlcm0xLCBQaS56ICsgbzEueipPTkUpKS5yZ2IgKiA0LjAgLSAxLjA7XFxuICBmbG9hdCB0MSA9IDAuNiAtIGRvdChQZjEsIFBmMSk7XFxuICBmbG9hdCBuMTtcXG4gIGlmICh0MSA8IDAuMCkgbjEgPSAwLjA7XFxuICBlbHNlIHtcXG4gICAgdDEgKj0gdDE7XFxuICAgIG4xID0gdDEgKiB0MSAqIGRvdChncmFkMSwgUGYxKTtcXG4gIH1cXG4gIFxcbiAgLy8gTm9pc2UgY29udHJpYnV0aW9uIGZyb20gdGhpcmQgY29ybmVyXFxuICB2ZWMzIFBmMiA9IFBmMCAtIG8yICsgMi4wICogRzM7XFxuICBmbG9hdCBwZXJtMiA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgUGkueHkgKyBvMi54eSpPTkUpLmE7XFxuICB2ZWMzICBncmFkMiA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgdmVjMihwZXJtMiwgUGkueiArIG8yLnoqT05FKSkucmdiICogNC4wIC0gMS4wO1xcbiAgZmxvYXQgdDIgPSAwLjYgLSBkb3QoUGYyLCBQZjIpO1xcbiAgZmxvYXQgbjI7XFxuICBpZiAodDIgPCAwLjApIG4yID0gMC4wO1xcbiAgZWxzZSB7XFxuICAgIHQyICo9IHQyO1xcbiAgICBuMiA9IHQyICogdDIgKiBkb3QoZ3JhZDIsIFBmMik7XFxuICB9XFxuICBcXG4gIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbiBmcm9tIGxhc3QgY29ybmVyXFxuICB2ZWMzIFBmMyA9IFBmMCAtIHZlYzMoMS4wLTMuMCpHMyk7XFxuICBmbG9hdCBwZXJtMyA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgUGkueHkgKyB2ZWMyKE9ORSwgT05FKSkuYTtcXG4gIHZlYzMgIGdyYWQzID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCB2ZWMyKHBlcm0zLCBQaS56ICsgT05FKSkucmdiICogNC4wIC0gMS4wO1xcbiAgZmxvYXQgdDMgPSAwLjYgLSBkb3QoUGYzLCBQZjMpO1xcbiAgZmxvYXQgbjM7XFxuICBpZih0MyA8IDAuMCkgbjMgPSAwLjA7XFxuICBlbHNlIHtcXG4gICAgdDMgKj0gdDM7XFxuICAgIG4zID0gdDMgKiB0MyAqIGRvdChncmFkMywgUGYzKTtcXG4gIH1cXG5cXG4gIC8vIFN1bSB1cCBhbmQgc2NhbGUgdGhlIHJlc3VsdCB0byBjb3ZlciB0aGUgcmFuZ2UgWy0xLDFdXFxuICByZXR1cm4gMzIuMCAqIChuMCArIG4xICsgbjIgKyBuMyk7XFxufVxcblxcblxcbmZsb2F0IHB1bHNlKGZsb2F0IHRpbWUpIHtcXG4gICAgLy8gY29uc3QgZmxvYXQgcGkgPSAzLjE0O1xcbiAgICBmbG9hdCBmcmVxdWVuY3kgPSAxLjA7XFxuICAgIHJldHVybiAwLjUqKDEuMCtzaW4oMi4wICogUEkgKiBmcmVxdWVuY3kgKiB0aW1lKSk7XFxufVxcblxcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlcjAsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTtcXG5cXG4gICAgdmVjMyBmbG9vckNvbG9yID0gdGV4dHVyZTJEKGZsb29yVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpLnJnYjtcXG5cXG4gICAgZmxvYXQgdmVydGV4TXVsdGlwbGllciA9IDIuMCAvIGFuZ2xlO1xcblxcbiAgICAvLyBmbG9hdCBicmlnaHRuZXNzID0gc25vaXNlXzFfMihmbG9vckNvbG9yLnJiLygoYW5nbGUrLjQpKjEuMikpO1xcblxcbiAgICBmbG9hdCBuID0gc25vaXNlKCAoZmxvb3JDb2xvci5yZ2IvKChhbmdsZSsuMDUpKjIuMikpICk7XFxuXFx0Ly8gZmxvYXQgbiA9IHNub2lzZSh2ZWMzKHZlcnRleE11bHRpcGxpZXIgKiB2VmVydGV4UG9zICogKChhbmdsZS9mYWRlclZhbCkgKjEuMCApICkpO1xcbiAgLy8gZmxvYXQgbiA9IHNub2lzZSgodlZlcnRleFBvcy9hbmdsZSkgKiBzaW4odmVydGV4TXVsdGlwbGllciAqIFBJKSk7XFxuXFxuXFx0Ly8gbiA9IHNub2lzZSh2ZWMzKHZlcnRleE11bHRpcGxpZXIgKiB2VmVydGV4UG9zICogKGF1ZGlvTGV2ZWxIaWdoL2F1ZGlvTGV2ZWxOb2lzZURpdmlkZXIpICkpO1xcblxcbiAgICBcXG5cXG4gICAgdmVjMyBmaW5hbENvbG9yID0gbWl4KHZlYzMobiksZmxvb3JDb2xvciwxLjAgLSBmYWRlclZhbCk7XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHZlYzQoZmxvb3JDb2xvciwxLjApO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGZpbmFsQ29sb3IsIDEuMCk7XFxufVwiKTtcblx0dGhpcy5fdkJhY2tncm91bmQudHJhbnNmb3JtcyA9IHRoaXMub3J0aG9UcmFuc2Zvcm1zO1xuXG5cdHRoaXMuX3ZDb3B5ID0gbmV3IFZpZXdQbGFpbigpO1xuXHR0aGlzLl92Q29weS5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG51bmlmb3JtIHNhbXBsZXIyRCB1U2FtcGxlcjA7XFxuXFxudW5pZm9ybSBmbG9hdCBmYm9XO1xcbnVuaWZvcm0gZmxvYXQgZmJvSDtcXG5cXG51bmlmb3JtIGZsb2F0IHdpblc7XFxudW5pZm9ybSBmbG9hdCB3aW5IO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuXFxuXFx0ZmxvYXQgc2NhbGVXID0gZmJvVyAvIHdpblc7XFxuXFx0ZmxvYXQgc2NhbGVIID0gZmJvSCAvIHdpbkg7XFxuXFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlcjAsIHZlYzIodlRleHR1cmVDb29yZC5zL3NjYWxlVywgdlRleHR1cmVDb29yZC50L3NjYWxlSCkpO1xcbiAgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodVNhbXBsZXIwLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSk7XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDAuMCwgMS4wKTtcXG59XCIpO1xuXHR0aGlzLl92Q29weS50cmFuc2Zvcm1zID0gdGhpcy5vcnRob1RyYW5zZm9ybXM7XG5cblx0dGhpcy5fdkJsdXJWZXJ0ID0gbmV3IFZpZXdCbHVyKCk7XG5cdHRoaXMuX3ZCbHVyVmVydC5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCBzY2VuZVRleHR1cmU7XFxudW5pZm9ybSBmbG9hdCBydF93O1xcbnVuaWZvcm0gZmxvYXQgcnRfaDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdmVydGV4UG9zO1xcbmZsb2F0IG9mZnNldFszXTtcXG5cXG5cXG5mbG9hdCB3ZWlnaHRbM107XFxuXFxuXFxuLy8gZmxvYXQgb2Zmc2V0WzNdID0gZmxvYXRbXSggMC4wLCAxLjM4NDYxNTM4NDYsIDMuMjMwNzY5MjMwOCApO1xcbi8vIGZsb2F0IHdlaWdodFszXSA9IGZsb2F0W10oIDAuMjI3MDI3MDI3MCwgMC4zMTYyMTYyMTYyLCAwLjA3MDI3MDI3MDMgKTtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcdG9mZnNldFswXSA9IDAuMDtcXG5cXHRvZmZzZXRbMV0gPSAxLjM4NDYxNTM4NDY7XFxuXFx0b2Zmc2V0WzJdID0gMy4yMzA3NjkyMzA4O1xcblxcblxcdHdlaWdodFswXSA9IDAuMjI3MDI3MDI3MDtcXG5cXHR3ZWlnaHRbMV0gPSAwLjMxNjIxNjIxNjI7XFxuXFx0d2VpZ2h0WzJdID0gMC4wNzAyNzAyNzAzO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQoc2NlbmVUZXh0dXJlLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSk7XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTtcXG5cXG4gICAgdmVjMyB0YyA9IHZlYzMoMS4wLCAwLjAsIDAuMCk7XFxuXFx0aWYgKHZUZXh0dXJlQ29vcmQueDwoMC41LTAuMDEpKVxcblxcdHtcXG5cXHR2ZWMyIHV2ID0gdlRleHR1cmVDb29yZC54eTtcXG5cXHR0YyA9IHRleHR1cmUyRChzY2VuZVRleHR1cmUsIHV2KS5yZ2IgKiB3ZWlnaHRbMF07XFxuXFx0Zm9yIChpbnQgaT0xOyBpPDM7IGkrKykgXFxuXFx0e1xcblxcdCAgdGMgKz0gdGV4dHVyZTJEKHNjZW5lVGV4dHVyZSwgdXYgKyB2ZWMyKDAuMCwgb2Zmc2V0W2ldKS9ydF9oKS5yZ2IgKiB3ZWlnaHRbaV07XFxuXFx0ICB0YyArPSB0ZXh0dXJlMkQoc2NlbmVUZXh0dXJlLCB1diAtIHZlYzIoMC4wLCBvZmZzZXRbaV0pL3J0X2gpLnJnYiAqIHdlaWdodFtpXTtcXG5cXHR9XFxuXFx0fVxcblxcdGVsc2UgaWYgKHZUZXh0dXJlQ29vcmQueD49KDAuNSswLjAxKSlcXG5cXHR7XFxuXFx0XFx0dGMgPSB0ZXh0dXJlMkQoc2NlbmVUZXh0dXJlLCB2VGV4dHVyZUNvb3JkLnh5KS5yZ2I7XFxuXFx0fVxcblxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodGMsIDEuMCk7XFxuXFxuXFxufVwiKTtcblx0dGhpcy5fdkJsdXJWZXJ0LnRyYW5zZm9ybXMgPSB0aGlzLm9ydGhvVHJhbnNmb3JtcztcblxuXHR0aGlzLl92Qmx1ckhvcml6ID0gbmV3IFZpZXdCbHVyKCk7XG5cdHRoaXMuX3ZCbHVySG9yaXouaW5pdChcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0NCB1TVZNYXRyaXg7XFxudW5pZm9ybSBtYXQ0IHVQTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLCBcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgc2NlbmVUZXh0dXJlO1xcbnVuaWZvcm0gZmxvYXQgcnRfdztcXG51bmlmb3JtIGZsb2F0IHJ0X2g7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZlcnRleFBvcztcXG5mbG9hdCBvZmZzZXRbM107XFxuXFxuXFxuZmxvYXQgd2VpZ2h0WzNdO1xcblxcblxcbi8vIGZsb2F0IG9mZnNldFszXSA9IGZsb2F0W10oIDAuMCwgMS4zODQ2MTUzODQ2LCAzLjIzMDc2OTIzMDggKTtcXG4vLyBmbG9hdCB3ZWlnaHRbM10gPSBmbG9hdFtdKCAwLjIyNzAyNzAyNzAsIDAuMzE2MjE2MjE2MiwgMC4wNzAyNzAyNzAzICk7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXHRvZmZzZXRbMF0gPSAwLjA7XFxuXFx0b2Zmc2V0WzFdID0gMS4zODQ2MTUzODQ2O1xcblxcdG9mZnNldFsyXSA9IDMuMjMwNzY5MjMwODtcXG5cXG5cXHR3ZWlnaHRbMF0gPSAwLjIyNzAyNzAyNzA7XFxuXFx0d2VpZ2h0WzFdID0gMC4zMTYyMTYyMTYyO1xcblxcdHdlaWdodFsyXSA9IDAuMDcwMjcwMjcwMztcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHNjZW5lVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDEuMCk7XFxuXFxuICAgIHZlYzMgdGMgPSB2ZWMzKDEuMCwgMC4wLCAwLjApO1xcblxcdGlmICh2VGV4dHVyZUNvb3JkLng8KDAuNS0wLjAxKSlcXG5cXHR7XFxuXFx0dmVjMiB1diA9IHZUZXh0dXJlQ29vcmQueHk7XFxuXFx0dGMgPSB0ZXh0dXJlMkQoc2NlbmVUZXh0dXJlLCB1dikucmdiICogd2VpZ2h0WzBdO1xcblxcdGZvciAoaW50IGk9MTsgaTwzOyBpKyspIFxcblxcdHtcXG5cXHQgIHRjICs9IHRleHR1cmUyRChzY2VuZVRleHR1cmUsIHV2ICsgdmVjMigwLjAsIG9mZnNldFtpXSkvcnRfdykucmdiICogd2VpZ2h0W2ldO1xcblxcdCAgdGMgKz0gdGV4dHVyZTJEKHNjZW5lVGV4dHVyZSwgdXYgLSB2ZWMyKDAuMCwgb2Zmc2V0W2ldKS9ydF93KS5yZ2IgKiB3ZWlnaHRbaV07XFxuXFx0fVxcblxcdH1cXG5cXHRlbHNlIGlmICh2VGV4dHVyZUNvb3JkLng+PSgwLjUrMC4wMSkpXFxuXFx0e1xcblxcdFxcdHRjID0gdGV4dHVyZTJEKHNjZW5lVGV4dHVyZSwgdlRleHR1cmVDb29yZC54eSkucmdiO1xcblxcdH1cXG5cXHRnbF9GcmFnQ29sb3IgPSB2ZWM0KHRjLCAxLjApO1xcblxcblxcbn1cIik7XG5cdHRoaXMuX3ZCbHVySG9yaXoudHJhbnNmb3JtcyA9IHRoaXMub3J0aG9UcmFuc2Zvcm1zO1xuXG5cdHRoaXMuX3ZXYWxscyA9IG5ldyBWaWV3V2FsbHMoKTtcblx0dGhpcy5fdldhbGxzLmluaXQoXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG5cXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcdHZlYzQgbXZQb3NpdGlvbiA9IHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogbXZQb3NpdGlvbjtcXG4gIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG5cXG4gICAgdlZlcnRleFBvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gIFxcblxcblxcblxcblxcbn1cIiwgXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB2aWRlb1RleHR1cmU7XFxuXFxuXFxudW5pZm9ybSBmbG9hdCBmYm9XO1xcbnVuaWZvcm0gZmxvYXQgZmJvSDtcXG5cXG51bmlmb3JtIGZsb2F0IHdpblc7XFxudW5pZm9ybSBmbG9hdCB3aW5IO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbi8vbm90IHVzZWRcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG5cXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBcXG4gICAgXFxuICAvLyB2ZWMzIGZpbmFsQ29sb3IgPSB2ZWMzKC41LCAuNSwgLjUpO1xcblxcbiAgZmxvYXQgc2NhbGVXID0gZmJvVyAvIHdpblc7XFxuICBmbG9hdCBzY2FsZUggPSBmYm9IIC8gd2luSDtcXG4gICBcXG4gIC8vd2FsbHNcXG4gIHZlYzQgdmlkZW9Db2xvciA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIodlRleHR1cmVDb29yZC5zL3NjYWxlVywgdlRleHR1cmVDb29yZC50L3NjYWxlSCkpO1xcbiAgLy8gZmluYWxDb2xvciA9IHZpZGVvQ29sb3IucmdiO1xcbiAgICBcXG4gICAgXFxuXFxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZpZGVvQ29sb3IpO1xcbiAgIFxcbn1cIik7XG5cdHRoaXMuX3ZXYWxscy50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXHRcblx0dGhpcy5fdlJvb2YgPSBuZXcgVmlld1Jvb2YoKTtcblx0dGhpcy5fdlJvb2YuaW5pdChcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0NCB1TVZNYXRyaXg7XFxudW5pZm9ybSBtYXQ0IHVQTWF0cml4O1xcblxcblxcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcblxcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuXFx0dmVjNCBtdlBvc2l0aW9uID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuICAgIGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiBtdlBvc2l0aW9uO1xcbiAgXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcblxcbiAgICB2VmVydGV4UG9zID0gYVZlcnRleFBvc2l0aW9uO1xcbiAgXFxuXFxuXFxuXFxuXFxufVwiLCBcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcblxcbnVuaWZvcm0gc2FtcGxlcjJEIHZpZGVvVGV4dHVyZTtcXG51bmlmb3JtIHNhbXBsZXIyRCBjb25jcmV0ZVRleHR1cmU7XFxuXFxudW5pZm9ybSBmbG9hdCBhdWRpb0xldmVsRGVlcDtcXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxIaWdoO1xcblxcbnVuaWZvcm0gZmxvYXQgZmJvVztcXG51bmlmb3JtIGZsb2F0IGZib0g7XFxuXFxudW5pZm9ybSBmbG9hdCB3aW5XO1xcbnVuaWZvcm0gZmxvYXQgd2luSDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgICBcXG4gICAgdmVjMyBmaW5hbENvbG9yID0gdmVjMygwLjUsIDAuNSwgMC41KTtcXG4gICAgZmxvYXQgYWxwaGEgPSAxLjA7XFxuICAgIGZsb2F0IHJlZmxMaW1pdCA9IC4wMjtcXG5cXG4gICAgZmxvYXQgc2NhbGVXID0gZmJvVyAvIHdpblc7XFxuICAgIGZsb2F0IHNjYWxlSCA9IGZib0ggLyB3aW5IO1xcblxcbiAgICB2ZWM0IGNvbmNyZXRlQ29sb3IgPSB0ZXh0dXJlMkQoY29uY3JldGVUZXh0dXJlLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSk7XFxuXFxuICAgIHZlYzIgY29vcmRzID0gdlRleHR1cmVDb29yZDtcXG4gICAgY29vcmRzLnMgPSBjb29yZHMucy9zY2FsZVc7XFxuICAgIGNvb3Jkcy50ID0gY29vcmRzLnQvc2NhbGVIO1xcblxcbiAgICBmbG9hdCBtYXhTID0gMS4wIC8gc2NhbGVXO1xcbiAgICBmbG9hdCBtYXhUID0gMS4wIC8gc2NhbGVIO1xcblxcbiAgIFxcbiAgICBmbG9hdCByZWZsTGltaXRTID0gbWF4UyAtIHJlZmxMaW1pdDtcXG4gICAgZmxvYXQgcmVmbExpbWl0VCA9IG1heFQgLSByZWZsTGltaXQ7XFxuXFxuICAgIHZlYzQgdmlkZW9Db2xvclJpZ2h0ID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMihtYXhTIC0gY29vcmRzLnMsIGNvb3Jkcy50KSk7XFxuICAgIHZlYzQgdmlkZW9Db2xvckJhY2sgPSB0ZXh0dXJlMkQodmlkZW9UZXh0dXJlLCB2ZWMyKGNvb3Jkcy50LCBjb29yZHMucykpO1xcbiAgICB2ZWM0IHZpZGVvQ29sb3JMZWZ0ID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMihtYXhTIC0gY29vcmRzLnMsIG1heFQgLSBjb29yZHMudCkpO1xcbiAgICB2ZWM0IHZpZGVvQ29sb3JGcm9udCA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIoY29vcmRzLnQsIG1heFMgLSBjb29yZHMucykpO1xcblxcbiAgICB2ZWMzIHJlZmxGcm9udCA9IHNtb290aHN0ZXAocmVmbExpbWl0UywgbWF4UywgbWF4UyAtIGNvb3Jkcy5zKSAqIHZpZGVvQ29sb3JGcm9udC5yZ2I7XFxuICAgIHZlYzMgcmVmbExlZnQgPSBzbW9vdGhzdGVwKHJlZmxMaW1pdFQsIG1heFQsIG1heFQgLSBjb29yZHMudCkgKiB2aWRlb0NvbG9yTGVmdC5yZ2I7XFxuICAgIHZlYzMgcmVmbFJpZ2h0ID0gc21vb3Roc3RlcChyZWZsTGltaXRULCBtYXhULCBjb29yZHMudCkgKiB2aWRlb0NvbG9yUmlnaHQucmdiO1xcbiAgICB2ZWMzIHJlZmxCYWNrID0gc21vb3Roc3RlcChyZWZsTGltaXRTLCBtYXhTLCBjb29yZHMucykgKiB2aWRlb0NvbG9yQmFjay5yZ2I7XFxuXFxuICAgIGZpbmFsQ29sb3IgPSAoY29uY3JldGVDb2xvci5yZ2IgKiAodmVjMyguNSwgLjUsIC41KSAqIGF1ZGlvTGV2ZWxEZWVwKSkgKyAocmVmbEZyb250ICsgcmVmbExlZnQgKyByZWZsUmlnaHQgKyByZWZsQmFjayk7XFxuXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZmluYWxDb2xvciwgYWxwaGEpO1xcbiAgIFxcbn1cIik7XG5cdHRoaXMuX3ZSb29mLnRyYW5zZm9ybXMgPSB0aGlzLnRyYW5zZm9ybXM7XG5cdFxuXHR0aGlzLl92Rmxvb3IgPSBuZXcgVmlld0Zsb29yKCk7XG5cdHRoaXMuX3ZGbG9vci5pbml0KFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleFBvc2l0aW9uO1xcbmF0dHJpYnV0ZSB2ZWMyIGFUZXh0dXJlQ29vcmQ7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxuXFxuXFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXHR2ZWM0IG12UG9zaXRpb24gPSB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIG12UG9zaXRpb247XFxuICBcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuXFxuICAgIHZWZXJ0ZXhQb3MgPSBhVmVydGV4UG9zaXRpb247XFxuICBcXG5cXG5cXG5cXG5cXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gaGlnaHAgZmxvYXQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdmlkZW9UZXh0dXJlO1xcbnVuaWZvcm0gc2FtcGxlcjJEIGNvbmNyZXRlVGV4dHVyZTtcXG5cXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxEZWVwO1xcbnVuaWZvcm0gZmxvYXQgYXVkaW9MZXZlbEhpZ2g7XFxuXFxudW5pZm9ybSBmbG9hdCBmYm9XO1xcbnVuaWZvcm0gZmxvYXQgZmJvSDtcXG5cXG51bmlmb3JtIGZsb2F0IHdpblc7XFxudW5pZm9ybSBmbG9hdCB3aW5IO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIFxcbiAgdmVjMyBmaW5hbENvbG9yID0gdmVjMygwLjUsIDAuNSwgMC41KTtcXG4gIGZsb2F0IGFscGhhID0gMS4wO1xcbiAgZmxvYXQgcmVmbExpbWl0ID0gLjAyO1xcblxcbiAgZmxvYXQgc2NhbGVXID0gZmJvVyAvIHdpblc7XFxuICBmbG9hdCBzY2FsZUggPSBmYm9IIC8gd2luSDtcXG5cXG4gIC8vZmxvb3JcXG4gIHZlYzQgY29uY3JldGVDb2xvciA9IHRleHR1cmUyRChjb25jcmV0ZVRleHR1cmUsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTtcXG5cXG4gIHZlYzIgY29vcmRzID0gdlRleHR1cmVDb29yZDtcXG4gIGNvb3Jkcy5zID0gY29vcmRzLnMvc2NhbGVXO1xcbiAgY29vcmRzLnQgPSBjb29yZHMudC9zY2FsZUg7XFxuXFxuICBmbG9hdCBtYXhTID0gMS4wIC8gc2NhbGVXO1xcbiAgZmxvYXQgbWF4VCA9IDEuMCAvIHNjYWxlSDtcXG5cXG4gIGZsb2F0IHJlZmxMaW1pdFMgPSBtYXhTIC0gcmVmbExpbWl0O1xcbiAgZmxvYXQgcmVmbExpbWl0VCA9IG1heFQgLSByZWZsTGltaXQ7XFxuXFxuICB2ZWM0IHZpZGVvQ29sb3JMZWZ0ID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMihtYXhTIC0gY29vcmRzLnMsIGNvb3Jkcy50KSk7XFxuICB2ZWM0IHZpZGVvQ29sb3JGcm9udCA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIoY29vcmRzLnQsIGNvb3Jkcy5zKSk7XFxuICB2ZWM0IHZpZGVvQ29sb3JSaWdodCA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIobWF4UyAtIGNvb3Jkcy5zLCBtYXhUIC0gY29vcmRzLnQpKTtcXG4gIHZlYzQgdmlkZW9Db2xvckJhY2sgPSB0ZXh0dXJlMkQodmlkZW9UZXh0dXJlLCB2ZWMyKGNvb3Jkcy50LCBtYXhTIC0gY29vcmRzLnMpKTtcXG4gICAgXFxuICB2ZWMzIHJlZmxGcm9udCA9IHNtb290aHN0ZXAocmVmbExpbWl0UywgbWF4UywgbWF4UyAtIGNvb3Jkcy5zKSAqIHZpZGVvQ29sb3JGcm9udC5yZ2I7XFxuICB2ZWMzIHJlZmxMZWZ0ID0gc21vb3Roc3RlcChyZWZsTGltaXRULCBtYXhULCBtYXhUIC0gY29vcmRzLnQpICogdmlkZW9Db2xvckxlZnQucmdiO1xcbiAgdmVjMyByZWZsUmlnaHQgPSBzbW9vdGhzdGVwKHJlZmxMaW1pdFQsIG1heFQsIGNvb3Jkcy50KSAqIHZpZGVvQ29sb3JSaWdodC5yZ2I7XFxuICB2ZWMzIHJlZmxCYWNrID0gc21vb3Roc3RlcChyZWZsTGltaXRTLCBtYXhTLCBjb29yZHMucykgKiB2aWRlb0NvbG9yQmFjay5yZ2I7XFxuXFxuICBmaW5hbENvbG9yID0gKGNvbmNyZXRlQ29sb3IucmdiICogKHZlYzMoLjUsIC41LCAuNSkgKiBtYXgoLjUsIGF1ZGlvTGV2ZWxEZWVwKSkpICsgKHJlZmxGcm9udCArIHJlZmxMZWZ0ICsgcmVmbFJpZ2h0ICsgcmVmbEJhY2spO1xcbiAgICBcXG5cXG5cXG4gIGdsX0ZyYWdDb2xvciA9IHZlYzQoZmluYWxDb2xvciwgYWxwaGEpO1xcblxcbn1cIik7XG5cdHRoaXMuX3ZGbG9vci50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXG5cdHRoaXMuX3ZMZWQgPSBuZXcgVmlld0xlZCgpO1xuXHR0aGlzLl92TGVkLmluaXQoXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5hdHRyaWJ1dGUgZmxvYXQgYUluZGV4RGF0YTtcXG5cXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG52YXJ5aW5nIGZsb2F0IHZJbmRleERhdGE7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXG5cXHR2ZWMzIG5ld1BvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG5cXHQvLyBuZXdQb3MueiArPSBhSW5kZXhEYXRhICogMTAuMDtcXG5cXG5cXHQvLyB2VmVydGV4UG9zLnkgPSBuZXdQb3MueSArIGFJbmRleERhdGE7XFxuXFxuICAgIGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiB1TVZNYXRyaXggKiB2ZWM0KG5ld1BvcywgMS4wKTtcXG4gICAgLy8gdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxuICAgIHZJbmRleERhdGEgPSBhSW5kZXhEYXRhO1xcbn1cIiwgXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgZmxvYXQgdkluZGV4RGF0YTtcXG5cXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcblxcdC8vIHZlYzIgcG9zID0gbW9kKHZWZXJ0ZXhQb3MueHksIHZlYzIoNTAuMCkpIC0gdmVjMigzNS4wKTtcXG4gLy8gXFx0ZmxvYXQgZGlzdF9zcXVhcmVkID0gZG90KHBvcywgcG9zKTtcXG5cXG4gLy8gXFx0aWYgKGRpc3Rfc3F1YXJlZCA+PSAxMDAuMCkgZGlzY2FyZDtcXG4gLy8gXFx0dmVjNCBjb2xvciA9IHZlYzQoLjkwLCAuOTAsIC45MCwgMS4wKTtcXG4gIFxcbiAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KHZJbmRleERhdGEvNC4wLCAuMSwgLjkwLCAxLjApO1xcblxcbiAgICAgIC8vIGdsX0ZyYWdDb2xvciA9IG1peCh2ZWM0KC45MCwgLjkwLCAuOTAsIDEuMCksIHZlYzQoLjIwLCAuMjAsIC40MCwgMC4wKSxcXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICBzbW9vdGhzdGVwKDM4MC4yNSwgNDIwLjI1LCBkaXN0X3NxdWFyZWQpKTtcXG5cXHRcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHNjZW5lVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCwgLjUsIC41LCAxLjApO1xcblxcbiAgIFxcblxcblxcbn1cIik7XG5cdHRoaXMuX3ZMZWQudHJhbnNmb3JtcyA9IHRoaXMub3J0aG9UcmFuc2Zvcm1zO1xuXG5cdHRoaXMuX3ZMYW1wID0gbmV3IFZpZXdMYW1wKCk7XG5cdHRoaXMuX3ZMYW1wLmluaXQoXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG52YXJ5aW5nIGZsb2F0IHZJbmRleERhdGE7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXG5cXHR2ZWMzIG5ld1BvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG5cXHQvLyBuZXdQb3MueiArPSBhSW5kZXhEYXRhICogMTAuMDtcXG5cXG5cXHQvLyB2VmVydGV4UG9zLnkgPSBuZXdQb3MueSArIGFJbmRleERhdGE7XFxuXFxuXFx0dlZlcnRleFBvcyA9IG5ld1BvcztcXG5cXG4gICAgZ2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIHVNVk1hdHJpeCAqIHZlYzQobmV3UG9zLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG4gICAgLy8gdkluZGV4RGF0YSA9IGFJbmRleERhdGE7XFxufVwiLCBcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxuXFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgbGFtcFRleHR1cmU7XFxuXFxudW5pZm9ybSB2ZWMzIGNvbG9yT25lO1xcbnVuaWZvcm0gdmVjMyBjb2xvclR3bztcXG51bmlmb3JtIHZlYzMgY29sb3JUaHJlZTtcXG51bmlmb3JtIHZlYzMgY29sb3JGb3VyO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcblxcblxcbi8vIGZsb2F0IG9mZnNldFszXSA9IGZsb2F0W10oIDAuMCwgMS4zODQ2MTUzODQ2LCAzLjIzMDc2OTIzMDggKTtcXG4vLyBmbG9hdCB3ZWlnaHRbM10gPSBmbG9hdFtdKCAwLjIyNzAyNzAyNzAsIDAuMzE2MjE2MjE2MiwgMC4wNzAyNzAyNzAzICk7XFxuXFxudmVjNCBmQ29sb3I7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXG5cXHRcXG4gICAgZkNvbG9yID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAwLjApO1xcbiAgICAvLyB2ZWM0IGNpcmNsZUNvbG9yID0gXFxuXFxuICAgIC8vIGZvcihpbnQgcm93ID0gMDsgcm93IDwgMjsgcm93KyspIHtcXG4gICAgICAgIGZvcihpbnQgY29sID0gMDsgY29sIDwgNDsgY29sKyspIHtcXG4gICAgICAgICAgICBmbG9hdCBkaXN0ID0gZGlzdGFuY2UodlZlcnRleFBvcy54eSwgdmVjMigwLjAsIDEuMCArIGZsb2F0KGNvbCkqMS41KSk7XFxuICAgICAgICAgICAgZmxvYXQgZGVsdGEgPSAwLjE7XFxuICAgIFxcdFxcdGZsb2F0IGFscGhhID0gc21vb3Roc3RlcCgwLjQ1LWRlbHRhLCAwLjc0LCBkaXN0KTtcXG4gICAgXFx0XFx0Ly8gZmxvYXQgYWxwaGEgPSBzdGVwKC40NSwgZGlzdCk7XFxuICAgIFxcdFxcdC8vIGFscGhhIC09IC4wMTtcXG4gICAgXFx0XFx0dmVjMyBjaXJjbGVDb2xvciA9IGNvbG9yT25lO1xcbiAgICBcXHRcXHRpZiAoY29sID09IDEpXFxuICAgIFxcdFxcdFxcdGNpcmNsZUNvbG9yID0gY29sb3JUd287XFxuICAgIFxcdFxcdGVsc2UgaWYgKGNvbCA9PSAyKVxcbiAgICBcXHRcXHRcXHRjaXJjbGVDb2xvciA9IGNvbG9yVGhyZWU7XFxuICAgIFxcdFxcdGVsc2UgaWYgKGNvbCA9PSAzKVxcbiAgICBcXHRcXHRcXHRjaXJjbGVDb2xvciA9IGNvbG9yRm91cjtcXG4gICAgICAgICAgICBmQ29sb3IgPSBtaXgodmVjNChjaXJjbGVDb2xvciwgMS4wKSwgZkNvbG9yLCBhbHBoYSk7XFxuICAgICAgICAgICAgLy8gZkNvbG9yID0gbWl4KGNvbG9yc1tyb3cqMitjb2xdLCBmQ29sb3IsIGFscGhhKTtcXG4gICAgICAgIH1cXG5cXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IGZDb2xvcjtcXG4gICAgLy8gfVxcblxcbiAgICAvLyBmbG9hdCBkaXN0ID0gZGlzdGFuY2UodlZlcnRleFBvcy54eSwgdmVjMigtMC41MCArIDAuMCwgMC41MCAtIDAuMCkpO1xcbiAgICAvLyBmbG9hdCBkZWx0YSA9IDAuMTtcXG4gICAgLy8gZmxvYXQgYWxwaGEgPSBzbW9vdGhzdGVwKDAuNDUtZGVsdGEsIDAuNDUsIGRpc3QpO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSBtaXgodmVjNCgwLjUsIDAuMCwgMS4wLCAxLjApLCBmQ29sb3IsIGFscGhhKTtcXG5cXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gZkNvbG9yO1xcblxcblxcdC8vIHZlYzIgdXYgPSB2VGV4dHVyZUNvb3JkLnh5O1xcblxcblxcdC8vIHV2IC09IHZlYzIoLjUsIC4yKTtcXG5cXG5cXHQvLyBmbG9hdCBjaXJjbGVfcmFkaXVzID0gLjI7XFxuXFx0Ly8gZmxvYXQgYm9yZGVyID0gLjAxO1xcblxcblxcdC8vIGZsb2F0IGRpc3QgPSAgc3FydChkb3QodXYsIHV2KSk7XFxuXFx0Ly8gaWYgKCBkaXN0IDwgY2lyY2xlX3JhZGl1cyApe1xcblxcdC8vIFxcdHZlYzMgdGV4dHVyZUNvbG9yID0gdGV4dHVyZTJEKGxhbXBUZXh0dXJlLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSkucmdiO1xcblxcdC8vIFxcdGdsX0ZyYWdDb2xvciA9IHZlYzQodGV4dHVyZUNvbG9yLCAxLjApO1xcblxcdC8vIH1cXG5cXHQvLyBlbHNle1xcblxcdFxcdFxcblxcblxcdC8vIFxcdGdsX0ZyYWdDb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTtcXG5cXHRcXHRcXG5cXHQvLyB9XFxuXFx0XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRChsYW1wVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDAuNSk7XFxuXFxuICAgXFxuXFxuXFxufVwiKTtcblx0dGhpcy5fdkxhbXAudHJhbnNmb3JtcyA9IHRoaXMudHJhbnNmb3Jtcztcblx0XG4vLyBcdFx0dmFyIGd1aSA9IG5ldyBkYXQuR1VJKHtsb2FkOiB7XG4vLyAgIFwicHJlc2V0XCI6IFwiRGVmYXVsdFwiLFxuLy8gICBcImNsb3NlZFwiOiBmYWxzZSxcbi8vICAgXCJyZW1lbWJlcmVkXCI6IHtcbi8vICAgICBcIkRlZmF1bHRcIjoge1xuLy8gICAgICAgXCIwXCI6IHtcbi8vICAgICAgICAgXCJjb2xvck5vaXNlTXVsdGlwbGllclwiOiAxMCxcbi8vICAgICAgICAgXCJub2lzZUJhc2VDb2xvclwiOiBbXG4vLyAgICAgICAgICAgMjAwLFxuLy8gICAgICAgICAgIDE5Ljk5OTk5OTk5OTk5OTk5Nixcbi8vICAgICAgICAgICA2Mi4zNTI5NDExNzY0NzA1OVxuLy8gICAgICAgICBdLFxuLy8gICAgICAgICBcImF1ZGlvTGV2ZWxOb2lzZURpdmlkZXJcIjogMjYuMzc3MjExNjgzMDAyMTA2LFxuLy8gICAgICAgICBcInZlcnRleE11bHRpcGxpZXJcIjogMC4zNzAyMDQ5OTE4NDQyMjA2LFxuLy8gICAgICAgICBcInVzZVB1bHNlXCI6IGZhbHNlXG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICB9LFxuLy8gICBcImZvbGRlcnNcIjoge1xuLy8gICAgIFwiTm9pc2VcIjoge1xuLy8gICAgICAgXCJwcmVzZXRcIjogXCJEZWZhdWx0XCIsXG4vLyAgICAgICBcImNsb3NlZFwiOiBmYWxzZSxcbi8vICAgICAgIFwiZm9sZGVyc1wiOiB7fVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfX0pO1xuLy8gXHRcdGd1aS5yZW1lbWJlcih0aGlzLl92Um9vbSk7XG4vLyBcdFx0dmFyIG5vaXNlID0gZ3VpLmFkZEZvbGRlcignTm9pc2UnKTtcbi8vIFx0XHRub2lzZS5hZGQodGhpcy5fdlJvb20sICdjb2xvck5vaXNlTXVsdGlwbGllcicsIDAsIDIwMDApO1xuLy8gXHRcdG5vaXNlLmFkZENvbG9yKHRoaXMuX3ZSb29tLCAnbm9pc2VCYXNlQ29sb3InKTtcbi8vIFx0XHRub2lzZS5hZGQodGhpcy5fdlJvb20sICdhdWRpb0xldmVsTm9pc2VEaXZpZGVyJywgMSwgNDApO1xuLy8gXHRcdG5vaXNlLmFkZCh0aGlzLl92Um9vbSwgJ3ZlcnRleE11bHRpcGxpZXInLCAuMSwgNSk7XG4vLyBcdFx0bm9pc2UuYWRkKHRoaXMuX3ZSb29tLCAndXNlUHVsc2UnKTtcbi8vIFx0XHRub2lzZS5vcGVuKCk7XG5cblx0dGhpcy5fdlZpZGVvID0gbmV3IFZpZXdWaWRlbygpO1xuXHR0aGlzLl92VmlkZW8uaW5pdChcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0NCB1TVZNYXRyaXg7XFxudW5pZm9ybSBtYXQ0IHVQTWF0cml4O1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiB1TVZNYXRyaXggKiB2ZWM0KGFWZXJ0ZXhQb3NpdGlvbiwgMS4wKTtcXG4gICAgdlRleHR1cmVDb29yZCA9IGFUZXh0dXJlQ29vcmQ7XFxufVwiLCBcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdmlkZW9UZXh0dXJlO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTtcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdmVjNCgxLjAsIDEuMCwgMS4wLCAxLjApO1xcbn1cIik7XG5cdHRoaXMuX3ZWaWRlby50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXHQvLyB0aGlzLl92aWV3cy5wdXNoKHRoaXMuX3ZWaWRlbyk7XG5cblx0dGhpcy5fdlByaXNtID0gbmV3IFZpZXdQcmlzbSgpO1xuXHR0aGlzLl92UHJpc20uaW5pdChcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcbmF0dHJpYnV0ZSB2ZWMzIGFBZGpJbmRleDtcXG5hdHRyaWJ1dGUgZmxvYXQgYVVzZUludmVyc2U7XFxuXFxudW5pZm9ybSBtYXQ0IHVNVk1hdHJpeDtcXG51bmlmb3JtIG1hdDQgdVBNYXRyaXg7XFxuXFxudW5pZm9ybSBmbG9hdCBhdWRpb0xldmVsRGVlcDtcXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxIaWdoO1xcblxcbnVuaWZvcm0gZmxvYXQgYW5nbGU7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgXFxuICAgIHZlYzMgbmV3UG9zaXRpb24gPSBhVmVydGV4UG9zaXRpb247XFxuXFxuICAgIGlmIChhVXNlSW52ZXJzZSA9PSAyLjApXFxuICAgXFx0XFx0bmV3UG9zaXRpb24ueHkgKz0gc2luKDEuNSAqIDMuMTQgKiBhbmdsZSkgKiBhQWRqSW5kZXgueTtcXG4gICBcXHRlbHNlIGlmIChhVXNlSW52ZXJzZSA9PSAxLjApe1xcbiAgIFxcdFxcdG5ld1Bvc2l0aW9uLnh5ICs9IGNvcyguNyAqIDMuMTQgKiBhbmdsZSkgKiBhQWRqSW5kZXgueTtcXG4gICBcXHR9XFxuICAgIC8vIGlmIChhQWRqSW5kZXgueCA8IDAuMClcXG4gICBcXHQvLyBuZXdQb3NpdGlvbi54ICs9IGF1ZGlvTGV2ZWxEZWVwICogYUFkakluZGV4Lng7XFxuICAgXFx0Ly8gZWxzZSBpZiAoYUFkakluZGV4LnggPiAwLjApXFxuICAgXFx0XFx0Ly8gbmV3UG9zaXRpb24ueSAtPSBhdWRpb0xldmVsRGVlcCAqIGFBZGpJbmRleC54O1xcbiAgXFxuICAgIGdsX1Bvc2l0aW9uID0gdVBNYXRyaXggKiB1TVZNYXRyaXggKiB2ZWM0KG5ld1Bvc2l0aW9uLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG5cXG5cXG59XCIsIFwiI2RlZmluZSBHTFNMSUZZIDFcXG5wcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCB2aWRlb1RleHR1cmU7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHZpZGVvVGV4dHVyZSwgdmVjMih2VGV4dHVyZUNvb3JkLnMsIHZUZXh0dXJlQ29vcmQudCkpO1xcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDEuMCk7XFxufVwiKTtcblx0dGhpcy5fdlByaXNtLnRyYW5zZm9ybXMgPSB0aGlzLmxlZnRXYWxsVHJhbnNmb3Jtcztcblx0Ly8gdGhpcy5fdmlld3MucHVzaCh0aGlzLl92UHJpc20pO1xuXG5cdHRoaXMuX3ZMZWZ0V2FsbCA9IG5ldyBWaWV3TGVmdFdhbGwoKTtcblx0dGhpcy5fdkxlZnRXYWxsLmluaXQoXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5hdHRyaWJ1dGUgdmVjMyBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDQgdU1WTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1UE1hdHJpeDtcXG5cXG5cXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG5cXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcdHZlYzQgbXZQb3NpdGlvbiA9IHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICBnbF9Qb3NpdGlvbiA9IHVQTWF0cml4ICogbXZQb3NpdGlvbjtcXG4gIFxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG5cXG4gICAgdlZlcnRleFBvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gIFxcblxcblxcblxcblxcbn1cIiwgXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG5cXG51bmlmb3JtIHNhbXBsZXIyRCBzaW1wbGV4VGV4dHVyZTtcXG51bmlmb3JtIHNhbXBsZXIyRCBwZXJtVGV4dHVyZTtcXG51bmlmb3JtIHNhbXBsZXIyRCB2aWRlb1RleHR1cmU7XFxuXFxuXFxudW5pZm9ybSBmbG9hdCBhdWRpb0xldmVsRGVlcDtcXG51bmlmb3JtIGZsb2F0IGF1ZGlvTGV2ZWxIaWdoO1xcblxcbi8vZGF0Z3VpIHByb3BzXFxudW5pZm9ybSBmbG9hdCBjb2xvck5vaXNlTXVsdGlwbGllcjtcXG51bmlmb3JtIHZlYzMgbm9pc2VCYXNlQ29sb3I7XFxudW5pZm9ybSBmbG9hdCBhdWRpb0xldmVsTm9pc2VEaXZpZGVyO1xcbnVuaWZvcm0gZmxvYXQgdmVydGV4TXVsdGlwbGllcjtcXG51bmlmb3JtIGludCB1c2VQdWxzZTtcXG5cXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFBvcztcXG5cXG5cXG4jZGVmaW5lIFBJIDMuMTQxNTkyNjUzNTg5NzkzXFxuI2RlZmluZSBPTkUgMC4wMDM5MDYyNVxcbiNkZWZpbmUgT05FSEFMRiAwLjAwMTk1MzEyNVxcblxcbi8qXFxuICogM0Qgc2ltcGxleCBub2lzZS4gQ29tcGFyYWJsZSBpbiBzcGVlZCB0byBjbGFzc2ljIG5vaXNlLCBiZXR0ZXIgbG9va2luZy5cXG4gKi9cXG5mbG9hdCBzbm9pc2UodmVjMyBQKXtcXG5cXG5cXHQvLyBUaGUgc2tld2luZyBhbmQgdW5za2V3aW5nIGZhY3RvcnMgYXJlIG11Y2ggc2ltcGxlciBmb3IgdGhlIDNEIGNhc2VcXG5cXHQjZGVmaW5lIEYzIDAuMzMzMzMzMzMzMzMzXFxuXFx0I2RlZmluZSBHMyAwLjE2NjY2NjY2NjY2N1xcblxcbiAgLy8gU2tldyB0aGUgKHgseSx6KSBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggY2VsbCBvZiA2IHNpbXBsaWNlcyB3ZSdyZSBpblxcblxcdGZsb2F0IHMgPSAoUC54ICsgUC55ICsgUC56KSAqIEYzOyAvLyBGYWN0b3IgZm9yIDNEIHNrZXdpbmdcXG5cXHR2ZWMzIFBpID0gZmxvb3IoUCArIHMpO1xcblxcdGZsb2F0IHQgPSAoUGkueCArIFBpLnkgKyBQaS56KSAqIEczO1xcblxcdHZlYzMgUDAgPSBQaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5LHopIHNwYWNlXFxuXFx0UGkgPSBQaSAqIE9ORSArIE9ORUhBTEY7IC8vIEludGVnZXIgcGFydCwgc2NhbGVkIGFuZCBvZmZzZXQgZm9yIHRleHR1cmUgbG9va3VwXFxuXFxuXFx0dmVjMyBQZjAgPSBQIC0gUDA7ICAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxcblxcbiAgLy8gLy8gRm9yIHRoZSAzRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhIHNsaWdodGx5IGlycmVndWxhciB0ZXRyYWhlZHJvbi5cXG4gIC8vIC8vIFRvIGZpbmQgb3V0IHdoaWNoIG9mIHRoZSBzaXggcG9zc2libGUgdGV0cmFoZWRyYSB3ZSdyZSBpbiwgd2UgbmVlZCB0b1xcbiAgLy8gLy8gZGV0ZXJtaW5lIHRoZSBtYWduaXR1ZGUgb3JkZXJpbmcgb2YgeCwgeSBhbmQgeiBjb21wb25lbnRzIG9mIFBmMC5cXG4gIC8vIC8vIFRoZSBtZXRob2QgYmVsb3cgaXMgZXhwbGFpbmVkIGJyaWVmbHkgaW4gdGhlIEMgY29kZS4gSXQgdXNlcyBhIHNtYWxsXFxuICAvLyAvLyAxRCB0ZXh0dXJlIGFzIGEgbG9va3VwIHRhYmxlLiBUaGUgdGFibGUgaXMgZGVzaWduZWQgdG8gd29yayBmb3IgYm90aFxcbiAgLy8gLy8gM0QgYW5kIDREIG5vaXNlLCBzbyBvbmx5IDggKG9ubHkgNiwgYWN0dWFsbHkpIG9mIHRoZSA2NCBpbmRpY2VzIGFyZVxcbiAgLy8gLy8gdXNlZCBoZXJlLlxcblxcdGZsb2F0IGMxID0gKFBmMC54ID4gUGYwLnkpID8gMC41MDc4MTI1IDogMC4wMDc4MTI1OyAvLyAxLzIgKyAxLzEyOFxcblxcdGZsb2F0IGMyID0gKFBmMC54ID4gUGYwLnopID8gMC4yNSA6IDAuMDtcXG5cXHRmbG9hdCBjMyA9IChQZjAueSA+IFBmMC56KSA/IDAuMTI1IDogMC4wO1xcblxcdGZsb2F0IHNpbmRleCA9IGMxICsgYzIgKyBjMztcXG4gXFx0dmVjMyBvZmZzZXRzID0gdGV4dHVyZTJEKHNpbXBsZXhUZXh0dXJlLCB2ZWMyKHNpbmRleCwgMCkpLnJnYjtcXG5cXHR2ZWMzIG8xID0gc3RlcCgwLjM3NSwgb2Zmc2V0cyk7XFxuXFx0dmVjMyBvMiA9IHN0ZXAoMC4xMjUsIG9mZnNldHMpO1xcblxcbiAgLy8gTm9pc2UgY29udHJpYnV0aW9uIGZyb20gc2ltcGxleCBvcmlnaW5cXG4gIGZsb2F0IHBlcm0wID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCBQaS54eSkuYTtcXG4gIHZlYzMgIGdyYWQwID0gdGV4dHVyZTJEKHBlcm1UZXh0dXJlLCB2ZWMyKHBlcm0wLCBQaS56KSkucmdiICogNC4wIC0gMS4wO1xcbiAgZmxvYXQgdDAgPSAwLjYgLSBkb3QoUGYwLCBQZjApO1xcbiAgZmxvYXQgbjA7XFxuICBpZiAodDAgPCAwLjApIG4wID0gMC4wO1xcbiAgZWxzZSB7XFxuICAgIHQwICo9IHQwO1xcbiAgICBuMCA9IHQwICogdDAgKiBkb3QoZ3JhZDAsIFBmMCk7XFxuICB9XFxuXFxuICAvLyBOb2lzZSBjb250cmlidXRpb24gZnJvbSBzZWNvbmQgY29ybmVyXFxuICB2ZWMzIFBmMSA9IFBmMCAtIG8xICsgRzM7XFxuICBmbG9hdCBwZXJtMSA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgUGkueHkgKyBvMS54eSpPTkUpLmE7XFxuICB2ZWMzICBncmFkMSA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgdmVjMihwZXJtMSwgUGkueiArIG8xLnoqT05FKSkucmdiICogNC4wIC0gMS4wO1xcbiAgZmxvYXQgdDEgPSAwLjYgLSBkb3QoUGYxLCBQZjEpO1xcbiAgZmxvYXQgbjE7XFxuICBpZiAodDEgPCAwLjApIG4xID0gMC4wO1xcbiAgZWxzZSB7XFxuICAgIHQxICo9IHQxO1xcbiAgICBuMSA9IHQxICogdDEgKiBkb3QoZ3JhZDEsIFBmMSk7XFxuICB9XFxuICBcXG4gIC8vIE5vaXNlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoaXJkIGNvcm5lclxcbiAgdmVjMyBQZjIgPSBQZjAgLSBvMiArIDIuMCAqIEczO1xcbiAgZmxvYXQgcGVybTIgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIFBpLnh5ICsgbzIueHkqT05FKS5hO1xcbiAgdmVjMyAgZ3JhZDIgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIHZlYzIocGVybTIsIFBpLnogKyBvMi56Kk9ORSkpLnJnYiAqIDQuMCAtIDEuMDtcXG4gIGZsb2F0IHQyID0gMC42IC0gZG90KFBmMiwgUGYyKTtcXG4gIGZsb2F0IG4yO1xcbiAgaWYgKHQyIDwgMC4wKSBuMiA9IDAuMDtcXG4gIGVsc2Uge1xcbiAgICB0MiAqPSB0MjtcXG4gICAgbjIgPSB0MiAqIHQyICogZG90KGdyYWQyLCBQZjIpO1xcbiAgfVxcbiAgXFxuICAvLyBOb2lzZSBjb250cmlidXRpb24gZnJvbSBsYXN0IGNvcm5lclxcbiAgdmVjMyBQZjMgPSBQZjAgLSB2ZWMzKDEuMC0zLjAqRzMpO1xcbiAgZmxvYXQgcGVybTMgPSB0ZXh0dXJlMkQocGVybVRleHR1cmUsIFBpLnh5ICsgdmVjMihPTkUsIE9ORSkpLmE7XFxuICB2ZWMzICBncmFkMyA9IHRleHR1cmUyRChwZXJtVGV4dHVyZSwgdmVjMihwZXJtMywgUGkueiArIE9ORSkpLnJnYiAqIDQuMCAtIDEuMDtcXG4gIGZsb2F0IHQzID0gMC42IC0gZG90KFBmMywgUGYzKTtcXG4gIGZsb2F0IG4zO1xcbiAgaWYodDMgPCAwLjApIG4zID0gMC4wO1xcbiAgZWxzZSB7XFxuICAgIHQzICo9IHQzO1xcbiAgICBuMyA9IHQzICogdDMgKiBkb3QoZ3JhZDMsIFBmMyk7XFxuICB9XFxuXFxuICAvLyBTdW0gdXAgYW5kIHNjYWxlIHRoZSByZXN1bHQgdG8gY292ZXIgdGhlIHJhbmdlIFstMSwxXVxcbiAgcmV0dXJuIDMyLjAgKiAobjAgKyBuMSArIG4yICsgbjMpO1xcbn1cXG5cXG5mbG9hdCBwdWxzZShmbG9hdCB0aW1lKSB7XFxuICAgIC8vIGNvbnN0IGZsb2F0IHBpID0gMy4xNDtcXG4gICAgZmxvYXQgZnJlcXVlbmN5ID0gMS4wO1xcbiAgICByZXR1cm4gMC41KigxLjArc2luKDIuMCAqIFBJICogZnJlcXVlbmN5ICogdGltZSkpO1xcbn1cXG5cXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgIFxcbiAgICBmbG9hdCBuID0gMC4wO1xcbiAgICBpZiAodXNlUHVsc2UgPT0gMSlcXG4gICAgICBuID0gc25vaXNlKHZlYzModmVydGV4TXVsdGlwbGllciAqIHZWZXJ0ZXhQb3MgKiAocHVsc2UoYXVkaW9MZXZlbEhpZ2gvYXVkaW9MZXZlbE5vaXNlRGl2aWRlcikgKSkpO1xcbiAgICBlbHNlXFxuICAgICAgbiA9IHNub2lzZSh2ZWMzKHZlcnRleE11bHRpcGxpZXIgKiB2VmVydGV4UG9zICogKGF1ZGlvTGV2ZWxIaWdoL2F1ZGlvTGV2ZWxOb2lzZURpdmlkZXIpICkpO1xcblxcbiAgICB2ZWMzIHZpZGVvQ29sb3IgPSB0ZXh0dXJlMkQodmlkZW9UZXh0dXJlLCB2ZWMyKHZUZXh0dXJlQ29vcmQucywgdlRleHR1cmVDb29yZC50KSkucmdiO1xcblxcbiAgICAvLyB2ZWMzIGZpbmFsQ29sb3IgPSB2ZWMzKGF1ZGlvTGV2ZWxEZWVwLCBhdWRpb0xldmVsRGVlcCwgMC4zKTtcXG4gICAgdmVjMyBmaW5hbENvbG9yID0gdmVjMyhub2lzZUJhc2VDb2xvci5yLzI1NS4wLCBub2lzZUJhc2VDb2xvci5nLzI1NS4wLCBub2lzZUJhc2VDb2xvci5iLzI1NS4wKSAqIHZpZGVvQ29sb3IgKiAobiAqIGNvbG9yTm9pc2VNdWx0aXBsaWVyKTtcXG5cXG4gICAgZmxvYXQgYVZhbCA9IDEuMDtcXG4gICAgXFxuICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZmluYWxDb2xvciwgYVZhbCk7XFxuICAgXFxufVwiKTtcblx0dGhpcy5fdkxlZnRXYWxsLnRyYW5zZm9ybXMgPSB0aGlzLmxlZnRXYWxsVHJhbnNmb3Jtcztcblx0Ly8gdGhpcy5fdmlld3MucHVzaCh0aGlzLl92TGVmdFdhbGwpO1xuXG5cdC8vIEltcG9ydHNcblx0dGhpcy5fdkNpcmNsZSA9IG5ldyBWaWV3SW1wb3J0KCk7XG5cdHRoaXMuX3ZDaXJjbGUuaW5pdChcIiNkZWZpbmUgR0xTTElGWSAxXFxucHJlY2lzaW9uIGhpZ2hwIGZsb2F0O1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcbmF0dHJpYnV0ZSB2ZWMzIGFWZXJ0ZXhOb3JtYWw7XFxuYXR0cmlidXRlIHZlYzMgYVZlcnRleENvbG9yO1xcblxcbnVuaWZvcm0gbWF0NCB1TVZNYXRyaXg7XFxudW5pZm9ybSBtYXQ0IHVQTWF0cml4O1xcbnVuaWZvcm0gbWF0NCB1Tk1hdHJpeDtcXG5cXG51bmlmb3JtIHZlYzMgdUxpZ2h0UG9zaXRpb247XFxuXFxudW5pZm9ybSB2ZWMzIHVNYXRlcmlhbERpZmZ1c2U7XFxuXFxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XFxudmFyeWluZyB2ZWMzIHZMaWdodFJheTtcXG52YXJ5aW5nIHZlYzMgdkV5ZVZlYztcXG52YXJ5aW5nIHZlYzMgdkxpZ2h0aW5nO1xcblxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnZhcnlpbmcgdmVjMyB2VmVydGV4UG9zO1xcbnZhcnlpbmcgdmVjMyB2Q29sb3I7XFxuXFxudm9pZCBtYWluKHZvaWQpIHtcXG5cXG5cXHQvL1RyYW5zZm9ybWVkIHZlcnRleCBwb3NpdGlvblxcblxcdC8vIHZlYzQgdmVydGV4ID0gdU1WTWF0cml4ICogdmVjNChhVmVydGV4UG9zaXRpb24sIDEuMCk7XFxuXFxuXFx0Ly8gLy9UcmFuc2Zvcm1lZCBub3JtYWwgcG9zaXRpb25cXG5cXHQvLyB2Tm9ybWFsID0gdmVjMyh1Tk1hdHJpeCAqIHZlYzQoYVZlcnRleE5vcm1hbCwgMS4wKSk7XFxuXFxuXFx0Ly8gLy9UcmFuc2Zvcm1lZCBsaWdodCBwb3NpdGlvblxcblxcdC8vIHZlYzQgbGlnaHQgPSB1TVZNYXRyaXggKiB2ZWM0KHVMaWdodFBvc2l0aW9uLDEuMCk7XFxuXFxuXFx0Ly8gLy9MaWdodCBwb3NpdGlvblxcblxcdC8vIHZMaWdodFJheSA9IHZlcnRleC54eXotbGlnaHQueHl6O1xcblxcblxcdC8vIC8vVmVjdG9yIEV5ZVxcblxcdC8vIHZFeWVWZWMgPSAtdmVjMyh2ZXJ0ZXgueHl6KTtcXG5cXG5cXHRoaWdocCB2ZWMzIGFtYmllbnRMaWdodCA9IHZlYzMoMC42LCAwLjYsIDAuNik7XFxuICAgIGhpZ2hwIHZlYzMgZGlyZWN0aW9uYWxMaWdodENvbG9yID0gdmVjMygwLjUsIDAuNSwgMC43NSk7XFxuICAgIGhpZ2hwIHZlYzMgZGlyZWN0aW9uYWxWZWN0b3IgPSB2ZWMzKDAuMDUsIDAuMDA4LCAwLjAwNSk7XFxuICAgIFxcbiAgICBoaWdocCB2ZWM0IHRyYW5zZm9ybWVkTm9ybWFsID0gdU5NYXRyaXggKiB2ZWM0KGFWZXJ0ZXhOb3JtYWwsIDEuMCk7XFxuICAgIFxcbiAgICBoaWdocCBmbG9hdCBkaXJlY3Rpb25hbCA9IG1heChkb3QodHJhbnNmb3JtZWROb3JtYWwueHl6LCBkaXJlY3Rpb25hbFZlY3RvciksIDAuMCk7XFxuICAgIHZMaWdodGluZyA9IGFtYmllbnRMaWdodCArIChkaXJlY3Rpb25hbExpZ2h0Q29sb3IgKiBkaXJlY3Rpb25hbCk7XFxuXFxuXFxuXFxuXFx0Z2xfUG9zaXRpb24gPSB1UE1hdHJpeCAqIHVNVk1hdHJpeCAqIHZlYzQoYVZlcnRleFBvc2l0aW9uLCAxLjApO1xcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG4gICAgdlZlcnRleFBvcyA9IGFWZXJ0ZXhQb3NpdGlvbjtcXG4gICAgdkNvbG9yID0gYVZlcnRleENvbG9yO1xcblxcblxcblxcbn1cIiwgXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnByZWNpc2lvbiBoaWdocCBmbG9hdDtcXG4vLyB2YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG5cXG51bmlmb3JtIG1hdDQgdU5NYXRyaXg7XFxuXFxuLy8gdW5pZm9ybSB2ZWMzIGRpZmZ1c2U7XFxuXFxudW5pZm9ybSBzYW1wbGVyMkQgdmlkZW9UZXh0dXJlO1xcblxcbnVuaWZvcm0gdmVjNCB1TGlnaHRBbWJpZW50O1xcbnVuaWZvcm0gdmVjNCB1TGlnaHREaWZmdXNlO1xcbnVuaWZvcm0gdmVjNCB1TGlnaHRTcGVjdWxhcjtcXG5cXG51bmlmb3JtIHZlYzQgdU1hdGVyaWFsQW1iaWVudDtcXG51bmlmb3JtIHZlYzMgdU1hdGVyaWFsRGlmZnVzZTtcXG51bmlmb3JtIHZlYzMgdU1hdGVyaWFsU3BlY3VsYXI7XFxudW5pZm9ybSBmbG9hdCB1U2hpbmluZXNzO1xcblxcbnVuaWZvcm0gZmxvYXQgYXVkaW9MZXZlbERlZXA7XFxudW5pZm9ybSBmbG9hdCBhdWRpb0xldmVsSGlnaDtcXG5cXG52YXJ5aW5nIHZlYzMgdk5vcm1hbDtcXG52YXJ5aW5nIHZlYzMgdkxpZ2h0UmF5O1xcbnZhcnlpbmcgdmVjMyB2RXllVmVjO1xcblxcbnZhcnlpbmcgdmVjMyB2TGlnaHRpbmc7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhQb3M7XFxudmFyeWluZyB2ZWMzIHZDb2xvcjtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcblxcblxcdC8vIGNvbnN0IHZlYzMgbGlnaHRDb2wxID0gdmVjMyggMC4wLCAwLjAsIDAuMCApO1xcbiAvLyAgICBjb25zdCB2ZWMzIGxpZ2h0RGlyMSA9IHZlYzMoIC0xLjAsIDAuMCwgMC4wICk7XFxuIC8vICAgIGNvbnN0IGZsb2F0IGludGVuc2l0eTEgPSAxLjA7XFxuXFxuIC8vICAgIHZlYzQgbERpcmVjdGlvbjEgPSB1Tk1hdHJpeCAqIHZlYzQoIGxpZ2h0RGlyMSwgMC4wICk7XFxuIC8vICAgIHZlYzMgbGlnaHRWZWMxID0gbm9ybWFsaXplKCBsRGlyZWN0aW9uMS54eXogKTtcXG5cXG4gICAgLy8gcG9pbnQgbGlnaHRcXG5cXG4gICAgLy8gY29uc3QgdmVjMyBsaWdodFBvczIgPSB2ZWMzKCAwLjAsIDAuMCwgLTIwMC4wICk7XFxuICAgIC8vIGNvbnN0IHZlYzMgbGlnaHRDb2wyID0gdmVjMyggMS4wLCAwLjUsIDAuMiApO1xcbiAgICAvLyBjb25zdCBmbG9hdCBtYXhEaXN0YW5jZTIgPSAyMDAwMC4wO1xcbiAgICAvLyBjb25zdCBmbG9hdCBpbnRlbnNpdHkyID0gMS41O1xcblxcbiAgICAvLyB2ZWM0IGxQb3NpdGlvbiA9IHVOTWF0cml4ICogdmVjNCggbGlnaHRQb3MyLCAxLjAgKTtcXG4gICAgLy8gdmVjMyBsVmVjdG9yID0gbFBvc2l0aW9uLnh5eiArIHZWaWV3UG9zaXRpb24ueHl6O1xcblxcbiAgICAvLyB2ZWMzIGxpZ2h0VmVjMiA9IG5vcm1hbGl6ZSggbFZlY3RvciApO1xcbiAgICAvLyBmbG9hdCBsRGlzdGFuY2UyID0gMS4wIC0gbWluKCAoIGxlbmd0aCggbFZlY3RvciApIC8gbWF4RGlzdGFuY2UyICksIDEuMCApO1xcblxcbiAgICAvLyAvLyBwb2ludCBsaWdodFxcblxcbiAgICAvLyAvLyBjb25zdCB2ZWMzIGxpZ2h0UG9zMyA9IHZlYzMoIDAuMCwgMC4wLCAtMjAuMCApO1xcbiAgICAvLyAvLyBjb25zdCB2ZWMzIGxpZ2h0Q29sMyA9IHZlYzMoMC4wLCAxLjAsIDEuMCApO1xcbiAgICAvLyAvLyBmbG9hdCBtYXhEaXN0YW5jZTMgPSBhdWRpb0VuZXJneSAqIDQwLjA7XFxuICAgIC8vIC8vIGNvbnN0IGZsb2F0IGludGVuc2l0eTMgPSAxLjU7XFxuXFxuICAgIC8vIC8vIHZlYzQgbFBvc2l0aW9uMyA9IHVOTWF0cml4ICogdmVjNCggbGlnaHRQb3MzLCAxLjAgKTtcXG4gICAgLy8gLy8gdmVjMyBsVmVjdG9yMyA9IGxQb3NpdGlvbjMueHl6ICsgdlZpZXdQb3NpdGlvbi54eXo7XFxuXFxuICAgIC8vIC8vIHZlYzMgbGlnaHRWZWMzID0gbm9ybWFsaXplKCBsVmVjdG9yMyApO1xcbiAgICAvLyAvLyBmbG9hdCBsRGlzdGFuY2UzID0gMS4wIC0gbWluKCAoIGxlbmd0aCggbFZlY3RvcjMgKSAvIG1heERpc3RhbmNlMyApLCAxLjAgKTtcXG5cXG4gICAgLy8gLy9cXG5cXG4gICAgLy8gdmVjMyBub3JtYWwgPSB2Tm9ybWFsO1xcblxcbiAgICAvLyAvLyBmbG9hdCBkaWZmdXNlMSA9IGludGVuc2l0eTEgKiBtYXgoIGRvdCggbm9ybWFsLCBsaWdodFZlYzEgKSwgMC4wICk7XFxuICAgIC8vIGZsb2F0IGRpZmZ1c2UyID0gaW50ZW5zaXR5MiAqIG1heCggZG90KCBub3JtYWwsIGxpZ2h0VmVjMiApLCAwLjAgKSAqIGxEaXN0YW5jZTI7XFxuICAgIC8vIC8vIGZsb2F0IGRpZmZ1c2UzID0gaW50ZW5zaXR5MiAqIG1heCggZG90KCBub3JtYWwsIGxpZ2h0VmVjMyApLCAwLjAgKSAqIGxEaXN0YW5jZTM7XFxuXFxuICAgIC8vIC8vIHZlYzMgY29sb3IgPSB0ZXh0dXJlMkQodGVzdFRleHR1cmUsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQgKSkucmdiO1xcblxcbiAgICAvLyBnbF9GcmFnQ29sb3IgPSB2ZWM0KGRpZmZ1c2UyICogZGlmZnVzZSwgMS4wICk7XFxuICAgIC8vIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh1U2FtcGxlcjAsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKTtcXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gdmVjNCgwLjA1LCAwLjgsIDAuMDUsIDEuMCk7XFxuXFxuICAgIC8vIHZlYzMgTCA9IG5vcm1hbGl6ZSh2TGlnaHRSYXkpO1xcbiAgICAvLyB2ZWMzIE4gPSBub3JtYWxpemUodk5vcm1hbCk7XFxuXFxuICAgIC8vIC8vTGFtYmVydCdzIGNvc2luZSBsYXdcXG4gICAgLy8gZmxvYXQgbGFtYmVydFRlcm0gPSBkb3QoTiwtTCk7XFxuICAgIFxcbiAgICAvLyAvL0FtYmllbnQgVGVybSAgXFxuICAgIC8vIHZlYzQgSWEgPSB1TGlnaHRBbWJpZW50ICogdU1hdGVyaWFsQW1iaWVudDtcXG5cXG4gICAgLy8gLy9EaWZmdXNlIFRlcm1cXG4gICAgLy8gdmVjNCBJZCA9IHZlYzQoMC4wLDAuMCwwLjAsMS4wKTtcXG5cXG4gICAgLy8gLy9TcGVjdWxhciBUZXJtXFxuICAgIC8vIHZlYzQgSXMgPSB2ZWM0KDAuMCwwLjAsMC4wLDEuMCk7XFxuXFxuICAgIC8vIGlmKGxhbWJlcnRUZXJtID4gMC4wKVxcbiAgICAvLyB7XFxuICAgIC8vICAgICBJZCA9IHVMaWdodERpZmZ1c2UgKiB2ZWM0KHVNYXRlcmlhbERpZmZ1c2UsMS4wKSAqIGxhbWJlcnRUZXJtOyBcXG4gICAgLy8gICAgIHZlYzMgRSA9IG5vcm1hbGl6ZSh2RXllVmVjKTtcXG4gICAgLy8gICAgIHZlYzMgUiA9IHJlZmxlY3QoTCwgTik7XFxuICAgIC8vICAgICBmbG9hdCBzcGVjdWxhciA9IHBvdyggbWF4KGRvdChSLCBFKSwgMC4wKSwgdVNoaW5pbmVzcyk7XFxuICAgIC8vICAgICBJcyA9IHVMaWdodFNwZWN1bGFyICogdmVjNCh1TWF0ZXJpYWxTcGVjdWxhciwxLjApICogc3BlY3VsYXI7XFxuICAgIC8vIH1cXG5cXG4gICAgLy8gLy9GaW5hbCBjb2xvclxcbiAgICAvLyB2ZWM0IGZpbmFsQ29sb3IgPSBJYSArIElkICsgSXM7XFxuICAgIC8vIGZpbmFsQ29sb3IuYSA9IDEuMDtcXG5cXG4gICAgLy8gZ2xfRnJhZ0NvbG9yID0gZmluYWxDb2xvcjtcXG5cXG4gLy8gICAgdmVjNCBJYSA9IHVMaWdodEFtYmllbnQgKiB1TWF0ZXJpYWxBbWJpZW50O1xcdC8vQW1iaWVudCBjb21wb25lbnQ6IG9uZSBmb3IgYWxsXFxuIC8vICAgIHZlYzQgZmluYWxDb2xvciA9IHZlYzQoMC4wLDAuMCwwLjAsMS4wKTtcXHQvL0NvbG9yIHRoYXQgd2lsbCBiZSBhc3NpZ25lZCB0byBnbF9GcmFnQ29sb3JcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXG5cXHQvLyB2ZWMzIE4gPSBub3JtYWxpemUodk5vcm1hbCk7XFxuXFx0Ly8gdmVjMyBMID0gdmVjMygwLjApO1xcblxcdC8vIGZsb2F0IGxhbWJlcnRUZXJtID0gMC4wO1xcblxcdFxcblxcdC8vIC8vIGZvcihpbnQgaSA9IDA7IGkgPCBOVU1fTElHSFRTOyBpKyspe1xcdFxcdFxcdFxcdFxcdC8vRm9yIGVhY2ggbGlnaHRcXG5cXHRcXHRcXG5cXHQvLyBMID0gbm9ybWFsaXplKHZMaWdodFJheSk7XFx0XFx0XFx0Ly9DYWxjdWxhdGUgcmVmbGV4aW9uXFxuXFx0Ly8gbGFtYmVydFRlcm0gPSBkb3QoTiwgLUwpO1xcblxcdFxcblxcdC8vIGlmIChsYW1iZXJ0VGVybSA+IDAuNCl7XFx0XFx0XFx0XFxuXFx0Ly8gXFx0ZmluYWxDb2xvciArPSB1TGlnaHREaWZmdXNlICogdmVjNCh1TWF0ZXJpYWxEaWZmdXNlLDEuMCkgKiBsYW1iZXJ0VGVybTsgLy9BZGQgZGlmZnVzZSBjb21wb25lbnQsIG9uZSBwZXIgbGlnaHRcXG5cXHQvLyB9XFxuXFx0Ly8gLy8gfVxcblxcblxcdC8vIC8vRmluYWwgY29sb3JcXG4gLy8gICAgZmluYWxDb2xvciArPSBJYTtcXG4gLy8gICAgZmluYWxDb2xvci5hID0gMS4wO1xcdFxcdFxcdFxcdC8vQWRkIGFtYmllbnQgY29tcG9uZW50OiBvbmUgZm9yIGFsbFxcdFxcdFxcdFxcdFxcdFxcblxcdC8vIGdsX0ZyYWdDb2xvciA9IGZpbmFsQ29sb3I7XFx0XFx0Ly9UaGUgYWxwaGEgdmFsdWUgaW4gdGhpcyBleGFtcGxlIHdpbGwgYmUgMS4wXFxuICAgIC8vIHZlYzMgZmluYWxDb2xvciA9IHVNYXRlcmlhbERpZmZ1c2UgKiB2TGlnaHRpbmc7XFxuICAgIHZlYzMgdmlkZW9Db2xvciA9IHRleHR1cmUyRCh2aWRlb1RleHR1cmUsIHZlYzIodlRleHR1cmVDb29yZC5zLCB2VGV4dHVyZUNvb3JkLnQpKS5yZ2I7XFxuXFx0Ly8gZ2xfRnJhZ0NvbG9yID0gdmVjNChtaXgodmlkZW9Db2xvciwgZmluYWxDb2xvciwgLjMpLCAxLjApO1xcbiAgICAvLyBzbW9vdGhzdGVwKDAuOCwgMS4wLCAxLjAgLSB2VGV4dHVyZUNvb3JkLnMpICogdmlkZW9Db2xvci5yZ2I7XFxuICAgIGZsb2F0IHlQb3MgPSBhYnMobWluKHZWZXJ0ZXhQb3MueiwgLjIpKTtcXG4gICAgZmxvYXQgYXVkaW9MZXZlbCA9IGF1ZGlvTGV2ZWxIaWdoLzYuMzc7XFxuICAgIHZlYzMgZmluYWxDb2xvciA9IHNtb290aHN0ZXAoMC43LCAxLjAsIGF1ZGlvTGV2ZWxIaWdoLzI2LjM3KSAqIHZlYzMoMC41LCAxLjAsIC43KTtcXG4gICAgZmluYWxDb2xvciA9IHZlYzMoLjcsIGF1ZGlvTGV2ZWwsIGF1ZGlvTGV2ZWwpICogeVBvcztcXG4gICAgZ2xfRnJhZ0NvbG9yID0gdmVjNCh2Q29sb3IgKiB2TGlnaHRpbmcsIDEuMCk7XFxufVwiKTtcblx0dGhpcy5fdkNpcmNsZS50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXHQvLyB0aGlzLl92aWV3cy5wdXNoKHRoaXMuX3ZDaXJjbGUpO1xuXG5cblx0Ly8gdGhpcy5fdlRlc3RJbXBvcnQgPSBuZXcgVmlld0ltcG9ydCgpO1xuXHQvLyB0aGlzLl92VGVzdEltcG9ydC5pbml0KFwic2hhZGVycy9wbGFpbi52ZXJ0XCIsIFwic2hhZGVycy9wbGFpbi5mcmFnXCIpO1xuXHQvLyB0aGlzLl92VGVzdEltcG9ydC50cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuXHQvLyB0aGlzLl92aWV3cy5wdXNoKHRoaXMuX3ZUZXN0SW1wb3J0KTtcblxuXG5cbn07XG5cbnAudXBkYXRlID0gZnVuY3Rpb24oKXtcblxuXHRzLnVwZGF0ZS5jYWxsKHRoaXMpO1xuXG5cdGlmICh0aGlzLmltcG9ydHNDb250cm9sbGVyKVxuXHRcdHRoaXMuaW1wb3J0c0NvbnRyb2xsZXIudXBkYXRlKHRoaXMudmlkZW9QbGF5ZXIudmlkZW8uY3VycmVudFRpbWUpO1xuXHRcdC8vIGlmICh0aGlzLl9jaXJjbGVzQW5pbWF0aW9uKVxuXHRcdC8vIFx0dGhpcy5fY2lyY2xlc0FuaW1hdGlvbi51cGRhdGUoKTtcblxuXHR0aGlzLmVuZFNjcmVlbi51cGRhdGUoKTtcblx0dGhpcy5sb2FkZXJTY3JlZW4udXBkYXRlKCk7XG59O1xuXG5cbnAucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0Z2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuXG5cdGdsLmRpc2FibGUoZ2wuQkxFTkQpO1xuXG5cdHRoaXMuZW5kU2NyZWVuLnJlbmRlcigpO1xuXHR0aGlzLmxvYWRlclNjcmVlbi5yZW5kZXIoKTtcblxuXHRnbC5jbGVhckNvbG9yKCAwLCAwLCAwLCAxICk7XG5cdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuXHRnbC52aWV3cG9ydCgwLCAwLCBnbC52aWV3cG9ydFdpZHRoLCBnbC52aWV3cG9ydEhlaWdodCk7XG5cblx0Ly8gRklYIFdJVEggR0xTTElGWSAhISEhXG5cdC8vIHZhciBzaGFkZXJzTG9hZGVkID0gdHJ1ZTtcblx0Ly8gZm9yICh2YXIgaT0wO2k8dGhpcy5fdmlld3MubGVuZ3RoO2krKyl7XG5cdC8vIFx0aWYgKCF0aGlzLl92aWV3c1tpXS5zaGFkZXJzTG9hZGVkKSBzaGFkZXJzTG9hZGVkID0gZmFsc2U7XG5cdC8vIH1cblx0Ly8gaWYgKCFzaGFkZXJzTG9hZGVkKSByZXR1cm47XG5cdFxuXHR0aGlzLnRyYW5zZm9ybXMucHVzaCgpO1xuXHR0aGlzLnRyYW5zZm9ybXMuc2V0Q2FtZXJhKHRoaXMuY2FtZXJhKTtcblxuXHR0aGlzLmNhbWVyYS5hcHBseShnbC52aWV3cG9ydFdpZHRoIC8gZ2wudmlld3BvcnRIZWlnaHQpO1xuICAgIHRoaXMudHJhbnNmb3Jtcy5jYWxjdWxhdGVNb2RlbFZpZXcoKTtcblxuXHR0aGlzLmF1ZGlvRGF0YSA9IHRoaXMuc3BlY3RydW1BbmFseXplci5nZXRBdWRpb0RhdGEoKTtcblx0Ly8gY29uc29sZS5sb2codGhpcy5hdWRpb0RhdGEpO1xuXHRcblx0aWYgKCF0aGlzLmxvYWRlclNjcmVlbi5pc1Nob3dpbmcgJiYgIXRoaXMuZW5kU2NyZWVuLmlzU2hvd2luZyl7XG5cdFx0aWYgKHRoaXMudmlkZW9QbGF5ZXIuaXNMb2FkZWQgJiYgdGhpcy5hdWRpb1BsYXllci5pc0xvYWRlZCAmJiB0aGlzLmltcG9ydHNMb2FkZWQpe1xuXG5cdFx0XHRpZiAoIXRoaXMudmlkZW9QbGF5ZXIudHJpZ2dlcmVkUGxheSl7XG5cdFx0XHRcdHRoaXMudmlkZW9QbGF5ZXIucGxheSgpO1xuXHRcdFx0XHR0aGlzLmJhY2tncm91bmRMb2FkZXJGYWRlciA9IDEuMDtcblx0XHRcdFx0Ly8gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG5cdFx0XHRcdFx0XG5cdFx0XHRcdC8vIH0sMCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0dGhpcy5fdmlkZW9UZXh0dXJlLnVwZGF0ZVRleHR1cmUodGhpcy52aWRlb1BsYXllci52aWRlbyk7XG5cblxuXG5cdFx0XHR0aGlzLmxlZnRXYWxsVHJhbnNmb3Jtcy5wdXNoKCk7XG5cdFx0XHRcblx0XHRcdHRoaXMubGVmdFdhbGxUcmFuc2Zvcm1zLnNldENhbWVyYSh0aGlzLmxlZnRXYWxsQ2FtZXJhKTtcblx0XHRcdHRoaXMubGVmdFdhbGxDYW1lcmEuYXBwbHkoMTAyNC83NjgpO1xuXG5cdFx0XHR0aGlzLmxlZnRXYWxsVHJhbnNmb3Jtcy5jYWxjdWxhdGVNb2RlbFZpZXcoKTtcblxuXHRcdFx0Ly9yZW5kZXIgd2FsbCB3aXRoIG5vaXNlXG5cdFx0XHR0aGlzLl9sZWZ0V2FsbEZCTy5iaW5kKCk7XG5cblx0XHRcdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuXHRcdFx0dGhpcy5fdkxlZnRXYWxsLnJlbmRlcih0aGlzLl92aWRlb1RleHR1cmUsIHRoaXMuYXVkaW9EYXRhLCB0aGlzLl9wZXJtVGV4dHVyZSwgdGhpcy5fc2ltcGxleFRleHR1cmUpO1xuXG5cdFx0XHR0aGlzLl9sZWZ0V2FsbEZCTy51bmJpbmQoKTtcblxuXHRcdFx0Ly8gcmVuZGVyIHByaXNtIHdpdGggd2FsbCB0ZXh0dXJlXG5cdFx0XHR0aGlzLl9wcmlzbUZCTy5iaW5kKCk7XG5cblx0XHRcdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuXHRcdFx0dGhpcy5fdlByaXNtLnJlbmRlcih0aGlzLl9sZWZ0V2FsbEZCTy5nZXRUZXh0dXJlKCksIHRoaXMuYXVkaW9EYXRhKTtcblxuXHRcdFx0dGhpcy5fcHJpc21GQk8udW5iaW5kKCk7XG5cblx0XHRcdHRoaXMubGVmdFdhbGxUcmFuc2Zvcm1zLnBvcCgpO1xuXG5cdFx0XHRcblx0XHRcdHRoaXMub3J0aG9UcmFuc2Zvcm1zLnNldENhbWVyYSh0aGlzLm9ydGhvQ2FtZXJhKTtcblx0XHRcdHRoaXMuX2xlZEZCTy5iaW5kKCk7XG5cdFx0XHRnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cdFx0XHRcblxuXHRcdFx0dGhpcy5fdkxlZC5yZW5kZXIoKTtcblxuXG5cdFx0XHR0aGlzLl9sZWRGQk8udW5iaW5kKCk7XG5cblx0XHRcdHRoaXMuX2JsdXJWRkJPLmJpbmQoKTtcblx0XHRcdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuXHRcdFx0dGhpcy5fdkJsdXJWZXJ0LnJlbmRlcih0aGlzLl9sZWRGQk8uZ2V0VGV4dHVyZSgpKTtcblxuXHRcdFx0dGhpcy5fYmx1clZGQk8udW5iaW5kKCk7XG5cblx0XHRcdHRoaXMuX2JsdXJIRkJPLmJpbmQoKTtcblx0XHRcdGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuXHRcdFx0dGhpcy5fdkJsdXJIb3Jpei5yZW5kZXIodGhpcy5fYmx1clZGQk8uZ2V0VGV4dHVyZSgpKTtcblxuXHRcdFx0dGhpcy5fYmx1ckhGQk8udW5iaW5kKCk7XG5cblxuXHRcdFx0Ly8gdGhpcy5fdkNvcHkucmVuZGVyKHRoaXMuX2JsdXJIRkJPLmdldFRleHR1cmUoKSwgdGhpcy5mYm9TaXplTGVkKTtcblxuXHRcdFx0Ly8gdGhpcy5vcnRob1RyYW5zZm9ybXMuc2V0Q2FtZXJhKHRoaXMub3J0aG9DYW1lcmEpO1xuXG5cdFx0XHQvLyB0aGlzLl92Q29weS5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLmZib1NpemUpO1xuXG5cblxuXHRcdFx0Ly8gLy8gUmVuZGVyIHZpc2libGUgc2NlbmVcblx0XHRcdHRoaXMuX3ZXYWxscy5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLmZib1NpemUpO1xuXHRcdFx0Ly8gLy8gLy8gdGhpcy5fdlJvb20ucmVuZGVyKHRoaXMuX3ByaXNtRkJPLmdldFRleHR1cmUoKSwgdGhpcy5fY29uY3JldGVUZXh0dXJlKTtcblxuXHRcdFx0dGhpcy5fdlZpZGVvLnJlbmRlcih0aGlzLl92aWRlb1RleHR1cmUpO1xuXG5cblxuXHRcdFx0XG5cdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLmF1ZGlvRGF0YSk7XG5cdFx0XHQvLyBkZWJ1Z2dlcjtcblx0XHRcdHRoaXMuX3ZGbG9vci5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLl9jb25jcmV0ZVRleHR1cmUsIHRoaXMuYXVkaW9EYXRhLCB0aGlzLmZib1NpemUpO1xuXG5cdFx0XHR0aGlzLl92Um9vZi5yZW5kZXIodGhpcy5fcHJpc21GQk8uZ2V0VGV4dHVyZSgpLCB0aGlzLl9jb25jcmV0ZVRleHR1cmUsIHRoaXMuYXVkaW9EYXRhLCB0aGlzLmZib1NpemUpO1xuXG5cdFx0XHR0aGlzLl92Q2lyY2xlLnJlbmRlcih0aGlzLl9sZWZ0V2FsbEZCTy5nZXRUZXh0dXJlKCksIHRoaXMuYXVkaW9EYXRhKTtcblxuXHRcdFx0Ly8gZ2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcblxuXG4gICAgICAgICAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgICAgICAgICAgZ2wuZGlzYWJsZShnbC5ERVBUSF9URVNUKTtcblxuXHRcdFx0dGhpcy5fdkxhbXAucmVuZGVyKHRoaXMuX2JsdXJIRkJPLmdldFRleHR1cmUoKSk7XG5cblx0XHRcdC8vIGRlYnVnZ2VyO1xuXHRcdFx0Ly8gdGhpcy5fdlRlc3RJbXBvcnQucmVuZGVyKHRoaXMuX2NvbmNyZXRlVGV4dHVyZSwgdGhpcy5hdWRpb0RhdGEpO1xuXG5cdFx0fVxuXHR9ZWxzZXtcblx0XHR0aGlzLm9ydGhvVHJhbnNmb3Jtcy5zZXRDYW1lcmEodGhpcy5vcnRob0NhbWVyYSk7XG5cdFx0Ly8gdGhpcy5fdkJhY2tncm91bmQucmVuZGVyKHRoaXMuX3Blcm1UZXh0dXJlLCB0aGlzLl9zaW1wbGV4VGV4dHVyZSwgdGhpcy5fY29uY3JldGVUZXh0dXJlLCB0aGlzLmJhY2tncm91bmRMb2FkZXJGYWRlcik7XG5cdH1cblx0XHRcblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xuXHRcbn07XG5cbnAub25SZXNpemUgPSBmdW5jdGlvbigpe1xuXG5cdHMub25SZXNpemUuY2FsbCh0aGlzKTtcblxuXHR2YXIgdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHR2YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0dGhpcy5sb2FkZXJTY3JlZW4ub25SZXNpemUodyxoKTtcblx0dGhpcy5lbmRTY3JlZW4ub25SZXNpemUodyxoKTtcblxuXHRcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZU1haW47IiwiLy8gYXBwLmpzXG4vLyB2YXIgZGF0ID0gcmVxdWlyZShcImRhdC1ndWlcIik7XG5cbk1hdGguZWFzZUluRXhwbyA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XG5cdHJldHVybiBjICogTWF0aC5wb3coIDIsIDEwICogKHQvZCAtIDEpICkgKyBiO1xufTtcblxuXG5NYXRoLmVhc2VPdXRFeHBvID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcblx0cmV0dXJuIGMgKiAoIC1NYXRoLnBvdyggMiwgLTEwICogdC9kICkgKyAxICkgKyBiO1xufTtcblxuKGZ1bmN0aW9uKCkge1xuXHRcblx0dmFyIFNjZW5lTWFpbiA9IHJlcXVpcmUoXCIuL1NjZW5lTWFpblwiKTtcblxuXHRcblxuXHRBcHAgPSBmdW5jdGlvbigpIHtcblx0XHRpZihkb2N1bWVudC5ib2R5KSB0aGlzLl9pbml0KCk7XG5cdFx0ZWxzZSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgdGhpcy5faW5pdC5iaW5kKHRoaXMpKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgcCA9IEFwcC5wcm90b3R5cGU7XG5cblx0cC5faW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdHRoaXMuY2FudmFzLmNsYXNzTmFtZSA9IFwiTWFpbi1DYW52YXNcIjtcblx0XHR0aGlzLmNhbnZhcy5pZCA9ICdnbCc7XG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cdFx0Ly8gYm9uZ2lvdmkuR0wuaW5pdCh0aGlzLmNhbnZhcyk7XG5cblx0XHR3aW5kb3cuTlMgPSB7fTtcblx0XHR3aW5kb3cuTlMuR0wgPSB7fTtcblx0XHR3aW5kb3cuTlMuR0wucGFyYW1zID0ge307XG5cdFx0d2luZG93Lk5TLkdMLnBhcmFtcy53aWR0aCA9IDcwO1xuXHRcdHdpbmRvdy5OUy5HTC5wYXJhbXMuaGVpZ2h0ID0gNjA7XG5cdFx0d2luZG93Lk5TLkdMLnBhcmFtcy5kZXB0aCA9IDYwO1xuXG5cdFx0Ly8gdGhpcy5fc2NlbmUgPSBuZXcgU2NlbmVBcHAoKTtcblx0XHQvLyBib25naW92aS5TY2hlZHVsZXIuYWRkRUYodGhpcywgdGhpcy5fbG9vcCk7XG5cblx0XHQvLyB0aGlzLmd1aSA9IG5ldyBkYXQuR1VJKHt3aWR0aDozMDB9KTtcblxuXHRcdC8vIHRoaXMuX3NjZW5lTWFpbiA9IG5ldyBTY2VuZU1haW4oKTtcblx0XHQvLyB0aGlzLl9zY2VuZU1haW4uaW5pdCgpO1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHdpbmRvdy5OUy5Db25jcmV0ZSA9IG5ldyBJbWFnZSgpO1xuXHRcdHdpbmRvdy5OUy5Db25jcmV0ZS5vbmxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gc2NlbmUgPSBuZXcgd2luZG93Lk5TLkdMLlNjZW5lTWFpbigpO1xuXHRcdFx0Ly8gc2NlbmUuaW5pdCgpO1xuXG5cdFx0XHQvLyB0cmlnZ2VyKCk7XG5cblx0XHRcdHNlbGYuX3NjZW5lTWFpbiA9IG5ldyBTY2VuZU1haW4oKTtcblx0XHRcdHNlbGYuX3NjZW5lTWFpbi5pbml0KCk7XG5cblx0XHRcdHNlbGYuX2xvb3AoKTtcblxuXHRcdH07XG5cdFx0d2luZG93Lk5TLkNvbmNyZXRlLnNyYyA9ICdhc3NldHMvbWF0dGVmbG9vci5qcGcnO1xuXG5cdFx0Ly8gdmFyIHNlbGYgPSB0aGlzO1xuXHRcdC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuXHRcdC8vIFx0Ym9uZ2lvdmkuU2NoZWR1bGVyLmFkZEVGKHNlbGYsIHNlbGYuX2xvb3ApO1xuXHRcdC8vIH0sMjAwKTtcblx0fTtcblxuXHRwLl9sb29wID0gZnVuY3Rpb24oKXtcblxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9sb29wLmJpbmQodGhpcykpO1xuXG5cdFx0dGhpcy5fc2NlbmVNYWluLmxvb3AoKVxuXHR9O1xuXG5cdC8vIHAuX2xvb3AgPSBmdW5jdGlvbigpIHtcblx0Ly8gXHR0aGlzLl9zY2VuZU1haW4ubG9vcCgpO1xuXHQvLyB9O1xuXG59KSgpO1xuXG5cbm5ldyBBcHAoKTsiLCIvL0Jhc2VDYW1lcmEuanNcblxuZnVuY3Rpb24gQmFzZUNhbWVyYSgpe307XG5cbnZhciBwID0gQmFzZUNhbWVyYS5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIGRlZ1RvUmFkaWFuKGRlZ3JlZXMpIHtcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xufTtcblxucC5pbml0ID0gZnVuY3Rpb24odHlwZSl7XG5cblx0dGhpcy50eXBlID0gdHlwZTtcblxuXHRpZiAodGhpcy50eXBlID09ICdvcnRobycpe1xuXHRcdHRoaXMucHJvak1hdHJpeCA9IG1hdDQuY3JlYXRlKCk7XG5cdFx0dGhpcy52aWV3TWF0cml4ID0gbWF0NC5jcmVhdGUoKTtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdC8vIFJhdyBQb3NpdGlvbiBWYWx1ZXNcblx0dGhpcy5sZWZ0ID0gdmVjMy5mcm9tVmFsdWVzKDEuMCwgMC4wLCAwLjApOyAvLyBDYW1lcmEgTGVmdCB2ZWN0b3Jcblx0dGhpcy51cCA9IHZlYzMuZnJvbVZhbHVlcygwLjAsIDEuMCwgMC4wKTsgLy8gQ2FtZXJhIFVwIHZlY3RvclxuXHR0aGlzLmRpciA9IHZlYzMuZnJvbVZhbHVlcygwLjAsIDAuMCwgMS4wKTsgLy8gVGhlIGRpcmVjdGlvbiBpdHMgbG9va2luZyBhdFxuXHR0aGlzLnBvcyA9IHZlYzMuZnJvbVZhbHVlcygwLjAsIDAuMCwgMC4wKTsgLy8gQ2FtZXJhIGV5ZSBwb3NpdGlvblxuXHR0aGlzLnByb2plY3Rpb25UcmFuc2Zvcm0gPSBudWxsO1xuXHR0aGlzLnByb2pNYXRyaXg7XG5cdHRoaXMudmlld01hdHJpeDtcblxuXHR0aGlzLmZpZWxkT2ZWaWV3ID0gNTU7XG5cdHRoaXMubmVhckNsaXBwaW5nUGxhbmUgPSAwLjE7XG5cdHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSA9IDEwMDAuMDtcbn07XG5cbnAuYXBwbHkgPSBmdW5jdGlvbihhc3BlY3RSYXRpbyl7XG5cblx0dmFyIG1hdFZpZXc9bWF0NC5jcmVhdGUoKTtcblx0dmFyIGxvb2tBdFBvc2l0aW9uPXZlYzMuY3JlYXRlKCk7XG5cdHZlYzMuYWRkKGxvb2tBdFBvc2l0aW9uLCB0aGlzLnBvcywgdGhpcy5kaXIpO1xuXHRtYXQ0Lmxvb2tBdChtYXRWaWV3LCB0aGlzLnBvcywgbG9va0F0UG9zaXRpb24sIHRoaXMudXApO1xuXHRtYXQ0LnRyYW5zbGF0ZShtYXRWaWV3LCBtYXRWaWV3LCB2ZWMzLmZyb21WYWx1ZXMoLXRoaXMucG9zWzBdLCAtdGhpcy5wb3NbMV0sIC10aGlzLnBvc1syXSkpO1xuXHR0aGlzLnZpZXdNYXRyaXggPSBtYXRWaWV3O1xuXG5cdC8vIGNvbnNvbGUubG9nKHRoaXMuZGlyLCB0aGlzLnVwKTtcblxuXHQvLyBDcmVhdGUgYSBwcm9qZWN0aW9uIG1hdHJpeCBhbmQgc3RvcmUgaXQgaW5zaWRlIGEgZ2xvYmFsbHkgYWNjZXNzaWJsZSBwbGFjZS5cblx0dGhpcy5wcm9qTWF0cml4PW1hdDQuY3JlYXRlKCk7XG5cdG1hdDQucGVyc3BlY3RpdmUodGhpcy5wcm9qTWF0cml4LCBkZWdUb1JhZGlhbih0aGlzLmZpZWxkT2ZWaWV3KSwgYXNwZWN0UmF0aW8sIHRoaXMubmVhckNsaXBwaW5nUGxhbmUsIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZSlcblxufTtcblxucC5nZXRGYXJDbGlwcGluZ1BsYW5lID0gZnVuY3Rpb24oKXtcblx0cmV0dXJuIHRoaXMuZmFyQ2xpcHBpbmdQbGFuZTtcbn07XG5cbnAuZ2V0RmllbGRPZlZpZXcgPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiB0aGlzLmZpZWxkT2ZWaWV3O1xufTtcblxucC5nZXRMZWZ0ID0gZnVuY3Rpb24oKXtcblxuXHRyZXR1cm4gdmVjMy5jbG9uZSh0aGlzLmxlZnQpO1xufTtcblxucC5nZXROZWFyQ2xpcHBpbmdQbGFuZSA9IGZ1bmN0aW9uKCl7XG5cblx0cmV0dXJuIHRoaXMubmVhckNsaXBwaW5nUGxhbmU7XG59O1xuXG5wLmdldFBvc2l0aW9uID0gZnVuY3Rpb24oKXtcblxuXHRyZXR1cm4gdmVjMy5jbG9uZSh0aGlzLnBvcyk7XG59O1xuXG5wLmdldFByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiBtYXQ0LmNsb25lKHRoaXMucHJvak1hdHJpeCk7XG59O1xuXG5wLmdldFZpZXdNYXRyaXggPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiBtYXQ0LmNsb25lKHRoaXMudmlld01hdHJpeCk7XG59O1xuXG5wLmdldFVwID0gZnVuY3Rpb24oKXtcblxuXHRyZXR1cm4gdmVjMy5jbG9uZSh0aGlzLnVwKTtcbn07XG5cbnAuc2V0RmFyQ2xpcHBpbmdQbGFuZSA9IGZ1bmN0aW9uKCl7XG5cblx0aWYgKGZjcCA+IDApXG5cdHtcblx0XHR0aGlzLmZhckNsaXBwaW5nUGxhbmUgPSBmY3A7XG5cdH1cbn07XG5cbnAuc2V0RmllbGRPZlZpZXcgPSBmdW5jdGlvbihmb3Ype1xuXG5cdGlmIChmb3YgPiAwICYmIGZvdiA8IDE4MClcblx0e1xuXHRcdHRoaXMuZmllbGRPZlZpZXcgPSBmb3Y7XG5cdH1cbn07XG5cbnAuc2V0TmVhckNsaXBwaW5nUGxhbmUgPSBmdW5jdGlvbihuY3Ape1xuXG5cdGlmIChuY3AgPiAwKVxuXHR7XG5cdFx0dGhpcy5uZWFyQ2xpcHBpbmdQbGFuZSA9IG5jcDtcblx0fVxufTtcblxucC51cGRhdGUgPSBmdW5jdGlvbih0aW1lU3RlcCwgbGluZVZlbCwgYW5ndWxhclZlbCl7XG5cblx0aWYgKHZlYzMuc3F1YXJlZExlbmd0aChsaW5WZWwpPT0wICYmIHZlYzMuc3F1YXJlZExlbmd0aChhbmd1bGFyVmVsKT09MCkgcmV0dXJuIGZhbHNlO1xuXG5cdGlmICh2ZWMzLnNxdWFyZWRMZW5ndGgobGluVmVsKSA+IDAuMClcblx0e1xuXHRcdC8vIEFkZCBhIHZlbG9jaXR5IHRvIHRoZSBwb3NpdGlvblxuXHRcdHZlYzMuc2NhbGUodmVsVmVjLHZlbFZlYywgdGltZVN0ZXApO1xuXG5cdFx0dmVjMy5hZGQodGhpcy5wb3MsIHZlbFZlYywgdGhpcy5wb3MpO1xuXHR9XG5cblx0aWYgKHZlYzMuc3F1YXJlZExlbmd0aChhbmd1bGFyVmVsKSA+IDAuMClcblx0e1xuXHRcdC8vIEFwcGx5IHNvbWUgcm90YXRpb25zIHRvIHRoZSBvcmllbnRhdGlvbiBmcm9tIHRoZSBhbmd1bGFyIHZlbG9jaXR5XG5cdFx0dGhpcy5waXRjaChhbmd1bGFyVmVsWzBdICogdGltZVN0ZXApO1xuXHRcdHRoaXMueWF3KGFuZ3VsYXJWZWxbMV0gKiB0aW1lU3RlcCk7XG5cdFx0dGhpcy5yb2xsKGFuZ3VsYXJWZWxbMl0gKiB0aW1lU3RlcCk7XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUNhbWVyYTsiLCIvL0ZyZWVDYW1lcmEuanNcblxudmFyIEJhc2VDYW1lcmEgPSByZXF1aXJlKCcuLi9jYW1lcmFzL0Jhc2VDYW1lcmEnKTtcblxuZnVuY3Rpb24gRnJlZUNhbWVyYSgpe307XG5cbmZ1bmN0aW9uIGlzVmVjdG9yRXF1YWwodmVjb25lLHZlY3R3bylcbiAge1xuICAgaWYodmVjb25lWzBdPT12ZWN0d29bMF0mJnZlY29uZVsxXT09dmVjdHdvWzFdJiZ2ZWNvbmVbMl09PXZlY3R3b1syXSlcbiAgIHtcbiAgIHJldHVybiB0cnVlO1xuICAgfVxuICAgZWxzZXtcbiAgICByZXR1cm4gZmFsc2U7XG4gICB9XG4gIH1cblxudmFyIHAgPSBGcmVlQ2FtZXJhLnByb3RvdHlwZSA9IG5ldyBCYXNlQ2FtZXJhKCk7XG52YXIgcyA9IEJhc2VDYW1lcmEucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gIHMuaW5pdC5jYWxsKHRoaXMpO1xuXG4gIHRoaXMubGluVmVsID0gdmVjMy5mcm9tVmFsdWVzKDAuMCwgMC4wLCAwLjApOyAvLyBBbmltYXRpb24gb2YgcG9zaXRpb25zXG4gIHRoaXMuYW5nVmVsID0gdmVjMy5mcm9tVmFsdWVzKDAuMCwgMC4wLCAwLjApOyAvLyBBbmltYXRpb25zIG9mIHJvdGF0aW9uIGFyb3VuZCAoc2lkZSBWZWN0b3IsIHVwIFZlY3RvciwgZGlyIFZlY3RvcilcblxuXG59O1xuXG5wLnlhdyA9IGZ1bmN0aW9uKGFuZ2xlKXtcblxuICB0aGlzLnJvdGF0ZU9uQXhpcyh0aGlzLnVwLCBhbmdsZSk7XG59O1xuXG5wLnBpdGNoID0gZnVuY3Rpb24oYW5nbGUpe1xuXG4gIHRoaXMucm90YXRlT25BeGlzKHRoaXMubGVmdCwgYW5nbGUpO1xufTtcblxucC5yb2xsID0gZnVuY3Rpb24oYW5nbGUpe1xuXG4gIHRoaXMucm90YXRlT25BeGlzKHRoaXMuZGlyLCBhbmdsZSk7XG59O1xuXG5wLnJvdGF0ZU9uQXhpcyA9IGZ1bmN0aW9uKGF4aXNWZWMsIGFuZ2xlKXtcblxuICAvLyBDcmVhdGUgYSBwcm9wZXIgUXVhdGVybmlvbiBiYXNlZCBvbiBsb2NhdGlvbiBhbmQgYW5nbGVcbiAgdmFyIHF1YXRlPXF1YXQuY3JlYXRlKCk7XG4gIHF1YXQuc2V0QXhpc0FuZ2xlKHF1YXRlLCBheGlzVmVjLCBhbmdsZSlcbiAgXG4gIC8vIENyZWF0ZSBhIHJvdGF0aW9uIE1hdHJpeCBvdXQgb2YgdGhpcyBxdWF0ZXJuaW9uXG4gIHZlYzMudHJhbnNmb3JtUXVhdCh0aGlzLmRpciwgdGhpcy5kaXIsIHF1YXRlKSAgXG4gIHZlYzMudHJhbnNmb3JtUXVhdCh0aGlzLmxlZnQsIHRoaXMubGVmdCwgcXVhdGUpICBcbiAgdmVjMy50cmFuc2Zvcm1RdWF0KHRoaXMudXAsIHRoaXMudXAsIHF1YXRlKSAgXG4gIHZlYzMubm9ybWFsaXplKHRoaXMudXAsdGhpcy51cCk7XG4gIHZlYzMubm9ybWFsaXplKHRoaXMubGVmdCx0aGlzLmxlZnQpO1xuICB2ZWMzLm5vcm1hbGl6ZSh0aGlzLmRpcix0aGlzLmRpcik7XG5cbiAgdGhpcy51cCA9IHZlYzMuZnJvbVZhbHVlcygwLjAsIDEuMCwgMC4wKTsgLy8gQ2FtZXJhIFVwIHZlY3RvclxufTtcblxucC5zZXRBbmd1bGFyVmVsID0gZnVuY3Rpb24obmV3VmVjKXtcblxuICB0aGlzLmFuZ1ZlbFswXSA9IG5ld1ZlY1swXTtcbiAgdGhpcy5hbmdWZWxbMV0gPSBuZXdWZWNbMV07XG4gIHRoaXMuYW5nVmVsWzJdID0gbmV3VmVjWzJdO1xufTtcblxucC5nZXRBbmd1bGFyVmVsID0gZnVuY3Rpb24oKXtcblxuICByZXR1cm4gdmVjMy5jbG9uZSh0aGlzLmFuZ1ZlbCk7XG59O1xuXG5wLmdldExpbmVhclZlbCA9IGZ1bmN0aW9uKCl7XG5cbiAgcmV0dXJuIHZlYzMuY2xvbmUodGhpcy5saW5WZWwpO1xufTtcblxucC5zZXRMaW5lYXJWZWwgPSBmdW5jdGlvbigpe1xuXG4gIHRoaXMubGluVmVsWzBdID0gbmV3VmVjWzBdO1xuICB0aGlzLmxpblZlbFsxXSA9IG5ld1ZlY1sxXTtcbiAgdGhpcy5saW5WZWxbMl0gPSBuZXdWZWNbMl07XG59O1xuXG5wLnNldExvb2tBdFBvaW50ID0gZnVuY3Rpb24obmV3VmVjKXtcblxuICAgIC8vIGlmIHRoZSBwb3NpdGlvbiBoYXNuJ3QgeWV0IGJlZW4gY2hhbmdlZCBhbmQgdGhleSB3YW50IHRoZVxuICAvLyBjYW1lcmEgdG8gbG9vayBhdCBbMCwwLDBdLCB0aGF0IHdpbGwgY3JlYXRlIGEgcHJvYmxlbS5cbiAgaWYgKGlzVmVjdG9yRXF1YWwodGhpcy5wb3MsIFswLCAwLCAwXSkgJiYgaXNWZWN0b3JFcXVhbChuZXdWZWMsIFswLCAwLCAwXSkpXG4gIHtcbiAgXG4gIH1cbiAgZWxzZVxuICB7XG4gICAgLy8gRmlndXJlIG91dCB0aGUgZGlyZWN0aW9uIG9mIHRoZSBwb2ludCB3ZSBhcmUgbG9va2luZyBhdC5cbiAgICB2ZWMzLnN1YnRyYWN0KHRoaXMuZGlyLG5ld1ZlYywgdGhpcy5wb3MpO1xuICAgICB2ZWMzLm5vcm1hbGl6ZSh0aGlzLmRpcix0aGlzLmRpcik7XG4gICAgLy8gQWRqdXN0IHRoZSBVcCBhbmQgTGVmdCB2ZWN0b3JzIGFjY29yZGluZ2x5XG4gICAgdmVjMy5jcm9zcyh0aGlzLmxlZnQsdmVjMy5mcm9tVmFsdWVzKDAsIDEsIDApLCB0aGlzLmRpciApO1xuICAgIHZlYzMubm9ybWFsaXplKHRoaXMubGVmdCx0aGlzLmxlZnQpO1xuICAgIHZlYzMuY3Jvc3ModGhpcy51cCx0aGlzLmRpciwgdGhpcy5sZWZ0KTtcbiAgICB2ZWMzLm5vcm1hbGl6ZSh0aGlzLnVwLHRoaXMudXApO1xuICB9XG59O1xuXG5wLnNldFBvc2l0aW9uID0gZnVuY3Rpb24obmV3VmVjKXtcblxuICB0aGlzLnBvcz12ZWMzLmZyb21WYWx1ZXMobmV3VmVjWzBdLG5ld1ZlY1sxXSxuZXdWZWNbMl0pO1xuXG4gIHZhciB4TWF4ID0gMjU7XG4gIHZhciB6TWF4ID0gMjU7XG5cbiAgaWYgKHRoaXMucG9zWzBdID4geE1heClcbiAgICB0aGlzLnBvc1swXSA9IHhNYXg7XG4gIGVsc2UgaWYgKHRoaXMucG9zWzBdIDwgLXhNYXgpXG4gICAgdGhpcy5wb3NbMF0gPSAteE1heDtcbiAgZWxzZSBpZiAodGhpcy5wb3NbMl0gPiB6TWF4KVxuICAgIHRoaXMucG9zWzJdID0gek1heDtcbiAgZWxzZSBpZiAodGhpcy5wb3NbMl0gPCAtek1heClcbiAgICB0aGlzLnBvc1syXSA9IC16TWF4O1xuXG59O1xuXG5wLnNldFVwVmVjdG9yID0gZnVuY3Rpb24obmV3VmVjKXtcblxuICB0aGlzLnVwWzBdID0gbmV3VmVjWzBdO1xuICB0aGlzLnVwWzFdID0gbmV3VmVjWzFdO1xuICB0aGlzLnVwWzJdID0gbmV3VmVjWzJdO1xufTtcblxuLy8gcC5tb3ZlU2lkZSA9IGZ1bmN0aW9uKHMpe1xuXG4vLyAgIHZhciBuZXdQb3NpdGlvbiA9IFt0aGlzLnBvc1swXSAtIHMqdGhpcy5sZWZ0WzBdLHRoaXMucG9zWzFdIC0gcyp0aGlzLmxlZnRbMV0sdGhpcy5wb3NbMl0gLSBzKnRoaXMubGVmdFsyXV07XG5cbi8vICAgdGhpcy5zZXRQb3NpdGlvbihuZXdQb3NpdGlvbik7XG4vLyB9O1xuXG5cbnAubW92ZUZvcndhcmQgPSBmdW5jdGlvbihzKXtcblxuICB2YXIgZGlyVGVtcCA9IHRoaXMuZGlyLnNsaWNlKDApO1xuICBkaXJUZW1wWzFdID0gMDtcblxuICB2YXIgbmV3UG9zaXRpb24gPSBbdGhpcy5wb3NbMF0gLSBzKnRoaXMuZGlyWzBdLHRoaXMucG9zWzFdIC0gcyp0aGlzLmRpclsxXSx0aGlzLnBvc1syXSAtIHMqdGhpcy5kaXJbMl1dO1xuXG4gIHRoaXMuc2V0UG9zaXRpb24obmV3UG9zaXRpb24pO1xufTtcblxucC51cGRhdGUgPSBmdW5jdGlvbih0aW1lU3RlcCl7XG5cbiAgaWYgKHZlYzMuc3F1YXJlZExlbmd0aCh0aGlzLmxpblZlbCk9PTAgJiYgdmVjMy5zcXVhcmVkTGVuZ3RoKHRoaXMuYW5ndWxhclZlbCk9PTApIFxuICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHZlYzMuc3F1YXJlZExlbmd0aCh0aGlzLmxpblZlbCkgPiAwLjApXG4gIHtcbiAgICAvLyBBZGQgYSB2ZWxvY2l0eSB0byB0aGUgcG9zaXRpb25cbiAgICB2ZWMzLnNjYWxlKHRoaXMudmVsVmVjLHRoaXMudmVsVmVjLCB0aW1lU3RlcCk7XG5cbiAgICB2ZWMzLmFkZCh0aGlzLnBvcywgdGhpcy52ZWxWZWMsIHRoaXMucG9zKTtcbiAgfVxuXG4gIGlmICh2ZWMzLnNxdWFyZWRMZW5ndGgodGhpcy5hbmdWZWwpID4gMC4wKVxuICB7XG4gICAgLy8gQXBwbHkgc29tZSByb3RhdGlvbnMgdG8gdGhlIG9yaWVudGF0aW9uIGZyb20gdGhlIGFuZ3VsYXIgdmVsb2NpdHlcbiAgICB0aGlzLnBpdGNoKHRoaXMuYW5nVmVsWzBdICogdGltZVN0ZXApO1xuICAgIHRoaXMueWF3KHRoaXMuYW5nVmVsWzFdICogdGltZVN0ZXApO1xuICAgIHRoaXMucm9sbCh0aGlzLmFuZ1ZlbFsyXSAqIHRpbWVTdGVwKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGcmVlQ2FtZXJhOyIsIi8vQ29sbGFkYUxvYWRlci5qc1xuXG5mdW5jdGlvbiBDb2xsYWRhTG9hZGVyKCl7fTtcblxudmFyIHAgPSBDb2xsYWRhTG9hZGVyLnByb3RvdHlwZTtcblxuXG5wLmxvYWQgPSBmdW5jdGlvbihwYXRoLCB0eXBlLCBvbkxvYWRlZENhbGxiYWNrLCBjYWxsYmFja1Njb3BlKXtcblxuXHR0aGlzLnR5cGUgPSB0eXBlO1xuXHR0aGlzLm9uTG9hZGVkQ2FsbGJhY2sgPSBvbkxvYWRlZENhbGxiYWNrO1xuXHR0aGlzLmNhbGxiYWNrU2NvcGUgPSBjYWxsYmFja1Njb3BlO1xuXG5cdHRoaXMuZGF0YUxvYWRlZCA9IGZhbHNlO1xuXG5cdHRoaXMuY2hpbGRyZW5EYXRhID0gW107XG5cdHRoaXMucGFyZW50RGF0YSA9IFtdO1xuXHR0aGlzLmFuaW1hdGlvbkRhdGEgPSBbXTtcblxuXHRDb2xsYWRhLmRhdGFQYXRoID0gJ2ltcG9ydHMvJztcblx0Q29sbGFkYS5sb2FkKCBwYXRoLCB0aGlzLl9vbkxvYWRlZC5iaW5kKHRoaXMpICk7XG5cblx0XG59O1xuXG5wLmdldFBhcmVudERhdGEgPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiB0aGlzLnBhcmVudERhdGEuc2xpY2UoMCk7XG59O1xuXG5wLl9vbkxvYWRlZCA9IGZ1bmN0aW9uKGUpe1xuXG5cdHZhciByb290ID0gZS5yb290O1xuXHR2YXIgc3ViVmlld3MgPSBbXTtcblx0Zm9yICh2YXIga2V5IGluIHJvb3Qpe1xuXG5cdFx0aWYgKGtleSA9PSAnYW5pbWF0aW9ucycpe1xuXHRcdFx0Ly8gYW5pbWF0aW9uSUQgPSByb290W2tleV07XG5cdFx0XHQvLyB0aGlzLl9hbmltYXRpb24gPSBuZXcgVmlld0FuaW1hdGlvbigpO1xuXHRcdFx0Ly8gdGhpcy5fYW5pbWF0aW9uLmluaXQoZS5yZXNvdXJjZXNbcm9vdFsnYW5pbWF0aW9ucyddXSk7XG5cblx0XHRcdHRoaXMuYW5pbWF0aW9uRGF0YS5wdXNoKGUucmVzb3VyY2VzW3Jvb3RbJ2FuaW1hdGlvbnMnXV0pO1xuXG5cdFx0fVxuXG5cdFx0aWYgKGtleSA9PSAnY2hpbGRyZW4nKXtcblx0XHRcdFxuXHRcdFx0aWYgKHJvb3Rba2V5XS5sZW5ndGggPiAwKXtcblx0XHRcdFx0dmFyIHBhcmVudCA9IHJvb3Rba2V5XTtcblxuXHRcdFx0XHRmb3IgKHZhciBpPTA7aTxwYXJlbnQubGVuZ3RoO2krKyl7XG5cdFx0XHRcdFx0Ly8gaWYgKHJvb3RbJ2FuaW1hdGlvbnMnXSl7XG5cdFx0XHRcdFx0Ly8gXHRhbmltYXRpb24gPSBlLnJlc291cmNlc1tyb290WydhbmltYXRpb25zJ11dO1xuXHRcdFx0XHRcdC8vIH1cblxuXHRcdFx0XHRcdC8vIHZhciBwYXJlbnRWaWV3ID0gbmV3IFZpZXdUZXN0KCk7XG5cdFx0XHRcdFx0Ly8gcGFyZW50Vmlldy5pbml0KHZlcnRQYXRoLCBmcmFnUGF0aCwgY2hpbGRyZW5baV0sIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcblx0XHRcdFx0XHQvLyB0aGlzLl9wYXJlbnRWaWV3ID0gcGFyZW50Vmlldztcblx0XHRcdFx0XHQvLyB0aGlzLl9wYXJlbnRWaWV3LnRyYW5zZm9ybXMgPSB0aGlzLnRyYW5zZm9ybXM7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gdmFyIG1lc2ggPSBlLm1lc2hlc1xuXG5cdFx0XHRcdFx0Ly8gZGVidWdnZXI7XG5cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAocGFyZW50W2ldLmNoaWxkcmVuLmxlbmd0aCA9PSAwKXtcblx0XHRcdFx0XHRcdHZhciBtZXNoID0gZS5tZXNoZXNbcGFyZW50W2ldLm1lc2hdO1xuXHRcdFx0XHRcdFx0dmFyIG1hdGVyaWFsID0gZS5tYXRlcmlhbHNbcGFyZW50W2ldLm1hdGVyaWFsXTtcblxuXHRcdFx0XHRcdFx0dGhpcy5wYXJlbnREYXRhLnB1c2goe2lkOiBwYXJlbnRbaV0uaWQsIG1lc2hEYXRhOiBtZXNoLCBtYXRlcmlhbERhdGE6IG1hdGVyaWFsLCBjaGlsZHJlbjogW119KTtcblx0XHRcdFx0XHRcdC8vIHRoaXMucGFyZW50RGF0YSA9IHttZXNoRGF0YTogbWVzaCwgbWF0ZXJpYWxEYXRhOiBtYXRlcmlhbH07XG5cblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHZhciBwYXJlbnRPYmogPSB7fTtcblxuXHRcdFx0XHRcdFx0cGFyZW50T2JqLmlkID0gcGFyZW50W2ldLmlkO1xuXHRcdFx0XHRcdFx0dmFyIG1lc2ggPSBlLm1lc2hlc1twYXJlbnRbaV0ubWVzaF07XG5cdFx0XHRcdFx0XHR2YXIgbWF0ZXJpYWwgPSBlLm1hdGVyaWFsc1twYXJlbnRbaV0ubWF0ZXJpYWxdO1xuXG5cdFx0XHRcdFx0XHQvLyBwYXJlbnRPYmoubWVzaERhdGEgPSBtZXNoO1xuXHRcdFx0XHRcdFx0Ly8gcGFyZW50T2JqLm1hdGVyaWFsRGF0YSA9IG1hdGVyaWFsO1xuXHRcdFx0XHRcdFx0cGFyZW50T2JqLmNoaWxkcmVuID0gW107XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBxPTA7cTxwYXJlbnRbaV0uY2hpbGRyZW4ubGVuZ3RoO3ErKyl7XG5cblx0XHRcdFx0XHRcdFx0dmFyIGNoaWxkcmVuT2JqID0ge307XG5cblx0XHRcdFx0XHRcdFx0dmFyIHN1YlZpZXdEYXRhID0gcGFyZW50W2ldLmNoaWxkcmVuW3FdO1xuXG5cdFx0XHRcdFx0XHRcdHZhciBtZXNoID0gZS5tZXNoZXNbc3ViVmlld0RhdGEubWVzaF07XG5cdFx0XHRcdFx0XHRcdHZhciBtYXRlcmlhbCA9IGUubWF0ZXJpYWxzW3N1YlZpZXdEYXRhLm1hdGVyaWFsXTtcblxuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbk9iai5tZXNoRGF0YSA9IG1lc2g7XG5cdFx0XHRcdFx0XHRcdGNoaWxkcmVuT2JqLm1hdGVyaWFsRGF0YSA9IG1hdGVyaWFsO1xuXHRcdFx0XHRcdFx0XHRjaGlsZHJlbk9iai5pZCA9IHN1YlZpZXdEYXRhLmlkO1xuXG5cdFx0XHRcdFx0XHRcdHBhcmVudE9iai5jaGlsZHJlbi5wdXNoKGNoaWxkcmVuT2JqKTtcblx0XHRcdFx0XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHRoaXMucGFyZW50RGF0YS5wdXNoKHBhcmVudE9iaik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdC8vIHRoaXMuX2FuaW1hdGlvbi52aWV3c1t0aGlzLl9wYXJlbnRWaWV3LmRhdGEuaWRdID0gdGhpcy5fcGFyZW50Vmlldztcblx0Ly8gZm9yICh2YXIgaT0wO2k8c3ViVmlld3MubGVuZ3RoO2krKyl7XG5cdC8vIFx0dGhpcy5fYW5pbWF0aW9uLnZpZXdzW3N1YlZpZXdzW2ldLmRhdGEuaWRdID0gc3ViVmlld3NbaV07XG5cdC8vIH1cblxuXHQvLyBkZWJ1Z2dlcjtcblxuXHR0aGlzLmRhdGFMb2FkZWQgPSB0cnVlO1xuXG5cdHRoaXMub25Mb2FkZWRDYWxsYmFjay5jYWxsKHRoaXMuY2FsbGJhY2tTY29wZSwgdGhpcyk7XG5cblx0Ly8gdmFyIHNlbGYgPSB0aGlzO1xuXHQvLyBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cblx0Ly8gXHRzZWxmLl9hbmltYXRpb24uc3RhcnQoKTtcblx0Ly8gfSwyMDAwKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsYWRhTG9hZGVyOyIsIi8vRnJhbWVidWZmZXIuanNcblxudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL1RleHR1cmUnKTtcblxuZnVuY3Rpb24gRnJhbWVidWZmZXIoKXt9O1xuXG52YXIgcCA9IEZyYW1lYnVmZmVyLnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgbWFnRmlsdGVyLCBtaW5GaWx0ZXIsIHRleFR5cGUpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblxuXHR0aGlzLmlkID0gJyc7XG5cblx0dGhpcy50ZXhUeXBlID0gdGV4VHlwZTtcblx0dGhpcy53aWR0aCAgPSB3aWR0aDtcblx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdHRoaXMubWFnRmlsdGVyID0gbWFnRmlsdGVyPT11bmRlZmluZWQgPyBnbC5MSU5FQVIgOiBtYWdGaWx0ZXI7XG5cdHRoaXMubWluRmlsdGVyID0gbWluRmlsdGVyPT11bmRlZmluZWQgPyBnbC5MSU5FQVIgOiBtaW5GaWx0ZXI7XG5cblx0dGhpcy5kZXB0aFRleHR1cmVFeHQgXHQ9IGdsLmdldEV4dGVuc2lvbihcIldFQktJVF9XRUJHTF9kZXB0aF90ZXh0dXJlXCIpOyAvLyBPciBicm93c2VyLWFwcHJvcHJpYXRlIHByZWZpeFxuXG5cdHRoaXMudGV4dHVyZSAgICAgICAgICAgID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHR0aGlzLmRlcHRoVGV4dHVyZSAgICAgICA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0dGhpcy5nbFRleHR1cmVcdFx0XHQ9IG5ldyBUZXh0dXJlKCk7XG5cdHRoaXMuZ2xUZXh0dXJlLmluaXQodGhpcy50ZXh0dXJlLCB0cnVlKTtcblx0dGhpcy5nbERlcHRoVGV4dHVyZVx0XHQ9IG5ldyBUZXh0dXJlKCk7XG5cdHRoaXMuZ2xEZXB0aFRleHR1cmUuaW5pdCh0aGlzLmRlcHRoVGV4dHVyZSwgdHJ1ZSk7XG5cdHRoaXMuZnJhbWVCdWZmZXIgICAgICAgID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcdFx0XG5cdGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgdGhpcy5mcmFtZUJ1ZmZlcik7XG5cdHRoaXMuZnJhbWVCdWZmZXIud2lkdGggID0gdGhpcy53aWR0aDtcblx0dGhpcy5mcmFtZUJ1ZmZlci5oZWlnaHQgPSB0aGlzLmhlaWdodDtcblx0dmFyIHNpemUgICAgICAgICAgICAgICAgPSB0aGlzLndpZHRoO1xuXG5cblxuXHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0aGlzLnRleHR1cmUpO1xuICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLm1hZ0ZpbHRlcik7XG4gICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMubWluRmlsdGVyKTtcbiAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFKTtcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdC8vIGlmKHRoaXMubWFnRmlsdGVyID09IGdsLk5FQVJFU1QgJiYgdGhpcy5taW5GaWx0ZXIgPT0gZ2wuTkVBUkVTVCkgXG5cdC8vIFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB0aGlzLmZyYW1lQnVmZmVyLndpZHRoLCB0aGlzLmZyYW1lQnVmZmVyLmhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuRkxPQVQsIG51bGwpO1xuXHQvLyBlbHNlXG5cdC8vIFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB0aGlzLmZyYW1lQnVmZmVyLndpZHRoLCB0aGlzLmZyYW1lQnVmZmVyLmhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XG5cblx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB0aGlzLmZyYW1lQnVmZmVyLndpZHRoLCB0aGlzLmZyYW1lQnVmZmVyLmhlaWdodCwgMCwgZ2wuUkdCQSwgdGV4VHlwZSwgbnVsbCk7XG5cblx0Z2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XG5cblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy5kZXB0aFRleHR1cmUpO1xuXHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5ORUFSRVNUKTtcblx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XG5cdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xuXHRpZih0aGlzLmRlcHRoVGV4dHVyZUV4dCAhPSBudWxsKWdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuREVQVEhfQ09NUE9ORU5ULCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgMCwgZ2wuREVQVEhfQ09NUE9ORU5ULCBnbC5VTlNJR05FRF9TSE9SVCwgbnVsbCk7XG5cbiAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSwgMCk7XG4gICAgaWYodGhpcy5kZXB0aFRleHR1cmVFeHQgPT0gbnVsbCkge1xuICAgIFx0Y29uc29sZS5sb2coIFwibm8gZGVwdGggdGV4dHVyZVwiICk7XG4gICAgXHR2YXIgcmVuZGVyYnVmZmVyID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XG4gICAgXHRnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgcmVuZGVyYnVmZmVyKTtcbiAgICBcdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgdGhpcy5mcmFtZUJ1ZmZlci53aWR0aCwgdGhpcy5mcmFtZUJ1ZmZlci5oZWlnaHQpO1xuICAgIFx0Z2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgcmVuZGVyYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgIFx0Z2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlRFWFRVUkVfMkQsIHRoaXMuZGVwdGhUZXh0dXJlLCAwKTtcbiAgICB9XG4gICAgXG4gICAgXG5cbiAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcbiAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgbnVsbCk7XG4gICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcbn07XG5cblxuXG5wLmJpbmQgPSBmdW5jdGlvbigpIHtcblx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCB0aGlzLmZyYW1lQnVmZmVyKTtcbn07XG5cblxucC51bmJpbmQgPSBmdW5jdGlvbigpIHtcblx0Z2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcbn07XG5cblxucC5nZXRUZXh0dXJlID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmdsVGV4dHVyZTtcbn07XG5cblxucC5nZXREZXB0aFRleHR1cmUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZ2xEZXB0aFRleHR1cmU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZyYW1lYnVmZmVyO1xuIiwiLy9JbXBvcnRBbmltYXRpb24uanNcblxuZnVuY3Rpb24gSW1wb3J0QW5pbWF0aW9uKCl7fTtcblxudmFyIHAgPSBJbXBvcnRBbmltYXRpb24ucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbihhbmltYXRpb24pe1xuXG5cdHRoaXMudmlld3MgPSBbXTtcblx0dGhpcy5hbmltYXRpb24gPSBhbmltYXRpb247XG5cblx0dmFyIHRyYWNrcyA9IGFuaW1hdGlvbi50YWtlcy5kZWZhdWx0LnRyYWNrcztcblx0dGhpcy50cmFja3MgPSB0cmFja3M7XG5cdFxuXHQvLyB2YXIgc3RhcnRBbmltYXRpb24gPSB7fTtcblx0Ly8gc3RhcnRBbmltYXRpb24uZHVyYXRpb24gPSA1O1xuXHQvLyBzdGFydEFuaW1hdGlvbi52aWV3SWQgPSAnSUQ0Jztcblx0Ly8gc3RhcnRBbmltYXRpb24uZGF0YSA9IC01O1xuXHQvLyBzdGFydEFuaW1hdGlvbi5uYW1lID0gJ3RyYW5zbGF0ZSc7XG5cdFxuXHQvLyAvLyB0aGlzLnRyYWNrcy5wdXNoKHN0YXJ0QW5pbWF0aW9uKTtcblx0XG5cdC8vIHZhciBlbmRBbmltYXRpb24gPSB7fTtcblx0Ly8gZW5kQW5pbWF0aW9uLmR1cmF0aW9uID0gNTtcblx0Ly8gZW5kQW5pbWF0aW9uLnZpZXdJZCA9ICdJRDQnO1xuXHQvLyBlbmRBbmltYXRpb24uZGF0YSA9IC00MDtcblx0Ly8gZW5kQW5pbWF0aW9uLm5hbWUgPSAndHJhbnNsYXRlJztcblx0Ly8gdGhpcy50cmFja3MudW5zaGlmdChlbmRBbmltYXRpb24pO1xuXHRcblxuXHR0aGlzLl9jdWUgPSBbXTtcblxuXHQvLyB0aGlzLnN0YXJ0WXBvcyA9IC00MDtcblx0dGhpcy5tYWluSWQgPSAnSUQ0JztcblxuXHQvLyB0aGlzLmN1cnJlbnRZUG9zID0gLTQwO1xuXHQvLyB0aGlzLnRhcmdldFlQb3MgPSB0aGlzLmN1cnJlbnRZUG9zO1xuXG5cdC8vIHRoaXMuY3JlYXRlQ3VlKHRoaXMudHJhY2tzKTtcblx0dGhpcy5yZXNldCgpO1xuXG5cdC8vIGRlYnVnZ2VyO1xuXG5cdFxufTtcblxucC5jcmVhdGVDdWUgPSBmdW5jdGlvbih0cmFja3Mpe1xuXG5cdHRoaXMuX2N1ZSA9IFtdO1xuXG5cdC8vIGRlYnVnZ2VyO1xuXG5cdHRoaXMudG90YWxEdXJhdGlvbiA9IDA7XG5cdGZvciAodmFyIGk9dHJhY2tzLmxlbmd0aC0xO2k+PTA7aS0tKXtcblx0XHRcblx0XHR2YXIgY3VlID0ge307XG5cdFx0Y3VlLnN0YXJ0VGltZSA9IHRoaXMudG90YWxEdXJhdGlvbjtcblx0XHRjdWUuZHVyYXRpb24gPSB0cmFja3NbaV0uZHVyYXRpb247XG5cdFx0Y3VlLmRhdGEgPSB0cmFja3NbaV0uZGF0YTtcblx0XHRpZiAodHJhY2tzW2ldLm5hbWUgPT0gJ3RyYW5zbGF0ZScpe1xuXHRcdFx0Y3VlLnZpZXdJZCA9IHRyYWNrc1tpXS52aWV3SWQ7XG5cdFx0XHRjdWUuYW5pbWF0aW9uUHJvcCA9IHRyYWNrc1tpXS5uYW1lO1xuXHRcdH1lbHNle1xuXHRcdFx0Y3VlLnZpZXdJZCA9IHRyYWNrc1tpXS5wcm9wZXJ0eS5zdWJzdHIoMCwgdHJhY2tzW2ldLnByb3BlcnR5LmluZGV4T2YoJy8nKSk7XG5cdFx0XHRjdWUuYW5pbWF0aW9uUHJvcCA9IHRyYWNrc1tpXS5uYW1lLnN1YnN0cigwLCB0cmFja3NbaV0ubmFtZS5pbmRleE9mKCcuJykpO1xuXHRcdH1cblx0XHRcblx0XHQvLyBpZiAoY3VlLnZpZXdJZCA9PSAnSUQ2NycgfHwgY3VlLnZpZXdJZCA9PSAnSUQ0NycpXG5cdFx0dGhpcy5fY3VlLnB1c2goY3VlKTtcblx0XHR0aGlzLnRvdGFsRHVyYXRpb24gKz0gdHJhY2tzW2ldLmR1cmF0aW9uO1xuXHRcdC8vIGRlYnVnZ2VyO1xuXHR9XG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fY3VlLmxlbmd0aDtpKyspe1xuXHRcdHRoaXMuX2N1ZVtpXS5ub3JtYWxpemVkU3RhcnRUaW1lID0gdGhpcy5fY3VlW2ldLnN0YXJ0VGltZSAvIHRoaXMudG90YWxEdXJhdGlvbjtcblx0XHR0aGlzLl9jdWVbaV0ubm9ybWFsaXplZEVuZFRpbWUgPSAodGhpcy5fY3VlW2ldLnN0YXJ0VGltZSArIHRoaXMuX2N1ZVtpXS5kdXJhdGlvbikgLyB0aGlzLnRvdGFsRHVyYXRpb247XG5cdH1cblx0XG5cdC8vIGRlYnVnZ2VyO1xuXG59O1xuXG5wLnJlc2V0ID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLnN0YXJ0VHJhbnNsYXRlVGltZSA9IHVuZGVmaW5lZDtcblx0dGhpcy5lbmRUcmFuc2xhdGVUaW1lID0gdW5kZWZpbmVkO1xuXG5cdHRoaXMuY3JlYXRlQ3VlKHRoaXMudHJhY2tzKTtcblxuXHR0aGlzLmN1cnJlbnRUcmFjayA9IHRoaXMuX2N1ZS5zaGlmdCgpO1xuXG59O1xuXG5cblxucC51cGRhdGUgPSBmdW5jdGlvbihub3JtYWxpemVkKXtcblxuXHRcblx0XG5cdGlmIChub3JtYWxpemVkID4gLS40ICYmIG5vcm1hbGl6ZWQgPCAwKXtcblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcblx0XHR2YXIgZHVyYXRpb24gPSAyO1xuXHRcdGlmICh0aGlzLnN0YXJ0VHJhbnNsYXRlVGltZSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0dGhpcy5zdGFydFRyYW5zbGF0ZVRpbWUgPSBub3cvMTAwMDtcblx0XHRcblx0XHR2YXIgY3VycmVudFNlYyA9IChub3cvMTAwMCAtIHRoaXMuc3RhcnRUcmFuc2xhdGVUaW1lKTtcblx0XHR2YXIgY2hhbmdlID0gMzU7XG5cdFx0dmFyIHN0YXJ0ID0gLTIwO1xuXHRcdC8vIHZhciBjaGFuZ2UgPSAwO1xuXHRcdC8vIHZhciBzdGFydCA9IDIwO1xuXG5cdFx0dmFyIGNhbGNWYWwgPSBNYXRoLmVhc2VPdXRFeHBvKGN1cnJlbnRTZWMsIHN0YXJ0LCBjaGFuZ2UsIGR1cmF0aW9uKTtcblx0XHRpZiAoY3VycmVudFNlYyA8IDIpXG5cdFx0XHR0aGlzLnZpZXdzW3RoaXMubWFpbklkXS5jdXJyZW50VHJhbnNsYXRlID0gY2FsY1ZhbDtcblxuXHRcdC8vIGNvbnNvbGUubG9nKGNhbGNWYWwsIGN1cnJlbnRTZWMpO1xuXHR9XG5cdGlmIChub3JtYWxpemVkID4gMS4yKXtcblx0XHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcblx0XHR2YXIgZHVyYXRpb24gPSAyO1xuXHRcdGlmICh0aGlzLmVuZFRyYW5zbGF0ZVRpbWUgPT09IHVuZGVmaW5lZClcblx0XHRcdHRoaXMuZW5kVHJhbnNsYXRlVGltZSA9IG5vdy8xMDAwO1xuXHRcdFxuXHRcdHZhciBjdXJyZW50U2VjID0gKG5vdy8xMDAwIC0gdGhpcy5lbmRUcmFuc2xhdGVUaW1lKTtcblx0XHR2YXIgY2hhbmdlID0gLTM1O1xuXHRcdHZhciBzdGFydCA9IDE1O1xuXHRcdC8vIHZhciBjaGFuZ2UgPSAwO1xuXHRcdC8vIHZhciBzdGFydCA9IDIwO1xuXG5cdFx0dmFyIGNhbGNWYWwgPSBNYXRoLmVhc2VJbkV4cG8oY3VycmVudFNlYywgc3RhcnQsIGNoYW5nZSwgZHVyYXRpb24pO1xuXHRcdGlmIChjdXJyZW50U2VjIDwgMilcblx0XHRcdHRoaXMudmlld3NbdGhpcy5tYWluSWRdLmN1cnJlbnRUcmFuc2xhdGUgPSBjYWxjVmFsO1xuXHR9XG5cdGlmIChub3JtYWxpemVkIDwgMCB8fCBub3JtYWxpemVkID4gMSkge1xuXHRcdC8vIHRoaXMudmlld3NbdGhpcy5tYWluSWRdLmN1cnJlbnRUcmFuc2xhdGUgPSB0aGlzLnN0YXJ0WXBvcztcblx0XHQvLyB0aGlzLnRhcmdldFlQb3MgPSAtNDA7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gaWYgKG5vcm1hbGl6ZWQgPCAxKVxuXHQvLyBcdHRoaXMudGFyZ2V0WVBvcyA9IC01O1xuXG5cblx0XG5cblx0dmFyIG5vcm1hbGl6ZWRWYWwgPSAobm9ybWFsaXplZCAtIHRoaXMuY3VycmVudFRyYWNrLm5vcm1hbGl6ZWRTdGFydFRpbWUpLyh0aGlzLmN1cnJlbnRUcmFjay5ub3JtYWxpemVkRW5kVGltZSAtIHRoaXMuY3VycmVudFRyYWNrLm5vcm1hbGl6ZWRTdGFydFRpbWUpO1xuXHQvLyBjb25zb2xlLmxvZyhub3JtYWxpemVkVmFsKTtcblxuXHRpZiAodGhpcy5jdXJyZW50VHJhY2suYW5pbWF0aW9uUHJvcCA9PSAndHJhbnNsYXRlJyl7XG5cdFx0Ly8gdGhpcy52aWV3c1t0aGlzLm1haW5JZF0uY3VycmVudFRyYW5zbGF0ZSA9IHRoaXMuc3RhcnRZcG9zICsgKCBub3JtYWxpemVkVmFsICogKE1hdGguYWJzKHRoaXMuc3RhcnRZcG9zKSArIHRoaXMuY3VycmVudFRyYWNrLmRhdGEpKTtcblx0XHQvLyB0aGlzLnRhcmdldFlQb3MgPSB0aGlzLmN1cnJlbnRUcmFjay5kYXRhO1xuXHR9XG5cdGVsc2Vcblx0XHR2YXIgdmFsID0gbm9ybWFsaXplZFZhbCAqIHRoaXMuY3VycmVudFRyYWNrLmRhdGFbM107XG5cblx0Ly8gY29uc29sZS5sb2coJ2lkeDogJywgdGhpcy5jdXJyZW50SWR4ICwnICBkaWZmOiAnLGRpZmYsICcgdmFsOiAnLHZhbCwgJyBkdXJhdGlvbjogJyxjdXJyZW50VHJhY2suZHVyYXRpb24sICcgZ29hbCB2YWw6ICcsY3VycmVudFRyYWNrLmRhdGFbM10pO1xuXG5cdC8vIGlmICh0aGlzLnZpZXdzW3RoaXMuY3VycmVudFRyYWNrLnZpZXdJZF0uY3VycmVudEFuaW1hdGlvblByb3BbMF0gIT0gdGhpcy5jdXJyZW50VHJhY2suYW5pbWF0aW9uUHJvcClcblx0dGhpcy52aWV3c1t0aGlzLmN1cnJlbnRUcmFjay52aWV3SWRdLmN1cnJlbnRBbmltYXRpb25Qcm9wID0gdGhpcy5jdXJyZW50VHJhY2suYW5pbWF0aW9uUHJvcDtcblx0dGhpcy52aWV3c1t0aGlzLmN1cnJlbnRUcmFjay52aWV3SWRdLmN1cnJlbnRBbmltYXRpb25WYWwgPSB2YWw7XG5cblxuXHRpZiAobm9ybWFsaXplZFZhbCA+PSAxKXtcblxuXHRcdGlmICh0aGlzLl9jdWUubGVuZ3RoID4gMClcblx0XHRcdHRoaXMuY3VycmVudFRyYWNrID0gdGhpcy5fY3VlLnNoaWZ0KCk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5ydW4gPSBmYWxzZTtcblxuXHRcdFxuXHR9XG5cblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEltcG9ydEFuaW1hdGlvbjsiLCIvL01lc2guanNcblxuZnVuY3Rpb24gTWVzaCgpe307XG5cbnZhciBwID0gTWVzaC5wcm90b3R5cGU7XG5cbnZhciBnbCA9IG51bGw7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRleFNpemUsIGluZGV4U2l6ZSwgZHJhd1R5cGUpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblxuXHR0aGlzLnZlcnRleFNpemUgPSB2ZXJ0ZXhTaXplO1xuXHR0aGlzLmluZGV4U2l6ZSA9IGluZGV4U2l6ZTtcblx0dGhpcy5kcmF3VHlwZSA9IGRyYXdUeXBlO1xuXHR0aGlzLmV4dHJhQXR0cmlidXRlcyA9IFtdO1xuXG5cdHRoaXMudGV4dHVyZVVzZWQgPSBmYWxzZTtcblxuXHR0aGlzLl9mbG9hdEFycmF5VmVydGV4ID0gdW5kZWZpbmVkO1xufTtcblxucC5idWZmZXJWZXJ0ZXggPSBmdW5jdGlvbihhcnlWZXJ0aWNlcykge1xuXHR2YXIgdmVydGljZXMgPSBbXTtcblxuXHRmb3IodmFyIGk9MDsgaTxhcnlWZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdGZvcih2YXIgaj0wOyBqPGFyeVZlcnRpY2VzW2ldLmxlbmd0aDsgaisrKSB2ZXJ0aWNlcy5wdXNoKGFyeVZlcnRpY2VzW2ldW2pdKTtcblx0fVxuXG5cdGlmKHRoaXMudkJ1ZmZlclBvcyA9PSB1bmRlZmluZWQgKSB0aGlzLnZCdWZmZXJQb3MgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudkJ1ZmZlclBvcyk7XG5cblx0aWYodGhpcy5fZmxvYXRBcnJheVZlcnRleCA9PSB1bmRlZmluZWQpIHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcblx0ZWxzZSB7XG5cdFx0aWYoYXJ5VmVydGljZXMubGVuZ3RoICE9IHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXgubGVuZ3RoKSB0aGlzLl9mbG9hdEFycmF5VmVydGV4ID0gbmV3IEZsb2F0MzJBcnJheSh2ZXJ0aWNlcyk7XG5cdFx0ZWxzZSB7XG5cdFx0XHRmb3IodmFyIGk9MDtpPGFyeVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXhbaV0gPSBhcnlWZXJ0aWNlc1tpXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5fZmxvYXRBcnJheVZlcnRleCwgZ2wuU1RBVElDX0RSQVcpO1xuXHR0aGlzLnZCdWZmZXJQb3MuaXRlbVNpemUgPSAzO1xufTtcblxuXG5wLmJ1ZmZlclRleENvb3JkcyA9IGZ1bmN0aW9uKGFyeVRleENvb3Jkcykge1xuXHR2YXIgY29vcmRzID0gW107XG5cblx0dGhpcy50ZXh0dXJlVXNlZCA9IHRydWU7XG5cblx0Zm9yKHZhciBpPTA7IGk8YXJ5VGV4Q29vcmRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Zm9yKHZhciBqPTA7IGo8YXJ5VGV4Q29vcmRzW2ldLmxlbmd0aDsgaisrKSBjb29yZHMucHVzaChhcnlUZXhDb29yZHNbaV1bal0pO1xuXHR9XG5cblx0dGhpcy52QnVmZmVyVVYgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudkJ1ZmZlclVWKTtcblx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoY29vcmRzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXHR0aGlzLnZCdWZmZXJVVi5pdGVtU2l6ZSA9IDI7XG59O1xuXG5cbnAuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIGl0ZW1TaXplLCBmbGF0KSB7XG5cdHZhciBpbmRleCA9IC0xXG5cdGZvcih2YXIgaT0wOyBpPHRoaXMuZXh0cmFBdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYodGhpcy5leHRyYUF0dHJpYnV0ZXNbaV0ubmFtZSA9PSBuYW1lKSB7XG5cdFx0XHR0aGlzLmV4dHJhQXR0cmlidXRlc1tpXS5kYXRhID0gZGF0YTtcblx0XHRcdGluZGV4ID0gaTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHZhciBidWZmZXJEYXRhID0gW107XG5cdGlmIChmbGF0KXtcblx0XHRidWZmZXJEYXRhID0gZGF0YS5zbGljZSgwKTtcblx0fWVsc2V7XG5cblxuXHRcdFxuXHRcdGZvcih2YXIgaT0wOyBpPGRhdGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFxuXHRcdFx0Zm9yKHZhciBqPTA7IGo8ZGF0YVtpXS5sZW5ndGg7IGorKykgYnVmZmVyRGF0YS5wdXNoKGRhdGFbaV1bal0pO1xuXHRcdH1cblx0fVxuXG5cdGlmKGluZGV4ID09IC0xKSB7XG5cdFx0dmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuXHRcdHZhciBmbG9hdEFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXJEYXRhKTtcblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZmxvYXRBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1x0XG5cdFx0dGhpcy5leHRyYUF0dHJpYnV0ZXMucHVzaCh7bmFtZTpuYW1lLCBkYXRhOmRhdGEsIGl0ZW1TaXplOml0ZW1TaXplLCBidWZmZXI6YnVmZmVyLCBmbG9hdEFycmF5OmZsb2F0QXJyYXl9KTtcblx0fSBlbHNlIHtcblx0XHR2YXIgYnVmZmVyID0gdGhpcy5leHRyYUF0dHJpYnV0ZXNbaW5kZXhdLmJ1ZmZlcjtcblx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKTtcblx0XHR2YXIgZmxvYXRBcnJheSA9IHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2luZGV4XS5mbG9hdEFycmF5O1xuXHRcdGZvcih2YXIgaT0wO2k8YnVmZmVyRGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZmxvYXRBcnJheVtpXSA9IGJ1ZmZlckRhdGFbaV07XG5cdFx0fVxuXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBmbG9hdEFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHRcblx0fVxuXHRcbn07XG5cblxucC5idWZmZXJJbmRpY2VzID0gZnVuY3Rpb24oYXJ5SW5kaWNlcykge1xuXHR0aGlzLmlCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5pQnVmZmVyKTtcblx0Z2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KGFyeUluZGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cdHRoaXMuaUJ1ZmZlci5pdGVtU2l6ZSA9IDE7XG5cdHRoaXMuaUJ1ZmZlci5udW1JdGVtcyA9IGFyeUluZGljZXMubGVuZ3RoO1xufTtcblxuLy8gdmFyIHZlcnRleEJ1ZmZlck9iamVjdCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdmVydGV4QnVmZmVyT2JqZWN0KTtcbi8vIFx0Z2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkob2JqZWN0LnZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXHQgIFxuXG5cbi8vIGlmIChvYmplY3QucGVyVmVydGV4Q29sb3Ipe1xuLy8gXHRjb2xvckJ1ZmZlck9iamVjdCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXJPYmplY3QpO1xuLy8gXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShvYmplY3QuY29sb3JzKSwgZ2wuU1RBVElDX0RSQVcpO1xuLy8gXHRvYmplY3QuY2JvID0gY29sb3JCdWZmZXJPYmplY3Q7XG4vLyB9XG5cbi8vIHZhciBpbmRleEJ1ZmZlck9iamVjdCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgaW5kZXhCdWZmZXJPYmplY3QpO1xuLy8gZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KG9iamVjdC5pbmRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4vLyBvYmplY3QudmJvID0gdmVydGV4QnVmZmVyT2JqZWN0O1xuLy8gb2JqZWN0LmlibyA9IGluZGV4QnVmZmVyT2JqZWN0O1xuLy8gb2JqZWN0Lm5ibyA9IG5vcm1hbEJ1ZmZlck9iamVjdDtcblxuLy8gZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XG4vLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUixudWxsKTtcblxuLy8gcC5idWZmZXJWZXJ0ZXggPSBmdW5jdGlvbihhcnlWZXJ0aWNlcykge1xuLy8gXHR2YXIgdmVydGljZXMgPSBbXTtcblxuLy8gXHQvLyB0aGlzLnZCdWZmZXJQb3MgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbi8vIFx0Ly8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMudkJ1ZmZlclBvcyk7XG4vLyBcdC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGFyeVZlcnRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4vLyBcdC8vIGZvcih2YXIgaT0wOyBpPGFyeVZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4vLyBcdC8vIFx0Zm9yKHZhciBqPTA7IGo8YXJ5VmVydGljZXNbaV0ubGVuZ3RoOyBqKyspIHZlcnRpY2VzLnB1c2goYXJ5VmVydGljZXNbaV1bal0pO1xuLy8gXHQvLyB9XG5cbi8vIFx0Ly8gaWYodGhpcy52QnVmZmVyUG9zID09IHVuZGVmaW5lZCApIHRoaXMudkJ1ZmZlclBvcyA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gXHQvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmZmVyUG9zKTtcblxuLy8gXHQvLyBpZih0aGlzLl9mbG9hdEFycmF5VmVydGV4ID09IHVuZGVmaW5lZCkgdGhpcy5fZmxvYXRBcnJheVZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuLy8gXHQvLyBlbHNlIHtcbi8vIFx0Ly8gXHRpZihhcnlWZXJ0aWNlcy5sZW5ndGggIT0gdGhpcy5fZmxvYXRBcnJheVZlcnRleC5sZW5ndGgpIHRoaXMuX2Zsb2F0QXJyYXlWZXJ0ZXggPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcbi8vIFx0Ly8gXHRlbHNlIHtcbi8vIFx0Ly8gXHRcdGZvcih2YXIgaT0wO2k8YXJ5VmVydGljZXMubGVuZ3RoOyBpKyspIHtcbi8vIFx0Ly8gXHRcdFx0dGhpcy5fZmxvYXRBcnJheVZlcnRleFtpXSA9IGFyeVZlcnRpY2VzW2ldO1xuLy8gXHQvLyBcdFx0fVxuLy8gXHQvLyBcdH1cbi8vIFx0Ly8gfVxuXG4vLyBcdC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl9mbG9hdEFycmF5VmVydGV4LCBnbC5TVEFUSUNfRFJBVyk7XG4vLyBcdHRoaXMudkJ1ZmZlclBvcy5pdGVtU2l6ZSA9IDM7XG4vLyB9O1xuXG5cbi8vIHAuYnVmZmVyVGV4Q29vcmRzID0gZnVuY3Rpb24oYXJ5VGV4Q29vcmRzKSB7XG4vLyBcdHZhciBjb29yZHMgPSBbXTtcblxuLy8gXHQvLyBmb3IodmFyIGk9MDsgaTxhcnlUZXhDb29yZHMubGVuZ3RoOyBpKyspIHtcbi8vIFx0Ly8gXHRmb3IodmFyIGo9MDsgajxhcnlUZXhDb29yZHNbaV0ubGVuZ3RoOyBqKyspIGNvb3Jkcy5wdXNoKGFyeVRleENvb3Jkc1tpXVtqXSk7XG4vLyBcdC8vIH1cblxuLy8gXHR0aGlzLnZCdWZmZXJVViA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy52QnVmZmVyVVYpO1xuLy8gXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShhcnlUZXhDb29yZHMpLCBnbC5TVEFUSUNfRFJBVyk7XG4vLyBcdHRoaXMudkJ1ZmZlclVWLml0ZW1TaXplID0gMjtcbi8vIH07XG5cblxuLy8gcC5idWZmZXJEYXRhID0gZnVuY3Rpb24oZGF0YSwgbmFtZSwgaXRlbVNpemUpIHtcbi8vIFx0dmFyIGluZGV4ID0gLTFcbi8vIFx0Zm9yKHZhciBpPTA7IGk8dGhpcy5leHRyYUF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcbi8vIFx0XHRpZih0aGlzLmV4dHJhQXR0cmlidXRlc1tpXS5uYW1lID09IG5hbWUpIHtcbi8vIFx0XHRcdHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2ldLmRhdGEgPSBkYXRhO1xuLy8gXHRcdFx0aW5kZXggPSBpO1xuLy8gXHRcdFx0YnJlYWs7XG4vLyBcdFx0fVxuLy8gXHR9XG5cbi8vIFx0dmFyIGJ1ZmZlckRhdGEgPSBbXTtcbi8vIFx0Zm9yKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7IGkrKykge1xuLy8gXHRcdGZvcih2YXIgaj0wOyBqPGRhdGFbaV0ubGVuZ3RoOyBqKyspIGJ1ZmZlckRhdGEucHVzaChkYXRhW2ldW2pdKTtcbi8vIFx0fVxuXG4vLyBcdGlmKGluZGV4ID09IC0xKSB7XG4vLyBcdFx0dmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuLy8gXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBidWZmZXIpO1xuLy8gXHRcdHZhciBmbG9hdEFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShidWZmZXJEYXRhKTtcbi8vIFx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZmxvYXRBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1x0XG4vLyBcdFx0dGhpcy5leHRyYUF0dHJpYnV0ZXMucHVzaCh7bmFtZTpuYW1lLCBkYXRhOmRhdGEsIGl0ZW1TaXplOml0ZW1TaXplLCBidWZmZXI6YnVmZmVyLCBmbG9hdEFycmF5OmZsb2F0QXJyYXl9KTtcbi8vIFx0fSBlbHNlIHtcbi8vIFx0XHR2YXIgYnVmZmVyID0gdGhpcy5leHRyYUF0dHJpYnV0ZXNbaW5kZXhdLmJ1ZmZlcjtcbi8vIFx0XHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgYnVmZmVyKTtcbi8vIFx0XHR2YXIgZmxvYXRBcnJheSA9IHRoaXMuZXh0cmFBdHRyaWJ1dGVzW2luZGV4XS5mbG9hdEFycmF5O1xuLy8gXHRcdGZvcih2YXIgaT0wO2k8YnVmZmVyRGF0YS5sZW5ndGg7IGkrKykge1xuLy8gXHRcdFx0ZmxvYXRBcnJheVtpXSA9IGJ1ZmZlckRhdGFbaV07XG4vLyBcdFx0fVxuLy8gXHRcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBmbG9hdEFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XHRcbi8vIFx0fVxuXHRcbi8vIH07XG5cblxuLy8gcC5idWZmZXJJbmRpY2VzID0gZnVuY3Rpb24oYXJ5SW5kaWNlcykge1xuLy8gXHR0aGlzLmlCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbi8vIFx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5pQnVmZmVyKTtcbi8vIFx0Z2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KGFyeUluZGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG4vLyBcdHRoaXMuaUJ1ZmZlci5pdGVtU2l6ZSA9IDE7XG4vLyBcdHRoaXMuaUJ1ZmZlci5udW1JdGVtcyA9IGFyeUluZGljZXMubGVuZ3RoO1xuXG4vLyB9O1xuXG5cbi8vIC8vIHZhciB2ZXJ0ZXhCdWZmZXJPYmplY3QgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbi8vIC8vIFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHZlcnRleEJ1ZmZlck9iamVjdCk7XG4vLyAvLyBcdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KG9iamVjdC52ZXJ0aWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcblx0ICBcblx0XG5cbi8vIC8vIFx0dmFyIGluZGV4QnVmZmVyT2JqZWN0ID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4vLyAvLyBcdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGluZGV4QnVmZmVyT2JqZWN0KTtcbi8vIC8vIFx0Z2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbmV3IFVpbnQxNkFycmF5KG9iamVjdC5pbmRpY2VzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWVzaDsiLCIvLyBTY2VuZS5qc1xuXG52YXIgQmFzZUNhbWVyYSA9IHJlcXVpcmUoJy4uL2NhbWVyYXMvQmFzZUNhbWVyYScpO1xudmFyIEZyZWVDYW1lcmEgPSByZXF1aXJlKCcuLi9jYW1lcmFzL0ZyZWVDYW1lcmEnKTtcblxuZnVuY3Rpb24gU2NlbmUoKXtcblxuXHR0aGlzLnRlc3QgPSAwO1xufTtcblxudmFyIHAgPSBTY2VuZS5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5vYmplY3RzID0gW107XG5cblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2wnKTtcblx0Z2wgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIik7XG5cblx0d2luZG93Lk5TLkdMLmdsQ29udGV4dCA9IGdsO1xuXG5cdC8vIHRoaXMudHJhbnNmb3JtcyA9IG5ldyB3aW5kb3cuTlMuR0wuRnJhbWV3b3JrLlNjZW5lVHJhbnNmb3JtcygpO1xuXHQvLyB0aGlzLnRyYW5zZm9ybXMuaW5pdCh0aGlzLmNhbnZhcyk7XG5cblxuXHRcblxuXHRnbC52aWV3cG9ydCgwLCAwLCBnbC52aWV3cG9ydFdpZHRoLCBnbC52aWV3cG9ydEhlaWdodCk7XG5cdGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblx0Z2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FKTtcbiAgICAvLyBnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcblx0Ly8gZ2wuZW5hYmxlKGdsLkJMRU5EKTtcblx0Z2wuY2xlYXJDb2xvciggMCwgMCwgMCwgMSApO1xuXHRnbC5jbGVhckRlcHRoKCAxICk7XG5cdHRoaXMuZGVwdGhUZXh0dXJlRXh0IFx0PSBnbC5nZXRFeHRlbnNpb24oXCJXRUJLSVRfV0VCR0xfZGVwdGhfdGV4dHVyZVwiKTsgLy8gT3IgYnJvd3Nlci1hcHByb3ByaWF0ZSBwcmVmaXhcblx0Ly8gdGhpcy5mbG9hdFRleHR1cmVFeHQgXHQ9IGdsLmdldEV4dGVuc2lvbihcIk9FU190ZXh0dXJlX2Zsb2F0XCIpIC8vIE9yIGJyb3dzZXItYXBwcm9wcmlhdGUgcHJlZml4XG5cdHRoaXMuZGVyYXZpdGl2ZXMgPSBnbC5nZXRFeHRlbnNpb24oXCJHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXNcIik7XG5cdFxuXG5cdHRoaXMuX3NldENhbWVyYSgpO1xuXG5cdFxuXG5cdFxuXG5cdFxufTtcblxucC5fc2V0Q2FtZXJhID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLmNhbWVyYSA9IG5ldyBGcmVlQ2FtZXJhKCk7XG5cdHRoaXMuY2FtZXJhLmluaXQoKTtcblxuXHR0aGlzLmxlZnRXYWxsQ2FtZXJhID0gbmV3IEZyZWVDYW1lcmEoKTtcblx0dGhpcy5sZWZ0V2FsbENhbWVyYS5pbml0KCk7XG5cblxuXHR0aGlzLm9ydGhvQ2FtZXJhID0gbmV3IEJhc2VDYW1lcmEoKTtcblx0dGhpcy5vcnRob0NhbWVyYS5pbml0KCdvcnRobycpO1xuXG5cblx0dGhpcy50ZXN0Q2FtZXJhID0gbmV3IEZyZWVDYW1lcmEoKTtcblx0dGhpcy50ZXN0Q2FtZXJhLmluaXQoKTtcblxuXHQvLyB0aGlzLmNhbWVyYSA9IG5ldyB3aW5kb3cuTlMuR0wuRnJhbWV3b3JrLkNhbWVyYSgpO1xuXHQvLyB0aGlzLmNhbWVyYS5pbml0KCk7XG5cblx0Ly8gdGhpcy5jYW1lcmFPdGhvID0gbmV3IHdpbmRvdy5OUy5HTC5GcmFtZXdvcmsuQ2FtZXJhKCk7XG5cdC8vIHRoaXMuY2FtZXJhT3Roby5pbml0KCdmcm9udCcpO1xuXG5cdC8vIHRoaXMuY2FtZXJhLmdvSG9tZShbMCwwLDJdKTtcbn07XG5cbnAuZ2V0T2JqZWN0ID0gZnVuY3Rpb24oYWxpYXMpe1xuXG5cdGZvcih2YXIgaT0wOyBpPHRoaXMub2JqZWN0cy5sZW5ndGg7IGkrKyl7XG5cdFx0aWYgKGFsaWFzID09IHRoaXMub2JqZWN0c1tpXS5hbGlhcykgcmV0dXJuIHRoaXMub2JqZWN0c1tpXTtcblx0fVxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbnAubG9hZE9iamVjdCA9IGZ1bmN0aW9uKGZpbGVuYW1lLGFsaWFzLGF0dHJpYnV0ZXMpe1xuXG5cdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdGNvbnNvbGUuaW5mbygnUmVxdWVzdGluZyAnICsgZmlsZW5hbWUpO1xuXHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIixmaWxlbmFtZSk7XG5cblx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09IDQpIHtcblx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09IDQwNCkge1xuXHRcdFx0XHRjb25zb2xlLmluZm8oZmlsZW5hbWUgKyAnIGRvZXMgbm90IGV4aXN0Jyk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dmFyIG8gPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcblx0XHRcdFx0by5hbGlhcyA9IChhbGlhcz09bnVsbCk/J25vbmUnOmFsaWFzO1xuXHRcdFx0XHRvLnJlbW90ZSA9IHRydWU7XG5cdFx0XHRcdHRoaXMuYWRkT2JqZWN0KG8sYXR0cmlidXRlcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJlcXVlc3Quc2VuZCgpO1xufTtcblxucC5sb2FkT2JqZWN0QnlQYXJ0cyA9IGZ1bmN0aW9uKHBhdGgsIGFsaWFzLCBwYXJ0cyl7XG5cblx0Zm9yKHZhciBpID0gMTsgaSA8PSBwYXJ0czsgaSsrKXtcblx0XHR2YXIgcGFydEZpbGVuYW1lID0gIHBhdGgrJycraSsnLmpzb24nO1xuXHRcdHZhciBwYXJ0QWxpYXMgPSBhbGlhcysnJytpO1xuXHRcdHRoaXMubG9hZE9iamVjdChwYXJ0RmlsZW5hbWUscGFydEFsaWFzKTtcblx0fVxuXG59O1xuXG5wLmFkZE9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cmlidXRlcyl7XG5cblx0IC8vaW5pdGlhbGl6ZSB3aXRoIGRlZmF1bHRzXG5cdGlmIChvYmplY3QucGVyVmVydGV4Q29sb3IgICA9PT0gdW5kZWZpbmVkKSAgICB7ICAgb2JqZWN0LnBlclZlcnRleENvbG9yICAgPSBmYWxzZTsgICAgICAgICAgICB9XG4gICAgaWYgKG9iamVjdC53aXJlZnJhbWUgICAgICAgID09PSB1bmRlZmluZWQpICAgIHsgICBvYmplY3Qud2lyZWZyYW1lICAgICAgICA9IGZhbHNlOyAgICAgICAgICAgIH1cbiAgICBpZiAob2JqZWN0LmRpZmZ1c2UgICAgICAgICAgPT09IHVuZGVmaW5lZCkgICAgeyAgIG9iamVjdC5kaWZmdXNlICAgICAgICAgID0gWzEuMCwxLjAsMS4wLDEuMF07fVxuICAgIGlmIChvYmplY3QuYW1iaWVudCAgICAgICAgICA9PT0gdW5kZWZpbmVkKSAgICB7ICAgb2JqZWN0LmFtYmllbnQgICAgICAgICAgPSBbMC4xLDAuMSwwLjEsMS4wXTt9XG4gICAgaWYgKG9iamVjdC5zcGVjdWxhciAgICAgICAgID09PSB1bmRlZmluZWQpICAgIHsgICBvYmplY3Quc3BlY3VsYXIgICAgICAgICA9IFsxLjAsMS4wLDEuMCwxLjBdO31cblx0XG5cdC8vc2V0IGF0dHJpYnV0ZXNcbiAgIGZvcih2YXIga2V5IGluIGF0dHJpYnV0ZXMpe1xuXHRcdGlmKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7b2JqZWN0W2tleV0gPSBhdHRyaWJ1dGVzW2tleV07fVxuXHR9ICAgXG5cblxuXHR2YXIgdmVydGV4QnVmZmVyT2JqZWN0ID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2ZXJ0ZXhCdWZmZXJPYmplY3QpO1xuXHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShvYmplY3QudmVydGljZXMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cdCAgXG5cdHZhciBub3JtYWxCdWZmZXJPYmplY3QgPSBnbC5jcmVhdGVCdWZmZXIoKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG5vcm1hbEJ1ZmZlck9iamVjdCk7XG5cdGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGNhbGN1bGF0ZU5vcm1hbHMob2JqZWN0LnZlcnRpY2VzLCBvYmplY3QuaW5kaWNlcykpLCBnbC5TVEFUSUNfRFJBVyk7XG5cblx0dmFyIGNvbG9yQnVmZmVyT2JqZWN0O1xuXG5cdGlmIChvYmplY3QucGVyVmVydGV4Q29sb3Ipe1xuXHRcdGNvbG9yQnVmZmVyT2JqZWN0ID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cdFx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyT2JqZWN0KTtcblx0XHRnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShvYmplY3QuY29sb3JzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXHRcdG9iamVjdC5jYm8gPSBjb2xvckJ1ZmZlck9iamVjdDtcblx0fVxuXG5cdHZhciBpbmRleEJ1ZmZlck9iamVjdCA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBpbmRleEJ1ZmZlck9iamVjdCk7XG5cdGdsLmJ1ZmZlckRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBVaW50MTZBcnJheShvYmplY3QuaW5kaWNlcyksIGdsLlNUQVRJQ19EUkFXKTtcblx0XG5cdG9iamVjdC52Ym8gPSB2ZXJ0ZXhCdWZmZXJPYmplY3Q7XG5cdG9iamVjdC5pYm8gPSBpbmRleEJ1ZmZlck9iamVjdDtcblx0b2JqZWN0Lm5ibyA9IG5vcm1hbEJ1ZmZlck9iamVjdDtcblxuXHRnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcblx0Z2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsbnVsbCk7XG5cblx0dGhpcy5vYmplY3RzLnB1c2gob2JqZWN0KTtcblx0XG5cdGlmIChvYmplY3QucmVtb3RlKXtcblx0XHRjb25zb2xlLmluZm8ob2JqZWN0LmFsaWFzICsgJyBoYXMgYmVlbiBhZGRlZCB0byB0aGUgc2NlbmUgW1JlbW90ZV0nKTtcblx0fVxuXHRlbHNlIHtcblx0XHRjb25zb2xlLmluZm8ob2JqZWN0LmFsaWFzICsgJyBoYXMgYmVlbiBhZGRlZCB0byB0aGUgc2NlbmUgW0xvY2FsXScpO1xuXHR9XG59O1xuXG5wLmxvb3AgPSBmdW5jdGlvbigpIHtcblx0dGhpcy51cGRhdGUoKTtcblx0dGhpcy5yZW5kZXIoKTtcbn07XG5cblxucC51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxuXHQvLyBnbC52aWV3cG9ydCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblx0Z2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG5cdC8vIHRoaXMudHJhbnNmb3Jtcy51cGRhdGVQZXJzcGVjdGl2ZSgpO1xuXHRcblxuXHQvLyBnbC51bmlmb3JtTWF0cml4NGZ2KHJlbmRlclByb2dyYW0udU1WTWF0cml4LCBmYWxzZSwgdHJhbnNmb3Jtcy5nZXRNdk1hdHJpeCgpKTtcblx0Ly8gZ2wudW5pZm9ybU1hdHJpeDRmdihyZW5kZXJQcm9ncmFtLnVQTWF0cml4LCBmYWxzZSwgdHJhbnNmb3Jtcy5nZXRQcm9qZWN0aW9uTWF0cml4KCkpO1xuXHRcblxuXHQvLyB0aGlzLnNjZW5lUm90YXRpb24udXBkYXRlKCk7XG5cdC8vIEdMLnNldE1hdHJpY2VzKHRoaXMuY2FtZXJhKTtcblx0Ly8gR0wucm90YXRlKHRoaXMuc2NlbmVSb3RhdGlvbi5tYXRyaXgpO1xufTtcblxuXG5wLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXHQvL09WRVJXUklURVxufTtcblxuXG5wLm9uUmVzaXplID0gZnVuY3Rpb24oKXtcblxuXHR2YXIgdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHR2YXIgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHRnbC52aWV3cG9ydFdpZHRoID0gdztcblx0Z2wudmlld3BvcnRIZWlnaHQgPSBoO1xuXG5cdC8vIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXBwZXInKTtcblx0Ly8gd3JhcHBlci5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4Jztcblx0Ly8gd3JhcHBlci5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuXG5cdHRoaXMuY2FudmFzLndpZHRoID0gdztcblx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gaDtcblxuXHR0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4Jztcblx0dGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcblxuXHRcblxuXHQvLyB0aGlzLnRyYW5zZm9ybXMudXBkYXRlUGVyc3BlY3RpdmUoKTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2VuZTsiLCIvL1NjZW5lVHJhbmZvcm1zLmpzXG5cbmZ1bmN0aW9uIFNjZW5lVHJhbnNmb3Jtcygpe307XG5cbnZhciBwID0gU2NlbmVUcmFuc2Zvcm1zLnByb3RvdHlwZTtcblxuU2NlbmVUcmFuc2Zvcm1zLkZJRUxEX09GX1ZJRVcgPSA0NSAqIE1hdGguUEkvMTgwO1xuXG5wLmluaXQgPSBmdW5jdGlvbihjYW52YXMpe1xuXG5cdHRoaXMuX3N0YWNrID0gW107XG5cdC8vIHRoaXMuX2NhbWVyYSA9IGM7XG5cdHRoaXMuX2NhbnZhcyA9IGNhbnZhcztcblx0dGhpcy5fbXZNYXRyaXggICAgPSBtYXQ0LmNyZWF0ZSgpOyAgICAvLyBUaGUgTW9kZWwtVmlldyBtYXRyaXhcblx0Ly8gdGhpcy5fcE1hdHJpeCAgICAgPSBtYXQ0LmNyZWF0ZSgpOyAgICAvLyBUaGUgcHJvamVjdGlvbiBtYXRyaXhcblx0Ly8gdGhpcy5fbk1hdHJpeCAgICAgPSBtYXQ0LmNyZWF0ZSgpOyAgICAvLyBUaGUgbm9ybWFsIG1hdHJpeFxuXHQvLyB0aGlzLmNNYXRyaXggICAgID0gbWF0NC5jcmVhdGUoKTsgICAgLy8gVGhlIGNhbWVyYSBtYXRyaXhcblxuXHRtYXQ0LmlkZW50aXR5KHRoaXMuX212TWF0cml4KTtcblx0Ly8gbWF0NC5pZGVudGl0eSh0aGlzLl9wTWF0cml4KTtcbn07XG5cbnAuc2V0Q2FtZXJhID0gZnVuY3Rpb24oYyl7XG5cblx0dGhpcy5fY2FtZXJhID0gYztcbn07XG5cbnAuY2FsY3VsYXRlTW9kZWxWaWV3ID0gZnVuY3Rpb24oKXtcblxuXHQvLyB0aGlzLl9tdk1hdHJpeCA9IHRoaXMuX2NhbWVyYS5nZXRWaWV3VHJhbnNmb3JtKCk7XG5cdG1hdDQubXVsdGlwbHkodGhpcy5fbXZNYXRyaXgsdGhpcy5fbXZNYXRyaXgsIHRoaXMuX2NhbWVyYS5nZXRWaWV3TWF0cml4KCkpO1xuXG5cdC8vIHZhciBtID0gbWF0NC5jcmVhdGUoKTtcblx0Ly8gbWF0NC5pbnZlcnQobSwgdGhpcy5fY2FtZXJhLmdldFZpZXdNYXRyaXgoKSk7XG5cblx0Ly8gdGhpcy5fbXZNYXRyaXggPSBtO1xuXG5cblx0XG59O1xuXG5wLmNhbGN1bGF0ZU5vcm1hbCA9IGZ1bmN0aW9uKCl7XG5cblx0bWF0NC5pZGVudGl0eSh0aGlzLl9uTWF0cml4KTtcblx0bWF0NC5jb3B5KHRoaXMuX25NYXRyaXgsIHRoaXMuX212TWF0cml4KTtcblx0bWF0NC5pbnZlcnQodGhpcy5fbk1hdHJpeCwgdGhpcy5fbk1hdHJpeCk7XG5cdG1hdDQudHJhbnNwb3NlKHRoaXMuX25NYXRyaXgsIHRoaXMuX25NYXRyaXgpO1xuXG5cbn07XG5cbnAuY2FsY3VsYXRlUGVyc3BlY3RpdmUgPSBmdW5jdGlvbigpe1xuXG5cdG1hdDQuaWRlbnRpdHkodGhpcy5fcE1hdHJpeCk7XG5cdG1hdDQucGVyc3BlY3RpdmUoU2NlbmVUcmFuc2Zvcm1zLkZJRUxEX09GX1ZJRVcsIHRoaXMuX2NhbnZhcy53aWR0aCAvIHRoaXMuX2NhbnZhcy5oZWlnaHQsIDAuMSwgMTAwMCwgdGhpcy5fcE1hdHJpeCk7XG59O1xuXG5wLnVwZGF0ZVBlcnNwZWN0aXZlID0gZnVuY3Rpb24odywgaCl7XG5cblx0bWF0NC5wZXJzcGVjdGl2ZSh0aGlzLl9wTWF0cml4LCBTY2VuZVRyYW5zZm9ybXMuRklFTERfT0ZfVklFVywgdyAvIGgsIDAuMSwgMTAwMCk7XHRcbn07XG5cbnAucmVzZXRQZXJzcGVjdGl2ZSA9IGZ1bmN0aW9uKCl7XG5cblx0bWF0NC5pZGVudGl0eSh0aGlzLl9wTWF0cml4KTtcbn07XG5cblxucC5zZXRNYXRyaXhVbmlmb3JtcyA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5jYWxjdWxhdGVOb3JtYWwoKTtcblx0XHRcbn07XG5cbnAuZ2V0TXZNYXRyaXggPSBmdW5jdGlvbigpe1xuXG5cdC8vIHZhciBtID0gbWF0NC5jcmVhdGUoKTtcblx0Ly8gbWF0NC5jb3B5KG0sIHRoaXMuX212TWF0cml4KTtcblxuXHQvLyByZXR1cm4gbTtcblx0cmV0dXJuIHRoaXMuX212TWF0cml4O1x0XG59O1xuXG5wLmdldFByb2plY3Rpb25NYXRyaXggPSBmdW5jdGlvbigpe1xuXG5cdC8vIHJldHVybiB0aGlzLl9wTWF0cml4O1x0XG5cdHJldHVybiB0aGlzLl9jYW1lcmEuZ2V0UHJvamVjdGlvbk1hdHJpeCgpO1xufTtcblxucC5nZXROb3JtYWxNYXRyaXggPSBmdW5jdGlvbigpe1xuXG5cdHJldHVybiB0aGlzLl9uTWF0cml4O1x0XG59O1xuXG5wLnBvcCA9IGZ1bmN0aW9uKCl7XG5cblx0aWYodGhpcy5fc3RhY2subGVuZ3RoID09IDApIHJldHVybjtcblx0dGhpcy5fbXZNYXRyaXggPSB0aGlzLl9zdGFjay5wb3AoKTtcblxufTtcblxucC5wdXNoID0gZnVuY3Rpb24oKXtcblxuXHR2YXIgbWVtZW50byA9IG1hdDQuY3JlYXRlKCk7XG5cdG1hdDQuY29weShtZW1lbnRvLCB0aGlzLl9tdk1hdHJpeCk7XG5cdHRoaXMuX3N0YWNrLnB1c2gobWVtZW50byk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NlbmVUcmFuc2Zvcm1zOyIsIi8vU2hhZGVyUHJvZ3JhbS5qc1xuXG5mdW5jdGlvbiBTaGFkZXJQcm9ncmFtKCl7fTtcblxudmFyIHAgPSBTaGFkZXJQcm9ncmFtLnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24odmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcil7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXG5cdHRoaXMuaWRWZXJ0ZXggICA9ICd2ZXJ0ZXgnO1xuXHR0aGlzLmlkRnJhZ21lbnQgPSAnZnJhZ21lbnQnO1xuXHQvLyB0aGlzLmdldFNoYWRlcih0aGlzLmlkVmVydGV4LCB0cnVlKTtcblx0Ly8gdGhpcy5nZXRTaGFkZXIodGhpcy5pZEZyYWdtZW50LCBmYWxzZSk7XG5cdHRoaXMuY3JlYXRlU2hhZGVyUHJvZ3JhbSh2ZXJ0ZXhTaGFkZXIsIHRydWUpO1xuXHR0aGlzLmNyZWF0ZVNoYWRlclByb2dyYW0oZnJhZ21lbnRTaGFkZXIsIGZhbHNlKTtcblx0dGhpcy5wYXJhbWV0ZXJzID0gW107XG5cdC8vIHRoaXMuX2lzUmVhZHkgPSB0cnVlZTtcblxuXHRcblxufTtcblxucC5vblNoYWRlcnNMb2FkZWQgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMucHJnID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRnbC5hdHRhY2hTaGFkZXIodGhpcy5wcmcsIHRoaXMudmVydGV4U2hhZGVyKTtcblx0Z2wuYXR0YWNoU2hhZGVyKHRoaXMucHJnLCB0aGlzLmZyYWdtZW50U2hhZGVyKTtcblx0Z2wubGlua1Byb2dyYW0odGhpcy5wcmcpO1xuXHR0aGlzLl9pc1JlYWR5ID0gdHJ1ZTtcdFxufTtcblxucC5nZXRTaGFkZXIgPSBmdW5jdGlvbihpZCwgaXNWZXJ0ZXhTaGFkZXIpIHtcblx0dmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRyZXEuaGFzQ29tcGxldGVkID0gZmFsc2U7XG5cdHZhciBzZWxmID0gdGhpcztcblx0cmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcblx0XHRpZihlLnRhcmdldC5yZWFkeVN0YXRlID09IDQpIHNlbGYuY3JlYXRlU2hhZGVyUHJvZ3JhbShlLnRhcmdldC5yZXNwb25zZVRleHQsIGlzVmVydGV4U2hhZGVyKVxuXHR9O1xuXHRyZXEub3BlbihcIkdFVFwiLCBpZCwgdHJ1ZSk7XG5cdHJlcS5zZW5kKG51bGwpO1xufVxuXG5cbnAuY3JlYXRlU2hhZGVyUHJvZ3JhbSA9IGZ1bmN0aW9uKHN0ciwgaXNWZXJ0ZXhTaGFkZXIpIHtcblx0dmFyIHNoYWRlciA9IGlzVmVydGV4U2hhZGVyID8gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpIDogZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG5cblx0Z2wuc2hhZGVyU291cmNlKHNoYWRlciwgc3RyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cbiAgICBpZiAoIWdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xuICAgICAgICBhbGVydChnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cblxuICAgIGlmKGlzVmVydGV4U2hhZGVyKSB0aGlzLnZlcnRleFNoYWRlciA9IHNoYWRlcjtcbiAgICBlbHNlIHRoaXMuZnJhZ21lbnRTaGFkZXIgPSBzaGFkZXI7XG5cbiAgICBpZih0aGlzLnZlcnRleFNoYWRlciE9dW5kZWZpbmVkICYmIHRoaXMuZnJhZ21lbnRTaGFkZXIhPXVuZGVmaW5lZCkgdGhpcy5vblNoYWRlcnNMb2FkZWQoKTtcbn07XG5cblxucC5iaW5kID0gZnVuY3Rpb24oKSB7XG5cdGdsLnVzZVByb2dyYW0odGhpcy5wcmcpO1xuXG5cdGlmICghdGhpcy5wcmcpIGRlYnVnZ2VyO1xuXG5cdGlmKHRoaXMucHJnLnBNYXRyaXhVbmlmb3JtID09IHVuZGVmaW5lZCkgdGhpcy5wcmcucE1hdHJpeFVuaWZvcm0gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcmcsIFwidVBNYXRyaXhcIik7XG5cdGlmKHRoaXMucHJnLm12TWF0cml4VW5pZm9ybSA9PSB1bmRlZmluZWQpIHRoaXMucHJnLm12TWF0cml4VW5pZm9ybSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByZywgXCJ1TVZNYXRyaXhcIik7XG5cblx0Ly8gR2xvYmFsLlxuXHQvLyBHTC5zaGFkZXIgXHRcdFx0PSB0aGlzO1xuXHQvLyBHTC5zaGFkZXIgXHQ9IHRoaXM7XG5cblx0dGhpcy51bmlmb3JtVGV4dHVyZXMgPSBbXTtcbn07XG5cblxucC51bmlmb3JtID0gZnVuY3Rpb24obmFtZSwgdHlwZSwgdmFsdWUpIHtcblx0aWYodHlwZSA9PSBcInRleHR1cmVcIikgdHlwZSA9IFwidW5pZm9ybTFpXCI7XG5cdFxuXHR2YXIgaGFzVW5pZm9ybSA9IGZhbHNlO1xuXHR2YXIgb1VuaWZvcm07XG5cdGZvcih2YXIgaT0wOyBpPHRoaXMucGFyYW1ldGVycy5sZW5ndGg7IGkrKykge1xuXHRcdG9Vbmlmb3JtID0gdGhpcy5wYXJhbWV0ZXJzW2ldO1xuXHRcdGlmKG9Vbmlmb3JtLm5hbWUgPT0gbmFtZSkge1xuXHRcdFx0b1VuaWZvcm0udmFsdWUgPSB2YWx1ZTtcblx0XHRcdGhhc1VuaWZvcm0gPSB0cnVlO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0aWYoIWhhc1VuaWZvcm0pIHtcblx0XHR0aGlzLnByZ1tuYW1lXSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByZywgbmFtZSk7XG5cdFx0dGhpcy5wYXJhbWV0ZXJzLnB1c2goIHtuYW1lOm5hbWUsIHR5cGU6dHlwZSwgdmFsdWU6dmFsdWUsIHVuaWZvcm1Mb2M6dGhpcy5wcmdbbmFtZV19ICk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5wcmdbbmFtZV0gPSBvVW5pZm9ybS51bmlmb3JtTG9jO1xuXHR9XG5cblxuXHRpZih0eXBlLmluZGV4T2YoXCJNYXRyaXhcIikgPT0gLTEpIHtcblx0XHRnbFt0eXBlXSh0aGlzLnByZ1tuYW1lXSwgdmFsdWUpO1xuXHR9IGVsc2Uge1xuXHRcdGdsW3R5cGVdKHRoaXMucHJnW25hbWVdLCBmYWxzZSwgdmFsdWUpO1xuXHR9XG5cblx0aWYodHlwZSA9PSBcInVuaWZvcm0xaVwiKSB7XHQvL1x0VEVYVFVSRVxuXHRcdHRoaXMudW5pZm9ybVRleHR1cmVzW3ZhbHVlXSA9IHRoaXMucHJnW25hbWVdO1xuXHRcdC8vIGlmKG5hbWUgPT0gXCJ0ZXh0dXJlRm9yY2VcIikgY29uc29sZS5sb2coIFwiVGV4dHVyZSBGb3JjZSA6IFwiLCAgdGhpcy51bmlmb3JtVGV4dHVyZXNbdmFsdWVdLCB2YWx1ZSApO1xuXHR9XG59XG5cblxuXG5wLnVuYmluZCA9IGZ1bmN0aW9uKCkge1xuXHRcbn07XG5cbnAuaXNSZWFkeSA9IGZ1bmN0aW9uKCkge1x0cmV0dXJuIHRoaXMuX2lzUmVhZHk7XHR9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYWRlclByb2dyYW07IiwiLy9TcGVjdHJ1bUFuYWx5emVyLmpzXG5cblxuZnVuY3Rpb24gU3BlY3RydW1BbmFseXplcigpe1xuXG5cdHRoaXMubm9kZSA9IG51bGw7XG5cdHRoaXMuX3BhcmVudEVsID0gbnVsbDtcblx0dGhpcy5fY2FudmFzT2JqID0ge307XG5cdHRoaXMuX2F1ZGlvQ3R4ID0gbnVsbDtcblx0dGhpcy5fcHJvY2Vzc0FycmF5ID0gW107XG5cblx0dGhpcy5fc3ViYmFuZHMgPSBbXTtcblx0XG5cdFxuXHRcblx0dGhpcy5jb2xvclRoZW1lID0gW107XG5cblx0dGhpcy5fY3Vyck1heFZhbCA9IDIwO1xuXG5cdHRoaXMuX2F1ZGlvRGF0YU91dCA9IFtdO1xuXHR0aGlzLnN1YmJhbmRXaWR0aFRhYmxlID0gWzIsMiwzLDMsMywzLDMsMywzLDMsMywzLDMsMyw0LDQsNCw0LDQsNCw0LDQsNCw0LDQsNCw0LDUsNSw1LDUsNSw1LDUsNSw1LDUsNSw1LDUsNiw2LDYsNiw2LDYsNiw2LDYsNiw2LDYsNyw3LDcsNyw3LDcsNyw3LDcsNyw3LDcsNyw4LDgsOCw4LDgsOCw4LDgsOCw4LDgsOCw4LDksOSw5LDksOSw5LDksOSw5LDksOSw5LDEwLDEwLDEwLDEwLDEwLDEwLDEwLDEwLDEwLDEwLDEwLDEwLDEwLDExLDExLDExLDExLDExLDExLDExLDExLDExLDExLDExLDExLDExLDEyLDEyLDEyLDEyLDEyLDEyLDEyLDEyLDEyLDEyLDEyLDEyXTtcblx0dGhpcy5fY3VycmVudFN1YmJhbmRUb3RXaWR0aCA9IDA7XG5cblx0Ly8gY29uc29sZS5sb2codGhpcy5fc3ViYmFuZHNIaXN0b3J5KTtcblxufTtcblxudmFyIHAgPSBTcGVjdHJ1bUFuYWx5emVyLnByb3RvdHlwZTtcblxuU3BlY3RydW1BbmFseXplci5TVUJCQU5EUyA9IDY0O1xuU3BlY3RydW1BbmFseXplci5ISVNUT1JZX1NJWkUgPSA0MztcblxucC5pbml0ID0gZnVuY3Rpb24oY3R4KXtcblxuXHR0aGlzLm5vZGUgPSBjdHguY3JlYXRlQW5hbHlzZXIoKTtcblx0dGhpcy5ub2RlLmZmdFNpemUgPSAyMDQ4O1xuXHR0aGlzLm5vZGUubWF4RGVjaWJlbHMgPSAtMzA7XG5cdHRoaXMubm9kZS5taW5EZWNpYmVscyA9IC0xMDA7XG5cdHRoaXMuX2F1ZGlvQ3R4ID0gY3R4O1xuXHQvLyB0aGlzLl9wYXJlbnRFbCA9IHBhcmVudDtcblx0Ly8gdGhpcy5fY2FudmFzT2JqID0gdGhpcy5jcmVhdGVDYW52YXNPYmooKTtcblx0dGhpcy5fcHJvY2Vzc0FycmF5ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5ub2RlLmZyZXF1ZW5jeUJpbkNvdW50KTtcblxuXG5cdGZvciAodmFyIGk9MDsgaTxTcGVjdHJ1bUFuYWx5emVyLlNVQkJBTkRTO2krKyl7XG5cdFx0dmFyIGhpc3RvcnlBcnIgPSBbXTtcblx0XHRmb3IgKHZhciBrPTA7azxTcGVjdHJ1bUFuYWx5emVyLkhJU1RPUllfU0laRTtrKyspe1xuXHRcdFx0dmFyIHZhbCA9IDA7XG5cdFx0XHRoaXN0b3J5QXJyLnB1c2godmFsKTtcblx0XHR9XG5cblx0XHR2YXIgb2JqID0ge1xuXHRcdFx0Y3VycmVudDp7XG5cdFx0XHRcdHN1bTogMFxuXHRcdFx0fSxcblx0XHRcdGhpc3Rvcnk6e1xuXHRcdFx0XHRhcnIgOiBoaXN0b3J5QXJyLFxuXHRcdFx0XHRzdW0gOiAwIFxuXHRcdFx0fSxcblx0XHRcdGlkeDppXG5cdFx0fTtcblx0XHR0aGlzLl9zdWJiYW5kcy5wdXNoKG9iaik7XG5cblx0fVxuXG5cblxuXG5cdHRoaXMuX3NjcmlwdE5vZGUgPSB0aGlzLl9hdWRpb0N0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IodGhpcy5ub2RlLmZyZXF1ZW5jeUJpbkNvdW50LDIsMSk7XG5cdC8vIGRlYnVnZ2VyO1xuXHR0aGlzLl9zY3JpcHROb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2F1ZGlvcHJvY2VzcycsIHRoaXMuX29uQXVkaW9Qcm9jZXNzLmJpbmQodGhpcykpO1xuXG59O1xuXG5wLmNyZWF0ZUNhbnZhc09iaiA9IGZ1bmN0aW9uKCl7XG5cblx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHRjYW52YXMuY2xhc3NOYW1lID0gXCJ3YXZlZm9ybUFuYWx5c2VyXCI7XG5cdGNhbnZhcy5oZWlnaHQgPSB0aGlzLl9wYXJlbnRFbC5jbGllbnRIZWlnaHQ7XG5cdGNhbnZhcy53aWR0aCA9IHRoaXMuX3BhcmVudEVsLmNsaWVudFdpZHRoO1xuXHR0aGlzLl9wYXJlbnRFbC5hcHBlbmRDaGlsZChjYW52YXMpO1xuXHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cblx0cmV0dXJuIHtlbDogY2FudmFzLCBjdHg6IGNvbnRleHR9O1xuXG59O1xuXG5wLl9vbkF1ZGlvUHJvY2VzcyA9IGZ1bmN0aW9uKGUpe1xuXG5cdC8vIGRlYnVnZ2VyO1xuXG5cdHRoaXMudXBkYXRlKCk7XG5cdFxuXHQvLyB0aGlzLnJlbmRlcigpO1xuXHR0aGlzLl9hdWRpb0RhdGFPdXQgPSB0aGlzLmNyZWF0ZUF1ZGlvRGF0YSgpO1xufTtcblxucC5nZXRBdWRpb0RhdGEgPSBmdW5jdGlvbigpe1xuXG5cdC8vIHJldHVybiB0aGlzLl9hdWRpb0RhdGFPdXQuc2xpY2UoMCk7XG5cblx0XG5cdHZhciBhdWRpb0RhdGEgPSBbXTtcblx0aWYgKHRoaXMuX2F1ZGlvRGF0YU91dC5sZW5ndGggPiA4KXtcblx0XHR2YXIgc3ViYmFuZHMgPSBbMSwgMiwgNCwgNiwgOCwgMjAsIDMwLCA0MCwgNTAsIDYwXTtcblx0XG5cdFx0XG5cdFx0Zm9yICh2YXIgaT0wO2k8c3ViYmFuZHMubGVuZ3RoO2krKyl7XG5cdFx0XHRhdWRpb0RhdGFbaV0gPSB0aGlzLl9hdWRpb0RhdGFPdXRbMF1bc3ViYmFuZHNbaV1dO1xuXHRcdH1cblxuXHRcdC8vIGNvbnNvbGUubG9nKGF1ZGlvRGF0YSk7XG5cdH1cblxuXHRyZXR1cm4gYXVkaW9EYXRhLnNsaWNlKDApO1xufTtcblxucC5jb25uZWN0ID0gZnVuY3Rpb24obm9kZSl7XG5cblx0bm9kZS5jb25uZWN0KHRoaXMubm9kZSk7XG5cdG5vZGUuY29ubmVjdCh0aGlzLl9zY3JpcHROb2RlKTtcblxuXHR0aGlzLl9zY3JpcHROb2RlLmNvbm5lY3QodGhpcy5fYXVkaW9DdHguZGVzdGluYXRpb24pO1xuXG59O1xuXG5wLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbihub2RlKXtcblxuXHRub2RlLmRpc2Nvbm5lY3QodGhpcy5ub2RlKTtcblx0bm9kZS5kaXNjb25uZWN0KHRoaXMuX3NjcmlwdE5vZGUpO1xuXG5cdHRoaXMuX3NjcmlwdE5vZGUuZGlzY29ubmVjdCh0aGlzLl9hdWRpb0N0eC5kZXN0aW5hdGlvbik7XG59O1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG5cblx0Ly8gdGhpcy5ub2RlLmdldEZsb2F0RnJlcXVlbmN5RGF0YSh0aGlzLl9wcm9jZXNzQXJyYXkpO1xuXHR0aGlzLm5vZGUuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodGhpcy5fcHJvY2Vzc0FycmF5KTtcblxuXHQvLyBjb25zb2xlLmxvZyh0aGlzLl9wcm9jZXNzQXJyYXkpO1xuXHRcbn07XG5cbnAuY3JlYXRlQXVkaW9EYXRhID0gZnVuY3Rpb24oKXtcblxuXHQvLyB2YXIgcmV0ID0gbmV3IEZsb2F0MzJBcnJheShTcGVjdHJ1bUFuYWx5emVyLlNVQkJBTkRTKjMpO1xuXHR2YXIgcmV0ID0gW107XG5cblx0dGhpcy5jYWxjU3ViYmFuZEVuZXJneSgpO1xuXHR0aGlzLmNhbGNTdWJiYW5kSGlzdG9yeUF2ZXJhZ2UoKTtcblx0dGhpcy5zaGlmdEhpc3RvcnkoKTtcblxuXHR2YXIgc3ViYmFuZFJhbmdlQXZlcmFnZVN1bSA9IDA7XG5cdHZhciBzdWJiYW5kUmFuZ2VDdXJyZW50U3VtID0gMDtcblxuXG5cdFxuXHR2YXIgY3VycmVudFJvdyA9IG5ldyBGbG9hdDMyQXJyYXkoU3BlY3RydW1BbmFseXplci5TVUJCQU5EUyk7XG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3N1YmJhbmRzLmxlbmd0aDtpKyspe1xuXHRcdFxuXHRcdHZhciBjdXJyZW50U3VtID0gdGhpcy5fc3ViYmFuZHNbaV0uY3VycmVudC5zdW07XG5cdFx0dmFyIGF2ZXJhZ2VTdW0gPSB0aGlzLl9zdWJiYW5kc1tpXS5oaXN0b3J5LnN1bTtcblxuXHRcdC8vIHJldFtpXSA9IHt9O1xuXHRcdC8vIHJldFtpXS5jdXJyZW50ID0gY3VycmVudFN1bTtcblx0XHRjdXJyZW50Um93W2ldID0gY3VycmVudFN1bTtcblx0XHRcblxuXG5cdH1cblxuXHRyZXQucHVzaChjdXJyZW50Um93KTtcblxuXHQvLyB2YXIgaGlzdG9yeVJvd3MgPSBbXTtcblx0Zm9yICh2YXIgaT0wO2k8MTE7aSsrKXtcblx0XHR2YXIgaGlzdG9yeVN1YmJhbmQgPSBuZXcgRmxvYXQzMkFycmF5KFNwZWN0cnVtQW5hbHl6ZXIuU1VCQkFORFMpO1xuXHRcdGZvciAodmFyIHg9MDt4PHRoaXMuX3N1YmJhbmRzLmxlbmd0aDt4Kyspe1xuXHRcdFx0aGlzdG9yeVN1YmJhbmRbeF0gPSB0aGlzLl9zdWJiYW5kc1t4XS5oaXN0b3J5LmFycltpXVxuXHRcdH1cblx0XHRyZXQucHVzaChoaXN0b3J5U3ViYmFuZClcblx0XHQvLyBoaXN0b3J5Um93c1tpXSA9IGhpc3RvcnlTdWJiYW5kO1xuXHR9XG5cblxuXG5cblx0cmV0dXJuIHJldDtcblx0Ly8gZGVidWdnZXI7XG5cdC8vIHdpbmRvdy5vbkF1ZGlvRGF0YShyZXQpO1xufTtcblxucC5nZXRGcmVxRnJvbUZGVElkeCA9IGZ1bmN0aW9uKGlkeCl7XG5cblx0dmFyIHJldCA9IGZhbHNlO1xuXG5cdGlmIChpZHggPCA1MTIpe1xuXHRcdHJldCA9IGlkeCAqIHRoaXMuX2F1ZGlvQ3R4LnNhbXBsZVJhdGUgLyB0aGlzLm5vZGUuZnJlcXVlbmN5QmluQ291bnQ7XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufTtcblxucC5yZW5kZXIgPSBmdW5jdGlvbigpe1xuXG5cdHZhciBjdHggPSB0aGlzLl9jYW52YXNPYmouY3R4O1xuXHR2YXIgY2FudmFzID0gdGhpcy5fY2FudmFzT2JqLmVsO1xuXG5cdHRoaXMuY2FsY1N1YmJhbmRFbmVyZ3koKTtcblx0dGhpcy5jYWxjU3ViYmFuZEhpc3RvcnlBdmVyYWdlKCk7XG5cdHRoaXMuc2hpZnRIaXN0b3J5KCk7XG5cblx0dmFyIHN1YmJhbmRXaWR0aCA9IGNhbnZhcy53aWR0aCAvIHRoaXMuX3N1YmJhbmRzLmxlbmd0aDtcblxuXHRjdHguY2xlYXJSZWN0KDAsMCxjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcblx0dmFyIHN1YmJhbmRSYW5nZUF2ZXJhZ2VTdW0gPSAwO1xuXHR2YXIgc3ViYmFuZFJhbmdlQ3VycmVudFN1bSA9IDA7XG5cblx0dmFyIHdIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAyO1xuXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3N1YmJhbmRzLmxlbmd0aDtpKyspe1xuXHRcdFxuXHRcdHZhciBjdXJyZW50U3VtID0gdGhpcy5fc3ViYmFuZHNbaV0uY3VycmVudC5zdW07XG5cdFx0dmFyIGF2ZXJhZ2VTdW0gPSB0aGlzLl9zdWJiYW5kc1tpXS5oaXN0b3J5LnN1bTtcblxuXHRcdGlmIChjdXJyZW50U3VtID4gdGhpcy5fY3Vyck1heFZhbClcblx0XHRcdHRoaXMuX2N1cnJNYXhWYWwgPSBjdXJyZW50U3VtO1xuXG5cdFx0dmFyIHJlbEhlaWdodEN1cnJlbnQgPSBjdXJyZW50U3VtIC8gdGhpcy5fY3Vyck1heFZhbDtcblx0XHRyZWxIZWlnaHRDdXJyZW50ID0gcmVsSGVpZ2h0Q3VycmVudCAqIHdIZWlnaHQ7XG5cblx0XHR2YXIgcmVsSGVpZ2h0QXZlcmFnZSA9IGF2ZXJhZ2VTdW0gLyB0aGlzLl9jdXJyTWF4VmFsO1xuXHRcdHJlbEhlaWdodEF2ZXJhZ2UgPSByZWxIZWlnaHRBdmVyYWdlICogd0hlaWdodDtcblxuXHRcdGN0eC5mb250ID0gJzEwcHggQXJpYWwnO1xuXHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yVGhlbWVbMV07XG5cdFx0Y3R4LmZpbGxUZXh0KGkrMSxzdWJiYW5kV2lkdGgqaStzdWJiYW5kV2lkdGgvNCwgMjApO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3JUaGVtZVsyXTtcblx0XHRjdHguZmlsbFJlY3Qoc3ViYmFuZFdpZHRoKmksIGNhbnZhcy5oZWlnaHQsIHN1YmJhbmRXaWR0aCwgLXJlbEhlaWdodEN1cnJlbnQpO1xuXG5cdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3JUaGVtZVszXTtcblx0XHRjdHguZmlsbFJlY3Qoc3ViYmFuZFdpZHRoKmksIGNhbnZhcy5oZWlnaHQsIHN1YmJhbmRXaWR0aCwgLXJlbEhlaWdodEF2ZXJhZ2UpO1xuXG5cdH1cblxufTtcblxuXG5cbnAuY2FsY1N1YmJhbmRFbmVyZ3kgPSBmdW5jdGlvbigpe1xuXG5cblx0dGhpcy5fY3VycmVudFN1YmJhbmRUb3RXaWR0aCA9IDA7XG5cblxuXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3N1YmJhbmRzLmxlbmd0aDtpKyspe1xuXG5cdFx0dmFyIHN1YmJhbmRTaXplID0gdGhpcy5zdWJiYW5kV2lkdGhUYWJsZVtpXTtcblxuXHRcdHZhciBvYmogPSB0aGlzLl9zdWJiYW5kc1tpXS5jdXJyZW50O1xuXHRcdG9iai5zdW0gPSAwO1xuXHRcdG9iai53aWR0aCA9IHN1YmJhbmRTaXplO1xuXG5cdFxuXHRcdHZhciByYW5nZSA9IHRoaXMuX2N1cnJlbnRTdWJiYW5kVG90V2lkdGg7XG5cdFx0XG5cdFx0XG5cdFx0Zm9yICh2YXIgaz1yYW5nZTtrPHJhbmdlK3N1YmJhbmRTaXplO2srKyl7XG5cdFx0XHRvYmouc3VtICs9IHRoaXMuX3Byb2Nlc3NBcnJheVtrXTtcblx0XHRcdC8vIGNvbnNvbGUubG9nKGspO1xuXHRcdFx0XG5cdFx0fVxuXHRcdHZhciBzdGFydEZyZXEgPSB0aGlzLmdldEZyZXFGcm9tRkZUSWR4KHJhbmdlKTtcblx0XHR2YXIgZW5kRnJlcSA9IHRoaXMuZ2V0RnJlcUZyb21GRlRJZHgocmFuZ2Urc3ViYmFuZFNpemUpO1xuXG5cblxuXHRcdG9iai5zdW0gKj0gc3ViYmFuZFNpemUvKHRoaXMubm9kZS5mZnRTaXplLzIpO1xuXHRcblx0XHR0aGlzLl9jdXJyZW50U3ViYmFuZFRvdFdpZHRoICs9IG9iai53aWR0aDtcblxuXHR9XG59O1xuXG5wLmNhbGNTdWJiYW5kSGlzdG9yeUF2ZXJhZ2UgPSBmdW5jdGlvbigpe1xuXG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3N1YmJhbmRzLmxlbmd0aDtpKyspe1xuXG5cdFx0dmFyIHN1YmJhbmRIaXN0b3J5ID0gdGhpcy5fc3ViYmFuZHNbaV0uaGlzdG9yeS5hcnI7XG5cdFx0dmFyIHN1YmJhbmRIaXN0b3J5U3VtID0gdGhpcy5fc3ViYmFuZHNbaV0uaGlzdG9yeS5zdW07XG5cdFxuXHRcdGZvciAodmFyIGs9MDtrPHN1YmJhbmRIaXN0b3J5Lmxlbmd0aC0xO2srKyl7XG5cdFx0XHRzdWJiYW5kSGlzdG9yeVN1bSArPSBzdWJiYW5kSGlzdG9yeVtrXTtcblx0XHRcdFxuXHRcdH1cblx0XHRzdWJiYW5kSGlzdG9yeVN1bSAqPSAxL3N1YmJhbmRIaXN0b3J5Lmxlbmd0aDtcblxuXHRcdHRoaXMuX3N1YmJhbmRzW2ldLmhpc3Rvcnkuc3VtID0gc3ViYmFuZEhpc3RvcnlTdW07XG5cblx0XHRcblxuXHR9XG5cbn07XG5cblxucC5zaGlmdEhpc3RvcnkgPSBmdW5jdGlvbigpe1xuXG5cblx0dmFyIHN1YmJhbmRUZW1wQXJyID0gdGhpcy5fc3ViYmFuZHMuc2xpY2UoKTtcblxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9zdWJiYW5kcy5sZW5ndGg7aSsrKXtcblx0XG5cdFx0dmFyIGhpc3RvcnlBcnIgPSB0aGlzLl9zdWJiYW5kc1tpXS5oaXN0b3J5LmFycjtcblx0XHRoaXN0b3J5QXJyLnVuc2hpZnQoc3ViYmFuZFRlbXBBcnJbaV0uY3VycmVudC5zdW0pO1xuXHRcdGlmIChoaXN0b3J5QXJyLmxlbmd0aCA+IFNwZWN0cnVtQW5hbHl6ZXIuSElTVE9SWV9TSVpFKVxuXHRcdFx0aGlzdG9yeUFyci5wb3AoKTtcblxuXHRcdFxuXHR9XG5cdFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwZWN0cnVtQW5hbHl6ZXI7IiwiLy9UZXh0dXJlLmpzXG5cbmZ1bmN0aW9uIFRleHR1cmUoKXt9O1xuXG52YXIgZ2w7XG5cbnZhciBwID0gVGV4dHVyZS5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHNvdXJjZSwgaXNUZXh0dXJlKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cblx0aWYgKGlzVGV4dHVyZSA9PSB1bmRlZmluZWQpXG5cdFx0aXNUZXh0dXJlID0gaXNUZXh0dXJlID09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZTtcblx0Ly8gZ2wgPSBHTC5nbDtcblx0aWYoaXNUZXh0dXJlKSB7XG5cdFx0dGhpcy50ZXh0dXJlID0gc291cmNlO1xuXHR9IGVsc2Uge1xuXHRcdHRoaXMudGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblx0XHR0aGlzLl9pc1ZpZGVvID0gKHNvdXJjZS50YWdOYW1lID09IFwiVklERU9cIik7XG5cblxuXHRcdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG5cdFx0Z2wucGl4ZWxTdG9yZWkoZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgdHJ1ZSk7XG5cdFx0Z2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBzb3VyY2UpO1xuXG5cdFx0aWYoIXRoaXMuX2lzVmlkZW8pIHtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5NSVJST1JFRF9SRVBFQVQpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuTUlSUk9SRURfUkVQRUFUKTtcblx0XHRcdGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xuXHRcdFx0Z2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuTUlSUk9SRURfUkVQRUFUKTtcblx0XHRcdGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLk1JUlJPUkVEX1JFUEVBVCk7XG5cdFx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblx0XHR9XG5cblx0XHRnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcblx0fVxuXG59O1xuXG5wLnVwZGF0ZVRleHR1cmUgPSBmdW5jdGlvbihzb3VyY2UpIHtcblxuXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XG5cdGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIHRydWUpO1xuXHRnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIHNvdXJjZSk7XG5cblx0Ly8gZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB0aGlzLmZyYW1lQnVmZmVyLndpZHRoLCB0aGlzLmZyYW1lQnVmZmVyLmhlaWdodCwgMCwgZ2wuUkdCQSwgdGV4VHlwZSwgbnVsbCk7XG5cblx0aWYoIXRoaXMuX2lzVmlkZW8pIHtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSX01JUE1BUF9ORUFSRVNUKTtcblx0XHRnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblx0fSBlbHNlIHtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcblx0XHRnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcblx0fVxuXG5cdGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xufTtcblxuXG5wLmJpbmQgPSBmdW5jdGlvbihzaGFkZXIsIGluZGV4LCB0b0RlYnVnKSB7XG5cdGlmKGluZGV4ID09IHVuZGVmaW5lZCkgaW5kZXggPSAwO1xuXG5cdGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyBpbmRleCk7XG5cdC8vIGNvbnNvbGUubG9nKCBnbC5URVhUVVJFMCArIGksIHRoaXMuX3RleHR1cmVzW2ldLnRleHR1cmUgKTtcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcblx0Ly8gZ2wudW5pZm9ybTFpKHNoYWRlclByb2dyYW1bXCJzYW1wbGVyVW5pZm9ybVwiK2ldLCBpKTtcblx0Ly8gaWYodG9EZWJ1ZykgY29uc29sZS5sb2coIEdMLnNoYWRlci51bmlmb3JtVGV4dHVyZXNbaW5kZXhdLCB0aGlzICk7XG5cdGdsLnVuaWZvcm0xaShzaGFkZXIudW5pZm9ybVRleHR1cmVzW2luZGV4XSwgaW5kZXgpO1xuXHR0aGlzLl9iaW5kSW5kZXggPSBpbmRleDtcbn07XG5cblxucC51bmJpbmQgPSBmdW5jdGlvbigpIHtcblx0Z2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XG59O1xuXG5cdFxubW9kdWxlLmV4cG9ydHMgPSBUZXh0dXJlOyIsIi8vVmlldy5qc1xuXG52YXIgU2hhZGVyUHJvZ3JhbSA9IHJlcXVpcmUoJy4vU2hhZGVyUHJvZ3JhbScpO1xuXG5mdW5jdGlvbiBWaWV3KCl7fTtcblxudmFyIHAgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24oc3RyVmVydCwgc3RyRnJhZyl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXG5cdHRoaXMudHJhbnNmb3JtcyA9IG51bGw7XG5cblx0dGhpcy5fZW5hYmxlZFZlcnRleEF0dHJpYiA9IFtdO1xuXG5cdGlmKHN0clZlcnQgPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cdHRoaXMuc2hhZGVyID0gbmV3IFNoYWRlclByb2dyYW0oKTtcblx0dGhpcy5zaGFkZXIuaW5pdChzdHJWZXJ0LCBzdHJGcmFnKTtcblxuXHRcbn07XG5cbnAuZHJhdyA9IGZ1bmN0aW9uKG1lc2gpe1xuXG5cdC8vIHRoaXMudHJhbnNmb3Jtcy5jYWxjdWxhdGVNb2RlbFZpZXcoKTtcblxuXHRnbC51bmlmb3JtTWF0cml4NGZ2KHRoaXMuc2hhZGVyLnByZy5wTWF0cml4VW5pZm9ybSwgZmFsc2UsIHRoaXMudHJhbnNmb3Jtcy5nZXRQcm9qZWN0aW9uTWF0cml4KCkpO1xuXHRnbC51bmlmb3JtTWF0cml4NGZ2KHRoaXMuc2hhZGVyLnByZy5tdk1hdHJpeFVuaWZvcm0sIGZhbHNlLCB0aGlzLnRyYW5zZm9ybXMuZ2V0TXZNYXRyaXgoKSk7XG5cdFxuXG5cdC8vIFx0VkVSVEVYIFBPU0lUSU9OU1xuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbWVzaC52QnVmZmVyUG9zKTtcblx0dmFyIHZlcnRleFBvc2l0aW9uQXR0cmlidXRlID0gZ2V0QXR0cmliTG9jKGdsLCB0aGlzLnNoYWRlci5wcmcsIFwiYVZlcnRleFBvc2l0aW9uXCIpO1xuXHRnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHZlcnRleFBvc2l0aW9uQXR0cmlidXRlLCBtZXNoLnZCdWZmZXJQb3MuaXRlbVNpemUsIGdsLkZMT0FULCBnbC5GQUxTRSwgMCwgMCk7XG5cdGlmKHRoaXMuX2VuYWJsZWRWZXJ0ZXhBdHRyaWIuaW5kZXhPZih2ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSkgPT0gLTEpIHtcblx0XHRnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh2ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSk7XG5cdFx0dGhpcy5fZW5hYmxlZFZlcnRleEF0dHJpYi5wdXNoKHZlcnRleFBvc2l0aW9uQXR0cmlidXRlKTtcblx0fVxuXG5cdFxuXG5cdGlmIChtZXNoLnRleHR1cmVVc2VkKXtcblx0XHQvL1x0XHRURVhUVVJFIENPT1JEU1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBtZXNoLnZCdWZmZXJVVik7XG5cdFx0dmFyIHRleHR1cmVDb29yZEF0dHJpYnV0ZSA9IGdldEF0dHJpYkxvYyhnbCwgdGhpcy5zaGFkZXIucHJnLCBcImFUZXh0dXJlQ29vcmRcIik7XG5cdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcih0ZXh0dXJlQ29vcmRBdHRyaWJ1dGUsIG1lc2gudkJ1ZmZlclVWLml0ZW1TaXplLCBnbC5GTE9BVCwgZ2wuRkFMU0UsIDAsIDApO1xuXHRcdC8vIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRleHR1cmVDb29yZEF0dHJpYnV0ZSk7XG5cdFx0aWYodGhpcy5fZW5hYmxlZFZlcnRleEF0dHJpYi5pbmRleE9mKHRleHR1cmVDb29yZEF0dHJpYnV0ZSkgPT0gLTEpIHtcblx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRleHR1cmVDb29yZEF0dHJpYnV0ZSk7XG5cdFx0XHR0aGlzLl9lbmFibGVkVmVydGV4QXR0cmliLnB1c2godGV4dHVyZUNvb3JkQXR0cmlidXRlKTtcblx0XHR9XG5cdH1cblx0XG5cblx0Ly9cdElORElDRVNcblx0Z2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbWVzaC5pQnVmZmVyKTtcblxuXHQvL1x0RVhUUkEgQVRUUklCVVRFU1xuXHRmb3IodmFyIGk9MDsgaTxtZXNoLmV4dHJhQXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuXHRcdGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBtZXNoLmV4dHJhQXR0cmlidXRlc1tpXS5idWZmZXIpO1xuXHRcdHZhciBhdHRyUG9zaXRpb24gPSBnZXRBdHRyaWJMb2MoZ2wsIHRoaXMuc2hhZGVyLnByZywgbWVzaC5leHRyYUF0dHJpYnV0ZXNbaV0ubmFtZSk7XG5cdFx0Z2wudmVydGV4QXR0cmliUG9pbnRlcihhdHRyUG9zaXRpb24sIG1lc2guZXh0cmFBdHRyaWJ1dGVzW2ldLml0ZW1TaXplLCBnbC5GTE9BVCwgZ2wuRkFMU0UsIDAsIDApO1xuXHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dHJQb3NpdGlvbik7XHRcdFxuXG5cdFx0aWYodGhpcy5fZW5hYmxlZFZlcnRleEF0dHJpYi5pbmRleE9mKGF0dHJQb3NpdGlvbikgPT0gLTEpIHtcblx0XHRcdGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGF0dHJQb3NpdGlvbik7XG5cdFx0XHR0aGlzLl9lbmFibGVkVmVydGV4QXR0cmliLnB1c2goYXR0clBvc2l0aW9uKTtcblx0XHR9XG5cdH1cblxuXHQvL1x0RFJBV0lOR1xuXHQvLyBnbC5kcmF3RWxlbWVudHMobWVzaC5kcmF3VHlwZSwgbWVzaC5pQnVmZmVyLm51bUl0ZW1zLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XHRcblx0aWYobWVzaC5kcmF3VHlwZSA9PSBnbC5QT0lOVFMgKSB7XG5cdFx0Z2wuZHJhd0FycmF5cyhtZXNoLmRyYXdUeXBlLCAwLCBtZXNoLnZlcnRleFNpemUpO1x0XG5cdH0gZWxzZXtcblx0XHRnbC5kcmF3RWxlbWVudHMobWVzaC5kcmF3VHlwZSwgbWVzaC5pQnVmZmVyLm51bUl0ZW1zLCBnbC5VTlNJR05FRF9TSE9SVCwgMCk7XG5cdH0gXG5cblxuXHRnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XG5cdGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xuXHRcblxuXHRmdW5jdGlvbiBnZXRBdHRyaWJMb2MoZ2wsIHNoYWRlclByb2dyYW0sIG5hbWUpIHtcblx0XHRpZihzaGFkZXJQcm9ncmFtLmNhY2hlQXR0cmliTG9jICA9PSB1bmRlZmluZWQpIHNoYWRlclByb2dyYW0uY2FjaGVBdHRyaWJMb2MgPSB7fTtcblx0XHRpZihzaGFkZXJQcm9ncmFtLmNhY2hlQXR0cmliTG9jW25hbWVdID09IHVuZGVmaW5lZCkge1xuXHRcdFx0c2hhZGVyUHJvZ3JhbS5jYWNoZUF0dHJpYkxvY1tuYW1lXSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHNoYWRlclByb2dyYW0sIG5hbWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBzaGFkZXJQcm9ncmFtLmNhY2hlQXR0cmliTG9jW25hbWVdO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7IiwiLy9LZXlib2FyZEludGVyYWN0b3IuanNcblxuZnVuY3Rpb24gS2V5Ym9hcmRJbnRlcmFjdG9yKCl7fTtcblxudmFyIHAgPSBLZXlib2FyZEludGVyYWN0b3IucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbihjYW1lcmEsIGNhbnZhcyl7XG5cbiAgICB0aGlzLmNhbSA9IGNhbWVyYTtcbiAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcbn07XG5cbnAuc2V0dXAgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIHNlbGY9dGhpcztcbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHNlbGYuaGFuZGxlS2V5cyhldmVudCk7XG4gICAgfVxufTtcblxucC5oYW5kbGVLZXlzID0gZnVuY3Rpb24oZXZlbnQpe1xuXG5cblxuICAgIGlmKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7Ly9kZXRlcm1pbmUgdGhlIGtleSBwcmVzc2VkXG4gICAgICAgICAgICBjYXNlIDY1Oi8vYSBrZXlcbiAgICAgICAgICAgICAgICB0aGlzLmNhbS5yb2xsKC1NYXRoLlBJICogMC4wMjUpOy8vdGlsdCB0byB0aGUgbGVmdFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzNzovL2xlZnQgYXJyb3dcbiAgICAgICAgICAgICAgICB0aGlzLmNhbS55YXcoTWF0aC5QSSAqIDAuMDI1KTsvL3JvdGF0ZSB0byB0aGUgbGVmdFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2ODovL2Qga2V5XG4gICAgICAgICAgICAgICAgdGhpcy5jYW0ucm9sbChNYXRoLlBJICogMC4wMjUpOy8vdGlsdCB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzk6Ly9yaWdodCBhcnJvd1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtLnlhdygtTWF0aC5QSSAqIDAuMDI1KTsvL3JvdGF0ZSB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgODM6Ly9zIGtleVxuICAgICAgICAgICAgY2FzZSA0MDovL2Rvd24gYXJyb3dcbiAgICAgICAgICAgICAgICB0aGlzLmNhbS5waXRjaChNYXRoLlBJICogMC4wMjUpOy8vbG9vayBkb3duXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg3Oi8vdyBrZXlcbiAgICAgICAgICAgIGNhc2UgMzg6Ly91cCBhcnJvd1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtLnBpdGNoKC1NYXRoLlBJICogMC4wMjUpOy8vbG9vayB1cFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcG9zID0gdGhpcy5jYW0uZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7Ly9kZXRlcmltZSB0aGUga2V5IHByZXNzZWRcbiAgICAgICAgICAgIGNhc2UgNjU6Ly9hIGtleVxuICAgICAgICAgICAgICAgIHRoaXMuY2FtLnlhdyhNYXRoLlBJICogMC4wMjUpOy8vcm90YXRlIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBjYXNlIDM3Oi8vbGVmdCBhcnJvd1xuICAgICAgICAgICAgLy8gICAgIHRoaXMuY2FtLnNldFBvc2l0aW9uKFtwb3NbMF0tLjMscG9zWzFdLHBvc1syXV0pOy8vbW92ZSAtIGFsb25nIHRoZSBYIGF4aXNcbiAgICAgICAgICAgIC8vICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjg6Ly9kIGtleVxuICAgICAgICAgICAgICAgIHRoaXMuY2FtLnlhdygtTWF0aC5QSSAqIDAuMDI1KTsvL3JvdGF0ZSB0byB0aGUgbGVmdFxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gY2FzZSAzOTovL3JpZ2h0IGFycm93XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW0uc2V0UG9zaXRpb24oW3Bvc1swXSsuMyxwb3NbMV0scG9zWzJdXSk7Ly9tb3JlICsgYWxvbmcgdGhlIFggYXhpc1xuICAgICAgICAgICAgLy8gICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gY2FzZSA4MzovL3Mga2V5XG4gICAgICAgICAgICAvLyAgICAgdGhpcy5jYW0uc2V0UG9zaXRpb24oW3Bvc1swXSxwb3NbMV0tLjMscG9zWzJdXSk7Ly9tb3ZlIC0gYWxvbmcgdGhlIFkgYXhpcyAoZG93bilcbiAgICAgICAgICAgIC8vICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDA6Ly9kb3duIGFycm93XG4gICAgICAgICAgICBjYXNlIDgzOlxuICAgICAgICAgICAgICAgIHRoaXMuY2FtLm1vdmVGb3J3YXJkKC4zKTsvL21vdmUgKyBvbiB0aGUgWiBheGlzXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBjYXNlIDg3Oi8vdyBrZXlcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNhbS5zZXRQb3NpdGlvbihbcG9zWzBdLHBvc1sxXSsuMyxwb3NbMl1dKTsvL21vdmUgKyBvbiB0aGUgWSBheGlzICh1cClcbiAgICAgICAgICAgIC8vICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzg6Ly91cCBhcnJvd1xuICAgICAgICAgICAgY2FzZSA4NzpcbiAgICAgICAgICAgICAgICB0aGlzLmNhbS5tb3ZlRm9yd2FyZCgtLjMpOy8vbW92ZSAtIG9uIHRoZSBaIGF4aXNcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgIH1cbn07XG5cbiAgICAvL3RoaXMuY2FtLnNldFBvc2l0aW9uKFtwb3NbMF0scG9zWzFdLHBvc1syXS0uM10pOy8vbW92ZSAtIG9uIHRoZSBaIGF4aXNcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZEludGVyYWN0b3I7IiwiLy9Nb3VzZUludGVyYWN0b3IuanNcblxuZnVuY3Rpb24gTW91c2VJbnRlcmFjdG9yKCl7fTtcblxudmFyIHAgPSBNb3VzZUludGVyYWN0b3IucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbihjYW1lcmEsIGNhbnZhcyl7XG5cbiAgICB0aGlzLmNhbWVyYSA9IGNhbWVyYTtcbiAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcblxuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnggPSB0aGlzLmNhbnZhcy53aWR0aC8yO1xuICAgIHRoaXMueSA9IHRoaXMuY2FudmFzLmhlaWdodC8yO1xuICAgIHRoaXMubGFzdFggPSAwO1xuICAgIHRoaXMubGFzdFkgPSAwO1xuICAgIHRoaXMuYnV0dG9uID0gMDtcbiAgICB0aGlzLnNoaWZ0ID0gZmFsc2U7XG4gICAgdGhpcy5rZXkgPSAwO1xuXG4gICAgdGhpcy5TRU5TSVRJVklUWSA9IDAuNztcbn07XG5cbnAuc2V0dXAgPSBmdW5jdGlvbigpe1xuXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24uYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uTW91c2VVcC5iaW5kKHRoaXMpKTtcbn07XG5cbnAuX29uTW91c2VEb3duID0gZnVuY3Rpb24oZSl7XG5cbiAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnggPSBlLmNsaWVudFg7XG4gICAgdGhpcy55ID0gZS5jbGllbnRZO1xuICAgIHRoaXMuYnV0dG9uID0gZS5idXR0b247XG5cbn07XG5cbnAuX29uTW91c2VVcCA9IGZ1bmN0aW9uKGUpe1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcblxufTtcblxucC5fb25Nb3VzZU1vdmUgPSBmdW5jdGlvbihlKXtcblxuICAgIHRoaXMubGFzdFggPSB0aGlzLng7XG4gICAgdGhpcy5sYXN0WSA9IHRoaXMueTtcbiAgICB0aGlzLnggPSBlLmNsaWVudFg7XG4gICAgdGhpcy55ID0gZS5jbGllbnRZO1xuXG4gICAgaWYgKCF0aGlzLmRyYWdnaW5nKSByZXR1cm47XG4gICAgLy8gdGhpcy5zaGlmdCA9IGUuc2hpZnRLZXk7XG5cblxuXG4gICAgLy8gaWYgKHRoaXMuYnV0dG9uID09IDApIHtcbiAgICAgICAgLy8gaWYodGhpcy5zaGlmdCl7XG4gICAgdmFyIGR4PXRoaXMubW91c2VQb3NYKHRoaXMueCkgLXRoaXMubW91c2VQb3NYKHRoaXMubGFzdFgpXG4gICAgdmFyIGR5PXRoaXMubW91c2VQb3NZKHRoaXMueSkgLXRoaXMubW91c2VQb3NZKHRoaXMubGFzdFkpXG5cbiAgICB0aGlzLnJvdGF0ZShkeCxkeSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gZWxzZXtcbiAgICAgICAgLy8gICAgIHZhciBkeSA9IHRoaXMueSAtIHRoaXMubGFzdFk7XG4gICAgICAgIC8vICAgICB0aGlzLnRyYW5zbGF0ZShkeSk7XG4gICAgICAgIC8vIH1cbiAgICAvLyB9XG5cbn07XG5cbnAubW91c2VQb3NYID0gZnVuY3Rpb24oeCl7XG5cbiAgICByZXR1cm4gMiAqICh4IC8gdGhpcy5jYW52YXMud2lkdGgpIC0gMTtcblxufTtcblxucC5tb3VzZVBvc1kgPSBmdW5jdGlvbih5KXtcblxuICAgIHJldHVybiAyICogKHkgLyB0aGlzLmNhbnZhcy5oZWlnaHQpIC0gMTtcblxufTtcblxucC5yb3RhdGUgPSBmdW5jdGlvbihkeCwgZHkpe1xuXG4gICAgdmFyIGNhbWVyYSA9IHRoaXMuY2FtZXJhO1xuICAgIGNhbWVyYS55YXcodGhpcy5TRU5TSVRJVklUWSpkeCk7XG4gICAgY2FtZXJhLnBpdGNoKHRoaXMuU0VOU0lUSVZJVFkqZHkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb3VzZUludGVyYWN0b3I7XG4iLCIvL0F1ZGlvUGxheWVyLmpzXG5cbmZ1bmN0aW9uIEF1ZGlvUGxheWVyKCl7fTtcblxudmFyIHAgPSBBdWRpb1BsYXllci5wcm90b3R5cGU7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKGN0eCwgb25CdWZmZXJMb2FkZWRDYWxsYmFjaywgY2FsbGJhY2tTY29wZSl7XG5cblx0dGhpcy5fY3R4ID0gY3R4O1xuXHR0aGlzLl9idWZmZXIgPSBudWxsO1xuXHR0aGlzLl9zb3VyY2VOb2RlID0gbnVsbDtcblx0dGhpcy5wYXVzZWQgPSBmYWxzZTtcblx0dGhpcy5wYXVzZWRUaW1lc3RhbXAgPSB1bmRlZmluZWQ7XG5cdHRoaXMuc3RhcnRlZFRpbWVzdGFtcCA9IHVuZGVmaW5lZDtcblx0dGhpcy50cmlnZ2VyZWRQbGF5ID0gZmFsc2U7XG5cblx0dGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xuXG5cdHRoaXMuX29uQnVmZmVyTG9hZGVkQ2FsbGJhY2sgPSBvbkJ1ZmZlckxvYWRlZENhbGxiYWNrO1xuXHR0aGlzLl9jYWxsYmFja1Njb3BlID0gY2FsbGJhY2tTY29wZTtcblxuXHRcblxufTtcblxucC5sb2FkID0gZnVuY3Rpb24odXJsKXtcblxuXHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG5cdHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgc2VsZi5fY3R4LmRlY29kZUF1ZGlvRGF0YShyZXF1ZXN0LnJlc3BvbnNlLCBzZWxmLm9uQnVmZmVyTG9hZGVkLmJpbmQoc2VsZiksIHNlbGYub25CdWZmZXJFcnJvci5iaW5kKHNlbGYpKTtcblx0fTtcblx0cmVxdWVzdC5zZW5kKCk7XG5cbn07XG5cbnAub25CdWZmZXJMb2FkZWQgPSBmdW5jdGlvbihidWZmZXIpe1xuXG5cblx0Ly8gdmFyIGxlZnRQQ00gPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cdC8vIHZhciByaWdodFBDTSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YSgxKTtcblxuXHQvLyBjb25zb2xlLmxvZyhsZWZ0UENNLmxlbmd0aCk7XG5cdC8vIGRlYnVnZ2VyO1xuXG5cdC8vIHZhciBmaXJzdEhhbGYgPSBsZWZ0UENNLnNsaWNlKDAsIDEwMDAwMDApO1xuXG5cdC8vIHZhciBzdHIgPSBmaXJzdEhhbGYuam9pbignJTIwJyk7XG5cdC8vIHZhciBwYXJhbXMgPSBcImFycmF5PVwiICsgc3RyO1xuXHQvLyB2YXIgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHQvLyBodHRwLm9wZW4oXCJQT1NUXCIsIFwic2F2ZS5waHBcIiwgdHJ1ZSk7XG5cblx0Ly8gLy9TZW5kIHRoZSBwcm9wZXIgaGVhZGVyIGluZm9ybWF0aW9uIGFsb25nIHdpdGggdGhlIHJlcXVlc3Rcblx0Ly8gaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIpO1xuXHQvLyAvLyBodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LWxlbmd0aFwiLCBwYXJhbXMubGVuZ3RoKTtcblx0Ly8gLy8gaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29ubmVjdGlvblwiLCBcImNsb3NlXCIpO1xuXG5cdC8vIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdC8vICAgICBpZihodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiBodHRwLnN0YXR1cyA9PSAyMDApIHtcblx0Ly8gICAgICAgICAvLyBEbyBzb21ldGhpbmcgb24gc3VjY2Vzcz9cblx0Ly8gICAgICAgICBkZWJ1Z2dlcjtcblx0Ly8gICAgIH1cblx0Ly8gfVxuXHQvLyBodHRwLnNlbmQocGFyYW1zKTtcblx0Ly8gLy8gY29uc29sZS50YWJsZShsZWZ0UENNKVxuXHQvLyBkZWJ1Z2dlcjtcblx0Ly8gLy8gY29uc29sZS5sb2coYnVmZmVyKTtcblxuXHR0aGlzLl9idWZmZXIgPSBidWZmZXI7XG5cdHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xuXHR0aGlzLl9vbkJ1ZmZlckxvYWRlZENhbGxiYWNrLmNhbGwodGhpcy5fY2FsbGJhY2tTY29wZSk7XG5cdFxufTtcblxucC5vbkJ1ZmZlckVycm9yID0gZnVuY3Rpb24oKXtcblxuXG59O1xuXG5wLnBhdXNlID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLl9zb3VyY2VOb2RlLnN0b3AoMCk7XG5cdHRoaXMucGF1c2VkVGltZXN0YW1wID0gRGF0ZS5ub3coKSAtIHRoaXMuc3RhcnRlZFRpbWVzdGFtcDtcblx0dGhpcy5wYXVzZWQgPSB0cnVlO1xuXG59O1xuXG5wLnJlc2V0ID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLnBhdXNlZFRpbWVzdGFtcCA9IHVuZGVmaW5lZDtcblxufTtcblxucC5nZXRTb3VyY2VOb2RlID0gZnVuY3Rpb24oKXtcblxuXHRyZXR1cm4gdGhpcy5fc291cmNlTm9kZTtcbn07XG5cbnAucGxheSA9IGZ1bmN0aW9uKHdhaXQpe1xuXG5cdHRoaXMudHJpZ2dlcmVkUGxheSA9IHRydWU7XG5cblx0dGhpcy5fc291cmNlTm9kZSA9IHRoaXMuX2N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0dGhpcy5fc291cmNlTm9kZS5jb25uZWN0KHRoaXMuX2N0eC5kZXN0aW5hdGlvbik7XG5cdHRoaXMuX3NvdXJjZU5vZGUuYnVmZmVyID0gdGhpcy5fYnVmZmVyO1xuXHR0aGlzLnBhdXNlZCA9IGZhbHNlO1xuXG5cdGlmICh0aGlzLnBhdXNlZFRpbWVzdGFtcCAhPT0gdW5kZWZpbmVkKXtcblx0XHR0aGlzLnN0YXJ0ZWRUaW1lc3RhbXAgPSBEYXRlLm5vdygpIC0gdGhpcy5wYXVzZWRUaW1lc3RhbXA7XG5cdFx0dGhpcy5fc291cmNlTm9kZS5zdGFydCgwLCB0aGlzLnBhdXNlZFRpbWVzdGFtcCAvIDEwMDApO1xuXHR9ZWxzZXtcblxuXHRcdGlmICh3YWl0KXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0c2VsZi5zdGFydGVkVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblx0XHRcdFx0c2VsZi5fc291cmNlTm9kZS5zdGFydCgwKTtcblxuXHRcdFx0fSx3YWl0KTtcblx0XHR9ZWxzZXtcblx0XHRcdHRoaXMuc3RhcnRlZFRpbWVzdGFtcCA9IERhdGUubm93KCk7XG5cdFx0XHR0aGlzLl9zb3VyY2VOb2RlLnN0YXJ0KDApO1xuXHRcdH1cblx0XHRcblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1ZGlvUGxheWVyOyIsIi8vVmlkZW9QbGF5ZXIuanNcblxuZnVuY3Rpb24gVmlkZW9QbGF5ZXIoKXt9O1xuXG52YXIgcCA9IFZpZGVvUGxheWVyLnByb3RvdHlwZTtcblxucC5pbml0ID0gZnVuY3Rpb24ob25WaWRlb0xvYWRlZENhbGxiYWNrLCBvblZpZGVvUGF1c2VkLCBvblZpZGVvUGxheWluZywgb25WaWRlb0VuZGVkLCBjYWxsYmFja1Njb3BlKXtcblxuXHR0aGlzLmlzTG9hZGVkID0gZmFsc2U7XG5cdHRoaXMudHJpZ2dlcmVkUGxheSA9IGZhbHNlO1xuXHR0aGlzLm9uVmlkZW9Mb2FkZWRDYWxsYmFjayA9IG9uVmlkZW9Mb2FkZWRDYWxsYmFjaztcblx0dGhpcy5vblZpZGVvUGF1c2VkID0gb25WaWRlb1BhdXNlZDtcblx0dGhpcy5vblZpZGVvUGxheWluZyA9IG9uVmlkZW9QbGF5aW5nO1xuXHR0aGlzLm9uVmlkZW9FbmRlZCA9IG9uVmlkZW9FbmRlZDtcblx0dGhpcy5jYWxsYmFja1Njb3BlID0gY2FsbGJhY2tTY29wZTtcblxuXHR0aGlzLl9jdXJyZW50VGltZSA9IC0xO1xuXG5cdHRoaXMudmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXHR0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgdGhpcy5fb25WaWRlb0xvYWRlZC5iaW5kKHRoaXMpKTtcblx0dGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIHRoaXMuZW5kZWQuYmluZCh0aGlzKSk7XG5cdHRoaXMudmlkZW8udm9sdW1lID0gMC4wO1xuXHRcblxuXHR0aGlzLl9jaGVja0ludGVydmFsICA9IDUwLjA7XG5cdHRoaXMuX2xhc3RQbGF5UG9zICAgID0gMDtcblx0dGhpcy5fY3VycmVudFBsYXlQb3MgPSAwO1xuXHR0aGlzLl9idWZmZXJpbmdEZXRlY3RlZCA9IHRydWU7XG5cblx0dGhpcy5jaGVja0J1ZmZlcmluZ0ludGVydmFsID0gbnVsbDtcblx0dGhpcy5jaGVja0J1ZmZlcmluZ0JvdW5kID0gdGhpcy5jaGVja0J1ZmZlcmluZy5iaW5kKHRoaXMpO1xuXG59O1xuXG5wLmVuZGVkID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLm9uVmlkZW9FbmRlZC5jYWxsKHRoaXMuY2FsbGJhY2tTY29wZSk7XG5cdFxuXHRcbn07XG5cbnAucmVzZXQgPSBmdW5jdGlvbigpe1xuXG5cdGNsZWFySW50ZXJ2YWwodGhpcy5jaGVja0J1ZmZlcmluZ0ludGVydmFsKTtcblx0dGhpcy5fbGFzdFBsYXlQb3MgICAgPSAwO1xuXHR0aGlzLl9jdXJyZW50UGxheVBvcyA9IDA7XG5cdHRoaXMuX2J1ZmZlcmluZ0RldGVjdGVkID0gdHJ1ZTtcblx0dGhpcy52aWRlby5jdXJyZW50VGltZSA9IDAuMDAxO1xuXHQvL3RoaXMudHJpZ2dlcmVkUGxheSA9IGZhbHNlO1xuXG59O1xuXG5wLmxvYWQgPSBmdW5jdGlvbihwYXRoKXtcblxuXHR0aGlzLnZpZGVvLnNyYyA9IHBhdGg7XG5cdHRoaXMudmlkZW8ubG9hZCgpO1xufTtcblxucC5wbGF5ID0gZnVuY3Rpb24oKXtcblxuXHR0aGlzLnZpZGVvLnBsYXkoKTtcblx0dGhpcy50cmlnZ2VyZWRQbGF5ID0gdHJ1ZTtcblx0dGhpcy5jaGVja0J1ZmZlcmluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwodGhpcy5jaGVja0J1ZmZlcmluZ0JvdW5kLCB0aGlzLl9jaGVja0ludGVydmFsKTtcbn07XG5cbnAuX29uVmlkZW9FcnJvciA9IGZ1bmN0aW9uKGUpe1xuXG5cdGNvbnNvbGUubG9nKCd2aWRlbyBlcnJvcicpO1xufTtcblxucC5fb25WaWRlb0xvYWRlZCA9IGZ1bmN0aW9uKGUpe1xuXG5cdGlmICh0aGlzLmlzTG9hZGVkKSByZXR1cm47XG5cdGNvbnNvbGUubG9nKCd2aWRlbyBsb2FkZWQnKTtcblxuXHR0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcblx0dGhpcy5vblZpZGVvTG9hZGVkQ2FsbGJhY2suY2FsbCh0aGlzLmNhbGxiYWNrU2NvcGUpO1xufTtcblxuXG5cbnAuY2hlY2tCdWZmZXJpbmcgPSBmdW5jdGlvbigpe1xuXG5cdHZhciBjdXJyZW50UGxheVBvcyA9IHRoaXMudmlkZW8uY3VycmVudFRpbWU7XG5cblx0dmFyIG9mZnNldCA9IDEgLyB0aGlzLl9jaGVja0ludGVydmFsO1xuXG5cdGlmICghdGhpcy5fYnVmZmVyaW5nRGV0ZWN0ZWQgJiYgY3VycmVudFBsYXlQb3MgPCAodGhpcy5fbGFzdFBsYXlQb3MgKyBvZmZzZXQpKXtcblx0XHRjb25zb2xlLmxvZygnYnVmZmVyaW5nJyk7XG5cdFx0dGhpcy5fYnVmZmVyaW5nRGV0ZWN0ZWQgPSB0cnVlO1xuXHRcdHRoaXMub25WaWRlb1BhdXNlZC5jYWxsKHRoaXMuY2FsbGJhY2tTY29wZSk7XG5cdH1cblxuXHRpZiAodGhpcy5fYnVmZmVyaW5nRGV0ZWN0ZWQgJiYgY3VycmVudFBsYXlQb3MgPiAodGhpcy5fbGFzdFBsYXlQb3MgKyBvZmZzZXQpKXtcblx0XHRjb25zb2xlLmxvZygnbm90IGJ1ZmZlcmluZyBhbnltb3JlJyk7XG5cdFx0dGhpcy5fYnVmZmVyaW5nRGV0ZWN0ZWQgPSBmYWxzZTtcblx0XHR0aGlzLm9uVmlkZW9QbGF5aW5nLmNhbGwodGhpcy5jYWxsYmFja1Njb3BlKTtcblx0fVxuXG5cdHRoaXMuX2xhc3RQbGF5UG9zID0gY3VycmVudFBsYXlQb3M7XG5cblxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlkZW9QbGF5ZXI7IiwiLy9FbmRTY3JlZW4uanNcblxuZnVuY3Rpb24gRW5kU2NyZWVuKCl7fTtcblxudmFyIHAgPSBFbmRTY3JlZW4ucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbihvblJlcGxheUNsaWNrLCBjYWxsYmFja1Njb3BlKXtcblxuXHR0aGlzLmVsID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcub3ZlcmxheS5lbmRTY3JlZW4nKTtcblx0dGhpcy50aXRsZUVsID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKTtcblxuXHR0aGlzLnJlcGxheUJ0biA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcignLnJlcGxheScpO1xuXHR0aGlzLnJlcGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25SZXBsYXlDbGljay5iaW5kKHRoaXMpKTtcblxuXHR0aGlzLm9uUmVwbGF5Q2xpY2tDYWxsYmFjayA9IG9uUmVwbGF5Q2xpY2s7XG5cdHRoaXMuY2FsbGJhY2tTY29wZSA9IGNhbGxiYWNrU2NvcGU7XG5cblx0dGhpcy50YXJnZXRZUG9zID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR0aGlzLmN1cnJlbnRZUG9zID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdHRoaXMuaXNTaG93aW5nID0gZmFsc2U7XG5cbn07XG5cbnAub25SZXBsYXlDbGljayA9IGZ1bmN0aW9uKCl7XG5cblx0XG5cdHRoaXMub25SZXBsYXlDbGlja0NhbGxiYWNrLmNhbGwodGhpcy5jYWxsYmFja1Njb3BlKTtcbn07XG5cbnAuaGlkZSA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5pc1Nob3dpbmcgPSBmYWxzZTtcblx0Ly8gdGhpcy5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHR0aGlzLnRhcmdldFlQb3MgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbn07XG5cbnAuc2hvdyA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5pc1Nob3dpbmcgPSB0cnVlO1xuXHR0aGlzLnRhcmdldFlQb3MgPSAwO1xuXHQvLyB0aGlzLmVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xufTtcblxucC51cGRhdGUgPSBmdW5jdGlvbigpe1xuXG5cdHZhciB0cmFuc2xhdGVWID0gMDtcblx0dHJhbnNsYXRlViA9ICh0aGlzLnRhcmdldFlQb3MgLSB0aGlzLmN1cnJlbnRZUG9zKSAqIC4wNDtcblx0dGhpcy5jdXJyZW50WVBvcyArPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVYgKiAxMDApIC8gMTAwO1xuXG59O1xuXG5wLnJlbmRlciA9IGZ1bmN0aW9uKCl7XG5cblx0XG5cdHRoaXMuZWwuc3R5bGUudG9wID0gdGhpcy5jdXJyZW50WVBvcztcbn07XG5cbnAub25SZXNpemUgPSBmdW5jdGlvbih3LGgpe1xuXG5cdHRoaXMudGl0bGVFbC5zdHlsZS5sZWZ0ID0gdy8yIC0gMjAgKyAncHgnO1xuXHR0aGlzLnRpdGxlRWwuc3R5bGUudG9wID0gaC8yIC0gNDAgKyAncHgnO1xuXG5cdGlmICghdGhpcy5pc1Nob3dpbmcpe1xuXHRcdHRoaXMudGFyZ2V0WVBvcyA9IGg7XG5cdFx0dGhpcy5jdXJyZW50WVBvcyA9IGg7XG5cdH1cblx0XG5cblx0dGhpcy50aXRsZUVsLnN0eWxlLm9wYWNpdHkgPSAxO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFbmRTY3JlZW47IiwiLy9Mb2FkZXJTY3JlZW4uanNcblxuZnVuY3Rpb24gTG9hZGVyU2NyZWVuKCl7fTtcblxudmFyIHAgPSBMb2FkZXJTY3JlZW4ucHJvdG90eXBlO1xuXG5wLmluaXQgPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMuZWwgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5vdmVybGF5LmxvYWRlclNjcmVlbicpO1xuXHR0aGlzLnRpdGxlRWwgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xuXG5cdHRoaXMudGFyZ2V0WVBvcyA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0dGhpcy5jdXJyZW50WVBvcyA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHR0aGlzLmlzU2hvd2luZyA9IGZhbHNlO1xufTtcblxucC5oaWRlID0gZnVuY3Rpb24oKXtcblxuXHQvLyB0aGlzLmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdHRoaXMudGFyZ2V0WVBvcyA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0dGhpcy5pc1Nob3dpbmcgPSBmYWxzZTtcbn07XG5cbnAuc2hvdyA9IGZ1bmN0aW9uKCl7XG5cblx0dGhpcy5pc1Nob3dpbmcgPSB0cnVlO1xuXHR0aGlzLnRhcmdldFlQb3MgPSAwO1xuXHQvLyB0aGlzLmVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xufTtcblxucC51cGRhdGUgPSBmdW5jdGlvbigpe1xuXG5cdHZhciB0cmFuc2xhdGVWID0gMDtcblx0dHJhbnNsYXRlViA9ICh0aGlzLnRhcmdldFlQb3MgLSB0aGlzLmN1cnJlbnRZUG9zKSAqIC4wNDtcblx0dGhpcy5jdXJyZW50WVBvcyArPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVYgKiAxMDApIC8gMTAwO1xuXG59O1xuXG5wLnJlbmRlciA9IGZ1bmN0aW9uKCl7XG5cblx0XG5cdHRoaXMuZWwuc3R5bGUudG9wID0gdGhpcy5jdXJyZW50WVBvcztcbn07XG5cblxucC5vblJlc2l6ZSA9IGZ1bmN0aW9uKHcsaCl7XG5cblx0dGhpcy50aXRsZUVsLnN0eWxlLmxlZnQgPSB3LzIgLSAzMCArICdweCc7XG5cdHRoaXMudGl0bGVFbC5zdHlsZS50b3AgPSBoLzIgLSA2MCArICdweCc7XG5cblx0aWYgKCF0aGlzLmlzU2hvd2luZyl7XG5cdFx0dGhpcy50YXJnZXRZUG9zID0gaDtcblx0XHR0aGlzLmN1cnJlbnRZUG9zID0gaDtcblx0fVxuXG5cdHRoaXMudGl0bGVFbC5zdHlsZS5vcGFjaXR5ID0gMTtcblxuXHQvLyB0aGlzLnRpdGxlRWwuc3R5bGUubWFyZ2luVG9wID0gaC8yIC0gNDAgKyAncHgnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZXJTY3JlZW47IiwiLy9WaWV3QmFja2dyb3VuZC5qc1xuXG52YXIgVmlldyA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9WaWV3Jyk7XG52YXIgTWVzaCA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9NZXNoJyk7XG5cbmZ1bmN0aW9uIFZpZXdCYWNrZ3JvdW5kKCl7fTtcblxudmFyIHAgPSBWaWV3QmFja2dyb3VuZC5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxudmFyIHJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7IHJldHVybiBtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7IH1cblxucC5pbml0ID0gZnVuY3Rpb24odmVydFBhdGgsIGZyYWdQYXRoKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cdFxuXHRzLmluaXQuY2FsbCh0aGlzLCB2ZXJ0UGF0aCwgZnJhZ1BhdGgpO1xuXG5cdHRoaXMuYW5nbGUgPSAwO1xuXHR0aGlzLmFuZ2xlVmVydCA9IDA7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBpbmRpY2VzID0gWzAsIDEsIDIsIDAsIDIsIDNdO1xuXG5cdHZhciBzaXplID0gMTtcblx0cG9zaXRpb25zLnB1c2goWy1zaXplLCAtc2l6ZSwgMF0pO1xuXHRwb3NpdGlvbnMucHVzaChbIHNpemUsIC1zaXplLCAwXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFsgc2l6ZSwgIHNpemUsIDBdKTtcblx0cG9zaXRpb25zLnB1c2goWy1zaXplLCAgc2l6ZSwgMF0pO1xuXG5cdGNvb3Jkcy5wdXNoKFswLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAwXSk7XG5cdGNvb3Jkcy5wdXNoKFswLCAwXSk7XG5cblx0dGhpcy5tZXNoID0gbmV3IE1lc2goKTtcblx0dGhpcy5tZXNoLmluaXQoNCwgNiwgZ2wuVFJJQU5HTEVTKTtcblx0dGhpcy5tZXNoLmJ1ZmZlclZlcnRleChwb3NpdGlvbnMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVGV4Q29vcmRzKGNvb3Jkcyk7XG5cdHRoaXMubWVzaC5idWZmZXJJbmRpY2VzKGluZGljZXMpO1xuXG5cbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24ocGVybVRleHR1cmUsIHNpbXBsZXhUZXh0dXJlLCBmbG9vclRleHR1cmUsIGZhZGVyVmFsKXtcblxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImFuZ2xlXCIsIFwidW5pZm9ybTFmXCIsdGhpcy5hbmdsZSs9LjAwMSk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhbmdsZVZlcnRcIiwgXCJ1bmlmb3JtMWZcIiwgdGhpcy5hbmdsZVZlcnQrPS4wMSk7XG5cdC8vIHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ1U2FtcGxlcjBcIiwgXCJ1bmlmb3JtMWlcIiwgMCk7XG5cdCAvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwidGV4dHVyZVBhcnRpY2xlXCIsIFwidW5pZm9ybTFpXCIsIDEpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwicGVybVRleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMCk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJzaW1wbGV4VGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAxKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImZsb29yVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAyKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImZhZGVyVmFsXCIsXCJ1bmlmb3JtMWZcIiwgZmFkZXJWYWwpO1xuXHQvLyB0ZXh0dXJlUG9zLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHQvLyB0ZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXG5cdHBlcm1UZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHRzaW1wbGV4VGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAxKTtcblx0Zmxvb3JUZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDIpO1xuXG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdCYWNrZ3JvdW5kOyIsIi8vVmlld0JsdXIuanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3Qmx1cigpe307XG5cbnZhciBwID0gVmlld0JsdXIucHJvdG90eXBlID0gbmV3IFZpZXcoKTtcbnZhciBzID0gVmlldy5wcm90b3R5cGU7XG5cbnZhciBnbCA9IG51bGw7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRQYXRoLCBmcmFnUGF0aCl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXHRcblx0cy5pbml0LmNhbGwodGhpcywgdmVydFBhdGgsIGZyYWdQYXRoKTtcblxuXHR2YXIgcG9zaXRpb25zID0gW107XG5cdHZhciBjb29yZHMgPSBbXTtcblx0dmFyIGluZGljZXMgPSBbMCwgMSwgMiwgMCwgMiwgM107XG5cblx0dmFyIHNpemUgPSAxO1xuXHRwb3NpdGlvbnMucHVzaChbLXNpemUsIC1zaXplLCAwXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFsgc2l6ZSwgLXNpemUsIDBdKTtcblx0cG9zaXRpb25zLnB1c2goWyBzaXplLCAgc2l6ZSwgMF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXNpemUsICBzaXplLCAwXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblxuXHR0aGlzLm1lc2ggPSBuZXcgTWVzaCgpO1xuXHR0aGlzLm1lc2guaW5pdCg0LCA2LCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cbn07XG5cblxuXG5wLnJlbmRlciA9IGZ1bmN0aW9uKHRleHR1cmUpIHtcblxuXHQvLyB0aGlzLnRyYW5zZm9ybXMuY2FsY3VsYXRlTW9kZWxWaWV3KCk7XG5cblx0Ly8gdmFyIG12TWF0cml4ID0gdGhpcy50cmFuc2Zvcm1zLmdldE12TWF0cml4KCk7XG5cblx0Ly8gbWF0NC5yb3RhdGUobXZNYXRyaXgsIC0uNCpNYXRoLlBJLCBbMSwgMCwgMF0pO1xuICAgIC8vIG1hdDQucm90YXRlKG12TWF0cml4LCBkZWdUb1JhZCgteWF3KSwgWzAsIDEsIDBdKTtcbiAgICAvLyBtYXQ0LnRyYW5zbGF0ZShtdk1hdHJpeCwgWy14UG9zLCAteVBvcywgLXpQb3NdKTtcblx0Ly8gcmV0dXJuO1xuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJzY2VuZVRleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMCk7XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInJ0X3dcIixcInVuaWZvcm0xZlwiLHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInJ0X2hcIixcInVuaWZvcm0xZlwiLHdpbmRvdy5pbm5lckhlaWdodCk7XG5cblx0Ly8gdGhpcy5zaGFkZXIudW5pZm9ybShcImZib1dcIiwgXCJ1bmlmb3JtMWZcIiwgZmJvU2l6ZS53KTtcblx0Ly8gdGhpcy5zaGFkZXIudW5pZm9ybShcImZib0hcIiwgXCJ1bmlmb3JtMWZcIiwgZmJvU2l6ZS5oKTtcblxuXHQvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwid2luV1wiLCBcInVuaWZvcm0xZlwiLCB3aW5kb3cuaW5uZXJXaWR0aCk7XG5cdC8vIHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5IXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cdCAvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwidGV4dHVyZVBhcnRpY2xlXCIsIFwidW5pZm9ybTFpXCIsIDEpO1xuXHQvLyB0ZXh0dXJlUG9zLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHR0ZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHR0aGlzLmRyYXcodGhpcy5tZXNoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlld0JsdXI7IiwiLy9WaWV3Rmxvb3IuanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3Rmxvb3IoKXt9O1xuXG52YXIgcCA9IFZpZXdGbG9vci5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBpbmRpY2VzID0gW107XG5cdFxuXHR2YXIgd2lkdGggPSB3aW5kb3cuTlMuR0wucGFyYW1zLndpZHRoO1xuXHR2YXIgaGVpZ2h0ID0gd2luZG93Lk5TLkdMLnBhcmFtcy5oZWlnaHQ7XG5cdHZhciBkZXB0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMuZGVwdGg7XG5cblx0XG5cblxuXHQvLyAvL1JPT0Zcblx0Ly8gcG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCBoZWlnaHQsIC1kZXB0aF0pO1xuXHQvLyBwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgZGVwdGhdKTtcblxuXHQvLyBwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDBdKTtcblxuXHRcblx0Ly8gaW5kaWNlcy5wdXNoKDAsMSwyLDMsMCwyKTtcblxuXG5cdC8vRkxPT1Jcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgZGVwdGhdKTtcblxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCBkZXB0aF0pO1xuXG5cdGNvb3Jkcy5wdXNoKFswLCAwXSk7XG5cdGNvb3Jkcy5wdXNoKFswLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAwXSk7XG5cdFxuXHRcblxuXHRpbmRpY2VzLnB1c2goMCwxLDIsMywwLDIpO1xuXG5cdFxuXG5cdFxuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBmbG9vclRleHR1cmUsIGF1ZGlvRGF0YSwgZmJvU2l6ZSkge1xuXG5cdHRoaXMudHJhbnNmb3Jtcy5wdXNoKCk7XG5cblx0dGhpcy5zaGFkZXIuYmluZCgpO1xuXHQvLyBjb25zb2xlLmxvZygnZmxvb3InKTtcblx0aWYgKGF1ZGlvRGF0YS5sZW5ndGggPiA4KXtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbERlZXBcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzNdKTtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbEhpZ2hcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzhdKTtcblxuXHR9XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInZpZGVvVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImNvbmNyZXRlVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAxKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0XG5cdHZpZGVvVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAwKTtcblx0Zmxvb3JUZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDEpO1xuXHRcblx0dGhpcy5kcmF3KHRoaXMubWVzaCk7XG5cdFxuXHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdGbG9vcjsiLCIvL1ZpZXdJbXBvcnQuanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2hQbGFpbiA9IHJlcXVpcmUoJy4uL01lc2hQbGFpbicpO1xuXG5mdW5jdGlvbiBWaWV3SW1wb3J0KCl7fTtcblxudmFyIHAgPSBWaWV3SW1wb3J0LnByb3RvdHlwZSA9IG5ldyBWaWV3KCk7XG52YXIgcyA9IFZpZXcucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dGhpcy5zdWJWaWV3cyA9IFtdO1xuXHR0aGlzLmhhc1N1YlZpZXdzID0gZmFsc2U7XG5cdFxuXHR0aGlzLmN1cnJlbnRBbmltYXRpb25Qcm9wID0gbnVsbDtcblx0dGhpcy5jdXJyZW50QW5pbWF0aW9uVmFsID0gdW5kZWZpbmVkO1xuXHR0aGlzLmlzQW5pbWF0aW5nID0gZmFsc2U7XG5cblx0dGhpcy5tZXNoID0gbnVsbDtcblxuXHR0aGlzLnRlc3QgPSAwO1xuXG5cdHRoaXMuY3VycmVudFRyYW5zbGF0ZSA9IC0yMDtcblxufTtcblxucC5jcmVhdGVNZXNoID0gZnVuY3Rpb24oZGF0YSl7XG5cblx0dmFyIG1lc2ggPSBkYXRhLm1lc2hEYXRhO1xuXHR0aGlzLm1hdGVyaWFsID0gZGF0YS5tYXRlcmlhbERhdGE7XG5cblx0dmFyIGNvb3JkcyA9IFtdO1xuXHR2YXIgdmVydHMgPSBbXTtcblx0dmFyIGZhY2VzID0gW107XG5cdHZhciBtYXggPSB7eDowLCB5OjB9O1xuXHR2YXIgbWluID0ge3g6MCwgeTowfTtcblxuXG5cblx0dmFyIGNvbG9ycyA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTxtZXNoLnZlcnRpY2VzLmxlbmd0aDtpKz0gMyl7XG5cdFx0aWYgKGkgPCAyMDAwKXtcblx0XHRcdGNvbG9ycy5wdXNoKC41KTtcblx0XHRcdGNvbG9ycy5wdXNoKC4xKTtcblx0XHRcdGNvbG9ycy5wdXNoKC44KTtcblx0XHR9ZWxzZSBpZiAoaSA+PSAyMDAwICYmIGkgPCA1NTAwKXtcblx0XHRcdGNvbG9ycy5wdXNoKC4xKTtcblx0XHRcdGNvbG9ycy5wdXNoKC45KTtcblx0XHRcdGNvbG9ycy5wdXNoKC44KTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvbG9ycy5wdXNoKDEuMCk7XG5cdFx0XHRjb2xvcnMucHVzaCguMyk7XG5cdFx0XHRjb2xvcnMucHVzaCguNyk7XG5cdFx0fVxuXG5cdH1cblxuXHQvLyBkZWJ1Z2dlcjtcblxuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoUGxhaW4oKTtcblx0dGhpcy5tZXNoLmluaXQobWVzaC52ZXJ0aWNlcy5sZW5ndGgvMywgbWVzaC50cmlhbmdsZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KG1lc2gudmVydGljZXMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVGV4Q29vcmRzKG1lc2guY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMobWVzaC50cmlhbmdsZXMpO1xuXHR0aGlzLm1lc2guYnVmZmVyRGF0YShtZXNoLm5vcm1hbHMsIFwiYVZlcnRleE5vcm1hbFwiLCAzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckRhdGEobmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCBcImFWZXJ0ZXhDb2xvclwiLCAzKTtcblxuXG59O1xuXG5wLmFkZFN1YlZpZXdzID0gZnVuY3Rpb24odmlld3Mpe1xuXG5cdHRoaXMuc3ViVmlld3MgPSB2aWV3cy5zbGljZSgwKTtcblx0dGhpcy5oYXNTdWJWaWV3cyA9IHRydWU7XG5cblx0dGhpcy5fbWF0cml4ID0gbWF0NC5jcmVhdGUoKTtcbn07XG5cbnAucmVzZXRBbmltYXRpb24gPSBmdW5jdGlvbigpe1xuXG5cdHRoaXMuY3VycmVudEFuaW1hdGlvblByb3AgPSBudWxsO1xuXHR0aGlzLmN1cnJlbnRBbmltYXRpb25WYWwgPSB1bmRlZmluZWQ7XG5cblx0Zm9yKHZhciBpPTA7aTx0aGlzLnN1YlZpZXdzLmxlbmd0aDtpKyspe1xuXHRcdHRoaXMuc3ViVmlld3NbaV0uY3VycmVudEFuaW1hdGlvblZhbCA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLnN1YlZpZXdzW2ldLmN1cnJlbnRBbmltYXRpb25Qcm9wID0gbnVsbDtcblx0fVxuXG59O1xuXG5cblxucC5yZW5kZXIgPSBmdW5jdGlvbih2aWRlb1RleHR1cmUsIGF1ZGlvRGF0YSwgc2hhZGVyLCBpc0NoaWxkKSB7XG5cblx0aWYgKGlzQ2hpbGQpXG5cdFx0dGhpcy5zaGFkZXIgPSBzaGFkZXI7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblx0XG5cblx0Ly8gdmFyIG5NYXRyaXggPSBtYXQ0LmNyZWF0ZSgpO1xuXHR2YXIgbXZNYXRyaXggPSB0aGlzLnRyYW5zZm9ybXMuZ2V0TXZNYXRyaXgoKTtcblxuXG5cdGlmICghaXNDaGlsZCl7XG5cdFx0bWF0NC50cmFuc2xhdGUobXZNYXRyaXgsIG12TWF0cml4LCBbLTQwLCB0aGlzLmN1cnJlbnRUcmFuc2xhdGUsIC0yMF0pO1xuXHRcdFxuXHR9XG5cdC8vIGlmIChpc0NoaWxkKXtcblx0Ly8gXHQvLyBtYXQ0Lm11bHRpcGx5KG12TWF0cml4LCBtdk1hdHJpeCwgcGFyZW50TWF0cml4KTtcblx0Ly8gXHQvLyBtYXQ0LnNjYWxlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAuMDgsIDAuMDgsIDAuMDhdKTtcblx0Ly8gXHQvLyB0aGlzLnRlc3QrPTAuMTtcblx0Ly8gXHQvLyBtYXQ0LnJvdGF0ZShtdk1hdHJpeCwgbXZNYXRyaXgsIHRoaXMudGVzdCAqIE1hdGguUEkvMTgwLCBbMCwxLDBdKTtcblx0Ly8gfVxuXG5cdGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb25WYWwpe1xuXHRcdFxuXHRcdGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb25Qcm9wID09ICdyb3RhdGVaJylcblx0XHRcdG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgdGhpcy5jdXJyZW50QW5pbWF0aW9uVmFsICpNYXRoLlBJLzE4MCwgWzAsIDAsIDFdKTtcblx0XHRlbHNlIGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb25Qcm9wID09ICdyb3RhdGVYJylcblx0XHRcdG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgdGhpcy5jdXJyZW50QW5pbWF0aW9uVmFsICpNYXRoLlBJLzE4MCwgWzEsIDAsIDBdKTtcblx0fVxuXG5cdGlmICh0aGlzLmhhc1N1YlZpZXdzKXtcblx0XHRcblx0XHRtYXQ0LnNjYWxlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAuMDgsIDAuMDgsIDAuMDhdKTtcblx0XHQvLyBtYXQ0LnRyYW5zbGF0ZShtdk1hdHJpeCwgbXZNYXRyaXgsIFswLCAxNSwgMF0pO1xuXG5cdFx0Ly8gbWF0NC5jb3B5KHRoaXMuX21hdHJpeCwgbXZNYXRyaXgpO1xuXHRcdFxuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuc3ViVmlld3MubGVuZ3RoO2krKyl7XG5cdFx0XHR0aGlzLnN1YlZpZXdzW2ldLnJlbmRlcih2aWRlb1RleHR1cmUsIGF1ZGlvRGF0YSwgdGhpcy5zaGFkZXIsIHRydWUpO1xuXHRcdH1cblx0XHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gaWYgKCFzaGFkZXIgJiYgIXRoaXMuaGFzU3ViVmlld3Mpe1xuXHQvLyBcdG1hdDQudHJhbnNsYXRlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAsMTAsIDBdKTtcblx0Ly8gXHRtYXQ0LnNjYWxlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAuMDUsIDAuMDUsIDAuMDVdKTtcblxuXHQvLyB9XG5cdFxuXHQvLyBtYXQ0LmNvcHkobk1hdHJpeCwgbXZNYXRyaXgpO1xuIC8vICAgIG1hdDQuaW52ZXJ0KG5NYXRyaXgsIG5NYXRyaXgpO1xuIC8vICAgIG1hdDQudHJhbnNwb3NlKG5NYXRyaXgsIG5NYXRyaXgpO1xuXG5cbiAgICB0aGlzLnNoYWRlci5iaW5kKCk7XG5cbiAgICBpZiAoYXVkaW9EYXRhLmxlbmd0aCA+IDgpe1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsRGVlcFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbM10pO1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsSGlnaFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbOF0pO1xuXG5cdH1cblxuXHQvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwidU5NYXRyaXhcIiwgXCJ1bmlmb3JtTWF0cml4NGZ2XCIsIG5NYXRyaXgpO1xuXHQvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwiZGlmZnVzZVwiLCBcInVuaWZvcm0zZnZcIiwgdGhpcy5kaWZmdXNlKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInZpZGVvVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblx0XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInVMaWdodFBvc2l0aW9uXCIsIFwidW5pZm9ybTNmdlwiLCBuZXcgRmxvYXQzMkFycmF5KFswLjAsIDIwLjAsIDIwLjBdKSApO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidUxpZ2h0QW1iaWVudFwiLCBcInVuaWZvcm00ZnZcIiwgbmV3IEZsb2F0MzJBcnJheShbMS4wLCAxLjAsIDEuMCwgMS4wXSkgKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInVMaWdodERpZmZ1c2VcIiwgXCJ1bmlmb3JtNGZ2XCIsIG5ldyBGbG9hdDMyQXJyYXkoWzEuMCwgMS4wLCAxLjAsIDEuMF0pICk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ1TGlnaHRTcGVjdWxhclwiLCBcInVuaWZvcm00ZnZcIiwgbmV3IEZsb2F0MzJBcnJheShbMS4wLCAxLjAsIDEuMCwgMS4wXSkgKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidU1hdGVyaWFsQW1iaWVudFwiLCBcInVuaWZvcm00ZnZcIiwgbmV3IEZsb2F0MzJBcnJheShbMC4xLCAwLjEsIDAuMSwgMS4wXSkpO1xuXHRpZiAodGhpcy5tYXRlcmlhbC5kaWZmdXNlKVxuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ1TWF0ZXJpYWxEaWZmdXNlXCIsIFwidW5pZm9ybTNmdlwiLCB0aGlzLm1hdGVyaWFsLmRpZmZ1c2UpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidU1hdGVyaWFsU3BlY3VsYXJcIiwgXCJ1bmlmb3JtM2Z2XCIsIHRoaXMubWF0ZXJpYWwuc3BlY3VsYXIpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidVNoaW5pbmVzc1wiLCBcInVuaWZvcm0xZlwiLCB0aGlzLm1hdGVyaWFsLnNoaW5pbmVzcyk7XG5cdFxuXHR2aWRlb1RleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cblx0dGhpcy5kcmF3KHRoaXMubWVzaCk7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3SW1wb3J0OyIsIi8vVmlld0xhbXAuanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3TGFtcCgpe307XG5cbnZhciBwID0gVmlld0xhbXAucHJvdG90eXBlID0gbmV3IFZpZXcoKTtcbnZhciBzID0gVmlldy5wcm90b3R5cGU7XG5cbnZhciBnbCA9IG51bGw7XG5cbnZhciByYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkgeyByZXR1cm4gbWluICsgTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pOyB9XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRQYXRoLCBmcmFnUGF0aCl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXHRcblx0cy5pbml0LmNhbGwodGhpcywgdmVydFBhdGgsIGZyYWdQYXRoKTtcblxuXHR0aGlzLmNvbG9yT25lID0gW3JhbmRvbSgwLDEpLCByYW5kb20oMCwxKSwgLjddO1xuXHR0aGlzLmNvbG9yVHdvID0gdGhpcy5jb2xvck9uZS5zbGljZSgwKTtcblx0dGhpcy5jb2xvclRocmVlID0gdGhpcy5jb2xvck9uZS5zbGljZSgwKTtcblx0dGhpcy5jb2xvckZvdXIgPSB0aGlzLmNvbG9yT25lLnNsaWNlKDApO1xuXG5cdHRoaXMuY29sb3JPbmVUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXHR0aGlzLmNvbG9yVHdvVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblx0dGhpcy5jb2xvclRocmVlVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblx0dGhpcy5jb2xvckZvdXJUaW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG5cdHZhciBwb3NpdGlvbnMgPSBbXTtcblx0dmFyIGNvb3JkcyA9IFtdO1xuXHR2YXIgaW5kaWNlcyA9IFtdO1xuXHR2YXIgaW5kZXhEYXRhID0gW107XG5cdFxuXHR2YXIgd2lkdGggPSAxO1xuXHR2YXIgaGVpZ2h0ID0gNjtcblx0dmFyIGRlcHRoID0gMDtcblxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCA2LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIDYsIGRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgZGVwdGhdKTtcblxuXHRjb29yZHMucHVzaChbMCwgMF0pO1xuXHRjb29yZHMucHVzaChbMCwgMV0pO1xuXHRjb29yZHMucHVzaChbMSwgMV0pO1xuXHRjb29yZHMucHVzaChbMSwgMF0pO1xuXG5cdGluZGljZXMucHVzaCgwLCAxLCAyLCAzLCAwLCAyKTtcblx0XG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cdFxufTtcblxucC5yZW5kZXIgPSBmdW5jdGlvbihsYW1wVGV4dHVyZSkge1xuXG5cdHZhciBub3cgPSBEYXRlLm5vdygpO1xuXG5cdHZhciBjb2xvck9uZURpZmYgPSBub3cgLSB0aGlzLmNvbG9yT25lVGltZXN0YW1wO1xuXHR2YXIgY29sb3JUd29EaWZmID0gbm93IC0gdGhpcy5jb2xvclR3b1RpbWVzdGFtcDtcblx0dmFyIGNvbG9yVGhyZWVEaWZmID0gbm93IC0gdGhpcy5jb2xvclRocmVlVGltZXN0YW1wO1xuXHR2YXIgY29sb3JGb3VyRGlmZiA9IG5vdyAtIHRoaXMuY29sb3JGb3VyVGltZXN0YW1wO1xuXG5cdGlmIChjb2xvck9uZURpZmYgPj0gMTIwMCl7XG5cdFx0dGhpcy5jb2xvck9uZSA9IFtyYW5kb20oMCwxKSwgcmFuZG9tKDAsMSksIHJhbmRvbSgwLDEpXTtcblx0XHR0aGlzLmNvbG9yT25lVGltZXN0YW1wID0gbm93O1xuXHRcdHRoaXMuY29sb3JUd29UaW1lc3RhbXAgPSBub3c7XG5cdFx0dGhpcy5jb2xvclRocmVlVGltZXN0YW1wID0gbm93O1xuXHRcdHRoaXMuY29sb3JGb3VyVGltZXN0YW1wID0gbm93O1xuXG5cdH1cblx0ZWxzZSBpZiAoY29sb3JGb3VyRGlmZiA+PSAxMDAwKXtcblx0XHR0aGlzLmNvbG9yRm91ciA9IHRoaXMuY29sb3JPbmUuc2xpY2UoMCk7XG5cdFx0XG5cdFx0XG5cdH1cblx0ZWxzZSBpZiAoY29sb3JUaHJlZURpZmYgPj0gOTAwKXtcblx0XHR0aGlzLmNvbG9yVGhyZWUgPSB0aGlzLmNvbG9yT25lLnNsaWNlKDApO1xuXHRcdFxuXHR9XG5cdGVsc2UgaWYgKGNvbG9yVHdvRGlmZiA+PSA2MDApe1xuXHRcdHRoaXMuY29sb3JUd28gPSB0aGlzLmNvbG9yT25lLnNsaWNlKDApO1xuXHRcdFxuXHR9XG5cdFxuXHRcblxuXHR0aGlzLnRyYW5zZm9ybXMucHVzaCgpO1xuXG5cdHZhciBtdk1hdHJpeCA9IHRoaXMudHJhbnNmb3Jtcy5nZXRNdk1hdHJpeCgpO1xuXG5cdG1hdDQudHJhbnNsYXRlKG12TWF0cml4LCBtdk1hdHJpeCwgWzUxLDEwLC01OV0pXG5cdC8vIG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgTWF0aC5QSSAqIC0uNSwgWzAsMSwwXSk7XG5cdC8vIG1hdDQuc2NhbGUobXZNYXRyaXgsIG12TWF0cml4LCBbMC4wNiwgMC4xLCAwLjA1XSk7XG5cblx0dGhpcy5zaGFkZXIuYmluZCgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJsYW1wVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiY29sb3JPbmVcIiwgXCJ1bmlmb3JtM2Z2XCIsIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5jb2xvck9uZSkpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiY29sb3JUd29cIiwgXCJ1bmlmb3JtM2Z2XCIsIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5jb2xvclR3bykpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiY29sb3JUaHJlZVwiLCBcInVuaWZvcm0zZnZcIiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNvbG9yVGhyZWUpKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImNvbG9yRm91clwiLCBcInVuaWZvcm0zZnZcIiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLmNvbG9yRm91cikpO1xuXG5cdFxuXG5cdGxhbXBUZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xuXHRcblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TGFtcDsiLCIvL1ZpZXdMZWQuanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3TGVkKCl7fTtcblxudmFyIHAgPSBWaWV3TGVkLnByb3RvdHlwZSA9IG5ldyBWaWV3KCk7XG52YXIgcyA9IFZpZXcucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBpbmRpY2VzID0gW107XG5cdHZhciBpbmRleERhdGEgPSBbXTtcblx0Ly8gdGhpcy5ub3JtYWxzID0gW107XG5cdC8vIHRoaXMuaW5kZXhEYXRhID0gW107XG5cblx0Ly8gdmFyIGxhdGl0dWRlQmFuZHMgPSAxMDtcblx0Ly8gdmFyIGxvbmdpdHVkZUJhbmRzID0gMTA7XG5cdC8vIHZhciByYWRpdXMgPSAxLjQ7XG5cdHZhciB3aWR0aCA9IDE7XG5cdHZhciBoZWlnaHQgPSA2O1xuXHR2YXIgZGVwdGggPSAwO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAtMSwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgLS41LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIC0uNSwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goW3dpZHRoLCAtMSwgZGVwdGhdKTtcblxuXHRmb3IgKHZhciBpPTA7aTw0O2krKyl7XG5cdFx0aW5kZXhEYXRhLnB1c2goWzBdKTtcblx0fVxuXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIC0uNSwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIC0uNSwgZGVwdGhdKTtcblxuXHRmb3IgKHZhciBpPTA7aTw0O2krKyl7XG5cdFx0aW5kZXhEYXRhLnB1c2goWzFdKTtcblx0fVxuXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIGRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIC41LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIC41LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIDAsIGRlcHRoXSk7XG5cblx0Zm9yICh2YXIgaT0wO2k8NDtpKyspe1xuXHRcdGluZGV4RGF0YS5wdXNoKFsyXSk7XG5cdH1cblxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAuNSwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMSwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goW3dpZHRoLCAxLCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIC41LCBkZXB0aF0pO1xuXG5cdGZvciAodmFyIGk9MDtpPDQ7aSsrKXtcblx0XHRpbmRleERhdGEucHVzaChbM10pO1xuXHR9XG5cblxuXHRcblxuXHQvLyBjb29yZHMucHVzaChbMCwgMF0pO1xuXHQvLyBjb29yZHMucHVzaChbMCwgMV0pO1xuXHQvLyBjb29yZHMucHVzaChbMSwgMV0pO1xuXHQvLyBjb29yZHMucHVzaChbMSwgMF0pO1xuXG5cblx0XG5cblx0XG5cblx0aW5kaWNlcy5wdXNoKDAsIDEsIDIsIDMsIDAsIDIpO1xuXHRpbmRpY2VzLnB1c2goNCwgNSwgNiwgNywgNCwgNik7XG5cdGluZGljZXMucHVzaCg4LCA5LCAxMCwgMTEsIDgsIDEwKTtcblx0aW5kaWNlcy5wdXNoKDEyLCAxMywgMTQsIDE1LCAxMiwgMTQpO1xuXG5cdC8vIGZvciAodmFyIGk9MDtpPDQ7aSsrKXtcblxuXHQvLyBcdHRoaXMuY3JlYXRlTGVkKGxhdGl0dWRlQmFuZHMsIGxvbmdpdHVkZUJhbmRzLCByYWRpdXMsIGkpO1xuXHQvLyB9XG5cblx0XG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdC8vIHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cdHRoaXMubWVzaC5idWZmZXJEYXRhKGluZGV4RGF0YSwgJ2FJbmRleERhdGEnLCAxLCBmYWxzZSk7XG5cbn07XG5cbi8vIHAuY3JlYXRlTGVkID0gZnVuY3Rpb24obGF0aXR1ZGVCYW5kcywgbG9uZ2l0dWRlQmFuZHMsIHJhZGl1cywgaWR4KXtcblxuLy8gXHRmb3IgKHZhciBsYXROdW1iZXI9MDsgbGF0TnVtYmVyIDw9IGxhdGl0dWRlQmFuZHM7IGxhdE51bWJlcisrKSB7XG4vLyBcdFx0dmFyIHRoZXRhID0gbGF0TnVtYmVyICogTWF0aC5QSSAvIGxhdGl0dWRlQmFuZHM7XG4vLyBcdFx0dmFyIHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xuLy8gXHRcdHZhciBjb3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKTtcblxuLy8gXHRcdGZvciAodmFyIGxvbmdOdW1iZXI9MDsgbG9uZ051bWJlciA8PSBsb25naXR1ZGVCYW5kczsgbG9uZ051bWJlcisrKSB7XG4vLyBcdFx0XHR2YXIgcGhpID0gbG9uZ051bWJlciAqIDIgKiBNYXRoLlBJIC8gbG9uZ2l0dWRlQmFuZHM7XG4vLyBcdFx0XHR2YXIgc2luUGhpID0gTWF0aC5zaW4ocGhpKTtcbi8vIFx0XHRcdHZhciBjb3NQaGkgPSBNYXRoLmNvcyhwaGkpO1xuXG4vLyBcdFx0XHR2YXIgeCA9IGNvc1BoaSAqIHNpblRoZXRhO1xuLy8gXHRcdFx0dmFyIHkgPSBjb3NUaGV0YTtcbi8vIFx0XHRcdHZhciB6ID0gc2luUGhpICogc2luVGhldGE7XG4vLyBcdFx0XHR2YXIgdSA9IDEgLSAobG9uZ051bWJlciAvIGxvbmdpdHVkZUJhbmRzKTtcbi8vIFx0XHRcdHZhciB2ID0gMSAtIChsYXROdW1iZXIgLyBsYXRpdHVkZUJhbmRzKTtcblxuXG4vLyBcdFx0XHR0aGlzLm5vcm1hbHMucHVzaChbeCx5LHpdKTtcblxuLy8gXHRcdFx0dGhpcy5jb29yZHMucHVzaChbdS0uMix2XSk7XG5cbi8vIFx0XHRcdHRoaXMucG9zaXRpb25zLnB1c2goW3JhZGl1cyAqIHgsIHJhZGl1cyAqIHksIDEwXSk7XG4vLyBcdFx0XHR0aGlzLmluZGV4RGF0YS5wdXNoKFtpZHhdKTtcblxuXG4vLyBcdFx0fVxuLy8gXHR9XG5cbi8vIFx0Zm9yICh2YXIgbGF0TnVtYmVyPTA7IGxhdE51bWJlciA8IGxhdGl0dWRlQmFuZHM7IGxhdE51bWJlcisrKSB7XG4vLyBcdFx0Zm9yICh2YXIgbG9uZ051bWJlcj0wOyBsb25nTnVtYmVyIDwgbG9uZ2l0dWRlQmFuZHM7IGxvbmdOdW1iZXIrKykge1xuLy8gXHRcdFx0dmFyIGZpcnN0ID0gKGxhdE51bWJlciAqIChsb25naXR1ZGVCYW5kcyArIDEpKSArIGxvbmdOdW1iZXI7XG4vLyBcdFx0XHR2YXIgc2Vjb25kID0gZmlyc3QgKyBsb25naXR1ZGVCYW5kcyArIDE7XG5cbi8vIFx0XHRcdHRoaXMuaW5kaWNlcy5wdXNoKGZpcnN0LCBzZWNvbmQsIGZpcnN0KzEsIHNlY29uZCwgc2Vjb25kICsgMSwgZmlyc3QgKyAxKTtcblx0XG4vLyBcdFx0fVxuLy8gXHR9XG4gXG5cblx0XG5cbi8vIH07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblxuXHR2YXIgbXZNYXRyaXggPSB0aGlzLnRyYW5zZm9ybXMuZ2V0TXZNYXRyaXgoKTtcblxuXHQvLyBtYXQ0LnRyYW5zbGF0ZShtdk1hdHJpeCwgbXZNYXRyaXgsIFs1MSwxMCwtNTldKVxuXHQvLyBtYXQ0LnJvdGF0ZShtdk1hdHJpeCwgbXZNYXRyaXgsIE1hdGguUEkgKiAtLjUsIFswLDEsMF0pO1xuXHQvLyBtYXQ0LnNjYWxlKG12TWF0cml4LCBtdk1hdHJpeCwgWzAuMDYsIDAuMSwgMC4wNV0pO1xuXG5cdHRoaXMuc2hhZGVyLmJpbmQoKTtcblx0XG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xuXHRcblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TGVkOyIsIi8vVmlld0xlZnRXYWxsLmpzXG5cbnZhciBWaWV3ID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL1ZpZXcnKTtcbnZhciBNZXNoID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL01lc2gnKTtcdFxuXG5mdW5jdGlvbiBWaWV3TGVmdFdhbGwoKXt9O1xuXG52YXIgcCA9IFZpZXdMZWZ0V2FsbC5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24odmVydFBhdGgsIGZyYWdQYXRoKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cdFxuXHRzLmluaXQuY2FsbCh0aGlzLCB2ZXJ0UGF0aCwgZnJhZ1BhdGgpO1xuXG5cdC8vZGF0IGd1aSBwcm9wc1xuXHR0aGlzLmNvbG9yTm9pc2VNdWx0aXBsaWVyID0gMTA7XG5cdHRoaXMubm9pc2VCYXNlQ29sb3IgPSBbMjAwLFxuICAgICAgMTkuOTk5OTk5OTk5OTk5OTk2LFxuICAgICAgNjIuMzUyOTQxMTc2NDcwNTldO1xuXHR0aGlzLmF1ZGlvTGV2ZWxOb2lzZURpdmlkZXIgPSAyNi4zNzcyMTE2ODMwMDIxMDY7XG5cdHRoaXMudmVydGV4TXVsdGlwbGllciA9IDAuMzcwMjA0OTkxODQ0MjIwNjtcblx0dGhpcy51c2VQdWxzZSA9IGZhbHNlO1xuXG5cdHZhciBwb3NpdGlvbnMgPSBbXTtcblx0dmFyIGNvb3JkcyA9IFtdO1xuXHR2YXIgaW5kaWNlcyA9IFtdO1xuXG5cdHZhciB3aWR0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMud2lkdGg7XG5cdHZhciBoZWlnaHQgPSB3aW5kb3cuTlMuR0wucGFyYW1zLmhlaWdodDtcblx0dmFyIGRlcHRoID0gd2luZG93Lk5TLkdMLnBhcmFtcy5kZXB0aDtcblxuXG5cdFxuXG5cblx0XG5cdFxuXG5cdC8vTEVGVCBTSURFV0FMTFxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCAtZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIGRlcHRoXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblxuXG5cblxuXHRpbmRpY2VzLnB1c2goMCwgMSwgMiwgMywgMCwgMik7XG5cdC8vIGluZGljZXMucHVzaCgwLDEsMiwzLDQsNSk7XG5cblx0XG5cblx0XG5cblx0XG5cdC8vIGRlYnVnZ2VyO1xuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cblxuXG59O1xuXG5cblxuXG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBhdWRpb0RhdGFJbiwgcGVybVRleHR1cmUsIHNpbXBsZXhUZXh0dXJlKSB7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblx0XG5cdHZhciBtdk1hdHJpeCA9IHRoaXMudHJhbnNmb3Jtcy5nZXRNdk1hdHJpeCgpO1xuXG5cdFxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0aWYgKGF1ZGlvRGF0YUluLmxlbmd0aCA+IDgpe1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsRGVlcFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFJblszXSk7XG5cdFx0dGhpcy5zaGFkZXIudW5pZm9ybShcImF1ZGlvTGV2ZWxIaWdoXCIsIFwidW5pZm9ybTFmXCIsIGF1ZGlvRGF0YUluWzhdKTtcblxuXHR9XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInNpbXBsZXhUZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDApO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwicGVybVRleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMSk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ2aWRlb1RleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMik7XG5cblx0Ly8gZGF0IGd1aSBwcm9wc1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiY29sb3JOb2lzZU11bHRpcGxpZXJcIiwgXCJ1bmlmb3JtMWZcIiwgdGhpcy5jb2xvck5vaXNlTXVsdGlwbGllcik7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJub2lzZUJhc2VDb2xvclwiLCBcInVuaWZvcm0zZnZcIiwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLm5vaXNlQmFzZUNvbG9yKSk7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsTm9pc2VEaXZpZGVyXCIsIFwidW5pZm9ybTFmXCIsIHRoaXMuYXVkaW9MZXZlbE5vaXNlRGl2aWRlcik7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ2ZXJ0ZXhNdWx0aXBsaWVyXCIsIFwidW5pZm9ybTFmXCIsIHRoaXMudmVydGV4TXVsdGlwbGllcik7XG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ1c2VQdWxzZVwiLCBcInVuaWZvcm0xaVwiLCB0aGlzLnVzZVB1bHNlID8gMSA6IDApO1xuXG5cdHNpbXBsZXhUZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHRwZXJtVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAxKTtcblx0dmlkZW9UZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDIpO1xuXG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xuXG5cdFxuXHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3TGVmdFdhbGw7IiwiLy9WaWV3UGxhaW4uanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3UGxhaW4oKXt9O1xuXG52YXIgcCA9IFZpZXdQbGFpbi5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxucC5pbml0ID0gZnVuY3Rpb24odmVydFBhdGgsIGZyYWdQYXRoKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cdFxuXHRzLmluaXQuY2FsbCh0aGlzLCB2ZXJ0UGF0aCwgZnJhZ1BhdGgpO1xuXG5cdHZhciBwb3NpdGlvbnMgPSBbXTtcblx0dmFyIGNvb3JkcyA9IFtdO1xuXHR2YXIgaW5kaWNlcyA9IFswLCAxLCAyLCAwLCAyLCAzXTtcblxuXHR2YXIgc2l6ZSA9IDE7XG5cdHBvc2l0aW9ucy5wdXNoKFstc2l6ZSwgLXNpemUsIDBdKTtcblx0cG9zaXRpb25zLnB1c2goWyBzaXplLCAtc2l6ZSwgMF0pO1xuXHRwb3NpdGlvbnMucHVzaChbIHNpemUsICBzaXplLCAwXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFstc2l6ZSwgIHNpemUsIDBdKTtcblxuXHRjb29yZHMucHVzaChbMCwgMF0pO1xuXHRjb29yZHMucHVzaChbMSwgMF0pO1xuXHRjb29yZHMucHVzaChbMSwgMV0pO1xuXHRjb29yZHMucHVzaChbMCwgMV0pO1xuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KDQsIDYsIGdsLlRSSUFOR0xFUyk7XG5cdHRoaXMubWVzaC5idWZmZXJWZXJ0ZXgocG9zaXRpb25zKTtcblx0dGhpcy5tZXNoLmJ1ZmZlclRleENvb3Jkcyhjb29yZHMpO1xuXHR0aGlzLm1lc2guYnVmZmVySW5kaWNlcyhpbmRpY2VzKTtcblxufTtcblxuXG5cbnAucmVuZGVyID0gZnVuY3Rpb24odGV4dHVyZSwgZmJvU2l6ZSkge1xuXG5cdC8vIHRoaXMudHJhbnNmb3Jtcy5jYWxjdWxhdGVNb2RlbFZpZXcoKTtcblxuXHQvLyB2YXIgbXZNYXRyaXggPSB0aGlzLnRyYW5zZm9ybXMuZ2V0TXZNYXRyaXgoKTtcblxuXHQvLyBtYXQ0LnJvdGF0ZShtdk1hdHJpeCwgLS40Kk1hdGguUEksIFsxLCAwLCAwXSk7XG4gICAgLy8gbWF0NC5yb3RhdGUobXZNYXRyaXgsIGRlZ1RvUmFkKC15YXcpLCBbMCwgMSwgMF0pO1xuICAgIC8vIG1hdDQudHJhbnNsYXRlKG12TWF0cml4LCBbLXhQb3MsIC15UG9zLCAtelBvc10pO1xuXHQvLyByZXR1cm47XG5cdHRoaXMuc2hhZGVyLmJpbmQoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInVTYW1wbGVyMFwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0IC8vIHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ0ZXh0dXJlUGFydGljbGVcIiwgXCJ1bmlmb3JtMWlcIiwgMSk7XG5cdC8vIHRleHR1cmVQb3MuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdHRleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3UGxhaW47IiwiLy9WaWV3UHJpc20uanNcblxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvVmlldycpO1xudmFyIE1lc2ggPSByZXF1aXJlKCcuLi9mcmFtZXdvcmsvTWVzaCcpO1xuXG5mdW5jdGlvbiBWaWV3UHJpc20oKXt9O1xuXG52YXIgcCA9IFZpZXdQcmlzbS5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxudmFyIHJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7IHJldHVybiBtaW4gKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7IH1cblxucC5pbml0ID0gZnVuY3Rpb24odmVydFBhdGgsIGZyYWdQYXRoKXtcblxuXHRnbCA9IHdpbmRvdy5OUy5HTC5nbENvbnRleHQ7XG5cdFxuXHRzLmluaXQuY2FsbCh0aGlzLCB2ZXJ0UGF0aCwgZnJhZ1BhdGgpO1xuXG5cblx0dGhpcy5tYXRlcmlhbCA9IG51bGw7XG5cdHRoaXMubWVzaCA9IG51bGw7XG5cblx0dGhpcy5hbmdsZSA9IDA7XG5cblx0dGhpcy5taWRwb2ludHMgPSBbXTtcblxufTtcblxuXG5cbnAuY2FsY0FkakxldmVsID0gZnVuY3Rpb24ocG9pbnRzKXtcblxuXHR2YXIgbWlkU2l6ZSA9IDIwMDtcblx0dmFyIGZvdW5kUG9pbnRzID0gW107XG5cdHZhciBwb2ludHNUb1VzZSA9IFtdO1xuXHR2YXIgYWRqTGV2ZWwgPSBbXTtcblx0dmFyIGFkakxldmVsUmVmID0gW107XG5cdHZhciBhVXNlSW52ZXJzZSA9IFtdO1xuXHR2YXIgYVVzZUludmVyc2VSZWYgPSBbXTtcblx0Zm9yICh2YXIgaT0wO2k8cG9pbnRzLmxlbmd0aDtpKyspe1xuXHRcdGlmIChwb2ludHNbaV1bMV0gPiAtbWlkU2l6ZSAmJiBwb2ludHNbaV1bMV0gPCBtaWRTaXplKXtcblxuXHRcdFx0aWYgKHBvaW50c1tpXVsyXSA+IC1taWRTaXplICYmIHBvaW50c1tpXVsyXSA8IG1pZFNpemUpe1xuXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHBvaW50c1tpXSk7XG5cdFx0XHRcdC8vIGZvdW5kUG9pbnRzLnB1c2gocG9pbnRzW2ldKTtcblx0XHRcdFx0dmFyIGVxdWFscyA9IHRoaXMuY2hlY2tGb3JFcXVhbHMocG9pbnRzW2ldLCBwb2ludHMsIGkpO1xuXHRcdFx0XHRpZiAoZXF1YWxzLmZvdW5kKXtcblx0XHRcdFx0Ly8gaWYgKHRoaXMuY2hlY2tGb3JFcXVhbHMocG9pbnRzW2ldLCBwb2ludHMsIGkpKXtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhwb2ludHNbaV1bMV0pO1xuXHRcdFx0XHQvL1x0ZGVidWdnZXI7XG5cdFx0XHRcdFx0aWYgKGFkakxldmVsUmVmW2VxdWFscy5pZHhdKXtcblx0XHRcdFx0XHRcdGFkakxldmVsLnB1c2goYWRqTGV2ZWxSZWZbZXF1YWxzLmlkeF0pO1xuXHRcdFx0XHRcdFx0YVVzZUludmVyc2UucHVzaChhVXNlSW52ZXJzZVJlZltlcXVhbHMuaWR4XSk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHR2YXIgcmFuZG9tTnIgPSByYW5kb20oNCwgMTApXG5cdFx0XHRcdFx0XHRhZGpMZXZlbC5wdXNoKFtyYW5kb21OciwgcmFuZG9tTnIsIHJhbmRvbU5yXSk7XG5cdFx0XHRcdFx0XHRhZGpMZXZlbFJlZltpXSA9IGFkakxldmVsW2FkakxldmVsLmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdGlmIChyYW5kb21OciA8IDcpXG5cdFx0XHRcdFx0XHRcdGFVc2VJbnZlcnNlLnB1c2goWzJdKTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0YVVzZUludmVyc2UucHVzaChbMV0pO1xuXHRcdFx0XHRcdFx0YVVzZUludmVyc2VSZWZbaV0gPSBhVXNlSW52ZXJzZVthVXNlSW52ZXJzZS5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGFkakxldmVsLnB1c2goWzAsMCwwXSk7XG5cdFx0XHRcdFx0YVVzZUludmVyc2UucHVzaChbMF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9ZWxzZXtcblx0XHRcdGFkakxldmVsLnB1c2goWzAsMCwwXSk7XG5cdFx0XHRhVXNlSW52ZXJzZS5wdXNoKFswXSk7XG5cdFx0fVxuXHRcdFxuXHR9XG5cblx0cmV0dXJuIHthOiBhZGpMZXZlbCwgdTogYVVzZUludmVyc2V9O1xufTtcblxucC5jaGVja0ZvckVxdWFscyA9IGZ1bmN0aW9uKHBvaW50LCBwb2ludHMsIHBvaW50SWR4KXtcblxuXHR2YXIgcmV0ID0ge2ZvdW5kOiBmYWxzZSwgaWR4OiB1bmRlZmluZWR9O1xuXHRmb3IgKHZhciBpPTA7aTxwb2ludHMubGVuZ3RoO2krKyl7XG5cblx0XHRpZiAocG9pbnRbMF0gPT0gcG9pbnRzW2ldWzBdICYmIHBvaW50WzFdID09IHBvaW50c1tpXVsxXSAmJiBwb2ludFsyXSA9PSBwb2ludHNbaV1bMl0pe1xuXG5cdFx0XHRpZiAocG9pbnRJZHggPiBpIHx8IHBvaW50SWR4IDwgaSl7XG5cdFx0XHRcdHJldC5mb3VuZCA9IHRydWU7XG5cdFx0XHRcdHJldC5pZHggPSBpO1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhwb2ludElkeCk7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufTtcblxucC5jcmVhdGVNZXNoID0gZnVuY3Rpb24oZGF0YSl7XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgaW5kaWNlcyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBhQWRqSW5kZXggPSBbXTtcblx0dmFyIGlDID0gMDtcblx0Zm9yICh2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtcblxuXHRcdHZhciBpbmQgPSBkYXRhW2ldLm1lc2hEYXRhLnRyaWFuZ2xlcztcblx0XHRmb3IgKHZhciBxPTA7cTxpbmQubGVuZ3RoO3ErKyl7XG5cblx0XHRcdC8vIGluZFtxXSArPSBpQztcblx0XHRcdGluZGljZXMucHVzaChpbmRbcV0gKz0gaUMpO1xuXHRcdH1cblxuXHRcdC8vIGlDICs9IGluZC5sZW5ndGg7XG5cblx0XHR2YXIgbWVzaFBvcyA9IGRhdGFbaV0ubWVzaERhdGEudmVydGljZXM7XG5cdFx0dmFyIHRlbXBQb3MgPSBbXTtcblx0XHRmb3IgKHZhciBxPTA7cTxtZXNoUG9zLmxlbmd0aDtxKz0zKXtcblxuXHRcdFx0dmFyIHggPSBtZXNoUG9zW3FdO1xuXHRcdFx0dmFyIHkgPSBtZXNoUG9zW3ErMV07XG5cdFx0XHR2YXIgeiA9IG1lc2hQb3NbcSsyXTtcblxuXHRcdFx0cG9zaXRpb25zLnB1c2goW3gseSx6XSk7XG5cdFx0XHR0ZW1wUG9zLnB1c2goW3gseV0pO1xuXHRcdFx0Ly8gaWYgKHEgPT0gNilcblx0XHRcdC8vIFx0YUFkakluZGV4LnB1c2goWzIwLjUsIDIuNSwgNTAuNV0pO1xuXHRcdFx0Ly8gZWxzZVxuXHRcdFx0Ly8gXHRhQWRqSW5kZXgucHVzaChbMCwwLDBdKTtcblxuXG5cdFx0XHRjb29yZHMucHVzaChbMCwwXSk7XG5cblx0XHRcdGlDKys7XG5cblx0XHR9XG5cblx0XHRpZiAodGVtcFBvcy5sZW5ndGggPiAzKXtcblx0XHRcdHZhciB0b3BMZWZ0UG9pbnRJZHggPSAwO1xuXHRcdFx0dmFyIGJvdHRvbUxlZnRQb2ludElkeCA9IDA7XG5cdFx0XHR2YXIgdG9wUmlnaHRQb2ludElkeCA9IDA7XG5cdFx0XHR2YXIgYm90dG9tUmlnaHRQb2ludElkeCA9IDA7XG5cblx0XHRcdHZhciBjdXJyZW50VG9wTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHR2YXIgY3VycmVudFRvcFJpZ2h0ID0gdGVtcFBvc1swXTtcblx0XHRcdHZhciBjdXJyZW50Qm90dG9tTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHR2YXIgY3VycmVudEJvdHRvbVJpZ2h0ID0gdGVtcFBvc1swXTtcblxuXHRcdH1lbHNle1xuXHRcdFx0dmFyIHRvcExlZnRQb2ludElkeCA9IDA7XG5cdFx0XHR2YXIgYm90dG9tTGVmdFBvaW50SWR4ID0gMDtcblx0XHRcdHZhciB0b3BSaWdodFBvaW50SWR4ID0gMDtcblx0XHRcdC8vIHZhciBib3R0b21SaWdodFBvaW50SWR4ID0gLTE7XG5cblx0XHRcdHZhciBjdXJyZW50VG9wTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHR2YXIgY3VycmVudFRvcFJpZ2h0ID0gdGVtcFBvc1swXTtcblx0XHRcdHZhciBjdXJyZW50Qm90dG9tTGVmdCA9IHRlbXBQb3NbMF07XG5cdFx0XHQvLyB2YXIgY3VycmVudEJvdHRvbVJpZ2h0ID0gdGVtcFBvc1swXTtcblx0XHR9XG5cblx0XHRcblxuXHRcdGZvciAodmFyIHE9MDtxPHRlbXBQb3MubGVuZ3RoO3ErKyl7XG5cblxuXHRcdFx0Ly90b3BsZWZ0XG5cdFx0XHRpZiAodGVtcFBvc1txXVswXSA8IGN1cnJlbnRUb3BMZWZ0WzBdICYmICh0ZW1wUG9zW3FdWzFdID4gY3VycmVudFRvcExlZnRbMV0pKXtcblx0XHRcdFx0Y3VycmVudFRvcExlZnQgPSB0ZW1wUG9zW3FdO1xuXHRcdFx0XHR0b3BMZWZ0UG9pbnRJZHggPSBxO1xuXHRcdFx0fVxuXHRcdFx0XG5cblx0XHRcdC8vdG9wcmlnaHRcblx0XHRcdGlmICh0ZW1wUG9zW3FdWzBdID4gY3VycmVudFRvcFJpZ2h0WzBdICYmICh0ZW1wUG9zW3FdWzFdID4gY3VycmVudFRvcFJpZ2h0WzFdKSl7XG5cdFx0XHRcdGN1cnJlbnRUb3BSaWdodCA9IHRlbXBQb3NbcV07XG5cdFx0XHRcdHRvcFJpZ2h0UG9pbnRJZHggPSBxO1xuXHRcdFx0fVxuXHRcdFx0XG5cblx0XHRcdGlmICh0ZW1wUG9zLmxlbmd0aCA+IDMpe1xuXHRcdFx0XHQvL2JvdHRvbXJpZ2h0XG5cdFx0XHRcdGlmICh0ZW1wUG9zW3FdWzBdID4gY3VycmVudEJvdHRvbVJpZ2h0WzBdICYmICh0ZW1wUG9zW3FdWzFdIDwgY3VycmVudEJvdHRvbVJpZ2h0WzFdKSl7XG5cdFx0XHRcdFx0Y3VycmVudEJvdHRvbVJpZ2h0ID0gdGVtcFBvc1txXTtcblx0XHRcdFx0XHRib3R0b21SaWdodFBvaW50SWR4ID0gcTtcblx0XHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblxuXHRcdFx0Ly9ib3R0b21sZWZ0XG5cdFx0XHRpZiAodGVtcFBvc1txXVswXSA8IGN1cnJlbnRCb3R0b21MZWZ0WzBdICYmICh0ZW1wUG9zW3FdWzFdIDwgY3VycmVudEJvdHRvbUxlZnRbMV0pKXtcblx0XHRcdFx0Y3VycmVudEJvdHRvbUxlZnQgPSB0ZW1wUG9zW3FdO1xuXHRcdFx0XHRib3R0b21MZWZ0UG9pbnRJZHggPSBxO1xuXHRcdFx0fVxuXHRcdFxuXG5cdFx0fVxuXG5cdFx0Ly8gZGVidWdnZXI7XG5cdFx0aWYgKHRlbXBQb3MubGVuZ3RoID4gMyl7XG5cdFx0XHRjb29yZHNbY29vcmRzLmxlbmd0aCAtICh0ZW1wUG9zLmxlbmd0aCAtIHRvcExlZnRQb2ludElkeCldID0gWy4zLCAuN107XG5cdFx0XHRjb29yZHNbY29vcmRzLmxlbmd0aCAtICh0ZW1wUG9zLmxlbmd0aCAtIHRvcFJpZ2h0UG9pbnRJZHgpXSA9IFsuNywgLjddO1xuXHRcdFx0Y29vcmRzW2Nvb3Jkcy5sZW5ndGggLSAodGVtcFBvcy5sZW5ndGggLSBib3R0b21MZWZ0UG9pbnRJZHgpXSA9IFsuMywgLjNdO1xuXHRcdFx0Y29vcmRzW2Nvb3Jkcy5sZW5ndGggLSAodGVtcFBvcy5sZW5ndGggLSBib3R0b21SaWdodFBvaW50SWR4KV0gPSBbLjcsIC4zXTtcblx0XHR9ZWxzZXtcblx0XHRcdGNvb3Jkc1tjb29yZHMubGVuZ3RoIC0gKHRlbXBQb3MubGVuZ3RoIC0gdG9wTGVmdFBvaW50SWR4KV0gPSBbLjMsIC43XTtcblx0XHRcdGNvb3Jkc1tjb29yZHMubGVuZ3RoIC0gKHRlbXBQb3MubGVuZ3RoIC0gdG9wUmlnaHRQb2ludElkeCldID0gWy43LCAuN107XG5cdFx0XHRjb29yZHNbY29vcmRzLmxlbmd0aCAtICh0ZW1wUG9zLmxlbmd0aCAtIGJvdHRvbUxlZnRQb2ludElkeCldID0gWy4zLCAuM107XG5cdFx0fVxuXG5cdFx0Ly8gY29uc29sZS5sb2codGVtcFBvcy5sZW5ndGgpO1xuXHRcdFxuXHR9XG5cblx0Ly8gZGVidWdnZXI7XG5cblx0Ly8gdGhpcy5maW5kTWlkUG9pbnRzKHBvc2l0aW9ucyk7XG5cdGV4dHJhcyA9IHRoaXMuY2FsY0FkakxldmVsKHBvc2l0aW9ucyk7XG5cblx0XG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cdHRoaXMubWVzaC5idWZmZXJEYXRhKGV4dHJhcy5hLCBcImFBZGpJbmRleFwiLCAzLCBmYWxzZSk7XG5cdHRoaXMubWVzaC5idWZmZXJEYXRhKGV4dHJhcy51LCBcImFVc2VJbnZlcnNlXCIsIDEsIGZhbHNlKTtcblx0Ly8gdGhpcy5tZXNoLmJ1ZmZlckRhdGEoY29sb3JzLCBcImFWZXJ0ZXhDb2xvclwiLCAzLCBmYWxzZSk7XG5cdC8vIHRoaXMubWVzaC5idWZmZXJEYXRhKG5vcm1hbHMsIFwiYVZlcnRleE5vcm1hbFwiLCAzLCB0cnVlKTtcblxuXHRcbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBhdWRpb0RhdGEpIHtcblxuXHR0aGlzLnRyYW5zZm9ybXMucHVzaCgpO1xuXHRcblx0dmFyIG12TWF0cml4ID0gdGhpcy50cmFuc2Zvcm1zLmdldE12TWF0cml4KCk7XG5cblx0XG5cblx0bWF0NC50cmFuc2xhdGUobXZNYXRyaXgsIG12TWF0cml4LCBbLTY5LjksMjAsMF0pXG5cdG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgTWF0aC5QSSAqIC0uNSwgWzAsMSwwXSk7XG5cdG1hdDQuc2NhbGUobXZNYXRyaXgsIG12TWF0cml4LCBbMC4wNiwgMC4xLCAwLjA1XSk7XG5cblxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0aWYgKGF1ZGlvRGF0YS5sZW5ndGggPiA4KXtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbERlZXBcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzNdKTtcblx0XHR0aGlzLnNoYWRlci51bmlmb3JtKFwiYXVkaW9MZXZlbEhpZ2hcIiwgXCJ1bmlmb3JtMWZcIiwgYXVkaW9EYXRhWzhdKTtcblxuXHR9XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcImFuZ2xlXCIsIFwidW5pZm9ybTFmXCIsIHRoaXMuYW5nbGUrPS4wMDUpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidmlkZW9UZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDApO1xuXHQvLyB0aGlzLnNoYWRlci51bmlmb3JtKFwidGV4dHVyZVBhcnRpY2xlXCIsIFwidW5pZm9ybTFpXCIsIDEpO1xuXHR2aWRlb1RleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMCk7XG5cdC8vIHRleHR1cmUuYmluZCgxKTtcblx0dGhpcy5kcmF3KHRoaXMubWVzaCk7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3UHJpc207IiwiLy9WaWV3Um9vZi5qc1xuXG52YXIgVmlldyA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9WaWV3Jyk7XG52YXIgTWVzaCA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9NZXNoJyk7XG5cbmZ1bmN0aW9uIFZpZXdSb29mKCl7fTtcblxudmFyIHAgPSBWaWV3Um9vZi5wcm90b3R5cGUgPSBuZXcgVmlldygpO1xudmFyIHMgPSBWaWV3LnByb3RvdHlwZTtcblxudmFyIGdsID0gbnVsbDtcblxuXG5wLmluaXQgPSBmdW5jdGlvbih2ZXJ0UGF0aCwgZnJhZ1BhdGgpe1xuXG5cdGdsID0gd2luZG93Lk5TLkdMLmdsQ29udGV4dDtcblx0XG5cdHMuaW5pdC5jYWxsKHRoaXMsIHZlcnRQYXRoLCBmcmFnUGF0aCk7XG5cblx0dmFyIHBvc2l0aW9ucyA9IFtdO1xuXHR2YXIgY29vcmRzID0gW107XG5cdHZhciBpbmRpY2VzID0gW107XG5cdFxuXHR2YXIgd2lkdGggPSB3aW5kb3cuTlMuR0wucGFyYW1zLndpZHRoO1xuXHR2YXIgaGVpZ2h0ID0gd2luZG93Lk5TLkdMLnBhcmFtcy5oZWlnaHQ7XG5cdHZhciBkZXB0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMuZGVwdGg7XG5cblx0Ly9ST09GXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCAtZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goW3dpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdGNvb3Jkcy5wdXNoKFswLCAwXSk7XG5cdGNvb3Jkcy5wdXNoKFswLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAwXSk7XG5cblx0XG5cdGluZGljZXMucHVzaCgwLDEsMiwzLDAsMik7XG5cblx0dGhpcy5tZXNoID0gbmV3IE1lc2goKTtcblx0dGhpcy5tZXNoLmluaXQocG9zaXRpb25zLmxlbmd0aCwgaW5kaWNlcy5sZW5ndGgsIGdsLlRSSUFOR0xFUyk7XG5cdHRoaXMubWVzaC5idWZmZXJWZXJ0ZXgocG9zaXRpb25zKTtcblx0dGhpcy5tZXNoLmJ1ZmZlclRleENvb3Jkcyhjb29yZHMpO1xuXHR0aGlzLm1lc2guYnVmZmVySW5kaWNlcyhpbmRpY2VzKTtcblxufTtcblxucC5yZW5kZXIgPSBmdW5jdGlvbih2aWRlb1RleHR1cmUsIGZsb29yVGV4dHVyZSwgYXVkaW9EYXRhLCBmYm9TaXplKSB7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0aWYgKGF1ZGlvRGF0YS5sZW5ndGggPiA4KXtcblxuXHRcdFxuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsRGVlcFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbM10pO1xuXHRcdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJhdWRpb0xldmVsSGlnaFwiLCBcInVuaWZvcm0xZlwiLCBhdWRpb0RhdGFbOF0pO1xuXG5cdH1cblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwidmlkZW9UZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDApO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiY29uY3JldGVUZXh0dXJlXCIsIFwidW5pZm9ybTFpXCIsIDEpO1xuXHRcblx0dmlkZW9UZXh0dXJlLmJpbmQodGhpcy5zaGFkZXIsIDApO1xuXHRmbG9vclRleHR1cmUuYmluZCh0aGlzLnNoYWRlciwgMSk7XG5cdFxuXHR0aGlzLmRyYXcodGhpcy5tZXNoKTtcblx0XG5cdHRoaXMudHJhbnNmb3Jtcy5wb3AoKTtcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdSb29mOyIsIi8vVmlld1ZpZGVvLmpzXG5cbnZhciBWaWV3ID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL1ZpZXcnKTtcbnZhciBNZXNoID0gcmVxdWlyZSgnLi4vZnJhbWV3b3JrL01lc2gnKTtcblxuZnVuY3Rpb24gVmlld1ZpZGVvKCl7fTtcblxudmFyIHAgPSBWaWV3VmlkZW8ucHJvdG90eXBlID0gbmV3IFZpZXcoKTtcbnZhciBzID0gVmlldy5wcm90b3R5cGU7XG5cbnZhciBnbCA9IG51bGw7XG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRQYXRoLCBmcmFnUGF0aCl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXHRcblx0cy5pbml0LmNhbGwodGhpcywgdmVydFBhdGgsIGZyYWdQYXRoKTtcblxuXHR2YXIgcG9zaXRpb25zID0gW107XG5cdHZhciBjb29yZHMgPSBbXTtcblx0dmFyIGluZGljZXMgPSBbMCwgMSwgMiwgMCwgMiwgM107XG5cblx0dmFyIHNpemUgPSAzMDtcblxuXHR2YXIgdmlkSGVpZ2h0ID0gMzA7XG5cdHZhciB3YWxsSGVpZ2h0ID0gNDA7XG5cblx0cG9zaXRpb25zLnB1c2goWy1zaXplLCAod2FsbEhlaWdodC12aWRIZWlnaHQpLzIsIC01OV0pO1xuXHRwb3NpdGlvbnMucHVzaChbIHNpemUsICh3YWxsSGVpZ2h0LXZpZEhlaWdodCkvMiwgLTU5XSk7XG5cdHBvc2l0aW9ucy5wdXNoKFsgc2l6ZSwgIHZpZEhlaWdodCArICh3YWxsSGVpZ2h0LXZpZEhlaWdodCkvMiwgLTU5XSk7XG5cdHBvc2l0aW9ucy5wdXNoKFstc2l6ZSwgIHZpZEhlaWdodCArICh3YWxsSGVpZ2h0LXZpZEhlaWdodCkvMiwgLTU5XSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblxuXHR0aGlzLm1lc2ggPSBuZXcgTWVzaCgpO1xuXHR0aGlzLm1lc2guaW5pdCg0LCA2LCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cbn07XG5cblxuXG5wLnJlbmRlciA9IGZ1bmN0aW9uKHZpZGVvVGV4dHVyZSkge1xuXG5cdHRoaXMudHJhbnNmb3Jtcy5wdXNoKCk7XG5cblx0Ly8gdGhpcy50cmFuc2Zvcm1zLmNhbGN1bGF0ZU1vZGVsVmlldygpO1xuXG5cdHZhciBtdk1hdHJpeCA9IHRoaXMudHJhbnNmb3Jtcy5nZXRNdk1hdHJpeCgpO1xuXG5cdC8vIG1hdDQucm90YXRlKG12TWF0cml4LCBtdk1hdHJpeCwgLS40Kk1hdGguUEksIFswLCAwLCAxXSk7XG4gICAgLy8gbWF0NC5yb3RhdGUobXZNYXRyaXgsIGRlZ1RvUmFkKC15YXcpLCBbMCwgMSwgMF0pO1xuICAgIC8vIG1hdDQudHJhbnNsYXRlKG12TWF0cml4LCBbLXhQb3MsIC15UG9zLCAtelBvc10pO1xuXHQvLyByZXR1cm47XG5cdHRoaXMuc2hhZGVyLmJpbmQoKTtcblxuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ2aWRlb1RleHR1cmVcIiwgXCJ1bmlmb3JtMWlcIiwgMCk7XG5cdC8vIHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ0ZXh0dXJlUGFydGljbGVcIiwgXCJ1bmlmb3JtMWlcIiwgMSk7XG5cdHZpZGVvVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAwKTtcblx0Ly8gdGV4dHVyZS5iaW5kKDEpO1xuXHR0aGlzLmRyYXcodGhpcy5tZXNoKTtcblxuXHR0aGlzLnRyYW5zZm9ybXMucG9wKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdWaWRlbzsiLCIvL1ZpZXdXYWxscy5qc1xuXG52YXIgVmlldyA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9WaWV3Jyk7XG52YXIgTWVzaCA9IHJlcXVpcmUoJy4uL2ZyYW1ld29yay9NZXNoJyk7XG5cbmZ1bmN0aW9uIFZpZXdXYWxscygpe307XG5cbnZhciBwID0gVmlld1dhbGxzLnByb3RvdHlwZSA9IG5ldyBWaWV3KCk7XG52YXIgcyA9IFZpZXcucHJvdG90eXBlO1xuXG52YXIgZ2wgPSBudWxsO1xuXG5cbnAuaW5pdCA9IGZ1bmN0aW9uKHZlcnRQYXRoLCBmcmFnUGF0aCl7XG5cblx0Z2wgPSB3aW5kb3cuTlMuR0wuZ2xDb250ZXh0O1xuXHRcblx0cy5pbml0LmNhbGwodGhpcywgdmVydFBhdGgsIGZyYWdQYXRoKTtcblxuXHR2YXIgcG9zaXRpb25zID0gW107XG5cdHZhciBjb29yZHMgPSBbXTtcblx0dmFyIGluZGljZXMgPSBbXTtcblx0XG5cdHZhciB3aWR0aCA9IHdpbmRvdy5OUy5HTC5wYXJhbXMud2lkdGg7XG5cdHZhciBoZWlnaHQgPSB3aW5kb3cuTlMuR0wucGFyYW1zLmhlaWdodDtcblx0dmFyIGRlcHRoID0gd2luZG93Lk5TLkdMLnBhcmFtcy5kZXB0aDtcblxuXHQvL0ZST05UV0FMTFxuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCBoZWlnaHQsIGRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIGRlcHRoXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblxuXHRcblxuXHRcblxuXHRpbmRpY2VzLnB1c2goMCwgMSwgMiwgMywgMCwgMik7XG5cblx0XG5cdFxuXG5cdC8vTEVGVCBTSURFV0FMTFxuXHQvLyBwb3NpdGlvbnMucHVzaChbLXdpZHRoLCAwLCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIGRlcHRoXSk7XG5cblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgMCwgZGVwdGhdKTtcblx0cG9zaXRpb25zLnB1c2goWy13aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIC1kZXB0aF0pO1xuXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIC1kZXB0aF0pO1xuXG5cdGNvb3Jkcy5wdXNoKFswLCAwXSk7XG5cdGNvb3Jkcy5wdXNoKFswLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAxXSk7XG5cdGNvb3Jkcy5wdXNoKFsxLCAwXSk7XG5cblxuXG5cblx0aW5kaWNlcy5wdXNoKDQsIDUsIDYsIDcsIDQsIDYpO1xuXG5cdC8vUklHSFQgU0lERVdBTExcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCBkZXB0aF0pO1xuXHQvLyBwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgZGVwdGhdKTtcblxuXHQvLyBwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdC8vIC8vIHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCAtZGVwdGhdKTtcblx0Ly8gcG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIDAsIGRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgaGVpZ2h0LCBkZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cblx0cG9zaXRpb25zLnB1c2goW3dpZHRoLCAwLCAtZGVwdGhdKTtcblx0XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblx0Ly8gY29vcmRzLnB1c2goWzEsIDFdKTtcblx0Ly8gY29vcmRzLnB1c2goWzAsIDBdKTtcblxuXG5cdGluZGljZXMucHVzaCg4LCA5LCAxMCwgMTEsIDgsIDEwKTtcblxuXHQvL0JBQ0tXQUxMXG5cdHBvc2l0aW9ucy5wdXNoKFstd2lkdGgsIDAsIC1kZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbLXdpZHRoLCBoZWlnaHQsIC1kZXB0aF0pO1xuXHRwb3NpdGlvbnMucHVzaChbd2lkdGgsIGhlaWdodCwgLWRlcHRoXSk7XG5cdHBvc2l0aW9ucy5wdXNoKFt3aWR0aCwgMCwgLWRlcHRoXSk7XG5cblx0Y29vcmRzLnB1c2goWzAsIDBdKTtcblx0Y29vcmRzLnB1c2goWzAsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDFdKTtcblx0Y29vcmRzLnB1c2goWzEsIDBdKTtcblxuXG5cdGluZGljZXMucHVzaCgxMiwgMTMsIDE0LCAxNSwgMTIsIDE0KTtcblxuXG5cdFxuXG5cdFxuXG5cdFxuXG5cdHRoaXMubWVzaCA9IG5ldyBNZXNoKCk7XG5cdHRoaXMubWVzaC5pbml0KHBvc2l0aW9ucy5sZW5ndGgsIGluZGljZXMubGVuZ3RoLCBnbC5UUklBTkdMRVMpO1xuXHR0aGlzLm1lc2guYnVmZmVyVmVydGV4KHBvc2l0aW9ucyk7XG5cdHRoaXMubWVzaC5idWZmZXJUZXhDb29yZHMoY29vcmRzKTtcblx0dGhpcy5tZXNoLmJ1ZmZlckluZGljZXMoaW5kaWNlcyk7XG5cbn07XG5cbnAucmVuZGVyID0gZnVuY3Rpb24odmlkZW9UZXh0dXJlLCBmYm9TaXplKSB7XG5cblx0dGhpcy50cmFuc2Zvcm1zLnB1c2goKTtcblxuXHR0aGlzLnNoYWRlci5iaW5kKCk7XG5cblx0dGhpcy5zaGFkZXIudW5pZm9ybShcInZpZGVvVGV4dHVyZVwiLCBcInVuaWZvcm0xaVwiLCAwKTtcblxuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvV1wiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLncpO1xuXHR0aGlzLnNoYWRlci51bmlmb3JtKFwiZmJvSFwiLCBcInVuaWZvcm0xZlwiLCBmYm9TaXplLmgpO1xuXG5cdHRoaXMuc2hhZGVyLnVuaWZvcm0oXCJ3aW5XXCIsIFwidW5pZm9ybTFmXCIsIHdpbmRvdy5pbm5lcldpZHRoKTtcblx0dGhpcy5zaGFkZXIudW5pZm9ybShcIndpbkhcIiwgXCJ1bmlmb3JtMWZcIiwgd2luZG93LmlubmVySGVpZ2h0KTtcblx0XG5cdHZpZGVvVGV4dHVyZS5iaW5kKHRoaXMuc2hhZGVyLCAwKTtcblx0XG5cdHRoaXMuZHJhdyh0aGlzLm1lc2gpO1xuXHRcblx0dGhpcy50cmFuc2Zvcm1zLnBvcCgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdXYWxsczsiXX0=
