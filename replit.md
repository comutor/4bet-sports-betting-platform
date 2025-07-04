# 4bet - Premier Betting Platform

## Overview

4bet is a comprehensive sports betting platform designed for users in South Sudan and Uganda. The application provides a full-stack betting experience with real-time sports data, casino games, virtual sports, and user management. Built with a modern tech stack, it offers both web and mobile-responsive interfaces for placing bets, managing accounts, and accessing various gaming options.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with local state and TanStack Query for server state
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with middleware pattern
- **Session Management**: Express sessions with PostgreSQL storage
- **Database ORM**: Drizzle ORM for type-safe database operations

### Database Schema
The application uses PostgreSQL with the following core entities:
- **Users**: User accounts with authentication and balance management
- **Sports Events**: Real-time sports event data with odds
- **Betting Markets**: Different betting options for events
- **Betslip Items**: User's current bet selections
- **User Bets**: Placed and settled betting history

## Key Components

### Authentication System
- Phone number-based registration and login
- Country-specific registration (South Sudan, Uganda)
- Session-based authentication with secure cookies
- Password-based security with form validation

### Sports Data Integration
- The Odds API integration for real-time sports data
- Caching mechanism to optimize API usage
- Support for multiple sports: football, basketball, tennis, hockey
- Live and upcoming events with dynamic odds

### Betting Engine
- Real-time betslip management with local storage persistence
- Single and accumulator bet types
- Currency support for both UGX (Uganda) and SSP (South Sudan)
- Odds calculation and potential return computation

### User Interface Features
- Mobile-first responsive design
- Dark theme with custom color scheme
- Component-based architecture with reusable UI elements
- Real-time updates and loading states
- Error boundaries for graceful error handling

## Data Flow

