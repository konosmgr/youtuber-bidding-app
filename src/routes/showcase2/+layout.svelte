<script>
  import { onMount } from 'svelte';
  import '../../app.css';
  
  // Add a class to the body for this specific page to override global styles
  onMount(() => {
    document.body.classList.add('showcase-body');
    
    return () => {
      document.body.classList.remove('showcase-body');
    };
  });
</script>

<div class="showcase-container">
  <slot />
</div>

<style>
  :global(body.showcase-body) {
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: #0C0E16;
    color: #FAF5F0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .showcase-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
  }
</style> 