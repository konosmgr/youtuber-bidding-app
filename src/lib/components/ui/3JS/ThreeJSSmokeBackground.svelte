<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  
  // Props
  export let color = '#8b5cf6'; // Default purple color
  export let density = 1000;    // Number of smoke particles
  export let size = 2.0;        // Size of each particle
  export let speed = 0.2;       // Animation speed
  export let turbulence = 0.3;  // Amount of turbulence/swirl
  
  // Component variables
  let container;
  let scene;
  let camera;
  let renderer;
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let clock;
  let animationId;
  let isInitialized = false;
  
  // Initialize the scene
  onMount(() => {
    if (typeof window === 'undefined') return;
    
    initScene();
    initParticles();
    addEventListeners();
    animate();
    
    return () => {
      // Clean up resources
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      removeEventListeners();
      disposeResources();
    };
  });
  
  onDestroy(() => {
    if (isInitialized) {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      removeEventListeners();
      disposeResources();
    }
  });
  
  // Setup the Three.js scene
  function initScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color(0x000000), 0.001);
    
    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 1, 3000);
    camera.position.z = 1000;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    clock = new THREE.Clock();
    isInitialized = true;
  }
  
  // Create the smoke particles
  function initParticles() {
    const particleCount = density;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const ages = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    
    // Create texture for particles
    const textureLoader = new THREE.TextureLoader();
    const smokeTexture = textureLoader.load('/textures/smoke.png', function(texture) {
      // Fallback if texture fails to load
      texture.onerror = function() {
        console.log('Unable to load smoke texture. Using default particle.');
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        
        // Draw a soft circular gradient for the particle
        const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 128, 128);
        
        texture.image = canvas;
        texture.needsUpdate = true;
      };
    });
    
    // Initialize particle positions and properties randomly
    for (let i = 0; i < particleCount; i++) {
      // Position
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = Math.random() * 0.1 + 0.05; // Upward drift
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      
      // Age and size
      ages[i] = Math.random() * 10;
      sizes[i] = (Math.random() * 0.5 + 0.5) * size;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('age', new THREE.BufferAttribute(ages, 1));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create smoky particle material
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: size,
      map: smokeTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
      sizeAttenuation: true
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push({
      system: particleSystem,
      geometry: particleGeometry,
      material: particleMaterial,
      velocities: velocities,
      ages: ages
    });
  }
  
  function updateParticles(elapsed) {
    particles.forEach(particle => {
      const positions = particle.geometry.attributes.position.array;
      const velocities = particle.velocities;
      const ages = particle.ages;
      const sizes = particle.geometry.attributes.size.array;
      
      // Get attribute arrays for updates
      for (let i = 0; i < positions.length / 3; i++) {
        // Update age
        ages[i] += elapsed * speed;
        
        // Reset particles that exceed age limit
        if (ages[i] > 10) {
          positions[i * 3] = Math.random() * 2000 - 1000;
          positions[i * 3 + 1] = -1000 + Math.random() * 200;
          positions[i * 3 + 2] = Math.random() * 2000 - 1000;
          
          velocities[i * 3] = (Math.random() - 0.5) * 0.2;
          velocities[i * 3 + 1] = Math.random() * 0.1 + 0.05;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
          
          ages[i] = 0;
          sizes[i] = (Math.random() * 0.5 + 0.5) * size;
        }
        
        // Apply velocity to position
        positions[i * 3] += velocities[i * 3] * elapsed * 10;
        positions[i * 3 + 1] += velocities[i * 3 + 1] * elapsed * 10;
        positions[i * 3 + 2] += velocities[i * 3 + 2] * elapsed * 10;
        
        // Apply turbulence based on position - creates swirling effect
        const swirl = Math.sin(positions[i * 3] * 0.01 + elapsed) * Math.cos(positions[i * 3 + 2] * 0.01) * turbulence;
        positions[i * 3] += swirl * elapsed * 5;
        positions[i * 3 + 2] += swirl * elapsed * 5;
        
        // Apply subtle mouse influence
        const distX = positions[i * 3] - (mouseX - windowHalfX) * 2;
        const distZ = positions[i * 3 + 2] - (mouseY - windowHalfY) * 2;
        const distance = Math.sqrt(distX * distX + distZ * distZ);
        
        if (distance < 400) {
          const strength = (1 - distance / 400) * 0.3 * elapsed;
          velocities[i * 3] += distX * strength;
          velocities[i * 3 + 2] += distZ * strength;
        }
        
        // Fade particle based on age - change opacity
        const opacity = Math.sin(ages[i] * Math.PI / 10);
        // Change size based on age - grow then shrink
        const fadeSize = sizes[i] * Math.sin(ages[i] * Math.PI / 10);
      }
      
      // Update Three.js buffers
      particle.geometry.attributes.position.needsUpdate = true;
      particle.geometry.attributes.size.needsUpdate = true;
      
      // Rotate the entire particle system slightly
      particle.system.rotation.y += 0.001 * elapsed;
    });
  }
  
  // Animation loop
  function animate() {
    if (!isInitialized) return;
    
    animationId = requestAnimationFrame(animate);
    
    const elapsed = clock.getDelta();
    updateParticles(elapsed);
    
    // Rotate camera slightly based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  
  // Event handlers
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
  }
  
  function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      mouseX = (event.touches[0].pageX - windowHalfX) * 0.1;
      mouseY = (event.touches[0].pageY - windowHalfY) * 0.1;
    }
  }
  
  function addEventListeners() {
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('touchmove', onDocumentTouchMove);
  }
  
  function removeEventListeners() {
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('touchmove', onDocumentTouchMove);
  }
  
  // Clean up resources
  function disposeResources() {
    if (!isInitialized) return;
    
    particles.forEach(particle => {
      scene.remove(particle.system);
      particle.geometry.dispose();
      if (particle.material.map) particle.material.map.dispose();
      particle.material.dispose();
    });
    
    if (renderer) {
      renderer.dispose();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    }
    
    particles = [];
    scene = null;
    camera = null;
    renderer = null;
    clock = null;
    isInitialized = false;
  }
  
  // Watch for prop changes and update
  $: if (isInitialized && particles.length > 0) {
    particles.forEach(particle => {
      particle.material.color = new THREE.Color(color);
      const sizes = particle.geometry.attributes.size.array;
      for (let i = 0; i < sizes.length; i++) {
        sizes[i] = (Math.random() * 0.5 + 0.5) * size;
      }
      particle.geometry.attributes.size.needsUpdate = true;
    });
  }
</script>

<div bind:this={container} class="absolute top-0 left-0 w-full h-full -z-10"></div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }
</style> 