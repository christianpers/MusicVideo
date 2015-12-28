precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aVertexNormal;
attribute vec3 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform vec3 uLightPosition;

uniform vec3 uMaterialDiffuse;

varying vec3 vNormal;
varying vec3 vLightRay;
varying vec3 vEyeVec;
varying vec3 vLighting;

varying vec2 vTextureCoord;
varying vec3 vVertexPos;
varying vec3 vColor;

void main(void) {

	//Transformed vertex position
	// vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);

	// //Transformed normal position
	// vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));

	// //Transformed light position
	// vec4 light = uMVMatrix * vec4(uLightPosition,1.0);

	// //Light position
	// vLightRay = vertex.xyz-light.xyz;

	// //Vector Eye
	// vEyeVec = -vec3(vertex.xyz);

	highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
    highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
    highp vec3 directionalVector = vec3(0.05, 0.008, 0.005);
    
    highp vec4 transformedNormal = uNMatrix * vec4(aVertexNormal, 1.0);
    
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);



	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    vVertexPos = aVertexPosition;
    vColor = aVertexColor;



}