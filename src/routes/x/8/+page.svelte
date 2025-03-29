<script>
  import { onMount } from 'svelte';
  import StaggeredProductCard from '$lib/components/test-components/StaggeredProductCard.svelte';
  
  // Interactive control states for staggered effects
  let staggerStep = 0.05;
  let staggerDirection = 'forward';
  let zBehavior = 'hybrid';
  let hoverZScale = 2;
  
  // Sample products for the showcase
  const products = [
    {
      title: "Premium Headphones",
      brand: "AudioTech",
      price: 249.99,
      discount: 29,
      originalPrice: 349.99,
      rating: 4.8,
      reviewCount: 256,
      image: "/images/products/headphones.jpg",
      features: [
        "Active Noise Cancellation",
        "40-hour Battery Life",
        "Premium Sound Quality",
        "Comfortable Fit"
      ],
      colors: ["#121212", "#e5e5e5", "#7c3aed"],
      badgeText: "BEST SELLER"
    },
    {
      title: "Pro Smartwatch",
      brand: "TechWear",
      price: 189.99,
      discount: 15,
      originalPrice: 219.99,
      rating: 4.6,
      reviewCount: 183,
      image: "/images/products/smartwatch.jpg",
      features: [
        "Heart Rate Monitoring",
        "Water Resistant (50m)",
        "Sleep Tracking",
        "7-day Battery Life"
      ],
      colors: ["#000000", "#f9fafb", "#0369a1"],
      badgeText: "NEW"
    },
    {
      title: "Wireless Earbuds",
      brand: "SoundPods",
      price: 129.99,
      discount: 0,
      originalPrice: null,
      rating: 4.4,
      reviewCount: 127,
      image: "/images/products/earbuds.jpg",
      features: [
        "Touch Controls",
        "24-hour Battery Life",
        "IPX5 Water Resistance",
        "Voice Assistant Support"
      ],
      colors: ["#ffffff", "#111827", "#4f46e5"],
      badgeText: "PREMIUM"
    }
  ];
  
  // Active product for display
  let activeProduct = products[0];
  
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
  
  // Handle buy now button click
  function handleBuyNow(event) {
    alert(`You selected the ${event.detail.product.title} in color: ${event.detail.selectedColor}`);
  }
  
  // Select a product to display
  function selectProduct(product) {
    activeProduct = product;
  }
</script>

<svelte:head>
  <title>Advanced Product Card | Interactive Demo</title>
</svelte:head>

