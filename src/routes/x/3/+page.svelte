<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut, elasticOut } from 'svelte/easing';
  import CustomizableShowcase from '$lib/components/ui/3d-card/test-components/CustomizableShowcase.svelte';
  
  // Content for all cards
  const features = [
    "Customizable 3D depth",
    "Responsive animations",
    "Multiple modes",
    "Performance optimized"
  ];
  
  // Animated variants
  let showCards = false;
  let activeSection = 'z-depth';
  
  const sections = [
    { id: 'z-depth', name: 'Z-Depth Effects' },
    { id: 'staggered', name: 'Staggered Animation' },
    { id: 'interaction', name: 'Interactive' }
  ];
  
  // Z-depth showcase elements
  const zDepthCards = [
    {
      title: "Layered Elements",
      subtitle: "Z-DEPTH DEMO",
      imageSrc: "/images/keyboard-setup.jpg",
      backgroundColor: "#001220",
      glowColor: "#4f46e5",
      badgePosition: { top: 7, right: 7, z: 150 },
      titlePosition: { top: 8, left: 8, z: 100 },
      featureListPosition: { top: 30, left: 8, z: 60 },
      pricePosition: { bottom: 8, left: 8, z: -30 },
      buttonPosition: { bottom: 8, right: 8, z: 120 },
      countdownPosition: { bottom: 7, right: 7, z: 80 },
      showDebugInfo: true,
      hoverZScale: 1.5,
      maxRotation: 12
    },
    {
      title: "Extreme Depth",
      subtitle: "3D SHOWCASE",
      imageSrc: "/images/keyboard-setup.jpg",
      backgroundColor: "#240034",
      glowColor: "#ec4899",
      badgePosition: { top: 7, right: 7, z: 200 },
      titlePosition: { top: 8, left: 8, z: 150 },
      featureListPosition: { top: 30, left: 8, z: 50 },
      pricePosition: { bottom: 8, left: 8, z: -50 },
      buttonPosition: { bottom: 8, right: 8, z: 180 },
      countdownPosition: { bottom: 7, right: 7, z: 100 },
      showDebugInfo: true,
      hoverZScale: 2.5,
      maxRotation: 15
    }
  ];
  
  // Card component references for animations
  let cardRefs = {};
  
  // Trigger animations in sequence
  function triggerSequentialAnimation() {
    if (!cardRefs.staggered1 || !cardRefs.staggered2) return;
    
    setTimeout(() => cardRefs.staggered1.triggerAnimation(), 0);
    setTimeout(() => cardRefs.staggered2.triggerAnimation(), 500);
  }
  
  // Parallax effect variables
  let mouseX = 0;
  let mouseY = 0;
  
  function handleMouseMove(e) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    mouseX = (e.clientX / windowWidth) - 0.5;
    mouseY = (e.clientY / windowHeight) - 0.5;
  }
  
  onMount(() => {
    // Animate cards in on page load
    showCards = true;
    
    // Start with a demonstration animation
    setTimeout(triggerSequentialAnimation, 1000);
    
    // Attach mouse move listener
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  });
  
  // For continuous animations
  $: cardTransform = `
    perspective(1000px)
    rotateX(${mouseY * -5}deg)
    rotateY(${mouseX * 5}deg)
  `;
</script>

<svelte:head>
  <title>3D Card Showcase Gallery</title>
</svelte:head>

