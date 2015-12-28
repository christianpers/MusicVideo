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