<div class="showcase-container">
  <header class="showcase-header">
    <h1 class="title">Advanced 3D Product Card</h1>
    <p class="subtitle">
      Featuring staggered animations with coordinated timing for professional e-commerce applications
    </p>
  </header>
  
  <div class="main-content">
    <div class="control-panel">
      <h2>Staggered Animation Controls</h2>
      
      <div class="control-group">
        <label for="stagger-step">Animation Delay: {staggerStep}s</label>
        <input type="range" id="stagger-step" min="0.02" max="0.15" step="0.01" bind:value={staggerStep} />
        <p class="description">Delay between each element's animation</p>
      </div>
      
      <div class="control-group">
        <label for="stagger-direction">Animation Direction:</label>
        <select id="stagger-direction" bind:value={staggerDirection} class="select-input">
          {#each directionOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        <p class="description">How elements sequence their animations</p>
      </div>
      
      <div class="control-group">
        <label for="z-behavior">Z-Axis Behavior:</label>
        <select id="z-behavior" bind:value={zBehavior} class="select-input">
          {#each zBehaviorOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        <p class="description">3D depth behavior of elements</p>
      </div>
      
      <div class="control-group">
        <label for="hover-z-scale">Z Amplification: {hoverZScale}×</label>
        <input type="range" id="hover-z-scale" min="1" max="3" step="0.1" bind:value={hoverZScale} />
        <p class="description">How much 3D depth is amplified on hover</p>
      </div>
      
      <div class="product-selector">
        <h3>Choose Product</h3>
        <div class="product-thumbnails">
          {#each products as product, i}
            <button
              class="product-thumb"
              class:active={product === activeProduct}
              on:click={() => selectProduct(product)}
            >
              <img src={product.image} alt={product.title} />
              <span class="product-label">{i + 1}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
    
    <div class="card-display">
      <StaggeredProductCard
        product={activeProduct}
        {staggerStep}
        {staggerDirection}
        {zBehavior}
        {hoverZScale}
        on:buynow={handleBuyNow}
      />
    </div>
  </div>
  
  <div class="features-section">
    <h2>Key Features</h2>
    
    <div class="feature-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3>True Staggered Animations</h3>
        <p>
          Elements enter and exit the viewport with precisely timed delays, creating a professional cascading effect that guides user attention.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h3>Coordinated 3D Movement</h3>
        <p>
          Unlike standard cards, all movements are precisely coordinated in X, Y, and Z dimensions with customizable timing across elements.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h3>Customizable Z-Behavior</h3>
        <p>
          Three distinct Z-behavior modes let you choose how elements position in 3D space when at rest vs. during hover interactions.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h3>Interactive Elements</h3>
        <p>
          Fully functional interactive elements like color selectors and buttons work seamlessly within the 3D space and staggered animations.
        </p>
      </div>
    </div>
  </div>
  
  <div class="technical-details">
    <h2>Technical Implementation</h2>
    
    <div class="code-explanation">
      <h3>Staggered Animation System</h3>
      <p>
        The advanced staggered animation system is powered by a specialized <code>getStaggeredStyle</code> function 
        that manages coordinated movement along multiple axes with precise sequencing.
      </p>
      
      <p>The key components of this system are:</p>
      
      <ol>
        <li>
          <strong>Index-based delay calculation</strong> - Each element's animation is delayed based on its position and the chosen stagger direction
        </li>
        <li>
          <strong>Z-value behavior modes</strong> - Elements use different Z positioning strategies based on the selected mode (flat, hybrid, or subtle)
        </li>
        <li>
          <strong>Coordinated transformations</strong> - X, Y, and Z movements, rotation, and scaling are all synchronized with the same delay timing
        </li>
        <li>
          <strong>Opacity transitions</strong> - Elements fade in/out alongside their positional animations for a cohesive effect
        </li>
      </ol>
      
      <p>
        This creates a much more dynamic and engaging experience compared to simple hover effects, as elements move in a choreographed sequence rather than all at once.
      </p>
    </div>
  </div>
</div>

<style>
  .showcase-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1f2937;
  }
  
  .showcase-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .subtitle {
    font-size: 1.125rem;
    color: #4b5563;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .control-panel {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    height: fit-content;
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
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    background: #4338ca;
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
  
  .product-selector {
    margin-top: 2rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
  }
  
  .product-selector h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }
  
  .product-thumbnails {
    display: flex;
    gap: 0.5rem;
  }
  
  .product-thumb {
    width: 60px;
    height: 60px;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
  }
  
  .product-thumb.active {
    border-color: #4f46e5;
    transform: scale(1.05);
  }
  
  .product-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  .product-label {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 0.75rem;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .card-display {
    height: 700px;
    max-width: 450px;
    margin: 0 auto;
  }
  
  .features-section {
    margin-bottom: 4rem;
  }
  
  .features-section h2 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .feature-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .feature-icon {
    color: #4f46e5;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1f2937;
  }
  
  .feature-card p {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .technical-details {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 1rem;
  }
  
  .technical-details h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  
  .code-explanation h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .code-explanation p {
    margin-bottom: 1rem;
    color: #4b5563;
  }
  
  .code-explanation code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  
  .code-explanation pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1.25rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 0.875rem;
    line-height: 1.7;
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    .main-content {
      grid-template-columns: 1fr;
    }
    
    .card-display {
      height: 600px;
    }
    
    .title {
      font-size: 1.875rem;
    }
  }
</style> 