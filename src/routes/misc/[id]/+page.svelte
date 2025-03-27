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
      console.log('Fetching knife details for ID:', id);
      
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
      
      // Process the images before assigning to the item - ensure images are fully validated
      if (data) {
        // Make sure images array exists and is initialized properly
        if (!data.images || !Array.isArray(data.images)) {
          data.images = [];
        }
        
        // Process with our enhanced function
        data.images = prepareItemImages(data);
        
        // Mark data as having processed images
        data._imagesProcessed = true;
      }
      
      // Now assign the processed data to item
      item = data;
      
      if (item && item.end_date) {
        timeRemaining = getTimeRemaining(item.end_date);
      }
      
      if (item) {
        bidAmount = Math.ceil(item.current_price) + 1;
      }
      
      // Set initial image index safely
      if (item?.images?.length > 0) {
        currentImageIndex = 0;
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
    if (index >= 0 && index < (item.images?.length || 0)) {
      currentImageIndex = index;
    } else {
      console.warn(`Invalid image index: ${index}`);
    }
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
    if (username.length <= 2) {
      return `${username}***@${domain}`;
    }
    return `${username[0]}***${username[username.length - 1]}@${domain}`;
  }

  function handleLoginClick() {
    goto(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }

  function handleImageError(e) {
    e.currentTarget.src = '/placeholder.jpg';
  }

  function openImagePopup() {
    if (!item?.images?.length) return;
    popupImageIndex = currentImageIndex;
    showImagePopup = true;
    document.body.classList.add('overflow-hidden');
  }

  function closeImagePopup() {
    showImagePopup = false;
    document.body.classList.remove('overflow-hidden');
  }

  function navigatePopupImage(direction) {
    if (!item?.images?.length) return;
    if (direction === 'next') {
      popupImageIndex = (popupImageIndex + 1) % item.images.length;
    } else {
      popupImageIndex = (popupImageIndex - 1 + item.images.length) % item.images.length;
    }
  }

  function handleKeydown(event) {
    if (!showImagePopup) return;
    
    if (event.key === 'Escape') {
      closeImagePopup();
    } else if (event.key === 'ArrowRight') {
      navigatePopupImage('next');
    } else if (event.key === 'ArrowLeft') {
      navigatePopupImage('prev');
    }
  }

  function handlePopupImageHover(index) {
    hoveredPopupImage = index;
  }

  function stopPropagation(event) {
    event.stopPropagation();
  }

  onMount(async () => {
    // Set up timer regardless of data source
    timerInterval = setInterval(() => {
      if (item && item.end_date) {
        timeRemaining = getTimeRemaining(item.end_date);
        
        // Clear interval if auction has ended
        if (timeRemaining && timeRemaining.isExpired) {
          clearInterval(timerInterval);
        }
      }
    }, 1000);
    
    // Only fetch if we don't already have data from +page.js
    if (!item && !error) {
      try {
        await refreshItem();
      } catch (e) {
        console.error('Failed to load knife details:', e);
        error = 'Failed to load knife details';
      }
    }
    
    // Add event listener for keyboard navigation in image popup
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    stopTimeAnimation();
    window.removeEventListener('keydown', handleKeydown);
    document.body.classList.remove('overflow-hidden');
  });

  function handleBidInputFocus(e) {
    if (!e.target.value) {
      bidAmount = Math.ceil(item.current_price) + 1;
    }
  }
  
  function incrementBid() {
    bidAmount = Math.ceil(bidAmount) + 1;
  }
  
  function decrementBid() {
    const minBid = Math.ceil(item.current_price) + 1;
    // Avoid floating point issues by ensuring we're working with integers when near minimum
    if (bidAmount - minBid <= 1) {
      bidAmount = minBid;
    } else {
      bidAmount = Math.floor(bidAmount) - 1;
    }
  }
  
  async function submitBid() {
    if (!$isAuthenticated) {
      handleLoginClick();
      return;
    }
    
    const minBid = item.current_price + 1;
    if (bidAmount < minBid) {
      showSuccessToast(`Bid must be at least ${formatPrice(minBid)}`);
      bidAmount = minBid;
      return;
    }
    
    try {
      isSubmittingBid = true;
      console.log('Submitting bid for item:', item.id, 'amount:', bidAmount);
      
      // Get CSRF token from cookies
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      
      const response = await fetch(`/api/items/${item.id}/place_bid/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ amount: bidAmount }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }
      
      await refreshItem();
      showSuccessToast('Bid placed successfully!');
      
    } catch (e) {
      console.error('Error placing bid:', e);
      showSuccessToast(e.message || 'Failed to place bid. Please try again.');
    } finally {
      isSubmittingBid = false;
    }
  }

  async function handleBidPlaced() {
    await refreshItem();
    showSuccessToast('Bid placed successfully!');
    showBidModal = false;
  }

  function prepareItemImages(item) {
    let images = [];
    
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      images = item.images.map(img => {
        // Simple null check for the image object
        if (!img) {
          return { image: '/placeholder.jpg', width: 800, height: 600 };
        }
        
        // Handle string image
        if (typeof img === 'string') {
          // Check if the string itself is 'null' or 'undefined'
          const imageUrl = (img === 'null' || img === 'undefined') ? '/placeholder.jpg' : img;
          return { image: imageUrl, width: 800, height: 600 };
        }
        
        // Handle object with image property
        let imageUrl = img.image || img.url || '';
        // Check if the URL string is 'null' or 'undefined'
        if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
          imageUrl = '/placeholder.jpg';
        }
        
        return {
          image: imageUrl,
          webp_url: img.webp_url || '',
          width: img.width || 800,
          height: img.height || 600
        };
      });
    } else if (item.image && item.image !== 'null' && item.image !== 'undefined') {
      images = [{ image: item.image, width: 800, height: 600 }];
    } else if (item.thumbnail && item.thumbnail !== 'null' && item.thumbnail !== 'undefined') {
      images = [{ image: item.thumbnail, width: 800, height: 600 }];
    } else {
      images = [{ image: '/placeholder.jpg', width: 800, height: 600 }];
    }
    
    return images;
  }

  // Process images when item is loaded or updated
  $: if (item && !item._imagesProcessed) {
    // Use prepareItemImages to process the images
    const processedImages = prepareItemImages(item);
    
    // Mark the item as processed to avoid infinite reactivity loops
    item = {
      ...item,
      images: processedImages,
      _imagesProcessed: true
    };
  }

  // Ensure currentImageIndex stays within valid range when images array changes
  $: if (item?.images?.length && currentImageIndex >= item.images.length) {
    console.log('Adjusting currentImageIndex to be within bounds:', { currentImageIndex, imagesLength: item.images.length });
    currentImageIndex = 0;
  }

  // Validate image object access to prevent undefined errors
  $: currentImage = item?.images?.length > 0 && currentImageIndex < item.images.length
    ? item.images[currentImageIndex]
    : null;

  // Log current image for debugging
  $: if (currentImage) {
    // No need to log the current image on every change
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
  <div class="container mx-auto max-w-7xl">
    <button
      on:click={() => window.history.back()}
      class="mb-6 flex items-center text-white transition-colors hover:text-indigo-300"
    >
      <svg class="mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Auctions
    </button>

    {#if loading}
      <div class="text-center text-xl text-white">Loading auction details...</div>
    {:else if error}
      <div class="text-center text-xl text-red-400">{error}</div>
    {:else if item}
      <!-- New 3-column layout for larger screens, 1-column for mobile -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main image and card - spans 6 columns on large screens -->
        <div class="lg:col-span-6 h-[450px] sm:h-[520px] w-full max-w-full mx-auto relative">
          <Enhanced3DCard
            hoverZScale={1.4}
            initialScale={1}
            hoverScale={1.05}
            maxRotation={15}
            perspective={2000}
            transitionDuration={0.4}
            transitionEasing="cubic-bezier(0.23, 1, 0.32, 1)"
            cardStyle="border-radius: 1.25rem; overflow: visible; height: 100%; width: 100%; background-color: transparent; cursor: pointer;"
            on:hoverchange={handleHoverChange}
            className="w-full h-full rounded-xl"
            on:click={openImagePopup}
          >
            <svelte:fragment slot="default" let:isHovering let:getItemStyle>
              <!-- Transparent overlay for entire card click handling -->
              <div 
                class="absolute inset-0 z-[90] cursor-pointer" 
                on:click={openImagePopup}
                aria-label="Click to open image gallery"
              ></div>
              
              <div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                   style:transform={getItemStyle(zValues.farBackground, {
                     xOffset: isHovering ? sineWave(currentTime, 3, 0.5) : 0,
                     yOffset: isHovering ? cosineWave(currentTime, 3, 0.3) : 0,
                     customDuration: 8,
                     customEasing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                   }).transform}
                   style:transition={getItemStyle(zValues.farBackground).transition}>
                <div class="w-full h-full bg-gradient-to-br from-indigo-950 to-slate-900 rounded-xl"></div>
              </div>
              
              <div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
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

              <div class="absolute inset-0 rounded-xl overflow-hidden cursor-pointer"
                   on:click={openImagePopup}
                   style:transform={getItemStyle(zValues.imageBase, {
                     xOffset: isHovering ? sineWave(currentTime, 10, 0.8) * -1 : 0,
                     yOffset: isHovering ? cosineWave(currentTime, 8, 0.5) * -1 : 0,
                     customDuration: 2,
                     customEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                   }).transform}
                   style:transition={getItemStyle(zValues.imageBase).transition}>
                <div class="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-b from-indigo-900/20 to-black/50">
                {#if item.images?.length > 0 && currentImage}
                  <ResponsiveImage
                    src={currentImage.image}
                    webpSrc={currentImage.webp_url || ''}
                    width={currentImage.width || 800}
                    height={currentImage.height || 600}
                    alt={item.title}
                    className="w-full h-full object-cover absolute inset-0 rounded-xl cursor-pointer"
                    objectFit="cover"
                    fallbackSrc="/placeholder.jpg"
                    fillContainer={true}
                    priority={true}
                    on:click={openImagePopup}
                    on:error={handleImageError}
                  />
                {:else}
                  <img
                    src="/placeholder.jpg"
                    alt={item.title}
                    class="w-full h-full object-cover absolute inset-0 rounded-xl cursor-pointer"
                    on:error={handleImageError}
                    on:click={openImagePopup}
                  />
                {/if}
                </div>
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent rounded-xl pointer-events-none"
                     style:opacity={isHovering ? 0.7 : 0.8}
                     style:transform={getItemStyle(zValues.overlay, {
                       yOffset: isHovering ? 5 : 0,
                       customDuration: 0.6
                     }).transform}
                     style:transition="all 0.6s cubic-bezier(0.23, 1, 0.32, 1)"></div>
              </div>
              
              {#if item.images?.length > 1}
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-[150] pointer-events-auto"
                    style:transform={getItemStyle(zValues.container - 10, {
                      yOffset: isHovering ? 10 : 0,
                    }).transform}
                    style:transition={getItemStyle(zValues.container - 10).transition}>
                {#each item.images as image, i}
                    <div 
                      class="h-12 w-12 rounded-md cursor-pointer transition-all duration-200 overflow-hidden {i === currentImageIndex ? 'ring-2 ring-indigo-400 scale-110 shadow-lg' : 'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-indigo-300/50'}"
                      on:click|stopPropagation={() => selectImage(i)}
                    >
                      {#if typeof image === 'object' && image.image && image.image !== 'null' && image.image !== 'undefined'}
                        <ResponsiveImage
                          src={image.image}
                          webpSrc={image.webp_url ? image.webp_url : ''}
                          width={100}
                          height={100}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                          objectFit="cover"
                          fallbackSrc="/placeholder.jpg"
                          priority={i === currentImageIndex}
                        />
                      {:else}
                        <img 
                          src="/placeholder.jpg" 
                          alt="Thumbnail placeholder" 
                          class="h-full w-full object-cover"
                          on:error={handleImageError}
                        />
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
              
              {#if isHovering}
                {#each Array(7) as _, i}
                  <div class="absolute w-2 h-2 rounded-full bg-white/30"
                       style:left={`${20 + i * 8}%`}
                       style:top={`${20 + (i % 5) * 10}%`}
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
            
              <div style:transform={getItemStyle(zValues.badge, {
                     scale: isHovering ? (1 + Math.sin(currentTime * 8) * 0.05) : 1,
                     xOffset: isHovering ? sineWave(currentTime, 3, 2) : 0,
                     yOffset: isHovering ? -5 : 0,
                     customDuration: 0.3,
                     customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                   }).transform}
                   style:transition={getItemStyle(zValues.badge).transition}
                   class="absolute top-6 left-6 z-[110] pointer-events-none">
                <span class="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg bg-indigo-600 text-white shadow-indigo-500/30">
                  {item.bids.length > 0
                    ? `${item.bids.length} BID${item.bids.length > 1 ? 'S' : ''}`
                    : 'NO BIDS YET'}
                </span>
              </div>

              <!-- Modified layout for the auction item card -->
              <div class="absolute inset-0 flex flex-col justify-end px-6 pb-6 pt-12 z-40 pointer-events-none"
              style:transform={getItemStyle(zValues.container).transform}
              style:transition={getItemStyle(zValues.container).transition}>

              <!-- Moved title, category, and description to the top of the card -->
              <div style:transform={getItemStyle(zValues.title, {
                  xOffset: isHovering ? 8 + sineWave(currentTime, 5, 1) : 0,
                  yOffset: isHovering ? -5 + cosineWave(currentTime, 3, 0.7) : 0,
                  customDuration: 0.5,
                  customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                }).transform}
                style:transition={getItemStyle(zValues.title).transition}
                class="mb-2 relative">
              <div class="absolute -left-1 -top-1 opacity-30 blur-sm"
                  style:transform={getItemStyle(zValues.titleShadow).transform}
                  style:transition={getItemStyle(zValues.titleShadow).transition}>
              <h3 class="text-2xl font-bold text-indigo-300">{item.title}</h3>
              </div>
              <h3 class="text-2xl font-bold text-white text-shadow-sharp relative">{item.title}</h3>
              </div>

              <div style:transform={getItemStyle(zValues.subtitle, {
                  xOffset: isHovering ? 12 + sineWave(currentTime, 3, 1.5) : 0,
                  yOffset: isHovering ? -2 + cosineWave(currentTime, 2, 0.5) : 0,
                  delay: 0.05,
                  customDuration: 0.6
                }).transform}
                style:transition={getItemStyle(zValues.subtitle).transition}
                class="mb-3">
              <p class="text-indigo-300 text-sm font-medium">
              {item.category.name}
              </p>
              </div>

              <div style:transform={getItemStyle(zValues.specs, {
                  yOffset: isHovering ? -3 : 0,
                  delay: 0.1,
                  customDuration: 0.7
                }).transform}
                style:transition={getItemStyle(zValues.specs).transition}
                class="mb-3">
              <p class="text-white/80 text-xs sm:text-sm line-clamp-2">
              {item.description}
              </p>
              </div>

              <!-- Positioned current bid price more prominently -->
              <div style:transform={getItemStyle(zValues.priceTag, {
                  scale: isHovering ? breathingAnimation(currentTime, 1, 1.08) : 1,
                  xOffset: isHovering ? sineWave(currentTime, 7, 0.7) : 0,
                  yOffset: isHovering ? -10 : 0,
                  delay: 0.15,
                  customDuration: 0.4,
                  customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                }).transform}
                style:transition={getItemStyle(zValues.priceTag).transition}
                class="mb-4">
              <div class="text-lg sm:text-xl font-bold text-white text-shadow-sharp"
                  style:transform={getItemStyle(zValues.priceText, {
                    scale: isHovering ? 1 + Math.sin(currentTime * 6) * 0.05 : 1
                  }).transform}>
              {timeRemaining?.isExpired ? "Final Bid: " : "Current Bid: "}{formatPrice(item.current_price)}
              </div>
              </div>

              <div class="relative z-[120] mt-2 pointer-events-none" on:click={stopPropagation}
                style:transform={getItemStyle(zValues.button, {
                  yOffset: isHovering ? 0 : 0,
                  delay: 0.2,
                  customDuration: 0.6,
                  customEasing: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                }).transform}
                style:transition={getItemStyle(zValues.button).transition}>

              {#if timeRemaining && !timeRemaining.isExpired}
              <p class="text-center text-sm text-white/80">
                Click anywhere on card to view all images
              </p>
              {:else}
              <p class="text-center text-sm text-white/80">
                Auction Ended
              </p>
              {/if}
              </div>
              </div>
            </svelte:fragment>
          </Enhanced3DCard>
        </div>

        <!-- Right column for auction info and bid history - spans 6 columns -->
        <div class="lg:col-span-6 flex flex-col gap-6">
          <!-- Auction Details Card - More compact -->
          <div class="rounded-lg backdrop-blur-md bg-white/5 p-5 border border-indigo-500/20 shadow-lg">
            <div class="flex justify-between items-start mb-3">
              <h2 class="text-2xl font-bold text-white">{item.title}</h2>
              <div class="text-sm rounded-full px-3 py-1 bg-indigo-900/50 border border-indigo-500/30 text-indigo-200">
                {item.category?.name || 'Knife'}
              </div>
            </div>
            
            <!-- Time remaining countdown -->
            <div class="mb-4">
              <p class="text-sm text-indigo-300 mb-2">Time Remaining:</p>
              <div class="grid grid-cols-4 gap-2 w-full">
                <div class="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-2 text-center">
                  <div class="text-xl font-bold text-white">{timeRemaining?.isExpired ? 0 : timeRemaining?.days || 0}</div>
                  <div class="text-xs text-indigo-300">Days</div>
                </div>
                <div class="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-2 text-center">
                  <div class="text-xl font-bold text-white">{timeRemaining?.isExpired ? 0 : timeRemaining?.hours || 0}</div>
                  <div class="text-xs text-indigo-300">Hours</div>
                </div>
                <div class="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-2 text-center">
                  <div class="text-xl font-bold text-white">{timeRemaining?.isExpired ? 0 : timeRemaining?.minutes || 0}</div>
                  <div class="text-xs text-indigo-300">Minutes</div>
                </div>
                <div class="bg-indigo-900/30 border border-indigo-500/20 rounded-lg p-2 text-center">
                  <div class="text-xl font-bold text-white">{timeRemaining?.isExpired ? 0 : timeRemaining?.seconds || 0}</div>
                  <div class="text-xs text-indigo-300">Seconds</div>
                </div>
              </div>
            </div>
            
            <!-- Price information -->
            <div class="flex justify-between items-center mb-4">
              <div>
                <p class="text-sm text-indigo-300">Starting Price:</p>
                <p class="text-lg text-white">{formatPrice(item.starting_price)}</p>
              </div>
              <div>
                <p class="text-sm text-indigo-300">{timeRemaining?.isExpired ? "Final Bid:" : "Current Bid:"}</p>
                <p class="text-2xl font-bold text-white">{formatPrice(item.current_price)}</p>
              </div>
            </div>
            
            <!-- Description - Moved from bottom to here for better visibility -->
            <div class="mb-4">
              <h3 class="text-lg font-bold text-white mb-2">Description</h3>
              <p class="text-white/80 text-sm whitespace-pre-line">{item.description}</p>
            </div>
            
            <!-- Bid input and button -->
            {#if !timeRemaining?.isExpired}
              {#if $isAuthenticated}
                <div class="flex space-x-2 mb-4">
                  <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white">$</span>
                    <input
                      type="number"
                      bind:value={bidAmount}
                      min={Math.ceil(item.current_price) + 1}
                      step="1"
                      on:focus={handleBidInputFocus}
                      class="w-full bg-indigo-900/30 border border-indigo-500/30 rounded-lg pl-8 pr-12 py-3 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter bid amount"
                    />
                    <div class="absolute inset-y-0 right-0 flex">
                      <button
                        on:click={decrementBid}
                        class="px-2 text-white hover:text-indigo-300 transition-colors"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      <button
                        on:click={incrementBid}
                        class="px-2 text-white hover:text-indigo-300 transition-colors"
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    on:click={submitBid}
                    disabled={isSubmittingBid}
                    class="bg-gradient-to-br from-indigo-600 to-indigo-800 
                           hover:from-indigo-500 hover:to-indigo-700 active:from-indigo-700 active:to-indigo-900
                           text-white px-6 py-3 rounded-lg text-base font-semibold
                           shadow-xl transition-all duration-300 ease-out
                           border border-indigo-400/30 cursor-pointer relative overflow-hidden group
                           disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span class="relative z-10 flex items-center justify-center">
                      {#if isSubmittingBid}
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      {:else}
                        Place Bid
                      {/if}
                    </span>
                  </button>
                </div>
                <p class="text-xs text-indigo-200 mb-3">
                  Minimum bid: {formatPrice(Math.ceil(item.current_price) + 1)}
                </p>
              {:else}
                <button
                  on:click={handleLoginClick}
                  class="w-full bg-gradient-to-br from-indigo-600 to-indigo-800 
                         hover:from-indigo-500 hover:to-indigo-700 active:from-indigo-700 active:to-indigo-900
                         text-white px-4 py-3 rounded-lg text-sm font-semibold 
                         shadow-xl transition-all duration-300 ease-out relative overflow-hidden
                         border border-indigo-400/30 group mb-2"
                >
                  <span class="relative z-10">Log In to Bid</span>
                </button>
                <p class="text-xs text-white/70 mb-3 text-center">
                  You must be logged in to place a bid
                </p>
              {/if}
            {/if}

            <!-- Share button -->
            <div class="flex justify-between items-center">
              <div class="text-sm text-white/80">
                <div>Total Bids: {item.bids.length}</div>
                <div>Unique Bidders: {new Set(item.bids.map(bid => bid.user_email)).size}</div>
              </div>
              <button
                class="flex items-center gap-2 rounded-md bg-indigo-800/50 px-3 py-2 text-white/90 hover:bg-indigo-700/50 transition"
                on:click={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showSuccessToast('Link copied to clipboard!');
                }}
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
          </div>

          <!-- Bid History - Now at the top of the right column -->
          {#if item.bids?.length > 0}
            <div class="rounded-lg backdrop-blur-md bg-white/5 p-5 border border-indigo-500/20 shadow-lg">
              <h3 class="text-xl font-bold text-white mb-3">Bid History</h3>
              
              <div class="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                <div class="space-y-2 divide-y divide-indigo-500/10">
                  {#each item.bids as bid, i}
                    {@const isRepeatBidder = item.bids
                      .slice(0, i)
                      .some(prevBid => prevBid.user_email === bid.user_email)}
                    
                    <div class="flex items-center py-3 transition-colors {i === 0 ? 'bg-indigo-900/20 rounded-md px-2' : ''}">
                      <div class="flex-grow">
                        <div class="flex items-center gap-2">
                          <p class="font-medium text-white {userColors[bid.user_email] || 'text-indigo-300'}">
                            {bid.user_nickname || 'User'}
                            <span class="ml-2 text-xs text-white/50">
                              ({maskEmail(bid.user_email)})
                            </span>
                          </p>
                          
                          {#if i === 0}
                            <span class="rounded bg-green-900/30 border border-green-500/30 px-2 py-0.5 text-xs text-green-400">
                              Highest
                            </span>
                          {/if}
                          
                          {#if isRepeatBidder}
                            <span class="rounded bg-indigo-900/30 border border-indigo-500/30 px-2 py-0.5 text-xs text-indigo-400">
                              Returning
                            </span>
                          {/if}
                        </div>
                        <p class="text-xs text-white/50">
                          {new Date(bid.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      <div class="text-right">
                        <span class="text-lg font-bold text-white">
                          {formatPrice(bid.amount)}
                        </span>
                        {#if i < item.bids.length - 1}
                          <div class="text-xs text-green-400">
                            +${(bid.amount - item.bids[i + 1].amount).toFixed(2)}
                          </div>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          {:else}
            <div class="rounded-lg backdrop-blur-md bg-white/5 p-5 border border-indigo-500/20 shadow-lg">
              <h3 class="text-xl font-bold text-white mb-3">Bid History</h3>
              <p class="text-center text-white/70 py-4">No bids yet. Be the first to bid!</p>
            </div>
          {/if}

          <!-- Video section - Positioned below bid history -->
          {#if item.youtube_url}
            <div class="rounded-lg backdrop-blur-md bg-white/5 p-5 border border-indigo-500/20 shadow-lg">
              <h3 class="text-xl font-bold text-white mb-3">Watch Video</h3>
              <YouTubeEmbed youtubeUrl={item.youtube_url} />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

{#if showBidModal}
  <BidModal {item} bind:show={showBidModal} initialBidAmount={bidAmount} on:bidPlaced={handleBidPlaced} />
{/if}

<Toast message={toastMessage} type="success" bind:show={showToast} /> 

{#if showImagePopup && item?.images?.length}
  <!-- Base backdrop with blur effect -->
  <div 
    class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xl"
    on:click={closeImagePopup}
  ></div>
  
  <!-- Main gallery container that doesn't close when clicked -->
  <div class="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none">
    <!-- Image content container - only this area will stop click propagation -->
    <div class="w-full max-w-5xl max-h-[92vh] pointer-events-none">
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 z-[1020] text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors shadow-lg hover:scale-105 pointer-events-auto"
        on:click={closeImagePopup}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Navigation buttons -->
      <button 
        class="absolute left-4 top-1/2 -translate-y-1/2 z-[1020] text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all shadow-lg hover:scale-110 hover:bg-indigo-900/70 pointer-events-auto"
        on:click={e => {e.stopPropagation(); navigatePopupImage('prev');}}
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        class="absolute right-4 top-1/2 -translate-y-1/2 z-[1020] text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all shadow-lg hover:scale-110 hover:bg-indigo-900/70 pointer-events-auto"
        on:click={e => {e.stopPropagation(); navigatePopupImage('next');}}
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- Image carousel content -->
      <div class="w-full p-4 pointer-events-none">
        <div class="grid grid-cols-1 gap-4">
          {#each item.images as image, i}
            <div 
              class="transition-all duration-300 ease-in-out pointer-events-none {i === popupImageIndex ? 'opacity-100 scale-100 z-50' : 'opacity-0 scale-95 absolute inset-0'}"
            >
              {#if i === popupImageIndex}
                <div class="relative w-full h-[70vh] overflow-hidden rounded-lg mx-auto bg-black/20 backdrop-blur-sm pointer-events-auto">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-full h-full max-w-full max-h-full relative">
                      {#if typeof image === 'object' && image.image && image.image !== 'null' && image.image !== 'undefined'}
                        <ResponsiveImage
                          src={image.image}
                          webpSrc={image.webp_url ? image.webp_url : ''}
                          width={image.width || 800}
                          height={image.height || 600}
                          alt={`${item.title} - Image ${i + 1}`}
                          className="w-full h-full object-contain rounded-lg"
                          objectFit="contain"
                          fallbackSrc="/placeholder.jpg"
                        />
                      {:else}
                        <img
                          src="/placeholder.jpg"
                          alt={`${item.title} - Image ${i + 1}`}
                          class="w-full h-full object-contain rounded-lg"
                        />
                      {/if}
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
        
        <!-- Thumbnails -->
        <div class="mt-4 flex justify-center space-x-3 overflow-x-auto py-2 pointer-events-auto">
          {#each item.images as image, i}
            <button 
              class="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 
                    {i === popupImageIndex ? 'ring-2 ring-indigo-400 scale-110 shadow-lg shadow-indigo-500/25' : 'opacity-60 hover:opacity-100 scale-100 hover:ring-1 hover:ring-indigo-400/50'}"
              on:click|stopPropagation={() => popupImageIndex = i}
            >
              {#if typeof image === 'object' && image.image && image.image !== 'null' && image.image !== 'undefined'}
                <ResponsiveImage
                  src={image.image}
                  webpSrc={image.webp_url ? image.webp_url : ''}
                  width={100}
                  height={100}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  objectFit="cover"
                  fallbackSrc="/placeholder.jpg"
                />
              {:else}
                <img
                  src="/placeholder.jpg"
                  alt={`Thumbnail ${i + 1}`}
                  class="w-full h-full object-cover"
                  on:error={handleImageError}
                />
              {/if}
            </button>
          {/each}
        </div>
        
        <!-- Image counter -->
        <div class="mt-2 text-center text-white/90 text-sm font-medium pointer-events-auto">
          {popupImageIndex + 1} / {item.images.length}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .pattern-grid {
    background-image: linear-gradient(rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99, 102, 241, 0.2) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  .text-shadow-sharp {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2);
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  
  .card-container {
    perspective: 2000px;
    transform-style: preserve-3d;
    overflow: visible !important;
    height: 100%;
    width: 100%;
  }
  
  :global(.enhanced-card),
  :global(.enhanced-card-wrapper) {
    overflow: visible !important;
    border-radius: 1.25rem;
    height: 100%;
    width: 100%;
    position: relative;
  }
  
  :global(.enhanced-card *),
  :global(.enhanced-card-wrapper *) {
    transform-style: preserve-3d !important;
  }

  :global(.enhanced-card img),
  :global(.enhanced-card .responsive-image) {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.5);
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
  }
  
  .bid-text-animation {
    display: inline-block;
    position: relative;
  }
  
  /* Remove default spinner buttons from number inputs */
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    appearance: none;
    margin: 0; 
  }
  
  input[type=number] {
    -moz-appearance: textfield;
  }
</style>