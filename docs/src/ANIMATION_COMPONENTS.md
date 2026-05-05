# Animation Components - Backend Maintainability Guide

This document describes the TypeScript-converted animation components that are designed for backend maintainability.

## Overview

Two core animation components have been converted to TypeScript with built-in configuration interfaces for backend control:

1. **AgentSystem** - Particle system with connecting lines
2. **AsciiWindow** - Draggable iframe window for ASCIIVOID

## Component Architecture

### Base Classes

- `Base.ts` - Base `Component` class with common lifecycle methods
- `Agent.ts` - Agent particle class used by AgentSystem

### Main Components

#### 1. AgentSystem (`AgentSystem.ts`)

A singleton particle system that creates a network of agents (dots) connected by lines when they're within a certain distance.

**Configuration Interface:**
```typescript
interface AgentSystemConfig {
  agentCount: number;      // Number of particles (20-120)
  connectDistance: number; // Connection range (100-300)
  baseSize: number;        // Base particle size
  maxSize: number;         // Maximum particle size
}
```

**Backend Control Methods:**
```typescript
// Get current configuration
const config = agentSystem.getConfig();

// Update configuration from backend
agentSystem.setConfig({
  agentCount: 80,
  connectDistance: 150
});
```

**Usage Example:**
```typescript
import { AgentSystem, AgentSystemConfig } from './components/AgentSystem.js';

// Get singleton instance
const agentSystem = AgentSystem.getInstance();

// Configure from backend data
fetch('/api/animation-config')
  .then(res => res.json())
  .then((config: Partial<AgentSystemConfig>) => {
    agentSystem.setConfig(config);
  });
```

#### 2. AsciiWindow (`AsciiWindow.ts`)

A draggable, styled iframe window for embedding external content (ASCIIVOID).

**Configuration Interface:**
```typescript
interface AsciiWindowConfig {
  title: string;  // Window title
  url: string;    // iframe source URL
}
```

**Backend Control Methods:**
```typescript
// Get current configuration
const config = asciiWindow.getConfig();

// Update configuration from backend
asciiWindow.setConfig({
  title: 'New Title',
  url: 'https://new-url.example.com'
});
```

**Usage Example:**
```typescript
import { AsciiWindow, AsciiWindowConfig } from './components/AsciiWindow.js';

// Create window with backend config
fetch('/api/window-config')
  .then(res => res.json())
  .then((config: AsciiWindowConfig) => {
    const window = new AsciiWindow(
      config.id,
      config.title,
      config.url,
      (id) => console.log(`Window ${id} closed`)
    );
    window.show();
  });
```

## Backend API Integration

### Recommended API Endpoints

```typescript
// GET /api/animation-config
// Returns current animation configuration
{
  "agentSystem": {
    "agentCount": 100,
    "connectDistance": 200,
    "baseSize": 2,
    "maxSize": 12
  },
  "asciiWindow": {
    "title": "ASCIIVOID",
    "url": "https://asciivoid.pages.dev/"
  }
}

// POST /api/animation-config
// Updates animation configuration
// Body: Same structure as GET response
```

### Database Schema (Prisma)

```prisma
model AnimationConfig {
  id                String   @id @default(uuid())
  agentCount        Int      @default(100)
  connectDistance   Int      @default(200)
  baseSize          Int      @default(2)
  maxSize           Int      @default(12)
  asciiWindowTitle String   @default("ASCIIVOID")
  asciiWindowUrl   String   @default("https://asciivoid.pages.dev/")
  updatedAt         DateTime @updatedAt
}
```

## TypeScript Benefits

### Type Safety
- All configuration properties are strongly typed
- IDE autocompletion for configuration options
- Compile-time error checking prevents invalid configurations

### Interfaces
- Clear contracts for backend-frontend communication
- Easy to generate API documentation from types
- Simplifies testing with mock configurations

### Maintainability
- Self-documenting code with TypeScript interfaces
- Easier refactoring with type checking
- Better error messages during development

## Migration Notes

The following experimental components were removed as they were causing memory issues:
- ASCIITunnel
- SolarSystem
- PolygonEcho
- Starfield

Only AgentSystem and AsciiWindow remain as the production animation components.

## File Structure

```
src/
├── components/
│   ├── Base.ts              # Base component class
│   ├── AgentSystem.ts       # Particle system component
│   ├── AsciiWindow.ts       # iframe window component
│   └── ANIMATION_COMPONENTS.md  # This documentation
├── utils/
│   └── Agent.ts             # Agent particle class
└── hooks/
    └── CanvasComponent.js   # React wrapper for AgentSystem
```

## Performance Considerations

### AgentSystem
- Mobile devices: 100 agents, 60px connection distance
- Desktop: 120 agents, 200px connection distance
- Automatic mobile detection and optimization

### AsciiWindow
- Lazy-loaded iframe content
- Efficient drag handling with viewport constraints
- Proper cleanup on destroy

## Error Handling

Both components include proper error handling:
- Canvas context validation
- iframe load error handling
- Graceful degradation on failures