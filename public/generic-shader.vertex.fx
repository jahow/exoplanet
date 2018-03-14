#ifdef GL_ES
  precision highp float;
#endif

// Attributes
attribute vec2 position;
attribute vec4 color;

// Uniforms
uniform mat4 worldViewProjection;

// Normal
varying vec4 vColor;

void main(void) {
  gl_Position = worldViewProjection * vec4(position,  0.0, 1.0);
  vColor = color;
}