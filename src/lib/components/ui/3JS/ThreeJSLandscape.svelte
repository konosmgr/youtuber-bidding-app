<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  
  export let baseColor = '#0f172a'; // Dark base color
  export let peakColor = '#e2e8f0'; // Light peak color
  export let middleColor = '#334155'; // Middle color for better gradient
  export let segments = 128; // Higher detail level
  export let amplitude = 3.5; // Taller mountains
  export let rotationSpeed = 0.0002; // Speed of automatic rotation
  export let fogAmount = 0.6; // Amount of fog (0-1)
  export let starCount = 2000; // Number of stars in the background
  
  let container;
  let scene;
  let camera;
  let renderer;
  let terrain;
  let stars;
  let animationFrameId;
  let mousePressed = false;
  
  onMount(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Setup scene
    scene = new THREE.Scene();
    
    // Add fog for atmosphere
    const fogColor = new THREE.Color(baseColor);
    const fogDensity = 0.025 * fogAmount;
    scene.fog = new THREE.FogExp2(fogColor, fogDensity);
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 0, 0);
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(fogColor, 1); // Match fog color
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Add directional light for shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 15, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
    // Create stars in the background
    createStars();
    
    // Create terrain using improved noise algorithm
    createTerrain();
    
    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Auto-rotate terrain slowly
      if (!mousePressed) {
        terrain.rotation.y += rotationSpeed;
      }
      
      // Animate stars
      animateStars();
      
      // Add interactivity with mouse
      if (window.mouseX && !mousePressed) {
        const normalizedMouseX = (window.mouseX / window.innerWidth) * 2 - 1;
        const normalizedMouseY = (window.mouseY / window.innerHeight) * 2 - 1;
        
        // Target rotation based on mouse
        const targetRotationY = normalizedMouseX * 0.3;
        const targetRotationX = -Math.PI / 2 + normalizedMouseY * 0.2;
        
        // Smooth transition to target rotation
        terrain.rotation.y += (targetRotationY - terrain.rotation.y) * 0.03;
        terrain.rotation.x += (targetRotationX - terrain.rotation.x) * 0.03;
      }
      
      renderer.render(scene, camera);
    };
    
    // Track mouse position and state
    const updateMousePosition = (e) => {
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
    };
    
    const handleMouseDown = () => {
      mousePressed = true;
    };
    
    const handleMouseUp = () => {
      mousePressed = false;
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    // Return cleanup function
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (container && renderer) {
        container.removeChild(renderer.domElement);
      }
      
      if (scene) {
        if (terrain) scene.remove(terrain);
        if (stars) scene.remove(stars);
        if (ambientLight) scene.remove(ambientLight);
        if (directionalLight) scene.remove(directionalLight);
      }
      
      if (terrain) {
        if (terrain.geometry) terrain.geometry.dispose();
        if (terrain.material) terrain.material.dispose();
      }
      
      if (stars) {
        if (stars.geometry) stars.geometry.dispose();
        if (stars.material) stars.material.dispose();
      }
    };
  });
  
  // Create star field
  function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      // Position stars in a sphere around the scene
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random sizes
      starSizes[i] = 0.1 + Math.random() * 0.5;
      
      // Star colors - mostly white/blue, some yellow/red
      const colorType = Math.random();
      
      if (colorType < 0.7) { // White/blue stars
        starColors[i * 3] = 0.8 + Math.random() * 0.2;
        starColors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        starColors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      } else if (colorType < 0.9) { // Yellow stars
        starColors[i * 3] = 0.9 + Math.random() * 0.1;
        starColors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        starColors[i * 3 + 2] = 0.5 + Math.random() * 0.2;
      } else { // Red stars
        starColors[i * 3] = 0.9 + Math.random() * 0.1;
        starColors[i * 3 + 1] = 0.2 + Math.random() * 0.2;
        starColors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
      }
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    
    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Calculate position with slight movement
          vec3 pos = position;
          
          // Apply twinkle effect
          float twinkle = sin(time * 0.5 + position.x * 10.0 + position.y * 5.0 + position.z * 7.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (0.7 + 0.3 * twinkle);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular point
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Apply radial falloff
          float intensity = 1.0 - 2.0 * r;
          
          gl_FragColor = vec4(vColor * intensity, 1.0);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });
    
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  }
  
  // Animate stars
  function animateStars() {
    if (stars) {
      // Update time uniform for twinkle effect
      stars.material.uniforms.time.value += 0.01;
      
      // Slow rotation
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;
    }
  }
  
  // Create improved terrain with more realistic mountains
  function createTerrain() {
    const terrain_width = 60;
    const terrain_height = 60;
    
    // Create geometry with more segments for detail
    const geometry = new THREE.PlaneGeometry(
      terrain_width, 
      terrain_height, 
      segments, 
      segments
    );
    
    // Improved Perlin-like noise function
    const improvedNoise = (x, y, scale = 1, octaves = 4, persistence = 0.5) => {
      let total = 0;
      let frequency = scale;
      let amplitude = 1;
      let maxValue = 0;
      
      for (let i = 0; i < octaves; i++) {
        // Use multiple sine waves with different frequencies for a noise-like effect
        total += amplitude * (
          Math.sin(x * frequency * 1.0) * 
          Math.sin(y * frequency * 1.2) + 
          Math.sin(x * frequency * 0.5 + y * frequency * 0.7) * 0.5
        );
        
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }
      
      // Normalize between -1 and 1
      return total / maxValue;
    };
    
    // Apply terrain height with improved noise algorithm
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      
      // Use multiple octaves of noise for more natural terrain
      let height = 0;
      
      // Large scale mountain ranges
      height += improvedNoise(x * 0.02, y * 0.02, 1, 3, 0.6) * amplitude * 0.6;
      
      // Medium scale hills
      height += improvedNoise(x * 0.04, y * 0.04, 2, 3, 0.4) * amplitude * 0.3;
      
      // Small scale details
      height += improvedNoise(x * 0.1, y * 0.1, 4, 2, 0.2) * amplitude * 0.1;
      
      // Add some randomness
      height += (Math.random() - 0.5) * amplitude * 0.05;
      
      // Apply height with distance falloff for circular island effect
      const distance = Math.sqrt(x * x + y * y);
      const maxRadius = Math.min(terrain_width, terrain_height) * 0.45;
      const falloff = Math.max(0, 1 - (distance / maxRadius));
      const finalHeight = height * Math.pow(falloff, 1.5);
      
      // Set the vertex height
      vertices[i + 2] = finalHeight;
    }
    
    // Update normals for lighting
    geometry.computeVertexNormals();
    
    // Create material with improved shading
    const material = new THREE.ShaderMaterial({
      uniforms: {
        baseColor: { value: new THREE.Color(baseColor) },
        middleColor: { value: new THREE.Color(middleColor) },
        peakColor: { value: new THREE.Color(peakColor) },
        amplitude: { value: amplitude },
        fogColor: { value: new THREE.Color(baseColor) },
        fogDensity: { value: 0.025 * fogAmount },
        time: { value: 0 }
      },
      vertexShader: `
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float amplitude;
        uniform float time;
        
        void main() {
          vHeight = position.z;
          vNormal = normal;
          vPosition = position;
          
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 baseColor;
        uniform vec3 middleColor;
        uniform vec3 peakColor;
        uniform float amplitude;
        uniform vec3 fogColor;
        uniform float fogDensity;
        uniform float time;
        
        varying float vHeight;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simple noise function
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          // Calculate height factor (0 at lowest, 1 at peaks)
          float heightFactor = (vHeight + (amplitude * 0.5)) / amplitude;
          
          // Create three-color gradient
          vec3 color;
          if (heightFactor < 0.4) {
            // Blend from base to middle
            color = mix(baseColor, middleColor, heightFactor / 0.4);
          } else {
            // Blend from middle to peak
            color = mix(middleColor, peakColor, (heightFactor - 0.4) / 0.6);
          }
          
          // Add noise for texture
          float noise = hash(vPosition.xy * 100.0) * 0.05;
          color += vec3(noise);
          
          // Lighting with normal
          vec3 light = normalize(vec3(0.5, 1.0, 0.7));
          float diffuse = max(0.3, dot(vNormal, light));
          color *= diffuse;
          
          // Add rim light at edges
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = smoothstep(0.6, 1.0, rim);
          color += rim * peakColor * 0.2;
          
          // Add snow on peaks
          if (heightFactor > 0.7) {
            float snowAmount = smoothstep(0.7, 0.9, heightFactor) * 0.8;
            
            // Add noise to snow line for natural look
            float snowNoise = hash(vPosition.xy * 50.0) * 0.1;
            snowAmount *= (1.0 - snowNoise);
            
            // Only add snow on flatter areas (where normal points up)
            float flatness = dot(vNormal, vec3(0.0, 0.0, 1.0));
            snowAmount *= smoothstep(0.4, 0.8, flatness);
            
            color = mix(color, vec3(0.95, 0.95, 1.0), snowAmount);
          }
          
          // Apply fog
          float depth = gl_FragCoord.z / gl_FragCoord.w;
          float fogFactor = 1.0 - exp(-fogDensity * depth);
          color = mix(color, fogColor, fogFactor);
          
          gl_FragColor = vec4(color, 0.95); // Slight transparency
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create terrain mesh
    terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2; // Lay flat
    terrain.position.y = -2; // Position below camera
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    scene.add(terrain);
  }

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