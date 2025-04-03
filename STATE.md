# Project State

## Current State
The project is a SvelteKit application for "Betting on Alaska Auctions" - a youtuber bidding platform. The application provides an interface for users to participate in auctions related to various categories including general auctions, knives, art, and miscellaneous items.

### Recent Changes
- Fixed the Z-depth demonstration page at `/x/6`:
  - Refactored to use the Enhanced3DCard component for better consistency and reliability
  - Fixed elements not showing properly due to z-index and positioning issues
  - Improved image handling with better error handling and fallback images
  - Adopted the component's getItemStyle function for positioning elements in 3D space
  - Maintained all interactive controls for Z-position adjustment and content configuration
  - Added proper event handling for hover state changes
  - Fixed visibility issues with text shadows and improved element positioning
  - Properly integrated with the site's component library for better maintainability
- Enhanced the Z-depth demonstration page at `/x/6`:
  - Converted hardcoded content to configurable props for better reusability
  - Added support for images with proper z-index handling
  - Implemented product data specific to the Alaska Knife Auction theme
  - Added theme switching between light and dark modes
  - Created a comprehensive content configuration panel
  - Added interactive controls for all content elements
  - Enhanced visual appearance with better styling and animations
  - Improved the button hover effect with transform and shadow changes
  - Made all elements dynamically update when props change
  - Added realistic product details with hand-crafted knife specifications
- Added comprehensive staggered animation showcases for Enhanced3DCard component:
  - Created `StaggeredEffectsShowcase.svelte` component demonstrating basic staggered floating elements
  - Implemented multiple animation patterns including cascade, wave, spiral, and random
  - Added `ContentStaggerShowcase.svelte` for practical product card applications with staggered content
  - Created `TextStaggerShowcase.svelte` for character-by-character text animation effects
  - Built a comprehensive showcase index page demonstrating all staggered animation techniques
  - Used getItemStyle function with configurable delays for consistent animation handling
  - Added customizable animation properties including staggerDelay, baseDelay, and pattern options
  - Implemented proper z-index handling and 3D transforms for realistic depth effects
  - Ensured all animations use proper CSS transitions with cubic-bezier timing functions
  - Fixed linter errors in TextStaggerShowcase by properly nesting @const tags in control blocks
- Fixed component import paths in showcase routes:
  - Fixed x/10 route by replacing the non-existent Three3DCard.svelte import with Enhanced3DCard.svelte
  - Standardized the import path in x/11 to use the Enhanced3DCard from test-components directory
  - Updated image references to use existing images instead of placeholder images
  - Adjusted component props to match available properties of the Enhanced3DCard component
- Removed unused Three.js dependencies and components:
  - Removed Three.js dependency from package.json
  - Removed Three.js background controller import from main layout
  - Simplified the background logic to use BeamsBackground consistently
  - Removed special case handling for Three.js showcase routes
- Standardized the site background to use BeamsBackground across all pages:
  - Modified the main layout to use BeamsBackground consistently throughout the site
  - Removed route-specific Three.js backgrounds to create a more unified visual experience
  - Maintained the Three.js showcase page's unique background handling for demonstration purposes
  - Simplified background logic in the main layout file
- Enhanced Three.js backgrounds showcase with improved effects:
  - Improved the wave background with more complex animations, realistic effects, and better gradient colors
  - Enhanced the landscape background with more detailed terrain, realistic mountain shapes, fog, and a starfield
  - Added a new smoke background effect with interactive particles that respond to mouse movement
  - Created a more advanced showcase control panel with additional parameters for each background
  - Added mobile-specific optimizations to automatically reduce complexity on smaller devices
  - Implemented detailed color control panels for all background types
  - Added a smoke texture image to enhance particle effects
  - Updated code snippets generator to display the current configuration for all background types
- Added Three.js backgrounds showcase and integration:
  - Created an interactive showcase page at `/x/threejs` to demonstrate and configure Three.js backgrounds
  - Added URL parameter support for sharing specific background configurations
  - Implemented live controls for customizing particle count, colors, speeds, and other parameters
  - Added code snippets generator that displays the configuration code for current settings
  - Created a cleaner URL redirect at `/x/three` that points to the showcase
  - Added detailed documentation on how to use the Three.js backgrounds in other components 
  - Implemented responsive design with mobile-specific optimizations
