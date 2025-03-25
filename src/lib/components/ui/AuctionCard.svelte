<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Enhanced3DCard from '$lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte';
  import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
  
  // Configurable props
  export let item = {
    id: '',
    name: '',
    youtuber: '',
    specs: [],
    currentBid: 0,
    startingPrice: 0,
    label: 'HOT ITEM',
    image: '',
    images: [],
    color: 'indigo',
    glowColor: '#818cf8',
    bids: 0,
    timeLeft: '',
  };
  
  // Default card dimensions
  export let cardWidth = "w-full";
  export let cardHeight = "h-[520px]";
  export let maxRotation = 12;
  export let hoverScale = 1.1;

  // Optional additional class for container
  export let containerClass = "";
  
  // Animation state
  let currentTime = 0;
  let animationFrame;
  let isHovering = false;
  
  // Ultra-detailed Z layers for maximum depth perception
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
    startingBid: 110,
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
    floatingElements: 80,
    timerContainer: 75,
    timerText: 78
  };
  
  // Event dispatcher for handling clicks and interactions
  const dispatch = createEventDispatcher();
  
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
  function handleHoverChange(event) {
    isHovering = event.detail.isHovering;
    
    if (isHovering) {
      startTimeAnimation();
    } else {
      stopTimeAnimation();
    }
  }
  
  // Handle click on the bid button
  function handleBidClick(event) {
    event.stopPropagation(); // Prevent card click
    window.location.href = `/knife/${item.id}`;
  }
  
  // Handle click on the watchlist button
  function handleWatchlistClick(event) {
    event.stopPropagation(); // Prevent card click
    // Just add to watchlist (future feature)
    console.log('Added to watchlist:', item.id);
  }
  
  // Handle click on the entire card - no need for separate image handler
  function handleCardClick() {
    console.log('Card clicked!', item.id);
    window.location.href = `/knife/${item.id}`;
  }
  
  // Handle image click - forward to the right URL
  function handleImageClick(event) {
    // Stop propagation to prevent double navigation
    event.stopPropagation();
    window.location.href = `/knife/${item.id}`;
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

<div class={`card-container ${cardWidth} ${cardHeight} ${containerClass}`} on:click={handleCardClick}>
  <Enhanced3DCard
    hoverZScale={1.4}
    initialScale={1}
    hoverScale={hoverScale}
    maxRotation={maxRotation}
    perspective={2000}
    transitionDuration={0.4}
    transitionEasing="cubic-bezier(0.23, 1, 0.32, 1)"
    cardStyle="border-radius: 1.25rem; overflow: visible; cursor: pointer;"
    className="auction-card"
    on:hoverchange={handleHoverChange}
  >
    <svelte:fragment slot="image">
      <div class="w-full h-full rounded-xl overflow-hidden relative">
        <ResponsiveImage
          src={item.images[0].image || item.images[0].url}
          webpSrc={item.images[0].webp_url || ''}
          width={item.images[0].width || 800}
          height={item.images[0].height || 600}
          alt={item.name}
          className="w-full h-full object-cover"
          fallbackSrc="/placeholder.jpg"
          fillContainer={true}
        />
      </div>
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
        <div class="w-full h-full bg-gradient-to-br from-indigo-950 to-slate-900 rounded-xl"></div>
      </div>
      
      <!-- Animated background pattern with parallax -->
      <div class="absolute inset-0 rounded-xl overflow-hidden"
           style:transform={getItemStyle(zValues.backgroundPattern, {
             xOffset: isHovering ? sineWave(currentTime, 8, 0.3) : 0,
             yOffset: isHovering ? -5 : 0,
             scale: isHovering ? breathingAnimation(currentTime * 0.5, 1, 1.05) : 1,
             customDuration: 6,
             customEasing: 'ease-in-out'
           }).transform}
           style:transition={getItemStyle(zValues.backgroundPattern).transition}>
        <div class="w-full h-full pattern-grid opacity-15"></div>
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
             style="background: radial-gradient(circle at {50 + sineWave(currentTime, 15, 0.5)}% {50 + cosineWave(currentTime, 15, 0.7)}%, {item.glowColor} 0%, transparent 70%);">
        </div>
      </div>
      
      <!-- Product image with complex movements -->
      <div class="absolute inset-0 rounded-xl overflow-hidden"
           style:transform={getItemStyle(zValues.imageBase, {
             xOffset: isHovering ? sineWave(currentTime, 10, 0.8) * -1 : 0,
             yOffset: isHovering ? cosineWave(currentTime, 8, 0.5) * -1 : 0,
             customDuration: 2,
             customEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
           }).transform}
           style:transition={getItemStyle(zValues.imageBase).transition}
           style:z-index="5">
        
        {#if item.images?.[0]?.image || item.images?.[0]?.url}
          <ResponsiveImage
            src={item.images[0].image || item.images[0].url}
            webpSrc={item.images[0].webp_url || ''}
            width={item.images[0].width || 800}
            height={item.images[0].height || 600}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl"
            fallbackSrc="/placeholder.jpg"
            fillContainer={true}
          />
        {:else if item.image}
          <img 
            src={item.image} 
            alt={item.name}
            class="w-full h-full object-cover rounded-xl"
            on:error={(e) => {
              e.currentTarget.src = '/placeholder.jpg';
            }}
          />
        {:else}
          <img 
            src="/placeholder.jpg" 
            alt={item.name}
            class="w-full h-full object-cover rounded-xl"
          />
        {/if}
        
        <!-- Gradient overlay with subtle animation -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-xl"
             style:opacity={isHovering ? 0.7 : 0.8}
             style:transform={getItemStyle(zValues.overlay, {
               yOffset: isHovering ? 5 : 0,
               customDuration: 0.6
             }).transform}
             style:pointer-events="none"
             style:transition="all 0.6s cubic-bezier(0.23, 1, 0.32, 1)"></div>
      </div>
      
      <!-- Floating particles that move independently (reduced for performance) -->
      {#if isHovering}
        {#each Array(6) as _, i}
          <div class="absolute w-2 h-2 rounded-full bg-white/30"
               style:left={`${20 + i * 10}%`}
               style:top={`${20 + (i % 5) * 10}%`}
               style:pointer-events="none"
               style:transform={getItemStyle(zValues.floatingElements, {
                 xOffset: sineWave(currentTime + i * 0.5, 20, 0.5),
                 yOffset: cosineWave(currentTime + i * 0.3, 20, 0.7),
                 scale: breathingAnimation(currentTime + i * 0.2, 0.5, 1.5),
                 customDuration: 4
               }).transform}
               style:transition={getItemStyle(zValues.floatingElements).transition}
               style:opacity={0.3 + (Math.sin(currentTime + i) + 1) / 4}>
          </div>
        {/each}
      {/if}
      
      <!-- Animated glow effect -->
      {#if isHovering}
        <div class="absolute inset-0 rounded-xl overflow-hidden" 
             style:pointer-events="none"
             style:transform={getItemStyle(zValues.glow, {
               scale: breathingAnimation(currentTime, 0.8, 1.2),
               customDuration: 2.5
             }).transform}
             style:transition={getItemStyle(zValues.glow).transition}>
          <div class="w-full h-full rounded-xl" 
               style="background: radial-gradient(circle at {50 + sineWave(currentTime, 10, 1)}% {50 + cosineWave(currentTime, 10, 0.8)}%, {item.glowColor} 0%, transparent 70%); 
                      opacity: 0.4; 
                      mix-blend-mode: screen;">
          </div>
        </div>
      {/if}
      
      <!-- Bids badge in left corner -->
      {#if item.bids > 0}
        <div style:transform={getItemStyle(zValues.badge, {
               scale: isHovering ? (1 + Math.sin(currentTime * 8) * 0.05) : 1,
               xOffset: isHovering ? sineWave(currentTime, 3, 2) : 0,
               yOffset: isHovering ? -5 : 0,
               customDuration: 0.3,
               customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
             }).transform}
             style:transition={getItemStyle(zValues.badge).transition}
             style:pointer-events="none"
             class="absolute top-5 left-5">
          <span class="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg bg-red-500 text-white shadow-red-500/30"
                style:transform={getItemStyle(zValues.badgeText, {
                  scale: isHovering ? (1 + Math.sin(currentTime * 10) * 0.05) : 1
                }).transform}>
            {item.bids} {item.bids === 1 ? 'BID' : 'BIDS'} PLACED
          </span>
        </div>
      {/if}
      
      <!-- Time remaining badge in right corner (like the 29% OFF badge) -->
      {#if item.timeLeft}
        <div style:transform={getItemStyle(zValues.badge + 5, {
               xOffset: isHovering ? sineWave(currentTime, 3, 3) * -1 : 0,
               yOffset: isHovering ? -8 : 0,
               customDuration: 0.4,
               customEasing: "cubic-bezier(0.5, 2, 0.75, 1)"
             }).transform}
             style:transition={getItemStyle(zValues.badge + 5).transition}
             style:pointer-events="none"
             class="absolute top-5 right-5">
          <span class="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-indigo-600/30"
                style:transform={isHovering ? `rotate(${sineWave(currentTime, 5, 5)}deg) scale(${1 + Math.sin(currentTime * 5) * 0.1})` : ''}>
            {item.timeLeft}
          </span>
        </div>
      {/if}
      
      <!-- Content container with staggered elements -->
      <div class="absolute inset-0 flex flex-col p-8"
           style:transform={getItemStyle(zValues.container).transform}
           style:transition={getItemStyle(zValues.container).transition}>
        
        <!-- Main content area with flex spacing -->
        <div class="flex-1 flex flex-col pointer-events-none">
          <!-- Top section: Title - moved lower by increasing margin-top -->
          <div class="mt-20" 
               style:transform={getItemStyle(zValues.title, {
                 xOffset: isHovering ? 8 + sineWave(currentTime, 5, 1) : 0,
                 yOffset: isHovering ? -5 + cosineWave(currentTime, 3, 0.7) : 0,
                 customDuration: 0.5,
                 customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
               }).transform}
               style:transition={getItemStyle(zValues.title).transition}>
            <h3 class="text-2xl font-bold text-white text-shadow-sharp line-clamp-2">{item.name}</h3>
          </div>
          
          <!-- Middle section: Youtuber and specs - made more compact -->
          <div class="mt-2 mb-20">
            {#if item.youtuber}
              <div style:transform={getItemStyle(zValues.subtitle, {
                    xOffset: isHovering ? 12 + sineWave(currentTime, 3, 1.5) : 0,
                    yOffset: isHovering ? -2 + cosineWave(currentTime, 2, 0.5) : 0,
                    delay: 0.05,
                    customDuration: 0.6
                  }).transform}
                  style:transition={getItemStyle(zValues.subtitle).transition}
                  class="mb-1">
                <p class="text-gray-300 text-sm font-medium">
                  By {item.youtuber}
                </p>
              </div>
            {/if}
            
            <!-- Specs list with wave-like sequential animation - more compact spacing -->
            {#if item.specs && item.specs.length > 0}
              <div style:transform={getItemStyle(zValues.specs, {
                     yOffset: isHovering ? -3 : 0,
                     delay: 0.1,
                     customDuration: 0.7
                   }).transform}
                   style:transition={getItemStyle(zValues.specs).transition}>
                <ul class="space-y-0.5">
                  {#each item.specs as spec, i}
                    <li class="text-white/90 text-sm flex items-start gap-1.5" 
                        style="transition-delay: {0.15 + (i * 0.07)}s; 
                               opacity: {isHovering ? '0.9' : '1'}; 
                               transform: translateX({isHovering ? sineWave(currentTime + i * 0.5, 5, 1) : -5}px) 
                                          translateY({isHovering ? cosineWave(currentTime + i * 0.3, 3, 0.7) : 0}px); 
                               transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                           class="h-3.5 w-3.5 text-indigo-400 mt-1 flex-shrink-0" 
                           style="transform: scale({isHovering ? 1 + Math.sin(currentTime * 5 + i) * 0.2 : 1});"
                           viewBox="0 0 20 20" 
                           fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span class="line-clamp-1">{spec}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Bottom section: Price and buttons -->
        <div class="mt-auto">
          <!-- Starting bid (smaller text above main price) - now with animation -->
          <div style:transform={getItemStyle(zValues.startingBid, {
                 scale: isHovering ? breathingAnimation(currentTime, 1, 1.02) : 1,
                 xOffset: isHovering ? sineWave(currentTime, 4, 0.5) : 0,
                 yOffset: isHovering ? -5 : 0,
                 delay: 0.1,
                 customDuration: 0.5,
                 customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
               }).transform}
               style:transition={getItemStyle(zValues.startingBid).transition}
               class="text-sm text-white/90 mb-1 mx-2 pointer-events-none">
            <span class="inline-block" style:opacity={isHovering ? 0.95 : 0.8}>
              Starting bid: {formatCurrency(item.startingPrice)}
            </span>
          </div>
          
          <!-- Main price (where "$2,499.99" is) -->
          <div style:transform={getItemStyle(zValues.priceTag, {
                 scale: isHovering ? breathingAnimation(currentTime, 1, 1.05) : 1,
                 xOffset: isHovering ? sineWave(currentTime, 7, 0.7) : 0,
                 yOffset: isHovering ? -15 : 0,
                 delay: 0.15,
                 customDuration: 0.4,
                 customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
               }).transform}
               style:transition={getItemStyle(zValues.priceTag).transition}
               class="mb-12 pointer-events-none">
            <div class="text-3xl font-extrabold text-white text-shadow-sharp"
                 style:transform={getItemStyle(zValues.priceText, {
                   scale: isHovering ? 1 + Math.sin(currentTime * 6) * 0.05 : 1
                 }).transform}>
              {formatCurrency(item.currentBid)}
            </div>
          </div>
          
          <!-- Button group with complex hover effects -->
          <div class="flex gap-4 pointer-events-auto relative" style:z-index="200">
            <!-- Bid button with animated glow -->
            <div style:transform={getItemStyle(zValues.button, {
                   yOffset: isHovering ? 5 : 0,
                   delay: 0.2,
                   customDuration: 0.6,
                   customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                 }).transform}
                 style:transition={getItemStyle(zValues.button).transition}
                 class="flex-1 relative group ">
              <!-- Button glow effect that animates -->
              {#if isHovering}
                <div class="absolute inset-0 rounded-lg blur-md group-hover:blur-xl -z-10"
                     style:transform={getItemStyle(zValues.buttonGlow, {
                       scale: 1 + Math.sin(currentTime * 5) * 0.1
                     }).transform}
                     style:background={`linear-gradient(120deg, ${item.glowColor}, #6366f1)`}
                     style:opacity={0.4 + Math.sin(currentTime * 3) * 0.2}>
                </div>
              {/if}
              <button on:click={(e) => {
                      e.stopPropagation();
                      handleBidClick(e);
                    }} 
                    class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 
                         hover:from-indigo-500 hover:to-indigo-400
                         text-white px-4 py-2 rounded-lg text-sm font-semibold 
                         shadow-xl transition-all duration-300 ease-out relative z-10
                         border border-indigo-400/30 flex items-center justify-center h-[44px]"
                    style:transform={isHovering ? `translateY(${sineWave(currentTime, 2, 3)}px)` : ''}>
                <span style:transform={getItemStyle(zValues.buttonText, {
                      scale: isHovering ? 1 + Math.sin(currentTime * 8) * 0.05 : 1
                    }).transform}
                    style:display="inline-block"
                    style:margin-top="-25px"
                    >
                  Place Bid
                </span>
              </button>
            </div>
            
            <!-- Watchlist button with heart animation -->
            <div style:transform={getItemStyle(zValues.heartButton, {
                   yOffset: isHovering ? 5 : 0,
                   delay: 0.25,
                   customDuration: 0.7
                 }).transform}
                 style:transition={getItemStyle(zValues.heartButton).transition}
                 class="w-14">
              <button on:click={(e) => {
                      e.stopPropagation();
                      handleWatchlistClick(e);
                    }}
                    class="w-full h-full bg-white/10 hover:bg-white/20 
                         text-white rounded-lg flex items-center justify-center 
                         border border-white/30 shadow-xl relative
                         transition-all duration-300 ease-out"
                    style:transform={isHovering ? `translateY(${sineWave(currentTime, 2, 3) * 1.2}px)` : ''}>
                <div class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       class="h-5 w-5 -mt-[29px] -ml-[22px]" 
                       style:transform={getItemStyle(zValues.heartIcon, {
                         scale: isHovering ? 1 + Math.sin(currentTime * 15) * 0.2 : 1
                       }).transform}
                       style:fill={isHovering ? `rgba(255, ${100 + Math.sin(currentTime * 10) * 50}, ${100 + Math.sin(currentTime * 10) * 50}, 0.8)` : 'none'}
                       style:transition="fill 0.3s ease, transform 0.3s ease"
                       viewBox="0 0 24 24" 
                       stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </svelte:fragment>
  </Enhanced3DCard>
</div>

<style>
  .text-shadow-sharp {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  
  /* Card container */
  .card-container {
    perspective: 2000px;
    transform-style: preserve-3d;
    cursor: pointer;
    position: relative;
  }
  
  /* Pattern grid background */
  .pattern-grid {
    background-image: linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  /* Fix for filters */
  .filter-hue-rotate-15 {
    filter: hue-rotate(15deg);
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
  
  /* Make auction-card class have a cursor pointer */
  :global(.auction-card) {
    cursor: pointer;
  }
  
  /* Add these new utility classes */
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 