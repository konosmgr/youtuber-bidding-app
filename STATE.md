# Project State

## Current State
The project is a SvelteKit application for "Betting on Alaska Auctions" - a youtuber bidding platform. The application provides an interface for users to participate in auctions related to various categories including general auctions, knives, art, and miscellaneous items.

### Recent Changes
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

## Project Structure
The project follows a typical SvelteKit structure:
- `src/routes/` - Contains the pages and layouts of the application
  - `+layout.svelte` - Main application layout with global components (modified to fix scrolling issues)
  - `profile/+page.svelte` - User profile page with GlowingEffect implementation
  - Various route folders containing page components and logic
  - `enhanced-3d-showcase5/` - Demo page for the 3D card component
  - `knives/+page.svelte` - Knives page using the AuctionCard component for current auctions and PastAuctionCard for past auctions with teal accents and enhanced staggered animations
  - `knives/[id]/+page.svelte` - Individual knife auction detail page with Enhanced3D card integration for immersive viewing experience
  - `knife/[id]/+page.svelte` - Fully functional knife detail page with its own implementation, replacing the previous redirect to knives/[id]
- `src/lib/` - Contains reusable components, utilities, and stores
  - `components/` - Reusable UI components
    - `ui/` - Generic UI components 
      - `Background/BeamsBackground(Animated).svelte` - Animated background with light beams (updated to support scrolling)
      - `Glowing-Effect/GlowingEffect.svelte` - Interactive glowing border effect
      - `Focus/FocusCard.svelte` and `Focus/Card.svelte` - Interactive cards with focus effects
      - `3d-card/hybridcards/Enhanced3DCard.svelte` - Advanced 3D card transformation component
      - `AuctionCard.svelte` - Reusable auction card component with 3D effects and auction-specific UI
      - `PastAuctionCard.svelte` - Specialized card component with dual badges, text truncation, and optimized layout to prevent content cropping
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

## Features
- Authentication system with user login/registration
- Nickname checking functionality with profanity filter
- User profile management with email notification preferences
- Modern glass-morphic navigation with smooth animations and responsive design
- Support chat system
- YouTube integration
- Enhanced UI components with animated effects
- Interactive 3D auction cards with dynamic animations and badges
- Bid placement and watchlist functionality
- Properly scrollable pages with fixed animated background
- Enhanced 3D detail pages for individual auction items with animated effects
- Multiple routes to access knife details with consistent UI across routes
- Staggered animation effects for past auction cards with multi-stage transitions
- Distinct visual styling between current and past auctions with consistent 3D effects
- Responsive layout with proper content sizing and truncation to prevent overflow

## Core Components
- `BeamsBackground(Animated).svelte` - An animated background component that creates a dynamic light beam effect using canvas, now with proper scrolling support
- `Navbar.svelte` - Redesigned navigation component with glass-morphic effects, scroll animations, and improved mobile experience
- `NicknameCheckWrapper.svelte` - A wrapper component that checks for user nicknames
- `Enhanced3DCard.svelte` - A component for creating interactive 3D card effects with layering capabilities
- `AuctionCard.svelte` - A reusable auction-specific card component with advanced 3D effects, time-based animations, and realistic depth perception using sine/cosine wave functions and floating particles
- `PastAuctionCard.svelte` - A specialized card component with dual badges (PAST AUCTION and SOLD), responsive layout with text truncation, and optimized spacing to prevent content cropping
- `ResponsiveImage.svelte` - A component that handles responsive images with format support and fallbacks
- `GlowingEffect.svelte` - A component that adds an interactive glowing border to elements
- `FocusCard.svelte` - A component that creates a gallery of cards where the focused card stands out while others blur

## Styling
- Using Tailwind CSS for responsive styling
- The `cn` utility function from `src/lib/utils/utils.js` is used for class name composition (combines clsx and tailwind-merge)
- Custom CSS defines styles for specific components and effects
- Extensive use of backdrop-blur, semi-transparency, and shadow effects to complement the animated background
- Fixed layout structure to ensure proper scrolling while maintaining visual effects
- Enhanced 3D card display with ultra-detailed Z-layering for maximum depth perception (20+ depth levels)
- Time-based sine/cosine wave animations for natural movement in card interactions
- Dynamic color transitions based on hover state with breathing animations for subtle scaling effects
- Staggered element animations with custom timing for a more polished user experience
- Multi-stage animations with blur effects for more elegant card entrances
- Floating particle systems with independent movement in card backgrounds
- Consistent card styling across the application with standardized dimensions (500px for active auctions, 450px for past auctions)
- Grayscale and filter effects for past auctions to distinguish them from current auctions
- Teal color accents and subtle black backgrounds for past auction section
- Custom pattern backgrounds and animated gradient overlays for item detail pages
- Backdrop-blur containers for spec lists and price displays in past auction cards
- Text truncation and responsive spacing to prevent content overflow on smaller screens
- Glass-morphic navbar design with dynamic blur effects that change on scroll position
- Amber/gold accent palette with subtle purple and indigo secondary accents

## Authentication
- Authentication status is checked when the application loads
- Using a store called `isAuthenticated` to manage authentication state
- User data is displayed in the UI once authenticated
- Profile management with fields for display name and notification preferences
- Redesigned user dropdown with improved clarity and visual hierarchy

## Development Environment
- The application runs on port 5175 in development mode
- Uses Vite as the development server
- SvelteKit for routing and server-side rendering capabilities 