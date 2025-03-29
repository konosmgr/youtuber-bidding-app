<script>
  import { onMount, createEventDispatcher, tick } from 'svelte';
  
  // We'll use dynamic imports for Three.js to make it browser-only
  let THREE;
  let OrbitControls;
  let EffectComposer;
  let RenderPass;
  let UnrealBloomPass;
  let ShaderPass;
  
  // Props for the card
  export let className = '';
  export let cardStyle = '';
  export let width = 300;
  export let height = 450;
  export let imageSrc = '';
  export let altText = '';
  export let title = '';
  export let subtitle = '';
  export let description = '';
  export let price = 0;
  
  // Three.js specific props
  export let hoverEffect = 'tilt'; // 'tilt', 'float', 'explode', 'morph'
  export let materialType = 'standard'; // 'standard', 'physical', 'toon', 'holographic'
  export let particleEffect = false;
  export let glowEffect = true;
  export let glowColor = '#5D3FD3';
  export let glowStrength = 0.8;
  export let backgroundType = 'gradient'; // 'gradient', 'particles', 'environment'
  export let cardColor = '#ffffff';
  export let cardThickness = 0.5;
  export let perspective = 1500;
  export let maxTiltAngle = 15;
  export let interactiveBackground = true;
  export let interactivityLevel = 0.8; // 0-1
  export let animationSpeed = 1.0;
  export let enableShadows = true;
  export let depthIntensity = 0.8;
  export let autoRotate = false;
  export let floatHeight = 5;
  
  // State variables
  let container;
  let canvas;
  let isHovering = false;
  let mousePosition = { x: 0, y: 0 };
  let scene, camera, renderer, composer;
  let cardMesh, imageMesh, textMeshes = [];
  let particleSystem;
  let controls;
  let clock;
  let animationFrame;
  let initialized = false;
  let cardLayers = [];
  let particles = [];
  let originalPositions = {};
  let textureLoader;
  let dispatchEvent = createEventDispatcher();
  let threejsLoaded = false;
  let loadingError = null;
  
  // Load Three.js and its modules asynchronously - this only runs in the browser
  async function loadThreeJS() {
    if (typeof window === 'undefined') return false; // Skip on SSR
    
    try {
      // Use direct dynamic imports, which work better with Vite
      // Import the main Three.js library
      const threeModule = await import('three');
      THREE = threeModule;
      
      // Import the additional modules we need
      const orbitControlsModule = await import('three/examples/jsm/controls/OrbitControls.js');
      OrbitControls = orbitControlsModule.OrbitControls;
      
      const composerModule = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      EffectComposer = composerModule.EffectComposer;
      
      const renderPassModule = await import('three/examples/jsm/postprocessing/RenderPass.js');
      RenderPass = renderPassModule.RenderPass;
      
      const bloomPassModule = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      UnrealBloomPass = bloomPassModule.UnrealBloomPass;
      
      const shaderPassModule = await import('three/examples/jsm/postprocessing/ShaderPass.js');
      ShaderPass = shaderPassModule.ShaderPass;
      
      // Initialize the clock
      clock = new THREE.Clock();
      textureLoader = new THREE.TextureLoader();
      
      return true;
    } catch (error) {
      console.error("Error loading Three.js:", error);
      loadingError = "Failed to load Three.js. Please make sure it's installed with 'npm install three'.";
      return false;
    }
  }
  
  // Create Three.js scene
  async function initThreeJS() {
    if (!canvas || !container || initialized) return;
    
    // Base scene
    scene = new THREE.Scene();
    
    // Enhanced camera setup with better field of view
    camera = new THREE.PerspectiveCamera(
      40, // Narrower FOV for better depth
      width / height,
      0.1,
      2000
    );
    camera.position.z = 40;
    
    // Renderer with enhanced settings
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding; // Better color accuracy
    
    if (enableShadows) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    // Add lighting
    createLighting();
    
    // Create the card
    await createCard();
    
    // Background effects
    if (backgroundType === 'particles') {
      createParticleBackground();
    } else if (backgroundType === 'environment') {
      createEnvironmentMap();
    }
    
    // Post processing effects
    setupPostProcessing();
    
    // Optional orbit controls for debugging
    if (autoRotate) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
    
    // Start animation loop
    initialized = true;
    animate();
  }
  
  function createLighting() {
    // Enhanced lighting setup for more dramatic visuals
    
    // Ambient light - soft overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Main directional light - simulates sunlight with higher intensity
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 15);
    directionalLight.name = 'mainLight'; // Add name for identification
    
    if (enableShadows) {
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048; // Higher resolution shadows
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 60;
      directionalLight.shadow.camera.left = -30;
      directionalLight.shadow.camera.right = 30;
      directionalLight.shadow.camera.top = 30;
      directionalLight.shadow.camera.bottom = -30;
      directionalLight.shadow.bias = -0.0005; // Reduces shadow acne
      directionalLight.shadow.normalBias = 0.02; // Better shadow quality
    }
    
    scene.add(directionalLight);
    
    // Dynamic rim light for dramatic edge highlighting - this will move with mouse
    const rimLight = new THREE.DirectionalLight(0x6b8cff, 1.2);
    rimLight.position.set(-10, 5, -10);
    rimLight.name = 'rimLight'; // Add name for identification
    scene.add(rimLight);
    
    // Add colored point light for front highlight - this will move with mouse
    const frontLight = new THREE.PointLight(glowColor, 3, 60);
    frontLight.position.set(0, 0, 20);
    frontLight.name = 'frontLight'; // Add name for identification
    scene.add(frontLight);
    
    // Add a subtle floor light
    const bottomLight = new THREE.PointLight(0x3366ff, 1.5, 40);
    bottomLight.position.set(0, -20, 10);
    bottomLight.name = 'bottomLight'; // Add name for identification
    scene.add(bottomLight);
    
    // Add dramatic spotlight for enhanced Z-axis depth
    const spotlight = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 6, 0.5, 1);
    spotlight.position.set(0, 30, 20);
    spotlight.target.position.set(0, 0, 0);
    spotlight.name = 'spotlight'; // Add name for identification
    
    if (enableShadows) {
      spotlight.castShadow = true;
      spotlight.shadow.mapSize.width = 1024;
      spotlight.shadow.mapSize.height = 1024;
    }
    
    scene.add(spotlight);
    scene.add(spotlight.target);
    
    // Add subtle colored light from side for more dimension
    const sideLight = new THREE.PointLight(
      new THREE.Color(glowColor).offsetHSL(0.2, 0, 0).getHex(), 
      1.5, 
      50
    );
    sideLight.position.set(15, 2, 5);
    sideLight.name = 'sideLight'; // Add name for identification
    scene.add(sideLight);
  }
  
  async function createCard() {
    // Create a group for all card components
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);
    
    // Improved card geometry with beveled edges
    const cardGeometry = materialType === 'holographic' 
      ? new THREE.BoxGeometry(20, 30, cardThickness, 32, 32, 4) // Higher segment count for better effects
      : new THREE.BoxGeometry(20, 30, cardThickness);
    
    // Create material based on type with enhanced properties
    let material;
    
    switch (materialType) {
      case 'physical':
        material = new THREE.MeshPhysicalMaterial({
          color: cardColor,
          roughness: 0.15, // More polished look
          metalness: 0.2,
          clearcoat: 1.0, // Stronger clearcoat
          clearcoatRoughness: 0.1,
          reflectivity: 1.0,
          side: THREE.DoubleSide,
          envMapIntensity: 0.8
        });
        break;
      case 'toon':
        material = new THREE.MeshToonMaterial({
          color: cardColor,
          side: THREE.DoubleSide,
          gradientMap: createToonGradient()
        });
        break;
      case 'holographic':
        // Enhanced holographic material with more vibrant effects and mouse responsiveness
        const vertexShader = `
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `;
        
        const fragmentShader = `
          uniform float time;
          uniform vec3 baseColor;
          uniform vec2 mouseInfluence;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          
          // Improved noise function
          float noise(vec2 p) {
            return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          // Better smooth noise with domain warping
          float smoothNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            
            // Smoothstep for smoother interpolation
            vec2 u = f * f * (3.0 - 2.0 * f);
            
            float a = noise(i);
            float b = noise(i + vec2(1.0, 0.0));
            float c = noise(i + vec2(0.0, 1.0));
            float d = noise(i + vec2(1.0, 1.0));
            
            return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
          }
          
          // Domain warping for complex patterns
          float warpedNoise(vec2 p) {
            vec2 warped = p + vec2(
              smoothNoise(p + vec2(0.0, time * 0.1)) * 2.0,
              smoothNoise(p + vec2(time * 0.13, 0.0)) * 2.0
            );
            return smoothNoise(warped);
          }
          
          void main() {
            // Enhanced holographic effect with mouse influence
            float fresnel = dot(normalize(vViewPosition), vNormal);
            fresnel = pow(clamp(1.0 - fresnel, 0.0, 1.0), 3.0); // Stronger fresnel
            
            // Mouse influence warps the UV coordinates for dynamic effect
            vec2 warpedUv = vUv + vec2(
              mouseInfluence.x * 0.1 * sin(vUv.y * 10.0),
              mouseInfluence.y * 0.1 * cos(vUv.x * 10.0)
            );
            
            // More vibrant rainbow colors with dynamic shifts
            // Base rainbow
            vec3 rainbowColor = 0.5 + 0.5 * cos(time * 0.2 + warpedUv.xyx * 15.0 + vec3(0,2,4));
            
            // Add mouse-influenced color shift
            rainbowColor = mix(
              rainbowColor,
              0.5 + 0.5 * cos(time * 0.3 + mouseInfluence.x * 3.0 + warpedUv.xyx * 12.0 + vec3(1,3,5)),
              length(mouseInfluence) * 0.3
            );
            
            // Dynamic noise pattern with mouse influence
            float noise1 = warpedNoise(warpedUv * 12.0 + time * 0.1);
            float noise2 = warpedNoise(warpedUv * 18.0 - time * 0.15);
            // Use mouse to blend between noise patterns
            float blendFactor = 0.5 + mouseInfluence.x * 0.3;
            float noisePattern = mix(noise1, noise2, blendFactor) * 0.2;
            
            // Add radial pattern from mouse position
            vec2 mouseUvDist = warpedUv - vec2(0.5 + mouseInfluence.x * 0.2, 0.5 + mouseInfluence.y * 0.2);
            float mouseDistance = length(mouseUvDist);
            float radialPattern = sin((mouseDistance * 25.0 - time * 2.0) * (1.0 + length(mouseInfluence))) * 0.05;
            
            // Add some holographic lines that respond to mouse
            float lineFreq = 30.0 + mouseInfluence.y * 10.0;
            float linePhase = time * 0.1 + mouseInfluence.x * 0.5;
            float lines = step(0.98, fract(warpedUv.y * lineFreq + linePhase));
            
            // Add diagonal lines influenced by mouse
            float diagFreq = 25.0 + length(mouseInfluence) * 15.0;
            float diag = step(0.97, fract((warpedUv.x + warpedUv.y) * diagFreq - time * 0.2));
            
            // Mix all effects
            vec3 finalColor = mix(baseColor, rainbowColor, fresnel * 0.9);
            finalColor += vec3(lines * 0.15); // Add lines
            finalColor += vec3(diag * 0.1);   // Add diagonal lines
            finalColor += vec3(radialPattern); // Add radial pattern
            finalColor += vec3(noisePattern);  // Add noise pattern
            
            // Add subtle pulse effect
            finalColor *= 1.0 + sin(time * 3.0) * 0.05;
            
            // Enhanced transparency based on viewing angle for edge glow
            float alpha = 0.95 - fresnel * 0.1;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `;
        
        material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            baseColor: { value: new THREE.Color(cardColor) },
            mouseInfluence: { value: new THREE.Vector2(0, 0) }
          },
          vertexShader,
          fragmentShader,
          side: THREE.DoubleSide,
          transparent: true
        });
        break;
      default: // standard with improved properties
        material = new THREE.MeshStandardMaterial({
          color: cardColor,
          roughness: 0.4,
          metalness: 0.3,
          side: THREE.DoubleSide,
          envMapIntensity: 0.7
        });
    }
    
    // Create card mesh
    cardMesh = new THREE.Mesh(cardGeometry, material);
    cardMesh.castShadow = enableShadows;
    cardMesh.receiveShadow = enableShadows;
    cardGroup.add(cardMesh);
    
    // Store original positions for animation
    originalPositions.card = cardMesh.position.clone();
    
    // Add image if provided
    if (imageSrc) {
      await addImageToCard(cardGroup);
    }
    
    // Store the card group
    cardLayers.push(cardGroup);
  }
  
  // Helper function to create toon gradient for toon material
  function createToonGradient() {
    if (!THREE) return null;
    
    const texture = new THREE.DataTexture(new Uint8Array([0, 128, 255]), 3, 1, THREE.LuminanceFormat);
    texture.needsUpdate = true;
    return texture;
  }
  
  async function addImageToCard(cardGroup) {
    return new Promise((resolve) => {
      textureLoader.load(imageSrc, (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        const imageWidth = 19;
        const imageHeight = imageWidth / aspectRatio;
        
        const imageGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
        const imageMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true
        });
        
        imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
        imageMesh.position.z = cardThickness / 2 + 0.01;
        imageMesh.position.y = 5; // Position at the top of the card
        
        cardGroup.add(imageMesh);
        
        // Store original position
        originalPositions.image = imageMesh.position.clone();
        resolve();
      });
    });
  }
  
  function createParticleBackground() {
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 100;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 100;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 100 - 50; // Push particles behind the card
      
      particleSizes[i] = Math.random() * 2 + 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // Custom shader material for more advanced particles
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = mix(
          vec3(0.1, 0.1, 0.3),
          vec3(0.4, 0.3, 0.8),
          sin(position.x * 0.1 + time) * 0.5 + 0.5
        );
        
        vec3 pos = position;
        // Gentle movement animation
        pos.x += sin(time * 0.1 + position.z * 0.5) * 2.0;
        pos.y += cos(time * 0.1 + position.x * 0.5) * 2.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    
    const fragmentShader = `
      varying vec3 vColor;
      
      void main() {
        // Create a circular particle
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (length(coord) > 0.5) discard;
        
        gl_FragColor = vec4(vColor, 1.0 - length(coord) * 1.5);
      }
    `;
    
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
  }
  
  function createEnvironmentMap() {
    const envMapTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/2294472375_24a3b8ef46_o.jpg');
    envMapTexture.mapping = THREE.EquirectangularReflectionMapping;
    
    scene.environment = envMapTexture;
    if (materialType !== 'holographic') {
      scene.background = envMapTexture;
    }
  }
  
  function setupPostProcessing() {
    // Enhanced post-processing setup for more dramatic visuals
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // Add improved bloom effect if enabled
    if (glowEffect) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        glowStrength * 0.8,  // strength
        0.4,                 // radius
        0.85                 // threshold - slightly higher for more focused glow
      );
      
      // Customize bloom settings for different material types
      if (materialType === 'holographic') {
        bloomPass.strength = glowStrength * 1.2;
        bloomPass.radius = 0.5;
        bloomPass.threshold = 0.7;
      } else if (materialType === 'physical') {
        bloomPass.strength = glowStrength * 0.9;
        bloomPass.radius = 0.35;
        bloomPass.threshold = 0.8;
      }
      
      composer.addPass(bloomPass);
    }
    
    // Add custom shader pass for enhanced effects with more dramatic chromatic aberration
    const customShaderPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        vignetteIntensity: { value: 0.8 },
        chromaticAberration: { value: 0.003 },
        mousePosition: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float vignetteIntensity;
        uniform float chromaticAberration;
        uniform vec2 mousePosition;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          
          // Enhanced dynamic chromatic aberration based on mouse position
          float mouseInfluence = length(mousePosition) * 0.5;
          float dynamicAberration = chromaticAberration * (1.0 + mouseInfluence);
          
          // Direction of the aberration based on mouse position
          vec2 aberrationDir = normalize(vec2(mousePosition.x, mousePosition.y) + vec2(0.001));
          
          // Sample textures with dynamic offset
          vec4 cr = texture2D(tDiffuse, uv + aberrationDir * dynamicAberration);
          vec4 cg = texture2D(tDiffuse, uv);
          vec4 cb = texture2D(tDiffuse, uv - aberrationDir * dynamicAberration);
          
          // Enhanced vignette effect with mouse influence
          float distFromCenter = length((uv - 0.5) * 2.0);
          float vignette = smoothstep(0.0, vignetteIntensity, 1.0 - distFromCenter);
          
          // Add subtle pulsing
          float pulse = 1.0 + sin(time * 2.0) * 0.03;
          
          // Add subtle color shift based on mouse position
          vec3 tint = vec3(1.0 + mousePosition.x * 0.1, 1.0 + mousePosition.y * 0.1, 1.0 - length(mousePosition) * 0.1);
          
          vec4 finalColor = vec4(cr.r, cg.g, cb.b, cg.a);
          finalColor.rgb *= vignette * pulse * tint; // Apply all effects
          
          // Add subtle grain
          float grain = fract(sin(dot(uv * time, vec2(12.9898, 78.233))) * 43758.5453);
          finalColor.rgb += (grain - 0.5) * 0.015;
          
          gl_FragColor = finalColor;
        }
      `
    });
    composer.addPass(customShaderPass);
    
    // Store the shader pass to update uniforms later
    composer.customShaderPass = customShaderPass;
  }
  
  // Function to dynamically adjust camera based on mouse position
  function updateCamera(delta) {
    if (!camera) return;
    
    if (isHovering) {
      // Dynamic Field of View adjustment based on mouse movement
      // When mouse moves, slightly decrease FOV for zoom effect
      const baseFOV = 40;
      const targetFOV = baseFOV - (Math.abs(mousePosition.x) + Math.abs(mousePosition.y)) * 2;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, delta * 3);
      
      // Subtle camera position adjustment based on mouse
      // Opposite movement creates parallax effect
      const targetX = -mousePosition.x * 0.5;
      const targetY = -mousePosition.y * 0.5;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 2);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 2);
      
      // Focus distance adjustment - move slightly closer when hovering
      const baseZ = 40;
      const targetZ = baseZ - Math.abs(mousePosition.y) * 2;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 2);
      
      camera.updateProjectionMatrix();
    } else {
      // Reset camera position when not hovering
      camera.fov = THREE.MathUtils.lerp(camera.fov, 40, delta * 3);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 2);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, delta * 2);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 40, delta * 2);
      camera.updateProjectionMatrix();
    }
  }
  
  function animate() {
    animationFrame = requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    // Update camera with dynamic effects
    updateCamera(delta);
    
    // Update shader uniforms for all passes
    if (composer) {
      composer.passes.forEach(pass => {
        if (pass.uniforms) {
          if (pass.uniforms.time) {
            pass.uniforms.time.value = elapsedTime;
          }
          
          // Update mouse position in shader if available
          if (pass.uniforms.mousePosition) {
            pass.uniforms.mousePosition.value.set(mousePosition.x, mousePosition.y);
          }
          
          // Update dynamic chromatic aberration based on interactivity
          if (pass.uniforms.chromaticAberration && isHovering) {
            // Increase chromatic aberration when hovering
            const baseValue = 0.003;
            const hoverBoost = 0.002 * interactivityLevel;
            pass.uniforms.chromaticAberration.value = baseValue + hoverBoost;
          }
        }
      });
    }
    
    // Update holographic material if used
    if (materialType === 'holographic' && cardMesh && cardMesh.material && cardMesh.material.uniforms) {
      cardMesh.material.uniforms.time.value = elapsedTime;
      
      // Add mouse influence to holographic effect if mouse position exists
      if (cardMesh.material.uniforms.mouseInfluence) {
        cardMesh.material.uniforms.mouseInfluence.value.set(mousePosition.x, mousePosition.y);
      }
    }
    
    // Update particle animations
    if (particleSystem && particleSystem.material.uniforms) {
      particleSystem.material.uniforms.time.value = elapsedTime;
      
      // Make particles react to mouse movement
      if (isHovering && interactiveBackground) {
        const particlePositions = particleSystem.geometry.attributes.position;
        const count = particlePositions.count;
        
        // Update particle positions based on mouse
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const x = particlePositions.array[i3];
          const y = particlePositions.array[i3 + 1];
          
          // Calculate distance from mouse position projected to world space
          const mouseWorldX = mousePosition.x * 20;
          const mouseWorldY = mousePosition.y * 20;
          const dx = x - mouseWorldX;
          const dy = y - mouseWorldY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Apply subtle forces to particles near mouse
          if (dist < 15) {
            const force = (1 - dist / 15) * 0.2 * interactivityLevel;
            particlePositions.array[i3] += dx * force;
            particlePositions.array[i3 + 1] += dy * force;
            // Move particles slightly toward camera for depth effect
            particlePositions.array[i3 + 2] += force * 2;
          }
        }
        
        particlePositions.needsUpdate = true;
      }
    }
    
    // Update dynamic lighting based on mouse position
    if (scene && isHovering) {
      scene.traverse(object => {
        if (object.isLight) {
          // Different lights respond differently to mouse
          if (object.name === 'frontLight') {
            // Front light follows mouse closely
            const targetX = mousePosition.x * 10;
            const targetY = mousePosition.y * 10;
            object.position.x = THREE.MathUtils.lerp(object.position.x, targetX, delta * 3);
            object.position.y = THREE.MathUtils.lerp(object.position.y, targetY, delta * 3);
          } 
          else if (object.name === 'rimLight') {
            // Rim light moves opposite to mouse for dramatic backlighting
            const targetX = -mousePosition.x * 15;
            const targetY = -mousePosition.y * 5;
            object.position.x = THREE.MathUtils.lerp(object.position.x, targetX, delta * 2);
            object.position.y = THREE.MathUtils.lerp(object.position.y, targetY, delta * 2);
          }
          else if (object.name === 'spotlight') {
            // Spotlight follows mouse with delay
            const targetX = mousePosition.x * 8;
            const targetY = mousePosition.y * 8 + 30; // Maintain height
            object.position.x = THREE.MathUtils.lerp(object.position.x, targetX, delta * 1.5);
            object.position.y = THREE.MathUtils.lerp(object.position.y, targetY, delta * 1.5);
            
            // Move spotlight target with mouse for dynamic lighting angle
            if (object.target) {
              object.target.position.x = mousePosition.x * 3;
              object.target.position.y = mousePosition.y * 3;
              object.target.updateMatrixWorld();
            }
          }
        }
      });
    }
    
    // Handle hover animations
    updateHoverEffects(delta, elapsedTime);
    
    // Render
    if (composer) {
      composer.render();
    } else if (renderer) {
      renderer.render(scene, camera);
    }
    
    // Update controls if enabled
    if (controls) controls.update();
  }
  
  function updateHoverEffects(delta, elapsedTime) {
    if (!cardMesh) return;
    
    if (isHovering) {
      // Different hover effects based on setting
      switch (hoverEffect) {
        case 'tilt':
          // Calculate tilt based on mouse position with enhanced Z-movement
          const targetRotationX = -mousePosition.y * (maxTiltAngle * Math.PI / 180);
          const targetRotationY = mousePosition.x * (maxTiltAngle * Math.PI / 180);
          
          // Enhanced Z-axis movement - bring card closer to viewer when hovering
          const targetPositionZ = 4 * interactivityLevel; // Move forward on Z-axis when hovering
          
          // Smooth interpolation for more natural movement
          cardMesh.rotation.x = THREE.MathUtils.lerp(cardMesh.rotation.x, targetRotationX, delta * 5 * animationSpeed);
          cardMesh.rotation.y = THREE.MathUtils.lerp(cardMesh.rotation.y, targetRotationY, delta * 5 * animationSpeed);
          cardMesh.position.z = THREE.MathUtils.lerp(cardMesh.position.z, targetPositionZ, delta * 4 * animationSpeed);
          
          // Apply similar effects to other card elements if they exist
          if (imageMesh) {
            // Push image slightly further out for enhanced depth effect
            imageMesh.position.z = cardThickness / 2 + 0.2 + (mousePosition.y * 0.5 * interactivityLevel);
          }
          
          // Enhanced lighting response - move lights with mouse for dynamic highlights
          if (scene) {
            scene.traverse(object => {
              if (object.isPointLight) {
                const lightX = mousePosition.x * 10 * interactivityLevel;
                const lightY = mousePosition.y * 10 * interactivityLevel;
                object.position.x = THREE.MathUtils.lerp(object.position.x, lightX, delta * 2);
                object.position.y = THREE.MathUtils.lerp(object.position.y, lightY, delta * 2);
              }
            });
          }
          break;
          
        case 'float':
          // Enhanced floating animation with Z-axis movement
          const floatOffset = Math.sin(elapsedTime * 1.5 * animationSpeed) * floatHeight * 0.1;
          const hoverHeight = floatHeight * 0.2 * interactivityLevel;
          
          // Combine sine wave animation with mouse-based positioning
          cardMesh.position.y = originalPositions.card.y + floatOffset + hoverHeight;
          
          // Add Z-axis movement based on mouse position
          cardMesh.position.z = originalPositions.card.z + (2 * interactivityLevel) + (mousePosition.y * 2 * interactivityLevel);
          
          // Gentle rotation based on mouse movement
          cardMesh.rotation.x = THREE.MathUtils.lerp(
            cardMesh.rotation.x, 
            -mousePosition.y * (maxTiltAngle * 0.5 * Math.PI / 180),
            delta * 3 * animationSpeed
          );
          cardMesh.rotation.y = THREE.MathUtils.lerp(
            cardMesh.rotation.y, 
            mousePosition.x * (maxTiltAngle * 0.5 * Math.PI / 180),
            delta * 3 * animationSpeed
          );
          break;
          
        case 'explode':
          // Enhanced explode effect with dynamic mouse-based positioning
          if (imageMesh) {
            // Z-axis movement based on mouse position
            const zOffset = 1.5 + (mousePosition.y * 2 * interactivityLevel);
            const xOffset = mousePosition.x * 3 * interactivityLevel;
            const yOffset = -mousePosition.y * 2 * interactivityLevel;
            
            // Move image away from card dynamically
            imageMesh.position.z = cardThickness / 2 + zOffset;
            imageMesh.position.x = xOffset;
            imageMesh.position.y = originalPositions.image.y + yOffset;
            
            // Add subtle rotation to image based on mouse movement
            imageMesh.rotation.x = mousePosition.y * 0.3;
            imageMesh.rotation.y = -mousePosition.x * 0.3;
          }
          
          // Add dynamic card movement too
          cardMesh.position.z = originalPositions.card.z + (mousePosition.y * interactivityLevel);
          cardMesh.rotation.x = -mousePosition.y * (maxTiltAngle * 0.3 * Math.PI / 180);
          cardMesh.rotation.y = mousePosition.x * (maxTiltAngle * 0.3 * Math.PI / 180);
          break;
          
        case 'morph':
          // Enhanced morphing effect with vertex manipulation
          if (cardMesh.geometry && cardMesh.geometry.attributes && cardMesh.geometry.attributes.position) {
            const positions = cardMesh.geometry.attributes.position;
            const count = positions.count;
            
            // Only manipulate vertices if not done in this frame
            if (cardMesh.geometry.userData.originalPositions) {
              const origPositions = cardMesh.geometry.userData.originalPositions;
              
              // Use mouse position to influence the morphing
              const morphStrength = 0.2 * interactivityLevel;
              const morphFrequency = elapsedTime * 2 * animationSpeed;
              
              // Dynamically modify vertices based on mouse and time
              for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const x = origPositions[i3];
                const y = origPositions[i3 + 1];
                const z = origPositions[i3 + 2];
                
                // Create wave effect influenced by mouse position
                const waveX = Math.sin(x * 2 + morphFrequency) * morphStrength * (1 + mousePosition.x);
                const waveY = Math.cos(y * 2 + morphFrequency) * morphStrength * (1 + mousePosition.y);
                const waveZ = Math.sin(x * y + morphFrequency) * morphStrength;
                
                positions.array[i3] = x + waveX;
                positions.array[i3 + 1] = y + waveY;
                positions.array[i3 + 2] = z + waveZ;
              }
              
              positions.needsUpdate = true;
            } else {
              // Store original positions if not already stored
              const origPositions = new Float32Array(positions.array.length);
              for (let i = 0; i < positions.array.length; i++) {
                origPositions[i] = positions.array[i];
              }
              cardMesh.geometry.userData.originalPositions = origPositions;
            }
          }
          
          // Add dynamic Z-movement and rotation
          cardMesh.position.z = originalPositions.card.z + (mousePosition.y * 2 * interactivityLevel);
          cardMesh.rotation.x = -mousePosition.y * (maxTiltAngle * 0.2 * Math.PI / 180);
          cardMesh.rotation.y = mousePosition.x * (maxTiltAngle * 0.2 * Math.PI / 180);
          break;
      }
    } else {
      // Return to original state with smooth animation
      if (cardMesh) {
        cardMesh.rotation.x = THREE.MathUtils.lerp(cardMesh.rotation.x, 0, delta * 3);
        cardMesh.rotation.y = THREE.MathUtils.lerp(cardMesh.rotation.y, 0, delta * 3);
        cardMesh.position.x = THREE.MathUtils.lerp(cardMesh.position.x, originalPositions.card.x, delta * 3);
        cardMesh.position.y = THREE.MathUtils.lerp(cardMesh.position.y, originalPositions.card.y, delta * 3);
        cardMesh.position.z = THREE.MathUtils.lerp(cardMesh.position.z, originalPositions.card.z, delta * 3);
      }
      
      if (imageMesh) {
        imageMesh.rotation.x = THREE.MathUtils.lerp(imageMesh.rotation.x, 0, delta * 3);
        imageMesh.rotation.y = THREE.MathUtils.lerp(imageMesh.rotation.y, 0, delta * 3);
        imageMesh.position.x = THREE.MathUtils.lerp(imageMesh.position.x, originalPositions.image.x, delta * 3);
        imageMesh.position.y = THREE.MathUtils.lerp(imageMesh.position.y, originalPositions.image.y, delta * 3);
        imageMesh.position.z = THREE.MathUtils.lerp(imageMesh.position.z, cardThickness / 2 + 0.01, delta * 3);
      }
      
      // Reset any morphed geometry
      if (hoverEffect === 'morph' && cardMesh.geometry && cardMesh.geometry.userData.originalPositions) {
        const positions = cardMesh.geometry.attributes.position;
        const origPositions = cardMesh.geometry.userData.originalPositions;
        
        // Smoothly interpolate back to original shape
        for (let i = 0; i < positions.count * 3; i++) {
          positions.array[i] = THREE.MathUtils.lerp(positions.array[i], origPositions[i], delta * 3);
        }
        
        positions.needsUpdate = true;
      }
    }
  }
  
  // Events handlers with improved responsiveness
  function handleMouseEnter() {
    isHovering = true;
    dispatchEvent('hoverchange', { hovering: true });
  }
  
  function handleMouseLeave() {
    isHovering = false;
    // Reset mouse position gradually to create a smooth transition
    const resetAnimation = () => {
      mousePosition.x = mousePosition.x * 0.8;
      mousePosition.y = mousePosition.y * 0.8;
      
      // Stop animation when values are close enough to zero
      if (Math.abs(mousePosition.x) > 0.001 || Math.abs(mousePosition.y) > 0.001) {
        requestAnimationFrame(resetAnimation);
      }
    };
    
    resetAnimation();
    dispatchEvent('hoverchange', { hovering: false });
  }
  
  function handleMouseMove(event) {
    if (!container) return;
    
    // Get container bounds
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position relative to center of container
    // The multiplier affects sensitivity - higher number = more responsive
    const sensitivity = 1 + interactivityLevel * 0.7; // Adjusted based on interactivity level
    
    // Calculate relative x and y coordinates (-1 to 1)
    // Using a curve function for more dynamic movement
    const relativeX = -1 + (2 * (event.clientX - rect.left) / rect.width);
    const relativeY = 1 - (2 * (event.clientY - rect.top) / rect.height);
    
    // Apply easing curve for more natural movement
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    // Apply easing curve to relative mouse position for more dynamic response
    const x = Math.sign(relativeX) * easeInOutCubic(Math.min(Math.abs(relativeX), 1)) * sensitivity;
    const y = Math.sign(relativeY) * easeInOutCubic(Math.min(Math.abs(relativeY), 1)) * sensitivity;
    
    // Apply smooth interpolation to mouse position for more natural movement
    mousePosition.x = mousePosition.x * 0.85 + x * 0.15;
    mousePosition.y = mousePosition.y * 0.85 + y * 0.15;
    
    // Dispatch mouse position for potential use in parent components
    dispatchEvent('mousemove', { x: mousePosition.x, y: mousePosition.y });
  }
  
  function handleResize() {
    if (!container || !camera || !renderer) return;
    
    const newWidth = container.clientWidth || width;
    const newHeight = container.clientHeight || height;
    
    // Update camera
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer and composer
    renderer.setSize(newWidth, newHeight);
    if (composer) composer.setSize(newWidth, newHeight);
  }
  
  // Lifecycle functions
  onMount(async () => {
    await tick(); // Ensure DOM is ready
    
    // Load Three.js libraries
    threejsLoaded = await loadThreeJS();
    
    if (threejsLoaded) {
      await initThreeJS();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      // Dispose resources to prevent memory leaks
      if (renderer) renderer.dispose();
      if (scene) {
        scene.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  });
</script>

<div 
  class="three-card-wrapper {className}" 
  style="{cardStyle}"
  bind:this={container}
  on:mouseenter={handleMouseEnter}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
>
  <!-- Loading Message -->
  {#if !threejsLoaded}
    <div class="loading-message">
      {#if loadingError}
        <div class="error">
          <p>{loadingError}</p>
          <p class="install-instructions">Run: npm install three</p>
        </div>
      {:else}
        <div class="loading">
          <p>Loading 3D card...</p>
          <div class="spinner"></div>
        </div>
      {/if}
    </div>
  {/if}
  
  <canvas bind:this={canvas} class="three-canvas"></canvas>
  
  <!-- Overlay content -->
  <div class="content-overlay">
    <slot name="overlay" {isHovering}></slot>
  </div>
  
  <!-- Default slot -->
  <slot {isHovering}></slot>
</div>

<style>
  .three-card-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 1.2rem;
    overflow: visible !important;
    background: linear-gradient(145deg, #1e293b, #0f172a);
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3),
                0 20px 60px -10px rgba(0, 0, 0, 0.2),
                inset 0 1px 1px rgba(255, 255, 255, 0.05),
                inset 0 -1px 1px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.5s ease;
  }
  
  .three-card-wrapper:hover {
    box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.4),
                0 30px 70px -10px rgba(0, 0, 0, 0.3),
                inset 0 1px 1px rgba(255, 255, 255, 0.07),
                inset 0 -1px 1px rgba(0, 0, 0, 0.15);
  }
  
  .three-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 1.2rem;
    z-index: 1;
    outline: none;
    backdrop-filter: blur(8px);
  }
  
  .content-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    border-radius: 1.2rem;
    overflow: hidden;
  }
  
  .loading-message {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    color: white;
    background: linear-gradient(145deg, #1e293b, #0f172a);
    border-radius: 1.2rem;
    text-align: center;
    padding: 1.5rem;
    box-shadow: inset 0 0 100px rgba(78, 81, 212, 0.15);
  }
  
  .error {
    color: #f87171;
    font-size: 0.875rem;
    animation: fadeIn 0.5s ease;
    background: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(248, 113, 113, 0.3);
    max-width: 90%;
  }
  
  .install-instructions {
    margin-top: 0.8rem;
    padding: 0.6rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.5rem;
    font-family: monospace;
    font-size: 0.8rem;
    color: #fbbf24;
    border-left: 3px solid rgba(251, 191, 36, 0.5);
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.3s ease;
  }
  
  .loading p {
    margin-bottom: 1.2rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .spinner {
    width: 2.2rem;
    height: 2.2rem;
    border: 2px solid rgba(129, 140, 248, 0.1);
    border-top-color: #818cf8;
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.76, 0.35, 0.2, 0.7) infinite;
    box-shadow: 0 0 15px rgba(129, 140, 248, 0.3);
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style> 