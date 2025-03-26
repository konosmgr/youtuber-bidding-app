<script>
  // Text for the button
  export let text = "CONTACT";
  // Optional props for customization
  export let bgColor = "transparent";
  export let textColor = "#ffffff";
  export let borderColor = "rgba(255, 255, 255, 0.2)";
  export let hoverBgColor = "rgba(255, 255, 255, 0.1)";
  
  // State for tracking hover
  let hovered = false;
  
  // Characters to use for text scrambling
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  // Create an array of letter objects
  $: letters = text.split('').map((char) => ({
    original: char,
    current: char,
    scrambled: false,
    settled: false
  }));
  
  // Animation frame reference
  let animationFrame;
  let complete = false;
  
  // Function to handle scramble animation
  function scrambleText() {
    if (!hovered || complete) return;
    
    let allSettled = true;
    
    letters = letters.map((letter, i) => {
      // Skip spaces
      if (letter.original === ' ') {
        return { ...letter, settled: true };
      }
      
      // If already settled, keep it that way
      if (letter.settled) {
        return letter;
      }
      
      // Determine if this letter should settle (staggered based on position)
      const shouldSettle = Math.random() < 0.15 + (i / letters.length) * 0.3;
      
      if (shouldSettle) {
        return {
          ...letter,
          current: letter.original,
          settled: true,
          scrambled: false
        };
      } else {
        // Otherwise show a random character
        allSettled = false;
        return {
          ...letter,
          current: chars[Math.floor(Math.random() * chars.length)],
          scrambled: true
        };
      }
    });
    
    if (!allSettled) {
      // Continue animation if not all letters are settled
      animationFrame = requestAnimationFrame(scrambleText);
    } else {
      complete = true;
    }
  }
  
  // Handle mouse enter
  function handleMouseEnter() {
    hovered = true;
    complete = false;
    
    // Reset letters to scrambled state
    letters = letters.map(letter => ({
      ...letter,
      settled: letter.original === ' ', // Only spaces start settled
      scrambled: letter.original !== ' ' // Everything else starts scrambled
    }));
    
    // Start animation
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(scrambleText);
  }
  
  // Handle mouse leave
  function handleMouseLeave() {
    hovered = false;
    complete = false;
    cancelAnimationFrame(animationFrame);
    
    // Reset all letters to original
    letters = letters.map(letter => ({
      ...letter,
      current: letter.original,
      scrambled: false,
      settled: false
    }));
  }
  
  // Clean up animation frame on component destruction
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    cancelAnimationFrame(animationFrame);
  });
</script>

<button
  class="utsubo-button"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  style="
    --bg-color: {bgColor};
    --text-color: {textColor};
    --border-color: {borderColor};
    --hover-bg-color: {hoverBgColor};
  "
  class:hovered
>
  <div class="button-text">
    {#each letters as letter}
      <span class="letter" class:scrambled={letter.scrambled}>
        {letter.current}
      </span>
    {/each}
  </div>
</button>

<style>
  .utsubo-button {
    position: relative;
    padding: 0.5rem 1rem;
    background-color: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    cursor: pointer;
    font-family: 'Inter', 'Helvetica Neue', sans-serif;
    font-weight: 300;
    font-size: 0.875rem;
    letter-spacing: 0.1em;
    transition: background-color 0.3s ease, transform 0.3s ease;
    overflow: hidden;
  }
  
  .utsubo-button:hover {
    background-color: var(--hover-bg-color);
    transform: translateY(-1px);
  }
  
  .button-text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .letter {
    display: inline-block;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  .scrambled {
    opacity: 0.8;
    transform: translateY(-1px);
  }
</style>