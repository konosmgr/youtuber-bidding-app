<script>
  import { onMount } from 'svelte';
  import StaggeredCard from '$lib/components/test-components/StaggeredCard.svelte';
  
  // Interactive control states for staggered effects
  let staggerStep = 0.05;
  let staggerDistance = 50;
  let staggerDirection = 'forward';
  let zBehavior = 'hybrid';
  let hoverZScale = 2;
  let perspective = 1800;
  let transitionDuration = 0.3;
  
  // Demo card content
  let items = [
    "Premium UI component with unique staggered effects",
    "Elements enter and exit with coordinated timing",
    "Control the direction and intensity of animations",
    "Perfect for product cards, feature lists, and more"
  ];
  
  // Direction options for the dropdown
  const directionOptions = [
    { value: 'forward', label: 'Forward (First to Last)' },
    { value: 'reverse', label: 'Reverse (Last to First)' },
    { value: 'from-center', label: 'From Center' }
  ];
  
  // Z-behavior options for the dropdown
  const zBehaviorOptions = [
    { value: 'flat', label: 'Flat (Elements at Z=0 until hover)' },
    { value: 'hybrid', label: 'Hybrid (Background has depth, foreground flat until hover)' },
    { value: 'subtle', label: 'Subtle (All elements have some depth, enhanced on hover)' }
  ];
  
  // Function to reset to defaults
  function resetDefaults() {
    staggerStep = 0.05;
    staggerDistance = 50;
    staggerDirection = 'forward';
    zBehavior = 'hybrid';
    hoverZScale = 2;
    perspective = 1800;
    transitionDuration = 0.3;
  }
</script>

<svelte:head>
  <title>Staggered 3D Card Effects | Interactive Demo</title>
</svelte:head>

<div class="example-container">
  <div class="control-panel">
    <h2>Staggered Effect Controls</h2>
    
    <div class="control-group">
      <label for="stagger-step">Stagger Delay: {staggerStep}s</label>
      <input type="range" id="stagger-step" min="0.01" max="0.2" step="0.01" bind:value={staggerStep} />
      <p class="description">Time delay between each element's animation</p>
    </div>
    
    <div class="control-group">
      <label for="stagger-distance">Movement Distance: {staggerDistance}px</label>
      <input type="range" id="stagger-distance" min="0" max="200" step="10" bind:value={staggerDistance} />
      <p class="description">How far elements move during animation</p>
    </div>
    
    <div class="control-group">
      <label for="stagger-direction">Stagger Direction:</label>
      <select id="stagger-direction" bind:value={staggerDirection} class="select-input">
        {#each directionOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      <p class="description">Order in which elements animate</p>
    </div>
    
    <div class="control-group">
      <label for="z-behavior">Z-Axis Behavior:</label>
      <select id="z-behavior" bind:value={zBehavior} class="select-input">
        {#each zBehaviorOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      <p class="description">How elements behave in 3D space</p>
    </div>
    
    <div class="control-group">
      <label for="hover-z-scale">Z Scale on Hover: {hoverZScale}×</label>
      <input type="range" id="hover-z-scale" min="1" max="3" step="0.1" bind:value={hoverZScale} />
      <p class="description">How much Z values are amplified on hover</p>
    </div>
    
    <div class="control-group">
      <label for="perspective">Perspective: {perspective}px</label>
      <input type="range" id="perspective" min="1000" max="2500" step="100" bind:value={perspective} />
      <p class="description">Intensity of the 3D effect</p>
    </div>
    
    <div class="control-group">
      <label for="transition-duration">Animation Speed: {transitionDuration}s</label>
      <input type="range" id="transition-duration" min="0.1" max="1" step="0.05" bind:value={transitionDuration} />
      <p class="description">Duration of the transition animation</p>
    </div>
    
    <button class="reset-button" on:click={resetDefaults}>
      Reset to Defaults
    </button>
  </div>
  
  <div class="showcase-container">
    <h2 class="showcase-title">Staggered 3D Card</h2>
    <p class="showcase-description">
      Hover over the card to see the staggered 3D effect in action. Adjust the controls to customize the behavior.
    </p>
    
    <div class="card-showcase">
      <StaggeredCard 
        {staggerStep}
        {staggerDistance}
        {staggerDirection}
        {zBehavior}
        {hoverZScale}
        {perspective}
        {transitionDuration}
        title="Premium 3D Card"
        subtitle="With staggered animations"
        items={items}
        ctaText="Buy this Component"
        badgeText="PREMIUM"
      />
    </div>
    
    <div class="technical-details">
      <h3>How It Works</h3>
      <p>
        Unlike standard 3D cards, this component implements a true staggered animation system where elements:
      </p>
      <ul>
        <li>Enter and exit with coordinated timing based on their position</li>
        <li>Move along X, Y, and Z axes simultaneously</li>
        <li>Can be configured to animate in different sequences (forward, reverse, from center)</li>
        <li>Have customizable Z-behavior for different resting and hover states</li>
      </ul>
      <p>
        This creates a much more dynamic and engaging user experience compared to standard hover effects.
      </p>
    </div>
  </div>
</div>

<style>
  .example-container {
    display: grid;
    grid-template-columns: 320px 1fr;
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
    height: fit-content;
    position: sticky;
    top: 2rem;
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
    font-weight: 500;
    color: #4b5563;
  }
  
  .description {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
    font-style: italic;
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
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    background: #2563eb;
  }
  
  .select-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
  }
  
  .reset-button {
    width: 100%;
    padding: 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 1rem;
  }
  
  .reset-button:hover {
    background: #2563eb;
  }
  
  .showcase-container {
    display: flex;
    flex-direction: column;
  }
  
  .showcase-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }
  
  .showcase-description {
    margin-bottom: 2rem;
    color: #4b5563;
  }
  
  .card-showcase {
    height: 550px;
    max-width: 400px;
    margin: 0 auto 2rem auto;
  }
  
  .technical-details {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f1f5f9;
    border-radius: 0.75rem;
  }
  
  .technical-details h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  .technical-details p {
    margin-bottom: 1rem;
    color: #4b5563;
  }
  
  .technical-details ul {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
    color: #4b5563;
  }
  
  .technical-details li {
    margin-bottom: 0.5rem;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .example-container {
      grid-template-columns: 1fr;
    }
    
    .control-panel {
      position: static;
    }
  }
</style> 