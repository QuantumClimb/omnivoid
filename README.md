# Bruno

A web-based visual effects application with audio reactivity.

## Features

- 3D Starfield effect
- Vector Grid with moving cyan crosses
- ASCII Tunnel effect with animated text
- Solar System visualization
- Agent-based particle system
- Audio visualization with FFT analysis
- Modern audio player interface
- Theme switching support
- Customizable animation controls

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Onomatix/bruno.git
cd bruno
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

## Controls

- **Theme Controls**: Switch between light and dark themes
- **Animation Presets**: Apply different animation effects to components
- **Grid Controls**: Adjust grid size and cube animation speed
- **Solar System Controls**: Control orbit speeds
- **Agent Controls**: Modify agent count and connection distances
- **Layer Visibility**: Toggle visibility and opacity of different visual layers
- **Audio Controls**: Standard playback controls with progress bar and volume

## Technical Details

- Pure JavaScript implementation
- Modern Web Audio API with AudioWorklet
- Optimized rendering with requestAnimationFrame
- Component-based architecture
- Real-time FFT analysis for audio visualization

## License

MIT License

## Author

Onomatix (juncando@gmail.com) 