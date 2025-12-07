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

## Project Structure

```
├── client/
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

## Running on Replit

1. Click the **Run** button to start the application
2. The app will be available at the provided URL
3. Click "Create New Session" to start a coding session

## API Specification

See `openapi.yaml` for the complete API specification, including:

- `GET /api/session/create` - Create a new coding session
- `GET /api/session/{id}` - Get session details
- `POST /api/session/{id}/execute` - Execute code
- `WebSocket /api/session/{id}/ws` - Real-time collaboration

### WebSocket Message Types

- `code_update` - Code changes from participants
- `cursor_update` - Cursor position updates
- `participant_join` - New participant joined
- `participant_leave` - Participant left
- `execution_result` - Code execution results

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Future Integration

This frontend is designed to connect to a FastAPI backend. Replace the mock implementations in:

- `client/src/api/mockClient.ts` with real API calls
- `client/src/ws/socketClient.ts` with a real WebSocket connection

The OpenAPI specification in `openapi.yaml` documents the expected API contract.
