<script>
  import { onMount } from 'svelte';
  
  // Card dimensions
  const width = 400;
  const height = 600;
  const perspective = 1200;
  
  // State
  let isHovering = false;
  let mouseX = 0;
  let mouseY = 0;
  let rotateX = 0;
  let rotateY = 0;
  
  // Card ref to get dimensions
  let cardRef;
  
  // Debug mode
  let showDebugGrid = false;
  
  // Elements with explicit Z positioning
  const elements = [
    {
      id: 'badge',
      label: 'PREMIUM',
      x: 75,
      y: 5,
      z: 150,
      size: 'sm',
      color: 'red',
      visible: true
    },
    {
      id: 'title',
      label: 'Z-Depth Demo',
      x: 10,
      y: 10,
      z: 100,
      size: 'xl',
      color: 'white',
      visible: true
    },
    {
      id: 'subtitle',
      label: 'TRUE 3D EFFECTS',
      x: 10,
      y: 18,
      z: 70,
      size: 'md',
      color: 'indigo',
      visible: true
    },
    {
      id: 'feature1',
      label: '✓ Proper Z-depth transforms',
      x: 10,
      y: 28,
      z: 50,
      size: 'md',
      color: 'green',
      visible: true
    },
    {
      id: 'feature2',
      label: '✓ Elements at different depths',
      x: 10,
      y: 36,
      z: 40,
      size: 'md',
      color: 'green',
      visible: true
    },
    {
      id: 'feature3',
      label: '✓ Responsive transforms',
      x: 10,
      y: 44,
      z: 30,
      size: 'md',
      color: 'green',
      visible: true
    },
    {
      id: 'price',
      label: '$69',
      x: 10,
      y: 80,
      z: -30,
      size: '2xl',
      color: 'white',
      visible: true
    },
    {
      id: 'original-price',
      label: '$99',
      x: 28,
      y: 80,
      z: -50,
      size: 'lg line-through',
      color: 'gray',
      visible: true
    },
    {
      id: 'button',
      label: 'GET ACCESS',
      x: 65,
      y: 80,
      z: 120,
      size: 'md',
      color: 'button',
      visible: true
    },
    {
      id: 'background',
      label: '',
      x: 0,
      y: 0,
      z: -80,
      size: 'full',
      color: 'bg',
      visible: true
    },
    {
      id: 'grid',
      label: '',
      x: 0,
      y: 0,
      z: -60,
      size: 'full',
      color: 'grid',
      visible: true
    }
  ];
  
  // Z-axis positions for debug grid
  const zPositions = [150, 100, 50, 0, -50, -100];
  
  function handleMouseMove(event) {
    if (!cardRef) return;
    
    const rect = cardRef.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (-1 to 1)
    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    
    // Apply rotation based on mouse position
    rotateY = mouseX * 20; // -20 to 20 degrees
    rotateX = mouseY * -20; // 20 to -20 degrees (inverted for natural feel)
  }
  
  function activateCard() {
    isHovering = true;
  }
  
  function deactivateCard() {
    isHovering = false;
    
    // Reset rotation gradually
    const resetSpeed = 0.05;
    const resetInterval = setInterval(() => {
      rotateX *= 1 - resetSpeed;
      rotateY *= 1 - resetSpeed;
      
      // Stop when close to zero
      if (Math.abs(rotateX) < 0.1 && Math.abs(rotateY) < 0.1) {
        rotateX = 0;
        rotateY = 0;
        clearInterval(resetInterval);
      }
    }, 16);
  }
  
  function toggleDebugGrid() {
    showDebugGrid = !showDebugGrid;
  }
  
  // Get element style based on size
  function getElementStyle(element) {
    // Position in percentage
    const left = `${element.x}%`;
    const top = `${element.y}%`;
    
    // Apply different styles based on element type
    let elementClass = '';
    let style = '';
    
    switch (element.color) {
      case 'red':
        elementClass = 'badge';
        break;
      case 'white':
        elementClass = 'text-white';
        break;
      case 'indigo':
        elementClass = 'text-indigo';
        break;
      case 'green':
        elementClass = 'text-green';
        break;
      case 'gray':
        elementClass = 'text-gray';
        break;
      case 'button':
        elementClass = 'button';
        break;
      case 'bg':
        elementClass = 'card-bg';
        break;
      case 'grid':
        elementClass = 'grid-overlay';
        break;
    }
    
    // Size classes
    let sizeClass = '';
    switch (element.size) {
      case 'sm':
        sizeClass = 'text-sm';
        break;
      case 'md':
        sizeClass = 'text-md';
        break;
      case 'lg':
        sizeClass = 'text-lg';
        break;
      case 'xl':
        sizeClass = 'text-xl';
        break;
      case '2xl':
        sizeClass = 'text-2xl';
        break;
      case 'full':
        sizeClass = 'full-size';
        break;
    }
    
    // Special cases
    if (element.size.includes('line-through')) {
      sizeClass += ' line-through';
    }
    
    // Generate transform with proper translateZ
    const transform = `translateZ(${element.z}px)`;
    
    return {
      classes: `card-element ${elementClass} ${sizeClass}`,
      style: `left: ${left}; top: ${top}; transform: ${transform};`
    };
  }
  
  onMount(() => {
    // Optional: Trigger animations or initial state on mount
  });
</script>

<svelte:head>
  <title>Z-Depth Demo | 3D Card</title>
</svelte:head>

