# MealMatch

This is a full-stack food delivery application called "MealMatch" built with React, Express, and PostgreSQL. The application features a modern restaurant ordering system with a beautifully designed UI showcasing restaurants, menus, and food items. The frontend uses React with TypeScript and shadcn/ui components for a polished user interface, while the backend is structured as an Express.js API with Drizzle ORM for database management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Styling**: TailwindCSS with custom CSS variables and shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management and API data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Comprehensive shadcn/ui component system including forms, dialogs, navigation, and data display components

### Backend Architecture
- **Framework**: Express.js with TypeScript for API development
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Development**: TSX for TypeScript execution in development
- **Production Build**: ESBuild for fast production bundling
- **API Design**: RESTful API structure with middleware for logging and error handling

### Database Design
- **Database**: PostgreSQL with Neon Database serverless hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Current Schema**: Users table with username/password authentication fields
- **Session Storage**: PostgreSQL session store for user sessions

### Development Environment
- **Monorepo Structure**: Organized with separate client, server, and shared directories
- **Shared Types**: Common TypeScript types and schemas shared between frontend and backend
- **Path Aliases**: Configured for clean imports (@/ for client, @shared for shared code)
- **Development Tools**: Hot reload with Vite, TypeScript checking, and error overlays

### Key Features Implemented
- **Restaurant Display**: Featured restaurants with ratings and ordering capabilities
- **Menu Categories**: Categorized food items (Biryani, Tiffin, Non-Veg Gravy, etc.)
- **Customer Testimonials**: User reviews and feedback display
- **Responsive Design**: Mobile-first design with responsive layouts
- **Interactive UI**: Hover effects, animations, and smooth user interactions

## External Dependencies

### Database & Backend Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Drizzle ORM**: Type-safe database queries and migrations
- **Express Session**: Session management with PostgreSQL store
- **Connect PG Simple**: PostgreSQL session store connector

### Frontend Libraries
- **TanStack React Query**: Server state management and data fetching
- **Radix UI**: Headless UI primitives for accessibility and functionality
- **Lucide React**: Icon library for consistent iconography
- **Wouter**: Lightweight routing library
- **React Hook Form**: Form handling with validation
- **Class Variance Authority**: Type-safe variant styling
- **Date-fns**: Date manipulation and formatting

### Development & Build Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **TSX**: TypeScript execution for Node.js
- **TailwindCSS**: Utility-first CSS framework with PostCSS processing

### UI & Styling
- **shadcn/ui**: Complete component system built on Radix UI
- **TailwindCSS**: Utility-first CSS with custom design tokens
- **Google Fonts**: Poppins, Rubik, and DM Sans font families
- **Custom CSS Variables**: Theme-based color system and animations



## Project Structure

```text
c:\Projects\MealMatch\
  api\
    index.ts
  client\
    index.html
    public\
      figmaAssets\
        ... (static images and svg assets)
    src\
      App.jsx
      App.tsx
      components\
        DishCard.jsx
        ProtectedRoute.jsx
        ui\
          accordion.tsx
          ... (shadcn/ui primitives)
      context\
        AuthContext.jsx
      hooks\
        use-mobile.tsx
        use-toast.ts
      lib\
        queryClient.ts
        utils.ts
      pages\
        CookDashboard.jsx
        CookProfilePage.jsx
        FoodeliDesign.tsx
        HomePage.jsx
        LoginPage.jsx
        not-found.tsx
        sections\
          CustomerTestimonialsSection.tsx
          FeaturedDishesSection.tsx
          MenuSection.tsx
          RestaurantListSection.tsx
      index.css
      main.jsx
      main.tsx
      mockData.js
  components.json
  drizzle.config.ts
  package.json
  postcss.config.js
  server\
    app.ts
    index.ts
    routes.ts
    storage.ts
    vite.ts
  shared\
    schema.ts
  tailwind.config.ts
  tsconfig.json
  vercel.json
  vite.config.ts
```

### Notable folders
- **client**: React app (TypeScript + shadcn/ui + Tailwind).
- **server**: Express server entry and config.
- **api**: Thin API bootstrap (SSR/proxy or future separation).
- **shared**: Shared types/schemas across client and server (Drizzle schema lives here).


## Setup Guide

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL (local) or a Neon Database URL

### 1) Install dependencies
```bash
npm install
```

### 2) Environment variables
Create a `.env` in the project root:
```bash
# Database
DATABASE_URL=postgres://user:password@localhost:5432/mealmatch

# Sessions (example secret)
SESSION_SECRET=replace-with-a-long-random-string

# Server
PORT=5174

# Optional: Vercel/Neon specific URLs
# NEON_DATABASE_URL=...
```

If deploying to Neon, put the Neon connection string in `DATABASE_URL`.

### 3) Database migrations
Initialize and run Drizzle migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4) Start development servers
Run the Express server (with TS):
```bash
npm run dev:server
```

Run the Vite client:
```bash
npm run dev:client
```

Or run both concurrently if available:
```bash
npm run dev
```

Common scripts (see `package.json`):
- `dev`: start client and server in dev
- `dev:client`: Vite dev server for React
- `dev:server`: Express server with TSX
- `build`: build client and server
- `build:client`: Vite build for client
- `build:server`: ESBuild/TS build for server

### 5) Production build
```bash
npm run build
npm run start
```

### Path aliases
TypeScript path aliases are configured:
- Client: import from `@/` for `client/src`
- Shared: import from `@shared/` for `shared`

### Troubleshooting
- Ensure `DATABASE_URL` is reachable and matches your Postgres credentials.
- If Tailwind styles don’t apply, verify `postcss.config.js` and `tailwind.config.ts` are present and the content paths include `client/src`.
- If UI components error, confirm shadcn/ui dependencies are installed and versions align with React 18.