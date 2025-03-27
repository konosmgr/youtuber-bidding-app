<script>
  import HoverTextButton from '$lib/components/ui/HoverTextButton.svelte';
  
  let clicks = 0;
  function handleButtonClick() {
    clicks++;
  }
</script>

<div class="container">
  <h1>Utsubo-Style Button Showcase</h1>
  
  <div class="button-container">
    <h2>Default Contact Button</h2>
    <HoverTextButton 
      text="CONTACT" 
      href="/contact" 
      id="contact-nav"
    />
  </div>
  
  <div class="button-container">
    <h2>Custom Color Button</h2>
    <HoverTextButton 
      text="EXPLORE" 
      href="/auctions" 
      highlightColor="#4ade80" 
      fontSize="14px"
      fontWeight="500"
    />
  </div>
  
  <div class="button-container">
    <h2>Button with Longer Text</h2>
    <HoverTextButton 
      text="BUTTON WITH LONGER TEXT" 
      href="#" 
      highlightColor="#3b82f6" 
      fontSize="10px"
      padding="10px 20px"
      buttonHeight="60px"
    />
  </div>
  
  <div class="button-container">
    <h2>Disabled Button</h2>
    <HoverTextButton 
      text="DISABLED" 
      href="/contact" 
      disabled={true}
    />
  </div>
  
  <div class="button-container">
    <h2>Button Element (Not a Link)</h2>
    <HoverTextButton 
      text="CLICKED {clicks} TIMES" 
      href="#" 
      highlightColor="#ec4899"
      on:click={handleButtonClick}
    />
  </div>
  
  <div class="button-container">
    <h2>Preserving Existing Button Style</h2>
    <div class="existing-button-container">
      <HoverTextButton 
        text="ABOUT" 
        href="/about" 
        preserveStyle={true}
        highlightColor="#f9b639"
        className="existing-button"
      />
      
      <HoverTextButton 
        text="CONTACT" 
        href="/contact" 
        preserveStyle={true}
        highlightColor="#f9b639"
        className="existing-button"
      />
      
      <HoverTextButton 
        text="SUPPORT" 
        href="/support" 
        preserveStyle={true}
        highlightColor="#f9b639"
        className="existing-button"
      />
    </div>
  </div>
  
  <div class="button-container navbar-example">
    <h2>Navbar Integration Example</h2>
    <nav class="navbar-demo">
      <a href="/" class="nav-item active">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <HoverTextButton 
          text="AUCTIONS" 
          href="/" 
          preserveStyle={true}
          highlightColor="#f9b639"
        />
      </a>
      
      <a href="/knives" class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <HoverTextButton 
          text="KNIVES" 
          href="/knives" 
          preserveStyle={true}
          highlightColor="#f9b639"
        />
      </a>
      
      <a href="/about" class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <HoverTextButton 
          text="ABOUT" 
          href="/about" 
          preserveStyle={true}
          highlightColor="#f9b639"
        />
      </a>
      
      <a href="/contact" class="nav-item">
        <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <HoverTextButton 
          text="CONTACT" 
          href="/contact" 
          preserveStyle={true}
          highlightColor="#f9b639"
        />
      </a>
    </nav>
  </div>
</div>

<style>
  :root {
    --defaultColor: #FAF5F0;
    --hlColor: #f9b639;
    --mainEasing: cubic-bezier(.25, 1, .5, 1);
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #0C0E16;
    color: #FAF5F0;
    font-family: sans-serif;
    padding: 2rem 0;
  }
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2.5rem;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    opacity: 0.8;
  }
  
  .button-container {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 320px;
  }
  
  /* Base styles */
  * {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
  }
  
  /* Button styling */
  .flx {
    display: flex;
  }
  
  .flx-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .header-btn {
    color: var(--defaultColor);
    font-size: 12px;
    font-weight: 600;
    height: 50px;
    padding: 8px 16px;
    overflow: hidden;
    -webkit-user-drag: none;
    user-select: none;
    transition: opacity .5s var(--mainEasing);
    text-decoration: none;
    letter-spacing: 1px;
  }
  
  /* Hover animation items */
  .ha-itm {
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin: 0 2px;
  }
  
  .ha-txt {
    display: inline-block;
    transform: translateZ(0);
    position: relative;
    z-index: 3;
  }
  
  .ha-txto {
    display: inline-block;
    transition: transform .5s var(--mainEasing);
  }
  
  .ha-txtb {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--hlColor);
    transform: translate3d(110%, 0, 0) skew(10deg);
    z-index: 1;
    opacity: 0;
  }
  
  /* Hover states */
  .header-btn:hover .ha-txt {
    transform: translate3d(-100%, 0, 0);
    z-index: 1;
  }
  
  .header-btn:hover .ha-txtb {
    transform: translate3d(0, 0, 0) skew(0deg);
    z-index: 3;
    opacity: 1;
  }
  
  /* Animation timing for each letter */
  .ha-txto.ht-1 {
    transition-delay: 15ms;
  }
  
  .ha-txto.ht-2 {
    transition-delay: 30ms;
  }
  
  .ha-txto.ht-3 {
    transition-delay: 45ms;
  }
  
  .ha-txto.ht-4 {
    transition-delay: 60ms;
  }
  
  .ha-txto.ht-5 {
    transition-delay: 75ms;
  }
  
  .ha-txto.ht-6 {
    transition-delay: 90ms;
  }
  
  .ha-txto.ht-7 {
    transition-delay: 105ms;
  }
  
  /* Simple hover transition */
  .simple-hover {
    cursor: pointer;
    transition: all 0.25s ease;
  }
  
  .existing-button-container {
    display: flex;
    gap: 20px;
    margin-top: 10px;
  }
  
  .existing-button {
    background-color: rgba(255, 255, 255, 0.1);
    color: #FAF5F0;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    transition: background-color 0.3s ease;
    text-decoration: none;
  }
  
  .existing-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .navbar-example {
    width: 100%;
    max-width: 800px;
  }
  
  .navbar-demo {
    display: flex;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 10px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    color: #FAF5F0;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .nav-item.active {
    background-color: rgba(249, 182, 57, 0.1);
    color: #f9b639;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    margin-bottom: 8px;
  }
</style>
