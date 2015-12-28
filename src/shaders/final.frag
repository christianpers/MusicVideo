precision mediump float;

uniform sampler2D sceneTexture;

varying vec2 vTextureCoord;
varying vec3 vVertexPos;


// float offset[3] = float[]( 0.0, 1.3846153846, 3.2307692308 );
// float weight[3] = float[]( 0.2270270270, 0.3162162162, 0.0702702703 );

void main(void) {
	
    gl_FragColor = texture2D(sceneTexture, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

   


}