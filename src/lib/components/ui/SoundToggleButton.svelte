<script>
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import audioEnabled from '$lib/stores/audio';
  import { browser } from '$app/environment';
  
  export let size = 36;
  
  let mounted = false;
  let animationFrame;
  let canvas;
  let ctx;
  let time = 0;
  
  // Spring animation for smooth transitions
  const animatedValue = spring(0, {
    stiffness: 0.1,
    damping: 0.4
  });
  
  // Update animation value when audioEnabled changes
  $: {
    if (mounted) {
      animatedValue.set($audioEnabled ? 1 : 0);
    }
  }
  
  function toggleAudio() {
    audioEnabled.update(value => !value);
  }
  
  // Draw sine wave animation
  function animate() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw sine wave only when audio is enabled
    if ($audioEnabled) {
      time += 0.1;
      
      // Draw sine wave
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#f9b639";
      
      const amplitude = height / 4 * $animatedValue;
      const frequency = 0.05;
      
      ctx.moveTo(0, height / 2);
      
      for (let x = 0; x < width; x++) {
        // Create a superposition of multiple sine waves for a more organic look
        const y = height / 2 + 
                 Math.sin((x * frequency) + time) * amplitude * 0.7 + 
                 Math.sin((x * frequency * 1.5) + time * 1.3) * amplitude * 0.3;
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      
      // Draw second wave with offset (lower opacity)
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(249, 182, 57, 0.4)";
      
      ctx.moveTo(0, height / 2);
      
      for (let x = 0; x < width; x++) {
        const y = height / 2 + 
                 Math.sin((x * frequency) + time * 0.7 + 1) * amplitude * 0.8 + 
                 Math.sin((x * frequency * 2) + time * 0.5) * amplitude * 0.2;
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
    } else {
      // Draw horizontal line when audio is disabled
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#6b7280";
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
    
    if (browser) {
      animationFrame = requestAnimationFrame(animate);
    }
  }
  
  onMount(() => {
    if (browser && canvas) {
      ctx = canvas.getContext('2d');
      mounted = true;
      
      // Set high DPI canvas
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = (size / 2) * dpr;
      ctx.scale(dpr, dpr);
      
      // Initialize animation value
      animatedValue.set($audioEnabled ? 1 : 0);
      
      // Start animation
      animate();
    }
    
    return () => {
      if (browser && animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });
  
  onDestroy(() => {
    if (browser && animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<button
  class="sound-toggle-button"
  style="width: {size}px; height: {size/2}px;"
  on:click={toggleAudio}
  aria-label="{$audioEnabled ? 'Disable' : 'Enable'} sound"
  title="{$audioEnabled ? 'Sound On' : 'Sound Off'}"
>
  <div class="absolute inset-0 sound-toggle-bg"></div>
  
  <canvas 
    bind:this={canvas} 
    width={size} 
    height={size/2} 
    class="absolute inset-0 w-full h-full" 
    style="transform: scale(0.9);"
  ></canvas>
</button>

<style>
  .sound-toggle-button {
    position: relative;
    cursor: pointer;
    border-radius: 12px;
    background: transparent;
    transition: all 0.3s ease;
    border: none;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
  }
  
  .sound-toggle-button:hover {
    transform: scale(1.05);
  }
  
  .sound-toggle-button:active {
    transform: scale(0.95);
  }
  
  .sound-toggle-bg {
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .sound-toggle-button:hover .sound-toggle-bg {
    background-color: rgba(251, 191, 36, 0.2);
    border-color: rgba(251, 191, 36, 0.3);
  }
</style> 