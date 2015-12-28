precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler0;

uniform float fboW;
uniform float fboH;

uniform float winW;
uniform float winH;

void main(void) {

	float scaleW = fboW / winW;
	float scaleH = fboH / winH;

    gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s/scaleW, vTextureCoord.t/scaleH));
    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}