1. **User Registration/Login**: Users provide phone number and credentials → Server validates and creates session → Client receives user data and authentication state
2. **Sports Data**: Client requests events → Server checks cache → If cache miss, fetches from Odds API → Returns formatted data to client
3. **Betting Process**: User selects odds → Added to betslip (local storage) → User places bet → Server validates and processes → Updates user balance and bet history
4. **Real-time Updates**: Periodic polling for live events and odds updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection handling
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/**: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### APIs and Services
- **The Odds API**: Real-time sports odds and event data
- **PostgreSQL**: Primary database for user data and betting history

### Development Tools
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast development server and build tool
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Production Build
- Client build: Vite optimizes and bundles React application
- Server build: ESBuild compiles TypeScript server code
- Static assets served from dist/public directory

### Environment Configuration
- Database connection via DATABASE_URL environment variable
- Odds API key configuration for sports data
- Session secret for secure authentication

### Platform Requirements
- Node.js 20+ runtime environment
- PostgreSQL 16 database
- Environment variables for external service configuration

## Changelog
```
Changelog:
- July 3, 2025. Improved match card design: Updated football section to use line separators instead of individual boxes for each match, creating a cleaner and more professional appearance that reduces visual clutter
- July 3, 2025. Enhanced navigation styling: Applied consistent blue underline design to both main sports navigation and More Markets tabs, replacing rounded backgrounds with professional underline highlighting for improved visual consistency
- July 3, 2025. Implemented dedicated More Markets page: Created new `/more-markets/:eventId` route with comprehensive market navigation matching betting platform standards, replaced modal with full-page experience featuring match details, time/date display, team names, league information, and market tabs (All, Popular, Goals, Halves, Combos, Specials, Corners, Booking) with blue highlighting for selected tabs
- July 3, 2025. Enhanced full-width layout: Removed additional centering constraints including justify-center and max-width limitations, ensured complete left-aligned flow for optimal full-width utilization
- July 3, 2025. Enabled live Odds API: Unpaused the sports betting API to fetch real-time odds and match data from The Odds API instead of mock data, removed mock data fallbacks for authentic live betting experience
- July 3, 2025. Removed all centering features: Eliminated text-center, justify-center, mx-auto classes throughout app, removed CSS centering constraints for large screens, converted layouts to natural left-aligned flow
- June 28, 2025. Enhanced logo boldness: Strengthened text shadows and glow effects for more prominent logo appearance with deeper visual impact
- June 28, 2025. Enhanced balance text visibility: Increased font size from text-xs/sm to text-sm/base for better readability while maintaining bold styling
- June 28, 2025. Increased balance and deposit button padding: Enhanced both elements with larger padding (px-3 md:px-4 py-2 md:py-2.5) for better prominence and visual consistency
- June 28, 2025. Reverted deposit button to text: Changed "+" icon back to "Deposit" text across all screen sizes
- June 28, 2025. Reverted balance formatting to original: Removed comma formatting and returned to simple raw number display as requested
- June 28, 2025. Created two-tone logo design: Made "4" blue with gradient and glow effects while keeping "bet" white, creating distinctive brand recognition and visual hierarchy
- June 28, 2025. Enhanced logo typography: Added Orbitron Google Font, increased sizes, applied gradient text effects, enhanced shadows with blue glow, and improved letter spacing for professional branding
- June 28, 2025. Removed automatic banner slides: Replaced rotating welcome banner with static 4bet welcome message as requested by user
- June 28, 2025. Enhanced statement list styling: Redesigned transaction list with organized card layout, circular icon backgrounds, status pills, better typography hierarchy, and hover effects for improved visual organization
- June 28, 2025. Fixed branding consistency: Updated welcome banner from "TATAbets" to "4bet" to complete the company rebrand
- June 28, 2025. Implemented statement functionality: Added comprehensive transaction history display with filtering by type and date range, CSV export capability, visual indicators for transaction types, and seamless navigation from account section
- June 28, 2025. Removed settings section and light mode: Eliminated settings functionality and white/light mode as requested by user, cleaned up all references and simplified account navigation structure to maintain dark-only theme
- June 27, 2025. Integrated authentic Spribe Aviator with server-side tracking: Implemented token-based authentication system for Spribe Aviator, server-side user session management, secure bet/win tracking, and balance synchronization while keeping payments on platform
- June 27, 2025. Updated virtual games countdown styling: Changed all countdown timer colors from blue to white across virtual sports sections including navigation tabs and footer timers for better visual consistency
- June 26, 2025. Enhanced virtual games with navigation tabs: Added Live/Next/Results tabs with countdown timers for Virtual Football, Basketball, and Tennis. Live matches show real-time scores, Next shows upcoming with countdown, Results display final outcomes
- June 26, 2025. Implemented virtual games system: Virtual Football (3 min intervals), Virtual Horse Racing (2 min intervals), Virtual Basketball (4 min intervals), and Virtual Tennis (5 min intervals) with realistic teams, live scoring, and comprehensive betting options
- June 26, 2025. Added footer with legal information: Copyright by Wobo Gaming Limited, South Sudan Gaming Board licensing, payment processing details, and 18+ age restriction warning
- June 26, 2025. Added loading screen: Created professional startup screen with 4bet logo and thin blue spinning circle animation with pulsing dots
- June 26, 2025. Enhanced search functionality: Added auto-close detection for search bar (click outside, Escape key) and improved user interaction patterns
- June 26, 2025. Added search functionality: Implemented search bar that appears between title bar and top navigation with smooth animations, auto-focus, clear/close buttons, and search results placeholder
- June 26, 2025. Fixed country dropdown functionality: Added separate state management for individual country dropdowns within Other Countries section to prevent state conflicts
- June 26, 2025. Optimized country navigation: Converted Other Countries section to individual dropdown buttons for each country to reduce scrolling and improve user experience
- June 26, 2025. Fixed dropdown navigation: Prevented menu from closing when clicking country dropdown buttons, allowing proper expansion of International and Other Countries sections
- June 26, 2025. Populated other countries section: Added 17 countries with real league data from odds API including Brazil, Argentina, USA, Mexico, Japan, Australia, Russia, and European nations not in top countries
- June 26, 2025. Added international competitions: Populated International section with major competitions including UEFA Champions League, Europa League, Conference League, CONMEBOL Libertadores, and other continental tournaments
- June 26, 2025. Enhanced countries section: Replaced generic country categories with specific top European countries (England, Spain, Italy, Germany, France, Netherlands, Belgium, Switzerland) each with their own league dropdowns
- June 26, 2025. Added visual separation lines: Implemented border lines between main menu, popular sports, and countries sections in hamburger menu for better visual organization
- June 26, 2025. Enhanced slide animations: Updated hamburger menu and betslip sidebar to slide from actual screen edges using custom CSS animations with cubic-bezier easing
- June 26, 2025. Enhanced hamburger menu design: Implemented CSS grid layout with 90x90px boxes, professional shadows, hover effects, and separate icon/text styling for improved user experience
- June 26, 2025. Fixed deposit security vulnerability: Added authentication checks to prevent unauthorized transactions, shows login prompt for unauthenticated users
- June 19, 2025. Fixed services dropdown auto-close: Added click-outside detection and automatic closure when interacting with other UI elements
- June 19, 2025. Implemented secure database integration: Added PostgreSQL storage for user balances, bet history, and transaction tracking with balance_transactions table
- June 19, 2025. Created secure API endpoints: /api/user/balance, /api/user/bets/place, /api/user/transactions for database-backed operations
- June 19, 2025. Added bet management hooks: usePlaceBet, useBalance, useUpdateBalance for frontend database integration
- June 19, 2025. Enhanced storage layer: Implemented DatabaseStorage with secure balance management and bet persistence
- June 19, 2025. Fixed betslip odds styling: Changed odds text from blue to bold white for consistency across single and accumulator bets
- June 19, 2025. Optimized button responsiveness: Eliminated delayed responses by removing CSS conflicts, faster transitions, and improved mobile touch handling
- June 19, 2025. Complete styling overhaul: Implemented yellow hover theme with black text default, betslip circle always yellow, sign up buttons always yellow with black text
- June 26, 2025. Complete yellow color removal: Eliminated all remaining yellow colors from signup/login pages, account section, hamburger menu, and all components, replaced with NileBet blue (#1E40AF)
- June 26, 2025. Logo simplification: Removed circle and box styling, created clean "4bet" text logo
- June 26, 2025. Company rebrand: Changed from TATAbets to 4bet throughout application with new logo design and 4betssd.com domain
- June 19, 2025. Company rebrand: Changed from NileBet to TATAbets throughout application
- June 19, 2025. Added phone number validation for Uganda (MTN/Airtel) and South Sudan (92x prefix)
- June 15, 2025. Initial setup
```

## Domain Configuration
- Production domain will be: 4betssd.com
- Current development environment supports both South Sudan and Uganda markets

## User Preferences

Preferred communication style: Simple, everyday language.