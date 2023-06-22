// Author: SaravanaKumar
// Title: Radar System

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
varying vec2 v_uv;

float line (float a, float b, float line_width, float edge_thickness)
{
  float half_lineWidth = line_width * 0.5;
  return smoothstep(a-half_lineWidth-edge_thickness, a-half_lineWidth, b) - smoothstep(a+half_lineWidth, a+half_lineWidth+edge_thickness, b);
}

float circleOutline(vec2 pt, vec2 center, float radius, float line_Width)
{
  vec2 p = pt - center;
  float len = length(p);
  float half_linewidth = line_Width/2.0;
  return step(radius - half_linewidth, len) - step(radius + half_linewidth, len);
}

float sweep(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness)
{
  vec2 d = pt - center;
  float theta = u_time * 2.0;
  vec2 p = vec2(cos(theta), -sin(theta)) * radius;
  float h = clamp(dot(d,p)/dot(p,p), 0.0,1.0);
  float l = length(d - p*h);
  return 1.0 - smoothstep(line_width, line_width+edge_thickness, l);
}

float gradient_sweep(vec2 pt, vec2 center, float radius, float line_width, float edge_thickness)
{
  vec2 d = pt - center;
  float theta = fract(u_time/4.0) * 6.28;
  vec2 p = vec2(cos(theta), -sin(theta)) * radius;
  float h = clamp(dot(d,p)/dot(p,p), 0.0,1.0);
  float l = length(d - p*h);
  
  float gradient = 0.0;
  const float gradient_angle = 3.14*0.5;
  if(length(d) < radius) {
    float angle = mod(theta + atan(d.y, d.x), 6.28);
    gradient = clamp(gradient_angle - angle, 0.0, gradient_angle)/gradient_angle * 0.5;
  }
  return gradient + 1.0 - smoothstep(line_width, line_width+edge_thickness, l);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 axis_color = vec3(0.8);
  vec3 color = line(st.x, 0.5, 0.002, 0.001) * axis_color;
  color += line(st.y, 0.5, 0.002, 0.001) * axis_color;
  color += circleOutline(st, vec2(0.5), 0.3, 0.002) * axis_color;
  color += circleOutline(st, vec2(0.5), 0.2, 0.002) * axis_color;
  color += circleOutline(st, vec2(0.5), 0.1, 0.002) * axis_color;
  color += gradient_sweep(st, vec2(0.5), 0.3, 0.003, 0.001) * vec3(0.1,0.3,1.0);
  gl_FragColor = vec4(color,1.0);
}