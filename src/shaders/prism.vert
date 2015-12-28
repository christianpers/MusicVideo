precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aAdjIndex;
attribute float aUseInverse;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float audioLevelDeep;
uniform float audioLevelHigh;

uniform float angle;

varying vec2 vTextureCoord;


void main(void) {
    
    vec3 newPosition = aVertexPosition;

    if (aUseInverse == 2.0)
   		newPosition.xy += sin(1.5 * 3.14 * angle) * aAdjIndex.y;
   	else if (aUseInverse == 1.0){
   		newPosition.xy += cos(.7 * 3.14 * angle) * aAdjIndex.y;
   	}
    // if (aAdjIndex.x < 0.0)
   	// newPosition.x += audioLevelDeep * aAdjIndex.x;
   	// else if (aAdjIndex.x > 0.0)
   		// newPosition.y -= audioLevelDeep * aAdjIndex.x;
  
    gl_Position = uPMatrix * uMVMatrix * vec4(newPosition, 1.0);
    vTextureCoord = aTextureCoord;


}