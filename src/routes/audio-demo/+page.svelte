<script>
  import HoverTextButton from '$lib/components/ui/HoverTextButton.svelte';
  import { browser } from '$app/environment';
  let audioEnabled = true;
  
  function toggleAudio() {
    audioEnabled = !audioEnabled;
  }
</script>

<svelte:head>
  <title>Audio Button Demo</title>
</svelte:head>

<div class="container mx-auto p-8 max-w-4xl">
  <h1 class="text-4xl font-bold mb-6 text-center text-white">HoverTextButton with Audio Demo</h1>
  
  <div class="bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-xl">
    <div class="mb-8 text-center">
      <p class="text-gray-200 mb-4">Hover over the buttons below to hear the audio feedback. The "in" sound plays when you hover onto a button, and the "out" sound plays when you hover away.</p>
      
      <label class="flex items-center justify-center gap-2 text-white cursor-pointer">
        <input type="checkbox" bind:checked={audioEnabled} class="w-4 h-4">
        <span>Audio {audioEnabled ? 'Enabled' : 'Disabled'}</span>
      </label>
    </div>
    
    <div class="grid gap-8 mb-8">
      <div class="p-6 bg-gray-800/50 rounded-lg">
        <h2 class="text-2xl font-semibold mb-4 text-amber-400">Default Style</h2>
        <div class="flex flex-wrap gap-4 justify-center">
          <HoverTextButton 
            text="CONTACT" 
            href="/contact"
            {audioEnabled}
          />
          
          <HoverTextButton 
            text="ABOUT US" 
            href="/about"
            {audioEnabled}
          />
          
          <HoverTextButton 
            text="GALLERY" 
            href="/gallery"
            {audioEnabled}
          />
        </div>
      </div>
      
      <div class="p-6 bg-gray-800/50 rounded-lg">
        <h2 class="text-2xl font-semibold mb-4 text-amber-400">Custom Colors</h2>
        <div class="flex flex-wrap gap-4 justify-center">
          <HoverTextButton 
            text="PRIMARY" 
            color="#ffffff"
            highlightColor="#3b82f6"
            {audioEnabled}
          />
          
          <HoverTextButton 
            text="SUCCESS" 
            color="#ffffff"
            highlightColor="#10b981"
            {audioEnabled}
          />
          
          <HoverTextButton 
            text="DANGER" 
            color="#ffffff"
            highlightColor="#ef4444"
            {audioEnabled}
          />
        </div>
      </div>
      
      <div class="p-6 bg-gray-800/50 rounded-lg">
        <h2 class="text-2xl font-semibold mb-4 text-amber-400">Button with PreserveStyle</h2>
        <div class="flex flex-wrap gap-4 justify-center">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300">
            <HoverTextButton 
              text="PRIMARY BUTTON" 
              preserveStyle={true}
              {audioEnabled}
            />
          </button>
          
          <div class="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-md">
            <HoverTextButton 
              text="GRADIENT BUTTON" 
              preserveStyle={true}
              {audioEnabled}
            />
          </div>
        </div>
      </div>
      
      <div class="p-6 bg-gray-800/50 rounded-lg">
        <h2 class="text-2xl font-semibold mb-4 text-amber-400">Disabled State</h2>
        <div class="flex flex-wrap gap-4 justify-center">
          <HoverTextButton 
            text="DISABLED" 
            disabled={true}
            {audioEnabled}
          />
        </div>
      </div>
    </div>
    
    <div class="text-center">
      <HoverTextButton 
        text="BACK TO HOME" 
        href="/"
        {audioEnabled}
      />
    </div>
  </div>
</div>

<style>
  :global(body) {
    background: linear-gradient(to bottom, #1a1a2e, #222240);
    min-height: 100vh;
  }
</style> 