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