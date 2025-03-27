<script>
  import { onMount } from 'svelte';

  let canvas;
  let ctx;
  let animationFrameId;
  let videoElement;
  let videoLoaded = false;
  let emailRevealed = false;

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext('2d');
      resizeCanvas();
      
      // Check if video loads successfully
      if (videoElement) {
        videoElement.addEventListener('loadeddata', () => {
          videoLoaded = true;
        });
        
        videoElement.addEventListener('error', () => {
          console.log('Video failed to load, using canvas animation instead');
          videoLoaded = false;
          animateOcean(); // Use the ocean animation as fallback
        });
      }
      
      animate(); // Always run the wave animation on top
      window.addEventListener('resize', resizeCanvas);

      // Reveal the email with animation after a short delay
      setTimeout(() => {
        emailRevealed = true;
        const emailElement = document.querySelector('.email');
        if (emailElement) {
          emailElement.style.opacity = 1;
          animateEmailReveal();
        }
      }, 800);
    }

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  // Animate the email reveal with the mask effect
  function animateEmailReveal() {
    const emailWrapper = document.querySelector('.email-wrapper');
    const maskL1 = document.querySelector('.mask-l1');
    const maskL2 = document.querySelector('.mask-l2');
    
    if (!emailWrapper || !maskL1 || !maskL2) return;
    
    // Initial values
    let apg1 = 0;
    let apg2 = 0;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    
    function updateMask(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function - cubic-bezier similar to --mainEasing
      const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
      const easedProgress = easeOutQuart(progress);
      
      // Update mask values with a slight offset between them
      apg1 = Math.min(easedProgress, 1);
      apg2 = Math.max(0, Math.min(easedProgress - 0.05, 1));
      
      maskL1.style.setProperty('--apg-1', apg1);
      maskL1.style.setProperty('--apg-2', apg2);
      maskL2.style.setProperty('--apg-1', apg1);
      maskL2.style.setProperty('--apg-2', apg2);
      
      if (progress < 1) {
        requestAnimationFrame(updateMask);
      }
    }
    
    requestAnimationFrame(updateMask);
  }

  // This is the main wave animation that runs on top of everything
  function animate() {
    const waves = {
      y: canvas.height / 2,
      length: 0.01,
      amplitude: 20,
      frequency: 0.01
    };

    let increment = waves.frequency;

    function draw() {
      animationFrameId = requestAnimationFrame(draw);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      
      ctx.globalAlpha = 0.1; // Semi-transparent effect
      
      for (let i = 0; i < canvas.width; i++) {
        // Multiple overlapping sine waves for more complex effect
        const sin = Math.sin(i * waves.length + increment) * waves.amplitude;
        const sin2 = Math.sin(i * waves.length * 0.8 + increment * 1.2) * waves.amplitude * 0.8;
        const sin3 = Math.sin(i * waves.length * 1.2 + increment * 0.8) * waves.amplitude * 0.6;
        
        const y = sin + sin2 + sin3 + canvas.height / 2;
        
        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }
      
      // Fill bottom portion of the canvas with gradient
      const gradient = ctx.createLinearGradient(0, canvas.height / 2, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 100, 200, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 20, 50, 0.2)');
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      
      increment += 0.005;
    }

    draw();
  }

  // This is the fallback ocean animation if video doesn't load
  function animateOcean() {
    if (!canvas || videoLoaded) return;
    
    const oceanCtx = canvas.getContext('2d');
    const waves = {
      count: 5,
      speed: 0.5,
      amplitude: 15,
      frequency: 0.02
    };
    
    let time = 0;
    
    function drawOcean() {
      if (videoLoaded) return; // Stop if video loaded
      
      requestAnimationFrame(drawOcean);
      
      // Only draw the background if video failed to load
      // Don't clear the canvas as the wave animation will handle that
      
      // Draw ocean background
      const gradient = oceanCtx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#01142A');
      gradient.addColorStop(1, '#004080');
      oceanCtx.fillStyle = gradient;
      oceanCtx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw waves
      for (let w = 0; w < waves.count; w++) {
        const waveOffset = w * 0.2;
        
        oceanCtx.beginPath();
        oceanCtx.moveTo(0, canvas.height / 2);
        
        for (let x = 0; x < canvas.width; x += 5) {
          const dx = x / canvas.width;
          const offsetY = Math.sin(dx * 10 + time + waveOffset) * 
                        Math.sin(dx * 15 + time * 0.8) * 
                        waves.amplitude * (w + 1) / waves.count;
          
          const y = canvas.height * (0.5 + w * 0.05) + offsetY;
          
          oceanCtx.lineTo(x, y);
        }
        
        oceanCtx.lineTo(canvas.width, canvas.height);
        oceanCtx.lineTo(0, canvas.height);
        oceanCtx.closePath();
        
        // Set wave color with transparency
        oceanCtx.fillStyle = `rgba(0, 100, 200, ${0.1 - w * 0.01})`;
        oceanCtx.fill();
      }
      
      // Add some "light reflections"
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.7 + canvas.height * 0.3;
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.2;
        
        oceanCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        oceanCtx.beginPath();
        oceanCtx.arc(x, y, size, 0, Math.PI * 2);
        oceanCtx.fill();
      }
      
      time += 0.01;
    }
    
    drawOcean();
  }
