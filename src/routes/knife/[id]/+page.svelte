<script>
  import { page } from '$app/stores';
  import { isAuthenticated } from '$lib/stores/auth';
  import BidModal from '$lib/components/BidModal.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import YouTubeEmbed from '$lib/components/YouTubeEmbed.svelte';
  import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
  import Enhanced3DCard from '$lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte';
  import { fetchApi } from '$lib/utils/api';
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let item = null;
  let loading = true;
  let error = null;
  let timerInterval;
  let timeRemaining = null;
  let showBidModal = false;
  let showToast = false;
  let toastMessage = '';
  let currentImageIndex = 0;
  let currentTime = 0;
  let animationFrame;
  let currentHoverCard = null;
  let bidAmount = 0;

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

  async function refreshItem() {
    try {
      loading = true;
      const id = $page.params.id;
      console.log('Fetching knife details for ID:', id);
      
      // Use a more reliable relative URL format
      const response = await fetch(`/api/items/${id}/`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully loaded knife data:', data);
      
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

  function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  function handleBidClick() {
    showBidModal = true;
  }

  function handleBidModalClose() {
    showBidModal = false;
  }

  function showSuccessToast(message) {
    toastMessage = message;
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  async function handleBidPlaced() {
    try {
      await refreshItem();
      showSuccessToast('Bid placed successfully!');
    } catch (e) {
      console.error('Error refreshing after bid:', e);
    }
  }

  function maskEmail(email) {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return `${username}***@${domain}`;
    }
    return `${username[0]}***${username[username.length - 1]}@${domain}`;
  }

  // Add a function to handle bid increment/decrement
  function incrementBid() {
    bidAmount = Math.max(Math.ceil(item.current_price) + 1, bidAmount + 1);
  }

  function decrementBid() {
    bidAmount = Math.max(Math.ceil(item.current_price) + 1, bidAmount - 1);
  }

  // Add a function for copying to clipboard
  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href);
    showSuccessToast('Link copied to clipboard!');
  }

  onMount(async () => {
    try {
      await refreshItem();
      
      // Timer for countdown
      timerInterval = setInterval(() => {
        if (item && item.end_date) {
          timeRemaining = getTimeRemaining(item.end_date);
          
          // Optionally, check if auction has ended and clear interval
          if (timeRemaining && timeRemaining.isExpired) {
            clearInterval(timerInterval);
          }
        }
      }, 1000);
    } catch (e) {
      console.error('Failed to load knife details:', e);
      error = 'Failed to load knife details';
    }
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
    stopTimeAnimation();
  });
</script>

<div class="container mx-auto px-4 py-8">
  {#if loading}
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-bold">Loading...</h1>
        <p class="mt-2">Fetching knife details</p>
      </div>
    </div>
  {:else if error}
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-red-600">Error</h1>
        <p class="mt-2">{error}</p>
      </div>
    </div>
  {:else if item}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left column: Enhanced 3D Card -->
      <div class="lg:col-span-2">
        <div class="w-full aspect-[4/3] relative">
          {#if item.images && item.images.length > 0}
            <Enhanced3DCard
              title={item.title}
              description={item.description || "No description available"}
              price={item.current_price}
              imageSrc={item.images[currentImageIndex]?.image || '/placeholder.jpg'}
              altText={item.title}
              on:hoverchange={handleHoverChange}
              rotateXAmount={currentHoverCard === 'item-card' ? 5 : 0}
              rotateYAmount={currentHoverCard === 'item-card' ? 5 : 0}
              scaleAmount={currentHoverCard === 'item-card' ? 1.05 : 1}
              translationZAmount={10}
              glowColor="#ff4b00"
              glowOpacity={0.2}
              glowRadius={50}
            >
              <div slot="badge" class="absolute top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Knife
              </div>
              
              <div slot="countdown" class="absolute bottom-4 right-4 z-50 {timeRemaining && !timeRemaining.isExpired ? 'bg-black/80' : 'bg-red-600'} text-white px-3 py-2 rounded-lg text-sm">
                {#if timeRemaining && !timeRemaining.isExpired}
                  <div class="flex space-x-1">
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.days}</span>
                      <span class="text-xs">d</span>
                    </div>
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.hours}</span>
                      <span class="text-xs">h</span>
                    </div>
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.minutes}</span>
                      <span class="text-xs">m</span>
                    </div>
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.seconds}</span>
                      <span class="text-xs">s</span>
                    </div>
                  </div>
                {:else}
                  <span class="font-bold">Auction Ended</span>
                {/if}
              </div>
            </Enhanced3DCard>
          {:else if item.image}
            <Enhanced3DCard
              title={item.title}
              description={item.description || "No description available"}
              price={item.current_price}
              imageSrc={item.image || '/placeholder.jpg'}
              altText={item.title}
              on:hoverchange={handleHoverChange}
              rotateXAmount={currentHoverCard === 'item-card' ? 5 : 0}
              rotateYAmount={currentHoverCard === 'item-card' ? 5 : 0}
              scaleAmount={currentHoverCard === 'item-card' ? 1.05 : 1}
              translationZAmount={10}
              glowColor="#ff4b00"
              glowOpacity={0.2}
              glowRadius={50}
            >
              <div slot="badge" class="absolute top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Knife
              </div>
              
              <div slot="countdown" class="absolute bottom-4 right-4 z-50 {timeRemaining && !timeRemaining.isExpired ? 'bg-black/80' : 'bg-red-600'} text-white px-3 py-2 rounded-lg text-sm">
                {#if timeRemaining && !timeRemaining.isExpired}
                  <div class="flex space-x-1">
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.days}</span>
                      <span class="text-xs">d</span>
                    </div>
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.hours}</span>
                      <span class="text-xs">h</span>
                    </div>
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.minutes}</span>
                      <span class="text-xs">m</span>
                    </div>
                    <div class="text-center">
                      <span class="font-bold">{timeRemaining.seconds}</span>
                      <span class="text-xs">s</span>
                    </div>
                  </div>
                {:else}
                  <span class="font-bold">Auction Ended</span>
                {/if}
              </div>
            </Enhanced3DCard>
          {:else}
            <div class="bg-gray-200 h-full w-full flex items-center justify-center">
              <span class="text-gray-500">No image available</span>
            </div>
          {/if}
        </div>
        
        <!-- Image thumbnails navigation if multiple images -->
        {#if item.images && item.images.length > 1}
          <div class="mt-4 flex space-x-2 overflow-x-auto pb-2">
            {#each item.images as image, index}
              <button 
                class="w-16 h-16 rounded-md overflow-hidden border-2 focus:outline-none {index === currentImageIndex ? 'border-orange-500' : 'border-transparent'}"
                on:click={() => currentImageIndex = index}
                aria-label="View image {index + 1}"
              >
                <img 
                  src={image.image} 
                  alt="{item.title} - image {index + 1}" 
                  class="w-full h-full object-cover"
                  on:error={(e) => e.currentTarget.src = '/placeholder.jpg'}
                />
              </button>
            {/each}
          </div>
        {/if}

        <!-- Add previous/next navigation for multiple images -->
        {#if item.images && item.images.length > 1}
          <div class="absolute left-4 top-1/2 -translate-y-1/2 z-50">
            <button 
              class="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              on:click={previousImage}
              aria-label="Previous image"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 z-50">
            <button 
              class="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              on:click={nextImage}
              aria-label="Next image"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        {/if}
      </div>
      
      <!-- Right column: Details -->
      <div class="lg:col-span-1">
        <h1 class="text-3xl font-bold mb-4">{item.title}</h1>
        <p class="text-gray-700 mb-6">{item.description}</p>
        
        <!-- Price information -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Current Price:</h3>
          <p class="text-3xl font-bold text-orange-600 mb-1">
            {formatPrice(item.current_price)}
          </p>
          {#if item.current_bidder}
            <p class="text-sm text-gray-600">
              Current Bidder: {maskEmail(item.current_bidder)}
            </p>
          {/if}
        </div>
        
        <!-- Bid button -->
        {#if timeRemaining && !timeRemaining.isExpired}
          <div class="mb-6">
            {#if $isAuthenticated}
              <button 
                class="w-full py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg transition-all hover:scale-105"
                on:click={handleBidClick}
              >
                Place Bid
              </button>
            {:else}
              <button 
                class="w-full py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg transition-all hover:scale-105"
                on:click={() => goto(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
              >
                Login to Bid
              </button>
            {/if}
          </div>
        {/if}
        
        <!-- Time remaining -->
        {#if timeRemaining && !timeRemaining.isExpired}
          <div class="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Time Remaining:</h3>
            <div class="grid grid-cols-4 gap-2 text-center">
              <div class="bg-white p-2 rounded shadow-sm">
                <span class="block text-2xl font-bold">{timeRemaining.days}</span>
                <span class="text-sm">Days</span>
              </div>
              <div class="bg-white p-2 rounded shadow-sm">
                <span class="block text-2xl font-bold">{timeRemaining.hours}</span>
                <span class="text-sm">Hours</span>
              </div>
              <div class="bg-white p-2 rounded shadow-sm">
                <span class="block text-2xl font-bold">{timeRemaining.minutes}</span>
                <span class="text-sm">Minutes</span>
              </div>
              <div class="bg-white p-2 rounded shadow-sm">
                <span class="block text-2xl font-bold">{timeRemaining.seconds}</span>
                <span class="text-sm">Seconds</span>
              </div>
            </div>
          </div>
        {:else}
          <div class="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            <p class="font-semibold">This auction has ended</p>
            {#if item.winner}
              <p class="mt-2">Winner: {maskEmail(item.winner)}</p>
            {/if}
          </div>
        {/if}
        
        <!-- Bid history -->
        {#if item.bids && item.bids.length > 0}
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Bid History:</h3>
            <div class="bg-white p-4 rounded-lg shadow-sm max-h-60 overflow-y-auto">
              {#each item.bids as bid}
                <div class="py-2 border-b border-gray-100 last:border-b-0">
                  <p class="flex justify-between items-center">
                    <span class="{userColors[bid.user_email] || 'text-gray-800'} font-medium">
                      {maskEmail(bid.user_email)}
                    </span>
                    <span class="font-semibold">{formatPrice(bid.amount)}</span>
                  </p>
                  <p class="text-xs text-gray-500">
                    {new Date(bid.created_at).toLocaleString()}
                  </p>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Add a share button -->
        <div class="mt-4 mb-6">
          <button
            class="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
            on:click={copyToClipboard}
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
        </div>

        <!-- Add bidding increment/decrement controls -->
        {#if timeRemaining && !timeRemaining.isExpired && $isAuthenticated}
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <div class="relative flex-1 bg-gray-100 rounded-lg overflow-hidden">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
              <input 
                type="number" 
                bind:value={bidAmount}
                min={Math.ceil(item.current_price) + 1} 
                class="w-full pl-8 pr-14 py-3 bg-transparent focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <div class="absolute right-0 top-0 h-full flex flex-col border-l border-gray-200">
                <button 
                  class="flex-1 px-2 h-1/2 hover:bg-gray-200 text-gray-700 flex items-center justify-center border-b border-gray-200"
                  on:click={incrementBid}
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button 
                  class="flex-1 px-2 h-1/2 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                  on:click={decrementBid}
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/if}

        <!-- Add additional item details section if available -->
        {#if item.condition || item.dimensions || item.materials}
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Item Details:</h3>
            <dl class="grid grid-cols-2 gap-x-4 gap-y-2">
              {#if item.condition}
                <dt class="text-gray-600">Condition:</dt>
                <dd>{item.condition}</dd>
              {/if}
              {#if item.dimensions}
                <dt class="text-gray-600">Dimensions:</dt>
                <dd>{item.dimensions}</dd>
              {/if}
              {#if item.materials}
                <dt class="text-gray-600">Materials:</dt>
                <dd>{item.materials}</dd>
              {/if}
              {#if item.category}
                <dt class="text-gray-600">Category:</dt>
                <dd>{item.category?.name || 'Knife'}</dd>
              {/if}
            </dl>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- YouTube video if available -->
    {#if item.youtube_url}
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Video</h2>
        <div class="aspect-video w-full">
          <YouTubeEmbed url={item.youtube_url} />
        </div>
      </div>
    {/if}
  {/if}
</div>

<!-- Bid Modal Component -->
{#if showBidModal}
  <BidModal 
    item={item} 
    minimumBid={Math.ceil(item?.current_price) + 1} 
    on:close={handleBidModalClose}
    on:bidplaced={handleBidPlaced}
  />
{/if}

<!-- Toast notification -->
{#if showToast}
  <Toast message={toastMessage} />
{/if}