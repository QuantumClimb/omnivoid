import React, { useEffect, useRef, useCallback } from 'react';
import { AgentSystem } from '../components/AgentSystem.js';

/**
 * React wrapper component for vanilla JS canvas-based visual components
 * Handles mounting, updating, and unmounting of canvas components
 * 
 * @param {Object} props
 * @param {Function} props.createComponent - Function that creates the component instance
 * @param {Object} props.componentProps - Props to pass to the component
 * @param {string} props.canvasId - ID for the canvas element
 * @param {Object} props.canvasStyle - CSS styles for the canvas
 * @param {Function} props.onMount - Callback when component is mounted
 * @param {Function} props.onUpdate - Callback when component is updated
 * @param {Function} props.onUnmount - Callback when component is unmounted
 */
export function CanvasComponent({
  createComponent,
  componentProps = {},
  canvasId,
  canvasStyle = {},
  onMount,
  onUpdate,
  onUnmount,
}) {
  const containerRef = useRef(null);
  const componentRef = useRef(null);
  const canvasRef = useRef(null);

  // Mount component
  useEffect(() => {
    let isMounted = true;

    const mount = async () => {
      try {
        // Create canvas if not provided
        if (!canvasRef.current) {
          const canvas = document.createElement('canvas');
          canvas.id = canvasId || `canvas-${Date.now()}`;
          Object.assign(canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            ...canvasStyle,
          });
          canvasRef.current = canvas;
        }

        // Append canvas to container
        if (containerRef.current && canvasRef.current) {
          containerRef.current.appendChild(canvasRef.current);
        }

        // Create component instance
        const component = createComponent(componentProps);
        componentRef.current = component;

        // Call mount if available
        if (component.mount && containerRef.current) {
          component.mount(containerRef.current);
        }

        if (isMounted && onMount) {
          onMount(component);
        }
      } catch (error) {
        console.error('CanvasComponent mount error:', error);
      }
    };

    mount();

    return () => {
      isMounted = false;
      
      // Unmount component
      if (componentRef.current) {
        if (componentRef.current.unmount) {
          componentRef.current.unmount();
        } else if (componentRef.current.destroy) {
          componentRef.current.destroy();
        }
        
        if (onUnmount) {
          onUnmount(componentRef.current);
        }
        
        componentRef.current = null;
      }

      // Remove canvas
      if (canvasRef.current?.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [createComponent, canvasId, canvasStyle, onMount, onUnmount]);

  // Update component when props change
  useEffect(() => {
    if (componentRef.current && componentRef.current.update) {
      componentRef.current.update(componentProps);
      if (onUpdate) {
        onUpdate(componentRef.current);
      }
    }
  }, [componentProps, onUpdate]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (canvasRef.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
      }
    }
  }, []);

  // Set up resize observer
  useEffect(() => {
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [handleResize]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    />
  );
}

/**
 * Pre-configured canvas components for common visual elements
 */

// AgentSystem component
export function AgentSystemCanvas(props) {
  return (
    <CanvasComponent
      createComponent={() => {
        return AgentSystem.getInstance();
      }}
      componentProps={props}
      canvasId="agents"
      canvasStyle={{ zIndex: 1, pointerEvents: 'none' }}
    />
  );
}