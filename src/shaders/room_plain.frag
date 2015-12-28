precision highp float;


uniform mat4 uMVMatrix;
uniform mat3 uNMatrix;



uniform sampler2D videoTexture;
uniform sampler2D concreteTexture;

uniform float angle;

uniform float audioLevelDeep;
uniform float audioLevelHigh;

//datgui props
uniform float colorNoiseMultiplier;
uniform vec3 noiseBaseColor;
uniform float audioLevelNoiseDivider;
uniform float vertexMultiplier;
uniform int usePulse;

uniform mat3 textureRot;



// uniform vec3 uCameraPosition;


// uniform vec4 uPosition;
// uniform vec3 uIntensities;
// uniform float uAttenuation;
// uniform float uAmbientCoefficient;
// uniform float uConeAngle;
// uniform vec3 uConeDirection;

// uniform float materialShininess;
// uniform vec3 materialSpecularColor;



varying vec3 vColor;


varying vec3 vLightWeighting;

varying vec2 vTextureCoord;


varying vec3 vVertexPos;

varying float vUseVideoTexture;

// varying vec3 vFragVert;
// varying vec3 vFragNormal;

// #define PI 3.141592653589793


void main(void) {
    
    // else if (vUseVideoTexture == 2.0){

    //   vec4 concreteColor = texture2D(concreteTexture, vec2(vTextureCoord.s, vTextureCoord.t));

    //   vec4 videoColorRight = texture2D(videoTexture, vec2(1.0 - vTextureCoord.s, vTextureCoord.t));
    //   vec4 videoColorBack = texture2D(videoTexture, vec2(vTextureCoord.t, vTextureCoord.s));
    //   vec4 videoColorLeft = texture2D(videoTexture, vec2(1.0 - vTextureCoord.s, 1.0 - vTextureCoord.t));
    //   vec4 videoColorFront = texture2D(videoTexture, vec2(vTextureCoord.t, 1.0 - vTextureCoord.s));
        
    //   vec3 reflFront = smoothstep(reflLimit, 1.0, 1.0 - vTextureCoord.s) * videoColorFront.rgb;
    //   vec3 reflLeft = smoothstep(reflLimit, 1.0, 1.0 - vTextureCoord.t) * videoColorLeft.rgb;
    //   vec3 reflRight = smoothstep(reflLimit, 1.0, vTextureCoord.t) * videoColorRight.rgb;
    //   vec3 reflBack = smoothstep(reflLimit, 1.0, vTextureCoord.s) * videoColorBack.rgb;

    //   finalColor = concreteColor.rgb + (reflFront + reflLeft + reflRight + reflBack);

    // }
    
    
    vec3 finalColor = vec3(0.5, 0.5, 0.5);
    float alpha = 1.0;
    float reflLimit = .9;
    if (vUseVideoTexture == 10.0){
      //walls
      vec4 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s, vTextureCoord.t));
      finalColor = videoColor.rgb;
    
    }else if (vUseVideoTexture == 0.0){

      //floor
      vec4 concreteColor = texture2D(concreteTexture, vec2(vTextureCoord.s, vTextureCoord.t));
     
      vec4 videoColorLeft = texture2D(videoTexture, vec2(1.0 - vTextureCoord.s, vTextureCoord.t));
      vec4 videoColorFront = texture2D(videoTexture, vec2(vTextureCoord.t, vTextureCoord.s));
      vec4 videoColorRight = texture2D(videoTexture, vec2(1.0 - vTextureCoord.s, 1.0 - vTextureCoord.t));
      vec4 videoColorBack = texture2D(videoTexture, vec2(vTextureCoord.t, 1.0 - vTextureCoord.s));
        
      vec3 reflFront = smoothstep(reflLimit, 1.0, 1.0 - vTextureCoord.s) * videoColorFront.rgb;
      vec3 reflLeft = smoothstep(reflLimit, 1.0, 1.0 - vTextureCoord.t) * videoColorLeft.rgb;
      vec3 reflRight = smoothstep(reflLimit, 1.0, vTextureCoord.t) * videoColorRight.rgb;
      vec3 reflBack = smoothstep(reflLimit, 1.0, vTextureCoord.s) * videoColorBack.rgb;

      finalColor = concreteColor.rgb + (reflFront + reflLeft + reflRight + reflBack);
      
    }

    gl_FragColor = vec4(finalColor, alpha);
   
}