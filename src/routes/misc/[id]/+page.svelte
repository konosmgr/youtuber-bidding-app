<script>
  import { page } from '$app/stores';
  import { isAuthenticated } from '$lib/stores/auth';
  import BidModal from '$lib/components/BidModal.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import YouTubeEmbed from '$lib/components/YouTubeEmbed.svelte';
  import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
  import Enhanced3DCard from '$lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Card from '$lib/components/ui/Focus/Card.svelte';

  // Force client-side rendering only
  export const csr = true;
  
  // Access data from the load function in +page.js
  export let data;
  
  // Initialize with data from load function or defaults
  let item = data?.item || null;
  let error = data?.error || null;
  let loading = !item && !error;
  let timeRemaining = data?.timeRemaining || null;
  let timerInterval;
  let showBidModal = false;
  let showToast = false;
  let toastMessage = '';
  let currentImageIndex = 0;
  let currentTime = 0;
  let animationFrame;
  let currentHoverCard = null;
  let showImagePopup = false;
  let popupImageIndex = 0;
  let hoveredPopupImage = null;
  let bidAmount = data?.initialBidAmount || 0;
  let isSubmittingBid = false;

  $: popupCards = item?.images ? item.images.map((img, i) => ({
    src: img.image,
    title: `${item.title} - Image ${i + 1}`,
    index: i
  })) : [];

  $: uniqueUsers = item?.bids ? [...new Set(item.bids.map(bid => bid.user_email))] : [];
  $: colors = [
    'text-blue-600', 'text-purple-600', 'text-green-600', 
    'text-amber-600', 'text-rose-600', 'text-teal-600', 
    'text-indigo-600', 'text-orange-600', 'text-emerald-600'
  ];
  
  $: userColors = {};
  $: {
    uniqueUsers.forEach((user, index) => {
      userColors[user] = colors[index % colors.length];
    });
  }

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
    button: 0,
    buttonText: 50,
    buttonGlow: 45,
    heartButton: 60,
    heartIcon: 65,
    floatingElements: 80,
    countdownBox: 100
  };

  function startTimeAnimation() {
    const animate = () => {
      currentTime += 0.01;
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  function stopTimeAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }

  function handleHoverChange(event) {
    if (event.detail.isHovering) {
      currentHoverCard = 'item-card';
      startTimeAnimation();
    } else {
      currentHoverCard = null;
      stopTimeAnimation();
    }
  }

  function sineWave(time, amplitude = 10, frequency = 2) {
    return Math.sin(time * frequency) * amplitude;
  }

  function cosineWave(time, amplitude = 10, frequency = 2) {
    return Math.cos(time * frequency) * amplitude;
  }

  function breathingAnimation(time, min = 0.95, max = 1.05) {
    return min + ((Math.sin(time) + 1) / 2) * (max - min);
  }

  async function refreshItem() {
    try {
      loading = true;
      const id = $page.params.id;
      console.log('Fetching misc item details for ID:', id);
      
      if (!id) {
        console.error('No item ID found in URL parameters');
        error = 'No item ID found';
        item = null;
        return;
      }
      
      // Use a more reliable relative URL format
      const response = await fetch(`/api/items/${id}/`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully loaded misc item data:', data);
      
      item = data;
      
      if (item && item.end_date) {
        timeRemaining = getTimeRemaining(item.end_date);
      }
      
      if (item) {
        bidAmount = Math.ceil(item.current_price) + 1;
      }
      
      error = null;
    } catch (e) {
      console.error('Failed to refresh item:', e);
      error = `Failed to load item: ${e.message}`;
      item = null;
    } finally {
      loading = false;
    }
  }

  function nextImage() {
    if (item.images?.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % item.images.length;
    }
  }

  function previousImage() {
    if (item.images?.length > 0) {
      currentImageIndex = (currentImageIndex - 1 + item.images.length) % item.images.length;
    }
  }

  function selectImage(index) {
    currentImageIndex = index;
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  function showSuccessToast(message) {
    toastMessage = message;
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  function getTimeRemaining(endDate) {
    const total = new Date(endDate) - new Date();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
      isExpired: total <= 0,
    };
  }
  
  function maskEmail(email) {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return '***@***';
    if (username.length <= 2) {
      return `${username}***@${domain}`;
    }
    return `${username[0]}***${username[username.length - 1]}@${domain}`;
  }

  function handleLoginClick() {
    goto(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }

  function formatTimeRemaining(time) {
    if (!time) return '';
    return `${time.days > 0 ? time.days + 'd ' : ''}${time.hours}h ${time.minutes}m ${time.seconds}s`;
  }

  function openImagePopup(index) {
    popupImageIndex = index;
    showImagePopup = true;
  }

  function closeImagePopup() {
    showImagePopup = false;
  }

  async function submitBid() {
    if (isSubmittingBid) return;
    
    if (!$isAuthenticated) {
      handleLoginClick();
      return;
    }
    
    const minimumBid = Math.ceil(item.current_price) + 1;
    if (bidAmount < minimumBid) {
      showToast = true;
      toastMessage = `Bid must be at least ${formatPrice(minimumBid)}`;
      setTimeout(() => { showToast = false; }, 3000);
      return;
    }
    
    isSubmittingBid = true;
    
    try {
      const response = await fetch(`/api/items/${item.id}/bid/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bid_amount: bidAmount })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Something went wrong');
      }
      
      // Success! Refresh item data
      await refreshItem();
      showBidModal = false;
      showSuccessToast('Bid placed successfully!');
      
    } catch (err) {
      console.error('Error placing bid:', err);
      showToast = true;
      toastMessage = err.message || 'Failed to place bid';
      setTimeout(() => { showToast = false; }, 3000);
    } finally {
      isSubmittingBid = false;
    }
  }

  // Setup timer interval and perform initial item load if needed
  onMount(() => {
    if (!item && !error) {
      refreshItem();
    }
    
    // Set up timer interval for countdown
    timerInterval = setInterval(() => {
      if (item && item.end_date) {
        timeRemaining = getTimeRemaining(item.end_date);
      }
    }, 1000);
    
    return () => {
      clearInterval(timerInterval);
      stopTimeAnimation();
    };
  });

  onDestroy(() => {
    clearInterval(timerInterval);
    stopTimeAnimation();
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<svelte:head>
  <title>{item ? `${item.title} | Misc Item Auction` : 'Miscellaneous Item Auction Details'}</title>
  <meta name="description" content={item ? `Bid on ${item.title}, a miscellaneous item from ${item.youtuber?.name || 'an Alaska YouTuber'}` : 'Miscellaneous item auction details'} />
</svelte:head>

<!-- Main container -->
<div class="container mx-auto px-4 py-8">
  <!-- Back button -->
  <button
    on:click={() => goto('/misc')}
    class="mb-6 flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span>Back to Miscellaneous Items</span>
  </button>

  {#if loading}
    <div class="flex justify-center items-center min-h-[50vh]">
      <div class="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="bg-red-900/30 border border-red-700 text-red-300 p-6 rounded-lg text-center max-w-2xl mx-auto">
      <h2 class="text-xl font-bold mb-2">Error Loading Item</h2>
      <p>{error}</p>
      <button 
        on:click={refreshItem}
        class="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  {:else if item}
    <div class="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-8">
      <!-- Left side: 3D Card and images -->
      <div>
        <!-- 3D Card with the item -->
        <div class="mb-8 relative">
          <Enhanced3DCard
            on:hoverChange={handleHoverChange}
            className="w-full aspect-[4/3] perspective-1200"
            enableFloatingParticles={true}
            enableBreathing={true}
            className="w-full"
            time={currentTime}
            sineAmplitude={10}
            cosineAmplitude={8}
            breathingMin={0.98}
            breathingMax={1.02}
            badge={timeRemaining && !timeRemaining.isExpired ? 'ACTIVE' : 'COMPLETED'}
            badgeColor={timeRemaining && !timeRemaining.isExpired ? 'bg-teal-600' : 'bg-neutral-700'}
          >
            <svelte:fragment slot="background">
              <div 
                class="absolute inset-0 bg-gradient-to-br from-teal-900/60 to-emerald-800/60 z-[{zValues.farBackground}]"
              ></div>
              <div 
                class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1),transparent_70%)] z-[{zValues.backgroundGlow}]"
                style="transform: translateZ({sineWave(currentTime, 5, 0.5)}px);"
              ></div>
              <div 
                class="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,80,60,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,80,60,0.05)_1px,transparent_1px)] bg-[size:24px_24px] z-[{zValues.backgroundPattern}]"
                style="transform: translateZ({sineWave(currentTime + 0.5, 4, 0.2)}px);"
              ></div>
            </svelte:fragment>
            
            <svelte:fragment slot="content">
              <div 
                class="relative h-full w-full rounded-xl bg-black/20 backdrop-blur-sm p-3 z-[{zValues.container}]"
                style="transform: translateZ({sineWave(currentTime, 3, 0.3)}px);"
              >
                <div class="relative h-full w-full overflow-hidden rounded-lg">
                  <!-- Main image -->
                  {#if item.images && item.images.length > 0}
                    <div 
                      class="relative h-full w-full z-[{zValues.imageBase}]"
                      style="transform: translateZ({sineWave(currentTime, 8, 0.5)}px) scale({breathingAnimation(currentTime, 1, 1.03)});"
                    >
                      <ResponsiveImage
                        src={item.images[currentImageIndex]?.image || item.images[currentImageIndex]?.url || ''}
                        webpSrc={item.images[currentImageIndex]?.webp_url || ''}
                        alt={item.title}
                        className="h-full w-full object-contain rounded-lg"
                      />
                    </div>
                  {:else}
                    <div
                      class="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 z-[{zValues.imageBase}]"
                    >
                      <span>No image available</span>
                    </div>
                  {/if}
                  
                  <!-- Overlay gradient -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-[{zValues.overlay}]"
                  ></div>
                  
                  <!-- Title -->
                  <div
                    class="absolute bottom-0 left-0 right-0 p-4 z-[{zValues.title}]"
                    style="transform: translateZ({sineWave(currentTime, 12, 0.2)}px);"
                  >
                    <h1 class="font-bold text-xl text-white drop-shadow-lg">
                      {item.title}
                    </h1>
                    <p class="text-teal-200 text-sm">
                      By {item.youtuber?.name || 'Unknown Youtuber'}
                    </p>
                  </div>
                  
                  <!-- Price tag -->
                  <div
                    class="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full z-[{zValues.priceTag}]"
                    style="transform: translateZ({sineWave(currentTime + 0.5, 15, 0.3)}px);"
                  >
                    <span class="text-teal-200 text-xs font-medium">Current bid:</span>
                    <span class="text-white font-bold ml-1">
                      {formatPrice(item.current_price)}
                    </span>
                  </div>
                  
                  <!-- Countdown box (if auction is active) -->
                  {#if timeRemaining && !timeRemaining.isExpired}
                    <div
                      class="absolute top-3 left-3 bg-teal-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-[{zValues.countdownBox}]"
                      style="transform: translateZ({sineWave(currentTime + 0.2, 14, 0.3)}px);"
                    >
                      <span class="text-teal-100 text-xs font-medium">Ends in:</span>
                      <span class="text-white font-bold ml-1">
                        {formatTimeRemaining(timeRemaining)}
                      </span>
                    </div>
                  {/if}
                </div>
              </div>
            </svelte:fragment>
          </Enhanced3DCard>
        </div>
        
        <!-- Image gallery -->
        {#if item.images && item.images.length > 1}
          <div class="grid grid-cols-5 gap-2">
            {#each item.images as image, i}
              <button
                class="relative overflow-hidden rounded-md aspect-square {
                  i === currentImageIndex ? 'ring-2 ring-teal-500' : ''
                }"
                on:click={() => selectImage(i)}
              >
                <ResponsiveImage
                  src={image.image || image.url || ''}
                  webpSrc={image.webp_url || ''}
                  alt={`${item.title} - Image ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- Right side: Info section -->
      <div class="space-y-6">
        <!-- Title and youtuber info -->
        <div>
          <h1 class="text-3xl font-bold text-teal-400">{item.title}</h1>
          <p class="text-gray-400">
            By {item.youtuber?.name || 'Unknown Youtuber'}
          </p>
        </div>
        
        <!-- Auction status -->
        <div class="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800">
          <div class="flex justify-between mb-3">
            <span class="text-gray-400">Current Bid:</span>
            <span class="text-xl font-bold text-teal-400">{formatPrice(item.current_price)}</span>
          </div>
          
          <div class="flex justify-between mb-5">
            <span class="text-gray-400">Starting Price:</span>
            <span class="text-gray-300">{formatPrice(item.starting_price)}</span>
          </div>
          
          <!-- Status display -->
          {#if timeRemaining?.isExpired}
            <div class="text-center p-2 bg-gray-800/50 rounded-md text-red-400 mb-4">
              Auction Ended
            </div>
          {/if}
          
          <!-- Bid or login button -->
          {#if timeRemaining && !timeRemaining.isExpired}
            <button
              on:click={() => showBidModal = true}
              class="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium rounded-md hover:from-teal-500 hover:to-emerald-500 transition-all"
            >
              Place Bid
            </button>
          {:else if item.bids && item.bids.length > 0}
            <div class="text-center py-3 bg-gray-800 text-gray-300 rounded-md">
              Sold for {formatPrice(item.current_price)}
            </div>
          {:else}
            <div class="text-center py-3 bg-gray-800 text-gray-300 rounded-md">
              No bids placed
            </div>
          {/if}
          
          <!-- Time remaining -->
          {#if timeRemaining && !timeRemaining.isExpired}
            <div class="mt-4 text-center">
              <span class="text-gray-400">Ends in: </span>
              <span class="text-amber-500">
                {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
              </span>
            </div>
          {/if}
        </div>
        
        <!-- Specifications -->
        <div class="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800">
          <h2 class="text-xl font-semibold text-teal-400 mb-4">Item Details</h2>
          
          <div class="space-y-3">
            {#if item.condition}
              <div class="flex justify-between">
                <span class="text-gray-400">Condition:</span>
                <span class="text-gray-200">{item.condition}</span>
              </div>
            {/if}
            
            {#if item.brand}
              <div class="flex justify-between">
                <span class="text-gray-400">Brand:</span>
                <span class="text-gray-200">{item.brand}</span>
              </div>
            {/if}
            
            {#if item.material}
              <div class="flex justify-between">
                <span class="text-gray-400">Material:</span>
                <span class="text-gray-200">{item.material}</span>
              </div>
            {/if}
            
            {#if item.dimensions}
              <div class="flex justify-between">
                <span class="text-gray-400">Dimensions:</span>
                <span class="text-gray-200">{item.dimensions}</span>
              </div>
            {/if}
            
            {#if item.weight}
              <div class="flex justify-between">
                <span class="text-gray-400">Weight:</span>
                <span class="text-gray-200">{item.weight}</span>
              </div>
            {/if}
            
            {#if item.color}
              <div class="flex justify-between">
                <span class="text-gray-400">Color:</span>
                <span class="text-gray-200">{item.color}</span>
              </div>
            {/if}
          </div>
          
          {#if item.description}
            <div class="mt-4 pt-4 border-t border-gray-800">
              <h3 class="text-gray-300 font-medium mb-2">Description</h3>
              <p class="text-gray-400 whitespace-pre-line">{item.description}</p>
            </div>
          {/if}
        </div>
        
        <!-- Bid history -->
        <div class="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800">
          <h2 class="text-xl font-semibold text-teal-400 mb-4">Bid History</h2>
          
          {#if !item.bids || item.bids.length === 0}
            <p class="text-gray-400 text-center py-4">No bids yet</p>
          {:else}
            <div class="space-y-3">
              {#each item.bids.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) as bid}
                <div class="flex justify-between items-center p-2 rounded-md hover:bg-gray-800/30">
                  <div>
                    <span class={userColors[bid.user_email] || 'text-gray-300'}>
                      {maskEmail(bid.user_email)}
                    </span>
                    <div class="text-xs text-gray-500">
                      {new Date(bid.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div class="font-semibold text-white">
                    {formatPrice(bid.bid_amount)}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Bid Modal -->
{#if showBidModal && item}
  <BidModal
    item={item}
    minimumBid={Math.ceil(item.current_price) + 1}
    bind:bidAmount
    on:close={() => (showBidModal = false)}
    on:submit={submitBid}
    loading={isSubmittingBid}
  />
{/if}

<!-- Toast notification -->
{#if showToast}
  <Toast message={toastMessage} />
{/if}

<!-- Image popup/lightbox -->
{#if showImagePopup && item?.images}
  <div 
    class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
    on:click={closeImagePopup}
  >
    <button 
      class="absolute top-4 right-4 text-white/70 hover:text-white"
      on:click|stopPropagation={closeImagePopup}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <div 
      class="relative max-w-4xl max-h-[80vh]"
      on:click|stopPropagation={() => {}}
    >
      <img 
        src={item.images[popupImageIndex].image || item.images[popupImageIndex].url} 
        alt={`${item.title} - Full size image`} 
        class="max-h-[80vh] max-w-full object-contain"
      />
      
      {#if item.images.length > 1}
        <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-4">
          {#each item.images as _, i}
            <button 
              class="w-3 h-3 rounded-full {i === popupImageIndex ? 'bg-teal-500' : 'bg-gray-600 hover:bg-gray-500'}"
              on:click|stopPropagation={() => popupImageIndex = i}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .perspective-1200 {
    perspective: 1200px;
  }
</style>