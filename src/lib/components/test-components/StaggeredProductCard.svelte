<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Enhanced3DCard from './Enhanced3DCard.svelte';
  
  // Card props
  export let className = '';
  export let cardStyle = '';
  export let hoverZScale = 2;
  export let initialScale = 1;
  export let hoverScale = 1.05;
  export let maxRotation = 12;
  export let perspective = 1800;
  export let transitionDuration = 0.3;
  export let transitionEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  // Staggered animation props
  export let staggerStep = 0.05;
  export let staggerDirection = 'forward';
  export let zBehavior = 'hybrid';
  
  // Product data
  export let product = {
    title: "Premium Headphones",
    brand: "AudioTech",
    price: 249.99,
    discount: 29,
    originalPrice: 349.99,
    rating: 4.8,
    reviewCount: 256,
    image: "/images/products/headphones.jpg",
    features: [
      "Active Noise Cancellation",
      "40-hour Battery Life",
      "Premium Sound Quality",
      "Comfortable Fit"
    ],
    colors: ["#121212", "#e5e5e5", "#7c3aed"],
    badgeText: "BEST SELLER"
  };
  
  // Animation state
  let currentTime = 0;
  let animationFrame;
  let isHovering = false;
  let selectedColor = product.colors[0];

  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Handle hover state
  function handleHoverChange(event) {
    isHovering = event.detail.isHovering;
    
    if (isHovering) {
      startTimeAnimation();
    } else {
      stopTimeAnimation();
    }
  }
  
  // Time-based animation
  function startTimeAnimation() {
    const animate = () => {
      currentTime += 0.01;
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }
  
  // Stop animation
  function stopTimeAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }
  
  // Function to format price
  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  }
  
  // Function to get staggered delay based on index
  function getStaggerDelay(index, total) {
    if (staggerDirection === 'forward') {
      return index * staggerStep;
    } else if (staggerDirection === 'reverse') {
      return (total - index - 1) * staggerStep;
    } else if (staggerDirection === 'from-center') {
      const center = (total - 1) / 2;
      const distanceFromCenter = Math.abs(index - center) / center;
      return distanceFromCenter * staggerStep;
    }
    return 0;
  }
  
  // Advanced staggered style function with customizable entrance/exit animations
  function getStaggeredStyle(z, index, total, options = {}) {
    const {
      xOffset = 0,
      yOffset = 0,
      scale = 1,
      rotate = 0,
      opacity = [0.5, 1],
      baseDelay = 0,
      exitDelay = 0,
      customDuration = null,
      customEasing = null
    } = options;
    
    // Calculate delay
    const staggerDelay = getStaggerDelay(index, total);
    const delay = baseDelay + staggerDelay;
    
    // Calculate z based on hover state and zBehavior
    let zAmount;
    
    if (zBehavior === 'flat') {
      zAmount = isHovering ? z : 0;
    } else if (zBehavior === 'hybrid') {
      if (z < 0) {
        zAmount = isHovering ? z * hoverZScale : z;
      } else {
        zAmount = isHovering ? z : 0;
      }
    } else if (zBehavior === 'subtle') {
      if (z < 0) {
        zAmount = isHovering ? z * hoverZScale : z;
      } else {
        zAmount = isHovering ? z : z * 0.2;
      }
    } else {
      zAmount = isHovering ? z * hoverZScale : z;
    }
    
    // Calculate transformations with staggered timing
    const staggeredXOffset = isHovering ? xOffset : 0;
    const staggeredYOffset = isHovering ? yOffset : 0;
    const staggeredScale = isHovering ? scale : 1;
    const staggeredRotate = isHovering ? rotate : 0;
    
    // Calculate opacity based on hover state
    const targetOpacity = isHovering ? opacity[1] : opacity[0];
    
    return {
      transform: `translate3d(${staggeredXOffset}px, ${staggeredYOffset}px, ${zAmount}px) 
                  scale(${staggeredScale}) 
                  rotate(${staggeredRotate}deg)`,
      transition: `transform ${customDuration || transitionDuration}s ${customEasing || transitionEasing} ${delay}s, 
                  opacity ${customDuration || transitionDuration}s ${customEasing || transitionEasing} ${delay}s`,
      opacity: targetOpacity,
      zValue: zAmount,
      delay
    };
  }
  
  // Animation helpers
  function sineWave(time, amplitude = 10, frequency = 2) {
    return Math.sin(time * frequency) * amplitude;
  }
  
  function cosineWave(time, amplitude = 10, frequency = 2) {
    return Math.cos(time * frequency) * amplitude;
  }
  
  // Handle click on a color selector
  function selectColor(color) {
    selectedColor = color;
  }
  
  // Handle buy now button click
  function handleBuyNow() {
    dispatch('buynow', { product, selectedColor });
  }
  
  // Cleanup on unmount
  onMount(() => {
    return () => {
      stopTimeAnimation();
    };
  });
