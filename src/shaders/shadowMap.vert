attribute vec3 position;
uniform mat4 Pmatrix;
uniform mat4 Lmatrix;
varying float vDepth;

void main(void) {
	vec4 position = Pmatrix*Lmatrix*vec4(position, 1.);
	float zBuf=position.z/position.w; //Z-buffer between -1 and 1
	vDepth=0.5+zBuf*0.5; //between 0 and 1
	gl_Position=position;
}