- Added multiple Three.js background effects that can be used throughout the site:
  - Created `ThreeJSBackground.svelte` component with animated particles that respond to mouse movement
  - Added `ThreeJSWaveBackground.svelte` component with smooth gradient wave animation using GLSL shaders
  - Implemented `ThreeJSLandscape.svelte` component featuring a low-poly terrain with 3D lighting effects
  - Created `ThreeJSBackgroundController.svelte` to manage different background types with a unified interface
  - Integrated Three.js backgrounds with route-specific settings in the main layout
  - Implemented performance optimizations for mobile devices (reduced particle count, segment count)
  - Added proper cleanup functions to prevent memory leaks with requestAnimationFrame
  - Used WebGL for GPU-accelerated animations that won't impact main thread performance
- Added a comprehensive Enhanced3DCard showcase at `/x/9`:
  - Created a sleek marketing-focused showcase with multiple card examples
  - Demonstrated different styles and color themes with the same component
  - Included detailed feature explanations and customization options
  - Added extensive documentation of component props and their default values
  - Showcased interactive animations based on hover state with sine/cosine wave functions
  - Added elegant call-to-action section for potential component buyers
- Added a new, improved 3D Card showcase with robust Z-transforms:
  - Created a dedicated Z-depth demonstration page at `/x/6` with proper 3D transforms
  - Added interactive controls to adjust Z-position of each element in real-time
  - Implemented visual feedback tools including debug grid and Z-position indicators
  - Fixed issues with previous implementations to ensure proper 3D depth perception
  - Enhanced user experience with smooth transitions and clear visual hierarchy
  - Added ability to toggle visibility of individual elements to focus on specific aspects
  - Created an educational tool for understanding how Z-transforms work in CSS
- Fixed routing issues in AuctionCard component:
  - Modified AuctionCard.svelte to dynamically determine category URL paths instead of hardcoding to knife/[id]
  - Added category information to the items in all three category pages (knives, paint, misc)
  - Updated click handlers to use the appropriate category paths based on item category
  - Ensured consistent routing behavior across all category pages
  - Added a getCategoryPath helper function to determine the correct route based on category code
- Fixed issues with the "paint" category pages:
  - Added proper image processing in the paint/[id]/+page.js file to ensure images are displayed correctly
  - Updated PastAuctionCard component to use the item's category when creating view detail links
  - Modified how past auction items are passed to the PastAuctionCard component in paint/+page.svelte to include category information
