<script>
  import { browser } from '$app/environment';

  export let text = "CONTACT";
  export let href = "/contact";
  export let id = "";
  export let className = "";
  export let color = "#FAF5F0";
  export let highlightColor = "#f9b639";
  export let fontSize = "12px";
  export let fontWeight = "600";
  export let letterSpacing = "1px";
  export let padding = "8px 16px";
  export let buttonHeight = "50px";
  export let buttonEffect = true;
  export let disabled = false;
  export let type = null; // For button type when used as a button
  export let preserveStyle = false; // Only apply the text hover animation, preserve all other styles
  export let external = false; // For external links
  export let isButton = false; // Force button even with href
  export let audioEnabled = true; // New prop to enable/disable audio feedback

  // Animation states
  let isHovered = false;
  
  // Audio elements references
  let audioIn;
  let audioOut;
  let audioLoaded = false;
  
  // Function to handle audio loading
  function initAudio() {
    if (browser && audioEnabled) {
      audioLoaded = true;
    }
  }
  
  function playAudio(audioElement) {
    if (browser && audioElement && audioEnabled && !disabled) {
      // Reset audio to beginning in case it's still playing
      audioElement.currentTime = 0;
      
      // Set volume
      audioElement.volume = 0.3;
      
      // Play the audio
      const playPromise = audioElement.play();
      
      // Handle potential play() Promise rejection (happens if user hasn't interacted with the page yet)
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio couldn't play automatically:", error);
        });
      }
    }
  }
  
  function handleMouseEnter() {
    isHovered = true;
    playAudio(audioIn);
  }
  
  function handleMouseLeave() {
    isHovered = false;
    playAudio(audioOut);
  }
</script>

<!-- Audio elements -->
{#if browser && audioEnabled}
  <audio bind:this={audioIn} preload="metadata" on:canplaythrough={initAudio}>
    <source src="/audio/button-in.mp3" type="audio/mp3">
    <source src="/audio/button-in.wav" type="audio/wav">
    <source src="/audio/button-in.opus" type="audio/opus">
  </audio>
  <audio bind:this={audioOut} preload="metadata">
    <source src="/audio/button-out.mp3" type="audio/mp3">
    <source src="/audio/button-out.wav" type="audio/wav">
    <source src="/audio/button-out.opus" type="audio/opus">
  </audio>
{/if}

{#if isButton || !href || href === '#' || disabled}
  <button 
    {id}
    type={type || 'button'}
    class="{preserveStyle ? 'header-btn' : 'header-btn simple-hover flx-center'} {className}"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    style="{preserveStyle ? `--defaultColor: ${color}; --hlColor: ${highlightColor}; font-size: ${fontSize}; font-weight: ${fontWeight}; letter-spacing: ${letterSpacing};` : `--defaultColor: ${color}; --hlColor: ${highlightColor}; font-size: ${fontSize}; font-weight: ${fontWeight}; letter-spacing: ${letterSpacing}; padding: ${padding}; height: ${buttonHeight};`}"
    on:click
    on:focus
    on:blur
    on:keydown
    on:keyup
    {disabled}
  >
    <span class="flx">
      {#each text.split("") as letter, i}
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-{i+1}">{letter}</span>
          <span class="ha-txtb ha-txto ht-{i+1}" aria-hidden="true">{letter}</span>
        </span>
      {/each}
    </span>
  </button>
{:else}
  <a 
    {id}
    {href} 
    class="{preserveStyle ? 'header-btn' : 'header-btn simple-hover flx-center'} {className} {disabled ? 'disabled' : ''}"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    style="{preserveStyle ? `--defaultColor: ${color}; --hlColor: ${highlightColor}; font-size: ${fontSize}; font-weight: ${fontWeight}; letter-spacing: ${letterSpacing};` : `--defaultColor: ${color}; --hlColor: ${highlightColor}; font-size: ${fontSize}; font-weight: ${fontWeight}; letter-spacing: ${letterSpacing}; padding: ${padding}; height: ${buttonHeight};`}"
    on:click
    on:focus
    on:blur
    on:keydown
    on:keyup
    tabindex={disabled ? -1 : 0}
    target={external ? "_blank" : null}
    rel={external ? "noopener noreferrer" : null}
    aria-disabled={disabled}
  >
    <span class="flx">
      {#each text.split("") as letter, i}
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-{i+1}">{letter}</span>
          <span class="ha-txtb ha-txto ht-{i+1}" aria-hidden="true">{letter}</span>
        </span>
      {/each}
    </span>
  </a>
{/if}

<style>
  /* Global CSS Variables */
  :global(:root) {
    --defaultColor: #FAF5F0;
    --hlColor: #f9b639;
    --mainEasing: cubic-bezier(.25, 1, .5, 1);
  }
  
  /* Button styling */
  :global(.flx) {
    display: flex;
  }
  
  :global(.flx-center) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  :global(.header-btn) {
    color: var(--defaultColor);
    overflow: hidden;
    -webkit-user-drag: none;
    user-select: none;
    transition: opacity .5s var(--mainEasing);
    text-decoration: none;
  }
  
  /* Hover animation items */
  :global(.ha-itm) {
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin: 0 1px;
  }
  
  :global(.ha-txt) {
    display: inline-block;
    transform: translateZ(0);
    position: relative;
    z-index: 3;
  }
  
  :global(.ha-txto) {
    display: inline-block;
    transition: transform .5s var(--mainEasing);
  }
  
  :global(.ha-txtb) {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--hlColor);
    transform: translate3d(110%, 0, 0) skew(10deg);
    z-index: 1;
    opacity: 0;
  }
  
  /* Hover states */
  :global(.header-btn:hover .ha-txt) {
    transform: translate3d(-100%, 0, 0);
    z-index: 1;
  }
  
  :global(.header-btn:hover .ha-txtb) {
    transform: translate3d(0, 0, 0) skew(0deg);
    z-index: 3;
    opacity: 1;
  }
  
  /* Animation timing for each letter */
  :global(.ht-1) { transition-delay: 15ms; }
  :global(.ht-2) { transition-delay: 30ms; }
  :global(.ht-3) { transition-delay: 45ms; }
  :global(.ht-4) { transition-delay: 60ms; }
  :global(.ht-5) { transition-delay: 75ms; }
  :global(.ht-6) { transition-delay: 90ms; }
  :global(.ht-7) { transition-delay: 105ms; }
  :global(.ht-8) { transition-delay: 120ms; }
  :global(.ht-9) { transition-delay: 135ms; }
  :global(.ht-10) { transition-delay: 150ms; }
  :global(.ht-11) { transition-delay: 165ms; }
  :global(.ht-12) { transition-delay: 180ms; }
  :global(.ht-13) { transition-delay: 195ms; }
  :global(.ht-14) { transition-delay: 210ms; }
  :global(.ht-15) { transition-delay: 225ms; }
  :global(.ht-16) { transition-delay: 240ms; }
  :global(.ht-17) { transition-delay: 255ms; }
  :global(.ht-18) { transition-delay: 270ms; }
  :global(.ht-19) { transition-delay: 285ms; }
  :global(.ht-20) { transition-delay: 300ms; }
  
  /* Simple hover transition */
  :global(.simple-hover) {
    cursor: pointer;
    transition: all 0.25s ease;
  }
  
  /* Disabled state */
  :global(.disabled) {
    opacity: 0.6;
    cursor: not-allowed !important;
    pointer-events: none;
  }

  :global(button:disabled) {
    opacity: 0.6;
    cursor: not-allowed !important;
  }
  
  /* Hide audio elements */
  audio {
    display: none;
  }
</style> 