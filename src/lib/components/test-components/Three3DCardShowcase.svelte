<script>
  import { onMount } from 'svelte';
  import Three3DCard from './Three3DCard.svelte';
  
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
  
  // Installation instructions
  const installInstructions = {
    npm: 'npm install three',
    yarn: 'yarn add three',
    pnpm: 'pnpm add three',
    docker: 'Add "three": "^0.155.0" to your package.json\nRun: docker compose build'
  };
  
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
  
  // Handle three.js availability
  let threeJsAvailable = false;
  
  onMount(() => {
    // We'll check three.js availability through the global window object
    // This avoids Vite trying to resolve the import during build
    if (typeof window !== 'undefined') {
      // The Three3DCard component will handle the dynamic import internally
      // We can just set threeJsAvailable to true by default
      // The card will show a loading or error state if needed
      threeJsAvailable = true;
    }
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 py-12 px-4">
  <!-- Hero Section with enhanced styling -->
  <div class="container mx-auto mb-16">
    <h1 class="text-5xl font-bold text-center mb-4 text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-violet-600 drop-shadow-lg">
      Three.js Enhanced 3D Card
    </h1>
    <p class="text-center mb-6 max-w-2xl mx-auto text-white/90 text-lg leading-relaxed">
      Pushing the boundaries of web-based 3D interactions with WebGL rendering and advanced effects
    </p>
    <div class="flex justify-center gap-3 mb-12">
      <a href="#examples" class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-900/30 hover:shadow-indigo-800/40 hover:translate-y-[-2px]">
        View Demos
      </a>
      <a href="#controls" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20 backdrop-blur-sm shadow-lg shadow-black/10 hover:shadow-black/20 hover:translate-y-[-2px]">
        Interactive Controls
      </a>
    </div>
    
    {#if !threeJsAvailable}
      <div class="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6 max-w-2xl mx-auto mb-8 backdrop-blur-sm shadow-xl">
        <h3 class="text-amber-400 font-bold text-lg mb-3">Three.js not detected</h3>
        <p class="text-white/90 mb-5 leading-relaxed">To view the 3D card demos, you need to install Three.js:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-black/40 p-4 rounded-lg border border-white/5">
            <h4 class="text-white/90 font-medium text-sm mb-2 flex items-center">
              <span class="inline-block w-4 h-4 mr-2 bg-red-500 rounded-full"></span>Using npm:
            </h4>
            <pre class="bg-black/60 p-3 rounded-md text-amber-300 text-xs overflow-x-auto font-mono">{installInstructions.npm}</pre>
          </div>
          
          <div class="bg-black/40 p-4 rounded-lg border border-white/5">
            <h4 class="text-white/90 font-medium text-sm mb-2 flex items-center">
              <span class="inline-block w-4 h-4 mr-2 bg-blue-500 rounded-full"></span>Using yarn:
            </h4>
            <pre class="bg-black/60 p-3 rounded-md text-amber-300 text-xs overflow-x-auto font-mono">{installInstructions.yarn}</pre>
          </div>
          
          <div class="bg-black/40 p-4 rounded-lg border border-white/5">
            <h4 class="text-white/90 font-medium text-sm mb-2 flex items-center">
              <span class="inline-block w-4 h-4 mr-2 bg-orange-500 rounded-full"></span>Using pnpm:
            </h4>
            <pre class="bg-black/60 p-3 rounded-md text-amber-300 text-xs overflow-x-auto font-mono">{installInstructions.pnpm}</pre>
          </div>
          
          <div class="bg-black/40 p-4 rounded-lg border border-white/5">
            <h4 class="text-white/90 font-medium text-sm mb-2 flex items-center">
              <span class="inline-block w-4 h-4 mr-2 bg-cyan-500 rounded-full"></span>Using Docker:
            </h4>
            <pre class="bg-black/60 p-3 rounded-md text-amber-300 text-xs overflow-x-auto font-mono whitespace-pre-line">{installInstructions.docker}</pre>
          </div>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Main Showcase Card with enhanced styling -->
  <div id="examples" class="container mx-auto mb-24">
    <h2 class="text-3xl font-bold text-center mb-12 text-white drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-white">Interactive Demo</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <!-- Card display area with a more elegant container -->
      <div class="h-[500px] mx-auto w-full max-w-[350px] relative">
        <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
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
          className="relative z-10"
        >
          <div slot="overlay" let:isHovering class="card-content p-8 absolute inset-0 flex flex-col justify-end pointer-events-none">
            <!-- Title with shadow -->
            <div class="mb-2 transform transition-transform duration-300" 
                 style="transform: translateZ(30px) translateY({isHovering ? '-10px' : '0'});">
              <h3 class="text-2xl font-bold text-white drop-shadow-lg">{products[0].name}</h3>
            </div>
            
            <!-- Subtitle -->
            <div class="mb-4 transform transition-transform duration-300" 
                 style="transform: translateZ(20px) translateY({isHovering ? '-8px' : '0'}); transition-delay: 50ms;">
              <p class="text-white/90 text-sm font-medium drop-shadow-md">
                {products[0].subtitle}
              </p>
            </div>
            
            <!-- Description -->
            <div class="mb-6 transform transition-transform duration-300" 
                 style="transform: translateZ(15px) translateY({isHovering ? '-6px' : '0'}); transition-delay: 100ms;">
              <p class="text-white/80 text-xs drop-shadow-md">
                {products[0].description}
              </p>
            </div>
            
            <!-- Price -->
            <div class="mb-6 transform transition-transform duration-300" 
                 style="transform: translateZ(25px) translateY({isHovering ? '-12px' : '0'}); transition-delay: 150ms;">
              <div class="text-2xl font-bold text-white drop-shadow-lg">
                {formatCurrency(products[0].price)}
              </div>
            </div>
            
            <!-- Button -->
            <div class="relative transform transition-transform duration-300" 
                 style="transform: translateZ(40px) translateY({isHovering ? '-5px' : '0'}); transition-delay: 200ms;">
              <div class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 
                          text-white px-4 py-2 rounded-lg text-sm font-semibold 
                          shadow-xl relative z-10
                          border border-indigo-400/30 pointer-events-auto hover:brightness-110 transition-all">
                Explore
              </div>
            </div>
          </div>
        </Three3DCard>
      </div>
      
      <!-- Controls Panel with enhanced styling -->
      <div id="controls" class="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h3 class="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Interactive Controls</h3>
        
        <div class="space-y-6">
          <!-- Hover Effect Selection with improved button styles -->
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Hover Effect</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentHoverEffect === 'tilt' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                on:click={() => updateEffect('hoverEffect', 'tilt')}>
                Tilt
              </button>
              <button 
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentHoverEffect === 'float' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                on:click={() => updateEffect('hoverEffect', 'float')}>
                Float
              </button>
              <button 
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentHoverEffect === 'explode' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                on:click={() => updateEffect('hoverEffect', 'explode')}>
                Explode
              </button>
              <button 
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentHoverEffect === 'morph' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
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
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentMaterialType === 'standard' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                on:click={() => updateEffect('materialType', 'standard')}>
                Standard
              </button>
              <button 
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentMaterialType === 'physical' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                on:click={() => updateEffect('materialType', 'physical')}>
                Physical
              </button>
              <button 
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentMaterialType === 'toon' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                on:click={() => updateEffect('materialType', 'toon')}>
                Toon
              </button>
              <button 
                class="px-3 py-2 text-sm text-center rounded-lg transition-all shadow-md {currentMaterialType === 'holographic' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium' : 'bg-white/10 text-white/70 hover:bg-white/20'}"
                on:click={() => updateEffect('materialType', 'holographic')}>
                Holographic
              </button>
            </div>
          </div>
          
          <!-- Enhanced sliders with improved visual appearance -->
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
  
  <!-- Feature Comparison with enhanced styling -->
  <div class="container mx-auto mb-24">
    <h2 class="text-3xl font-bold text-center mb-12 text-white drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-white">CSS vs WebGL Comparison</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all">
        <h3 class="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">CSS 3D Transforms</h3>
        <ul class="space-y-2 text-white/80 text-sm list-disc pl-5">
          <li>Lightweight and better performance on less powerful devices</li>
          <li>No additional libraries required</li>
          <li>Limited to flat planes and simple transforms</li>
          <li>No true lighting, shadows, or reflections</li>
          <li>Easier to implement and debug</li>
          <li>Compatible with older browsers</li>
        </ul>
      </div>
      
      <div class="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all">
        <h3 class="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">WebGL with Three.js</h3>
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
  
  <!-- Call to Action with enhanced styling -->
  <div class="container mx-auto max-w-4xl bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-10 mb-24 shadow-2xl relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-white/10 bg-grid-8"></div>
    <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 blur-3xl"></div>
    <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">Ready to take your UI to the next dimension?</h2>
        <p class="text-white/90">Bring true 3D immersion to your web applications</p>
      </div>
      <div class="flex gap-4">
        <a href="#" class="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-white/20 hover:translate-y-[-2px]">
          Get Component
        </a>
        <a href="#" class="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-lg border border-white/20 transition-all hover:shadow-lg hover:shadow-indigo-900/30 hover:translate-y-[-2px]">
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
  
  /* Improved slider styles */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }
  
  input[type="range"]::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #4f46e5, #818cf8);
    border-radius: 0.5rem;
    height: 0.5rem;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -4px;
    background-color: #ffffff;
    border-radius: 50%;
    height: 1rem;
    width: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.1s ease;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
  
  input[type="range"]:focus {
    outline: none;
  }
  
  /* Background grid pattern */
  .bg-grid-white\/10 {
    mask-image: linear-gradient(to bottom, transparent, black, black, transparent);
  }
  
  .bg-grid-8 {
    background-size: 50px 50px;
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  }
</style> 