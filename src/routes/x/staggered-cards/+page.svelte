<script>
  import Enhanced3DCard from '$lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte';
  
  // Sample data for staggered items
  const items = [
    { id: 1, title: 'Item 1', color: '#FF5757', delay: 0.05 },
    { id: 2, title: 'Item 2', color: '#FFD166', delay: 0.1 },
    { id: 3, title: 'Item 3', color: '#06D6A0', delay: 0.15 },
    { id: 4, title: 'Item 4', color: '#118AB2', delay: 0.2 },
    { id: 5, title: 'Item 5', color: '#073B4C', delay: 0.25 }
  ];
  
  // Sample cards with different patterns
  const cards = [
    {
      id: 'cascade',
      title: 'Cascade Effect',
      description: 'Elements cascade from top to bottom',
      image: '/images/alaska-bg.jpg',
      itemColor: '#6366f1'
    },
    {
      id: 'wave',
      title: 'Wave Effect',
      description: 'Elements appear in a wave-like pattern',
      image: '/images/bg-alaska-2.webp',
      itemColor: '#ec4899'
    },
    {
      id: 'spiral',
      title: 'Spiral Effect',
      description: 'Elements spiral outward from the center',
      image: '/images/bg-alaska-3.webp',
      itemColor: '#10b981'
    }
  ];
  
  // Helper function to calculate position based on pattern
  function getPosition(pattern, index, total) {
    if (pattern === 'cascade') {
      // Cascade from top to bottom
      return { 
        x: 0, 
        y: index * 40,
        scale: 1
      };
    } else if (pattern === 'wave') {
      // Wave pattern from left to right
      return { 
        x: index * 40 - 80, 
        y: Math.sin(index * 0.8) * 30,
        scale: 1 
      };
    } else if (pattern === 'spiral') {
      // Spiral pattern
      const angle = (index / total) * Math.PI * 2;
      const radius = 30 + index * 10;
      return { 
        x: Math.cos(angle) * radius, 
        y: Math.sin(angle) * radius,
        scale: 1 - (index * 0.05)
      };
    }
    
    return { x: 0, y: 0, scale: 1 };
  }
</script>

<div class="min-h-screen bg-slate-900 py-12 px-4">
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold text-center mb-8 text-white">3D Card with Staggered Elements</h1>
    <p class="text-center mb-12 text-white/70 max-w-2xl mx-auto">
      Hover over each card to see different staggered animation patterns.
      This example uses only the base Enhanced3DCard component without any complex wrappers.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each cards as card}
        <div class="card-wrapper h-[400px]">
          <h2 class="text-xl font-bold mb-2 text-white">{card.title}</h2>
          <p class="text-white/70 mb-4">{card.description}</p>
          
          <Enhanced3DCard
            hoverZScale={2.5}
            hoverScale={1.05}
            maxRotation={15}
            transitionDuration={0.4}
            imageSrc={card.image}
          >
            <svelte:fragment slot="image">
              <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 rounded-xl">
                <img src={card.image} alt={card.title} class="w-full h-full object-cover rounded-xl opacity-90" />
              </div>
            </svelte:fragment>
            
            <svelte:fragment let:isHovering let:getItemStyle>
              <div class="absolute inset-0 p-6">
                <!-- Card title with staggered entry -->
                <h3 
                  class="text-2xl font-bold text-white transform transition-all duration-500"
                  style="transform: translateY({isHovering ? '0' : '20px'}) translateZ(70px); 
                         opacity: {isHovering ? 1 : 0.6}; 
                         transition-delay: 0.05s;"
                >
                  {card.title}
                </h3>
                
                <!-- Staggered floating elements -->
                {#each items as item, i}
                  {@const pos = getPosition(card.id, i, items.length)}
                  <div 
                    class="absolute staggered-item flex items-center justify-center text-white font-semibold rounded-full"
                    style="
                      width: 40px; 
                      height: 40px; 
                      background-color: {card.itemColor}; 
                      left: 50%; 
                      top: 50%;
                      transform: translate(-50%, -50%) 
                                translateX({isHovering ? pos.x : 0}px) 
                                translateY({isHovering ? pos.y : 0}px) 
                                translateZ({50 + i * 10}px)
                                scale({isHovering ? pos.scale : 0.5});
                      opacity: {isHovering ? 0.9 : 0};
                      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) {item.delay}s;
                    "
                  >
                    {i + 1}
                  </div>
                {/each}
                
                <!-- Bottom content with staggered entry -->
                <div 
                  class="absolute bottom-6 left-6 right-6"
                  style="transform: translateY({isHovering ? '0' : '20px'}) translateZ(30px); 
                         opacity: {isHovering ? 1 : 0}; 
                         transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.2s;"
                >
                  <p class="text-white/80 text-sm mb-4">{card.description}</p>
                  <button 
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white text-sm"
                    style="transition: all 0.3s ease-out; transform: translateZ(10px);"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </svelte:fragment>
          </Enhanced3DCard>
        </div>
      {/each}
    </div>
    
    <div class="mt-16 p-6 bg-white/5 rounded-xl max-w-3xl mx-auto">
      <h2 class="text-xl font-bold mb-4 text-white">How To Use The Staggered Pattern</h2>
      <p class="text-white/70 mb-4">
        To create staggered elements within an Enhanced3DCard:
      </p>
      <ol class="list-decimal pl-6 text-white/70 space-y-2">
        <li>Position elements absolutely within the card</li>
        <li>Use the isHovering state to control visibility and position</li>
        <li>Apply different transition delays to each element</li>
        <li>Use translateZ to control the depth of each element</li>
        <li>Animate from a hidden state to a visible state with transforms</li>
      </ol>
    </div>
  </div>
</div>

<style>
  .card-wrapper {
    display: flex;
    flex-direction: column;
  }
  
  :global(.card-wrapper .enhanced-card-wrapper) {
    flex: 1;
  }
</style> 