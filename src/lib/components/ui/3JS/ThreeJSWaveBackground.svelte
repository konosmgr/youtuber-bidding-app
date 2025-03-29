<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  
  export let color1 = '#1a365d'; // First color of gradient (deep blue)
  export let color2 = '#7dd3fc'; // Second color of gradient (light blue)
  export let segments = 128; // Higher number of segments for smoother waves
  export let speed = 0.4; 
  export let amplitude = 0.4;
  export let frequency = 0.6;
  export let layers = 3; // Number of wave layers for depth effect
  
  let container;
  let scene;
  let camera;
  let renderer;
  let waves = [];
  let clock;
  let animationFrameId;
  
  onMount(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Setup scene
    scene = new THREE.Scene();
    
    // Setup camera - orthographic for a 2D-like effect
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100);
    camera.position.z = 1;
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Setup clock for animation
    clock = new THREE.Clock();
    
    // Create multiple wave layers for depth effect
    for (let i = 0; i < layers; i++) {
      // Create wave plane with higher segment count
      const waveGeometry = new THREE.PlaneGeometry(
        4, 
        2, 
        segments, 
        segments / 2
      );
      
      // Calculate layer-specific parameters
      const layerDepth = i / layers; // 0 to almost 1
      const layerOpacity = 1 - (layerDepth * 0.4); // 1 to 0.6
      const layerAmplitude = amplitude * (1 - layerDepth * 0.5); // Full to half amplitude
      const layerFrequency = frequency * (1 + layerDepth); // Increasing frequency for background layers
      const layerSpeed = speed * (1 - layerDepth * 0.3); // Slightly slower for background layers
      
      // Interpolate between colors
      const color1Obj = new THREE.Color(color1);
      const color2Obj = new THREE.Color(color2);
      const layerColor1 = color1Obj.clone().lerp(color2Obj, layerDepth * 0.3);
      const layerColor2 = color2Obj.clone().lerp(color1Obj, layerDepth * 0.2);
      
      // Create shader material with improved wave effects
      const waveMaterial = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_color1: { value: layerColor1 },
          u_color2: { value: layerColor2 },
          u_frequency: { value: layerFrequency },
          u_amplitude: { value: layerAmplitude },
          u_speed: { value: layerSpeed },
          u_mouseX: { value: 0.5 },
          u_mouseY: { value: 0.5 },
          u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          uniform float u_time;
          uniform float u_frequency;
          uniform float u_amplitude;
          uniform float u_speed;
          uniform float u_mouseX;
          uniform float u_mouseY;
          varying vec2 vUv;
          varying float vElevation;
          
          // Improved noise function for more natural waves
          float noise(vec2 p) {
            return sin(p.x * 10.0) * sin(p.y * 10.0) * 0.5 + 0.5;
          }
          
          void main() {
            vUv = uv;
            
            // Base wave
            float waveX1 = sin(position.x * u_frequency + u_time * u_speed) * u_amplitude;
            float waveY1 = sin(position.y * u_frequency * 0.8 + u_time * u_speed * 0.9) * u_amplitude * 0.5;
            
            // Secondary wave (higher frequency)
            float waveX2 = sin(position.x * u_frequency * 2.5 + u_time * u_speed * 0.8) * u_amplitude * 0.3;
            float waveY2 = sin(position.y * u_frequency * 2.0 + u_time * u_speed * 1.1) * u_amplitude * 0.2;
            
            // Circular wave from mouse position
            vec2 mousePos = vec2(u_mouseX * 2.0 - 1.0, u_mouseY * 2.0 - 1.0);
            float dist = distance(position.xy, mousePos) * 2.0;
            float mouseWave = sin(dist * 4.0 - u_time * u_speed * 2.0) * u_amplitude * 0.15 * (1.0 / (1.0 + dist));
            
            // Combine waves
            float elevation = waveX1 + waveY1 + waveX2 + waveY2 + mouseWave;
            vElevation = elevation;
            
            // Apply elevation to Z position
            vec3 pos = position;
            pos.z += elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 u_color1;
          uniform vec3 u_color2;
          uniform vec2 u_resolution;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            // Create gradient effect based on both UV and elevation
            vec3 color = mix(u_color1, u_color2, vUv.y + vElevation);
            
            // Add shimmer/highlight effect
            float highlight = smoothstep(0.4, 0.6, sin(vElevation * 15.0) * 0.5 + 0.5);
            color += highlight * 0.1;
            
            // Add edge darkening for depth
            float edgeDarkening = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
            color *= 0.8 + edgeDarkening * 0.2;
            
            // Add subtle noise pattern
            float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233) * 5.0)) * 43758.5453);
            color += (noise - 0.5) * 0.02;
            
            // Set alpha based on elevation for wave effect
            float alpha = 0.7 + vElevation * 0.3;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true
      });
      
      // Create mesh
      const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
      
      // Position each layer at a different depth
      waveMesh.position.z = -0.05 * i;
      
      // Add some rotation variations between layers
      waveMesh.rotation.x = -0.1 + i * 0.05;
      waveMesh.rotation.y = i * 0.02;
      
      // Add to scene and store in array
      scene.add(waveMesh);
      waves.push(waveMesh);
    }
    
    // Add ambient light for subtle shading
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // Add directional light for highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Setup animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Update each wave layer
      waves.forEach((wave, index) => {
        // Update uniforms
        wave.material.uniforms.u_time.value = elapsedTime;
        
        // Add variation to each layer's animation
        const layerOffset = index * 0.2;
        wave.rotation.z = Math.sin(elapsedTime * 0.1 + layerOffset) * 0.02;
        
        // Update mouse interaction
        if (window.mouseX && window.mouseY) {
          const normalizedMouseX = window.mouseX / window.innerWidth;
          const normalizedMouseY = window.mouseY / window.innerHeight;
          
          wave.material.uniforms.u_mouseX.value = normalizedMouseX;
          wave.material.uniforms.u_mouseY.value = normalizedMouseY;
          
          // Subtle tilt based on mouse position
          wave.rotation.x = -0.1 + (normalizedMouseY - 0.5) * 0.1 + index * 0.05;
          wave.rotation.y = (normalizedMouseX - 0.5) * 0.1 + index * 0.02;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    // Track mouse position
    const updateMousePosition = (e) => {
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    // Handle window resize
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      // Update resolution uniform
      waves.forEach(wave => {
        if (wave.material.uniforms.u_resolution) {
          wave.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        }
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Return cleanup function
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (container && renderer) {
        container.removeChild(renderer.domElement);
      }
      
      waves.forEach(wave => {
        if (scene) scene.remove(wave);
        if (wave.geometry) wave.geometry.dispose();
        if (wave.material) wave.material.dispose();
      });
      
      if (scene) {
        if (ambientLight) scene.remove(ambientLight);
        if (directionalLight) scene.remove(directionalLight);
      }
    };
  });

  onDestroy(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
</script>

<div 
  bind:this={container}
  class="fixed inset-0 -z-10 pointer-events-none"
/>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style> 