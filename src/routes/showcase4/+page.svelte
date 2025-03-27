<script>
  import HoverTextButton from '$lib/components/ui/HoverTextButton.svelte';
</script>

<div class="container">
  <h1>Showcase 3</h1>
  
  <div class="button-container">
    <HoverTextButton 
      text="CONTACT" 
      href="/contact" 
      id="contact-nav"
    />
  </div>
  
  <div class="button-container" style="margin-top: 50px;">
    <HoverTextButton 
      text="EXPLORE" 
      href="/auctions" 
      highlightColor="#4ade80" 
      fontSize="14px"
      fontWeight="500"
    />
  </div>
  
  <div class="button-container" style="margin-top: 50px;">
    <HoverTextButton 
      text="BUTTON WITH LONGER TEXT" 
      href="#" 
      highlightColor="#3b82f6" 
      fontSize="10px"
      padding="10px 20px"
      buttonHeight="60px"
    />
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
  }
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
  
  .button-container {
    margin-top: 2rem;
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
</style>
