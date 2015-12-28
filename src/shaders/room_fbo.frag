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




void main(void) {
  
    vec4 videoColor = texture2D(videoTexture, vec2(vTextureCoord.s, vTextureCoord.t));
    
    gl_FragColor = videoColor;
   
}