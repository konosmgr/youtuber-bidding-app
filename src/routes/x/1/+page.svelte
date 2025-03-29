<script>
  import { onMount } from 'svelte';
  import CardShowcase from '$lib/components/ui/3d-card/test-components/3dcardshowcase1.svelte';
  
  // Interactive control states
  let hoverZScale = 2.5;
  let maxRotation = 12;
  let glowColor = "#8b5cf6";
  let perspective = 1500;
  
  // Animation state
  let isAnimating = false;
  let animationClass = '';
  
  // Function to handle animations
  function triggerAnimation() {
    isAnimating = true;
    animationClass = 'pulse-animation';
    
    setTimeout(() => {
      isAnimating = false;
      animationClass = '';
    }, 1000);
  }
</script>

<svelte:head>
  <title>Premium 3D Cards | Interactive Demo</title>
</svelte:head>

<div class="example-container">
  <div class="control-panel">
    <h2>Interactive Controls</h2>
    
    <div class="control-group">
      <label for="hover-scale">Hover Z Scale: {hoverZScale}x</label>
      <input type="range" id="hover-scale" min="1" max="4" step="0.1" bind:value={hoverZScale} />
    </div>
    
    <div class="control-group">
      <label for="max-rotation">Max Rotation: {maxRotation}°</label>
      <input type="range" id="max-rotation" min="5" max="20" step="1" bind:value={maxRotation} />
    </div>
    
    <div class="control-group">
      <label for="glow-color">Glow Color</label>
      <input type="color" id="glow-color" bind:value={glowColor} />
    </div>
    
    <div class="control-group">
      <label for="perspective">Perspective: {perspective}px</label>
      <input type="range" id="perspective" min="500" max="2500" step="100" bind:value={perspective} />
    </div>
    
    <button class="trigger-button" on:click={triggerAnimation}>
      Trigger Animation
    </button>
  </div>
  
  <div class="card-showcase">
    <CardShowcase 
      {hoverZScale}
      {maxRotation}
      {glowColor}
      {perspective}
      class={animationClass}
      hoverIntentDelay={300}
    />
  </div>
</div>

<style>
  .example-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 2rem auto;
    padding: 1rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .control-panel {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .control-panel h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  
  .control-group {
    margin-bottom: 1.25rem;
  }
  
  .control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  input[type="range"] {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #e5e7eb;
    border-radius: 0.25rem;
    outline: none;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #8b5cf6;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    background: #7c3aed;
  }
  
  input[type="color"] {
    width: 100%;
    height: 2.5rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  .trigger-button {
    width: 100%;
    padding: 0.75rem;
    background: #8b5cf6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .trigger-button:hover {
    background: #7c3aed;
  }
  
  .card-showcase {
    height: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Pulse animation */
  .pulse-animation {
    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1);
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .example-container {
      grid-template-columns: 1fr;
    }
  }
</style>
