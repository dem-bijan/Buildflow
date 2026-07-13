# BuildFlow Project - Claude Code Guide

## Project Overview
BuildFlow is a Next.js 16.2.9 React application with TypeScript and Tailwind CSS. It appears to be a dashboard/ERP-style application with modules for accounting, inventory, HR, procurement, and project management.

## Development Commands

- **Development Server**: `npm run dev` or `yarn dev`
- **Production Build**: `npm run build` or `yarn build`
- **Production Start**: `npm run start` or `yarn start`
- **Linting**: `npm run lint` or `yarn lint`
- **Type Checking**: `npx tsc --noEmit` (TypeScript checking)

## Project Structure

```
/app - Next.js 13+ app router
  /(page) - Main landing page
  /dashboard - Main dashboard area with various modules
    /achats - Procurement/Purchasing module
    /affectation - Assignment/Allocation module  
    /annuaire - Directory/Dashboard module
    /catalogue - Product/Service catalog
    /comptabilite - Accounting/Finance module
    /dashboard - Main dashboard overview
    /fournisseurs - Suppliers/Vendors module
    /payments - Payments module
    /salaires - Salaries/Payroll module
    /sous-traitance - Subcontracting module
    /stocks - Inventory/Stock module
    /suivi-chantiers - Project tracking module
    /tresorerie - Treasury/Cash flow module
    /layout.tsx - Dashboard layout
    /page.tsx - Dashboard home page
  /api - API routes
  layout.tsx - Root layout
  page.tsx - Home page
  globals.css - Global styles
  middleware.ts - Next.js middleware
  theme/ - Theme configuration
  hooks/ - Custom React hooks
  utils/ - Utility functions

/components - Shared React components
  /dashboard - Dashboard-specific components
    /Sidebar.tsx - Navigation sidebar
    /header.tsx - Header/navbar
  /kokonutui - UI component library
  /table - Table components
  /ui - Reusable UI components (KPI cards, charts, sections, etc.)
  Button.tsx - Button component
  CardNav.tsx - Navigation card component
  Functions.tsx / functions2.tsx - Functional components
  LightPillar.tsx - Visualization component
  SignIn.tsx / SignUp.tsx - Authentication pages
  themeprovider.tsx - Theme provider
  Trendchart.tsx - Chart component

/lib - Library utilities
  /api - API service functions
  /auth - Authentication context and utilities
  /data - Data processing utilities
  /validation - Form validation utilities
  /rateLimit.ts - Rate limiting
  /session.ts - Session management

## Key Technologies

- **Framework**: Next.js 16.2.9 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.3.1
- **UI Components**: Radix UI, Shadcn/UI
- **Charts**: Chart.js, react-chartjs-2, recharts
- **Animations**: Framer Motion, GSAP, Motion
- **State Management**: React Context (via authContext)
- **HTTP Client**: Axios
- **Date Handling**: date-fns (implied by usage)
- **Icons**: Lucide React

## Key Features by Module

### Dashboard (/dashboard)
- Overview analytics and KPIs
- Real-time charts and visualizations
- Quick access to all modules

### Accounting (/comptabilite)
- Financial tracking and reporting
- Payment processing integration

### Inventory (/stocks)
- Stock level monitoring
- Inventory management

### Purchasing (/achats)
- Procurement workflow
- Supplier management

### Sales/Payroll (/salaires)
- Employee management
- Salary processing

### Projects (/suivi-chantiers)
- Project tracking
- Task management

## Development Guidelines

### Styling
- Uses Tailwind CSS with custom theme in `/theme/`
- Follows Shadcn/UI patterns for consistent UI
- Uses `class-variance-authority` and `tailwind-merge` for variant styling
- Dark/light theme support via `next-themes`

### Components
- Reusable components in `/components/ui/`
- Dashboard-specific layouts in `/components/dashboard/`
- Custom charts and visualizations in components like `LightPillar.tsx` and `Trendchart.tsx`

### State Management
- Authentication context in `/lib/authContext.tsx`
- Custom hooks in `/hooks/`
- API service functions in `/lib/api/`

### Data Fetching
- Uses Next.js 13+ server components and API routes
- Client-side data fetching with Axios/Road queries
- API routes in `/app/api/`

### Best Practices
1. **Type Safety**: Strict TypeScript usage throughout
2. **Component Composition**: Prefer composition over inheritance
3. **Performance**: Use React.memo, useMemo, useCallback appropriately
4. **Error Handling**: Proper error boundaries and loading states
5. **Accessibility**: Follow WCAG guidelines, use semantic HTML
6. **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Common Patterns
- **Layouts**: Nested layouts in `/app/(page)/layout.tsx` and `/app/dashboard/layout.tsx`
- **Data Fetching**: Server components for initial data, client components for interactivity
- **Styling**: Tailwind utility-first with CSS variables for theme colors
- **Forms**: Controlled components with validation via `/lib/validation/`

### Environment Variables
- Not yet configured (check for `.env.local` example)
- Likely needs API endpoints, auth secrets, etc.

## Testing
- No test framework configured yet (consider adding Jest/Vitest)
- Manual testing via browser recommended during development

## Deployment
- Built for Vercel deployment (Next.js default)
- Build output: `.next/` directory
- Start command: `next start`

## Getting Started
1. Install dependencies: `npm install` or `yarn`
2. Run development server: `npm run dev`
3. Open http://localhost:3000 in browser