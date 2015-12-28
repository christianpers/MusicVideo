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