# App State Boundary

Phase 3 centralizes serializable application state in `AppState` while leaving browser-owned resources in the imperative layer.

## Stored in AppState

- Device state: `device.isMobile`
- UI state: `ui.isMenuVisible`, `ui.activeBackground`, `ui.showDebug`
- Desktop music state: `music.files`, `music.currentIndex`, `music.isPlaying`
- Mixcloud state: `mixcloud.shows`, `mixcloud.currentIndex`, `mixcloud.eventsReceived`
- Loaded content state: `content.researchPapers`, `content.conundrum`, `content.contact`

## Deliberately Not Stored in AppState

- DOM nodes: buttons, menus, popups, tooltips, containers
- Media objects: `Audio`, iframe sources, Web Audio nodes
- Component/controller instances: visual layers, managers, windows
- Timers and animation handles
- Canvas contexts and rendered canvas objects

These objects need lifecycle ownership, not serialization. They should be handled by Phase 4 lifecycle methods or later React adapter hooks.

## Compatibility Layer

`AppState.bindProperties()` lets legacy fields proxy state paths. This keeps existing code stable while creating a React-readable state surface.
