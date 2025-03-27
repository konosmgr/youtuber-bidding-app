// This file defines the loading functionality for the miscellaneous item detail page
// It will run on both server-side and client-side navigation

// Force client-side rendering for this route
export const csr = true;
export const ssr = false; // Disable server-side rendering
export const prerender = false; // Disable prerendering

// Set up proper load function to fetch data
export async function load({ params, fetch }) {
  const id = params.id;
  
  try {
    // Fetch item data using the native fetch API
    const response = await fetch(`/api/items/${id}/`);
    
    if (!response.ok) {
      throw new Error(`Failed to load item: HTTP error ${response.status}`);
    }
    
    const item = await response.json();
    
    // Pre-calculate time remaining for the initial render
    const timeRemaining = getTimeRemaining(item.end_date);
    
    // Return data to be accessible in the +page.svelte component
    return {
      item,
      timeRemaining,
      initialBidAmount: Math.ceil(item.current_price) + 1
    };
  } catch (error) {
    console.error('Error loading miscellaneous item data:', error);
    return {
      item: null,
      error: error.message || 'Failed to load item details',
      timeRemaining: null,
      initialBidAmount: 0
    };
  }
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