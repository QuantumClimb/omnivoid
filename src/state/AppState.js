/**
 * Centralized serializable application state.
 *
 * This intentionally excludes DOM nodes, canvas contexts, media elements,
 * Web Audio objects, and component/controller instances. Those remain owned by
 * the imperative app layer until they can be wrapped or converted safely.
 */
export class AppState {
  constructor(initialState = {}) {
    this.listeners = new Set();
    const defaults = {
      device: {
        isMobile: false,
      },
      ui: {
        isMenuVisible: false,
        activeBackground: 'starfield',
        showDebug: false,
      },
      music: {
        files: [],
        currentIndex: 0,
        isPlaying: false,
      },
      mixcloud: {
        shows: [],
        currentIndex: 0,
        eventsReceived: false,
      },
      content: {
        researchPapers: [],
        conundrum: null,
        contact: null,
      },
    };
    this.data = this.merge(defaults, initialState);
  }

  getSnapshot() {
    return JSON.parse(JSON.stringify(this.data));
  }

  get(path) {
    return this.resolvePath(path).value;
  }

  set(path, value) {
    const target = this.resolvePath(path, true);
    target.parent[target.key] = value;
    this.emit(path, value);
    return value;
  }

  update(path, updater) {
    const currentValue = this.get(path);
    return this.set(path, updater(currentValue));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  bindProperty(target, propertyName, path) {
    Object.defineProperty(target, propertyName, {
      configurable: true,
      enumerable: true,
      get: () => this.get(path),
      set: (value) => {
        this.set(path, value);
      },
    });
  }

  bindProperties(target, propertyMap) {
    for (const [propertyName, path] of Object.entries(propertyMap)) {
      this.bindProperty(target, propertyName, path);
    }
  }

  emit(path, value) {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener({ path, value, state: snapshot });
    }
  }

  resolvePath(path, createMissing = false) {
    const parts = Array.isArray(path) ? path : path.split('.');
    const key = parts[parts.length - 1];
    let parent = this.data;

    for (const part of parts.slice(0, -1)) {
      if (!Object.prototype.hasOwnProperty.call(parent, part)) {
        if (!createMissing) {
          return { parent: null, key, value: undefined };
        }
        parent[part] = {};
      }
      parent = parent[part];
    }

    return { parent, key, value: parent?.[key] };
  }

  merge(target, source) {
    const output = { ...target };

    for (const [key, value] of Object.entries(source)) {
      if (this.isPlainObject(value) && this.isPlainObject(output[key])) {
        output[key] = this.merge(output[key], value);
      } else {
        output[key] = value;
      }
    }

    return output;
  }

  isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }
}