- Increased button hover sound effect volume from 30% to 80% for better audibility
- Fixed Content Security Policy (CSP) configuration by removing invalid 'api.*' pattern from connect-src and default-src directives
- Removed unused dark/light theme system to streamline the codebase
- Redesigned the sound toggle button with an animated sine wave visualization
- Replaced circular wave animation with a horizontal sine wave for better visual feedback
- Enhanced sound toggle with canvas-based wave animation for smoother rendering
- Added multiple sine waves with different frequencies for a more organic appearance
- Implemented a red X indicator when sound is disabled for clearer feedback
- Added global sound toggle feature with a fancy animated button in the navbar
- Created a centralized audio state store to manage sound settings across the application
- Implemented localStorage persistence for audio preferences to remember user settings
- Removed dedicated audio demo page in favor of the global sound toggle in the navbar
- Updated HoverTextButton component to use the global audio state instead of local prop
- Maintained backward compatibility with existing audioEnabled prop for flexibility
- Added subtle animations to the sound toggle with spring-based transitions
- Improved accessibility by making sound controls easily available from any page
- Standardized navbar text styling to match the Default Style example in the HoverTextButton demo
- Updated all navbar HoverTextButton components with consistent fontSize, fontWeight, and letterSpacing
- Applied consistent 12px font size with 600 weight and 1px letter spacing across all navigation elements
- Enhanced visual consistency between demo components and actual implementation
- Improved audio support with multiple file formats (mp3, wav, opus) for cross-browser compatibility
- Fixed audio playback issues by providing alternative audio formats
- Optimized audio file sizes with appropriate encoding
- Cleaned up unused development server processes to improve system performance
- Added audio feedback to the HoverTextButton component with enter and exit sounds
- Implemented responsive audio controls with volume adjustment and error handling
- Added audioEnabled prop to allow disabling sound for accessibility purposes
- Used browser environment check to ensure audio only loads on the client side
- Ensured audio doesn't play when buttons are disabled
- Further reduced SVG usage by replacing subtle-pattern.svg with inline CSS gradient pattern
- Removed mountain-backdrop.svg which wasn't referenced in the codebase
- Improved loading performance by eliminating the need for external pattern SVG files
- Used CSS radial-gradient for subtle background patterns instead of SVG images
- Reduced network requests by using CSS-based patterns instead of image files
- Improved site performance by removing unused SVG pattern files (japanese-pattern.svg, wood-texture.svg, tactical-pattern.svg)
- Optimized the Vite configuration with better build settings, chunking, and dependency optimization
- Added resource preloading in the main layout for critical assets
- Enhanced the ResponsiveImage component with progressive loading, priority attributes, and blur placeholders
- Added GPU acceleration for animations with CSS optimizations
- Improved text rendering performance with optimized CSS settings
- Enhanced build process to minify and compress assets more efficiently
- Added manual chunking for better code splitting and faster initial load
- Implemented preconnect for API endpoints to reduce connection setup time
- Added browser rendering optimization with better CSS settings for animations
- Removed unused SVGs to reduce the bundle size and network requests
- Added proper loading attributes and fetch priorities for images
- Enhanced image loading with proper size attributes and responsive sizing
- Added the Utsubo-style contact button effect to the showcase2 page, featuring staggered letter animations on hover
- Implemented the vertical text replacement animation with smooth cubic-bezier easing for realistic motion
- Created a subtle glow effect on the contact button hover state with radial gradient background
- Added a new showcase2 page featuring an interactive "HOLD TO INTERACT" button effect inspired by the Utsubo website
- Implemented SVG progress circles for visual feedback during button interaction
- Created advanced animations for the button including expanding/closing transitions and particle effects
- Added interactive text elements with staggered animations during the interaction phase
- Used advanced CSS transitions with cubic-bezier timing functions for realistic motion
- Implemented a standalone layout for the showcase2 page to avoid interfering with global styles
- Optimized the interactive experience with proper event handling for both mouse and touch interactions
- Fixed server-side rendering issue with the Navbar component by adding browser environment checks
- Added conditional rendering in the layout file to prevent "window is not defined" errors
- Modified all browser-specific code in the Navbar to check for browser environment before execution
- Added a static navbar placeholder during server-side rendering for improved loading experience
- Enhanced admin dashboard table layout to prevent button cropping and improve readability
- Removed whitespace-nowrap constraints on table cells to allow proper text wrapping
- Added min-width to the action columns to ensure edit/delete buttons display properly
- Improved admin item edit page with a modern, responsive design 
- Added a "Back to Admin" button in the edit item header for easier navigation
- Enhanced form controls with better focus states and consistent styling
- Improved image management UI with better grid layout and larger delete buttons
- Added subtle animations and transitions to admin interfaces for better user experience
- Used consistent amber accent colors across admin interfaces to match the site's theme
- Added proper loading state visualization with spinner animation
- Improved error message display with proper formatting and visual cues
- Redesigned the navigation bar with a modern glass-morphic design that integrates seamlessly with the site aesthetic
- Added dynamic backdrop blur effects that change on scroll for improved visual hierarchy
- Implemented subtle animation effects including hover states with animated glows
- Created a unified color scheme with amber/gold accents and dark backgrounds
- Enhanced the mobile menu with improved icons, animations, and visual organization
- Added subtle grid patterns and glow effects to improve depth perception
- Redesigned the user profile dropdown with clearer visual hierarchy and more intuitive layout
- Improved accessibility with better contrast and focus states
- Fixed cropping issues in PastAuctionCard component by reorganizing the badge layout and content placement
- Added proper PAST AUCTION and SOLD badges on the same level to prevent overlap
- Reduced title font size and added text truncation to prevent text overflow
- Improved spacing in the grid of past auctions with larger gaps and proper padding
- Fixed Z-index issues to ensure 3D elements don't get clipped by containing elements
- Adjusted PastAuctionCard height to 450px (from 480px) to better fit content
- Limited spec list display to only one item in non-hover state to reduce visual clutter
- Added truncation to spec text to prevent overflow on smaller screens
- Enhanced badge positioning with proper spacing and better visual hierarchy
- Enhanced PastAuctionCard component with improved styling from PastAuctionsCard2.svelte example
- Added teal color accents and subtle black backgrounds to the Past Auctions section
- Implemented enhanced staggered animations with multi-stage transitions for Past Auction cards
- Added backdrop-blur effects to past auction specs list with teal checkmark icons
- Improved visibility of final price display with backdrop-blur container
- Added "Auction Ended" notice with subtle red text for better visual feedback
- Standardized PastAuctionCard dimensions to 450px height to fit content properly
- Improved the hover scale effect from 1.1 to the more subtle 1.08 for past auctions
- Added elegant blur effect to staggered card animations for smoother appearance
- Enhanced the Past Auctions section with a dedicated container with teal accent glows
- Added smooth 3-stage animations to Past Auction cards with delayed entrances based on card position
- Implemented proper cleanup in animation code with onDestroy hooks
- Enhanced AuctionCard and PastAuctionCard components with advanced 3D effects from the showcase implementation
- Added time-based animations with sine and cosine wave functions to create more dynamic card interactions
- Improved floating particle animations with larger, more visible particles
- Added subtle breathing animations to various card elements for a more polished look
- Enhanced badges with dynamic rotation and scaling effects based on hover state
- Improved card design with better gradient overlays and subtle glow effects
- Standardized hover scale to 1.1 for consistency across all auction cards
- Optimized code for better performance in both components
- Fixed empty image URL handling in ResponsiveImage component to prevent errors
- Simplified image checks in AuctionCard and PastAuctionCard components for better reliability
- Fixed image loading issues from S3 in AuctionCard.svelte and PastAuctionCard.svelte components
- Enhanced ResponsiveImage component to better handle different image URL formats from the API
- Updated image processing in knife/[id] page to ensure proper display of S3-hosted images
- Improved error handling in image loading across the application
- Added URL field alternative to image objects to handle different API response formats
- Standardized image dimensions and fallbacks across components
- Converted knife/[id] route from a simple redirect to a fully functional page with its own implementation
- Updated links on the knives/+page.svelte to point to the new knife/[id] route instead of knives/[id]
- Implemented Enhanced3DCard component in the knife/[id] page with animations and hover effects
- Added detailed display of item information, bid history, and auction status on the knife/[id] page
- Added support for multiple image navigation with thumbnail gallery on the knife/[id] page
- Enhanced the Enhanced3DCard component with badge and countdown props to support slot usage
- Fixed linter errors related to slots in Enhanced3DCard component
- Fixed HTTP 500 error on knife detail pages by converting to client-side only rendering using the 'csr = true' export
- Updated API calls in the knife detail page to use direct fetch with proper error handling instead of fetchApi utility
- Added browser environment checks to prevent server-side rendering issues with DOM-dependent code
- Fixed the implementation of the knives/[id] page by standardizing the API call approach with other working pages (paint/[id] and misc/[id])
- Maintained the enhanced 3D card UI and animations while fixing the core functionality
- Improved error handling and cleanup in the onDestroy lifecycle function
- Added a new water effect showcase page inspired by the Utsubo contact page design
- Created a fallback mechanism for when video files are not available, using canvas animations
- Added advanced wave animations using multiple overlapping sine waves for a more realistic effect
- Implemented a clean, modern interface with centered contact information
- Enhanced the canvas animation with dynamic wave patterns and simulated ocean movement
- Updated the contact button animation to match the Utsubo site exactly
  - Implemented 3D transforms with `translate3d` and skew effects
  - Added proper z-index handling and highlight colors
  - Updated the animation timing with precise cubic-bezier curves
  - Fixed staggered letter animation timing using specific transition delays
