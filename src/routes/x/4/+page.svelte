<script>
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  
  // Card properties
  let width = 400;
  let height = 600;
  let perspective = 1000;
  let cardRotateX = 0;
  let cardRotateY = 0;
  let isHovering = false;
  let mouseX = 0;
  let mouseY = 0;
  
  // Spring physics for smooth animation
  let items = [
    {
      id: 'badge',
      label: 'PREMIUM',
      x: 80,
      y: 30,
      z: spring(0),
      targetZ: 120,
      delay: 0,
      size: 'small',
      color: '#ef4444',
      textColor: 'white'
    },
    {
      id: 'title',
      label: 'The Ultimate 3D Card',
      x: 30, 
      y: 80,
      z: spring(0),
      targetZ: 100,
      delay: 100,
      size: 'large',
      color: '#f8fafc',
      textColor: '#1e293b'
    },
    {
      id: 'subtitle',
      label: 'WITH STAGGERED DEPTH ANIMATIONS',
      x: 30,
      y: 120,
      z: spring(0),
      targetZ: 80,
      delay: 150,
      size: 'medium',
      color: '#94a3b8',
      textColor: '#1e293b'
    },
    {
      id: 'feature1',
      label: '✓ Staggered animations at different depths',
      x: 30,
      y: 180,
      z: spring(0),
      targetZ: 60,
      delay: 200,
      size: 'small',
      color: '#a7f3d0',
      textColor: '#065f46'
    },
    {
      id: 'feature2',
      label: '✓ Smooth spring physics for realistic motion',
      x: 30,
      y: 220,
      z: spring(0),
      targetZ: 50,
      delay: 250,
      size: 'small',
      color: '#a7f3d0',
      textColor: '#065f46'
    },
    {
      id: 'feature3',
      label: '✓ Dynamic shadows and lighting effects',
      x: 30,
      y: 260,
      z: spring(0),
      targetZ: 40,
      delay: 300,
      size: 'small',
      color: '#a7f3d0',
      textColor: '#065f46'
    },
    {
      id: 'price',
      label: '$49',
      x: 40,
      y: 500,
      z: spring(0),
      targetZ: -20,
      delay: 350,
      size: 'xlarge',
      color: 'transparent',
      textColor: '#f8fafc'
    },
    {
      id: 'button',
      label: 'GET ACCESS',
      x: 260,
      y: 500,
      z: spring(0),
      targetZ: 150,
      delay: 400,
      size: 'medium',
      color: '#8b5cf6',
      textColor: 'white'
    }
  ];
  
  // Card glowing effects
  let glowOpacity = 0;
  let glowX = 50;
  let glowY = 50;
  
  function handleMouseMove(event) {
    if (!isHovering) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Normalized mouse position (-0.5 to 0.5)
    mouseX = ((event.clientX - rect.left) / rect.width) - 0.5;
    mouseY = ((event.clientY - rect.top) / rect.height) - 0.5;
    
    // Update card rotation
    cardRotateY = mouseX * 20; // -10 to 10 degrees
    cardRotateX = mouseY * -20; // -10 to 10 degrees
    
    // Update glow position
    glowX = (mouseX + 0.5) * 100;
    glowY = (mouseY + 0.5) * 100;
  }
  
  function activateCard() {
    isHovering = true;
    
    // Animate each element to its target Z position with staggered delays
    items.forEach(item => {
      setTimeout(() => {
        item.z.set(item.targetZ);
      }, item.delay);
    });
    
    glowOpacity = 0.7;
  }
  
  function deactivateCard() {
    isHovering = false;
    
    // Reset all Z positions in reverse order with staggered delays
    [...items].reverse().forEach((item, index) => {
      setTimeout(() => {
        item.z.set(0);
      }, index * 50);
    });
    
    cardRotateX = 0;
    cardRotateY = 0;
    glowOpacity = 0;
  }
  
  // Automatic animation on page load and periodically
  let animationTimeout;
  let isAnimating = false;
  
  function triggerAutoAnimation() {
    if (isAnimating) return;
    
    isAnimating = true;
    activateCard();
    
    // Simulate mouse movement
    const simulateMovement = () => {
      const t = (Date.now() % 4000) / 4000; // 0 to 1 over 4 seconds
      mouseX = Math.sin(t * Math.PI * 2) * 0.3;
      mouseY = Math.cos(t * Math.PI * 2) * 0.2;
      
      cardRotateY = mouseX * 20;
      cardRotateX = mouseY * -20;
      
      glowX = (mouseX + 0.5) * 100;
      glowY = (mouseY + 0.5) * 100;
      
      if (isAnimating) {
        requestAnimationFrame(simulateMovement);
      }
    };
    
    simulateMovement();
    
    // Reset after 5 seconds
    setTimeout(() => {
      isAnimating = false;
      deactivateCard();
      
      // Schedule next animation after a pause
      animationTimeout = setTimeout(triggerAutoAnimation, 3000);
    }, 5000);
  }
  
  onMount(() => {
    // Start initial animation after a short delay
    animationTimeout = setTimeout(triggerAutoAnimation, 1000);
    
    return () => {
      clearTimeout(animationTimeout);
      isAnimating = false;
    };
  });
  
  // Size utility function
  function getSizeClass(size) {
    switch(size) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-2xl';
      case 'xlarge': return 'text-4xl';
      default: return 'text-base';
    }
  }
  
  // In the script section, add a function to safely get the z value
  function getZValue(item) {
    // Return the current value of the spring
    return item.z.stiffness ? item.z.get() : 0;
  }
