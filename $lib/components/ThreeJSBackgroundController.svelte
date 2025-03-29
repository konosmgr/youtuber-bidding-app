<script>
  import { onMount } from 'svelte';
  import ThreeJSBackground from './ui/3JS/ThreeJSBackground.svelte';
  import ThreeJSWaveBackground from './ui/3JS/ThreeJSWaveBackground.svelte';
  import ThreeJSLandscape from './ui/3JS/ThreeJSLandscape.svelte';
  
  export let backgroundType = 'particles'; // Default background type
  
  // Configuration for each background type
  export let particlesConfig = {
    color: '#6495ed',
    particleCount: 1500,
    particleSize: 0.05,
    speed: 0.0005
  };
  
  export let waveConfig = {
    color1: '#4a5568',
    color2: '#2b6cb0',
    segments: 100,
    speed: 0.5,
    amplitude: 0.3,
    frequency: 0.5
  };
  
  export let landscapeConfig = {
    baseColor: '#3182ce',
    peakColor: '#718096',
    segments: 64,
    amplitude: 2.5,
    rotationSpeed: 0.0001
  };
  
  // Performance optimization - reduce animation quality on mobile
  let isMobile = false;
  
  onMount(() => {
    // Check if mobile device
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Adjust particle count and segment counts for mobile
    if (isMobile) {
      particlesConfig.particleCount = 500;
      waveConfig.segments = 50;
      landscapeConfig.segments = 32;
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
  />
{:else if backgroundType === 'landscape'}
  <ThreeJSLandscape 
    baseColor={landscapeConfig.baseColor}
    peakColor={landscapeConfig.peakColor}
    segments={landscapeConfig.segments}
    amplitude={landscapeConfig.amplitude}
    rotationSpeed={landscapeConfig.rotationSpeed}
  />
{/if} 