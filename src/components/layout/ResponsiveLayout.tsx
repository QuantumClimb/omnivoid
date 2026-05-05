'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Unified responsive layout component
 * Replaces separate mobile/desktop versions with a single responsive component
 */
export function ResponsiveLayout({ children, className = '' }: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

  return (
    <div
      className={`responsive-layout ${className}`}
      data-breakpoint={breakpoint}
      data-mobile={isMobile}
      data-tablet={isTablet}
      data-desktop={isDesktop}
    >
      {children}
    </div>
  );
}

// ============================================
// Responsive Header Component
// ============================================

interface HeaderProps {
  title: string;
  navigation?: Array<{ label: string; href: string }>;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function Header({ title, navigation = [], onMenuToggle, isMenuOpen = false }: HeaderProps) {
  const { isMobile } = useResponsive();

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold tracking-wider text-primary"
        >
          {title}
        </motion.h1>

        {/* Desktop Navigation */}
        {!isMobile && navigation.length > 0 && (
          <nav className="flex gap-6">
            {navigation.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                whileHover={{ scale: 1.1, color: '#ffffff' }}
                className="text-sm tracking-wider text-primary hover:text-white transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && onMenuToggle && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMenuToggle}
            className="text-2xl text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </motion.button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-border"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-3 text-primary hover:bg-primary/10 transition-colors"
                onClick={onMenuToggle}
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ============================================
// Responsive Footer Component
// ============================================

interface FooterProps {
  copyright?: string;
  poweredBy?: { label: string; url: string; logo?: string };
}

export function Footer({ 
  copyright = '© 2025 OMNIVOID LABS', 
  poweredBy 
}: FooterProps) {
  const { isMobile } = useResponsive();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-background/90 backdrop-blur-md border-t border-border"
    >
      <div className={`flex ${isMobile ? 'flex-col items-center gap-1' : 'justify-between items-center'}`}>
        <span className="text-xs text-primary/60 font-mono">
          {copyright}
        </span>
        
        {poweredBy && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary/60">Powered by</span>
            <motion.a
              href={poweredBy.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1"
            >
              {poweredBy.logo ? (
                <img src={poweredBy.logo} alt={poweredBy.label} className="w-8 h-8" />
              ) : (
                <span className="text-xs text-primary">{poweredBy.label}</span>
              )}
            </motion.a>
          </div>
        )}
      </div>
    </motion.footer>
  );
}

// ============================================
// Responsive Controls Component
// ============================================

interface ControlButton {
  id: string;
  icon: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

interface ControlsProps {
  buttons: ControlButton[];
  position?: 'bottom' | 'top' | 'left' | 'right';
}

export function Controls({ buttons, position = 'bottom' }: ControlsProps) {
  const { isMobile } = useResponsive();

  const positionClasses = {
    bottom: 'bottom-6 left-1/2 -translate-x-1/2',
    top: 'top-20 left-1/2 -translate-x-1/2',
    left: 'left-6 top-1/2 -translate-y-1/2 flex-col',
    right: 'right-6 top-1/2 -translate-y-1/2 flex-col',
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`fixed z-50 flex gap-3 bg-background/90 backdrop-blur-md border border-border rounded-full px-4 py-3 shadow-glow ${positionClasses[position]} ${isMobile ? 'max-w-[95vw]' : ''}`}
    >
      {buttons.map((button) => (
        <motion.button
          key={button.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={button.onClick}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-lg transition-all duration-200 ${
            button.isActive
              ? 'bg-primary text-background'
              : 'bg-transparent border border-primary text-primary'
          }`}
          title={button.label}
          aria-label={button.label}
        >
          {button.icon}
        </motion.button>
      ))}
    </motion.div>
  );
}

// ============================================
// Responsive Grid Component
// ============================================

interface GridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}

export function Grid({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className = '' 
}: GridProps) {
  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns.mobile}, minmax(0, 1fr))`,
        gap: `${gap * 0.25}rem`,
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            grid-template-columns: repeat(${columns.tablet}, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: repeat(${columns.desktop}, minmax(0, 1fr));
          }
        }
      `}</style>
      {children}
    </div>
  );
}

// ============================================
// Responsive Modal Component
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export function Modal({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) {
  const { isMobile } = useResponsive();

  const sizeClasses = {
    small: isMobile ? 'w-[95vw] h-[50vh]' : 'w-96 h-auto',
    medium: isMobile ? 'w-[95vw] h-[70vh]' : 'w-[600px] h-auto',
    large: isMobile ? 'w-[95vw] h-[85vh]' : 'w-[800px] h-auto',
    full: 'w-[95vw] h-[90vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[1000]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] bg-background border border-border rounded-lg shadow-glow-strong ${sizeClasses[size]}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-primary">{title}</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-primary hover:text-white transition-colors text-xl"
                aria-label="Close modal"
              >
                ✕
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(100%-60px)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}