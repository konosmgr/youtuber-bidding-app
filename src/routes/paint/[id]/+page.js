// This file defines the loading functionality for the painting detail page
// It will run on both server-side and client-side navigation

// Force client-side rendering for this route
export const csr = true;
export const ssr = false; // Disable server-side rendering
export const prerender = false; // Disable prerendering

// Set up proper load function to fetch data
export async function load({ params, fetch }) {
  const id = params.id;
  
  try {
    console.log(`+page.js: Loading painting data for ID: ${id}`);
    // Fetch item data using the native fetch API
    const response = await fetch(`/api/items/${id}/`);
    
    if (!response.ok) {
      throw new Error(`Failed to load painting: HTTP error ${response.status}`);
    }
    
    const item = await response.json();
    console.log('+page.js: Raw API response:', { 
      id: item.id, 
      title: item.title, 
      hasImages: !!item.images,
      imageCount: item.images?.length || 0
    });

    // Pre-process images to ensure they're in the correct format
    if (item.images) {
      console.log('+page.js: Original images:', JSON.stringify(item.images));
      item.images = processImages(item.images);
      console.log('+page.js: Processed images:', JSON.stringify(item.images));
    }
    
    // Pre-calculate time remaining for the initial render
    const timeRemaining = getTimeRemaining(item.end_date);
    
    console.log('Loaded painting data in +page.js:', { id, imageCount: item.images?.length });
    
    // Return data to be accessible in the +page.svelte component
    return {
      item,
      timeRemaining,
      initialBidAmount: Math.ceil(item.current_price) + 1
    };
  } catch (error) {
    console.error('Error loading painting data:', error);
    return {
      item: null,
      error: error.message || 'Failed to load painting details',
      timeRemaining: null,
      initialBidAmount: 0
    };
  }
}

// Helper function to process images to a consistent format
function processImages(images) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [];
  }
  
  return images.map(img => {
    // Handle different possible image formats from API
    if (typeof img === 'string') {
      return {
        image: img,
        url: img,
        webp_url: '',
        width: 800,
        height: 600
      };
    }
    
    // Handle case where image is an object with 'image' or 'url' property
    if (typeof img === 'object') {
      return {
        image: img.image || img.url || '',
        url: img.image || img.url || '',
        webp_url: img.webp_url || '',
        width: img.width || 800,
        height: img.height || 600
      };
    }
    
    // Default fallback
    return {
      image: '/placeholder.jpg',
      url: '/placeholder.jpg',
      webp_url: '',
      width: 800,
      height: 600
    };
  });
}

// Copy of the getTimeRemaining function so it's available during load
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