<script>
    import { onMount } from 'svelte';
    
    export let text = "Contact";
    export let buttonClass = "";
    
    // Split the text into characters for animation
    const characters = Array.from(text);
    
    // Optional: For sound effects (uncomment if needed)
    // let hoverSound;
    
    onMount(() => {
      // Initialize sound (uncomment if needed)
      // hoverSound = new Audio('/path/to/hover-sound.mp3');
      // hoverSound.preload = 'auto';
    });
    
    function playHoverSound() {
      // Uncomment to enable sound
      // if (hoverSound && hoverSound.readyState >= 2) {
      //   hoverSound.currentTime = 0;
      //   hoverSound.play();
      // }
      
      // Log for demo purposes
      console.log('Playing contact hover sound');
    }
  </script>
  
  <button 
    class="contact-btn {buttonClass}" 
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
  </button>
  
  <style>
    :global(:root) {
      --defaultColor: #FAF5F0;
      --hlColor: #f9b639;
      --mainEasing: cubic-bezier(.25, 1, .5, 1);
    }
    
    .contact-btn {
      display: inline-block;
      color: var(--defaultColor);
      font-size: 16px;
      font-weight: 600;
      padding: 12px 20px;
      cursor: pointer;
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s var(--mainEasing);
    }
    
    .contact-btn:hover {
      transform: scale(1.02);
    }
    
    .ha-itm {
      position: relative;
      overflow: hidden;
      display: inline-block;
    }
    
    .ha-txto {
      display: inline-flex;
      transition: transform 0.5s ease;
      position: relative;
    }
    
    .ha-txt {
      transform: translateZ(0);
      transition: transform 0.5s var(--mainEasing);
    }
    
    .ha-txtb {
      position: absolute;
      top: 0;
      left: 0;
      color: var(--hlColor);
      z-index: -1;
      transform: translate3d(100%, 0, 0);
      transition: transform 0.5s var(--mainEasing);
    }
    
    /* Timing classes for staggered animation */
    .ha-txto.ht-1 {
      transition-delay: 15ms;
      transition-timing-function: var(--mainEasing);
    }
    .ha-txto.ht-1 .ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(10deg);
    }
    
    .ha-txto.ht-2 {
      transition-delay: 30ms;
    }
    .ha-txto.ht-2 .ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(-5deg);
    }
    
    .ha-txto.ht-3 {
      transition-delay: 45ms;
    }
    .ha-txto.ht-3 .ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(7deg);
    }
    
    .ha-txto.ht-4 {
      transition-delay: 60ms;
      transition-timing-function: var(--mainEasing);
    }
    .ha-txto.ht-4 .ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(10deg);
    }
    
    .ha-txto.ht-5 {
      transition-delay: 75ms;
    }
    .ha-txto.ht-5 .ha-txtb {
      transform: translate3d(-100%, 0, 0) skew(-10deg);
    }
    
    /* Hover effect */
    @media (hover: hover) {
      .contact-btn:hover .ha-txtb,
      .contact-btn:focus-visible .ha-txtb {
        transform: translateZ(0);
      }
      
      .contact-btn:hover .ha-txt,
      .contact-btn:focus-visible .ha-txt {
        transform: translate3d(-100%, 0, 0);
      }
    }
  </style>