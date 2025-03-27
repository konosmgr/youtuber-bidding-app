<script>
  import { onMount, createEventDispatcher, onDestroy } from 'svelte';
  import Enhanced3DCard from '$lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte';
  import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
  
  // Configurable props
  export let item = {
    id: '',
    title: '',
    youtuber: null,
    description: '',
    specs: [],
    current_price: 0,
    starting_price: 0,
    images: [],
    thumbnail: '',
    condition: '',
    highlights: '',
    category: {
      id: '',
      name: '',
      code: ''
    }
  };
  
  // Default card dimensions and appearance
  export let cardHeight = "h-[450px]"; // Adjusted to better fit content
  export let hoverScale = 1.08;  // Adjusted to match PastAuctionsCard2
  export let maxRotation = 12;   // Adjusted to match PastAuctionsCard2
  export let perspective = 1800; // Adjusted to match PastAuctionsCard2
  
  // Optional additional class for container
  export let containerClass = "";
  
  // Event dispatcher for handling clicks and interactions
  const dispatch = createEventDispatcher();
  
  // Animation state
  let currentTime = 0;
  let animationFrame;
  let isAnimating = false;
  
  // Handle hover state changes
  let currentHoverCard = null;
  
  function handleHoverChange(event) {
    if (event.detail.isHovering) {
      currentHoverCard = item.id;
      startTimeAnimation();
    } else if (currentHoverCard === item.id) {
      currentHoverCard = null;
      stopTimeAnimation();
    }
    
    dispatch('hoverchange', event.detail);
  }
  
  // Time-based animation
  function startTimeAnimation() {
    isAnimating = true;
    const animate = () => {
      currentTime += 0.01;
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }
  
  // Stop animation when component unmounts
  function stopTimeAnimation() {
    isAnimating = false;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }
  
  // Animation helper functions
  function sineWave(time, amplitude = 10, frequency = 2) {
    return Math.sin(time * frequency) * amplitude;
  }
  
  function cosineWave(time, amplitude = 10, frequency = 2) {
    return Math.cos(time * frequency) * amplitude;
  }
  
  function breathingAnimation(time, min = 0.95, max = 1.05) {
    return min + ((Math.sin(time) + 1) / 2) * (max - min);
  }
  
  // Format price
  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }
  
  // Extract specs from item
  function extractSpecs(item) {
    let specs = [];
    
    if (item.highlights) {
      // Use highlights if available, limit to 3 meaningful points
      specs = item.highlights.split(',')
        .map(s => s.trim())
        .filter(s => s && s.length > 3)
        .slice(0, 3);
    } else if (item.description) {
      // Extract meaningful information from description
      const descLines = item.description
        .replace(/•/g, '.')  // Convert bullets to periods
        .replace(/- /g, '. ') // Convert dashes to periods
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 5 && s.length < 60);
      
      specs = descLines.slice(0, 3);
    }
    
    // Get knife condition if available
    if (item.condition) {
      specs.unshift(`Condition: ${item.condition}`);
      specs = specs.slice(0, 3);
    }
    
    return specs.length > 0 ? specs : ['Knife auction', 'Final sale', 'No returns'];
  }
  
  // Get color for item
  function getItemColor(item) {
    const colors = [
      { color: 'blue', glow: '#60a5fa' },
      { color: 'indigo', glow: '#818cf8' },
      { color: 'purple', glow: '#a78bfa' },
      { color: 'emerald', glow: '#34d399' },
      { color: 'amber', glow: '#fbbf24' },
      { color: 'rose', glow: '#fb7185' },
      { color: 'cyan', glow: '#22d3ee' },
      { color: 'lime', glow: '#84cc16' },
      { color: 'teal', glow: '#14b8a6' },
      { color: 'orange', glow: '#fb923c' },
      { color: 'fuchsia', glow: '#d946ef' }
    ];
    
    // Use a consistent algorithm to pick a color based on item ID or other properties
    // Using multiple properties creates more variety
    const idStr = `${item.id}${item.title.length}`;
    const idNum = parseInt(idStr.replace(/\D/g, '')) || 0;
    const colorIndex = Math.abs(idNum % colors.length);
    return colors[colorIndex];
  }
  
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
    title: 90,
    titleShadow: 85,
    subtitle: 70,
    specs: 60,
    specIcon: 65,
    button: 50,
    floatingElements: 80
  };
  
  // Cleanup on unmount
  onDestroy(() => {
    stopTimeAnimation();
  });
</script>

