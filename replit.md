# Overview

This is a full-stack food delivery application called "MealMatch" built with React, Express, and PostgreSQL. The application features a modern restaurant ordering system with a beautifully designed UI showcasing restaurants, menus, and food items. The frontend uses React with TypeScript and shadcn/ui components for a polished user interface, while the backend is structured as an Express.js API with Drizzle ORM for database management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Styling**: TailwindCSS with custom CSS variables and shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management and API data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Comprehensive shadcn/ui component system including forms, dialogs, navigation, and data display components

## Backend Architecture
- **Framework**: Express.js with TypeScript for API development
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Development**: TSX for TypeScript execution in development
- **Production Build**: ESBuild for fast production bundling
- **API Design**: RESTful API structure with middleware for logging and error handling

## Database Design
- **Database**: PostgreSQL with Neon Database serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Current Schema**: Users table with username/password authentication fields
- **Session Storage**: PostgreSQL session store for user sessions

## Development Environment
- **Monorepo Structure**: Organized with separate client, server, and shared directories
- **Shared Types**: Common TypeScript types and schemas shared between frontend and backend
- **Path Aliases**: Configured for clean imports (@/ for client, @shared for shared code)
- **Development Tools**: Hot reload with Vite, TypeScript checking, and error overlays

## Key Features Implemented
- **Restaurant Display**: Featured restaurants with ratings and ordering capabilities
- **Menu Categories**: Categorized food items (Biryani, Tiffin, Non-Veg Gravy, etc.)
- **Customer Testimonials**: User reviews and feedback display
- **Responsive Design**: Mobile-first design with responsive layouts
- **Interactive UI**: Hover effects, animations, and smooth user interactions

# External Dependencies

## Database & Backend Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Drizzle ORM**: Type-safe database queries and migrations
- **Express Session**: Session management with PostgreSQL store
- **Connect PG Simple**: PostgreSQL session store connector

## Frontend Libraries
- **TanStack React Query**: Server state management and data fetching
- **Radix UI**: Headless UI primitives for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography
- **Wouter**: Lightweight routing library
- **React Hook Form**: Form handling with validation
- **Class Variance Authority**: Type-safe variant styling
- **Date-fns**: Date manipulation and formatting

## Development & Build Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **TSX**: TypeScript execution for Node.js
- **Replit Integration**: Development environment integration with Replit-specific plugins
- **TailwindCSS**: Utility-first CSS framework with PostCSS processing

## UI & Styling
- **shadcn/ui**: Complete component system built on Radix UI
- **TailwindCSS**: Utility-first CSS with custom design tokens
- **Google Fonts**: Poppins, Rubik, and DM Sans font families
- **Custom CSS Variables**: Theme-based color system and animations