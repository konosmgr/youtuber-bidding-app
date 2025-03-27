import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Check if there's a saved preference in localStorage
function getInitialState() {
  if (browser) {
    const savedState = localStorage.getItem('audioEnabled');
    // Default to true if no preference is saved
    return savedState === null ? true : savedState === 'true';
  }
  return true;
}

// Create the store with the initial state
const audioEnabled = writable(getInitialState());

// Subscribe to changes and save to localStorage
if (browser) {
  audioEnabled.subscribe(value => {
    localStorage.setItem('audioEnabled', value.toString());
  });
}

export default audioEnabled; 