</script>

<svelte:head>
  <title>Water Effect Showcase - Utsubo Style</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="container">
  <!-- Video background -->
  <video 
    bind:this={videoElement}
    class="video-background" 
    autoplay 
    loop 
    muted 
    playsinline
  >
    <source src="/videos/ocean.mp4" type="video/mp4">
    <!-- Fallback text -->
    Your browser does not support the video tag. Please update your browser.
  </video>
  
  <!-- Dark overlay -->
  <div class="overlay"></div>
  
  <!-- Canvas for additional effects -->
  <canvas bind:this={canvas} id="effectCanvas"></canvas>
  
  <!-- Content -->
  <div class="content">
    <div class="nav">
      <div class="logo">UTSUBO</div>
      <div class="menu">
        <a href="#contact" class="header-btn">
          <span class="flx">
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-1">C</span>
              <span class="ha-txtb ha-txto ht-1" aria-hidden="true">C</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-2">O</span>
              <span class="ha-txtb ha-txto ht-2" aria-hidden="true">O</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-3">N</span>
              <span class="ha-txtb ha-txto ht-3" aria-hidden="true">N</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-4">T</span>
              <span class="ha-txtb ha-txto ht-4" aria-hidden="true">T</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-5">A</span>
              <span class="ha-txtb ha-txto ht-5" aria-hidden="true">A</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-6">C</span>
              <span class="ha-txtb ha-txto ht-6" aria-hidden="true">C</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-7">T</span>
              <span class="ha-txtb ha-txto ht-7" aria-hidden="true">T</span>
            </span>
          </span>
        </a>
      </div>
    </div>
    
    <div class="buttons">
      <a href="#" class="btn">
        <span class="flx">
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-1">N</span>
            <span class="ha-txtb ha-txto ht-1" aria-hidden="true">N</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-2">E</span>
            <span class="ha-txtb ha-txto ht-2" aria-hidden="true">E</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-3">W</span>
            <span class="ha-txtb ha-txto ht-3" aria-hidden="true">W</span>
          </span>
          <span class="ha-itm">
            <span>&nbsp;</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-4">B</span>
            <span class="ha-txtb ha-txto ht-4" aria-hidden="true">B</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-5">U</span>
            <span class="ha-txtb ha-txto ht-5" aria-hidden="true">U</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-6">S</span>
            <span class="ha-txtb ha-txto ht-6" aria-hidden="true">S</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-7">I</span>
            <span class="ha-txtb ha-txto ht-7" aria-hidden="true">I</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-8">N</span>
            <span class="ha-txtb ha-txto ht-8" aria-hidden="true">N</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-9">E</span>
            <span class="ha-txtb ha-txto ht-9" aria-hidden="true">E</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-10">S</span>
            <span class="ha-txtb ha-txto ht-10" aria-hidden="true">S</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-11">S</span>
            <span class="ha-txtb ha-txto ht-11" aria-hidden="true">S</span>
          </span>
        </span>
      </a>
      <a href="#" class="btn">
        <span class="flx">
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-1">J</span>
            <span class="ha-txtb ha-txto ht-1" aria-hidden="true">J</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-2">O</span>
            <span class="ha-txtb ha-txto ht-2" aria-hidden="true">O</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-3">I</span>
            <span class="ha-txtb ha-txto ht-3" aria-hidden="true">I</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-4">N</span>
            <span class="ha-txtb ha-txto ht-4" aria-hidden="true">N</span>
          </span>
          <span class="ha-itm">
            <span>&nbsp;</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-5">U</span>
            <span class="ha-txtb ha-txto ht-5" aria-hidden="true">U</span>
          </span>
          <span class="ha-itm">
            <span class="ha-txt ha-txto ht-6">S</span>
            <span class="ha-txtb ha-txto ht-6" aria-hidden="true">S</span>
          </span>
        </span>
      </a>
    </div>
    
    <div class="email-wrapper">
      <a href="mailto:contact@utsubo.co" class="email mail">contact@utsubo.co</a>
      <span class="mask-l1 mail mask-appear">contact@utsubo.co</span>
      <span class="mask-l2 mail mask-appear">contact@utsubo.co</span>
    </div>
    
    <div class="footer">
      <div>1-15-18 Nishihonmachi, Chuo Ward,</div>
      <div>Osaka, Japan 542-0066</div>
      <div class="social-links">
        <a href="#" class="social-link">
          <span class="flx">
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-1">T</span>
              <span class="ha-txtb ha-txto ht-1" aria-hidden="true">T</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-2">w</span>
              <span class="ha-txtb ha-txto ht-2" aria-hidden="true">w</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-3">i</span>
              <span class="ha-txtb ha-txto ht-3" aria-hidden="true">i</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-4">t</span>
              <span class="ha-txtb ha-txto ht-4" aria-hidden="true">t</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-5">t</span>
              <span class="ha-txtb ha-txto ht-5" aria-hidden="true">t</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-6">e</span>
              <span class="ha-txtb ha-txto ht-6" aria-hidden="true">e</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-7">r</span>
              <span class="ha-txtb ha-txto ht-7" aria-hidden="true">r</span>
            </span>
          </span>
        </a>
        <a href="#" class="social-link">
          <span class="flx">
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-1">G</span>
              <span class="ha-txtb ha-txto ht-1" aria-hidden="true">G</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-2">i</span>
              <span class="ha-txtb ha-txto ht-2" aria-hidden="true">i</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-3">t</span>
              <span class="ha-txtb ha-txto ht-3" aria-hidden="true">t</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-4">H</span>
              <span class="ha-txtb ha-txto ht-4" aria-hidden="true">H</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-5">u</span>
              <span class="ha-txtb ha-txto ht-5" aria-hidden="true">u</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-6">b</span>
              <span class="ha-txtb ha-txto ht-6" aria-hidden="true">b</span>
            </span>
          </span>
        </a>
        <a href="#" class="social-link">
          <span class="flx">
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-1">L</span>
              <span class="ha-txtb ha-txto ht-1" aria-hidden="true">L</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-2">i</span>
              <span class="ha-txtb ha-txto ht-2" aria-hidden="true">i</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-3">n</span>
              <span class="ha-txtb ha-txto ht-3" aria-hidden="true">n</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-4">k</span>
              <span class="ha-txtb ha-txto ht-4" aria-hidden="true">k</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-5">e</span>
              <span class="ha-txtb ha-txto ht-5" aria-hidden="true">e</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-6">d</span>
              <span class="ha-txtb ha-txto ht-6" aria-hidden="true">d</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-7">I</span>
              <span class="ha-txtb ha-txto ht-7" aria-hidden="true">I</span>
            </span>
            <span class="ha-itm">
              <span class="ha-txt ha-txto ht-8">n</span>
              <span class="ha-txtb ha-txto ht-8" aria-hidden="true">n</span>
            </span>
          </span>
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Roboto', Arial, sans-serif;
    color: white;
  }
  
  :root {
    --defaultColor: #FAF5F0;
    --hlColor: #f9b639;
    --mainEasing: cubic-bezier(.25, 1, .5, 1);
  }
  
  .container {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
  
  .video-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    filter: brightness(0.5) saturate(1.5) hue-rotate(190deg);
  }
  
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 20, 40, 0.5);
    z-index: 0;
  }
  
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
  
  .content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    text-align: center;
    padding: 2rem;
    box-sizing: border-box;
  }
  
  .email-wrapper {
    position: relative;
    align-self: center;
    padding: 0;
  }
  
  .mail {
    position: relative;
    color: var(--defaultColor);
    font-size: clamp(2rem, 10vw, 5rem);
    line-height: 120%;
    font-weight: 100;
    opacity: 0;
    transition: opacity 0.5s ease;
    padding: 0 10px;
    text-decoration: none;
  }
  
  .mask-l1, .mask-l2 {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
    padding: 0 10px;
  }
  
  .mask-l1 {
    color: var(--hlColor);
    z-index: 1;
  }
  
  .mask-l2 {
    z-index: 2;
  }
  
  .mask-appear {
    mask-image: linear-gradient(90deg, black 0%, black calc(var(--apg-2, 0)* 100%), transparent calc(var(--apg-1, 0)* 100%), transparent 100%);
    -webkit-mask-image: linear-gradient(90deg, black 0%, black calc(var(--apg-2, 0)* 100%), transparent calc(var(--apg-1, 0)* 100%), transparent 100%);
  }
  
  .nav {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .menu {
    display: flex;
    gap: 2rem;
  }
  
  /* Flex helper */
  .flx {
    display: flex;
  }
  
  /* Character-by-character hover animation styles */
  .header-btn, .btn, .social-link {
    color: var(--defaultColor);
    font-size: 12px;
    font-weight: 600;
    padding: 8px;
    text-decoration: none;
    user-select: none;
    transition: opacity 0.5s var(--mainEasing);
    pointer-events: all;
  }
  
  .ha-itm {
    position: relative;
    overflow: hidden;
    display: inline-block;
  }
  
  .ha-txt, .ha-txtb {
    display: inline-block;
  }
  
  .ha-txto {
    transition: transform 0.5s var(--mainEasing);
  }
  
  .ha-txtb {
    position: absolute;
    top: 0;
    left: 0;
    color: var(--hlColor);
    transform: translate3d(100%, 0, 0) skew(10deg);
  }
  
  /* Staggered animations for each letter */
  .ht-1 { transition-delay: 0ms; }
  .ht-2 { transition-delay: 15ms; }
  .ht-3 { transition-delay: 30ms; }
  .ht-4 { transition-delay: 45ms; }
  .ht-5 { transition-delay: 60ms; }
  .ht-6 { transition-delay: 75ms; }
  .ht-7 { transition-delay: 90ms; }
  .ht-8 { transition-delay: 105ms; }
  .ht-9 { transition-delay: 120ms; }
  .ht-10 { transition-delay: 135ms; }
  .ht-11 { transition-delay: 150ms; }
  .ht-12 { transition-delay: 165ms; }
  
  /* Hover effects */
  .ha-itm:hover .ha-txt {
    transform: translate3d(-100%, 0, 0) skew(-10deg);
  }
  
  .ha-itm:hover .ha-txtb {
    transform: translate3d(0, 0, 0) skew(0deg);
  }
  
  .social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .footer {
    text-align: center;
    line-height: 1.5;
    font-size: 0.9rem;
  }
  
  .buttons {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin: 0 auto;
  }
  
  .btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: var(--defaultColor);
    padding: 0.5rem 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;
  }
  
  .btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .social-link {
    color: var(--defaultColor);
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .social-link:hover {
    opacity: 1;
  }
</style> 