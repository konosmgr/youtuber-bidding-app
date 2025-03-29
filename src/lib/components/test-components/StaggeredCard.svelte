<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Enhanced3DCard from './Enhanced3DCard.svelte';
  
  // Props with enhanced customization options
  export let className = '';
  export let cardStyle = '';
  export let hoverZScale = 2; // Z amplification on hover
  export let initialScale = 1; // Initial card scale
  export let hoverScale = 1.05; // Card scale on hover
  export let maxRotation = 12; // Max rotation in degrees
  export let perspective = 1800; // Perspective value in px
  export let transitionDuration = 0.3; // Transition duration in seconds
  export let transitionEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // Transition timing function
  
  // Staggered animation props
  export let staggerStep = 0.05; // Time delay between elements in seconds
  export let staggerDistance = 50; // How far elements move on hover (in px)
  export let staggerDirection = 'forward'; // 'forward', 'reverse', or 'from-center'
  export let zBehavior = 'hybrid'; // 'flat', 'hybrid', or 'subtle'
  
  // For example card content
  export let title = "Staggered Card";
  export let subtitle = "Cascading 3D effects";
  export let items = [
    "First item in the list", 
    "Second item with more text to show", 
    "Third item demonstrates the stagger",
    "Fourth item completes the sequence"
  ];
  export let ctaText = "View Details";
  export let badgeText = "NEW";
  
  // Animation state
  let currentTime = 0;
  let animationFrame;
  let isHovering = false;

  // Event dispatcher for handling clicks and interactions
  const dispatch = createEventDispatcher();
  
  // Track hover state
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
  
  // Stop animation when component unmounts
  function stopTimeAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }
  
  // Calculate staggered delay based on index and direction
  function getStaggerDelay(index, total) {
    if (staggerDirection === 'forward') {
      return index * staggerStep;
    } else if (staggerDirection === 'reverse') {
      return (total - index - 1) * staggerStep;
    } else if (staggerDirection === 'from-center') {
      // Calculate distance from center (0 to 1)
      const center = (total - 1) / 2;
      const distanceFromCenter = Math.abs(index - center) / center;
      return distanceFromCenter * staggerStep;
    }
    return 0;
  }
  
  // Helper function to calculate z-transforms with staggered behavior
  function getStaggeredStyle(z, index, total, options = {}) {
    const {
      xOffset = 0,
      yOffset = 0,
      scale = 1,
      customEasing = null,
      customDuration = null,
      baseDelay = 0
    } = options;
    
    // Calculate staggered delay
    const staggerDelay = getStaggerDelay(index, total);
    const delay = baseDelay + staggerDelay;
    
    // Calculate z based on hover state and zBehavior
    let zAmount;
    
    if (zBehavior === 'flat') {
      // Only apply Z transforms on hover (like Aceternity UI)
      zAmount = isHovering ? z : 0;
    } else if (zBehavior === 'hybrid') {
      // Background elements (negative Z) maintain depth
      // Foreground elements (positive Z) only pop out on hover
      if (z < 0) {
        zAmount = isHovering ? z * hoverZScale : z;
      } else {
        zAmount = isHovering ? z : 0;
      }
    } else if (zBehavior === 'subtle') {
      // Background elements maintain full depth
      // Foreground elements have subtle depth (20%) at rest
      if (z < 0) {
        zAmount = isHovering ? z * hoverZScale : z;
      } else {
        zAmount = isHovering ? z : z * 0.2;
      }
    } else {
      // Default - all elements scale their Z on hover
      zAmount = isHovering ? z * hoverZScale : z;
    }
    
    // Calculate movement offsets with staggered timing
    const staggeredXOffset = isHovering ? xOffset : 0;
    const staggeredYOffset = isHovering ? yOffset : 0;
    
    return {
      transform: `translate3d(${staggeredXOffset}px, ${staggeredYOffset}px, ${zAmount}px) scale(${scale})`,
      transition: `transform ${customDuration || transitionDuration}s ${customEasing || transitionEasing} ${delay}s`,
      zValue: zAmount,
      delay: delay
    };
  }
  
  // Animation helpers
  function sineWave(time, amplitude = 10, frequency = 2) {
    return Math.sin(time * frequency) * amplitude;
  }
  
  function cosineWave(time, amplitude = 10, frequency = 2) {
    return Math.cos(time * frequency) * amplitude;
  }
  
  // Cleanup on unmount
  onMount(() => {
    return () => {
      stopTimeAnimation();
    };
  });
