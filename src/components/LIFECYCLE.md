# Component Lifecycle Standard

Phase 4 standardizes components around a React-adapter-friendly API:

- `constructor(props = {})`: synchronous setup only
- `mount(container = document.body)`: attach or mark ownership of DOM resources
- `update(props = {})`: merge new props and refresh component-owned state
- `unmount()`: release resources and detach DOM
- `destroy()`: component-specific cleanup implementation

## Current Compatibility Rule

Existing components may still create DOM in constructors during the transition. `mount()` exists as the target API for new code and future React adapters, but old call sites should not be broken just to satisfy the new shape.

## Resource Ownership

Components that create any of the following must clean them up in `destroy()`:

- DOM elements appended to `document.body`
- `requestAnimationFrame` handles
- `setInterval` or `setTimeout` handles
- Global event listeners
- Canvas contexts or media resources

## React Adapter Direction

React wrappers should instantiate the component in an effect, call `mount(ref.current || document.body)`, call `update()` when props change, and call `unmount()` in cleanup.
