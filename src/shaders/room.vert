precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;



varying vec2 vTextureCoord;

varying vec3 vVertexPos;


void main(void) {
	vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * mvPosition;
  
    vTextureCoord = aTextureCoord;

    vVertexPos = aVertexPosition;
  




}