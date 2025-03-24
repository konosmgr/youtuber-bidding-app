# Project State

## Current State
The project is a SvelteKit application for "Betting on Alaska Auctions" - a youtuber bidding platform. The application provides an interface for users to participate in auctions related to various categories including general auctions, knives, art, and miscellaneous items.

### Recent Changes
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
  - `knives/+page.svelte` - Knives page using the AuctionCard component for current auctions and PastAuctionCard for past auctions
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
- Multiple routes to access knife details with consistent UI across routes

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