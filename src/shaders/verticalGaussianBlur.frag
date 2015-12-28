precision mediump float;

uniform sampler2D sceneTexture;
uniform float rt_w;
uniform float rt_h;

varying vec2 vTextureCoord;
varying vec3 vertexPos;
float offset[3];


float weight[3];


// float offset[3] = float[]( 0.0, 1.3846153846, 3.2307692308 );
// float weight[3] = float[]( 0.2270270270, 0.3162162162, 0.0702702703 );

void main(void) {
	offset[0] = 0.0;
	offset[1] = 1.3846153846;
	offset[2] = 3.2307692308;

	weight[0] = 0.2270270270;
	weight[1] = 0.3162162162;
	weight[2] = 0.0702702703;
    // gl_FragColor = texture2D(sceneTexture, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

    vec3 tc = vec3(1.0, 0.0, 0.0);
	if (vTextureCoord.x<(0.5-0.01))
	{
	vec2 uv = vTextureCoord.xy;
	tc = texture2D(sceneTexture, uv).rgb * weight[0];
	for (int i=1; i<3; i++) 
	{
	  tc += texture2D(sceneTexture, uv + vec2(0.0, offset[i])/rt_h).rgb * weight[i];
	  tc += texture2D(sceneTexture, uv - vec2(0.0, offset[i])/rt_h).rgb * weight[i];
	}
	}
	else if (vTextureCoord.x>=(0.5+0.01))
	{
		tc = texture2D(sceneTexture, vTextureCoord.xy).rgb;
	}
	gl_FragColor = vec4(tc, 1.0);


}