<div class={`card-container ${cardHeight} ${containerClass} w-full relative`}>
  <Enhanced3DCard
    hoverZScale={1.3}
    initialScale={1}
    hoverScale={hoverScale}
    maxRotation={maxRotation}
    perspective={perspective}
    transitionDuration={0.3}
    transitionEasing="cubic-bezier(0.23, 1, 0.32, 1)"
    cardStyle="border-radius: 1rem; overflow: visible;"
    className="past-auction-card"
    on:hoverchange={handleHoverChange}
  >
    <svelte:fragment slot="default" let:isHovering let:getItemStyle>
      <!-- Base card with color gradients -->
      <div class="absolute inset-0 card-base"
           style:transform={getItemStyle(zValues.farBackground).transform}
           style:transition={getItemStyle(zValues.farBackground).transition}>
        <div class="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800"></div>
      </div>
      
      <!-- Animated background pattern with parallax -->
      <div class="absolute inset-0 card-pattern"
           style:transform={getItemStyle(zValues.backgroundPattern, {delay: 0.05}).transform}
           style:transition={getItemStyle(zValues.backgroundPattern, {delay: 0.05}).transition}>
        <div class="w-full h-full pattern-dots opacity-10"></div>
      </div>
      
      <!-- Product image layer with grayscale filter -->
      <div class="absolute inset-0 card-image"
           style:transform={getItemStyle(zValues.imageBase, {
             xOffset: isHovering ? -5 : 0,
             yOffset: isHovering ? -5 : 0,
             customDuration: 0.6,
             delay: 0.1
           }).transform}
           style:transition={getItemStyle(zValues.imageBase, {
             customDuration: 0.6,
             delay: 0.1
           }).transition}>
        
        <!-- Using ResponsiveImage for better image handling -->
        <div class="w-full h-full" 
             class:grayscale-60={isHovering}
             class:grayscale-90={!isHovering}
             class:brightness-100={isHovering}
             class:brightness-90={!isHovering}
             style="transition: filter 0.5s ease-out;">
          {#if item.images?.[0]?.image || item.images?.[0]?.url}
            <ResponsiveImage
              src={item.images[0].image || item.images[0].url}
              webpSrc={item.images[0].webp_url || ''}
              width={item.images[0].width || 800}
              height={item.images[0].height || 600}
              alt={item.title}
              className="w-full h-full object-cover cursor-pointer"
              fallbackSrc="/images/placeholder.jpg"
              fillContainer={true}
              on:click={() => dispatch('imageClick', { itemId: item.id })}
            />
          {:else if item.thumbnail}
            <ResponsiveImage
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover cursor-pointer"
              fallbackSrc="/images/placeholder.jpg"
              fillContainer={true}
              on:click={() => dispatch('imageClick', { itemId: item.id })}
            />
          {:else}
            <img 
              src="/images/placeholder.jpg" 
              alt={item.title}
              class="w-full h-full object-cover cursor-pointer"
              on:click={() => dispatch('imageClick', { itemId: item.id })}
            />
          {/if}
        </div>
        
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent"></div>
      </div>
      
      <!-- Glow effect layer -->
      {#if isHovering}
        <div class="absolute inset-0 card-glow" 
             style:transform={getItemStyle(zValues.glow).transform}
             style:transition={getItemStyle(zValues.glow, {
               customDuration: 0.8,
               customEasing: 'cubic-bezier(0.19, 1, 0.22, 1)'
             }).transition}>
          <div class="w-full h-full" 
               style="background: radial-gradient(circle at center, #14b8a6 0%, transparent 70%); 
                      opacity: 0.05; 
                      mix-blend-mode: screen;">
          </div>
        </div>
      {/if}
      
      <!-- Badge Container to ensure proper positioning -->
      <div class="absolute top-0 left-0 w-full p-4 flex justify-between z-40">
        <!-- PAST AUCTION Badge on left -->
        <div style:transform={getItemStyle(zValues.badge, {
                 scale: isHovering ? 1.05 : 1,
                 customDuration: 0.4,
                 delay: 0.15
               }).transform}
               style:transition={getItemStyle(zValues.badge, {
                 customDuration: 0.4,
                 delay: 0.15
               }).transition}>
          <span class="bg-gray-700/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            PAST AUCTION
          </span>
        </div>
        
        <!-- SOLD Badge on right -->
        <div style:transform={getItemStyle(zValues.badge, {
                 scale: isHovering ? 1.05 : 1,
                 customDuration: 0.4,
                 delay: 0.2
               }).transform}
               style:transition={getItemStyle(zValues.badge, {
                 customDuration: 0.4,
                 delay: 0.2
               }).transition}>
          <span class="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-red-500/30">
            SOLD
          </span>
        </div>
      </div>
      
      <!-- Content container -->
      <div class="absolute inset-0 flex flex-col p-6"
           style:transform={getItemStyle(zValues.container).transform}
           style:transition={getItemStyle(zValues.container).transition}>
        
        <!-- Dark gradient overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none"></div>
        
        <!-- Title and subtitle pushed to the middle -->
        <div class="flex-1 flex flex-col justify-center relative z-10 mt-12">
          <!-- Title -->
          <div style:transform={getItemStyle(zValues.title, {
                   xOffset: isHovering ? 5 : 0,
                   delay: 0.1
                 }).transform}
                 style:transition={getItemStyle(zValues.title, {
                   delay: 0.1
                 }).transition}
                 class="mb-1">
            <h3 class="text-xl font-bold text-white truncate" style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);">
              {item.title}
            </h3>
          </div>
          
          <!-- Specs list with better clarity - limit to one item if not hovering -->
          <div style:transform={getItemStyle(zValues.specs, {
                   yOffset: isHovering ? -3 : 0, 
                   delay: 0.2
                 }).transform}
                 style:transition={getItemStyle(zValues.specs, {
                   delay: 0.2
                 }).transition}
                 class="mt-2">
            <ul class="space-y-2">
              {#each extractSpecs(item).slice(0, isHovering ? 2 : 1) as spec, i}
                <li class="flex items-center gap-2" 
                    style="transition-delay: {0.2 + (i * 0.05)}s; 
                           opacity: {isHovering ? '1' : '0.9'}; 
                           transform: translateX({isHovering ? '0' : '-5px'}); 
                           transition: opacity 0.3s ease, transform 0.3s ease;">
                  <div class="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-sm w-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-teal-400 flex-shrink-0 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-white text-sm truncate">{spec}</span>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        </div>
        
        <!-- Bottom section with price and button -->
        <div class="mt-auto relative z-10">
          <!-- Wrap both price and button in a single link -->
          <a 
            href="{
              item.category 
                ? (typeof item.category === 'object' && item.category.code 
                    ? `/${item.category.code.toLowerCase()}` 
                    : `/${typeof item.category === 'string' ? item.category.toLowerCase() : 'knife'}`)
                : '/knife'
              }/{item.id}"
            class="block no-underline relative z-50"
          >
            <!-- Final price with enhanced clarity -->
            <div style:transform={getItemStyle(zValues.priceTag, {
                     scale: isHovering ? 1.05 : 1, 
                     delay: 0.25
                   }).transform}
                   style:transition={getItemStyle(zValues.priceTag, {
                     delay: 0.25,
                     customDuration: 0.4,
                   }).transition}
                   class="mb-4">
              <div class="bg-black/10 backdrop-blur-sm px-4 py-2 rounded-sm">
                <div class="flex items-center gap-2">
                  <div class="text-sm text-white font-medium">Final Price:</div>
                  <div class="text-xl font-bold text-white" style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);">
                    {formatPrice(item.current_price)}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- View Details button at bottom -->
            <div style:transform={getItemStyle(zValues.button, {
                     delay: 0.35
                   }).transform}
                   style:transition={getItemStyle(zValues.button, {
                     delay: 0.35
                   }).transition}>
              <div 
                class="details-btn w-full bg-gradient-to-r 
                       from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500
                       text-white px-4 py-2.5 rounded-lg text-sm font-semibold 
                       shadow-xl hover:shadow-gray-500/40 
                       transition-all duration-300 ease-out text-center block">
                View Details
              </div>
            </div>
          </a>
        </div>
      </div>
    </svelte:fragment>
  </Enhanced3DCard>
