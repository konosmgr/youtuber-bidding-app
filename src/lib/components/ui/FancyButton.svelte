<script>
    // Props for the button component
    export let text = "EXPLORE"; // Default text
    export let bgColor = "#0f172a"; // Deep navy background
    export let textColor = "#f8fafc"; // Light text
    export let hoverTextColor = "#60a5fa"; // Light blue on hover
    export let href = "#"; // Link destination
  
    // Function to split text into individual letters with spans
    const splitText = (text) => {
      return text.split('').map((letter) => {
        return `<span class="letter">${letter}</span>`;
      }).join('');
    };
  
    // Handle mouse enter/leave for additional effects (optional)
    let isHovered = false;
    
    const handleMouseEnter = () => {
      isHovered = true;
    };
    
    const handleMouseLeave = () => {
      isHovered = false;
    };
  </script>
  
  <a 
    href={href}
    class="fancy-button"
    style="--bg-color: {bgColor}; --text-color: {textColor}; --hover-text-color: {hoverTextColor};"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    class:hovered={isHovered}
  >
    <div class="button-content">
      {@html splitText(text)}
    </div>
  </a>
  
  <style>
    .fancy-button {
      display: inline-block;
      position: relative;
      padding: 18px 36px;
      border-radius: 12px;
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: 'Inter', 'Helvetica Neue', sans-serif;
      font-weight: 700;
      font-size: 18px;
      text-decoration: none;
      letter-spacing: 0.05em;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  
    .fancy-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  
    .button-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .letter {
      display: inline-block;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                  color 0.3s ease;
    }
  
    .fancy-button:hover .letter {
      letter-spacing: 0.2em;
      color: var(--hover-text-color);
    }
  
    /* Create a staggered animation effect for each letter */
    .fancy-button:hover .letter:nth-child(2n) {
      transform: translateY(-2px);
    }
  
    .fancy-button:hover .letter:nth-child(2n+1) {
      transform: translateY(2px);
    }
  
    /* Optional: Add a subtle background animation */
    .fancy-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }
  
    .fancy-button:hover::after {
      opacity: 1;
    }
  </style>