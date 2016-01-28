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