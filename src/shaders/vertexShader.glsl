varying vec2 vUv;

uniform float time;
uniform float scaleEntry;
uniform float step1control;
uniform float step2control;
uniform float step3control;
uniform float step4control;
uniform float step5control;
uniform float step6control;

const float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv;

  vec3 p = position;
  
  // equations to morph from sphere to heart
  float x = p.x;
  float y = p.y;
  float z = p.z;

  // p.y = (4. + (1.2 * y) + abs(x) * sqrt((20. - abs(x)) / 15.));
  // p.z = z * (2. + (y / 15.)) * 0.3;

  float step2 = 0.;
  if (x < 0.) x -= (x * 2.) * step2control;

  float step3v = (20. - x) / 15.;
  float step3 = step3v - (step3v - sqrt(step3v)) * step3control;

  float step1 = x * step3 * step1control;
  p.y = y + step1 + (8.0 * step1control) - (12.0 * step2control);

  float step4 = z * ((2. - (y / 15.)) * 0.2) * step4control;
  p.z = z - step4;

  // heart beat scale equation
  float scale = (.20 * pow(.5 + .5 * sin(2. * PI * time + (p.y / 25.)), 4.)) * step6control;
  float scaleStep1 = 0.2 * step1control * (1. - step2control);

  float scaleX = scaleEntry * 1.0 + (.2 * step5control) + scale - scaleStep1;
  float scaleY = scaleEntry * 1.0 + scale - scaleStep1;
  float scaleZ = scaleEntry * 1.0 + scale - scaleStep1;

  mat4 sPos = mat4(
    vec4(scaleX, 0.0, 0.0, 0.0),
    vec4(0.0, scaleY, 0.0, 0.0),
    vec4(0.0, 0.0, scaleZ, 0.0),
  vec4(0.0, 0.0, 0.0, 1.0)
  );

  // rotation matrix
  float rotationY = 1. - time * 0.2;

  mat4 rYPos = mat4(
    vec4(cos(rotationY), 0.0, sin(rotationY), 0.0),
    vec4(0.0, 1.0, 0.0, 0.0),
    vec4(-sin(rotationY), 0.0, cos(rotationY), 0.0),
    vec4(0.0, 0.0, 0.0, 1.0)
  );

  gl_Position = projectionMatrix * modelViewMatrix * rYPos * sPos * vec4(p, 1.0);
}