</script>

<div class={`staggered-card ${className}`} style={cardStyle}>
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
        <div class="w-full h-full bg-gradient-to-br from-blue-950 to-indigo-900"></div>
      </div>
      
      <!-- Animated background pattern -->
      <div class="absolute inset-0 rounded-xl overflow-hidden"
           style:transform={getItemStyle(-150, {
             xOffset: isHovering ? sineWave(currentTime, 5, 0.3) : 0,
             yOffset: isHovering ? cosineWave(currentTime, 5, 0.2) : 0
           }).transform}
           style:transition={getItemStyle(-150).transition}>
        <div class="w-full h-full pattern-grid opacity-10"></div>
      </div>
      
      <!-- Content container - using true staggered effects -->
      <div class="absolute inset-0 p-6 flex flex-col">
        <!-- Badge with staggered appearance -->
        {#if badgeText}
          <div class="self-start mb-4"
               style:transform={getStaggeredStyle(100, 0, 7, {
                 xOffset: -staggerDistance,
                 baseDelay: 0.05
               }).transform}
               style:transition={getStaggeredStyle(100, 0, 7).transition}
               style:opacity={isHovering ? 1 : 0.7}>
            <span class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              {badgeText}
            </span>
          </div>
        {/if}
        
        <!-- Title with staggered appearance -->
        <div class="mb-2"
             style:transform={getStaggeredStyle(80, 1, 7, {
               xOffset: -staggerDistance,
               baseDelay: 0.1
             }).transform}
             style:transition={getStaggeredStyle(80, 1, 7).transition}
             style:opacity={isHovering ? 1 : 0.8}>
          <h2 class="text-2xl font-bold text-white">{title}</h2>
        </div>
        
        <!-- Subtitle with staggered appearance -->
        <div class="mb-4"
             style:transform={getStaggeredStyle(60, 2, 7, {
               xOffset: -staggerDistance,
               baseDelay: 0.15
             }).transform}
             style:transition={getStaggeredStyle(60, 2, 7).transition}
             style:opacity={isHovering ? 1 : 0.7}>
          <p class="text-blue-200">{subtitle}</p>
        </div>
        
        <!-- List items with staggered appearance -->
        <div class="flex-1 my-4">
          <ul class="space-y-2">
            {#each items as item, i}
              <li class="flex items-start gap-2"
                  style:transform={getStaggeredStyle(50, i + 3, items.length + 3, {
                    xOffset: -staggerDistance,
                    baseDelay: 0.2
                  }).transform}
                  style:transition={getStaggeredStyle(50, i + 3, items.length + 3).transition}
                  style:opacity={isHovering ? 1 : 0.5}>
                <!-- Check icon -->
                <svg class="h-5 w-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <!-- Item text -->
                <span class="text-white/90">{item}</span>
              </li>
            {/each}
          </ul>
        </div>
        
        <!-- CTA Button with staggered appearance and highest Z -->
        <div class="self-start mt-auto"
             style:transform={getStaggeredStyle(120, 7, 8, {
               yOffset: staggerDistance,
               baseDelay: 0.25
             }).transform}
             style:transition={getStaggeredStyle(120, 7, 8).transition}
             style:opacity={isHovering ? 1 : 0.9}>
          <button class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg transition-colors duration-300">
            {ctaText}
          </button>
        </div>
      </div>
    </svelte:fragment>
  </Enhanced3DCard>
</div>

<style>
  .staggered-card {
    width: 100%;
    height: 500px;
  }
  
  /* Pattern grid background */
  .pattern-grid {
    background-image: linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px);
    background-size: 20px 20px;
  }
</style> 