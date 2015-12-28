precision highp float;

uniform sampler2D videoTexture;


uniform float fboW;
uniform float fboH;

uniform float winW;
uniform float winH;

varying vec2 vTextureCoord;

//not used
varying vec3 vVertexPos;


void main(void) {
    
    
  // vec3 finalColor = vec3(.5, .5, .5);

  float scaleW = fboW / winW;
  float scaleH = fboH / winH;
   
  //walls
  vec4 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s/scaleW, vTextureCoord.t/scaleH));
  // finalColor = videoColor.rgb;
    
    

  gl_FragColor = vec4(videoColor);
   
}