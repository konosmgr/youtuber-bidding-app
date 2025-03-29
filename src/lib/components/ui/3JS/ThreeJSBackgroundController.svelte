<script>
  import { onMount } from 'svelte';
  import ThreeJSBackground from './ThreeJSBackground.svelte';
  import ThreeJSWaveBackground from './ThreeJSWaveBackground.svelte';
  import ThreeJSLandscape from './ThreeJSLandscape.svelte';
  import ThreeJSSmokeBackground from './ThreeJSSmokeBackground.svelte';
  
  export let backgroundType = 'particles'; // Default background type
  
  // Configuration for each background type
  export let particlesConfig = {
    color: '#6495ed',
    particleCount: 1500,
    particleSize: 0.05,
    speed: 0.0005
  };
  
  export let waveConfig = {
    color1: '#1a365d', // Deep blue
    color2: '#7dd3fc', // Light blue
    segments: 128, 
    speed: 0.4,
    amplitude: 0.4,
    frequency: 0.6,
    layers: 3
  };
  
  export let landscapeConfig = {
    baseColor: '#0f172a', // Dark base color
    middleColor: '#334155', // Middle color
    peakColor: '#e2e8f0', // Light peak color
    segments: 128,
    amplitude: 3.5,
    rotationSpeed: 0.0002,
    fogAmount: 0.6,
    starCount: 2000
  };
  
  export let smokeConfig = {
    color: '#8b5cf6', // Purple smoke
    density: 1000,
    size: 2.0,
    speed: 0.2,
    turbulence: 0.3
  };
  
  // Performance optimization - reduce animation quality on mobile
  let isMobile = false;
  
  onMount(() => {
    // Check if mobile device
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Adjust settings for mobile
    if (isMobile) {
      // Particles
      particlesConfig.particleCount = 500;
      particlesConfig.particleSize = 0.07; // Larger particles for visibility
      
      // Waves
      waveConfig.segments = 64;
      waveConfig.layers = 2;
      
      // Landscape
      landscapeConfig.segments = 48;
      landscapeConfig.starCount = 800;
      
      // Smoke
      smokeConfig.density = 400;
    }
  });
</script>

{#if backgroundType === 'particles'}
  <ThreeJSBackground 
    color={particlesConfig.color}
    particleCount={particlesConfig.particleCount}
    particleSize={particlesConfig.particleSize}
    speed={particlesConfig.speed}
  />
{:else if backgroundType === 'waves'}
  <ThreeJSWaveBackground 
    color1={waveConfig.color1}
    color2={waveConfig.color2}
    segments={waveConfig.segments}
    speed={waveConfig.speed}
    amplitude={waveConfig.amplitude}
    frequency={waveConfig.frequency}
    layers={waveConfig.layers}
  />
{:else if backgroundType === 'landscape'}
  <ThreeJSLandscape 
    baseColor={landscapeConfig.baseColor}
    middleColor={landscapeConfig.middleColor}
    peakColor={landscapeConfig.peakColor}
    segments={landscapeConfig.segments}
    amplitude={landscapeConfig.amplitude}
    rotationSpeed={landscapeConfig.rotationSpeed}
    fogAmount={landscapeConfig.fogAmount}
    starCount={landscapeConfig.starCount}
  />
{:else if backgroundType === 'smoke'}
  <ThreeJSSmokeBackground 
    color={smokeConfig.color}
    density={smokeConfig.density}
    size={smokeConfig.size}
    speed={smokeConfig.speed}
    turbulence={smokeConfig.turbulence}
  />
{/if} 