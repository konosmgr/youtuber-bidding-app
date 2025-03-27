<script>
    // Your other imports and code
    
    // For the contact button
    const contactText = "Contact";
    const characters = Array.from(contactText);
    
    function playHoverSound() {
      console.log('Playing contact hover sound');
      // Uncomment to enable sound
      // const sound = new Audio('/path/to/hover-sound.mp3');
      // sound.play();
    }
  </script>
  
  <header>
    <div class="logo">UTSUBO</div>
    <div class="right-header">
      <a 
        href="/contact" 
        class="header-btn simple-hover"
        on:mouseenter={playHoverSound}
        on:focus={playHoverSound}
      >
        <span class="ha-itm">
          {#each characters as char, i}
            <span class="ha-txto ht-{(i % 5) + 1}">
              <span class="ha-txt">{char}</span>
              <span class="ha-txtb">{char}</span>
            </span>
          {/each}
        </span>
      </a>
    </div>
  </header>
  
  <!-- Rest of your page content -->
  
  <style>
    :global(:root) {
      --app-height: 100vh;
      --defaultColor: #FAF5F0;
      --hlColor: #f9b639;
      --mainEasing: cubic-bezier(.25, 1, .5, 1);
    }
    
    header {
      /* Your header styles */
    }
    
    .logo {
      /* Your logo styles */
    }
    
    .right-header {
      /* Your header right side styles */
    }
    
    /* Button styles */
    .header-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--defaultColor);
      font-size: 12px;
      font-weight: 600;
      height: 50px;
      padding: 8px;
      overflow: hidden;
      -webkit-user-drag: none;
      user-select: none;
      transition: opacity .5s var(--mainEasing);
      outline: none;
      text-decoration: none;
      pointer-events: all;
      -webkit-tap-highlight-color: transparent;
      vertical-align: baseline;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    
    .ha-itm {
      position: relative;
      overflow: hidden;
    }
    
    .ha-txto {
      display: flex;
      transition: transform .5s ease;
    }
    
    .ha-txtb {
      position: absolute;
      top: 0;
      left: 0;
      color: var(--hlColor);
      z-index: -1;
      transform: translate3d(100%, 0, 0);
    }
    
    .ha-txt {
      transform: translateZ(0);
    }
    
    /* Timing classes with specific delays from Utsubo code */
    .ha-txto.ht-1 {
      transition-delay: 15ms;
      transition-timing-function: var(--mainEasing);
    }
    .ha-txto.ht-1.ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(10deg);
    }
    
    .ha-txto.ht-2 {
      transition-delay: 30ms;
    }
    
    .ha-txto.ht-3 {
      transition-delay: 45ms;
    }
    
    .ha-txto.ht-4 {
      transition-delay: 60ms;
      transition-timing-function: var(--mainEasing);
    }
    .ha-txto.ht-4.ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(10deg);
    }
    
    .ha-txto.ht-5 {
      transition-delay: 75ms;
    }
    .ha-txto.ht-5.ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(-10deg);
    }
    
    /* Hover effect */
    @media (hover: hover) {
      .simple-hover:hover .ha-txtb,
      .simple-hover:focus-visible .ha-txtb {
        transform: translateZ(0);
      }
      
      .simple-hover:hover .ha-txt,
      .simple-hover:focus-visible .ha-txt {
        transform: translate3d(-100%, 0, 0);
      }
    }
  </style>