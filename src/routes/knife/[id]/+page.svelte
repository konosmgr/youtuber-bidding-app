<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  // Simple redirect using window.location for maximum reliability
  onMount(() => {
    const id = $page.params.id;
    console.log('Redirecting from knife to knives, ID:', id);
    window.location.href = `/knives/${id}`;
  });
</script>

<div class="min-h-screen flex items-center justify-center">
  <div class="text-center">
    <h1 class="text-2xl font-bold">Redirecting...</h1>
    <p class="mt-2">Taking you to the knife details page</p>
  </div>
</div>