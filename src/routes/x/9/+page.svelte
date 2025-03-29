<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Enhanced3DCard from '$lib/components/test-components/Enhanced3DCard.svelte';
  
  // Animation state
  let currentTime = 0;
  let animationFrame;
  let currentHoverCard = null;
  
  // Z-index layers for depth perception
  const zValues = {
    farBackground: -250,
    backgroundPattern: -200,
    backgroundGlow: -170,
    midBackground: -150,
    closeBackground: -120,
    imageBase: -90,
    imageForeground: -70,
    overlay: -50,
    glow: -40,
    badge: 40,
    badgeText: 45,
    container: 30,
    priceTag: 120,
    priceText: 130,
    title: 90,
    titleShadow: 85,
    subtitle: 70,
    specs: 60,
    specIcon: 65,
    button: 50,
    buttonText: 55,
    buttonGlow: 45,
    heartButton: 60,
    heartIcon: 65,
    floatingElements: 80
  };
  
  // Sample products to showcase different card styles
  const products = [
    {
      id: 'premium-card',
      name: 'Quantum Reality Renderer',
      subtitle: 'Limited Reality Processor',
      specs: [
        'Dimensional Stabilization', 
        'Reality Augmentation', 
        'Neural Interface'
      ],
      price: 2499.99,
      originalPrice: 3499.99,
      discount: '29% OFF',
      image: 'https://images.unsplash.com/photo-1741893041975-94a0e8656209?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      color: 'indigo',
      glowColor: '#818cf8',
      stock: 3
    },
    {
      id: 'minimal-card',
      name: 'Holographic Display',
      subtitle: 'Crystal Clear Rendering',
      specs: [
        '8K Resolution', 
        'Immersive Audio', 
        'Touch Controls'
      ],
      price: 1299.99,
      originalPrice: 1499.99,
      discount: '13% OFF',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      color: 'emerald',
      glowColor: '#34d399',
      stock: 12
    },
    {
      id: 'modern-card',
      name: 'Neural Interface',
      subtitle: 'Direct Consciousness Link',
      specs: [
        'Thought Control', 
        'Dream Recording', 
        'Cognitive Boost'
      ],
      price: 1899.99,
      originalPrice: 2199.99,
      discount: '14% OFF',
      image: 'https://images.unsplash.com/photo-1561883088-039e53143d73?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      color: 'rose',
      glowColor: '#fb7185',
      stock: 5
    }
  ];
  
  // Time-based animation
  function startTimeAnimation() {
    const animate = () => {
      currentTime += 0.01;
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }
  
  // Stop animation when component unmounts
  function stopTimeAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }
  
  // Handle hover state changes with card-specific effects
  function handleHoverChange(product) {
    return (event) => {
      if (event.detail.isHovering) {
        currentHoverCard = product.id;
        startTimeAnimation();
      } else {
        currentHoverCard = null;
        stopTimeAnimation();
      }
    };
  }
  
  // Custom animation functions
  function sineWave(time, amplitude = 10, frequency = 2) {
    return Math.sin(time * frequency) * amplitude;
  }
  
  function cosineWave(time, amplitude = 10, frequency = 2) {
    return Math.cos(time * frequency) * amplitude;
  }
  
  function breathingAnimation(time, min = 0.95, max = 1.05) {
    return min + ((Math.sin(time) + 1) / 2) * (max - min);
  }
  
  // Format currency
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  
  // Cleanup on unmount
  onMount(() => {
    return () => {
      stopTimeAnimation();
    };
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-12 px-4">
  <!-- Hero Section -->
  <div class="container mx-auto mb-16">
    <h1 class="text-5xl font-bold text-center mb-4 text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600">Enhanced 3D Card Component</h1>
    <p class="text-center mb-4 max-w-2xl mx-auto text-white/80 text-lg">
      A fully customizable 3D card component with advanced hover effects and depth transformations
    </p>
    <div class="flex justify-center gap-2 mb-12">
      <a href="#examples" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all">
        View Examples
      </a>
      <a href="#features" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20">
        Feature List
      </a>
    </div>
  </div>
  
  <!-- Premium Card Example -->
  <div id="examples" class="container mx-auto mb-24">
    <h2 class="text-3xl font-bold text-center mb-16 text-white">Showcase Examples</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
      {#each products as product, index}
        <div class="card-container h-[500px]" style="perspective: 2000px;">
          <Enhanced3DCard
            hoverZScale={1.5}
            initialScale={1}
            hoverScale={1.08}
            maxRotation={15}
            perspective={2000}
            transitionDuration={0.4}
            transitionEasing="cubic-bezier(0.23, 1, 0.32, 1)"
            cardStyle="border-radius: 1.25rem; overflow: visible;"
            on:hoverchange={handleHoverChange(product)}
          >
            <svelte:fragment slot="image">
              <img 
                src={product.image} 
                alt={product.name}
                class="w-full h-full object-cover rounded-xl brightness-95"
              />
            </svelte:fragment>
            
            <svelte:fragment slot="default" let:isHovering let:getItemStyle>
              <!-- Far background with subtle movement -->
              <div class="absolute inset-0 rounded-xl overflow-hidden"
                   style:transform={getItemStyle(zValues.farBackground, {
                     xOffset: isHovering ? sineWave(currentTime, 3, 0.5) : 0,
                     yOffset: isHovering ? cosineWave(currentTime, 3, 0.3) : 0,
                     customDuration: 8,
                     customEasing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                   }).transform}
                   style:transition={getItemStyle(zValues.farBackground).transition}>
                <div class="w-full h-full bg-gradient-to-br from-{product.color}-950 to-slate-900 rounded-xl"></div>
              </div>
              
              <!-- Animated glow background -->
              <div class="absolute inset-0 rounded-xl overflow-hidden"
                   style:transform={getItemStyle(zValues.backgroundGlow, {
                     scale: isHovering ? breathingAnimation(currentTime, 1, 1.2) : 1,
                     customDuration: 3,
                     customEasing: 'ease-in-out'
                   }).transform}
                   style:transition={getItemStyle(zValues.backgroundGlow).transition}>
                <div class="w-full h-full rounded-xl opacity-30" 
                     style="background: radial-gradient(circle at {50 + sineWave(currentTime, 15, 0.5)}% {50 + cosineWave(currentTime, 15, 0.7)}%, {product.glowColor} 0%, transparent 70%);">
                </div>
              </div>
              
              <!-- Gradient overlay with subtle animation -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-xl"
                   style:opacity={isHovering ? 0.7 : 0.8}
                   style:transform={getItemStyle(zValues.overlay, {
                     yOffset: isHovering ? 5 : 0,
                     customDuration: 0.6
                   }).transform}
                   style:transition="all 0.6s cubic-bezier(0.23, 1, 0.32, 1)"></div>
              
              <!-- Discount badge -->
              <div style:transform={getItemStyle(zValues.badge + 5, {
                     xOffset: isHovering ? sineWave(currentTime, 3, 3) * -1 : 0,
                     yOffset: isHovering ? -8 : 0,
                     customDuration: 0.4,
                     customEasing: "cubic-bezier(0.5, 2, 0.75, 1)"
                   }).transform}
                   style:transition={getItemStyle(zValues.badge + 5).transition}
                   class="absolute top-6 right-6">
                <span class="bg-{product.color}-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-{product.color}-500/30"
                      style:transform={isHovering ? `rotate(${sineWave(currentTime, 5, 5)}deg) scale(${1 + Math.sin(currentTime * 5) * 0.1})` : ''}>
                  {product.discount}
                </span>
              </div>
              
              <!-- Content container with staggered elements -->
              <div class="absolute inset-0 flex flex-col justify-end p-8"
                   style:transform={getItemStyle(zValues.container).transform}
                   style:transition={getItemStyle(zValues.container).transition}>
                
                <!-- Title with shadow and independent movement -->
                <div style:transform={getItemStyle(zValues.title, {
                       xOffset: isHovering ? 8 + sineWave(currentTime, 5, 1) : 0,
                       yOffset: isHovering ? -5 + cosineWave(currentTime, 3, 0.7) : 0,
                       customDuration: 0.5,
                       customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                     }).transform}
                     style:transition={getItemStyle(zValues.title).transition}
                     class="mb-2 relative">
                  <h3 class="text-2xl font-bold text-white text-shadow-sharp relative z-10">{product.name}</h3>
                </div>
                
                <!-- Subtitle with different timing and movement -->
                <div style:transform={getItemStyle(zValues.subtitle, {
                       xOffset: isHovering ? 12 + sineWave(currentTime, 3, 1.5) : 0,
                       yOffset: isHovering ? -2 + cosineWave(currentTime, 2, 0.5) : 0,
                       delay: 0.05,
                       customDuration: 0.6
                     }).transform}
                     style:transition={getItemStyle(zValues.subtitle).transition}
                     class="mb-6">
                  <p class="text-white/90 text-sm font-medium">
                    {product.subtitle}
                  </p>
                </div>
                
                <!-- Specs list with wave-like sequential animation -->
                <div style:transform={getItemStyle(zValues.specs, {
                       yOffset: isHovering ? -3 : 0,
                       delay: 0.1,
                       customDuration: 0.7
                     }).transform}
                     style:transition={getItemStyle(zValues.specs).transition}
                     class="mb-8">
                  <ul class="space-y-2">
                    {#each product.specs as spec, i}
                      <li class="text-white/80 text-xs flex items-center gap-2" 
                          style="transition-delay: {0.15 + (i * 0.07)}s; 
                                 opacity: {isHovering ? '1' : '0.7'}; 
                                 transform: translateX({isHovering ? 10 + sineWave(currentTime + i * 0.5, 5, 1) : 0}px);">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                             class="h-3 w-3 text-{product.color}-400" 
                             viewBox="0 0 20 20" 
                             fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        {spec}
                      </li>
                    {/each}
                  </ul>
                </div>
                
                <!-- Price with enhanced animations -->
                <div style:transform={getItemStyle(zValues.priceTag, {
                       scale: isHovering ? breathingAnimation(currentTime, 1, 1.08) : 1,
                       xOffset: isHovering ? sineWave(currentTime, 7, 0.7) : 0,
                       yOffset: isHovering ? -15 : 0,
                       delay: 0.15,
                       customDuration: 0.4,
                       customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                     }).transform}
                     style:transition={getItemStyle(zValues.priceTag).transition}
                     class="mb-6 flex items-end gap-3">
                  <div class="text-2xl font-bold text-white text-shadow-sharp"
                       style:transform={getItemStyle(zValues.priceText, {
                         scale: isHovering ? 1 + Math.sin(currentTime * 6) * 0.05 : 1
                       }).transform}>
                    {formatCurrency(product.price)}
                  </div>
                  {#if product.originalPrice}
                    <div class="text-lg text-white/60 line-through">
                      {formatCurrency(product.originalPrice)}
                    </div>
                  {/if}
                </div>
                
                <!-- Button with hover effects -->
                <div style:transform={getItemStyle(zValues.button, {
                       yOffset: isHovering ? 0 : 0,
                       delay: 0.2,
                       customDuration: 0.6,
                       customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                     }).transform}
                     style:transition={getItemStyle(zValues.button).transition}
                     class="relative group">
                  <!-- Button glow effect that animates -->
                  {#if isHovering}
                    <div class="absolute inset-0 rounded-lg blur-md group-hover:blur-xl -z-10"
                         style:transform={getItemStyle(zValues.buttonGlow, {
                           scale: 1 + Math.sin(currentTime * 5) * 0.1
                         }).transform}
                         style:background={`linear-gradient(120deg, ${product.glowColor}, #6366f1)`}
                         style:opacity={0.4 + Math.sin(currentTime * 3) * 0.2}>
                    </div>
                  {/if}
                  <button class="w-full bg-gradient-to-r from-{product.color}-600 to-{product.color}-500 
                          hover:from-{product.color}-500 hover:to-{product.color}-400
                          text-white px-4 py-2 rounded-lg text-sm font-semibold 
                          shadow-xl transition-all duration-300 ease-out relative z-10
                          border border-{product.color}-400/30">
                    Explore
                  </button>
                </div>
              </div>
            </svelte:fragment>
          </Enhanced3DCard>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Feature List -->
  <div id="features" class="container mx-auto mb-24 max-w-4xl">
    <h2 class="text-3xl font-bold text-center mb-12 text-white">Enhanced 3D Card Features</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
        <h3 class="text-xl font-bold mb-4 text-indigo-400">Core Features</h3>
        <ul class="space-y-2 text-white/80 text-sm">
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Smooth 3D rotation on hover with perspective transform</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Fully configurable depth perception with Z-index layering</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Custom animation easing functions for natural motion</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Multiple customization options via props</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Responsive design with automatic adaptation</span>
          </li>
        </ul>
      </div>
      
      <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
        <h3 class="text-xl font-bold mb-4 text-emerald-400">Advanced Features</h3>
        <ul class="space-y-2 text-white/80 text-sm">
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Time-based animation functions (sine/cosine waves)</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Independent element transformations with layered depth</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Parallax effects with depth perception</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Breathing animations for subtle scaling effects</span>
          </li>
          <li class="flex items-start gap-2">
            <svg class="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Staggered animations with custom timing</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  
  <!-- Customization Options -->
  <div class="container mx-auto mb-24 max-w-3xl">
    <h2 class="text-3xl font-bold text-center mb-8 text-white">Customization Options</h2>
    <div class="bg-white/5 backdrop-blur-sm p-6 rounded-xl">
      <table class="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Property</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Default</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr>
            <td class="px-4 py-2 text-sm text-indigo-400">hoverZScale</td>
            <td class="px-4 py-2 text-sm text-white/70">Number</td>
            <td class="px-4 py-2 text-sm text-white/70">2</td>
            <td class="px-4 py-2 text-sm text-white/70">Z-axis amplification on hover</td>
          </tr>
          <tr>
            <td class="px-4 py-2 text-sm text-indigo-400">initialScale</td>
            <td class="px-4 py-2 text-sm text-white/70">Number</td>
            <td class="px-4 py-2 text-sm text-white/70">1</td>
            <td class="px-4 py-2 text-sm text-white/70">Initial scale of the card</td>
          </tr>
          <tr>
            <td class="px-4 py-2 text-sm text-indigo-400">hoverScale</td>
            <td class="px-4 py-2 text-sm text-white/70">Number</td>
            <td class="px-4 py-2 text-sm text-white/70">1.05</td>
            <td class="px-4 py-2 text-sm text-white/70">Card scale on hover</td>
          </tr>
          <tr>
            <td class="px-4 py-2 text-sm text-indigo-400">maxRotation</td>
            <td class="px-4 py-2 text-sm text-white/70">Number</td>
            <td class="px-4 py-2 text-sm text-white/70">10</td>
            <td class="px-4 py-2 text-sm text-white/70">Maximum rotation in degrees</td>
          </tr>
          <tr>
            <td class="px-4 py-2 text-sm text-indigo-400">perspective</td>
            <td class="px-4 py-2 text-sm text-white/70">Number</td>
            <td class="px-4 py-2 text-sm text-white/70">1500</td>
            <td class="px-4 py-2 text-sm text-white/70">Perspective value in pixels</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- Call to Action -->
  <div class="container mx-auto max-w-3xl bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 mb-24">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">Ready to enhance your UI?</h2>
        <p class="text-white/90">Add depth and immersion to your web applications</p>
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
  
  .text-shadow-sharp {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  
  /* Card container */
  .card-container {
    transform-style: preserve-3d;
  }
  
  /* Make text crisper */
  h1, h2, h3, p, span, button {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Force 3D rendering on all elements */
  :global(.enhanced-card-wrapper),
  :global(.enhanced-card) {
    overflow: visible !important;
    border-radius: 1.25rem;
  }
  
  :global(.enhanced-card-wrapper *),
  :global(.enhanced-card *) {
    transform-style: preserve-3d !important;
  }
</style> 