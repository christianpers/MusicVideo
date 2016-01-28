precision mediump float;

varying float vIndexData;

varying vec3 vVertexPos;

void main(void) {

	// vec2 pos = mod(vVertexPos.xy, vec2(50.0)) - vec2(35.0);
 // 	float dist_squared = dot(pos, pos);

 // 	if (dist_squared >= 100.0) discard;
 // 	vec4 color = vec4(.90, .90, .90, 1.0);
  
    gl_FragColor = vec4(vIndexData/4.0, .1, .90, 1.0);

      // gl_FragColor = mix(vec4(.90, .90, .90, 1.0), vec4(.20, .20, .40, 0.0),
      //                   smoothstep(380.25, 420.25, dist_squared));
	
    // gl_FragColor = texture2D(sceneTexture, vec2(vTextureCoord.s, vTextureCoord.t));
    // gl_FragColor = vec4(1.0, .5, .5, 1.0);

   


}