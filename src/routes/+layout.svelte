<script>
  import Navbar from '$lib/components/Navbar.svelte';
  import NicknameCheckWrapper from '$lib/components/NicknameCheckWrapper.svelte';
  import BeamsBackground from '$lib/components/ui/Background/BeamsBackground(Animated).svelte';
  import { isAuthenticated } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import '../app.css';

  let mounted = false;
  let backgroundType = 'beams'; // Options: 'beams', 'particles', 'waves', 'landscape'

  // Allow routes to override background
  $: {
    // No special case handling needed - use beams background for all pages
    backgroundType = 'beams';
  }

  onMount(async () => {
    // Check authentication status when component mounts
    await isAuthenticated.check();
    mounted = true;
  });
</script>

<svelte:head>
  <!-- Preload critical resources -->
  <link rel="preload" href="/favicon.png" as="image" />
  <link rel="preconnect" href="http://api:8000" />
  
  <!-- Improve paint performance -->
  <meta name="theme-color" content="#000000" />
  
  <!-- Optimize rendering -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<NicknameCheckWrapper currentPath={$page.url.pathname}>
  <BeamsBackground intensity="medium">
    <div class="flex flex-col min-h-screen w-full">
      {#if browser}
        <Navbar />
      {:else}
        <!-- Static placeholder for SSR -->
        <div class="h-16 w-full bg-gradient-to-b from-gray-900/90 to-black/70">
          <!-- Placeholder for navbar -->
        </div>
      {/if}
      <main class="flex-grow w-full">
        <slot />
      </main>
    </div>
  </BeamsBackground>
</NicknameCheckWrapper>

<style>
  /* Make sure body and html allow scrolling */
  :global(html, body) {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Optimize animations to use GPU acceleration */
  :global(.gpu-accelerated) {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
</style>
