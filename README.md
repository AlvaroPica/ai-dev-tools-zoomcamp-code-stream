# CodeCollab - Real-Time Collaborative Coding Interview Platform

A real-time collaborative coding interview platform built with React + Vite, featuring live code execution for JavaScript and Python.

## Features

- **Real-Time Collaboration**: Code together with live cursors and instant synchronization
- **Multi-Language Support**: JavaScript and Python with syntax highlighting
- **In-Browser Execution**: Run JavaScript in a safe sandbox and Python via Pyodide (WASM)
- **Professional UI**: Clean, VS Code-inspired interface with dark/light mode
- **Session Management**: Create and share coding sessions via unique IDs

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Editor**: Monaco Editor (VS Code's editor)
- **State Management**: Zustand
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: Wouter
- **Mock Backend**: In-memory storage with simulated WebSocket connections
- **Testing**: Vitest, React Testing Library

## Project Structure

```
├── client/
│   ├── Dockerfile          # Docker configuration (Dev, Test, Prod)
│   ├── nginx.conf          # Nginx configuration for Docker
│   ├── test/               # Frontend tests
│   └── src/
│       ├── api/            # Mock API client
│       │   └── mockClient.ts
│       ├── components/     # React components
│       │   ├── CodeEditor.tsx
│       │   ├── OutputPanel.tsx
│       │   ├── SessionHeader.tsx
│       │   └── ...
│       ├── pages/          # Page components
│       │   ├── home.tsx
│       │   └── session.tsx
│       ├── store/          # Zustand stores
│       │   ├── sessionStore.ts
│       │   └── themeStore.ts
│       └── ws/             # WebSocket client
│           └── socketClient.ts
├── shared/
│   └── schema.ts           # TypeScript types and Zod schemas
├── server/                 # Express backend
└── openapi.yaml            # OpenAPI 3.0 specification
```

## Docker Support (Frontend)

The `client/Dockerfile` supports multiple stages for Development, Testing, and Production.

### 1. Production Preview
Build and run the optimized production build (Nginx):

```bash
# Build the production image (default target)
docker build -f client/Dockerfile -t codecollab-frontend .

# Run the container (access at http://localhost:5173)
docker run -p 5173:80 codecollab-frontend
```

### 2. Local Development
Run the development server with live reloading using Docker volumes:

```bash
# Build the dev image
docker build -f client/Dockerfile --target dev -t codecollab-frontend-dev .

# Run with volume mapping (PowerShell)
# Note: We add -v /app/node_modules to use the container's installed dependencies
# instead of the host's (which might be missing or incompatible)
docker run -p 5173:5173 -v ${PWD}:/app -v /app/node_modules codecollab-frontend-dev

# Run with volume mapping (Bash)
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules codecollab-frontend-dev
```
Access at http://localhost:5173

### 3. Running Tests
Run the test suite inside the container:

```bash
# Build the test image
docker build -f client/Dockerfile --target test -t codecollab-frontend-test .

# Run tests
docker run codecollab-frontend-test
```

## API Specification

See `openapi.yaml` for the complete API specification, including:

- `GET /api/session/create` - Create a new coding session
- `GET /api/session/{id}` - Get session details
- `POST /api/session/{id}/execute` - Execute code
- `WebSocket /api/session/{id}/ws` - Real-time collaboration

## Development (Local without Docker)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
```
