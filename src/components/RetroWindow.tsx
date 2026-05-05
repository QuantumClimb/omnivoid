'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  content: string;
}

interface RetroWindowProps {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  position?: { top: string; left: string };
  tabs?: Tab[];
}

export function RetroWindow({ 
  id, 
  title, 
  content, 
  isOpen, 
  onClose,
  position = { top: '50%', left: '50%' },
  tabs = []
}: RetroWindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ 
    top: position.top, 
    left: position.left 
  });
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);

  // Detect desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Set initial position based on desktop/mobile
  useEffect(() => {
    if (isDesktop) {
      setWindowPosition(position);
    } else {
      setWindowPosition({ top: '50%', left: '50%' });
    }
  }, [isDesktop, position]);

  // Reset active tab when window opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(0);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle mouse move for dragging
  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;

    // Constrain to viewport
    const maxX = window.innerWidth - (windowRef.current?.offsetWidth || 0);
    const maxY = window.innerHeight - (windowRef.current?.offsetHeight || 0);
    
    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));

    setWindowPosition({ 
      top: `${constrainedY}px`, 
      left: `${constrainedX}px` 
    });
  }, [isDragging, dragOffset]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDrag]);

  // Start dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (!windowRef.current) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    e.preventDefault();
  };

  // Close button hover states
  const [closeButtonHover, setCloseButtonHover] = useState(false);
  const [closeButtonActive, setCloseButtonActive] = useState(false);

  const getCloseButtonStyle = () => {
    if (closeButtonActive) {
      return { backgroundColor: '#336699', color: '#ffffff' };
    }
    if (closeButtonHover) {
      return { backgroundColor: '#99ccff', color: '#000000' };
    }
    return { backgroundColor: 'transparent', color: '#99ccff' };
  };

  // Get current content based on active tab
  const getCurrentContent = () => {
    if (tabs.length > 0 && activeTab < tabs.length) {
      return tabs[activeTab].content;
    }
    return content;
  };

  if (!isOpen) return null;

  const hasTabs = tabs.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[9998]"
            onClick={onClose}
          />

          {/* Window */}
          <motion.div
            ref={windowRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed z-[9999] flex flex-col"
            style={{
              top: isDragging ? windowPosition.top : position.top,
              left: isDragging ? windowPosition.left : position.left,
              transform: isDragging 
                ? 'none' 
                : isDesktop 
                  ? 'translate(-50%, -50%)' 
                  : 'translate(-50%, -50%)',
              width: isDesktop ? '520px' : '95vw',
              maxWidth: '90vw',
              height: isDesktop ? '400px' : '70vh',
              maxHeight: '80vh',
              backgroundColor: '#111111',
              border: '1px solid #99ccff',
              boxShadow: '0 0 20px rgba(153, 204, 255, 0.2), 4px 4px 8px rgba(0, 0, 0, 0.5)',
              fontFamily: "'Space Mono', monospace",
              fontSize: isDesktop ? '12px' : '14px',
              color: '#FFFFFF',
              opacity: 1,
            }}
          >
            {/* Title Bar */}
            <div
              onMouseDown={handleDragStart}
              className="flex items-center justify-between px-2 py-1 cursor-move select-none"
              style={{
                height: '32px',
                background: 'linear-gradient(90deg, #000000 0%, #333333 100%)',
                borderBottom: '1px solid #333333',
              }}
            >
              <span
                className="flex-1 pl-1 font-bold text-white"
                style={{
                  fontSize: '14px',
                  textShadow: '0 0 5px rgba(255, 0, 0, 0.3)',
                }}
              >
                {title}
              </span>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                onMouseEnter={() => setCloseButtonHover(true)}
                onMouseLeave={() => {
                  setCloseButtonHover(false);
                  setCloseButtonActive(false);
                }}
                onMouseDown={() => setCloseButtonActive(true)}
                onMouseUp={() => setCloseButtonActive(false)}
                className="flex items-center justify-center font-bold transition-colors duration-200"
                style={{
                  width: '24px',
                  height: '24px',
                  fontSize: '16px',
                  border: '1px solid #99ccff',
                  ...getCloseButtonStyle(),
                }}
              >
                ×
              </button>
            </div>

            {/* Tabs (if any) */}
            {hasTabs && (
              <div
                className="flex border-b border-[#333333]"
                style={{
                  height: '32px',
                  backgroundColor: '#0a0a0a',
                }}
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(index)}
                    className={`px-4 font-bold transition-colors duration-200 ${
                      activeTab === index
                        ? 'bg-[#111111] text-[#99ccff] border-b-2 border-[#99ccff]'
                        : 'bg-[#0a0a0a] text-[#666666] hover:text-[#99ccff]'
                    }`}
                    style={{
                      flex: 1,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Window Body */}
            <div
              className="flex-1 overflow-auto p-4"
              style={{
                backgroundColor: '#000000',
                border: '1px solid #99ccff',
                margin: hasTabs ? '0px' : '1px',
                lineHeight: '1.4',
              }}
              dangerouslySetInnerHTML={{ __html: getCurrentContent() }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}