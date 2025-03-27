<script>
  import { page } from '$app/stores';
  import { isAuthenticated } from '$lib/stores/auth';
  import { fetchApi } from '$lib/utils/api';
  import { onMount, onDestroy } from 'svelte';
  import { unreadCount, loadConversations } from '$lib/stores/messaging';
  import { browser } from '$app/environment';
  import HoverTextButton from '$lib/components/ui/HoverTextButton.svelte';

  // Make the component client-side only
  export const csr = true;

  $: activeRoute = $page.url.pathname;
  $: isAdmin = false;

  let user = null;
  let isOpen = false;
  let scrollPosition = 0;
  let isScrolled = false;
  let animationFrame;
  let currentTime = 0;
  let hoverItems = new Map();

  // Track hover state for nav items
  function handleHover(id, isHovered) {
    hoverItems.set(id, isHovered);
    hoverItems = hoverItems; // trigger reactivity
  }

  function toggleMenu() {
    isOpen = !isOpen;
  }

  // Animate background effects
  function animate() {
    currentTime += 0.01;
    if (browser) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function handleScroll() {
    if (browser) {
      scrollPosition = window.scrollY;
      isScrolled = scrollPosition > 10;
    }
  }

  onMount(async () => {
    // Check authentication status when component mounts
    await isAuthenticated.check();
    
    // If authenticated, fetch user data
    if ($isAuthenticated) {
      try {
        user = await fetchApi('users/me/');
        isAdmin = user.is_staff;
        console.log("Fetched user email:", user.email);
        
        // Load unread message count if user is authenticated
        await loadConversations();
      } catch (e) {
        console.error('Error fetching user data:', e);
      }
    }

    // Add scroll event listener
    if (browser) {
      window.addEventListener('scroll', handleScroll);
      
      // Run once to initialize scroll position
      handleScroll();
      
      // Start animation
      animate();
    }
  });

  onDestroy(() => {
    // Clean up event listeners and animations
    if (browser) {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    }
  });

  async function handleLogout() {
    try {
      await isAuthenticated.logout();
      if (browser) {
        window.location.href = '/';
      }
    } catch (e) {
      console.error('Logout failed:', e);
    }
  }

  // Helper function for generating dynamic styles
  function sineWave(time, id, amplitude = 0.5, frequency = 1) {
    if (!hoverItems.get(id)) return 0;
    return Math.sin(time * frequency) * amplitude;
  }
</script>

<header class="fixed top-0 z-50 w-full transition-all duration-300 {isScrolled ? 'backdrop-blur-md bg-black/70 shadow-xl shadow-amber-900/10' : 'bg-gradient-to-b from-gray-900/90 to-black/70'}" style="--nav-time: {currentTime}">
  <!-- Background glow effects -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-12 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/4 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl"></div>
  </div>

  <!-- Subtle animated gradient overlay -->
  <div class="absolute inset-0 bg-gradient-to-r from-gray-900/30 via-black/0 to-gray-900/30 opacity-40"></div>
  
  <!-- Fine grid pattern -->
  <div class="absolute inset-0 pattern-grid opacity-10"></div>

  <div class="container mx-auto px-4 relative">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center space-x-3 group">
        <div class="relative">
          <span class="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-white text-lg font-bold shadow-lg transition-all duration-300 group-hover:shadow-amber-500/20 group-hover:shadow-xl">
            A
          </span>
          <span class="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </div>
        <span class="text-lg font-semibold tracking-tight text-white group-hover:text-amber-300 transition-colors duration-300">Betting on Alaska Auctions</span>
      </a>

      <!-- Desktop Menu -->
      <nav class="hidden lg:flex items-center">
        <!-- Navigation links with glass effect -->
        <div class="flex items-center space-x-1 bg-gray-900/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/5 shadow-xl">
          <a
            href="/"
            class="group relative px-4 py-2 rounded-full transition-all duration-300 overflow-hidden {activeRoute === '/' ? 'text-amber-400' : 'text-gray-200'}"
            on:mouseenter={() => handleHover('home', true)}
            on:mouseleave={() => handleHover('home', false)}
          >
            <span class="relative z-10 flex items-center text-sm font-medium group-hover:text-amber-300">
              <HoverTextButton 
                text="AUCTIONS" 
                href="/" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
            
            <!-- Highlight background -->
            {#if activeRoute === '/'}
              <span class="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/20 rounded-full"></span>
            {/if}
            
            <!-- Hover effect -->
            <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            <!-- Animated glow effect -->
            <span class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-effect"
                style="transform: translate({sineWave(currentTime, 'home', 2, 1)}px, {sineWave(currentTime, 'home', 2, 0.5)}px)"></span>
          </a>

          <a
            href="/knives"
            class="group relative px-4 py-2 rounded-full transition-all duration-300 overflow-hidden {activeRoute === '/knives' ? 'text-amber-400' : 'text-gray-200'}"
            on:mouseenter={() => handleHover('knives', true)}
            on:mouseleave={() => handleHover('knives', false)}
          >
            <span class="relative z-10 flex items-center text-sm font-medium group-hover:text-amber-300">
              <HoverTextButton 
                text="KNIVES" 
                href="/knives" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
            
            <!-- Highlight background -->
            {#if activeRoute === '/knives'}
              <span class="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/20 rounded-full"></span>
            {/if}
            
            <!-- Hover effect -->
            <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            <!-- Animated glow effect -->
            <span class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-effect"
                style="transform: translate({sineWave(currentTime, 'knives', 2, 1)}px, {sineWave(currentTime, 'knives', 2, 0.5)}px)"></span>
          </a>

          <a
            href="/paintings"
            class="group relative px-4 py-2 rounded-full transition-all duration-300 overflow-hidden {activeRoute === '/paintings' ? 'text-amber-400' : 'text-gray-200'}"
            on:mouseenter={() => handleHover('art', true)}
            on:mouseleave={() => handleHover('art', false)}
          >
            <span class="relative z-10 flex items-center text-sm font-medium group-hover:text-amber-300">
              <HoverTextButton 
                text="ART" 
                href="/paintings" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
            
            <!-- Highlight background -->
            {#if activeRoute === '/paintings'}
              <span class="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/20 rounded-full"></span>
            {/if}
            
            <!-- Hover effect -->
            <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            <!-- Animated glow effect -->
            <span class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-effect"
                style="transform: translate({sineWave(currentTime, 'art', 2, 1)}px, {sineWave(currentTime, 'art', 2, 0.5)}px)"></span>
          </a>

          <a
            href="/misc"
            class="group relative px-4 py-2 rounded-full transition-all duration-300 overflow-hidden {activeRoute === '/misc' ? 'text-amber-400' : 'text-gray-200'}"
            on:mouseenter={() => handleHover('misc', true)}
            on:mouseleave={() => handleHover('misc', false)}
          >
            <span class="relative z-10 flex items-center text-sm font-medium group-hover:text-amber-300">
              <HoverTextButton 
                text="MISC" 
                href="/misc" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
            
            <!-- Highlight background -->
            {#if activeRoute === '/misc'}
              <span class="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/20 rounded-full"></span>
            {/if}
            
            <!-- Hover effect -->
            <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            <!-- Animated glow effect -->
            <span class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-effect"
                style="transform: translate({sineWave(currentTime, 'misc', 2, 1)}px, {sineWave(currentTime, 'misc', 2, 0.5)}px)"></span>
          </a>
        </div>

        <!-- Secondary links -->
        <div class="flex items-center space-x-1 ml-4">
          <a 
            href="/about" 
            class="group relative px-3 py-2 rounded-full transition-all duration-300 {activeRoute === '/about' ? 'text-amber-400' : 'text-gray-300'}"
            on:mouseenter={() => handleHover('about', true)}
            on:mouseleave={() => handleHover('about', false)}
          >
            <span class="relative z-10 flex items-center text-sm group-hover:text-amber-300">
              <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <HoverTextButton 
                text="ABOUT" 
                href="/about" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
            
            <!-- Hover effect -->
            <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            <!-- Glow dot -->
            {#if activeRoute === '/about'}
              <span class="absolute bottom-0.5 left-1/2 h-1 w-1 bg-amber-400 rounded-full transform -translate-x-1/2"></span>
            {/if}
          </a>

          <a 
            href="/contact" 
            class="group relative px-3 py-2 rounded-full transition-all duration-300 {activeRoute === '/contact' ? 'text-amber-400' : 'text-gray-300'}"
            on:mouseenter={() => handleHover('contact', true)}
            on:mouseleave={() => handleHover('contact', false)}
          >
            <span class="relative z-10 flex items-center text-sm group-hover:text-amber-300">
              <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <HoverTextButton 
                text="CONTACT" 
                href="/contact" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
            
            <!-- Hover effect -->
            <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            <!-- Glow dot -->
            {#if activeRoute === '/contact'}
              <span class="absolute bottom-0.5 left-1/2 h-1 w-1 bg-amber-400 rounded-full transform -translate-x-1/2"></span>
            {/if}
          </a>

          <!-- Support Chat Link -->
          {#if $isAuthenticated && !isAdmin}
            <a 
              href="/support" 
              class="group relative px-3 py-2 rounded-full transition-all duration-300 {activeRoute === '/support' ? 'text-amber-400' : 'text-gray-300'}"
              on:mouseenter={() => handleHover('support', true)}
              on:mouseleave={() => handleHover('support', false)}
            >
              <span class="relative z-10 flex items-center text-sm group-hover:text-amber-300">
                <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <HoverTextButton 
                  text="SUPPORT" 
                  href="/support" 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                />
                {#if $unreadCount > 0}
                  <span class="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {$unreadCount}
                  </span>
                {/if}
              </span>
              
              <!-- Hover effect -->
              <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              
              <!-- Glow dot -->
              {#if activeRoute === '/support'}
                <span class="absolute bottom-0.5 left-1/2 h-1 w-1 bg-amber-400 rounded-full transform -translate-x-1/2"></span>
              {/if}
            </a>
          {:else if $isAuthenticated && isAdmin}
            <a 
              href="/admin/chats" 
              class="group relative px-3 py-2 rounded-full transition-all duration-300 {activeRoute === '/admin/chats' ? 'text-amber-400' : 'text-gray-300'}"
              on:mouseenter={() => handleHover('admin-chats', true)}
              on:mouseleave={() => handleHover('admin-chats', false)}
            >
              <span class="relative z-10 flex items-center text-sm group-hover:text-amber-300">
                <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <HoverTextButton 
                  text="SUPPORT CHATS" 
                  href="/admin/chats" 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                />
                {#if $unreadCount > 0}
                  <span class="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {$unreadCount}
                  </span>
                {/if}
              </span>
              
              <!-- Hover effect -->
              <span class="absolute inset-0 rounded-full bg-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              
              <!-- Glow dot -->
              {#if activeRoute === '/admin/chats'}
                <span class="absolute bottom-0.5 left-1/2 h-1 w-1 bg-amber-400 rounded-full transform -translate-x-1/2"></span>
              {/if}
            </a>
          {/if}

          <a 
            href="https://www.youtube.com/@MickWhipple" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="group relative px-3 py-2 rounded-full transition-all duration-300 text-gray-300"
            on:mouseenter={() => handleHover('youtube', true)}
            on:mouseleave={() => handleHover('youtube', false)}
          >
            <span class="relative z-10 flex items-center text-sm group-hover:text-red-400">
              <svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <HoverTextButton 
                text="YOUTUBE" 
                href="https://www.youtube.com/@MickWhipple" 
                preserveStyle={true}
                highlightColor="#ff0000"
              />
            </span>
            
            <!-- Hover effect -->
            <span class="absolute inset-0 rounded-full bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </a>
        </div>
      </nav>

      <!-- Auth Buttons -->
      <div class="hidden lg:flex items-center space-x-3">
        {#if $isAuthenticated}
          <!-- User dropdown menu -->
          <div class="relative group">
            <button 
              class="px-4 py-2 text-sm font-medium text-white bg-black/30 hover:bg-black/40 border border-white/5 hover:border-amber-500/20 backdrop-blur-sm rounded-full transition-all duration-300 flex items-center shadow-lg"
            >
              <span class="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
              
              <span class="flex flex-col items-start">
                <span class="text-xs text-gray-400">Welcome</span>
                <span class="text-sm font-semibold text-amber-300 truncate max-w-[120px]">{user?.email || 'User'}</span>
              </span>
              
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Dropdown menu -->
            <div class="absolute right-0 mt-2 w-56 rounded-lg overflow-hidden z-20 opacity-10 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100 transform group-hover:translate-y-0 translate-y-2">
              <!-- Backdrop blur -->
              <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-xl rounded-lg"></div>
              
              <!-- Border glow -->
              <div class="absolute inset-0 rounded-lg p-px bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent"></div>
              
              <!-- Menu content -->
              <div class="relative">
                <a 
                  href="/profile" 
                  class="flex items-center px-4 py-3 hover:bg-amber-500/10 transition-colors duration-200 border-b border-white/5"
                >
                  <div class="bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-2 rounded-full mr-3">
                    <svg class="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-white">Your Profile</div>
                    <div class="text-xs text-gray-400">View and update your profile</div>
                  </div>
                </a>
                
                {#if isAdmin}
                  <a 
                    href="/admin" 
                    class="flex items-center px-4 py-3 hover:bg-amber-500/10 transition-colors duration-200 border-b border-white/5"
                  >
                    <div class="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 p-2 rounded-full mr-3">
                      <svg class="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-white">Admin Panel</div>
                      <div class="text-xs text-gray-400">Manage site content</div>
                    </div>
                  </a>
                {/if}
                
                <button 
                  on:click={handleLogout}
                  class="w-full flex items-center px-4 py-3 hover:bg-red-500/10 transition-colors duration-200"
                >
                  <div class="bg-gradient-to-br from-red-500/20 to-red-600/20 p-2 rounded-full mr-3">
                    <svg class="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-white">Sign Out</div>
                    <div class="text-xs text-gray-400">End your session</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        {:else}
          <div class="flex items-center space-x-3">
            <a href="/login" class="px-4 py-2 text-sm font-medium text-white/90 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full border border-white/5 hover:border-white/10 transition-all duration-300">
              Sign In
            </a>
            <a href="/register" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-700 rounded-full shadow-lg shadow-amber-800/20 hover:shadow-amber-800/30 transition-all duration-300 border border-amber-500/50">
              Register
            </a>
          </div>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="lg:hidden relative p-2 text-gray-200 hover:text-amber-300 focus:outline-none rounded-full transition-colors duration-300 bg-black/30 backdrop-blur-sm border border-white/5"
        on:click={toggleMenu}
        aria-expanded={isOpen}
      >
        <span class="sr-only">Toggle menu</span>
        <div class="relative w-6 h-6 overflow-hidden">
          <span class="absolute inset-0 flex items-center justify-center transition-all duration-300 {isOpen ? 'opacity-100' : 'opacity-0'}">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <span class="absolute inset-0 flex items-center justify-center transition-all duration-300 {isOpen ? 'opacity-0' : 'opacity-100'}">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </span>
        </div>
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isOpen}
    <div class="lg:hidden overflow-hidden animate-slide-down">
      <!-- Backdrop with blur -->
      <div class="relative z-10 backdrop-blur-xl bg-gray-900/80 rounded-b-2xl shadow-xl border-t border-white/5 px-4 py-6">
        <!-- Grid pattern background -->
        <div class="absolute inset-0 pattern-grid opacity-10"></div>
        
        <!-- Glow effects -->
        <div class="absolute -top-12 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        <!-- Mobile menu items -->
        <div class="space-y-3">
          {#each [
            { href: "/", label: "AUCTIONS", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            { href: "/knives", label: "KNIVES", icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" },
            { href: "/paintings", label: "ART", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { href: "/misc", label: "MISC", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" }
          ] as item}
            <a
              href={item.href}
              class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 {activeRoute === item.href ? 'bg-gradient-to-r from-amber-900/20 to-black border-l-2 border-amber-500 text-amber-400' : 'text-gray-200 hover:bg-gray-800/30'}"
            >
              <div class="w-8 h-8 flex items-center justify-center mr-3 {activeRoute === item.href ? 'text-amber-400' : 'text-gray-400'}">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
                </svg>
              </div>
              <span class="font-medium">
                <HoverTextButton 
                  text={item.label} 
                  href={item.href} 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                />
              </span>
            </a>
          {/each}
          
          <div class="border-t border-gray-800 my-3"></div>
          
          <a href="/about" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 {activeRoute === '/about' ? 'bg-gradient-to-r from-amber-900/20 to-black border-l-2 border-amber-500 text-amber-400' : 'text-gray-200 hover:bg-gray-800/30'}">
            <div class="w-8 h-8 flex items-center justify-center mr-3 {activeRoute === '/about' ? 'text-amber-400' : 'text-gray-400'}">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <span class="font-medium">
              <HoverTextButton 
                text="ABOUT" 
                href="/about" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
          </a>
          
          <a href="/contact" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 {activeRoute === '/contact' ? 'bg-gradient-to-r from-amber-900/20 to-black border-l-2 border-amber-500 text-amber-400' : 'text-gray-200 hover:bg-gray-800/30'}">
            <div class="w-8 h-8 flex items-center justify-center mr-3 {activeRoute === '/contact' ? 'text-amber-400' : 'text-gray-400'}">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <span class="font-medium">
              <HoverTextButton 
                text="CONTACT" 
                href="/contact" 
                preserveStyle={true}
                highlightColor="#f9b639"
              />
            </span>
          </a>
          
          <!-- Support Chat Link (Mobile) -->
          {#if $isAuthenticated && !isAdmin}
            <a href="/support" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 {activeRoute === '/support' ? 'bg-gradient-to-r from-amber-900/20 to-black border-l-2 border-amber-500 text-amber-400' : 'text-gray-200 hover:bg-gray-800/30'}">
              <div class="w-8 h-8 flex items-center justify-center mr-3 {activeRoute === '/support' ? 'text-amber-400' : 'text-gray-400'} relative">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {#if $unreadCount > 0}
                  <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {$unreadCount}
                  </span>
                {/if}
              </div>
              <span class="font-medium">
                <HoverTextButton 
                  text="SUPPORT" 
                  href="/support" 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                />
              </span>
            </a>
          {:else if $isAuthenticated && isAdmin}
            <a href="/admin/chats" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 {activeRoute === '/admin/chats' ? 'bg-gradient-to-r from-amber-900/20 to-black border-l-2 border-amber-500 text-amber-400' : 'text-gray-200 hover:bg-gray-800/30'}">
              <div class="w-8 h-8 flex items-center justify-center mr-3 {activeRoute === '/admin/chats' ? 'text-amber-400' : 'text-gray-400'} relative">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {#if $unreadCount > 0}
                  <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {$unreadCount}
                  </span>
                {/if}
              </div>
              <span class="font-medium">
                <HoverTextButton 
                  text="SUPPORT CHATS" 
                  href="/admin/chats" 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                />
              </span>
            </a>
          {/if}
          
          <a href="https://www.youtube.com/@MickWhipple" target="_blank" rel="noopener noreferrer" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-gray-200 hover:bg-red-900/10 hover:text-red-400">
            <div class="w-8 h-8 flex items-center justify-center mr-3 text-red-400">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <span class="font-medium">
              <HoverTextButton 
                text="YOUTUBE" 
                href="https://www.youtube.com/@MickWhipple" 
                preserveStyle={true}
                highlightColor="#f9b639"
                external={true}
              />
            </span>
          </a>
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-800">
          {#if $isAuthenticated}
            <!-- User info in mobile menu -->
            <div class="flex items-center px-4 py-2 mb-4">
              <div class="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-lg font-bold shadow-inner mr-3">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div class="text-xs text-gray-400">Logged in as</div>
                <div class="text-amber-300 font-medium truncate max-w-[200px]">{user?.email || 'User'}</div>
              </div>
            </div>
            
            <!-- Profile link in mobile menu -->
            <a 
              href="/profile"
              class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-gray-200 hover:bg-gray-800/30 mb-2"
            >
              <div class="w-8 h-8 flex items-center justify-center mr-3 text-amber-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="font-medium">
                <HoverTextButton 
                  text="YOUR PROFILE" 
                  href="/profile" 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                />
              </span>
            </a>
            
            {#if isAdmin}
              <a 
                href="/admin" 
                class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-gray-200 hover:bg-gray-800/30 mb-2"
              >
                <div class="w-8 h-8 flex items-center justify-center mr-3 text-indigo-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span class="font-medium">
                  <HoverTextButton 
                    text="ADMIN PANEL" 
                    href="/admin" 
                    preserveStyle={true}
                    highlightColor="#f9b639"
                  />
                </span>
              </a>
            {/if}
            
            <button 
              on:click={handleLogout}
              class="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-gray-200 hover:bg-red-900/10 hover:text-red-400"
            >
              <div class="w-8 h-8 flex items-center justify-center mr-3 text-red-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span class="font-medium">
                <HoverTextButton 
                  text="SIGN OUT" 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                  isButton={true}
                />
              </span>
            </button>
          {:else}
            <div class="space-y-3 px-4">
              <a href="/login" class="block w-full py-3 text-center text-sm font-medium text-white/90 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                <HoverTextButton 
                  text="SIGN IN" 
                  href="/login" 
                  preserveStyle={true}
                  highlightColor="#f9b639"
                />
              </a>
              <a href="/register" class="block w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-700 rounded-xl shadow-lg shadow-amber-800/20 hover:shadow-amber-800/30 transition-all duration-300 border border-amber-500/50">
                <HoverTextButton 
                  text="REGISTER" 
                  href="/register" 
                  preserveStyle={true}
                  highlightColor="#ffffff"
                />
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</header>

<div class="h-16 lg:h-16"></div>

<style>
  :global(.alaska-bg) {
    @apply min-h-screen;
    background-image: linear-gradient(to bottom right, rgba(17, 24, 39, 0.75), rgba(30, 58, 138, 0.75)), url('/images/alaska-bg.jpg');
    background-size: cover;
    background-attachment: fixed;
  }

  @keyframes slideDown {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-slide-down {
    animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  /* Pattern grid styling */
  .pattern-grid {
    background-image: 
      linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  
  /* Glow effect for menu items */
  .glow-effect {
    background: radial-gradient(
      circle at center,
      rgba(251, 191, 36, 0.3) 0%,
      rgba(251, 191, 36, 0.1) 40%,
      rgba(251, 191, 36, 0) 70%
    );
    border-radius: 100%;
    width: 180%;
    height: 180%;
    left: -40%;
    top: -40%;
    pointer-events: none;
  }
  
  /* Add drop shadow to logo and buttons */
  header a, header button {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
  
  /* Smoother transitions */
  a, button, div {
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  /* Dropdown styles */
  .group:hover .group-hover\:translate-y-0 {
    transform: translateY(0);
  }
</style>