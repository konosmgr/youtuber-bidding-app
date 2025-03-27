<script>
  // No state needed for just the contact button
</script>

<svelte:head>
  <title>Contact Button</title>
</svelte:head>

<div class="container">
  <!-- Contact Button Effect -->
  <div class="contact-button-container">
    <a href="#contact" class="header-btn flx-center">
      <span class="flx">
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-1">C</span>
          <span aria-hidden="true" class="ha-txtb ha-txto ht-1">C</span>
        </span>
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-2">O</span>
          <span aria-hidden="true" class="ha-txtb ha-txto ht-2">O</span>
        </span>
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-3">N</span>
          <span aria-hidden="true" class="ha-txtb ha-txto ht-3">N</span>
        </span>
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-4">T</span>
          <span aria-hidden="true" class="ha-txtb ha-txto ht-4">T</span>
        </span>
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-5">A</span>
          <span aria-hidden="true" class="ha-txtb ha-txto ht-5">A</span>
        </span>
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-6">C</span>
          <span aria-hidden="true" class="ha-txtb ha-txto ht-6">C</span>
        </span>
        <span class="ha-itm">
          <span class="ha-txt ha-txto ht-7">T</span>
          <span aria-hidden="true" class="ha-txtb ha-txto ht-7">T</span>
        </span>
      </span>
    </a>
  </div>
</div>

<style>
  /* Root variables */
  :root {
    --defaultColor: #FAF5F0;
    --hlColor: #f9b639;
    --mainEasing: cubic-bezier(.25, 1, .5, 1);
  }
  
  ::selection {
    background-color: var(--hlColor);
    color: #111;
  }
  
  /* Container styling */
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 0;
    margin: 0;
    color: var(--defaultColor);
    background-color: #0E0E16;
    font-family: PPMori, Roboto, Open Sans, Lato, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, Hiragino Sans, Meiryo, Hiragino Kaku Gothic ProN, sans-serif;
  }
  
  /* Contact Button Container */
  .contact-button-container {
    display: flex;
    justify-content: center;
  }
  
  /* Utility classes */
  .flx-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .flx {
    display: flex;
  }
  
  /* Contact Button styling */
  .header-btn {
    position: relative;
    color: var(--defaultColor);
    font-size: 12px;
    font-weight: 600;
    height: 50px;
    padding: 8px;
    overflow: hidden;
    -webkit-user-drag: none;
    user-select: none;
    transition: opacity .5s var(--mainEasing);
    border: 1px solid rgba(250, 245, 240, 0.3);
    border-radius: 50px;
    text-decoration: none;
    outline: none;
  }
  
  .header-btn:before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(250, 245, 240, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .header-btn:hover {
    border-color: rgba(250, 245, 240, 0.6);
  }
  
  .header-btn:hover:before {
    opacity: 1;
  }
  
  /* Text hover effect for contact button */
  .ha-itm {
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin: 0 0.5px;
  }
  
  .ha-txt, .ha-txtb {
    position: relative;
    display: inline-block;
  }
  
  .ha-txt {
    transform: translateZ(0);
  }
  
  .ha-txto {
    display: flex;
    transition: transform .5s var(--mainEasing);
  }
  
  .ha-txtb {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--hlColor);
    z-index: -1;
    transform: translate3d(-100%,0,0) skew(10deg);
  }
  
  /* Initial states for ha-txt and ha-txtb */
  .header-btn:hover .ha-txt.ha-txto {
    transform: translate3d(100%,0,0);
  }
  
  .header-btn:hover .ha-txtb.ha-txto {
    transform: translate3d(0,0,0);
  }
  
  /* Staggered letter animation timing */
  .ht-1 { transition-delay: 0s; transition-timing-function: var(--mainEasing); }
  .ht-2 { transition-delay: 0.02s; transition-timing-function: var(--mainEasing); }
  .ht-3 { transition-delay: 0.04s; transition-timing-function: var(--mainEasing); }
  .ht-4 { transition-delay: 0.06s; transition-timing-function: var(--mainEasing); }
  .ht-5 { transition-delay: 0.08s; transition-timing-function: var(--mainEasing); }
  .ht-6 { transition-delay: 0.10s; transition-timing-function: var(--mainEasing); }
  .ht-7 { transition-delay: 0.12s; transition-timing-function: var(--mainEasing); }
</style>
