(function(){

	var View = window.NS.GL.Framework.View;
	var Mesh = window.NS.GL.Mesh;
	var Texture = window.NS.GL.Framework.Texture;

	var ViewRoom = function(){};

	if (!window.NS.GL.Views)
		window.NS.GL.Views = {};

	window.NS.GL.Views.ViewRoom = ViewRoom;

	var p = ViewRoom.prototype = new View();
	var s = View.prototype;

	var gl = null;


	p.init = function(vertPath, fragPath){

		gl = window.NS.GL.glContext;
		
		s.init.call(this, vertPath, fragPath);

		//dat gui props
		this.colorNoiseMultiplier = 1000;
		this.noiseBaseColor = [20, 200, 100];
		this.audioLevelNoiseDivider = 20;
		this.vertexMultiplier = .5;
		this.usePulse = false;

		var positions = [];
		var coords = [];
		var indices = [];
		var colors = [];
		var useVideoTexture = [];

		var width = 70;
		var height = 40;
		var depth = 60;

		var detail = 10;

		var fragment = width / detail;

		this._angle = 0;
		var counter = 0;

		var currentX = - (width/2);

		

		positions.push([-width, 0, depth]);
		positions.push([-width, height, depth]);
		positions.push([width, height, depth]);

		positions.push([width, 0, depth]);
		positions.push([width, height, depth]);
		positions.push([-width, 0, depth]);

		coords.push([0, 0]);
		coords.push([0, 1]);
		coords.push([1, 1]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 0]);

		for (var i=0;i<6;i++){
			colors.push([0.1, 0.5, 0.5]);
		}

		for (var i=0;i<6;i++){
			useVideoTexture.push([10]);
		}

		

		indices.push(0, 1, 2, 3, 4, 5);

		
		

		//LEFT SIDEWALL
		positions.push([-width, 0, depth]);
		positions.push([-width, height, depth]);
		positions.push([-width, height, -depth]);

		positions.push([-width, 0, -depth]);
		positions.push([-width, height, -depth]);
		positions.push([-width, 0, depth]);

		coords.push([0, 0]);
		coords.push([0, 1]);
		coords.push([1, 1]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 0]);



		for (var i=0;i<6;i++){
			colors.push([0.9, 0.5, 0.5]);
		}
		for (var i=0;i<6;i++){
			useVideoTexture.push([10]);
		}

		indices.push(6, 7, 8, 9, 10, 11);

		//RIGHT SIDEWALL
		positions.push([width, 0, depth]);
		positions.push([width, height, depth]);
		positions.push([width, height, -depth]);

		positions.push([width, 0, -depth]);
		positions.push([width, height, -depth]);
		positions.push([width, 0, depth]);

		coords.push([0, 0]);
		coords.push([0, 1]);
		coords.push([1, 1]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 0]);

		for (var i=0;i<6;i++){
			colors.push([0.5, 0.9, 0.5]);
		}
		for (var i=0;i<6;i++){
			useVideoTexture.push([10]);
		}

		indices.push(12, 13, 14, 15, 16, 17);

		//BACKWALL
		positions.push([-width, 0, -depth]);
		positions.push([-width, height, -depth]);
		positions.push([width, height, -depth]);

		positions.push([width, 0, -depth]);
		positions.push([width, height, -depth]);
		positions.push([-width, 0, -depth]);

		coords.push([0, 0]);
		coords.push([0, 1]);
		coords.push([1, 1]);
		coords.push([1, 0]);
		coords.push([1, 1]);
		coords.push([0, 0]);

		for (var i=0;i<6;i++){
			colors.push([0.5, 0.5, 0.9]);
		}
		for (var i=0;i<6;i++){
			useVideoTexture.push([10]);
		}

		indices.push(18, 19, 20, 21, 22, 23);


		//ROOF
		positions.push([-width, height, -depth]);
		positions.push([width, height, -depth]);
		positions.push([width, height, depth]);

		positions.push([-width, height, depth]);
		// positions.push([width, height, depth]);
		// positions.push([-width, height, -depth]);

		coords.push([0, 0]);
		coords.push([0, 1]);
		coords.push([1, 1]);
		coords.push([1, 0]);
		// coords.push([1, 1]);
		// coords.push([0, 0]);

		for (var i=0;i<4;i++){
			colors.push([1.0, 1.0, 0.9]);
		}
		for (var i=0;i<4;i++){
			useVideoTexture.push([2]);
		}

		// indices.push(26, 24, 25, 28, 29, 27);
		indices.push(24,25,26,27,24,26);


		//FLOOR
		positions.push([-width, 0, -depth]);
		positions.push([width, 0, -depth]);
		positions.push([width, 0, depth]);

		positions.push([-width, 0, depth]);
		// positions.push([width, 0, depth]);
		// positions.push([-width, 0, -depth]);

		coords.push([0, 0]);
		coords.push([0, 1]);
		coords.push([1, 1]);
		coords.push([1, 0]);
		// coords.push([1, 1]);
		// coords.push([0, 0]);

		for (var i=0;i<4;i++){
			colors.push([1.0, .5, 0.9]);
		}
		for (var i=0;i<4;i++){
			useVideoTexture.push([0]);
		}

		// indices.push(32, 30, 31, 34, 35, 33);
		indices.push(28,29,30,31,28,30);

		

		var vertices = [];
		for(var i=0; i<positions.length; i++) {
			for(var j=0; j<positions[i].length; j++) vertices.push(positions[i][j]);
		}

		var normals = calculateNormals(vertices, indices);

		this.mesh = new Mesh();
		this.mesh.init(positions.length, indices.length, gl.TRIANGLES);
		this.mesh.bufferVertex(positions);
		this.mesh.bufferTexCoords(coords);
		this.mesh.bufferIndices(indices);
		this.mesh.bufferData(colors, "aVertexColor", 3, false);
		this.mesh.bufferData(normals, "aVertexNormal", 3, true);
		this.mesh.bufferData(useVideoTexture, "aUseVideoTexture",1, false);

	};

	p.render = function(videoTexture, concreteTexture) {

		// if (audioDataIn.length > 8){
		// 	var subbands = [1, 2, 4, 6, 8, 20, 30, 40, 50, 60];
		
		// 	var audioData = [];
		// 	for (var i=0;i<subbands.length;i++){
		// 		audioData[i] = audioDataIn[0][subbands[i]];
		// 	}

		// 	// console.log(audioData);
		// }

		this.transforms.push();

		// this.transforms.calculateModelView();

		var mvMatrix = this.transforms.getMvMatrix();

		var nMatrix = mat3.create();
		mat3.fromMat4(nMatrix, mvMatrix);
		mat3.invert(nMatrix, nMatrix);
		mat3.transpose(nMatrix, nMatrix);

		// var nMatrix = mat4.clone(mvMatrix);
		
		// mat4.invert(nMatrix, nMatrix);
  //       mat4.transpose(nMatrix, nMatrix);

		

		// mat4.rotate(mvMatrix, -.4*Math.PI, [1, 0, 0]);
        // mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
        // mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
		// return;
		this.shader.bind();

		// if (audioDataIn.length > 8){
		// 	this.shader.uniform("audioLevelDeep", "uniform1f", audioData[3]);
		// 	this.shader.uniform("audioLevelHigh", "uniform1f", audioData[8]);

		// }

		// this.shader.uniform("simplexTexture", "uniform1i", 0);
		// this.shader.uniform("permTexture", "uniform1i", 1);
		this.shader.uniform("videoTexture", "uniform1i", 0);
		this.shader.uniform("concreteTexture", "uniform1i", 1);
		
		this.shader.uniform("uNMatrix", "uniformMatrix3fv", nMatrix);

		this.shader.uniform("angle", "uniform1f", this._angle += .001);
		
		this.shader.uniform("uAmbientColor", "uniform3fv", new Float32Array([0.8, 0.8, 0.8]));
		this.shader.uniform("uPointLightingLocation", "uniform3fv", new Float32Array([0, 10000000, 0.0]));
		this.shader.uniform("uPointLightingColor", "uniform3fv", new Float32Array([0.2, 0.2, 0.2]));
		// this.shader.uniform("uUseLighting", "");
		// this.shader.uniform("uPosition", "uniform4fv",new Float32Array([-20, -2000.0, 1000000000, 1]));
		// this.shader.uniform("uIntensities", "uniform3fv", new Float32Array([1,1,1]));
		// this.shader.uniform("uAttenuation", "uniform1f", 0.1);
		// this.shader.uniform("uAmbientCoefficient", "uniform1f", 0.6);
		// this.shader.uniform("uConeAngle", "uniform1f", 40.0);
		// this.shader.uniform("uConeDirection", "uniform3fv", new Float32Array([0,0,-1]));

		// this.shader.uniform("uCameraPosition", "uniform3fv", new Float32Array(this.transforms._camera.getPosition()));

		// this.shader.uniform("materialShininess", "uniform1f", 10.0);
		// this.shader.uniform("materialSpecularColor", "uniform3fv", new Float32Array([1,1,1]));
		// this.shader.uniform("texture", "uniform1i", 0);
		// this.shader.uniform("textureParticle", "uniform1i", 1);
		// texturePos.bind(this.shader, 0);
		// texture.bind(1);

		// dat gui props

		var textureRot = mat3.create();
		mat3.rotate(textureRot, textureRot, -5 * Math.PI/180);

		this.shader.uniform("colorNoiseMultiplier", "uniform1f", this.colorNoiseMultiplier);
		this.shader.uniform("noiseBaseColor", "uniform3fv", new Float32Array(this.noiseBaseColor));
		this.shader.uniform("audioLevelNoiseDivider", "uniform1f", this.audioLevelNoiseDivider);
		this.shader.uniform("vertexMultiplier", "uniform1f", this.vertexMultiplier);
		this.shader.uniform("usePulse", "uniform1i", this.usePulse ? 1 : 0);
		this.shader.uniform("textureRot","uniform3fv", textureRot);

		// simplexTexture.bind(this.shader, 0);
		// permTexture.bind(this.shader, 1);
		videoTexture.bind(this.shader, 0);
		concreteTexture.bind(this.shader, 1);
		
		this.draw(this.mesh);

		
		this.transforms.pop();
	};



})();