<script>
  import { fetchApi } from '$lib/utils/api';
  import { onDestroy, onMount } from 'svelte';
  import Enhanced3DCard from '$lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte';
  import AuctionCard from '$lib/components/ui/AuctionCard.svelte';
  import PastAuctionCard from '$lib/components/ui/PastAuctionCard.svelte';
  import { fade } from 'svelte/transition';

  let items = [];
  let loading = true;
  let error = null;
  let timerInterval;
  let searchTerm = '';
  let sortOption = 'ending-soon';
  
  // Past auctions state
  let pastItems = [];
  let loadingPast = true;
  let pastError = null;
  let showPastAuctions = true;
  let currentHoverCard = null;
  
  // Z-values for 3D card layers
  const zValues = {
    background: -200,
    backgroundPattern: -170,
    cardBackground: -150,
    image: -50,
    glow: -45,
    badge: 40,
    container: 30,
    title: 80,
    subtitle: 60,
    specs: 70,
    price: 100,
    button: 50,
    buttonIcon: 65
  };

  function sortItems(items, option) {
    return [...items].sort((a, b) => {
      switch (option) {
        case 'price-high':
          return b.current_price - a.current_price;
        case 'price-low':
          return a.current_price - b.current_price;
        case 'ending-soon':
          return new Date(a.end_date) - new Date(b.end_date);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });
  }

  function isAuctionEnded(endDate) {
    return new Date(endDate) < new Date();
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

  async function loadItems() {
    try {
      const data = await fetchApi('items/?active=true&category=MISC');
      
      items = data.results
        .filter(item => !isAuctionEnded(item.end_date))
        .map(item => ({
          ...item,
          timeRemaining: getTimeRemaining(item.end_date),
        }));
    } catch (e) {
      console.error('Error loading items:', e);
      error = 'Failed to load auctions';
    } finally {
      loading = false;
    }
  }
  
  // Map API item data to the format expected by AuctionCard
  function mapItemToAuctionCard(item) {
    // Create proper images array with all required properties
    let images = [];
    
    try {
      if (item.images && item.images.length > 0) {
        images = item.images.map(img => ({
          image: img.image || img.url || '',
          url: img.image || img.url || '',
          webp_url: img.webp_url || '',
          width: img.width || 800,
          height: img.height || 600
        }));
      } else if (item.image) {
        // Single image string
        images = [{
          image: item.image,
          url: item.image,
          webp_url: '',
          width: 800,
          height: 600
        }];
      } else if (item.thumbnail) {
        // Fallback to thumbnail
        images = [{
          image: item.thumbnail,
          url: item.thumbnail,
          webp_url: '',
          width: 800,
          height: 600
        }];
      }
    } catch (e) {
      console.error('Error processing images:', e);
      // Use a placeholder if there's an error
      images = [{ 
        image: '/images/placeholder.jpg',
        url: '/images/placeholder.jpg',
        webp_url: '',
        width: 800,
        height: 600
      }];
    }
    
    // Return a properly formatted object for the AuctionCard component
    return {
      id: item.id,
      name: item.title,
      youtuber: item.youtuber?.name || '',
      specs: extractSpecs(item),
      currentBid: item.current_price,
      startingPrice: item.starting_price || 0,
      label: item.is_featured ? 'FEATURED' : '',
      image: '',
      images: images,
      color: getItemColor(item).color,
      glowColor: getItemColor(item).glow,
      bids: item.bids?.length || 0,
      timeLeft: item.timeRemaining ? 
        `${item.timeRemaining.days > 0 ? item.timeRemaining.days + 'd ' : ''}${item.timeRemaining.hours}h ${item.timeRemaining.minutes}m` : '',
      category: 'MISC'
    };
  }
  
  async function loadPastItems() {
    loadingPast = true;
    pastError = null;
    
    try {
      // Use the working endpoint with the correct parameters
      const data = await fetchApi('items/?category=MISC&active=false');
      
      // This endpoint returns a paginated response object with a 'results' property
      const results = data.results || [];
      
      // Process each past auction item to ensure it has valid data
      pastItems = results
        .filter(item => item !== null)
        .map(item => {
          // Ensure current_price is a number to avoid NaN
          const current_price = typeof item.current_price === 'number' ? 
            item.current_price : 
            (typeof item.current_price === 'string' ? 
              parseFloat(item.current_price) : 0);
          
          // Return a properly formatted item
          return {
            ...item,
            current_price: current_price || 0,
            starting_price: item.starting_price || 0,
            title: item.title || 'Unknown Item',
            // Create proper images structure
            images: prepareItemImages(item),
            // Ensure category is set with the correct structure
            category: typeof item.category === 'object' && item.category !== null
              ? item.category
              : {
                  id: '',
                  name: 'Miscellaneous Items',
                  code: 'MISC'
                }
          };
        });
      
    } catch (err) {
      console.error('Error fetching past auctions:', err);
      pastError = err.message || "Failed to load past auctions";
      pastItems = [];
    } finally {
      loadingPast = false;
    }
  }

  // Extract specifications from the item
  function extractSpecs(item) {
    const specs = [];
    
    if (item.brand) specs.push(`Brand: ${item.brand}`);
    if (item.condition) specs.push(`Condition: ${item.condition}`);
    if (item.material) specs.push(`Material: ${item.material}`);
    if (item.size) specs.push(`Size: ${item.size}`);
    if (item.weight) specs.push(`Weight: ${item.weight}`);
    if (item.color) specs.push(`Color: ${item.color}`);
    if (item.dimensions) specs.push(`Dimensions: ${item.dimensions}`);
    
    // If we don't have any specific specs, use the description (if available)
    if (specs.length === 0 && item.description) {
      // Split description into sentences and use the first one or two as specs
      const sentences = item.description.split(/\.\s+/).filter(s => s.length > 0);
      if (sentences.length > 0) {
        // Use first two sentences or fewer if there aren't that many
        for (let i = 0; i < Math.min(2, sentences.length); i++) {
          specs.push(sentences[i]);
        }
      }
    }
    
    return specs;
  }

  // Get appropriate colors for the item
  function getItemColor(item) {
    // Misc items get teal/mint colors
    return {
      color: 'from-teal-600 to-emerald-600',
      glow: 'teal'
    };
  }

  // Prepare item images in a consistent format
  function prepareItemImages(item) {
    let images = [];
    
    try {
      if (item.images && item.images.length > 0) {
        images = item.images.map(img => ({
          image: img.image || img.url || '',
          url: img.image || img.url || '',
          webp_url: img.webp_url || '',
          width: img.width || 800,
          height: img.height || 600
        }));
      } else if (item.image) {
        // Single image string
        images = [{
          image: item.image,
          url: item.image,
          webp_url: '',
          width: 800,
          height: 600
        }];
      } else if (item.thumbnail) {
        // Fallback to thumbnail
        images = [{
          image: item.thumbnail,
          url: item.thumbnail,
          webp_url: '',
          width: 800,
          height: 600
        }];
      }
    } catch (e) {
      console.error('Error processing images:', e);
      // Use a placeholder if there's an error
      images = [{ 
        image: '/images/placeholder.jpg',
        url: '/images/placeholder.jpg',
        webp_url: '',
        width: 800,
        height: 600
      }];
    }
    
    return images;
  }

  // Setup timer to update time remaining
  function setupTimer() {
    updateTimeRemaining();
    timerInterval = setInterval(updateTimeRemaining, 1000);
  }

  function updateTimeRemaining() {
    items = items.map(item => ({
      ...item,
      timeRemaining: getTimeRemaining(item.end_date),
    }));
  }

  onMount(() => {
    loadItems();
    loadPastItems();
    setupTimer();
  });

  onDestroy(() => {
    clearInterval(timerInterval);
  });
</script>

<svelte:head>
  <title>Miscellaneous Items | Alaska Auctions</title>
  <meta name="description" content="Bid on miscellaneous items from Alaska youtubers" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col space-y-4 mb-12">
    <h1 class="text-4xl font-bold text-amber-500">Miscellaneous Items</h1>
    <p class="text-gray-300 max-w-3xl">
      Explore our diverse collection of unique miscellaneous items from your favorite Alaska youtubers.
      From outdoor gear and equipment to collectibles and memorabilia, there's something for everyone.
    </p>
  </div>
  
  <!-- Controls -->
  <div class="flex flex-col md:flex-row justify-between mb-8 gap-4">
    <div class="w-full md:w-64">
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search items..."
        class="w-full rounded-lg bg-gray-900/80 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
    
    <div class="flex space-x-4 items-center">
      <label for="sort" class="text-gray-300 whitespace-nowrap">Sort by:</label>
      <select
        id="sort"
        bind:value={sortOption}
        class="rounded-lg bg-gray-900/80 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <option value="ending-soon">Ending Soon</option>
        <option value="price-high">Highest Price</option>
        <option value="price-low">Lowest Price</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  </div>
  
  <!-- Current Auctions -->
  <h2 class="text-2xl font-semibold text-amber-500 mb-6">Current Auctions</h2>
  
  {#if loading}
    <div class="flex justify-center py-20">
      <div class="loader">Loading...</div>
    </div>
  {:else if error}
    <div class="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg">
      {error}
    </div>
  {:else if items.length === 0}
    <div class="bg-gray-900/50 border border-gray-800 text-gray-300 p-8 rounded-lg text-center">
      <p class="text-xl mb-2">No active miscellaneous auctions currently</p>
      <p>Check back soon for new items or browse our past auctions below!</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
      {#each sortItems(items, sortOption).filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())) as item (item.id)}
        <div transition:fade={{ duration: 300 }}>
          <AuctionCard
            item={mapItemToAuctionCard(item)}
            href={`/misc/${item.id}`}
          />
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Past Auctions Toggle -->
  <div class="flex items-center mb-6 gap-4">
    <h2 class="text-2xl font-semibold text-amber-500">Past Auctions</h2>
    <button 
      on:click={() => showPastAuctions = !showPastAuctions}
      class="text-sm text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 px-3 py-1 rounded-full transition"
    >
      {showPastAuctions ? 'Hide' : 'Show'}
    </button>
  </div>
  
  <!-- Past Auctions -->
  {#if showPastAuctions}
    {#if loadingPast}
      <div class="flex justify-center py-20">
        <div class="loader">Loading...</div>
      </div>
    {:else if pastError}
      <div class="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg mb-16">
        {pastError}
      </div>
    {:else if pastItems.length === 0}
      <div class="bg-gray-900/50 border border-gray-800 text-gray-300 p-8 rounded-lg text-center mb-16">
        <p>No past miscellaneous auctions found.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
        {#each pastItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())) as item (item.id)}
          <div transition:fade={{ duration: 300 }}>
            <PastAuctionCard 
              item={{
                id: item.id,
                title: item.title,
                youtuber: item.youtuber,
                current_price: item.current_price,
                starting_price: item.starting_price,
                specs: extractSpecs(item),
                images: item.images,
                bids: item.bids,
                description: item.description,
                category: item.category
              }}
            />
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .loader {
    border: 5px solid rgba(0, 128, 128, 0.1);
    border-radius: 50%;
    border-top: 5px solid rgba(0, 128, 128, 0.8);
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>