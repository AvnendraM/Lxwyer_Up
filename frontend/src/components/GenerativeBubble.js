import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// ── GLSL Perlin 3D noise ──────────────────────────────────────────────────
const noiseGLSL = `
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute4(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt4(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec3 fade3(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}
float cnoise(vec3 P){
  vec3 Pi0=floor(P),Pi1=Pi0+1.;
  Pi0=mod289v3(Pi0);Pi1=mod289v3(Pi1);
  vec3 Pf0=fract(P),Pf1=Pf0-1.;
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 ixy=permute4(permute4(ix)+iy);
  vec4 ixy0=permute4(ixy+Pi0.zzzz),ixy1=permute4(ixy+Pi1.zzzz);
  vec4 gx0=ixy0/7.,gy0=fract(floor(gx0)/7.)-.5;gx0=fract(gx0);
  vec4 gz0=.5-abs(gx0)-abs(gy0),sz0=step(gz0,vec4(0.));
  gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);
  vec4 gx1=ixy1/7.,gy1=fract(floor(gx1)/7.)-.5;gx1=fract(gx1);
  vec4 gz1=.5-abs(gx1)-abs(gy1),sz1=step(gz1,vec4(0.));
  gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 n0=taylorInvSqrt4(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=n0.x;g010*=n0.y;g100*=n0.z;g110*=n0.w;
  vec4 n1=taylorInvSqrt4(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=n1.x;g011*=n1.y;g101*=n1.z;g111*=n1.w;
  float n000=dot(g000,Pf0),n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z)),n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz)),n111=dot(g111,Pf1);
  vec3 f=fade3(Pf0);
  vec4 nz=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),f.z);
  vec2 ny=mix(nz.xy,nz.zw,f.y);
  return 2.2*mix(ny.x,ny.y,f.x);
}
`;

const vertexShader = `
${noiseGLSL}
uniform float uTime;
uniform float uNoiseDensity;
uniform float uNoiseStrength;
varying float vNoise;

void main(){
  float noise = cnoise(position * uNoiseDensity + uTime * 0.08);
  vNoise = noise * 0.5 + 0.5;
  vec3 displaced = position + normal * noise * uNoiseStrength;
  vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPos;
  gl_PointSize = 2.2;
}
`;

// Fragment shader now accepts a uColor uniform
const fragmentShader = `
uniform vec3 uColor;
varying float vNoise;
void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv) * 2.0;
  if(d > 1.0) discard;
  float alpha = smoothstep(1.0, 0.0, d) * mix(0.25, 0.58, vNoise);
  gl_FragColor = vec4(uColor, alpha);
}
`;

export default function GenerativeBubble({ active, typing, color }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Parse hex color string like '#3b82f6' or default to white
    let r = 1.0, g = 1.0, b = 1.0;
    if (color) {
      const hex = color.replace('#', '');
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    }

    // ── Renderer — cap DPR at 1 for performance ──────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 6;

    // ── Geometry — detail=14 → ~1200 vertices, smooth but lighter ──
    const geo = new THREE.IcosahedronGeometry(1.68, 14);

    // ── Uniforms ─────────────────────────────────────────────────────
    const uniforms = {
      uTime:          { value: 0 },
      uNoiseDensity:  { value: 1.2 },
      uNoiseStrength: { value: 0.50 },
      uColor:         { value: new THREE.Vector3(r, g, b) },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    const group  = new THREE.Group();
    group.add(points);
    scene.add(group);

    // ── Animation — throttled to ~45fps for smooth feel without overload ──
    const clock = new THREE.Clock();
    let raf;
    let lastTime = 0;
    const TARGET_INTERVAL = 1000 / 45; // ~45fps

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - lastTime < TARGET_INTERVAL) return;
      lastTime = now;

      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      group.rotation.y = t * 0.030;
      group.rotation.x = Math.sin(t * 0.018) * 0.13;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    // ── Resize ───────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [color]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: typing ? 0.87 : active ? 0.14 : 0.72,
      transition: 'opacity 1.8s ease-in-out',
    }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
