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