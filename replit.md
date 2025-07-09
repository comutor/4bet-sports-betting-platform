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
- July 9, 2025. Achieved complete global basketball competitions database: Finalized comprehensive basketball database with 50+ countries and 4 regional sections (Africa, Asia, Europe, South-America) containing 300+ authentic competitions. Added final countries: Saudi Arabia, Singapore, Taiwan (4 leagues), Tajikistan (2 leagues), Thailand, Turkmenistan, Uruguay. Enhanced major countries with complete structures: Russia (7 leagues), Serbia (4 leagues), Slovakia (3 leagues), Slovenia (4 leagues), South Korea (3 leagues), Spain (8 leagues), Sweden (4 leagues), Switzerland (2 leagues), Turkey (11 leagues), Ukraine (5 leagues), United Kingdom (6 leagues), USA (9 leagues including BIG3). Database represents most comprehensive basketball competition coverage globally with authentic league hierarchies, women's competitions, cup tournaments, and youth divisions matching API Sports structure exactly
- July 9, 2025. Completed comprehensive global basketball competitions database: Finalized basketball database with 40+ countries including newly added Japan (6 leagues), Kazakhstan (5 leagues), Kosovo, Lebanon, Luxembourg, Macedonia (4 leagues), Mexico (3 leagues), New Zealand (3 leagues), Paraguay, Philippines (5 leagues), Puerto Rico, and Qatar. Enhanced existing countries with complete league structures: Italy (14 leagues), Lithuania (5 leagues), Montenegro, Netherlands (5 leagues), Norway, Poland (8 leagues), Portugal (8 leagues), and Romania (5 leagues). Database now provides unprecedented global basketball coverage with authentic league hierarchies, women's competitions, cup tournaments, and youth divisions matching API Sports structure exactly
- July 9, 2025. Expanded comprehensive competitions database to basketball: Added extensive basketball competitions with 30+ countries plus regional sections (Africa, Asia, Europe) containing 200+ authentic leagues and tournaments. Major basketball nations include USA (8 competitions), Spain (6 competitions), Germany (5 competitions), Italy (5 competitions), and Australia (16 NBL divisions). Database includes international competitions, women's leagues, cup tournaments, and youth divisions matching API Sports structure exactly
- July 9, 2025. Completed comprehensive A-Z global competitions database: Built complete competitions UI matching API Sports structure exactly with 85+ countries from Afghanistan to Wales, each containing authentic league hierarchies. Added comprehensive World section with 108 international competitions including AFC, AFF, African, Arab, Asian, CAF, CONCACAF, CONMEBOL, and FIFA tournaments. Database now covers extensive global football structure with major nations having 40+ leagues (Spain), detailed regional divisions (USA with 16 leagues), and authentic international competition coverage
- July 8, 2025. Implemented dual API strategy: Integrated API Sports as main API for football, basketball, hockey, and other sports while keeping Odds API specifically for cricket and tennis. Created ApiSportsService with comprehensive endpoint coverage including fixtures, leagues, competitions, and standings. Updated all football routes to use API Sports with better organized competition structure by country and leagues
- July 8, 2025. Removed pagination dots from advertisement banner: Cleaned up AdvertisementBanner component by removing indicator dots for cleaner visual appearance
- July 8, 2025. Reordered sports navigation to prioritize Tennis before Cricket: Updated both TopNavigation and HamburgerMenu components to show Tennis as the 3rd sport and Cricket as 4th, reflecting user preferences for sports ordering
- July 8, 2025. Replaced Sports button with Home button: Removed confusing "Sports" navigation button and replaced it with "Home" button that corresponds to Football section. Updated all navigation, filter logic, and logout flows to use 'home' as the default tab. Home page now loads Football content directly, simplifying user experience and removing unnecessary AllSportsSection component
- July 7, 2025. Reordered sports navigation by usage priority: Updated sports tabs to prioritize most used sports (Football, Basketball, Hockey, NFL, Volleyball, Rugby) first, followed by other sports. Removed NBA as separate tab since it's a league under Basketball. Updated both top navigation and hamburger menu with consistent ordering
- July 7, 2025. Updated sports navigation labels to match reference design: Added all 12 sports from reference image (AFL, Baseball, Basketball, Football, Formula-1, Handball, Hockey, MMA, NBA, NFL, Rugby, Volleyball) with proper routing and "Coming Soon" pages for sports under development
- July 7, 2025. Updated main logo styling throughout app: Applied new 4bet logo design with blue gradient "4" and white "bet" styling consistently across all components including TopNavigation, HamburgerMenu, LoadingScreen, and AccountPage. Enhanced logo sizes and improved visual consistency with Orbitron font and blue glow effects
- July 7, 2025. Redesigned account page for unauthenticated users: Removed inappropriate deposit/withdraw buttons for logged-out users and created centered welcome layout with 4bet logo, welcome message, and prominent sign up/login buttons. Authenticated users still see the original functional layout with deposit/withdraw options and menu items
- July 6, 2025. Added intelligent "To Qualify" market detection for knockout competitions: Implemented automatic detection system that adds "To Qualify" betting market specifically for knockout competitions including FIFA Club World Cup, Champions League, Europa League, World Cup, and other cup competitions. System detects competition type by league name and conditionally includes the market in both ALL and POPULAR categories for authentic knockout betting experience
- July 6, 2025. Implemented comprehensive football betting markets with dropdown functionality: Created detailed football betting system with 80+ authentic markets including 1X2, Over/Under, Handicaps, Correct Score, Both Teams Score, Clean Sheets, Corners, Half Time/Full Time, Multiscores, and team-specific markets. Markets are organized by category (ALL, POPULAR, GOALS, HALVES, CORNERS, BOOKING, COMBOS, SPECIALS) with clickable dropdown functionality revealing odds when expanded. All odds display with consistent two decimal formatting and realistic betting values
- July 6, 2025. Fixed missing dates and "+25" buttons in sport sections: Updated FootballSection and SportSection components to include intelligent date formatting (Today/Tomorrow/Date format) and properly functioning "+25" more markets buttons with match data parameters. All sports sections now have consistent date display and navigation to detailed betting markets
- July 6, 2025. Implemented sport-specific betting market navigation: Created dynamic market tabs that change based on sport type. Football shows Goals/Halves/Corners/Booking markets, Basketball displays Points/Quarters/Player Props/Team Props, Tennis features Sets/Games/Aces/Player Props, Ice Hockey includes Goals/Periods/Shots/Penalties, and Baseball shows Runs/Innings/Hits/Player Props. Enhanced market content with sport-specific examples and dynamic count display
- July 6, 2025. Fixed "+25" button to display actual match data: Updated MatchCard component to pass match details through URL parameters to MoreMarkets page. The "+25" button now correctly displays selected team names, league, date, and time instead of hardcoded Fluminense vs Al Hilal data. Added sport detection and dynamic date/time formatting to ensure accurate match information
- July 6, 2025. Implemented consistent two decimal odds formatting: Added formatOdds helper function to MatchCard component and updated all match sections (AllSection, TopLeaguesSection, CompetitionsSection, LeagueMatchesSection) to display odds with consistent two decimal places (e.g., 2.00 instead of 2). Virtual games already used proper formatting
- July 6, 2025. Enhanced match cards with dates and more markets: Added intelligent date formatting (Today/Tomorrow/Date format) to all match cards, integrated "+25" more markets button that navigates to detailed betting markets page, updated MatchCard component with commenceTime parameter and enhanced layout with proper date display across all sections (AllSection, TopLeaguesSection, CompetitionsSection, LeagueMatchesSection)
- July 6, 2025. Fixed logout redirect issue: Resolved "under development" message after logout by updating navigation flow to redirect users to football section instead of undefined 'home' route, ensuring smooth user experience
- July 6, 2025. Implemented PostgreSQL-backed API caching system: Extended cache timeout from 5 minutes to 30 minutes, added database-backed persistent caching with api_cache table, implemented two-tier caching (memory + database) to dramatically reduce API calls and preserve 20,000 credit allowance. Automatic cache cleanup runs hourly to maintain database performance
- July 5, 2025. Fixed ALL section sport-specific filtering: ALL section now properly filters by selected sport tab - when Football is selected shows only football matches, Basketball shows only basketball matches, etc. Added sport prop to AllSection component with proper sport name mapping and dynamic header titles
- July 5, 2025. Fixed ALL section calendar date filtering: ALL section now properly displays matches for selected calendar date instead of hardcoded today. Implemented date-based filtering across all sports (Football, Basketball, Tennis, Ice Hockey) with popularity-based sorting - most popular leagues (Premier League, La Liga, NBA, etc.) appear first, then less popular leagues, maintaining authentic live API data
- July 5, 2025. Extended dropdown navigation to Top Leagues: Added dropdown functionality to TOP LEAGUES section where league names become clickable buttons revealing matches. Both TOP LEAGUES and COMPETITIONS now use consistent dropdown UI with chevron indicators and collapsible content
- July 5, 2025. Fixed Brazil vs Italy Serie A confusion: Corrected league naming where Brazil's "soccer_brazil_campeonato" was incorrectly labeled as "Serie A" instead of "Brasileirão", while Italy's "soccer_italy_serie_a" properly displays as "Serie A"
- July 5, 2025. Implemented nested dropdown navigation for competitions: Converted COMPETITIONS section to hierarchical dropdown system where countries are dropdown buttons showing leagues, and leagues are dropdown buttons showing matches. Added collapsible functionality with chevron icons, improved visual hierarchy with indentation and borders, and maintained live API data integration with country flags
- July 5, 2025. Restructured league and competition organization: Fixed TOP LEAGUES to show only premier competitions (Premier League, La Liga, Bundesliga, Serie A, NBA, ATP/WTA) with proper filtering. Updated COMPETITIONS to display country-grouped leagues with live API data integration, authentic country flags, and hierarchical organization by country/league structure
- July 5, 2025. Enabled live Odds API with comprehensive data integration: Unpaused Odds API and created complete live data integration system feeding real sports data into ALL filter (date-based matches), TOP LEAGUES (premier competitions), COMPETITIONS (sport-specific leagues), and LIVE events across Football, Basketball, Tennis, and Ice Hockey with authentic odds, team names, leagues, and match details
- July 5, 2025. Removed forgot password functionality: Cleaned up authentication system by removing forgot password feature from both LoginModal and SignupPage components per user request, simplified login flow to focus on core authentication without password recovery
- July 4, 2025. Reorganized navigation structure: Moved "Notifications", "Help Center", "Why Join?", and "More on 4bet" from account section to hamburger menu under "Support & Information". Removed "Top Countries" and "Other Regions" from hamburger menu to simplify navigation. Account section now focuses on core account functions (Deposit, Withdraw, Statement, Manage Account)
- July 4, 2025. Fixed Top Leagues navigation system: Top Leagues now navigate to show actual matches for each league (Premier League, La Liga, etc.) instead of adding to betslip. Created LeagueMatchesSection with back button navigation and automatic reset when filter changes. Users can now properly browse league-specific matches
- July 4, 2025. Implemented ALL filter with date-based match display: Created AllSection component showing all matches for selected date, organized by sport. Added calendar with disabled past dates (only current/future selectable). Integrated universal MatchCard component for consistent betting interface across all sports
- July 4, 2025. Replaced FAVOURITES with LIVE filter: Updated FilterBar to show LIVE instead of FAVOURITES with red styling and blinking red dot, integrated with LiveSection to display live/in-play events across all sports for immediate betting access
- July 4, 2025. Implemented Top Leagues filter: Created sport-specific top leagues section showing only premier competitions from each country (Premier League, La Liga, Bundesliga, Serie A, NBA, Grand Slams, etc.) with professional card layout and country flags
- July 4, 2025. Fixed American Football separation: Resolved confusion between Football (soccer) and American Football by creating distinct league data - American Football now shows NFL/College Football while Football shows Premier League/La Liga/etc.
- July 4, 2025. Implemented sport-specific Competitions filter: Created dynamic competitions section accessible via FilterBar "COMPETITIONS" option that changes based on selected sport. Football shows 15 countries with domestic leagues plus 6 continental competitions (UEFA, CONMEBOL, CONCACAF, CAF, AFC, FIFA). Basketball displays NBA/WNBA/EuroLeague, Tennis shows Grand Slams and ATP/WTA tours, Ice Hockey features NHL/KHL/IIHF tournaments
- July 3, 2025. Paused Odds API: Disabled live API calls to conserve API credits, system will use cached data to maintain functionality while preventing additional charges
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