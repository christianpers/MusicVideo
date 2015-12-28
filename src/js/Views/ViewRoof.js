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