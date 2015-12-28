precision highp float;

uniform sampler2D videoTexture;
uniform sampler2D concreteTexture;

uniform float audioLevelDeep;
uniform float audioLevelHigh;

uniform float fboW;
uniform float fboH;

uniform float winW;
uniform float winH;

varying vec2 vTextureCoord;
varying vec3 vVertexPos;

void main(void) {
    
  vec3 finalColor = vec3(0.5, 0.5, 0.5);
  float alpha = 1.0;
  float reflLimit = .02;

  float scaleW = fboW / winW;
  float scaleH = fboH / winH;

  //floor
  vec4 concreteColor = texture2D(concreteTexture, vec2(vTextureCoord.s, vTextureCoord.t));

  vec2 coords = vTextureCoord;
  coords.s = coords.s/scaleW;
  coords.t = coords.t/scaleH;

  float maxS = 1.0 / scaleW;
  float maxT = 1.0 / scaleH;

  float reflLimitS = maxS - reflLimit;
  float reflLimitT = maxT - reflLimit;

  vec4 videoColorLeft = texture2D(videoTexture, vec2(maxS - coords.s, coords.t));
  vec4 videoColorFront = texture2D(videoTexture, vec2(coords.t, coords.s));
  vec4 videoColorRight = texture2D(videoTexture, vec2(maxS - coords.s, maxT - coords.t));
  vec4 videoColorBack = texture2D(videoTexture, vec2(coords.t, maxS - coords.s));
    
  vec3 reflFront = smoothstep(reflLimitS, maxS, maxS - coords.s) * videoColorFront.rgb;
  vec3 reflLeft = smoothstep(reflLimitT, maxT, maxT - coords.t) * videoColorLeft.rgb;
  vec3 reflRight = smoothstep(reflLimitT, maxT, coords.t) * videoColorRight.rgb;
  vec3 reflBack = smoothstep(reflLimitS, maxS, coords.s) * videoColorBack.rgb;

  finalColor = (concreteColor.rgb * (vec3(.5, .5, .5) * max(.5, audioLevelDeep))) + (reflFront + reflLeft + reflRight + reflBack);
    


  gl_FragColor = vec4(finalColor, alpha);

}