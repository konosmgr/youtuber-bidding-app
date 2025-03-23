<script>
    // Props for customization
    export let text = "EXPLORE"; // The text to display with the effect
    export let bgColor = "#0f172a"; // Dark background color
    export let textColor = "#f8fafc"; // Light text color
    export let hoverTextColor = "#60a5fa"; // Text color on hover
    export let href = "#"; // Optional link destination
    export let spacing = 0.05; // Initial letter spacing (in em)
    export let hoverSpacing = 0.2; // Letter spacing on hover (in em)
    export let size = "md"; // Button size: sm, md, lg
    
    // Size presets
    const sizes = {
      sm: { padding: "12px 24px", fontSize: "14px" },
      md: { padding: "18px 36px", fontSize: "18px" },
      lg: { padding: "22px 44px", fontSize: "22px" }
    };
    
    // Internal state
    let hovered = false;
    
    // Create an array of letters for individual animation
    $: letters = text.split('');
    
    // Get appropriate size values
    $: padding = sizes[size]?.padding || sizes.md.padding;
    $: fontSize = sizes[size]?.fontSize || sizes.md.fontSize;
    
    // Handle click event
    function handleClick(e) {
      // Add ripple effect logic if needed
      if (href === "#") {
        e.preventDefault();
      }
    }
  </script>
  
  <a 
    {href}
    class="fancy-button"
    style="
      --bg-color: {bgColor}; 
      --text-color: {textColor}; 
      --hover-text-color: {hoverTextColor};
      --padding: {padding};
      --font-size: {fontSize};
      --letter-spacing: {spacing}em;
      --hover-letter-spacing: {hoverSpacing}em;
    "
    on:mouseenter={() => hovered = true}
    on:mouseleave={() => hovered = false}
    on:click={handleClick}
    class:hovered
  >
    <div class="button-background"></div>
    <div class="button-glow"></div>
    
    <div class="letter-container">
      {#each letters as letter, i}
        <span 
          class="letter"
          style="--index: {i}; --total: {letters.length};"
        >
          {letter}
        </span>
      {/each}
    </div>
  </a>
  
  <style>
    .fancy-button {
      display: inline-block;
      position: relative;
      padding: var(--padding);
      border-radius: 12px;
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: 'Inter', 'Helvetica Neue', sans-serif;
      font-weight: 700;
      font-size: var(--font-size);
      text-decoration: none;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  
    .fancy-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .button-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--bg-color);
      border-radius: 12px;
      z-index: -2;
      transition: background-color 0.3s ease;
    }
    
    .button-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
      opacity: 0;
      z-index: -1;
      border-radius: 12px;
      transition: opacity 0.5s ease;
    }
    
    .hovered .button-glow {
      opacity: 1;
    }
    
    .letter-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
    }
  
    .letter {
      display: inline-block;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                  color 0.3s ease,
                  margin 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      margin: 0 var(--letter-spacing);
    }
  
    .hovered .letter {
      color: var(--hover-text-color);
      margin: 0 var(--hover-letter-spacing);
    }
  
    /* Add slightly different timing to each letter */
    .hovered .letter {
      transition-delay: calc(var(--index) * 0.03s);
    }
    
    /* Alternate letter movement for more dynamic effect */
    .hovered .letter:nth-child(2n) {
      transform: translateY(-2px);
    }
  
    .hovered .letter:nth-child(2n+1) {
      transform: translateY(2px);
    }
    
    /* Button press effect */
    .fancy-button:active {
      transform: translateY(1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
    
    .fancy-button:active .letter {
      transform: scale(0.95);
    }
  </style>