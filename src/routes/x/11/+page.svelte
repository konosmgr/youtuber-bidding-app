<script>
    import Enhanced3DCard from '$lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte';
    
    // Sample data for cards
    const items = [
        {
            title: "Item 1",
            description: "First item with staggered effect",
            price: 100,
            imageSrc: "/images/placeholder-1.jpg",
            altText: "Item 1",
            color: "#ffa3a3",
            zIndex: 100
        },
        {
            title: "Item 2",
            description: "Second item with staggered effect",
            price: 200,
            imageSrc: "/images/placeholder-2.jpg",
            altText: "Item 2",
            color: "#a3c2ff",
            zIndex: 80
        },
        {
            title: "Item 3",
            description: "Third item with staggered effect",
            price: 300,
            imageSrc: "/images/placeholder-3.jpg",
            altText: "Item 3",
            color: "#a3ffb5",
            zIndex: 60
        }
    ];
    
    // Function to handle hover state changes
    function onHoverChange(index, event) {
        console.log(`Card ${index} hover state: ${event.detail.isHovering}`);
    }
</script>

<div class="p-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
    <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-8">Enhanced 3D Card Showcase</h1>
        <p class="text-xl text-gray-300 mb-12">Demonstrating staggered effects with Enhanced3DCard component</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Basic Staggered Card -->
            <div class="h-[400px] relative">
                <Enhanced3DCard 
                    hoverZScale={2.5}
                    maxRotation={15}
                    cardStyle="border-radius: 16px; overflow: hidden;"
                    on:hoverchange={(e) => onHoverChange(0, e)}
                >
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl z-10"></div>
                    
                    <div slot="image" class="absolute inset-0 z-20">
                        <img src="/images/placeholder-card.jpg" alt="Card background" class="w-full h-full object-cover rounded-xl" />
                    </div>
                    
                    <!-- Staggered Elements using getItemStyle with different delays -->
                    <div let:isHovering let:getItemStyle class="absolute inset-0 z-30 p-6 flex flex-col justify-between">
                        {#if true}
                            <div class="staggered-element" 
                                 style="transform: translateZ({getItemStyle(50, { delay: 0 }).zValue}px); 
                                        transition: transform {isHovering ? 0.4 : 0.2}s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0s;">
                                <span class="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                                    Featured
                                </span>
                            </div>
                            
                            <h2 class="staggered-element text-white text-2xl font-bold" 
                                style="transform: translateZ({getItemStyle(80, { delay: 0.05 }).zValue}px); 
                                       transition: transform {isHovering ? 0.4 : 0.2}s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.05s;">
                                Staggered Card Title
                            </h2>
                            
                            <p class="staggered-element text-white/80 mt-2" 
                               style="transform: translateZ({getItemStyle(60, { delay: 0.1 }).zValue}px); 
                                      transition: transform {isHovering ? 0.4 : 0.2}s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.1s;">
                                This card demonstrates staggered animations with different elements appearing with 
                                varying delays and z-depths.
                            </p>
                            
                            <div class="staggered-element mt-auto" 
                                 style="transform: translateZ({getItemStyle(100, { delay: 0.15 }).zValue}px); 
                                        transition: transform {isHovering ? 0.4 : 0.2}s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.15s;">
                                <button class="px-4 py-2 bg-white text-purple-700 rounded-lg font-medium hover:bg-white/90 transition-colors">
                                    View Details
                                </button>
                            </div>
                        {/if}
                    </div>
                </Enhanced3DCard>
            </div>
            
            <!-- Floating Elements Card -->
            <div class="h-[400px] relative">
                <Enhanced3DCard 
                    hoverZScale={3}
                    maxRotation={12}
                    hoverScale={1.03}
                    on:hoverchange={(e) => onHoverChange(1, e)}
                >
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl z-10"></div>
                    
                    <div let:isHovering let:getItemStyle class="absolute inset-0 z-30 p-6 flex flex-col">
                        <!-- Floating circles with staggered animations -->
                        <div class="absolute w-20 h-20 rounded-full bg-yellow-300/30 blur-md"
                             style="top: 10%; left: 15%; 
                                    transform: translateZ({getItemStyle(120, { delay: 0 }).zValue}px) scale({isHovering ? 1.2 : 1}); 
                                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0s;">
                        </div>
                        
                        <div class="absolute w-16 h-16 rounded-full bg-pink-400/30 blur-md"
                             style="top: 60%; left: 70%; 
                                    transform: translateZ({getItemStyle(150, { delay: 0.1 }).zValue}px) scale({isHovering ? 1.3 : 1}); 
                                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;">
                        </div>
                        
                        <div class="absolute w-24 h-24 rounded-full bg-indigo-500/20 blur-md"
                             style="top: 70%; left: 20%; 
                                    transform: translateZ({getItemStyle(100, { delay: 0.2 }).zValue}px) scale({isHovering ? 1.1 : 1}); 
                                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;">
                        </div>
                        
                        <!-- Content with staggered effects -->
                        <div class="mt-auto z-50">
                            <h2 class="text-white text-2xl font-bold"
                                style="transform: translateZ({getItemStyle(90, { delay: 0.05 }).zValue}px); 
                                       transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s;">
                                Floating Elements
                            </h2>
                            
                            <p class="text-white/80 mt-2" 
                               style="transform: translateZ({getItemStyle(70, { delay: 0.15 }).zValue}px); 
                                      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s;">
                                This card shows floating elements that move at different z-depths with staggered timing.
                            </p>
                            
                            <div class="mt-4 flex items-center gap-2"
                                 style="transform: translateZ({getItemStyle(110, { delay: 0.25 }).zValue}px); 
                                        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s;">
                                <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                                <span class="text-white font-medium">Explore</span>
                            </div>
                        </div>
                    </div>
                </Enhanced3DCard>
            </div>
            
            <!-- Layered Content Card -->
            <div class="h-[400px] relative">
                <Enhanced3DCard 
                    hoverZScale={2.2}
                    maxRotation={8}
                    perspective={2000}
                    on:hoverchange={(e) => onHoverChange(2, e)}
                >
                    <div slot="image" class="absolute inset-0 z-10">
                        <div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl"></div>
                    </div>
                    
                    <div let:isHovering let:getItemStyle class="absolute inset-0 z-20 p-6 flex flex-col">
                        <!-- Layered geometric shapes with staggered animations -->
                        <div class="absolute w-40 h-40 rounded-xl bg-emerald-500/10 rotate-12"
                             style="top: 20%; left: 30%; 
                                    transform: translateZ({getItemStyle(30, { delay: 0 }).zValue}px) rotate({isHovering ? 15 : 12}deg); 
                                    transition: transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0s;">
                        </div>
                        
                        <div class="absolute w-32 h-32 rounded-xl bg-purple-500/10 -rotate-6"
                             style="top: 25%; left: 35%; 
                                    transform: translateZ({getItemStyle(60, { delay: 0.1 }).zValue}px) rotate({isHovering ? -10 : -6}deg); 
                                    transition: transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.1s;">
                        </div>
                        
                        <div class="absolute w-24 h-24 rounded-xl bg-amber-500/10 rotate-45"
                             style="top: 30%; left: 40%; 
                                    transform: translateZ({getItemStyle(90, { delay: 0.2 }).zValue}px) rotate({isHovering ? 50 : 45}deg); 
                                    transition: transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67) 0.2s;">
                        </div>
                        
                        <!-- Content with staggered effects -->
                        <div class="z-50 mt-auto">
                            <span class="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm mb-4"
                                  style="transform: translateZ({getItemStyle(50, { delay: 0 }).zValue}px); 
                                         transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0s;">
                                Layered
                            </span>
                            
                            <h2 class="text-white text-2xl font-bold"
                                style="transform: translateZ({getItemStyle(120, { delay: 0.15 }).zValue}px); 
                                       transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s;">
                                Layered Content
                            </h2>
                            
                            <p class="text-white/80 mt-2" 
                               style="transform: translateZ({getItemStyle(90, { delay: 0.2 }).zValue}px); 
                                      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;">
                                This card shows how to create layered content with different z-depths and staggered animations.
                            </p>
                            
                            <div class="mt-4 grid grid-cols-3 gap-2"
                                 style="transform: translateZ({getItemStyle(150, { delay: 0.3 }).zValue}px); 
                                        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s;">
                                <div class="h-2 rounded-full bg-emerald-500/60"></div>
                                <div class="h-2 rounded-full bg-purple-500/60"></div>
                                <div class="h-2 rounded-full bg-amber-500/60"></div>
                            </div>
                        </div>
                    </div>
                </Enhanced3DCard>
            </div>
        </div>
        
        <div class="mt-12">
            <h2 class="text-2xl font-bold text-white mb-6">How It Works</h2>
            <div class="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl text-gray-300">
                <p class="mb-4">The Enhanced3DCard component provides several features that enable staggered effects:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li>The <code class="bg-gray-700/50 px-2 py-0.5 rounded">getItemStyle</code> function allows setting different z-index values and delays for each element</li>
                    <li>Custom easing and duration parameters for fine-tuned animations</li>
                    <li>The <code class="bg-gray-700/50 px-2 py-0.5 rounded">isHovering</code> state can be used to trigger additional animations</li>
                    <li>Z-depth transformations are constrained between <code class="bg-gray-700/50 px-2 py-0.5 rounded">minZ</code> and <code class="bg-gray-700/50 px-2 py-0.5 rounded">maxZ</code> props</li>
                </ul>
                <p class="mt-4">Key properties for controlling staggered effects:</p>
                <pre class="bg-gray-700/50 p-4 rounded-md mt-2 overflow-x-auto">
// For any element inside the card:
style="transform: translateZ({getItemStyle(zValue, { delay: delayValue }).zValue}px); 
       transition: transform {isHovering ? hoverDuration : normalDuration}s 
                   {easingFunction} {delayValue}s;"
                </pre>
            </div>
        </div>
    </div>
</div>

<style>
    /* Add any specific styles needed for the showcase */
    code {
        font-family: "Fira Code", monospace;
    }
    
    /* Make sure staggered elements have good transitions */
    .staggered-element {
        will-change: transform;
    }
</style> 