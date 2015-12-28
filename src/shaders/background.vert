precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float angleVert;

varying vec3 vVertexPos;
varying vec3 vTextureCoord;

void main(void) {

	vec3 newPos = aVertexPosition;
	newPos.xy *= angleVert*2.0;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = aTextureCoord;
    vVertexPos = aVertexPosition;
}