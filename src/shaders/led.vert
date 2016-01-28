precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute float aIndexData;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;
varying vec3 vVertexPos;
varying float vIndexData;

void main(void) {

	vec3 newPos = aVertexPosition;
	// newPos.z += aIndexData * 10.0;

	// vVertexPos.y = newPos.y + aIndexData;

    gl_Position = uPMatrix * uMVMatrix * vec4(newPos, 1.0);
    // vTextureCoord = aTextureCoord;
    vIndexData = aIndexData;
}