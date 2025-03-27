<script>
  import HoverTextButton from '$lib/components/ui/HoverTextButton.svelte';
  import { onMount } from 'svelte';
  
  let audioEnabled = true;
  
  // Function to toggle audio
  function toggleAudio() {
    audioEnabled = !audioEnabled;
  }
  
  // Check browser support for audio
  let audioSupported = false;
  
  onMount(() => {
    // Check if audio is supported in this browser
    const audio = new Audio();
    audioSupported = !!audio.canPlayType;
  });
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
  <div class="max-w-3xl w-full bg-gray-800/50 backdrop-blur-md rounded-xl p-8 shadow-xl">
    <h1 class="text-3xl font-bold mb-8 text-center">Audio Hover Effects</h1>
    
    <div class="mb-8 text-center">
      <button 
        on:click={toggleAudio}
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
      >
        {audioEnabled ? 'Disable Audio' : 'Enable Audio'}
      </button>
      
      {#if !audioSupported}
        <p class="mt-2 text-yellow-400">
          Note: Your browser may have limited audio support.
        </p>
      {/if}
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div class="bg-gray-800/80 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Standard Button</h2>
        <div class="flex justify-center">
          <HoverTextButton 
            text="Hover Me" 
            enableSound={audioEnabled}
            className="bg-amber-600/20 hover:bg-amber-600/30 rounded-md transition-colors"
          />
        </div>
      </div>
      
      <div class="bg-gray-800/80 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Link Button</h2>
        <div class="flex justify-center">
          <HoverTextButton 
            text="Click Me" 
            href="#" 
            enableSound={audioEnabled}
            className="bg-blue-600/20 hover:bg-blue-600/30 rounded-md transition-colors"
          />
        </div>
      </div>
      
      <div class="bg-gray-800/80 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Preserve Style</h2>
        <div class="flex justify-center">
          <HoverTextButton 
            text="Fancy Button" 
            enableSound={audioEnabled}
            preserveStyle={true}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 rounded-md shadow-lg hover:shadow-xl transition-all"
            highlightColor="#ffffff"
          />
        </div>
      </div>
      
      <div class="bg-gray-800/80 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Disabled Button</h2>
        <div class="flex justify-center">
          <HoverTextButton 
            text="Cannot Hover" 
            enableSound={audioEnabled}
            disabled={true}
            className="bg-gray-600/20 rounded-md"
          />
        </div>
      </div>
    </div>
    
    <div class="text-center text-sm text-gray-400">
      <p>Hover sound files:</p>
      <ul>
        <li>Hover In: <code>/audio/button-in.opus</code></li>
        <li>Hover Out: <code>/audio/button-out.opus</code></li>
      </ul>
    </div>
  </div>
</div> 