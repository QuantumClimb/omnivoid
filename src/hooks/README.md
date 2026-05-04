# OMNIVOID React Adapter Layer

This directory contains React hooks and wrapper components that bridge the vanilla JavaScript OMNIVOID codebase with React applications. These adapters allow you to use OMNIVOID's audio, visual, and state management systems in a React-friendly way.

## Installation

The hooks are already part of the OMNIVOID project. Import them in your React components:

```jsx
import { 
  useAudioManager, 
  useThemeManager, 
  useAppState,
  StarfieldCanvas,
  RetroWindow 
} from './src/hooks/index.js';
```

## Available Hooks

### useAudioManager()

Provides access to the audio system with React state management.

```jsx
import { useAudioManager } from './src/hooks/index.js';

function AudioPlayer() {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
  } = useAudioManager();

  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={currentTime / duration || 0}
        onChange={(e) => seek(parseFloat(e.target.value) * duration)}
      />
      <span>{Math.floor(currentTime)} / {Math.floor(duration)}</span>
    </div>
  );
}
```

### useThemeManager()

Provides access to the theme/color system.

```jsx
import { useThemeManager } from './src/hooks/index.js';

function ThemeSwitcher() {
  const { currentTheme, colors, toggleTheme, randomizeColors } = useThemeManager();

  return (
    <div>
      <button onClick={toggleTheme}>
        Switch to {currentTheme === 'dark' ? 'light' : 'dark'} theme
      </button>
      <button onClick={randomizeColors}>
        Randomize Colors
      </button>
      <div style={{ backgroundColor: colors.background, color: colors.foreground }}>
        Current theme: {currentTheme}
      </div>
    </div>
  );
}
```

### useAppState()

Provides access to the centralized application state.

```jsx
import { useAppState } from './src/hooks/index.js';

function MenuToggle() {
  const { isMenuVisible, set } = useAppState();

  return (
    <button onClick={() => set('ui.isMenuVisible', !isMenuVisible)}>
      {isMenuVisible ? 'Close Menu' : 'Open Menu'}
    </button>
  );
}
```

### useWindowManager()

Manages multiple window components.

```jsx
import { useWindowManager, RetroWindow } from './src/hooks/index.js';

function WindowManager() {
  const { openWindow, closeWindow, isWindowOpen } = useWindowManager();

  return (
    <div>
      <button onClick={() => openWindow('conundrum', { title: 'Conundrum', content: '...' })}>
        Open Conundrum
      </button>
      
      {isWindowOpen('conundrum') && (
        <RetroWindow
          id="conundrum"
          title="Conundrum"
          content="<p>Window content here</p>"
          isVisible={isWindowOpen('conundrum')}
          onClose={() => closeWindow('conundrum')}
        />
      )}
    </div>
  );
}
```

## Canvas Components

Pre-configured React wrappers for visual components:

### StarfieldCanvas

```jsx
import { StarfieldCanvas } from './src/hooks/index.js';

function Background() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <StarfieldCanvas />
    </div>
  );
}
```

### ASCIITunnelCanvas

```jsx
import { ASCIITunnelCanvas } from './src/hooks/index.js';

function TunnelBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <ASCIITunnelCanvas />
    </div>
  );
}
```

### AgentSystemCanvas

```jsx
import { AgentSystemCanvas } from './src/hooks/index.js';

function AgentBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <AgentSystemCanvas />
    </div>
  );
}
```

### PolygonEchoCanvas

```jsx
import { PolygonEchoCanvas } from './src/hooks/index.js';

function EchoEffect() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <PolygonEchoCanvas />
    </div>
  );
}
```

## Generic CanvasComponent

For custom canvas components:

```jsx
import { CanvasComponent } from './src/hooks/index.js';
import { SolarSystem } from './src/components/SolarSystem.js';

function SolarSystemView() {
  return (
    <CanvasComponent
      createComponent={(props) => new SolarSystem()}
      componentProps={{}}
      canvasId="solar-system"
      canvasStyle={{ zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
```

## Window Components

### RetroWindow

```jsx
import { RetroWindow } from './src/hooks/index.js';

function ConundrumWindow() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle Window</button>
      <RetroWindow
        id="conundrum"
        title="Conundrum"
        content="<p>Window content</p>"
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
}
```

### AsciiWindow

```jsx
import { AsciiWindow } from './src/hooks/index.js';

function ASCIIVOIDWindow() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible(!isVisible)}>Open ASCIIVOID</button>
      <AsciiWindow
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
}
```

## Architecture Notes

### State Management

The React adapter layer connects to the existing `AppState` class:
- `AppState` is the single source of truth
- Hooks subscribe to state changes automatically
- Changes through hooks update the central state

### Component Lifecycle

Vanilla JS components follow a standard lifecycle:
- `mount(container)` - Attach to DOM
- `update(props)` - Update with new props
- `unmount()` - Clean up and detach
- `destroy()` - Release resources

React wrappers handle this lifecycle automatically.

### Audio System

The `AudioManager` is a singleton:
- Hooks connect to the existing singleton
- Multiple components can share the same audio state
- Visualization data is available through the hook

## Best Practices

1. **Always clean up**: The hooks handle cleanup automatically, but if you access managers directly, ensure proper cleanup.

2. **Use hooks for state**: Prefer `useAppState` over direct state access for React components.

3. **Lazy load components**: Canvas components are heavy; consider lazy loading them.

4. **Avoid multiple audio managers**: Use the provided hooks which connect to the singleton.

5. **Handle initialization**: Audio and theme managers may not be immediately available; check `isInitialized`.

## Migration Guide

To migrate existing vanilla JS code to React:

1. Replace direct manager access with hooks
2. Replace component instantiation with wrapper components
3. Use `useAppState` for shared state
4. Let React handle lifecycle instead of manual management

```javascript
// Before (vanilla JS)
const audioManager = AudioManager.getInstance();
audioManager.play();

// After (React)
const { play } = useAudioManager();
play();
```

## License

Same as OMNIVOID project license.