</script>

<svelte:head>
  <title>Staggered 3D Depth Animation</title>
</svelte:head>

<div class="showcase-container">
  <div class="description">
    <h1>Staggered 3D Depth Animation</h1>
    <p>Elements animate in sequence at different z-depths, creating a rich spatial experience</p>
    <button class="trigger-button" on:click={triggerAutoAnimation} disabled={isAnimating}>
      Trigger Animation
    </button>
  </div>
  
  <div 
    class="card-container"
    on:mousemove={handleMouseMove}
    on:mouseenter={activateCard}
    on:mouseleave={deactivateCard}
  >
    <div 
      class="card"
      style="
        width: {width}px;
        height: {height}px;
        transform: perspective({perspective}px) rotateX({cardRotateX}deg) rotateY({cardRotateY}deg);
      "
    >
      <!-- Background elements -->
      <div class="card-background"></div>
      <div class="card-grid-overlay"></div>
      
      <!-- Glowing effect -->
      <div 
        class="glow-effect"
        style="
          background: radial-gradient(circle at {glowX}% {glowY}%, rgba(139, 92, 246, 0.8), rgba(0, 0, 0, 0) 70%);
          opacity: {glowOpacity};
        "
      ></div>
      
      <!-- Card elements that will animate at different depths -->
      {#each items as item (item.id)}
        <div 
          class="card-element {getSizeClass(item.size)}"
          style="
            left: {item.x}px;
            top: {item.y}px;
            transform: translateZ({getZValue(item)}px);
            background-color: {item.color};
            color: {item.textColor};
          "
        >
          {item.label}
        </div>
      {/each}
      
      <!-- Depth indicators (visible when card is active) -->
      {#if isHovering}
        <div class="depth-indicators" transition:fade={{ duration: 300 }}>
          <div class="depth-plane" style="transform: translateZ(150px)">z: 150px</div>
          <div class="depth-plane" style="transform: translateZ(100px)">z: 100px</div>
          <div class="depth-plane" style="transform: translateZ(50px)">z: 50px</div>
          <div class="depth-plane" style="transform: translateZ(0px)">z: 0px</div>
          <div class="depth-plane" style="transform: translateZ(-50px)">z: -50px</div>
        </div>
      {/if}
    </div>
  </div>
  
  <div class="instructions">
    <p>Hover over the card to activate the 3D effect manually, or press the button above to trigger the animation automatically.</p>
    <p>Notice how elements animate in and out at different depths with staggered timing.</p>
  </div>
</div>

<style>
  :global(body) {
    background-color: #0f172a;
    color: #f8fafc;
    margin: 0;
    padding: 0;
  }
  
  .showcase-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }
  
  .description {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #8b5cf6, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: #94a3b8;
    margin-bottom: 1.5rem;
    font-size: 1.125rem;
  }
  
  .trigger-button {
    background: linear-gradient(to right, #8b5cf6, #6366f1);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  
  .trigger-button:hover {
    opacity: 0.9;
  }
  
  .trigger-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .card-container {
    position: relative;
    perspective: 1000px;
    transform-style: preserve-3d;
    margin-bottom: 2rem;
  }
  
  .card {
    position: relative;
    transform-style: preserve-3d;
    transform-origin: center center;
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.1s ease-out;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    background-color: #1e293b;
  }
  
  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom right, #334155, #0f172a);
    transform: translateZ(-50px);
  }
  
  .card-grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    transform: translateZ(-25px);
  }
  
  .glow-effect {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    mix-blend-mode: screen;
    transition: opacity 0.4s ease;
    transform: translateZ(0);
  }
  
  .card-element {
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
  }
  
  .depth-indicators {
    position: absolute;
    top: 20px;
    right: 20px;
    transform-style: preserve-3d;
  }
  
  .depth-plane {
    position: absolute;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    background-color: rgba(0, 0, 0, 0.2);
    white-space: nowrap;
  }
  
  .instructions {
    text-align: center;
    max-width: 600px;
    margin-top: 1rem;
  }
  
  .instructions p {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 0.5rem;
  }
  
  /* Utility classes */
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-base {
    font-size: 1rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-4xl {
    font-size: 2.25rem;
  }
</style> 