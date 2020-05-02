precision highp float;

#define sat(x) clamp(x, .0, 1.)

varying vec2 vUv;

uniform sampler2D texture;
uniform float opacity;

float remap(float a, float b, float c, float d, float t) {
  return sat((t - a) / (b - a)) * (d - c) + c;
}

void main() {
  vec2 uv = vUv;

  vec3 color = vec3(.98, .43, .60);

  float limit = 1.;
  float edgeOffset = .3;
  float y = remap(0., 1., 0., limit, uv.y);
  color.r = limit - abs(y - (limit / 2.)) * (2. - edgeOffset * 4.);

  gl_FragColor = texture2D(texture, uv) * vec4(color, opacity);
}