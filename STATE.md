# Project State

## Current State
The project is a SvelteKit application for "Betting on Alaska Auctions" - a youtuber bidding platform. The application provides an interface for users to participate in auctions related to various categories including general auctions, knives, art, and miscellaneous items.

## Project Structure
The project follows a typical SvelteKit structure:
- `src/routes/` - Contains the pages and layouts of the application
  - `+layout.svelte` - Main application layout with global components (modified to fix scrolling issues)
  - `profile/+page.svelte` - User profile page with GlowingEffect implementation
  - Various route folders containing page components and logic
  - `enhanced-3d-showcase5/` - Demo page for the 3D card component
  - `knives/+page.svelte` - Knives page using the AuctionCard component for current auctions and PastAuctionCard for past auctions
  - `knives/[id]/+page.svelte` - Individual knife auction detail page with Enhanced3D card integration for immersive viewing experience
  - `knife/[id]/+page.svelte` - Redirect page from old route to new route
- `src/lib/` - Contains reusable components, utilities, and stores
  - `components/` - Reusable UI components
    - `ui/` - Generic UI components 
      - `Background/BeamsBackground(Animated).svelte` - Animated background with light beams (updated to support scrolling)
      - `Glowing-Effect/GlowingEffect.svelte` - Interactive glowing border effect
      - `Focus/FocusCard.svelte` and `Focus/Card.svelte` - Interactive cards with focus effects
      - `3d-card/hybridcards/Enhanced3DCard.svelte` - Advanced 3D card transformation component
      - `AuctionCard.svelte` - Reusable auction card component with 3D effects and auction-specific UI
      - `PastAuctionCard.svelte` - Specialized card component for past auctions with grayscale effect and "SOLD" badge
    - `Navbar.svelte` - Main navigation component
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

## Features
- Authentication system with user login/registration
- Nickname checking functionality with profanity filter
- User profile management with email notification preferences
- Navigation with sections for Auctions, Knives, Art, and Misc
- Support chat system
- YouTube integration
- Enhanced UI components with animated effects
- Interactive 3D auction cards with dynamic animations and badges
- Bid placement and watchlist functionality
- Properly scrollable pages with fixed animated background
- Enhanced 3D detail pages for individual auction items with animated effects

