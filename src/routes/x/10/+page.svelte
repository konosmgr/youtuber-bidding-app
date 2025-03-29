<script>
    import { onMount } from 'svelte';
    import Three3DCard from '$lib/components/test-components/Three3DCard.svelte';
    import Three3DCardShowcase from '$lib/components/test-components/Three3DCardShowcase.svelte';
    
    // Track current effect settings
    let currentHoverEffect = 'tilt';
    let currentMaterialType = 'standard';
    let currentParticleEffect = false;
    let currentGlowEffect = true;
    let currentGlowStrength = 0.8;
    let currentBackgroundType = 'gradient';
    let currentCardThickness = 0.5;
    let currentAutoRotate = false;
    let currentInteractivityLevel = 0.8;
    
    // Sample products for showcasing
    const products = [
      {
        name: 'Quantum Neural Interface',
        subtitle: 'Next-Gen Brain-Computer Interface',
        description: 'Direct neural link with quantum encryption and AI assistance',
        price: 2499.99,
        image: 'https://images.unsplash.com/photo-1561883088-039e53143d73',
        color: '#5D3FD3',
        glowColor: '#8A6FFF'
      },
      {
        name: 'Holographic Projector X1',
        subtitle: 'Full-Room Projection System',
        description: '8K resolution with spatial audio and gesture controls',
        price: 1899.50,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
        color: '#00C6FF',
        glowColor: '#4DB6FF'
      },
      {
        name: 'Reality Augmentation Module',
        subtitle: 'Perception Enhancement Device',
        description: 'Overlay digital information on your visual field with haptic feedback',
        price: 3299.99,
        image: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be',
        color: '#FF5E94',
        glowColor: '#FF8FB4'
      }
    ];
    
    // Format currency
    function formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }
    
    function handleHoverChange(event) {
      console.log('Hover state changed:', event.detail.isHovering);
    }
    
    // Function to change effect settings
    function updateEffect(setting, value) {
      switch(setting) {
        case 'hoverEffect':
          currentHoverEffect = value;
          break;
        case 'materialType':
          currentMaterialType = value;
          break;
        case 'particleEffect':
          currentParticleEffect = value;
          break;
        case 'glowEffect':
          currentGlowEffect = value;
          break;
        case 'glowStrength':
          currentGlowStrength = parseFloat(value);
          break;
        case 'backgroundType':
          currentBackgroundType = value;
          break;
        case 'cardThickness':
          currentCardThickness = parseFloat(value);
          break;
        case 'autoRotate':
          currentAutoRotate = value;
          break;
        case 'interactivityLevel':
          currentInteractivityLevel = parseFloat(value);
          break;
      }
    }
    
    onMount(() => {
      // Any initialization code if needed
    });
  </script>
  
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-12 px-4">
    <!-- Hero Section -->
    <div class="container mx-auto mb-16">
      <h1 class="text-5xl font-bold text-center mb-4 text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600">
        Three.js Enhanced 3D Card
      </h1>
      <p class="text-center mb-4 max-w-2xl mx-auto text-white/80 text-lg">
        Pushing the boundaries of web-based 3D interactions with WebGL rendering and advanced effects
      </p>
      <div class="flex justify-center gap-2 mb-12">
        <a href="#examples" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all">
          View Demos
        </a>
        <a href="#controls" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20">
          Interactive Controls
        </a>
      </div>
    </div>
    
    <!-- Main Showcase Card -->
    <div id="examples" class="container mx-auto mb-24">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">Interactive Demo</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <!-- Card display area -->
        <div class="h-[500px] mx-auto w-full max-w-[350px]">
          <Three3DCard
            imageSrc={products[0].image}
            title={products[0].name}
            subtitle={products[0].subtitle}
            description={products[0].description}
            price={products[0].price}
            hoverEffect={currentHoverEffect}
            materialType={currentMaterialType}
            particleEffect={currentParticleEffect}
            glowEffect={currentGlowEffect}
            glowColor={products[0].glowColor}
            glowStrength={currentGlowStrength}
            backgroundType={currentBackgroundType}
            cardColor={products[0].color}
            cardThickness={currentCardThickness}
            autoRotate={currentAutoRotate}
            interactivityLevel={currentInteractivityLevel}
            on:hoverchange={handleHoverChange}
          >
            <div slot="overlay" let:isHovering class="card-content p-8 absolute inset-0 flex flex-col justify-end pointer-events-none">
              <!-- Title with shadow -->
              <div class="mb-2 transform transition-transform duration-300" 
                   style="transform: translateZ(30px) translateY({isHovering ? '-10px' : '0'});">
                <h3 class="text-2xl font-bold text-white">{products[0].name}</h3>
              </div>
              
              <!-- Subtitle -->
              <div class="mb-4 transform transition-transform duration-300" 
                   style="transform: translateZ(20px) translateY({isHovering ? '-8px' : '0'}); transition-delay: 50ms;">
                <p class="text-white/90 text-sm font-medium">
                  {products[0].subtitle}
                </p>
              </div>
              
              <!-- Description -->
              <div class="mb-6 transform transition-transform duration-300" 
                   style="transform: translateZ(15px) translateY({isHovering ? '-6px' : '0'}); transition-delay: 100ms;">
                <p class="text-white/80 text-xs">
                  {products[0].description}
                </p>
              </div>
              
              <!-- Price -->
              <div class="mb-6 transform transition-transform duration-300" 
                   style="transform: translateZ(25px) translateY({isHovering ? '-12px' : '0'}); transition-delay: 150ms;">
                <div class="text-2xl font-bold text-white">
                  {formatCurrency(products[0].price)}
                </div>
              </div>
              
              <!-- Button -->
              <div class="relative transform transition-transform duration-300" 
                   style="transform: translateZ(40px) translateY({isHovering ? '-5px' : '0'}); transition-delay: 200ms;">
                <div class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 
                            text-white px-4 py-2 rounded-lg text-sm font-semibold 
                            shadow-xl relative z-10
                            border border-indigo-400/30 pointer-events-auto">
                  Explore
                </div>
              </div>
            </div>
          </Three3DCard>
        </div>
        
        <!-- Controls Panel -->
        <div id="controls" class="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
          <h3 class="text-xl font-bold mb-6 text-indigo-400">Interactive Controls</h3>
          
          <div class="space-y-6">
            <!-- Hover Effect Selection -->
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">Hover Effect</label>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentHoverEffect === 'tilt' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('hoverEffect', 'tilt')}>
                  Tilt
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentHoverEffect === 'float' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('hoverEffect', 'float')}>
                  Float
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentHoverEffect === 'explode' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('hoverEffect', 'explode')}>
                  Explode
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentHoverEffect === 'morph' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('hoverEffect', 'morph')}>
                  Morph
                </button>
              </div>
            </div>
            
            <!-- Material Type Selection -->
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">Material Type</label>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentMaterialType === 'standard' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('materialType', 'standard')}>
                  Standard
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentMaterialType === 'physical' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('materialType', 'physical')}>
                  Physical
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentMaterialType === 'toon' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('materialType', 'toon')}>
                  Toon
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentMaterialType === 'holographic' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('materialType', 'holographic')}>
                  Holographic
                </button>
              </div>
            </div>
            
            <!-- Background Type -->
            <div>
              <label class="block text-sm font-medium text-white/80 mb-2">Background Type</label>
              <div class="grid grid-cols-2 gap-2">
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentBackgroundType === 'gradient' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('backgroundType', 'gradient')}>
                  Gradient
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentBackgroundType === 'particles' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('backgroundType', 'particles')}>
                  Particles
                </button>
                <button 
                  class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentBackgroundType === 'environment' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                  on:click={() => updateEffect('backgroundType', 'environment')}>
                  HDRI Environment
                </button>
              </div>
            </div>
            
            <!-- Toggle Effects -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Glow Effect</label>
                <div class="flex items-center">
                  <button 
                    class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentGlowEffect ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'} flex-1"
                    on:click={() => updateEffect('glowEffect', !currentGlowEffect)}>
                    {currentGlowEffect ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Auto Rotate</label>
                <div class="flex items-center">
                  <button 
                    class="px-3 py-2 text-sm text-center rounded-lg transition-all {currentAutoRotate ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'} flex-1"
                    on:click={() => updateEffect('autoRotate', !currentAutoRotate)}>
                    {currentAutoRotate ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Sliders -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Glow Strength: {currentGlowStrength.toFixed(1)}</label>
                <input type="range" min="0" max="2" step="0.1" value={currentGlowStrength}
                       on:input={(e) => updateEffect('glowStrength', e.target.value)}
                       class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Card Thickness: {currentCardThickness.toFixed(1)}</label>
                <input type="range" min="0.1" max="5" step="0.1" value={currentCardThickness}
                       on:input={(e) => updateEffect('cardThickness', e.target.value)}
                       class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-white/80 mb-2">Interactivity Level: {currentInteractivityLevel.toFixed(1)}</label>
                <input type="range" min="0.1" max="1" step="0.1" value={currentInteractivityLevel}
                       on:input={(e) => updateEffect('interactivityLevel', e.target.value)}
                       class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Feature Comparison -->
    <div class="container mx-auto mb-24">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">CSS vs WebGL Comparison</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
          <h3 class="text-xl font-bold mb-4 text-blue-400">CSS 3D Transforms</h3>
          <ul class="space-y-2 text-white/80 text-sm list-disc pl-5">
            <li>Lightweight and better performance on less powerful devices</li>
            <li>No additional libraries required</li>
            <li>Limited to flat planes and simple transforms</li>
            <li>No true lighting, shadows, or reflections</li>
            <li>Easier to implement and debug</li>
            <li>Compatible with older browsers</li>
          </ul>
        </div>
        
        <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
          <h3 class="text-xl font-bold mb-4 text-purple-400">WebGL with Three.js</h3>
          <ul class="space-y-2 text-white/80 text-sm list-disc pl-5">
            <li>True 3D rendering with realistic lighting and materials</li>
            <li>Shaders for advanced visual effects</li>
            <li>Particle systems and physics-based animations</li>
            <li>Post-processing effects like bloom and chromatic aberration</li>
            <li>Higher performance ceiling for complex scenes</li>
            <li>GPU acceleration for smoother animations</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Product Cards -->
    <div class="container mx-auto mb-24">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">Product Showcase</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        {#each products as product, i}
          <div class="h-[450px]">
            <Three3DCard
              imageSrc={product.image}
              title={product.name}
              subtitle={product.subtitle}
              description={product.description}
              price={product.price}
              hoverEffect={i === 0 ? 'tilt' : i === 1 ? 'float' : 'explode'}
              materialType={i === 0 ? 'standard' : i === 1 ? 'physical' : 'holographic'}
              glowColor={product.glowColor}
              cardColor={product.color}
              backgroundType={i === 2 ? 'particles' : 'gradient'}
              on:hoverchange={handleHoverChange}
            >
              <div slot="overlay" let:isHovering class="card-content p-6 absolute inset-0 flex flex-col justify-end pointer-events-none">
                <!-- Title -->
                <div class="mb-1 transform transition-transform duration-300" 
                     style="transform: translateZ(30px) translateY({isHovering ? '-10px' : '0'});">
                  <h3 class="text-xl font-bold text-white">{product.name}</h3>
                </div>
                
                <!-- Subtitle -->
                <div class="mb-3 transform transition-transform duration-300" 
                     style="transform: translateZ(20px) translateY({isHovering ? '-8px' : '0'}); transition-delay: 50ms;">
                  <p class="text-white/90 text-xs font-medium">
                    {product.subtitle}
                  </p>
                </div>
                
                <!-- Price -->
                <div class="mb-4 transform transition-transform duration-300" 
                     style="transform: translateZ(25px) translateY({isHovering ? '-12px' : '0'}); transition-delay: 150ms;">
                  <div class="text-xl font-bold text-white">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                
                <!-- Button -->
                <div class="relative transform transition-transform duration-300" 
                     style="transform: translateZ(40px) translateY({isHovering ? '-5px' : '0'}); transition-delay: 200ms;">
                  <div class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 
                              text-white px-3 py-1.5 rounded-lg text-xs font-semibold 
                              shadow-xl relative z-10 text-center
                              border border-indigo-400/30 pointer-events-auto">
                    View Details
                  </div>
                </div>
              </div>
            </Three3DCard>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Call to Action -->
    <div class="container mx-auto max-w-3xl bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 mb-24">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-2">Ready to take your UI to the next dimension?</h2>
          <p class="text-white/90">Bring true 3D immersion to your web applications</p>
        </div>
        <div class="flex gap-4">
          <a href="#" class="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-white/20">
            Get Component
          </a>
          <a href="#" class="px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg border border-white/20 transition-all hover:bg-indigo-800">
            Documentation
          </a>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    :global(body) {
      background-color: #0f172a;
      color: white;
      min-height: 100vh;
    }
    
    /* Make text crisper */
    h1, h2, h3, p, span, button {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Improve slider styles */
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
    }
    
    input[type="range"]::-webkit-slider-runnable-track {
      background: #4f46e5;
      border-radius: 0.5rem;
      height: 0.5rem;
    }
    
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      margin-top: -4px;
      background-color: #ffffff;
      border-radius: 50%;
      height: 1rem;
      width: 1rem;
    }
    
    input[type="range"]:focus {
      outline: none;
    }
  </style> 