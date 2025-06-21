# Omnivoid

A mobile-first, interactive visual experience with audio reactivity. Evolved from OMNIVOID, now optimized for modern web and mobile devices.

## Features

### Core Experience (Always Visible)
- Agent-based particle system with audio reactivity
- Dynamic SVG logo with audio-responsive scaling
- 3D Starfield background with toggle control
- Floating orbital menu labels
- Minimal mobile controls (Play, Pause, Starfield Toggle, Volume)

### Advanced Layers (Toggleable)
- Vector Grid with moving cyan crosses
- ASCII Tunnel effect with animated text
- Solar System visualization
- 3D Cylinder with customizable parameters
- Advanced audio visualization with FFT analysis

## Mobile-First Design

**Default Mode**: Clean, minimal interface showing only essential elements
- AgentSystem particles responding to audio
- Omnivoid SVG logo with audio reactivity
- 3D Starfield background (toggleable)
- Floating navigation labels
- Basic audio controls with starfield toggle

**Advanced Mode**: Full feature access via "ADVANCED" toggle
- All visual layers available
- Complete control panel
- Advanced audio visualization options

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Onomatix/omnivoid.git
cd omnivoid
```

2. Start a local server:
```bash
# Using Python 3
python -m http.server 8000
```

3. Open in browser:
```
http://localhost:8000/index.html
```

## Usage Modes

### Mobile/Default Mode
- Automatically detected for screens < 768px width
- Desktop users see minimal mode by default
- Toggle to "ADVANCED" for full controls

### Advanced Mode
- Access via "ADVANCED" toggle button in top-right corner
- Full OMNIVOID experience with all controls and visual layers
- Available on both mobile and desktop

## Controls

### Default Mode
- **Play/Pause**: Central audio control
- **Volume**: Slider control
- **Starfield Toggle**: Show/hide 3D starfield background
- **Advanced Toggle**: Switch to full feature mode
- **Floating Labels**: Navigation elements (Conundrum, Releases, Radio, etc.)

### Advanced Mode
- **Theme Controls**: Switch between light and dark themes
- **Animation Presets**: Apply different animation effects to components
- **Grid Controls**: Adjust grid size and cube animation speed
- **Solar System Controls**: Control orbit speeds
- **Agent Controls**: Modify agent count and connection distances
- **Layer Visibility**: Toggle visibility and opacity of different visual layers
- **Audio Controls**: Standard playback controls with progress bar and volume

## Technical Details

- Pure JavaScript implementation with mobile-first architecture
- Modern Web Audio API with AudioWorklet
- Responsive design with CSS Grid and Flexbox
- Component-based architecture with visibility management
- Real-time FFT analysis for audio visualization
- Orbitron font integration for sci-fi aesthetic
- CSS backdrop-filter for modern UI effects

## Project Evolution

Originally "OMNIVOID", now rebranded as "Omnivoid" with:
- Mobile-first responsive design
- Minimal default layout
- Advanced mode toggle
- Enhanced typography with Orbitron
- Improved user experience flow

## License

MIT License

## Author

Onomatix (juncando@gmail.com) 