<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    goto('/x/threejs');
  });
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="text-center">
    <h1 class="text-2xl font-bold mb-4">Redirecting to Three.js Showcase...</h1>
    <p>If you're not redirected automatically, <a href="/x/threejs" class="text-blue-500 underline">click here</a>.</p>
  </div>
</div> 