## Recent Changes
- Added image popup carousel for detailed viewing of auction item images
- Implemented fullscreen image gallery with keyboard navigation (arrow keys and ESC)
- Added thumbnail navigation and image counter in the popup carousel
- Optimized the card dimensions (wider and shorter) for better display of knife images
- Improved user experience by making auction images clickable to view in detail
- Added proper focus styles for the popup image gallery with a blurred background
- Implemented proper mobile-friendly controls for the image popup
- Fixed image cropping issues in the knife detail page by changing from object-fit: cover to object-fit: contain
- Adjusted the 3D card layout to properly display the full knife image without cropping
- Improved thumbnails to maintain proper aspect ratio with object-fit: contain
- Enhanced the button's reliability by increasing z-index to 100 to ensure it's completely clickable
- Optimized layout spacing with proper padding to prevent content overlap
- Fixed layout issues in 3D card detail page by adjusting container dimensions and z-index stacking
- Fixed clickability issues with the "Place Bid" button by increasing its z-index and fixing pointer events
- Improved content spacing and positioning on the knife detail page for better readability
- Optimized layout for mobile and desktop views with responsive sizing
- Fixed image containment issues in 3D detail cards by applying proper CSS constraints and container nesting
- Ensured image and thumbnails are properly sized and don't overflow their containers in the Enhanced3DCard
- Fixed image loading issues in the knife detail page by properly integrating ResponsiveImage component with the Enhanced3DCard
- Ensured responsive image handling with webp support on the 3D card interface
- Fixed thumbnail image loading in the redesigned item detail page
- Redesigned the item detail page (`knives/[id]/+page.svelte`) with the Enhanced3DCard component for a more visually appealing, interactive viewing experience
- Added dynamic 3D animations and parallax effects to item detail pages with time-based animations
- Improved visual presentation of auction information with a dark theme using gradient backgrounds
- Enhanced bid history display with custom scrollbars and improved color coding
- Integrated floating particles and dynamic hover effects to improve user engagement
- Restructured auction details layout with a side panel for countdown timer, pricing, and bid history
- Added depth effects to titles and content on item detail pages
- Implemented a more sophisticated design for auction timers and bid information
- Improved visual hierarchy of information on item detail pages
- Added animated thumbnails and image navigation controls
- Maintained all existing functionality (bidding, countdown, history) while enhancing visual appeal
- Implemented image proxy server to solve CORS issues and ensure consistent image loading
- Cleaned up console.log statements from production code while maintaining error logging
- Fixed past auction cards showing "$NaN" prices by adding proper validation for price values
- Fixed missing animations on past auction cards by adding proper CSS keyframes and transform styles
- Added proper validation and type checking for past auction items to ensure consistent display
- Fixed current auctions displaying "$NaN" by properly mapping API data to the AuctionCard component's expected format
- Added missing updateTimeRemaining function to ensure timers work correctly
- Fixed image handling in PastAuctionCard by replacing dynamic style attributes with proper classes
- Improved grayscale and brightness effects for past auction cards with dedicated utility classes
- Fixed fetchApi integration for loading past auction items with proper error handling
- Created a dedicated PastAuctionCard component for past auctions with proper image handling and "SOLD" badge
- Fixed past auction image loading issues by integrating ResponsiveImage component
- Enhanced image error handling with fallbacks to ensure graceful degradation
- Improved past auction display with consistent layout and styling matching the current auctions
- Refactored knives page to use the cleaner implementation with separate components
- Improved animations with staggered delays for smoother card reveal effects
- Standardized routes by moving knife detail pages from `/knife/[id]` to `/knives/[id]` for consistency with the list page
- Added a redirect from old `/knife/[id]` routes to the new `/knives/[id]` path to maintain compatibility with existing links
- Made auction card images clickable to navigate directly to the specific auction page
- Removed redundant "current bid" text from the price display
- Fixed bid count display to show accurate bid information from API instead of random numbers
- Improved image URL handling to fix loading issues with different URL formats
- Added better image error handling with fallback to placeholder images
- Removed sample/demo featured auctions in favor of displaying only real auctions from the API
- Fixed creator attribution to only display when a creator exists
- Improved image URL handling to ensure images are properly displayed
- Added better URL resolution for relative image paths
- Added proper handling for empty auction states
- Replaced older card implementations with the new AuctionCard component for all auctions
- Added dynamic color assignment and labeling for visual variety in auction cards
- Improved data mapping from API items to AuctionCard format
- Enhanced navigation by linking bid actions to auction detail pages
- Fixed 3D card display issues by removing constraining containers and adding proper spacing
- Added CSS to ensure 3D cards have enough space for hover effects without being clipped
- Improved the layout of the featured auctions section with better spacing and overflow handling
- Fixed global scrolling issues by completely restructuring the BeamsBackground component
- Converted the animated background to use fixed positioning that works with scrollable content
- Removed height constraints from slot container in BeamsBackground component
- Updated the main layout to properly support scrollable content with the animated background
- Fixed canvas animation to work correctly with scrollable pages
- Fixed global scrolling issues by modifying the layout structure and CSS
- Updated the main layout file to use a flexible layout without height constraints
- Modified the alaska-bg class to prevent scrolling problems across pages
- Added global CSS to ensure proper scrolling behavior on all pages
- Created a reusable AuctionCard component based on the Enhanced3DCard implementation
- Improved alignment of UI elements by adding proper centering for buttons and icons
- Added YouTuber attribution to auction items
- Implemented bid and watchlist event handlers in the cards
- Added proper bid information display with current and starting bid
- Optimized animations for better performance in grid layouts
- Added auction-specific terminology (bids placed, time remaining, etc.)
- Reduced particle count to improve performance when displaying multiple cards
- Fixed styling issues with button centering and heart icon alignment

## Core Components
- `BeamsBackground(Animated).svelte` - An animated background component that creates a dynamic light beam effect using canvas, now with proper scrolling support
- `Navbar.svelte` - The main navigation component with links to different sections
- `NicknameCheckWrapper.svelte` - A wrapper component that checks for user nicknames
- `Enhanced3DCard.svelte` - A component for creating interactive 3D card effects with layering capabilities
- `AuctionCard.svelte` - A reusable auction-specific card component with 3D effects, built on Enhanced3DCard
- `PastAuctionCard.svelte` - A specialized card component for past auctions with grayscale effect, "SOLD" badge, and robust image handling
- `ResponsiveImage.svelte` - A component that handles responsive images with format support and fallbacks
- `GlowingEffect.svelte` - A component that adds an interactive glowing border to elements
- `FocusCard.svelte` - A component that creates a gallery of cards where the focused card stands out while others blur

## Styling
- Using Tailwind CSS for responsive styling
- The `cn` utility function from `src/lib/utils/utils.js` is used for class name composition (combines clsx and tailwind-merge)
- Custom CSS defines styles for specific components and effects
- Extensive use of backdrop-blur, semi-transparency, and shadow effects to complement the animated background
- Fixed layout structure to ensure proper scrolling while maintaining visual effects
- Enhanced 3D card display with proper overflow and spacing for hover effects
- Consistent card styling across the application with the AuctionCard and PastAuctionCard components
- Grayscale and filter effects for past auctions to distinguish them from current auctions
- Custom pattern backgrounds and animated gradient overlays for item detail pages

## Authentication
- Authentication status is checked when the application loads
- Using a store called `isAuthenticated` to manage authentication state
- User data is displayed in the UI once authenticated
- Profile management with fields for display name and notification preferences

## Development Environment
- The application runs on port 5175 in development mode
- Uses Vite as the development server
- SvelteKit for routing and server-side rendering capabilities 