<script>
  import { fetchApi } from '$lib/utils/api';
  import { onDestroy, onMount } from 'svelte';
  import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';
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

  function handleImageError(e) {
    e.currentTarget.src = '/placeholder.jpg';
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

  function updateAllTimers() {
    items = items.map(item => ({
      ...item,
      timeRemaining: getTimeRemaining(item.end_date),
    }));
  }

  async function loadItems() {
    try {
      const data = await fetchApi('items/?active=true');
      
      items = data.results
        .filter(item => !isAuctionEnded(item.end_date))
        .map(item => ({
          ...item,
          timeRemaining: getTimeRemaining(item.end_date),
        }));
    } catch (e) {
      error = `Failed to load auctions: ${e.message}`;
      console.error('Error loading auctions:', e);
    } finally {
      loading = false;
    }
  }

  async function loadPastItems() {
    loadingPast = true;
    pastError = null;
    
    try {
      // Get completed auctions
      const data = await fetchApi('items/?active=false');
      
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
                  name: 'Miscellaneous',
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

  // Helper function to prepare images for both current and past auctions
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
      console.error('Error processing images for past item:', e);
    }
    
    // Return a valid images array or a placeholder
    return images.length > 0 ? images : [{ 
      image: '/images/placeholder.jpg',
      url: '/images/placeholder.jpg',
      webp_url: '',
      width: 800,
      height: 600
    }];
  }

  // Extract relevant specs from item description
  function extractSpecs(item) {
    let specs = [];
    
    if (item.highlights) {
      // Use highlights if available, but limit to 3 meaningful points
      specs = item.highlights.split(',')
        .map(s => s.trim())
        .filter(s => s && s.length > 3)
        .slice(0, 3);
    } else if (item.description) {
      // Extract more meaningful information from description
      const descLines = item.description
        .replace(/•/g, '.')  // Convert bullets to periods
        .replace(/- /g, '. ') // Convert dashes to periods
        .split('.')
        .map(s => s.trim())
        .filter(s => s.length > 5 && s.length < 60);
      
      specs = descLines.slice(0, 3);
    }
    
    // Get item condition if available
    if (item.condition) {
      specs.unshift(`Condition: ${item.condition}`);
      specs = specs.slice(0, 3);
    }
    
    return specs.length > 0 ? specs : ['Alaskan youtuber item', 'Final sale', 'No returns'];
  }
  
  // Create color assignment for consistent colors
  function getItemColor(item) {
    const colors = [
      { color: 'blue', glow: '#60a5fa' },
      { color: 'indigo', glow: '#818cf8' },
      { color: 'purple', glow: '#a78bfa' },
      { color: 'emerald', glow: '#34d399' },
      { color: 'amber', glow: '#fbbf24' },
      { color: 'rose', glow: '#fb7185' }
    ];
    
    const idNum = parseInt(item.id.toString().replace(/\D/g, '')) || 0;
    const colorIndex = Math.abs(idNum % colors.length);
    return colors[colorIndex];
  }

  // Map API item data to the format expected by AuctionCard
  function mapItemToAuctionCard(item) {
    // Create proper images array with all required properties
    let images = prepareItemImages(item);
    
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
      category: item.category?.code || 'MISC'
    };
  }

  onMount(async () => {
    await loadItems();
    await loadPastItems();
    timerInterval = setInterval(updateAllTimers, 1000);
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });
</script>

<svelte:head>
  <title>Alaska Youtuber Auctions</title>
  <meta name="description" content="Bid on exclusive items from your favorite Alaskan youtubers" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex flex-col space-y-4 mb-12">
    <h1 class="text-4xl font-bold text-blue-500">Alaska Youtuber Auctions</h1>
    <p class="text-gray-300 max-w-3xl">
      Bid on unique and authentic items from your favorite Alaska youtubers. Each piece comes with a story from the Last Frontier.
    </p>
  </div>
  
  <!-- Controls -->
  <div class="flex flex-col md:flex-row justify-between mb-8 gap-4">
    <div class="w-full md:w-64">
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search auctions..."
        class="w-full rounded-lg bg-gray-900/80 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <div class="flex space-x-4 items-center">
      <label for="sort" class="text-gray-300 whitespace-nowrap">Sort by:</label>
      <select
        id="sort"
        bind:value={sortOption}
        class="rounded-lg bg-gray-900/80 border border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="ending-soon">Ending Soon</option>
        <option value="price-high">Highest Price</option>
        <option value="price-low">Lowest Price</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  </div>
  
  <!-- Current Auctions -->
  <h2 class="text-2xl font-semibold text-blue-500 mb-6">Current Auctions</h2>
  
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
      <p class="text-xl mb-2">No active auctions currently</p>
      <p>Check back soon for new items or browse our past auctions below!</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
      {#each items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())) as item (item.id)}
        <div transition:fade={{ duration: 300 }} class="card-wrapper perspective-container">
          <AuctionCard
            item={mapItemToAuctionCard(item)}
            cardHeight="h-[500px]"
            hoverScale={1.1}
            href={`/${item.category?.code?.toLowerCase() || 'misc'}/${item.id}`}
          />
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Past Auctions Toggle -->
  <div class="flex items-center mb-6 gap-4">
    <h2 class="text-2xl font-semibold text-blue-500">Past Auctions</h2>
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
        <p>No past auctions found.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
        {#each pastItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())) as item (item.id)}
          <div transition:fade={{ duration: 300 }} class="auction-card-wrapper">
            <PastAuctionCard 
              item={item}
              cardHeight="h-[450px]"
              hoverScale={1.08}
              containerClass="z-10"
            />
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #3498db;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .perspective-container {
    perspective: 1000px;
  }
</style>
