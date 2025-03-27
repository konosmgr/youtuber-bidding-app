<script>
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

  // Animation states
  let isHovered = false;
  
  function handleMouseEnter() {
    isHovered = true;
  }
  
  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<a 
  {id}
  {href} 
  class="header-btn simple-hover flx-center {className}"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  style="--defaultColor: {color}; --hlColor: {highlightColor}; font-size: {fontSize}; font-weight: {fontWeight}; letter-spacing: {letterSpacing}; padding: {padding}; height: {buttonHeight};"
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

<style>
  :root {
    --defaultColor: #FAF5F0;
    --hlColor: #f9b639;
    --mainEasing: cubic-bezier(.25, 1, .5, 1);
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
    overflow: hidden;
    -webkit-user-drag: none;
    user-select: none;
    transition: opacity .5s var(--mainEasing);
    text-decoration: none;
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
  .ht-1 { transition-delay: 15ms; }
  .ht-2 { transition-delay: 30ms; }
  .ht-3 { transition-delay: 45ms; }
  .ht-4 { transition-delay: 60ms; }
  .ht-5 { transition-delay: 75ms; }
  .ht-6 { transition-delay: 90ms; }
  .ht-7 { transition-delay: 105ms; }
  .ht-8 { transition-delay: 120ms; }
  .ht-9 { transition-delay: 135ms; }
  .ht-10 { transition-delay: 150ms; }
  .ht-11 { transition-delay: 165ms; }
  .ht-12 { transition-delay: 180ms; }
  .ht-13 { transition-delay: 195ms; }
  .ht-14 { transition-delay: 210ms; }
  .ht-15 { transition-delay: 225ms; }
  .ht-16 { transition-delay: 240ms; }
  .ht-17 { transition-delay: 255ms; }
  .ht-18 { transition-delay: 270ms; }
  .ht-19 { transition-delay: 285ms; }
  .ht-20 { transition-delay: 300ms; }
  
  /* Simple hover transition */
  .simple-hover {
    cursor: pointer;
    transition: all 0.25s ease;
  }
</style> 