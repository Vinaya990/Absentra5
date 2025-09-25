# Absentra - Leave Management System

## Overview

Absentra is a comprehensive leave management system designed to streamline employee leave requests, approvals, and administration. The system supports multi-level approval workflows, department management, holiday calendars, and comprehensive reporting with role-based access control for employees, managers, HR, and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Styling**: Tailwind CSS for utility-first styling and responsive design
- **Routing**: React Router for client-side navigation with protected routes
- **State Management**: React Context API for global state (auth, data, notifications) with custom hooks
- **Data Fetching**: TanStack React Query for server state management, caching, and API interactions
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for consistent type safety across frontend and backend
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Validation**: Zod for runtime type validation and API request/response validation
- **Development**: Concurrent development with TSX for hot reloading and Vite for frontend bundling

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for relational data management
- **Database Provider**: Neon Database for serverless PostgreSQL hosting
- **Schema Management**: Drizzle Kit for database migrations and schema evolution
- **Connection Pooling**: Neon's serverless connection pooling for scalable database access
- **Local Storage**: Browser localStorage for user sessions and notification preferences

### Authentication and Authorization
- **Authentication Pattern**: Custom context-based authentication with persistent sessions
- **Session Management**: localStorage-based session persistence with automatic cleanup
- **Role-Based Access Control**: Four-tier role system (employee, line_manager, hr, admin) with component-level access control
- **Protected Routes**: Route guards preventing unauthorized access to admin and management features
- **User Management**: Admin-controlled user creation with employee linking and role assignment

### External Dependencies
- **Database**: Neon PostgreSQL for persistent data storage
- **Icons**: Lucide React for consistent iconography
- **PDF Generation**: jsPDF with autoTable for report generation
- **Excel Export**: XLSX library for spreadsheet generation and data import/export
- **WebSocket Support**: Native WebSocket (ws) for real-time notifications
- **Development Tools**: 
  - Vite for fast development builds and HMR
  - ESLint with TypeScript rules for code quality
  - Tailwind CSS for responsive design
  - PostCSS with Autoprefixer for CSS processing

### Key Architectural Decisions
- **Monorepo Structure**: Shared schema between frontend and backend ensures type consistency
- **Context-Driven State**: Multiple React contexts (Auth, Data, Notifications) provide separation of concerns
- **Type-First Development**: Drizzle schema generates TypeScript types used across the entire application
- **Component-Based UI**: Modular component architecture with reusable UI components and feature-specific modules
- **Role-Based Navigation**: Dynamic sidebar and routing based on user roles with progressive feature access
- **Real-Time Updates**: Event-driven notification system with custom events for leave request state changes
- **Export Capabilities**: Built-in PDF and Excel export functionality for reports and data analysis
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities for cross-device compatibility