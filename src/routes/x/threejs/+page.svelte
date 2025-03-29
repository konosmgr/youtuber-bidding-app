<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  // Correct import path for the Three.js components
  import ThreeJSBackgroundController from '$lib/components/ui/3JS/ThreeJSBackgroundController.svelte';
  
  let activeBackground = 'particles';
  let colorOptions = {
    particles: '#6495ed',
    waves: {
      color1: '#1a365d',
      color2: '#7dd3fc'
    },
    landscape: {
      baseColor: '#0f172a',
      middleColor: '#334155',
      peakColor: '#e2e8f0'
    },
    smoke: '#8b5cf6'
  };
  
  // Particle config
  let particleCount = 1500;
  let particleSize = 0.05;
  let particleSpeed = 0.0005;
  
  // Wave config
  let waveSegments = 128;
  let waveSpeed = 0.4;
  let waveAmplitude = 0.4;
  let waveFrequency = 0.6;
  let waveLayers = 3;
  
  // Landscape config
  let landscapeSegments = 128;
  let landscapeAmplitude = 3.5;
  let landscapeRotationSpeed = 0.0002;
  let landscapeFogAmount = 0.6;
  let landscapeStarCount = 2000;
  
  // Smoke config
  let smokeDensity = 1000;
  let smokeSize = 2.0;
  let smokeSpeed = 0.2;
  let smokeTurbulence = 0.3;
  
  // Update URL when background changes
  $: if (browser && activeBackground) {
    const url = new URL(window.location);
    url.searchParams.set('bg', activeBackground);
    history.replaceState({}, '', url);
  }
  
  onMount(() => {
    // Check if background type is specified in URL params
    if (browser) {
      const params = new URLSearchParams(window.location.search);
      const bgParam = params.get('bg');
      if (bgParam && ['particles', 'waves', 'landscape', 'smoke'].includes(bgParam)) {
        activeBackground = bgParam;
      }
    }
  });
  
  // Color pickers for each background type
  function handleParticleColorChange(e) {
    colorOptions.particles = e.target.value;
  }
  
  function handleWaveColor1Change(e) {
    colorOptions.waves.color1 = e.target.value;
  }
  
  function handleWaveColor2Change(e) {
    colorOptions.waves.color2 = e.target.value;
  }
  
  function handleLandscapeBaseColorChange(e) {
    colorOptions.landscape.baseColor = e.target.value;
  }
  
  function handleLandscapeMiddleColorChange(e) {
    colorOptions.landscape.middleColor = e.target.value;
  }
  
  function handleLandscapePeakColorChange(e) {
    colorOptions.landscape.peakColor = e.target.value;
  }
  
  function handleSmokeColorChange(e) {
    colorOptions.smoke = e.target.value;
  }
</script>

