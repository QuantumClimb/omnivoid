/**
 * OMNIVOID LABS - Core Type Definitions
 * TypeScript interfaces and types for the application
 */

// ============================================
// Device & Responsive Types
// ============================================

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  touchEnabled: boolean;
  maxTouchPoints: number;
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// ============================================
// Theme Types
// ============================================

export type ThemeName = 'dark' | 'random';

export interface ColorPalette {
  accent1: string;
  accent2: string;
  accent3: string;
  accent4?: string;
  accent5?: string;
}

export interface ThemeConfig {
  name: ThemeName;
  palette: ColorPalette;
  strategy?: string;
}

export interface ThemeManagerState {
  currentTheme: ThemeName;
  currentPalette: ColorPalette;
  currentStrategy: string;
}

// ============================================
// Audio Types
// ============================================

export interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrack: string | null;
  currentTime: number;
  duration: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  src: string;
  duration?: number;
}

export interface MixcloudShow {
  title: string;
  url: string;
  description?: string;
}

// ============================================
// Visual Component Types
// ============================================

export interface VisualComponent {
  id: string;
  name: string;
  isVisible: boolean;
  isEnabled: boolean;
}

export interface StarfieldConfig extends VisualComponent {
  starCount: number;
  speed: number;
  twinkleSpeed: number;
}

export interface ASCIITunnelConfig extends VisualComponent {
  speed: number;
  density: number;
  characters: string;
}

export interface SolarSystemConfig extends VisualComponent {
  speed: number;
  scale: number;
  showOrbits: boolean;
}

export interface PolygonEchoConfig extends VisualComponent {
  sides: number;
  rotationSpeed: number;
  scale: number;
}

export interface AgentSystemConfig extends VisualComponent {
  agentCount: number;
  speed: number;
  trailLength: number;
}

// ============================================
// Content Types
// ============================================

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  thumbnail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GalleryItem extends ContentItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface GigItem extends ContentItem {
  type: 'gig';
  date: Date;
  venue: string;
  location: string;
  ticketUrl?: string;
}

export interface ResearchPaper extends ContentItem {
  type: 'paper';
  authors: string[];
  abstract: string;
  pdfUrl: string;
  publishedDate: Date;
}

// ============================================
// UI State Types
// ============================================

export interface UIState {
  isMenuVisible: boolean;
  activeModal: string | null;
  showDebug: boolean;
  showControls: boolean;
  isLoading: boolean;
  splashVisible: boolean;
}

// ============================================
// Window/Modal Types
// ============================================

export interface WindowConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  isClosable: boolean;
  isDraggable: boolean;
}

// ============================================
// App State Types
// ============================================

export interface AppState {
  // Device
  device: DeviceInfo;
  
  // Theme
  theme: ThemeConfig;
  
  // Audio
  audio: AudioState;
  
  // Visual components
  visuals: {
    starfield: StarfieldConfig;
    asciiTunnel: ASCIITunnelConfig;
    solarSystem: SolarSystemConfig;
    polygonEcho: PolygonEchoConfig;
    agentSystem: AgentSystemConfig;
  };
  
  // Content
  content: {
    gallery: GalleryItem[];
    gigs: GigItem[];
    papers: ResearchPaper[];
    mixcloudShows: MixcloudShow[];
  };
  
  // UI
  ui: UIState;
}

// ============================================
// Event Types
// ============================================

export interface AppEvent {
  type: string;
  payload?: unknown;
  timestamp: Date;
}

export type EventCallback = (event: AppEvent) => void;

// ============================================
// Component Props Types
// ============================================

export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface CanvasComponentProps extends BaseComponentProps {
  width: number;
  height: number;
  config: VisualComponent;
}

export interface ButtonProps extends BaseComponentProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// ============================================
// Hook Types
// ============================================

export interface UseAudioManagerReturn {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export interface UseThemeManagerReturn {
  currentTheme: ThemeName;
  currentPalette: ColorPalette;
  currentStrategy: string;
  cycleTheme: () => void;
  setTheme: (theme: ThemeName) => void;
  forceNewRandomTheme: () => void;
}

export interface UseResponsiveReturn {
  device: DeviceInfo;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// ============================================
// Utility Types
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction = () => Promise<void>;

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Dimensions extends Position, Size {}