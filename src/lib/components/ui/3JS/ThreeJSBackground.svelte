<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  
  export let color = '#6495ed'; // Default color - change to match your site theme
  export let particleCount = 1500;
  export let particleSize = 0.05;
  export let speed = 0.0005;
  
  let container;
  let scene;
  let camera;
  let renderer;
  let particles;
  let animationFrameId;
  
  onMount(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Create scene
    scene = new THREE.Scene();
    
    // Setup camera
    camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;
    
    // Setup renderer
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionArray, 3)
    );
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: particleSize,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Animation function
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      particles.rotation.x += speed * 0.6;
      particles.rotation.y += speed;
      
      // Add mouse interaction
      if (window.mouseX) {
        particles.rotation.y += (window.mouseX - particles.rotation.y) * 0.00005;
        particles.rotation.x += (window.mouseY - particles.rotation.x) * 0.00005;
      }
      
      renderer.render(scene, camera);
    };
    
    // Track mouse position globally
    const updateMousePosition = (e) => {
      window.mouseX = e.clientX;
      window.mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (container && renderer) {
        container.removeChild(renderer.domElement);
      }
      
      if (scene && particles) {
        scene.remove(particles);
      }
      
      if (particlesGeometry) {
        particlesGeometry.dispose();
      }
      
      if (particlesMaterial) {
        particlesMaterial.dispose();
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
  /* The container will fill the entire screen and sit behind other content */
  div {
    width: 100%;
    height: 100%;
  }
</style> 