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