- Updated the contact button with exact CSS properties from the Utsubo site:
  - Set precise height (50px) and padding (8px) to match the original
  - Added proper CSS classes (flx-center for the button, flx for the container)
  - Added user-select and webkit-user-drag properties for proper interaction
  - Implemented the exact transition timing for all animations
  - Added proper text selection styling with highlight color 
  - Included the correct font stack from the original site
- Simplified the showcase2 page to only display the Utsubo-style contact button
  - Removed all other content and UI elements
  - Created a minimal, clean interface focused solely on the button effect
  - Maintained all the interactive hover animations and styling of the contact button
  - Simplified the page structure for better focus on the specific animation
- Refined the Utsubo-style contact button to match the original site exactly:
  - Fixed button dimensions and padding (smaller font size and proper spacing)
  - Added proper letter spacing and margins between letter elements
  - Adjusted the CSS transforms with precise values for the skewed animation
  - Improved HTML structure to eliminate any styling conflicts
  - Separated styling for contact button from HOLD TO INTERACT button to prevent conflicts
- Added a new showcase4 page featuring the exact Utsubo-style contact button animation
  - Implemented the precise CSS from the Utsubo website for the contact button hover effect
  - Created pixel-perfect staggered letter animations with correct transition timing
  - Added proper transform3d and skew effects to match the original site
  - Used the exact color scheme with yellow highlight text (#f9b639)
  - Implemented correct z-index handling and positioning for the animated letters
  - Added proper letter spacing and margins between letter elements
  - Ensured all CSS variables match the original site (--defaultColor, --hlColor, --mainEasing)
- Added 'preserveStyle' option to HoverTextButton component
  - Allows the text hover animation to be applied to existing buttons without changing their styles
  - Can be integrated with navigation, CTAs, and other UI elements while maintaining their original appearance
  - Enables consistent text hover effects across the site without requiring redesign of existing buttons
  - Preserves existing background, border, padding, and other styles of the original button
  - Only applies the letter-by-letter animation effect on hover
- Enhanced the HoverTextButton component with additional functionality:
  - Reduced letter spacing for a more compact, polished look
  - Added support for both button and anchor elements with automatic selection based on href value
  - Implemented disabled state styling with proper accessibility attributes
  - Added event forwarding for all standard events (click, focus, blur, keydown, keyup)
  - Added support for button type attribute when used as a button element
  - Updated showcase page to demonstrate all component features with interactive examples
  - Fixed z-index and opacity issues to ensure proper text visibility during animations
- Added navbar integration example for the HoverTextButton component
  - Demonstrated how to integrate the text hover effect with existing navbar elements
  - Created example navigation with icons and active states that maintains design
  - Showed proper component nesting within existing link elements
  - Preserved all existing styling while adding only the letter animation effect
  - Provided complete example code for easy adaptation to the actual navbar
- Implemented HoverTextButton into the actual Navbar component
  - Replaced all navigation text items with the HoverTextButton component
  - Used preserveStyle={true} to maintain existing styling while adding hover animations
  - Applied consistent text styling with uppercase labels for better visual hierarchy
  - Added the hover effect to both desktop and mobile menu items for consistency
  - Integrated with existing icon layouts and active state indicators
  - Preserved special styling for YouTube link and authentication buttons
  - Ensured accessibility with proper focus states and event forwarding
  - Maintained amber highlight color (#f9b639) to match the site's theme
- Simplified the sound toggle button by removing the red X indicator when sound is disabled
- Improved visual minimalism with a clean horizontal line indicating when sound is off
- Made the sound toggle design more subtle and less distracting when sound is disabled
- Created paint category page following the same structure as the knives page, for viewing and bidding on painting auctions
- Created misc category page for miscellaneous items using the same structure as the knives and paint pages
- Implemented individual item detail pages for paint/[id] and misc/[id] using Enhanced3DCard component
- Enhanced all category detail pages (knife/[id], paint/[id], misc/[id]) with consistent animations and 3D effects
- Added gallery view for multiple images in item detail pages with interactive image navigation
- Implemented bid history visualization with color coding for each unique user
- Added detailed information sections for each item category with specific fields relevant to each type
- Ensured consistent design language across all category pages with distinct color themes for each type
  - Knives: Amber/yellow accent colors
  - Paint: Indigo/violet accent colors
  - Misc: Teal/emerald accent colors
- Used client-side rendering (CSR) for all item detail pages to ensure proper API interaction and animations
- Implemented robust error handling and loading states for all category and detail pages
- Replaced the "A" text logo in the navbar with a custom wolf logo:
  - Updated the Navbar component to use an image instead of the text letter
  - Created a dedicated UI images directory for interface assets
  - Added a Wolf logo implementation with proper sizing and styling
  - Maintained the existing hover effects and animations
  - Provided multiple methods for adding the processed logo (manual, shell script, Node.js)
  - Added comprehensive documentation for logo implementation

## Project Structure
The project follows a typical SvelteKit structure:
- `src/routes/` - Contains the pages and layouts of the application
  - `+layout.svelte` - Main application layout with global components (modified to fix scrolling issues)
  - `profile/+page.svelte` - User profile page with GlowingEffect implementation
  - `showcase/+page.svelte` - A showcase page demonstrating a water background effect similar to Utsubo's contact page
  - `showcase/+layout.svelte` - A minimal layout for the showcase that prevents inheriting styles from the parent layout
  - `showcase2/+page.svelte` - A page featuring an interactive "HOLD TO INTERACT" button effect inspired by Utsubo's website
  - `showcase2/+layout.svelte` - A clean layout for the showcase2 page that isolates its styles from the rest of the application
  - `showcase4/+page.svelte` - A page featuring the exact implementation of Utsubo's contact button with letter hover animations
  - `x/9/+page.svelte` - Marketing showcase for the Enhanced3DCard component with multiple examples and documentation
  - `x/threejs/+page.svelte` - Interactive showcase for Three.js background effects with live configuration controls
  - Various route folders containing page components and logic
  - `enhanced-3d-showcase5/` - Demo page for the 3D card component
  - `knives/+page.svelte` - Knives page using the AuctionCard component for current auctions and PastAuctionCard for past auctions with teal accents and enhanced staggered animations
  - `knives/[id]/+page.svelte` - Individual knife auction detail page with Enhanced3D card integration for immersive viewing experience
  - `knife/[id]/+page.svelte` - Fully functional knife detail page with Enhanced3D card integration for immersive viewing experience
  - `knife/[id]/+page.js` - Data loading functionality for the knife detail page
  - `paint/+page.svelte` - Paint/artwork category page with indigo/violet accents and the same structure as the knives page
  - `paint/[id]/+page.svelte` - Paint item detail page with Enhanced3D card and art-specific details
  - `paint/[id]/+page.js` - Data loading functionality for the paint detail page
  - `misc/+page.svelte` - Miscellaneous items category page with teal/emerald accents
  - `misc/[id]/+page.svelte` - Misc item detail page with Enhanced3D card and item-specific details
  - `misc/[id]/+page.js` - Data loading functionality for the misc detail page
- `src/lib/` - Contains reusable components, utilities, and stores
  - `components/` - Reusable UI components
    - `ui/` - Generic UI components 
      - `Background/BeamsBackground(Animated).svelte` - Animated background with light beams (updated to support scrolling)
      - `Glowing-Effect/GlowingEffect.svelte` - Interactive glowing border effect
      - `Focus/FocusCard.svelte` and `Focus/Card.svelte` - Interactive cards with focus effects
      - `3d-card/hybridcards/Enhanced3DCard.svelte` - Advanced 3D card transformation component
      - `3JS/` - Three.js background components
        - `ThreeJSBackgroundController.svelte` - Main controller component for managing different Three.js backgrounds
        - `ThreeJSParticleBackground.svelte` - Interactive particle effect with customizable settings
        - `ThreeJSWaveBackground.svelte` - Animated wave effect with gradient colors and interactive water movement
        - `ThreeJSLandscape.svelte` - Low-poly terrain with detailed mountain generation, fog, and starfield
        - `ThreeJSSmokeBackground.svelte` - Smoke/fog particle effect with turbulence and interactive mouse influence
      - `AuctionCard.svelte` - Reusable auction card component with 3D effects and auction-specific UI
      - `PastAuctionCard.svelte` - Specialized card component with dual badges, text truncation, and optimized layout to prevent content cropping
      - `HoverTextButton.svelte` - Reusable button component that implements the Utsubo-style letter hover animation effect with customizable properties
    - `Navbar.svelte` - Redesigned navigation component with glass-morphic design, animated effects, and improved mobile experience
    - `ResponsiveImage.svelte` - Component for responsive image handling with webp support and fallback options
  - `utils/` - Utility functions and helpers
    - `utils.js` - Common utility functions including the `cn` function for class composition
    - `profanity-filter.js` - Utility for filtering profanity from user inputs
  - `stores/` - Svelte stores for state management
    - `auth.js` - Store for handling authentication state
- `static/` - Contains static assets like images
  - `images/` - Image assets for the application
    - Former background images and pattern SVGs
    - Profile card images for the FocusCard component
  - `textures/` - Texture assets for Three.js components
    - `smoke.png` - Particle texture used in the smoke background effect

## Features
- Authentication system with user login/registration
- Nickname checking functionality with profanity filter
- User profile management with email notification preferences
- Modern glass-morphic navigation with smooth animations and responsive design
- Support chat system
- YouTube integration
- Enhanced UI components with animated effects
- Interactive 3D auction cards with dynamic animations and badges
- Stylized contact button with staggered letter animations and hover effects
- Interactive "HOLD TO INTERACT" button with progress indication and expanding animations
- Bid placement and watchlist functionality
- Properly scrollable pages with fixed animated background
- Enhanced 3D detail pages for individual auction items with animated effects
- Multiple routes to access knife details with consistent UI across routes
- Staggered animation effects for past auction cards with multi-stage transitions
- Distinct visual styling between current and past auctions with consistent 3D effects
- Responsive layout with proper content sizing and truncation to prevent overflow
- Advanced water background effect with canvas animations and video fallback mechanism
- Interactive "HOLD TO INTERACT" button effect (hold-to-fill animation with emoji cloud)
- Utsubo-style contact button with animated letter hover effect
  - Each letter has a horizontal sliding animation with skew effect
  - Letters are replaced with a yellow highlight version on hover
  - Animation has staggered timing for a wave-like effect

## Core Components
- `BeamsBackground(Animated).svelte` - An animated background component that creates a dynamic light beam effect using canvas, now with proper scrolling support
- `Navbar.svelte` - Redesigned navigation component with glass-morphic effects, scroll animations, and improved mobile experience
- `NicknameCheckWrapper.svelte` - A wrapper component that checks for user nicknames
- `Enhanced3DCard.svelte` - A component for creating interactive 3D card effects with layering capabilities
- `ThreeJSBackgroundController.svelte` - A controller component for managing different Three.js background effects
  - `ThreeJSParticleBackground.svelte` - Interactive 3D particle effect with customizable colors and movement
  - `ThreeJSWaveBackground.svelte` - Animated wave simulation with gradient colors and interactive water movement
  - `ThreeJSLandscape.svelte` - Low-poly terrain generator with mountains, fog effects, and animated starfield
  - `ThreeJSSmokeBackground.svelte` - Volumetric smoke/fog effect with turbulence patterns and mouse interactivity
- `Contact Button Effect` - A component that demonstrates the Utsubo-style contact button with letter animations on hover
- `Interactive Button Effect` - A showcase component featuring a "HOLD TO INTERACT" button with progress indication, expanding animations, and particle effects
- `AuctionCard.svelte` - A reusable auction-specific card component with advanced 3D effects, time-based animations, and realistic depth perception using sine/cosine wave functions and floating particles
- `PastAuctionCard.svelte` - A specialized card component with dual badges (PAST AUCTION and SOLD), responsive layout with text truncation, and optimized spacing to prevent content cropping
- `ResponsiveImage.svelte` - A component that handles responsive images with format support and fallbacks
- `GlowingEffect.svelte` - A component that adds an interactive glowing border to elements
- `FocusCard.svelte` - A component that creates a gallery of cards where the focused card stands out while others blur
- `Showcase Water Effect`

# 3D Card Component Project State

## Project Overview
This project implements advanced 3D card components with staggered animation effects, designed to create premium interactive UI experiences.

## Component Structure

### Base Components
- `Enhanced3DCard.svelte` - The core 3D card component with extensive customization options
  - Location: `src/lib/components/test-components/Enhanced3DCard.svelte`
  - Features: Customizable z-depths, hover amplification, perspective, rotation, etc.

### Specialized Components
- `StaggeredCard.svelte` - Basic implementation with true staggered animation effects
  - Location: `src/lib/components/test-components/StaggeredCard.svelte`
  - Features: Different stagger directions, z-behaviors, custom delay timing

- `StaggeredProductCard.svelte` - Advanced product card with staggered animations
  - Location: `src/lib/components/test-components/StaggeredProductCard.svelte`
  - Features: Product display with interactive elements, color selectors, detailed product info

## Showcase Routes
- `/x/9` - Marketing showcase for the Enhanced3DCard component
  - Location: `src/routes/x/9/+page.svelte`
  - Features: Multiple themed examples, component documentation, customization options overview

- `/x/7` - Showcase for the basic StaggeredCard with adjustable parameters
  - Location: `src/routes/x/7/+page.svelte`
  - Features: Interactive controls for stagger timing, direction, z-behavior

- `/x/8` - Advanced product card showcase with multiple product examples
  - Location: `src/routes/x/8/+page.svelte`
  - Features: Product selector, animation controls, detailed technical explanation

## Key Innovations

1. **True Staggered Animations**
   - Elements animate with precisely timed, sequential delays
   - Animation direction is configurable (forward, reverse, from-center)

2. **Z-Behavior Modes**
   - `flat` - Elements have no Z depth until hover (Aceternity UI style)
   - `hybrid` - Background elements have depth, foreground elements flat until hover
   - `subtle` - All elements have some depth, enhanced on hover

3. **Coordinated Animation System**
   - X, Y, and Z transformations synchronized with the same staggered timing
   - Opacity and scaling integrated into the animation system

4. **Interactive Elements**
   - Functional controls within the 3D space
   - Working with proper pointer events despite the 3D transformations

## Future Development

1. **Additional Card Variants**
   - Gallery card with multiple images and navigation
   - Comparison card for showing before/after or product alternatives
   - Timeline/process card with step-by-step animations

2. **Optimization Opportunities**
   - Mobile-specific versions with reduced effects for better performance
   - Lazy animation initialization for pages with many cards

3. **Accessibility Improvements**
   - Keyboard navigation support
   - Reduced motion options for users with motion sensitivity

4. **Documentation**
   - Create comprehensive API documentation
   - Add examples for common use cases

### Recent Updates

- Added a showcase page for the Enhanced3DCard component at route `/x/11`
- Demonstrated staggered animation effects using the component's capabilities

### Project Structure

The project follows a standard SvelteKit structure with the following notable directories:

- `/src/routes`: Contains all the application routes
- `/src/lib`: Contains reusable components and utility functions
- `/src/lib/components/ui`: UI components, including the 3D card components

### Components

#### Enhanced3DCard Component

Located at `/src/lib/components/ui/3d-card/hybridcards/Enhanced3DCard.svelte`, this component provides:

- 3D hover effects with customizable parameters
- Staggered animation capabilities through:
  - The `getItemStyle` function that allows setting different z-index values and delays
  - Access to the `isHovering` state for conditional animations
  - Custom easing and duration parameters
  - Z-depth transformations constrained between `minZ` and `maxZ` props

### Showcase Pages

- `/x/11`: Demonstrates the staggered animation capabilities of the Enhanced3DCard component with three example cards:
  1. Basic Staggered Card - Shows elements appearing with different delays and z-depths
  2. Floating Elements Card - Shows floating elements with different z-depths and staggered timing
  3. Layered Content Card - Shows layered content with geometric shapes that rotate and scale

# Youtuber Bidding Frontend - Project State

## Project Structure
The Youtuber Bidding frontend is a SvelteKit application that provides the user interface for an auction platform specifically designed for YouTuber merchandise and memorabilia.

### Main Components:
- **src/routes**: Application routes and pages
- **src/lib**: Reusable components, utilities, and stores
- **static**: Static assets like images and fonts

## Recent Changes

### 2025-04-03: Fixed API Routing Architecture
- Identified and resolved major API routing issue between development and production environments
- Updated API client to handle path-based routing consistently
- Resolved conflicts between frontend routes and backend API endpoints
- Simplified environment configuration

## API Integration Changes

### Route Conflict Resolution
- Identified conflict between SvelteKit routes (`src/routes/api/*`) and backend API endpoints
- Renamed frontend routes to prevent request interception
- Ensured all API requests properly reach the backend service

### API Client Improvements
- Updated API client code to handle relative URLs properly
- Simplified URL construction logic
- Fixed CSRF token fetching mechanism
- Improved error handling and reporting

## Architecture Explanation: API Routing Problem

### Original Problem
The project experienced a significant architectural inconsistency between development and production environments:

1. **Development Environment:**
   - Frontend and backend both running on the same domain
   - API accessed through path-based routing (`/api/*` endpoints)
   - SvelteKit dev server proxied requests to the Django backend

2. **Production Environment:**
   - Initially configured with subdomain-based API routing (`api.konosmgr.com`)
   - Frontend code still constructed URLs assuming path-based routing
   - Created URL mismatches like `api.konosmgr.com/api/*` (double `/api` prefix)
   - Frontend requests failed with 404 errors

### Complicating Factors
1. **Frontend Route Conflicts:**
   - SvelteKit frontend had its own `/api` routes under `src/routes/api/*`
   - These frontend routes intercepted some API requests before they reached the backend
   - Created confusion between frontend and backend API endpoints

2. **Cross-Domain Issues:**
   - Subdomain architecture required complex CORS configuration
   - Cookie handling across domains complicated authentication
   - CSRF protection more difficult to implement correctly

### Implemented Solution
1. **Unified Domain Architecture:**
   - Configured Traefik to route `/api/*` paths on main domain to backend service
   - Maintained backwards compatibility with existing subdomain
   - Simplified frontend environment variables to use relative paths

2. **Frontend Adjustments:**
   - Updated API client code to handle relative URLs properly
   - Ensured consistent path construction throughout the application
   - Renamed conflicting frontend routes to avoid interception

3. **Infrastructure Updates:**
   - Added new routing rules in Traefik configuration
   - Maintained subdomain for gradual migration

### Benefits of the Solution
1. **Consistency:** Development and production now use the same API URL structure
2. **Simplicity:** Removed cross-domain complexities
3. **Reliability:** Eliminated URL construction issues
4. **Maintainability:** Simplified architecture is easier to debug and extend

This architectural change aligns with modern web application best practices, where APIs are typically served from the same domain as the frontend using path-based routing.

## Recent Fixes - API Routing and Google Authentication

### Issues Fixed
1. **API URL Configuration Conflicts:**
   - Removed hardcoded references to `api.konosmgr.com` in the Dockerfile.prod
   - Updated Content Security Policy in app.html to remove explicit API subdomain references
   - Ensured environment variables are correctly set for path-based API access

2. **Google Sign-In Button Issues:**
   - Fixed invalid width parameter (changed from '100%' to numeric value 300)
   - Adjusted button container styling for better display
   - Will need to update Google Cloud Console settings to add `konosmgr.com` as an allowed origin

3. **Traefik Configuration Improvements:**
   - Maintained backward compatibility with the API subdomain
   - Properly defined and named services to avoid ambiguous routing
   - Updated CORS settings to allow credentials and proper headers

### Benefits of the Fixes
1. **Compatibility:** Works consistently across environments
2. **Security:** Proper CORS and CSP settings for modern security standards
3. **User Experience:** Fixed Google Sign-In for seamless authentication
4. **Maintainability:** Cleaner configuration with explicit naming

These changes resolve the key issues that were causing 403 Forbidden errors when accessing the API and the Google Sign-In button display problems.
