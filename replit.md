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