<div class="page-container">
  <div class="controls">
    <h1>Z-Depth Demonstration</h1>
    <p>A pure CSS 3D implementation with proper Z transforms</p>
    
    <div class="actions">
      <button class="debug-button" on:click={toggleDebugGrid}>
        {showDebugGrid ? 'Hide' : 'Show'} Debug Grid
      </button>
      
      <div class="legend">
        <div class="legend-item">
          <span class="dot closer"></span>
          <span>Closer to viewer (positive Z)</span>
        </div>
        <div class="legend-item">
          <span class="dot further"></span>
          <span>Further from viewer (negative Z)</span>
        </div>
      </div>
    </div>
  </div>

  <div class="showcase">
    <!-- 3D Card -->
    <div class="card-container">
      <div 
        bind:this={cardRef}
        class="card"
        style="
          width: {width}px;
          height: {height}px;
          transform: perspective({perspective}px) rotateX({rotateX}deg) rotateY({rotateY}deg);
        "
        on:mousemove={handleMouseMove}
        on:mouseenter={activateCard}
        on:mouseleave={deactivateCard}
      >
        <!-- Card elements -->
        {#each elements as element (element.id)}
          {#if element.visible}
            {@const elementStyle = getElementStyle(element)}
            <div 
              class={elementStyle.classes} 
              style={elementStyle.style}
              data-z={element.z}
            >
              {#if element.id === 'background' || element.id === 'grid'}
                <!-- Background elements -->
              {:else}
                {element.label}
                
                <!-- Z-indicator for debugging -->
                {#if showDebugGrid}
                  <span class="z-indicator">z: {element.z}px</span>
                {/if}
              {/if}
            </div>
          {/if}
        {/each}
        
        <!-- Debug grid showing Z planes -->
        {#if showDebugGrid}
          {#each zPositions as z}
            <div 
              class="z-plane"
              style="transform: translateZ({z}px);"
            >
              z={z}px
            </div>
          {/each}
        {/if}
      </div>
    </div>
    
    <!-- Z-level controller -->
    <div class="z-controller">
      <h3>Element Z-Position Controls</h3>
      
      <div class="sliders">
        {#each elements.filter(e => e.id !== 'background' && e.id !== 'grid') as element (element.id)}
          <div class="slider-row">
            <label>
              {element.id} ({element.z}px)
              <input 
                type="range" 
                min="-150" 
                max="150" 
                bind:value={element.z} 
              />
            </label>
            <label class="toggle">
              <input type="checkbox" bind:checked={element.visible} />
              Visible
            </label>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  /* Page Layout */
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    min-height: 100vh;
    background-color: #0f172a;
    color: #e2e8f0;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .controls {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #8b5cf6, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.25rem;
    color: #94a3b8;
    margin-bottom: 1.5rem;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .debug-button {
    background: #334155;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .debug-button:hover {
    background: #475569;
  }
  
  .legend {
    display: flex;
    gap: 1.5rem;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #cbd5e1;
  }
  
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  
  .closer {
    background: #10b981;
  }
  
  .further {
    background: #3b82f6;
  }
  
  /* Showcase Layout */
  .showcase {
    display: flex;
    gap: 4rem;
    align-items: flex-start;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* 3D Card */
  .card-container {
    flex: 1;
    display: flex;
    justify-content: center;
    perspective: 1500px;
    transform-style: preserve-3d;
  }
  
  .card {
    position: relative;
    border-radius: 20px;
    transform-style: preserve-3d;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    background-color: transparent;
    transition: transform 0.1s ease-out;
    overflow: hidden;
  }
  
  /* Card Elements */
  .card-element {
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    font-weight: 600;
  }
  
  /* Element Types */
  .badge {
    background-color: #ef4444;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.75rem;
  }
  
  .text-white {
    color: white;
    font-weight: 700;
  }
  
  .text-indigo {
    color: #a5b4fc;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  
  .text-green {
    color: #6ee7b7;
  }
  
  .text-gray {
    color: #94a3b8;
  }
  
  .button {
    background-color: #6366f1;
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.875rem;
    letter-spacing: 0.025em;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
  }
  
  .card-bg {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1e293b, #0f172a);
  }
  
  .grid-overlay {
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  /* Size Classes */
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-md {
    font-size: 1rem;
  }
  
  .text-lg {
    font-size: 1.25rem;
  }
  
  .text-xl {
    font-size: 1.875rem;
  }
  
  .text-2xl {
    font-size: 2.25rem;
  }
  
  .full-size {
    width: 100%;
    height: 100%;
  }
  
  .line-through {
    text-decoration: line-through;
  }
  
  /* Z Debugging */
  .z-indicator {
    position: absolute;
    top: 100%;
    left: 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    background: rgba(0, 0, 0, 0.5);
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    margin-top: 0.25rem;
    white-space: nowrap;
  }
  
  .z-plane {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(59, 130, 246, 0.2);
    border: 1px dashed rgba(59, 130, 246, 0.5);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    width: 80%;
    height: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  
  /* Controls */
  .z-controller {
    flex: 1;
    max-width: 400px;
    background: rgba(30, 41, 59, 0.5);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(100, 116, 139, 0.2);
  }
  
  .z-controller h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #a5b4fc;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .sliders {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .slider-row label {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    flex: 1;
    font-size: 0.875rem;
    color: #cbd5e1;
  }
  
  input[type=range] {
    width: 100%;
    accent-color: #6366f1;
  }
  
  .toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: row;
    flex: 0 0 auto;
  }
  
  .toggle input {
    width: auto;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .showcase {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    
    .z-controller {
      max-width: 600px;
      width: 100%;
    }
  }
</style> 