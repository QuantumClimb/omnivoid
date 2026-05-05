# OMNIVOID LABS

> **Experimental Sound & Visual Art Platform**  
> *Exploring the intersection of sound science, technology, and consciousness through immersive audio-visual experiences.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-OMNIVOID%20LABS-99ccff?style=for-the-badge&logo=github)](https://omnivoidlabs.com)
[![License](https://img.shields.io/badge/License-MIT-99ccff?style=for-the-badge)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-99ccff?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![WebGL](https://img.shields.io/badge/WebGL-2.0-99ccff?style=for-the-badge&logo=webgl)](https://www.khronos.org/webgl/)

---

## 🌟 Overview

OMNIVOID LABS is an immersive web platform that combines experimental sound art, visual effects, and interactive technology to create unique audio-visual experiences. The platform features real-time audio reactivity, particle systems, and a retro-futuristic interface that responds to user interaction and sound input.

### Key Features

- **🎵 Audio-Reactive Visuals**: Real-time audio analysis and visual response
- **🌌 Interactive Particle Systems**: Dynamic agent-based animations
- **🎨 Retro-Futuristic UI**: Nostalgic yet modern interface design
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🎪 Live Transmissions**: Integrated YouTube video player
- **📻 Radio Streaming**: Mixcloud integration with full widget support
- **📚 Research Papers**: Interactive document viewer
- **🎫 Event Management**: Live gig and workshop information
- **🔬 Lab Sessions**: Immersive hands-on experiences

---

## 🚀 Quick Start

### Prerequisites

- Modern web browser with WebGL support
- Node.js (v14 or higher) for development
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/QuantumClimb/omnivoid-labs.git
   cd omnivoid-labs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture

### Dual App Architecture

OMNIVOID LABS uses a **device-specific architecture** that automatically loads the appropriate app based on the user's device:

- **Desktop App** (`src/App.js`): Full-featured desktop experience
- **Mobile App** (`src/AppMobile.js`): Optimized mobile experience
- **Device Detection**: Automatic selection based on screen size and user agent

### Core Components

```
src/
├── App.js                   # Desktop application controller
├── AppMobile.js             # Mobile application controller
├── components/               # Reusable UI components
│   ├── AgentSystem.js       # Particle system and audio reactivity
│   ├── RetroWindow.js       # Window management system
│   ├── AudioPlayer.js       # Audio handling and visualization
│   ├── SolarSystem.js       # 3D solar system animation
│   ├── Starfield.js         # Background star field
│   └── ...                  # Additional visual components
├── controllers/              # Application logic controllers
│   ├── AudioManager.js      # Audio processing and analysis
│   ├── ThemeManager.js      # Color themes and randomization
│   └── AnimationController.js # Animation coordination
├── styles/                   # CSS styling
│   ├── theme.css            # Color themes and variables
│   ├── components.css       # Component-specific styles
│   ├── animations.css       # Animation keyframes
│   ├── controls.css         # Control panel styles
│   └── mobile.css           # Mobile responsiveness
└── utils/                    # Utility functions
    └── Agent.js             # Agent behavior algorithms
```

### Device Detection Logic

```javascript
// Automatic device detection in index.html
const isMobile = window.innerWidth < 768 || 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
  import('./src/AppMobile.js').then(module => new module.App());
} else {
  import('./src/App.js').then(module => new module.App());
}
```

### Architecture Benefits

- **🚀 Performance**: Only loads code needed for each device type
- **🔧 Maintainability**: Separate concerns for desktop vs mobile
- **🐛 Bug Prevention**: No more dual initialization conflicts
- **📱 Optimization**: Device-specific features and layouts
- **⚡ Loading Speed**: Faster initial load times
- **🎯 User Experience**: Tailored experience for each platform

### Key Technologies

- **WebGL 2.0**: Hardware-accelerated graphics
- **Web Audio API**: Real-time audio processing
- **Canvas 2D/3D**: Dynamic visual rendering
- **CSS3 Animations**: Smooth transitions and effects
- **ES6+ JavaScript**: Modern JavaScript features
- **Dynamic Imports**: Runtime module loading

### Recent Updates & Fixes

- **Button Persistence Fix**: Resolved duplicate button creation issues between desktop/mobile versions
- **Global Cleanup System**: Implemented comprehensive cleanup to prevent UI element conflicts
- **UI Color Improvements**: Updated dropdown menu active states to use very dark grey (#1c1c1c) instead of black
- **Component Cleanup**: Removed unused VectorGrid component and cleaned up imports
- **Favicon Optimization**: Simplified favicon setup to use only essential favicon.ico
- **Temporary Feature Hiding**: Disabled "LATEST RITUALS" and "REGISTER FOR WORKSHOP" buttons for debugging

---

## 🎨 Visual Features

### Interactive Elements

- **Agent System**: 120+ dynamic particles with audio-reactive behavior
- **Connection Networks**: Visual connections between agents based on audio input
- **Color Themes**: Dynamic color palettes with randomization
- **Particle Effects**: Starfield, solar system, and geometric animations
- **Retro Windows**: Nostalgic window management system

### Audio Integration

- **Real-time Analysis**: FFT-based audio frequency analysis
- **Visual Response**: Particles and colors react to audio input
- **Multiple Sources**: Microphone input and file playback support
- **Audio Worklets**: High-performance audio processing

---

## 📱 Mobile Optimization

### Responsive Design

- **Touch Controls**: Optimized for mobile interaction
- **Adaptive Layout**: Dynamic sizing for different screen sizes
- **Performance**: Optimized rendering for mobile devices
- **Gesture Support**: Touch gestures for navigation

### Mobile-Specific Features

- **Swipe Navigation**: Touch-based window switching
- **Mobile Menu**: Collapsible navigation system
- **Touch Feedback**: Visual feedback for touch interactions
- **Orientation Support**: Portrait and landscape modes

### Recent Mobile Improvements (v2.1.0)

- **Comprehensive Mobile Detection**: Enhanced device detection across all components
- **Performance Optimizations**: Reduced particle counts and animation complexity on mobile
- **Component-Specific Tuning**: 
  - AgentSystem: 100 agents (vs 120 desktop), smaller connection distances
  - ASCIITunnel: 25 characters (vs 50 desktop)
  - PolygonEcho: 5 polygons (vs 20 desktop), adjusted sizes and speeds
  - Starfield: 50 stars (vs 100 desktop)
  - SolarSystem: Slower animation speed for better performance
- **Responsive UI Elements**: Mobile-optimized button sizes, fonts, and spacing
- **Touch-Friendly Controls**: Larger touch targets and improved mobile interactions
- **Memory Management**: Better cleanup and resource management for mobile devices

---

## 🎪 Event Integration

### Live Events

- **Gig Information**: Real-time event updates
- **Ticket Integration**: Direct links to ticket platforms (Fanpit)
- **Artist Profiles**: Featured artist information
- **Venue Details**: Location and timing information

### Workshop Sessions

- **Registration System**: Integrated signup forms
- **Skill Levels**: Beginner to advanced workshops
- **Equipment**: Hardware synthesizer sessions
- **Community Building**: Collaborative learning experiences

---

## 🔧 Configuration

### Environment Variables

```bash
# Audio settings
AUDIO_SAMPLE_RATE=44100
AUDIO_BUFFER_SIZE=1024

# Visual settings
PARTICLE_COUNT=120
CONNECTION_DISTANCE=200

# Performance settings
TARGET_FPS=60
ENABLE_AUDIO_REACTIVITY=true
```

### Customization

- **Color Themes**: Modify `src/styles/theme.css`
- **Particle Behavior**: Edit `src/components/AgentSystem.js`
- **Audio Settings**: Configure `src/controllers/AudioManager.js`
- **UI Components**: Customize `src/components/RetroWindow.js`

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Configure Environment**
   - Set production environment variables
   - Configure custom domain (optional)

3. **Deploy**
   ```bash
   git push origin main
   ```

### Other Platforms

- **Netlify**: Drag and drop deployment
- **GitHub Pages**: Static site hosting
- **AWS S3**: Scalable cloud hosting
- **DigitalOcean**: VPS deployment

---

## 📊 Performance

### Optimization Features

- **WebGL Acceleration**: Hardware-accelerated rendering
- **Audio Worklets**: Non-blocking audio processing
- **Lazy Loading**: On-demand component loading
- **Efficient Algorithms**: Optimized particle systems
- **Memory Management**: Automatic cleanup and garbage collection

### Browser Support

- **Chrome**: 80+ (Full support)
- **Firefox**: 75+ (Full support)
- **Safari**: 13+ (Full support)
- **Edge**: 80+ (Full support)
- **Mobile**: iOS 13+, Android 8+

---

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and test**
4. **Commit changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open Pull Request**

### Code Style

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format
- **JSDoc**: Documentation standards

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Web Audio API**: Mozilla Developer Network
- **WebGL**: Khronos Group
- **Space Mono Font**: Google Fonts
- **Mixcloud**: Audio streaming platform
- **YouTube**: Video integration
- **Fanpit**: Event ticketing platform

---

## 📞 Contact

**OMNIVOID LABS**

- **Website**: [omnivoidlabs.com](https://omnivoidlabs.com)
- **Email**: contact@omnivoidlabs.com
- **Instagram**: [@omnivoidlabs](https://instagram.com/omnivoidlabs)
- **SoundCloud**: [OMNIVOID LABS](https://soundcloud.com/omnivoidlabs)
- **Mixcloud**: [OMNIVOID LABS](https://mixcloud.com/omnivoidlabs)

---

## 🔮 Roadmap

### Upcoming Features

- [ ] **VR/AR Support**: Immersive 3D experiences
- [ ] **AI Integration**: Machine learning audio analysis
- [ ] **Collaborative Mode**: Multi-user interactions
- [ ] **Plugin System**: Custom visual effects
- [ ] **Mobile App**: Native mobile application
- [ ] **API Integration**: Third-party service connections

### Version History

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Mobile optimization and responsive design
- **v1.2.0**: Audio reactivity and particle systems
- **v1.3.0**: Event integration and social features
- **v1.4.0**: Performance optimizations and bug fixes
- **v2.0.0**: **Major Architecture Update** - Separate desktop/mobile apps with device detection
- **v2.1.0**: **Mobile Optimization Update** - Enhanced mobile performance and UI improvements

---

<div align="center">

**Made with ❤️ by the OMNIVOID LABS Team**

*Exploring the infinite possibilities of sound and vision*

[![GitHub](https://img.shields.io/badge/GitHub-QuantumClimb-99ccff?style=for-the-badge&logo=github)](https://github.com/QuantumClimb)
[![Website](https://img.shields.io/badge/Website-omnivoidlabs.com-99ccff?style=for-the-badge)](https://omnivoidlabs.com)

</div>