</div>

<style>
  /* Card styling for past auctions */
  .card-container {
    perspective: 1500px;
    transform-style: preserve-3d; 
    transition: opacity 0.5s ease;
    /* Critical: Ensure 3D effects aren't clipped */
    overflow: visible !important;
    /* Add margin to create space between cards */
    margin: 0.5rem;
    /* Ensure z-index works properly */
    isolation: isolate;
    position: relative;
    z-index: 1;
  }
  
  /* Target child elements to ensure they don't clip */
  .card-container > * {
    overflow: visible !important;
  }
  
  /* Card layer styles with proper border radius but no overflow hidden */
  .card-base, .card-pattern, .card-image, .card-glow {
    border-radius: 1rem;
  }
  
  /* Button hover effects */
  .details-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(107, 114, 128, 0.5);
  }
  
  /* Dot pattern background */
  .pattern-dots {
    background-image: radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  /* Fix 3D transforms */
  :global(.past-auction-card),
  :global(.enhanced-card) {
    border-radius: 1rem;
    overflow: visible !important;
  }
  
  :global(.past-auction-card *),
  :global(.enhanced-card *) {
    transform-style: preserve-3d !important;
  }
  
  /* Critical fix: Ensure the Enhanced3DCard component wrapper is properly styled */
  :global(.enhanced-card-wrapper) {
    border-radius: 1rem !important;
    overflow: visible !important;
  }
  
  /* Grayscale and brightness utility classes */
  .grayscale-60 {
    filter: grayscale(60%);
  }
  
  .grayscale-90 {
    filter: grayscale(90%);
  }
  
  .brightness-100 {
    filter: brightness(100%);
  }
  
  .brightness-90 {
    filter: brightness(90%);
  }
  
  /* Prevent text overflow */
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>