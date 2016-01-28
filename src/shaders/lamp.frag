precision mediump float;



uniform sampler2D lampTexture;

uniform vec3 colorOne;
uniform vec3 colorTwo;
uniform vec3 colorThree;
uniform vec3 colorFour;

varying vec2 vTextureCoord;
varying vec3 vVertexPos;


// float offset[3] = float[]( 0.0, 1.3846153846, 3.2307692308 );
// float weight[3] = float[]( 0.2270270270, 0.3162162162, 0.0702702703 );

vec4 fColor;

void main(void) {

	
    fColor = vec4(1.0, 1.0, 1.0, 0.0);
    // vec4 circleColor = 

    // for(int row = 0; row < 2; row++) {
        for(int col = 0; col < 4; col++) {
            float dist = distance(vVertexPos.xy, vec2(0.0, 1.0 + float(col)*1.5));
            float delta = 0.1;
    		float alpha = smoothstep(0.45-delta, 0.74, dist);
    		// float alpha = step(.45, dist);
    		// alpha -= .01;
    		vec3 circleColor = colorOne;
    		if (col == 1)
    			circleColor = colorTwo;
    		else if (col == 2)
    			circleColor = colorThree;
    		else if (col == 3)
    			circleColor = colorFour;
            fColor = mix(vec4(circleColor, 1.0), fColor, alpha);
            // fColor = mix(colors[row*2+col], fColor, alpha);
        }

        gl_FragColor = fColor;
    // }

    // float dist = distance(vVertexPos.xy, vec2(-0.50 + 0.0, 0.50 - 0.0));
    // float delta = 0.1;
    // float alpha = smoothstep(0.45-delta, 0.45, dist);
    // gl_FragColor = mix(vec4(0.5, 0.0, 1.0, 1.0), fColor, alpha);

    // gl_FragColor = fColor;

	// vec2 uv = vTextureCoord.xy;

	// uv -= vec2(.5, .2);

	// float circle_radius = .2;
	// float border = .01;

	// float dist =  sqrt(dot(uv, uv));
	// if ( dist < circle_radius ){
	// 	vec3 textureColor = texture2D(lampTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
	// 	gl_FragColor = vec4(textureColor, 1.0);
	// }
	// else{
		

	// 	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		
	// }
	
    // gl_FragColor = texture2D(lampTexture, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);

   


}