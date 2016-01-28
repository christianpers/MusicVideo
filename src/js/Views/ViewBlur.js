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