</script>

<div class={`product-card ${className}`} style={cardStyle}>
  <Enhanced3DCard
    hoverZScale={hoverZScale}
    initialScale={initialScale}
    hoverScale={hoverScale}
    maxRotation={maxRotation}
    perspective={perspective}
    transitionDuration={transitionDuration}
    transitionEasing={transitionEasing}
    on:hoverchange={handleHoverChange}
  >
    <svelte:fragment slot="default" let:isHovering let:getItemStyle>
      <!-- Background layers -->
      <div class="absolute inset-0 rounded-xl overflow-hidden"
           style:transform={getItemStyle(-200).transform}
           style:transition={getItemStyle(-200).transition}>
        <div class="w-full h-full bg-gradient-to-br from-gray-950 to-gray-900"></div>
      </div>
      
      <!-- Background pattern -->
      <div class="absolute inset-0 rounded-xl overflow-hidden bg-noise opacity-10"
           style:transform={getItemStyle(-180, {
             xOffset: isHovering ? sineWave(currentTime, 5, 0.3) : 0,
             yOffset: isHovering ? cosineWave(currentTime, 5, 0.2) : 0
           }).transform}
           style:transition={getItemStyle(-180).transition}>
      </div>
      
      <!-- Product image with glow -->
      <div class="absolute inset-0 flex items-center justify-center p-4"
           style:transform={getStaggeredStyle(-40, 0, 10, {
             scale: isHovering ? 1.05 : 1,
             baseDelay: 0
           }).transform}
           style:transition={getStaggeredStyle(-40, 0, 10).transition}>
        <div class="relative w-full h-64 overflow-visible">
          <!-- Animated glow effect -->
          {#if isHovering}
            <div class="absolute inset-0 blur-xl rounded-full" 
                 style:transform={`scale(${0.9 + Math.sin(currentTime) * 0.1})`}
                 style:background={`radial-gradient(circle at center, ${selectedColor}40 0%, transparent 70%)`}
                 style:transition="transform 4s ease-in-out, background 0.5s ease-out">
            </div>
          {/if}
          
          <!-- Product image with dynamic movement -->
          <img 
            src={product.image} 
            alt={product.title}
            class="absolute w-full h-full object-contain"
            style:transform={getStaggeredStyle(40, 1, 10, {
              yOffset: isHovering ? sineWave(currentTime, 15, 0.5) : 0,
              rotate: isHovering ? sineWave(currentTime, 5, 0.3) : 0,
              baseDelay: 0.05
            }).transform}
            style:transition={getStaggeredStyle(40, 1, 10).transition}
          />
        </div>
      </div>
      
      <!-- Content container with staggered entries -->
      <div class="absolute inset-0 p-6 flex flex-col pointer-events-none">
        <!-- Top section: Badge -->
        <div class="flex items-start justify-between">
          {#if product.badgeText}
            <div style:transform={getStaggeredStyle(100, 2, 10, {
                   xOffset: -30,
                   rotate: -5,
                   baseDelay: 0.1,
                   opacity: [0, 1]
                 }).transform}
                 style:transition={getStaggeredStyle(100, 2, 10).transition}
                 style:opacity={getStaggeredStyle(100, 2, 10).opacity}>
              <span class="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                {product.badgeText}
              </span>
            </div>
          {/if}
          
          <!-- Rating -->
          <div style:transform={getStaggeredStyle(90, 3, 10, {
                 xOffset: 30,
                 baseDelay: 0.15,
                 opacity: [0, 1]
               }).transform}
               style:transition={getStaggeredStyle(90, 3, 10).transition}
               style:opacity={getStaggeredStyle(90, 3, 10).opacity}
               class="flex items-center gap-1">
            <div class="flex">
              {#each Array(5) as _, i}
                <svg class={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              {/each}
            </div>
            <span class="text-xs text-white/80">({product.reviewCount})</span>
          </div>
        </div>
        
        <!-- Middle: Empty space to make room for image -->
        <div class="flex-1"></div>
        
        <!-- Bottom section: Info and purchase -->
        <div class="mt-auto">
          <!-- Brand with staggered entry -->
          <div style:transform={getStaggeredStyle(60, 4, 10, {
                 xOffset: -40,
                 baseDelay: 0.2,
                 opacity: [0, 1]
               }).transform}
               style:transition={getStaggeredStyle(60, 4, 10).transition}
               style:opacity={getStaggeredStyle(60, 4, 10).opacity}>
            <p class="text-sm text-gray-400">{product.brand}</p>
          </div>
          
          <!-- Title with staggered entry -->
          <div style:transform={getStaggeredStyle(70, 5, 10, {
                 xOffset: -50,
                 baseDelay: 0.25,
                 opacity: [0, 1]
               }).transform}
               style:transition={getStaggeredStyle(70, 5, 10).transition}
               style:opacity={getStaggeredStyle(70, 5, 10).opacity}
               class="mb-2">
            <h2 class="text-2xl font-bold text-white">{product.title}</h2>
          </div>
          
          <!-- Features with individual staggered entries -->
          <ul class="space-y-1 mb-4">
            {#each product.features as feature, i}
              <li class="flex items-start gap-2"
                  style:transform={getStaggeredStyle(50, i + 6, product.features.length + 6, {
                    xOffset: -50 - (i * 10),
                    baseDelay: 0.3,
                    opacity: [0, 0.9]
                  }).transform}
                  style:transition={getStaggeredStyle(50, i + 6, product.features.length + 6).transition}
                  style:opacity={getStaggeredStyle(50, i + 6, product.features.length + 6).opacity}>
                <svg class="h-4 w-4 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-white/80">{feature}</span>
              </li>
            {/each}
          </ul>
          
          <!-- Color selection with staggered entries -->
          <div style:transform={getStaggeredStyle(80, 6, 10, {
                 yOffset: 30,
                 baseDelay: 0.35,
                 opacity: [0, 1]
               }).transform}
               style:transition={getStaggeredStyle(80, 6, 10).transition}
               style:opacity={getStaggeredStyle(80, 6, 10).opacity}
               class="mb-4">
            <p class="text-sm text-gray-400 mb-2">Select Color:</p>
            <div class="flex gap-2 pointer-events-auto">
              {#each product.colors as color, i}
                <button 
                  class="w-8 h-8 rounded-full border-2 transition-transform"
                  style:background-color={color}
                  style:border-color={selectedColor === color ? 'white' : 'transparent'}
                  style:transform={selectedColor === color ? 'scale(1.2)' : 'scale(1)'}
                  on:click={() => selectColor(color)}
                  aria-label={`Select color ${i+1}`}
                ></button>
              {/each}
            </div>
          </div>
          
          <!-- Price info with staggered entry -->
          <div style:transform={getStaggeredStyle(90, 7, 10, {
                 yOffset: 40,
                 baseDelay: 0.4,
                 opacity: [0, 1]
               }).transform}
               style:transition={getStaggeredStyle(90, 7, 10).transition}
               style:opacity={getStaggeredStyle(90, 7, 10).opacity}
               class="flex items-center gap-3 mb-4">
            <span class="text-2xl font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {#if product.originalPrice}
              <span class="text-lg line-through text-gray-500">
                {formatPrice(product.originalPrice)}
              </span>
            {/if}
            {#if product.discount}
              <span class="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                {product.discount}% OFF
              </span>
            {/if}
          </div>
          
          <!-- Buy now button with staggered entry -->
          <div style:transform={getStaggeredStyle(120, 8, 10, {
                 yOffset: 50,
                 baseDelay: 0.45,
                 opacity: [0, 1]
               }).transform}
               style:transition={getStaggeredStyle(120, 8, 10).transition}
               style:opacity={getStaggeredStyle(120, 8, 10).opacity}
               class="pointer-events-auto"
               on:mouseenter={() => dispatch('buttonhover', { isHovering: true })}
               on:mouseleave={() => dispatch('buttonhover', { isHovering: false })}>
            <button 
              class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-colors duration-300"
              on:click={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </svelte:fragment>
  </Enhanced3DCard>
</div>

<style>
  .product-card {
    width: 100%;
    height: 100%;
    min-height: 600px;
  }
  
  /* Noise texture background */
  .bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 150px;
  }
</style> 