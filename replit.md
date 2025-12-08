# CodeCollab - Real-Time Collaborative Coding Platform

## Overview

CodeCollab is a real-time collaborative coding interview platform that enables multiple users to code together with live synchronization. The platform supports JavaScript and Python execution directly in the browser, featuring a professional VS Code-inspired interface with Monaco Editor at its core.

**Core Purpose**: Facilitate technical interviews and collaborative coding sessions with instant code execution, live cursors, and real-time synchronization between participants.

**Tech Stack**: React 18 + Vite (frontend), Express (backend), Monaco Editor, Zustand (state management), Tailwind CSS + shadcn/ui (styling), Wouter (routing)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure**: The application follows a page-based routing model with two primary pages:
- **Home Page** (`/`): Landing page with session creation functionality
- **Session Page** (`/session/:id`): Main collaborative coding interface

**State Management Strategy**: Zustand stores manage application state without prop drilling:
- `sessionStore`: Manages session data, code content, participant information, execution results, and connection status
- `themeStore`: Handles theme persistence (light/dark mode) with localStorage integration

**Code Editor Implementation**: Monaco Editor (VS Code's editor engine) provides the core editing experience with:
- Syntax highlighting for JavaScript and Python
- Real-time code synchronization
- Cursor position tracking for collaborative features
- Configurable font (JetBrains Mono/Fira Code) with ligature support

**Layout System**: Resizable panel layout using `react-resizable-panels`:
- Left panel: Monaco code editor
- Right panel: Output console with execution history
- Top header: Session controls, language selector, run button, participant avatars

**Design Philosophy**: Inspired by VS Code, Linear, and CodeSandbox - function-over-form approach prioritizing clarity and minimal cognitive load for extended coding sessions.

### Backend Architecture

**Current Implementation**: Mock/in-memory backend for development:
- Session storage using in-memory Map structures
- Simulated WebSocket connections for real-time features
- REST API endpoints for session creation and retrieval

**API Structure**:
- `GET /api/session/create`: Generate new collaborative session
- `GET /api/session/:id`: Retrieve session data
- `PATCH /api/session/:id/code`: Update session code
- `PATCH /api/session/:id/language`: Change programming language

**WebSocket Message Protocol**: Defined in `shared/schema.ts` using Zod schemas:
- `code_update`: Broadcast code changes to all participants
- `cursor_update`: Sync cursor positions across users
- `participant_join/leave`: Handle user presence
- `execution_result`: Share code execution outcomes

**Database Schema**: Configured for Drizzle ORM with PostgreSQL support (though currently using in-memory storage). The schema is defined in `shared/schema.ts` and includes validation for sessions, participants, and WebSocket messages.

### Code Execution Architecture

**JavaScript Execution**: Runs in a sandboxed environment in the browser using careful `eval` implementation or Function constructor to prevent security issues.

**Python Execution**: Uses Pyodide (Python compiled to WebAssembly) for in-browser Python execution without server-side processing.

**Execution Flow**:
1. User clicks "Run" button
2. Code is sent through execution handler
3. Results captured (stdout, stderr, return values, errors)
4. Output displayed in dedicated panel
5. Execution history maintained for review

**Rationale**: Client-side execution eliminates server load for code running, provides instant feedback, and simplifies deployment. Trade-off is limited to languages with WASM support or safe client-side execution.

### Real-Time Collaboration

**Mock WebSocket Client** (`client/src/ws/socketClient.ts`): Simulates WebSocket behavior for development:
- Generates mock participants with random colors
- Simulates cursor movements and code updates
- Provides connection lifecycle management

**Participant Management**:
- Auto-generated names and colors from predefined palette
- Avatar display with live status indicators
- Cursor position tracking and visualization
- Maximum 6 participant colors defined (Blue, Green, Amber, Red, Purple, Pink)

**Production Consideration**: Mock client should be replaced with actual WebSocket implementation (using `ws` library already in dependencies) for production deployment.

### Styling System

**Tailwind Configuration**: Custom design tokens extending base Tailwind:
- HSL-based color system for easy theme switching
- Custom border radii (9px, 6px, 3px)
- CSS custom properties for dynamic theming
- Elevation utilities for depth (hover-elevate, active-elevate-2)

**Component Library**: shadcn/ui components providing accessible, customizable UI primitives:
- All components in `client/src/components/ui/`
- Radix UI primitives as foundation
- Class-variance-authority for variant management

**Typography**: 
- UI: Inter or system-ui
- Code: JetBrains Mono or Fira Code
- Sizes: 12px (metadata), 14px (body/code), 24px (headings)

## External Dependencies

### Core UI Libraries
- **Monaco Editor** (`@monaco-editor/react`): VS Code's editor component
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theme

### State Management
- **Zustand**: Lightweight state management with persistence middleware
- **React Query** (`@tanstack/react-query`): Server state management (prepared for backend integration)

### Routing & Forms
- **Wouter**: Lightweight routing alternative to React Router
- **React Hook Form** (`react-hook-form` + `@hookform/resolvers`): Form state management

### Validation
- **Zod**: TypeScript-first schema validation
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod schemas

### Future Integrations (Dependencies Present)
- **PostgreSQL** via `pg`: Database driver (configured but not active)
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **WebSocket** (`ws`): Real-time communication (currently mocked)
- **Express Session**: Session management infrastructure ready for authentication

### Development Tools
- **Vite**: Build tool and dev server with HMR
- **TypeScript**: Type safety across frontend and backend
- **Replit-specific plugins**: Runtime error overlay, cartographer, dev banner

### Code Execution
- **Pyodide**: Python interpreter compiled to WebAssembly (loaded at runtime)
- Sandboxed JavaScript execution (native browser capabilities)