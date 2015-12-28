//ViewImport.js

var View = require('../framework/View');
var MeshPlain = require('../MeshPlain');

function ViewImport(){};

var p = ViewImport.prototype = new View();
var s = View.prototype;

var gl = null;

p.init = function(vertPath, fragPath){

	gl = window.NS.GL.glContext;
	
	s.init.call(this, vertPath, fragPath);

	this.subViews = [];
	this.hasSubViews = false;
	
	this.currentAnimationProp = null;
	this.currentAnimationVal = undefined;
	this.isAnimating = false;

	this.mesh = null;

	this.test = 0;

	this.currentTranslate = -20;

};

p.createMesh = function(data){

	var mesh = data.meshData;
	this.material = data.materialData;

	var coords = [];
	var verts = [];
	var faces = [];
	var max = {x:0, y:0};
	var min = {x:0, y:0};



	var colors = [];
	for (var i=0;i<mesh.vertices.length;i+= 3){
		if (i < 2000){
			colors.push(.5);
			colors.push(.1);
			colors.push(.8);
		}else if (i >= 2000 && i < 5500){
			colors.push(.1);
			colors.push(.9);
			colors.push(.8);
		}else{
			colors.push(1.0);
			colors.push(.3);
			colors.push(.7);
		}

	}

	// debugger;


	this.mesh = new MeshPlain();
	this.mesh.init(mesh.vertices.length/3, mesh.triangles.length, gl.TRIANGLES);
	this.mesh.bufferVertex(mesh.vertices);
	this.mesh.bufferTexCoords(mesh.coords);
	this.mesh.bufferIndices(mesh.triangles);
	this.mesh.bufferData(mesh.normals, "aVertexNormal", 3);
	this.mesh.bufferData(new Float32Array(colors), "aVertexColor", 3);


};

p.addSubViews = function(views){

	this.subViews = views.slice(0);
	this.hasSubViews = true;

	this._matrix = mat4.create();
};

p.resetAnimation = function(){

	this.currentAnimationProp = null;
	this.currentAnimationVal = undefined;

	for(var i=0;i<this.subViews.length;i++){
		this.subViews[i].currentAnimationVal = undefined;
		this.subViews[i].currentAnimationProp = null;
	}

};



p.render = function(videoTexture, audioData, shader, isChild) {

	if (isChild)
		this.shader = shader;

	this.transforms.push();
	

	// var nMatrix = mat4.create();
	var mvMatrix = this.transforms.getMvMatrix();


	if (!isChild){
		mat4.translate(mvMatrix, mvMatrix, [-40, this.currentTranslate, -20]);
		
	}
	// if (isChild){
	// 	// mat4.multiply(mvMatrix, mvMatrix, parentMatrix);
	// 	// mat4.scale(mvMatrix, mvMatrix, [0.08, 0.08, 0.08]);
	// 	// this.test+=0.1;
	// 	// mat4.rotate(mvMatrix, mvMatrix, this.test * Math.PI/180, [0,1,0]);
	// }

	if (this.currentAnimationVal){
		
		if (this.currentAnimationProp == 'rotateZ')
			mat4.rotate(mvMatrix, mvMatrix, this.currentAnimationVal *Math.PI/180, [0, 0, 1]);
		else if (this.currentAnimationProp == 'rotateX')
			mat4.rotate(mvMatrix, mvMatrix, this.currentAnimationVal *Math.PI/180, [1, 0, 0]);
	}

	if (this.hasSubViews){
		
		mat4.scale(mvMatrix, mvMatrix, [0.08, 0.08, 0.08]);
		// mat4.translate(mvMatrix, mvMatrix, [0, 15, 0]);

		// mat4.copy(this._matrix, mvMatrix);
		
		for (var i=0;i<this.subViews.length;i++){
			this.subViews[i].render(videoTexture, audioData, this.shader, true);
		}
		this.transforms.pop();
		return;
	}

	// if (!shader && !this.hasSubViews){
	// 	mat4.translate(mvMatrix, mvMatrix, [0,10, 0]);
	// 	mat4.scale(mvMatrix, mvMatrix, [0.05, 0.05, 0.05]);

	// }
	
	// mat4.copy(nMatrix, mvMatrix);
 //    mat4.invert(nMatrix, nMatrix);
 //    mat4.transpose(nMatrix, nMatrix);


    this.shader.bind();

    if (audioData.length > 8){
		this.shader.uniform("audioLevelDeep", "uniform1f", audioData[3]);
		this.shader.uniform("audioLevelHigh", "uniform1f", audioData[8]);

	}

	// this.shader.uniform("uNMatrix", "uniformMatrix4fv", nMatrix);
	// this.shader.uniform("diffuse", "uniform3fv", this.diffuse);
	this.shader.uniform("videoTexture", "uniform1i", 0);
	

	this.shader.uniform("uLightPosition", "uniform3fv", new Float32Array([0.0, 20.0, 20.0]) );
	this.shader.uniform("uLightAmbient", "uniform4fv", new Float32Array([1.0, 1.0, 1.0, 1.0]) );
	this.shader.uniform("uLightDiffuse", "uniform4fv", new Float32Array([1.0, 1.0, 1.0, 1.0]) );
	this.shader.uniform("uLightSpecular", "uniform4fv", new Float32Array([1.0, 1.0, 1.0, 1.0]) );

	this.shader.uniform("uMaterialAmbient", "uniform4fv", new Float32Array([0.1, 0.1, 0.1, 1.0]));
	if (this.material.diffuse)
		this.shader.uniform("uMaterialDiffuse", "uniform3fv", this.material.diffuse);
	this.shader.uniform("uMaterialSpecular", "uniform3fv", this.material.specular);
	this.shader.uniform("uShininess", "uniform1f", this.material.shininess);
	
	videoTexture.bind(this.shader, 0);

	this.draw(this.mesh);

	this.transforms.pop();
};

module.exports = ViewImport;