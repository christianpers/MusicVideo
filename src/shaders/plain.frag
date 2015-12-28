precision highp float;
// varying vec2 vTextureCoord;


uniform mat4 uNMatrix;

// uniform vec3 diffuse;

uniform sampler2D videoTexture;

uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;

uniform vec4 uMaterialAmbient;
uniform vec3 uMaterialDiffuse;
uniform vec3 uMaterialSpecular;
uniform float uShininess;

uniform float audioLevelDeep;
uniform float audioLevelHigh;

varying vec3 vNormal;
varying vec3 vLightRay;
varying vec3 vEyeVec;

varying vec3 vLighting;

varying vec2 vTextureCoord;
varying vec3 vVertexPos;
varying vec3 vColor;

void main(void) {

	// const vec3 lightCol1 = vec3( 0.0, 0.0, 0.0 );
 //    const vec3 lightDir1 = vec3( -1.0, 0.0, 0.0 );
 //    const float intensity1 = 1.0;

 //    vec4 lDirection1 = uNMatrix * vec4( lightDir1, 0.0 );
 //    vec3 lightVec1 = normalize( lDirection1.xyz );

    // point light

    // const vec3 lightPos2 = vec3( 0.0, 0.0, -200.0 );
    // const vec3 lightCol2 = vec3( 1.0, 0.5, 0.2 );
    // const float maxDistance2 = 20000.0;
    // const float intensity2 = 1.5;

    // vec4 lPosition = uNMatrix * vec4( lightPos2, 1.0 );
    // vec3 lVector = lPosition.xyz + vViewPosition.xyz;

    // vec3 lightVec2 = normalize( lVector );
    // float lDistance2 = 1.0 - min( ( length( lVector ) / maxDistance2 ), 1.0 );

    // // point light

    // // const vec3 lightPos3 = vec3( 0.0, 0.0, -20.0 );
    // // const vec3 lightCol3 = vec3(0.0, 1.0, 1.0 );
    // // float maxDistance3 = audioEnergy * 40.0;
    // // const float intensity3 = 1.5;

    // // vec4 lPosition3 = uNMatrix * vec4( lightPos3, 1.0 );
    // // vec3 lVector3 = lPosition3.xyz + vViewPosition.xyz;

    // // vec3 lightVec3 = normalize( lVector3 );
    // // float lDistance3 = 1.0 - min( ( length( lVector3 ) / maxDistance3 ), 1.0 );

    // //

    // vec3 normal = vNormal;

    // // float diffuse1 = intensity1 * max( dot( normal, lightVec1 ), 0.0 );
    // float diffuse2 = intensity2 * max( dot( normal, lightVec2 ), 0.0 ) * lDistance2;
    // // float diffuse3 = intensity2 * max( dot( normal, lightVec3 ), 0.0 ) * lDistance3;

    // // vec3 color = texture2D(testTexture, vec2(vTextureCoord.s, vTextureCoord.t )).rgb;

    // gl_FragColor = vec4(diffuse2 * diffuse, 1.0 );
    // gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(0.05, 0.8, 0.05, 1.0);

    // vec3 L = normalize(vLightRay);
    // vec3 N = normalize(vNormal);

    // //Lambert's cosine law
    // float lambertTerm = dot(N,-L);
    
    // //Ambient Term  
    // vec4 Ia = uLightAmbient * uMaterialAmbient;

    // //Diffuse Term
    // vec4 Id = vec4(0.0,0.0,0.0,1.0);

    // //Specular Term
    // vec4 Is = vec4(0.0,0.0,0.0,1.0);

    // if(lambertTerm > 0.0)
    // {
    //     Id = uLightDiffuse * vec4(uMaterialDiffuse,1.0) * lambertTerm; 
    //     vec3 E = normalize(vEyeVec);
    //     vec3 R = reflect(L, N);
    //     float specular = pow( max(dot(R, E), 0.0), uShininess);
    //     Is = uLightSpecular * vec4(uMaterialSpecular,1.0) * specular;
    // }

    // //Final color
    // vec4 finalColor = Ia + Id + Is;
    // finalColor.a = 1.0;

    // gl_FragColor = finalColor;

 //    vec4 Ia = uLightAmbient * uMaterialAmbient;	//Ambient component: one for all
 //    vec4 finalColor = vec4(0.0,0.0,0.0,1.0);	//Color that will be assigned to gl_FragColor
							
	// vec3 N = normalize(vNormal);
	// vec3 L = vec3(0.0);
	// float lambertTerm = 0.0;
	
	// // for(int i = 0; i < NUM_LIGHTS; i++){					//For each light
		
	// L = normalize(vLightRay);			//Calculate reflexion
	// lambertTerm = dot(N, -L);
	
	// if (lambertTerm > 0.4){			
	// 	finalColor += uLightDiffuse * vec4(uMaterialDiffuse,1.0) * lambertTerm; //Add diffuse component, one per light
	// }
	// // }

	// //Final color
 //    finalColor += Ia;
 //    finalColor.a = 1.0;				//Add ambient component: one for all					
	// gl_FragColor = finalColor;		//The alpha value in this example will be 1.0
    // vec3 finalColor = uMaterialDiffuse * vLighting;
    vec3 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
	// gl_FragColor = vec4(mix(videoColor, finalColor, .3), 1.0);
    // smoothstep(0.8, 1.0, 1.0 - vTextureCoord.s) * videoColor.rgb;
    float yPos = abs(min(vVertexPos.z, .2));
    float audioLevel = audioLevelHigh/6.37;
    vec3 finalColor = smoothstep(0.7, 1.0, audioLevelHigh/26.37) * vec3(0.5, 1.0, .7);
    finalColor = vec3(.7, audioLevel, audioLevel) * yPos;
    gl_FragColor = vec4(vColor * vLighting, 1.0);
}