<style>
  :global(body) {
    background: linear-gradient(to bottom, #111827, #0f172a);
  }
</style>

<svelte:head>
  <title>Three.js Background Showcase | Youtuber Bidding</title>
  <meta name="description" content="Interactive showcase of Three.js background effects" />
</svelte:head>

<div class="flex flex-col items-center min-h-screen w-full text-white px-4 py-8 md:px-8">
  <div class="w-full max-w-5xl z-10 backdrop-blur-md bg-black/30 rounded-xl p-6 border border-white/10">
    <h1 class="text-4xl font-bold mb-2 text-amber-400">Three.js Background Showcase</h1>
    <p class="text-lg mb-8 text-white/80">Interactive WebGL backgrounds powered by Three.js</p>
    
    <div class="bg-amber-900/30 border border-amber-600/30 rounded-md p-4 mb-6">
      <p class="text-amber-200">
        <strong>Note:</strong> This page uses a special layout configuration that prevents the standard BeamsBackground from interfering with the Three.js backgrounds. The main site now uses BeamsBackground consistently across all other pages.
      </p>
    </div>
    
    <!-- Background selector -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button 
        class="px-4 py-2 rounded-lg transition-all duration-300 {activeBackground === 'particles' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-white/70 hover:bg-gray-700'}"
        on:click={() => activeBackground = 'particles'}
      >
        Particles
      </button>
      <button 
        class="px-4 py-2 rounded-lg transition-all duration-300 {activeBackground === 'waves' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white/70 hover:bg-gray-700'}"
        on:click={() => activeBackground = 'waves'}
      >
        Waves
      </button>
      <button 
        class="px-4 py-2 rounded-lg transition-all duration-300 {activeBackground === 'landscape' ? 'bg-green-600 text-white' : 'bg-gray-800 text-white/70 hover:bg-gray-700'}"
        on:click={() => activeBackground = 'landscape'}
      >
        Landscape
      </button>
      <button 
        class="px-4 py-2 rounded-lg transition-all duration-300 {activeBackground === 'smoke' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white/70 hover:bg-gray-700'}"
        on:click={() => activeBackground = 'smoke'}
      >
        Smoke
      </button>
    </div>
    
    <!-- Control panels -->
    <div class="mb-8">
      {#if activeBackground === 'particles'}
        <div class="bg-gray-900/50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-4 text-amber-400">Particle Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-white/90">Particle Color</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  value={colorOptions.particles} 
                  on:input={handleParticleColorChange}
                  class="h-10 w-20 rounded cursor-pointer"
                />
                <span class="font-mono">{colorOptions.particles}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Particle Count</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="100" 
                  max="5000" 
                  bind:value={particleCount}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{particleCount}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Particle Size</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.2" 
                  step="0.01" 
                  bind:value={particleSize}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{particleSize.toFixed(2)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Animation Speed</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.0001" 
                  max="0.002" 
                  step="0.0001" 
                  bind:value={particleSpeed}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{particleSpeed.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>
      {:else if activeBackground === 'waves'}
        <div class="bg-gray-900/50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-4 text-blue-400">Wave Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-white/90">Deep Color</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  value={colorOptions.waves.color1} 
                  on:input={handleWaveColor1Change}
                  class="h-10 w-20 rounded cursor-pointer"
                />
                <span class="font-mono">{colorOptions.waves.color1}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Surface Color</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  value={colorOptions.waves.color2} 
                  on:input={handleWaveColor2Change}
                  class="h-10 w-20 rounded cursor-pointer"
                />
                <span class="font-mono">{colorOptions.waves.color2}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Wave Segments</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="32" 
                  max="256" 
                  bind:value={waveSegments}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{waveSegments}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Wave Speed</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.1" 
                  max="2" 
                  step="0.1" 
                  bind:value={waveSpeed}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{waveSpeed.toFixed(1)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Wave Amplitude</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  bind:value={waveAmplitude}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{waveAmplitude.toFixed(2)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Wave Frequency</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.1" 
                  max="2" 
                  step="0.1" 
                  bind:value={waveFrequency}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{waveFrequency.toFixed(1)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Wave Layers</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  step="1" 
                  bind:value={waveLayers}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{waveLayers}</span>
              </div>
            </div>
          </div>
        </div>
      {:else if activeBackground === 'landscape'}
        <div class="bg-gray-900/50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-4 text-green-400">Landscape Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-white/90">Base Color</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  value={colorOptions.landscape.baseColor} 
                  on:input={handleLandscapeBaseColorChange}
                  class="h-10 w-20 rounded cursor-pointer"
                />
                <span class="font-mono">{colorOptions.landscape.baseColor}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Middle Color</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  value={colorOptions.landscape.middleColor} 
                  on:input={handleLandscapeMiddleColorChange}
                  class="h-10 w-20 rounded cursor-pointer"
                />
                <span class="font-mono">{colorOptions.landscape.middleColor}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Peak Color</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  value={colorOptions.landscape.peakColor} 
                  on:input={handleLandscapePeakColorChange}
                  class="h-10 w-20 rounded cursor-pointer"
                />
                <span class="font-mono">{colorOptions.landscape.peakColor}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Detail Level</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="32" 
                  max="192" 
                  bind:value={landscapeSegments}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{landscapeSegments}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Mountain Height</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.5" 
                  max="5" 
                  step="0.1" 
                  bind:value={landscapeAmplitude}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{landscapeAmplitude.toFixed(1)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Rotation Speed</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.00001" 
                  max="0.001" 
                  step="0.00001" 
                  bind:value={landscapeRotationSpeed}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{landscapeRotationSpeed.toFixed(5)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Fog Amount</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  bind:value={landscapeFogAmount}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{landscapeFogAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Star Count</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100" 
                  bind:value={landscapeStarCount}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{landscapeStarCount}</span>
              </div>
            </div>
          </div>
        </div>
      {:else if activeBackground === 'smoke'}
        <div class="bg-gray-900/50 p-4 rounded-lg">
          <h2 class="text-xl font-semibold mb-4 text-purple-400">Smoke Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-2 text-white/90">Smoke Color</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  value={colorOptions.smoke} 
                  on:input={handleSmokeColorChange}
                  class="h-10 w-20 rounded cursor-pointer"
                />
                <span class="font-mono">{colorOptions.smoke}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Smoke Density</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="100" 
                  max="3000" 
                  step="100" 
                  bind:value={smokeDensity}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{smokeDensity}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Particle Size</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.5" 
                  max="5" 
                  step="0.1" 
                  bind:value={smokeSize}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{smokeSize.toFixed(1)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Smoke Speed</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.05" 
                  max="1" 
                  step="0.05" 
                  bind:value={smokeSpeed}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{smokeSpeed.toFixed(2)}</span>
              </div>
            </div>
            
            <div>
              <label class="block mb-2 text-white/90">Turbulence</label>
              <div class="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  bind:value={smokeTurbulence}
                  class="w-full"
                />
                <span class="font-mono min-w-[4rem] text-right">{smokeTurbulence.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Usage instructions -->
    <div class="bg-gray-900/50 p-4 rounded-lg mb-8">
      <h2 class="text-xl font-semibold mb-2 text-white">How to Use These Backgrounds</h2>
      <p class="mb-4 text-white/80">
        While the main site uses BeamsBackground across all pages for consistency, you can still use these Three.js backgrounds in specific components or pages where needed by importing the ThreeJSBackgroundController component.
      </p>
      
      <div class="bg-gray-800 p-4 rounded font-mono text-sm overflow-auto mb-4">
        <pre>&lt;script&gt;
  import ThreeJSBackgroundController from '$lib/components/ui/3JS/ThreeJSBackgroundController.svelte';
&lt;/script&gt;

&lt;!-- Add background to your page --&gt;
&lt;ThreeJSBackgroundController 
  backgroundType="{activeBackground}"
  /* Additional configs omitted for brevity */
/&gt;</pre>
      </div>
      
      <p class="text-white/80">
        This allows you to create immersive experiences within individual components while maintaining the site's overall visual consistency with BeamsBackground.
      </p>
    </div>
    
    <!-- Code snippets for current config -->
    <div class="bg-gray-900/50 p-4 rounded-lg">
      <h2 class="text-xl font-semibold mb-2 text-white">Current Configuration Code</h2>
      <p class="mb-4 text-white/80">Copy this code to use your current configuration:</p>
      
      <div class="bg-gray-800 p-4 rounded font-mono text-sm overflow-auto">
        {#if activeBackground === 'particles'}
          <pre>&lt;ThreeJSBackgroundController 
  backgroundType="particles"
  particlesConfig=&#123;&#123; 
    color: "{colorOptions.particles}", 
    particleCount: {particleCount},
    particleSize: {particleSize}, 
    speed: {particleSpeed} 
  &#125;&#125; 
/&gt;</pre>
        {:else if activeBackground === 'waves'}
          <pre>&lt;ThreeJSBackgroundController 
  backgroundType="waves"
  waveConfig=&#123;&#123; 
    color1: "{colorOptions.waves.color1}",
    color2: "{colorOptions.waves.color2}", 
    segments: {waveSegments},
    speed: {waveSpeed},
    amplitude: {waveAmplitude},
    frequency: {waveFrequency},
    layers: {waveLayers}
  &#125;&#125; 
/&gt;</pre>
        {:else if activeBackground === 'landscape'}
          <pre>&lt;ThreeJSBackgroundController 
  backgroundType="landscape"
  landscapeConfig=&#123;&#123; 
    baseColor: "{colorOptions.landscape.baseColor}",
    middleColor: "{colorOptions.landscape.middleColor}",
    peakColor: "{colorOptions.landscape.peakColor}", 
    segments: {landscapeSegments},
    amplitude: {landscapeAmplitude},
    rotationSpeed: {landscapeRotationSpeed},
    fogAmount: {landscapeFogAmount},
    starCount: {landscapeStarCount}
  &#125;&#125; 
/&gt;</pre>
        {:else if activeBackground === 'smoke'}
          <pre>&lt;ThreeJSBackgroundController 
  backgroundType="smoke"
  smokeConfig=&#123;&#123; 
    color: "{colorOptions.smoke}", 
    density: {smokeDensity},
    size: {smokeSize}, 
    speed: {smokeSpeed},
    turbulence: {smokeTurbulence}
  &#125;&#125; 
/&gt;</pre>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Three.js Background Controller -->
{#if browser}
  <ThreeJSBackgroundController 
    backgroundType={activeBackground}
    particlesConfig={{
      color: colorOptions.particles,
      particleCount: particleCount,
      particleSize: particleSize,
      speed: particleSpeed
    }}
    waveConfig={{
      color1: colorOptions.waves.color1,
      color2: colorOptions.waves.color2,
      segments: waveSegments,
      speed: waveSpeed,
      amplitude: waveAmplitude,
      frequency: waveFrequency,
      layers: waveLayers
    }}
    landscapeConfig={{
      baseColor: colorOptions.landscape.baseColor,
      middleColor: colorOptions.landscape.middleColor,
      peakColor: colorOptions.landscape.peakColor,
      segments: landscapeSegments,
      amplitude: landscapeAmplitude,
      rotationSpeed: landscapeRotationSpeed,
      fogAmount: landscapeFogAmount,
      starCount: landscapeStarCount
    }}
    smokeConfig={{
      color: colorOptions.smoke,
      density: smokeDensity,
      size: smokeSize,
      speed: smokeSpeed,
      turbulence: smokeTurbulence
    }}
  />
{/if} 