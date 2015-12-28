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