<div class="page-container" style="transform: {cardTransform}">
  <div class="header">
    <h1>3D Card Effect Showcase</h1>
    <p class="subtitle">A collection of 3D card effects with different behaviors and configurations</p>
    
    <div class="tab-navigation">
      {#each sections as section}
        <button 
          class="tab-button {activeSection === section.id ? 'active' : ''}"
          on:click={() => activeSection = section.id}
        >
          {section.name}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Z-Depth Showcase -->
  {#if activeSection === 'z-depth'}
    <div class="cards-section">
      <div class="section-description">
        <h2>Z-Depth Composition</h2>
        <p>Elements positioned at different depths in 3D space, creating realistic layering on hover.</p>
        <div class="depth-legend">
          <span class="depth-indicator closer">Closer elements (positive Z)</span>
          <span class="depth-indicator further">Further elements (negative Z)</span>
        </div>
      </div>
      
      <div class="cards-container">
        {#if showCards}
          {#each zDepthCards as card, i}
            <div class="card-wrapper" in:fly={{ y: 50, duration: 800, delay: i * 200, easing: cubicOut }}>
              <CustomizableShowcase
                title={card.title}
                subtitle={card.subtitle}
                features={features}
                price="$59"
                originalPrice="$99"
                buttonText="Get Access"
                imageSrc={card.imageSrc}
                backgroundColor={card.backgroundColor}
                glowColor={card.glowColor}
                badgePosition={card.badgePosition}
                titlePosition={card.titlePosition}
                featureListPosition={card.featureListPosition}
                pricePosition={card.pricePosition}
                buttonPosition={card.buttonPosition}
                countdownPosition={card.countdownPosition}
                showDebugInfo={card.showDebugInfo}
                hoverZScale={card.hoverZScale}
                maxRotation={card.maxRotation}
                perspective={1200}
              />
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Staggered Animation Showcase -->
  {#if activeSection === 'staggered'}
    <div class="cards-section">
      <div class="section-description">
        <h2>Staggered Animations</h2>
        <p>Sequential card animations create a flowing visual effect across multiple cards.</p>
        <button class="action-button" on:click={triggerSequentialAnimation}>
          Trigger Animation
        </button>
      </div>
      
      <div class="cards-container staggered-container">
        {#if showCards}
          <div class="card-wrapper" in:fly={{ y: 50, duration: 800, delay: 100, easing: cubicOut }}>
            <CustomizableShowcase
              bind:this={cardRefs.staggered1}
              title="First Card"
              subtitle="SEQUENCE START"
              features={features}
              price="$49"
              buttonText="Step One"
              backgroundColor="#0f172a"
              glowColor="#3b82f6"
              badgePosition={{ top: 7, right: 7, z: 150 }}
              titlePosition={{ top: 8, left: 8, z: 80 }}
              featureListPosition={{ top: 30, left: 8, z: 40 }}
              pricePosition={{ bottom: 8, left: 8, z: 20 }}
              buttonPosition={{ bottom: 8, right: 8, z: 120 }}
              countdownPosition={{ bottom: 7, right: 7, z: 30 }}
              hasGlowAccents={true}
              hoverZScale={1.8}
              maxRotation={10}
              perspective={1200}
            />
          </div>
          
          <div class="card-wrapper" in:fly={{ y: 50, duration: 800, delay: 300, easing: cubicOut }}>
            <CustomizableShowcase
              bind:this={cardRefs.staggered2}
              title="Second Card"
              subtitle="SEQUENCE END"
              features={features}
              price="$79"
              buttonText="Step Two"
              backgroundColor="#1a0f2a"
              glowColor="#8b5cf6"
              badgePosition={{ top: 7, right: 7, z: 150 }}
              titlePosition={{ top: 8, left: 8, z: 80 }}
              featureListPosition={{ top: 30, left: 8, z: 40 }}
              pricePosition={{ bottom: 8, left: 8, z: 20 }}
              buttonPosition={{ bottom: 8, right: 8, z: 120 }}
              countdownPosition={{ bottom: 7, right: 7, z: 30 }}
              hasGlowAccents={true}
              hoverZScale={1.8}
              maxRotation={10}
              perspective={1200}
            />
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <!-- Interactive Showcase -->
  {#if activeSection === 'interaction'}
    <div class="cards-section">
      <div class="section-description">
        <h2>Interactive Experience</h2>
        <p>This card responds to mouse position across the entire screen, creating a subtle ambient motion effect.</p>
        <p class="hint">Move your mouse around to see the effect</p>
      </div>
      
      <div class="cards-container">
        {#if showCards}
          <div class="card-wrapper" in:fly={{ y: 50, duration: 800, easing: elasticOut }}>
            <CustomizableShowcase
              title="Ambient Motion"
              subtitle="PARALLAX DEMO"
              features={features}
              price="$89"
              originalPrice="$149"
              buttonText="Experience"
              backgroundColor="#1e293b"
              glowColor="#14b8a6"
              badgePosition={{ top: 7, right: 7, z: 150 }}
              titlePosition={{ top: 8, left: 8, z: 80 }}
              featureListPosition={{ top: 30, left: 8, z: 40 }}
              pricePosition={{ bottom: 8, left: 8, z: 20 }}
              buttonPosition={{ bottom: 8, right: 8, z: 120 }}
              countdownPosition={{ bottom: 7, right: 7, z: 30 }}
              hasGlowAccents={true}
              hoverZScale={2.0}
              maxRotation={18}
              perspective={1000}
            />
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  <div class="footer-note">
    <p>This showcase demonstrates a custom 3D card component with configurable Z-depth positioning and animations.</p>
    <p>All elements can be positioned at different depths in 3D space, creating a realistic layered effect.</p>
  </div>
</div>

<style>
  .page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem 4rem;
    min-height: 100vh;
    transform-style: preserve-3d;
    transition: transform 0.5s ease;
  }
  
  .header {
    text-align: center;
    margin-bottom: 3rem;
    transform-style: preserve-3d;
    transform: translateZ(50px);
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  
  .subtitle {
    font-size: 1.125rem;
    color: #94a3b8;
    margin-bottom: 2rem;
  }
  
  .cards-section {
    margin-bottom: 5rem;
    transform-style: preserve-3d;
  }
  
  .section-description {
    margin-bottom: 2rem;
    text-align: center;
    transform: translateZ(40px);
  }
  
  .section-description h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #f8fafc;
  }
  
  .section-description p {
    font-size: 1.125rem;
    color: #94a3b8;
    max-width: 600px;
    margin: 0 auto 1.5rem;
  }
  
  .hint {
    font-size: 0.875rem;
    color: #64748b;
    font-style: italic;
  }
  
  .cards-container {
    display: flex;
    justify-content: center;
    gap: 4rem;
    flex-wrap: wrap;
    transform-style: preserve-3d;
  }
  
  .card-wrapper {
    transform-style: preserve-3d;
    margin-bottom: 2rem;
  }
  
  .tab-navigation {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .tab-button {
    padding: 0.75rem 1.5rem;
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(100, 116, 139, 0.2);
    border-radius: 0.5rem;
    color: #94a3b8;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .tab-button:hover {
    background: rgba(51, 65, 85, 0.5);
    color: #f8fafc;
  }
  
  .tab-button.active {
    background: rgba(79, 70, 229, 0.2);
    border-color: rgba(79, 70, 229, 0.6);
    color: #818cf8;
  }
  
  .action-button {
    padding: 0.75rem 1.5rem;
    background: #4f46e5;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .action-button:hover {
    background: #4338ca;
  }
  
  .depth-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
  }
  
  .depth-indicator {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #cbd5e1;
  }
  
  .depth-indicator::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  
  .closer::before {
    background: linear-gradient(to right, #a7f3d0, #10b981);
  }
  
  .further::before {
    background: linear-gradient(to right, #93c5fd, #3b82f6);
  }
  
  .footer-note {
    margin-top: 4rem;
    padding: 1.5rem;
    background: rgba(30, 41, 59, 0.3);
    border-radius: 0.75rem;
    text-align: center;
    transform: translateZ(20px);
  }
  
  .footer-note p {
    color: #94a3b8;
    font-size: 0.9375rem;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }
  
  .footer-note p:last-child {
    margin-bottom: 0;
  }
  
  /* Media queries for responsiveness */
  @media (max-width: 1024px) {
    .cards-container {
      gap: 2rem;
    }
  }
  
  @media (max-width: 768px) {
    .tab-navigation {
      flex-direction: column;
      gap: 0.5rem;
      max-width: 250px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .staggered-container {
      flex-direction: column;
      align-items: center;
    }
  }
</style> 