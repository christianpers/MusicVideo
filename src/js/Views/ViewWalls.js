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