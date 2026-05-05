'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DeviceInfo, Breakpoint, UseResponsiveReturn } from '@/types';

interface UseResponsiveOptions {
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

const defaultBreakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

/**
 * Custom hook for responsive design detection
 * Provides unified mobile/desktop detection with TypeScript types
 */
export function useResponsive(options: UseResponsiveOptions = {}): UseResponsiveReturn {
  const breakpoints = options.breakpoints ?? defaultBreakpoints;

  const getDeviceInfo = useCallback((): DeviceInfo => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        screenWidth: 0,
        screenHeight: 0,
        pixelRatio: 1,
        touchEnabled: false,
        maxTouchPoints: 0,
      };
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    // Detect device type based on screen width
    const isMobile = screenWidth < breakpoints.tablet;
    const isTablet = screenWidth >= breakpoints.tablet && screenWidth < breakpoints.desktop;
    const isDesktop = screenWidth >= breakpoints.desktop;

    return {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth,
      screenHeight,
      pixelRatio,
      touchEnabled,
      maxTouchPoints,
    };
  }, [breakpoints.tablet, breakpoints.desktop]);

  const [device, setDevice] = useState<DeviceInfo>(getDeviceInfo);

  const breakpoint: Breakpoint = device.isMobile
    ? 'mobile'
    : device.isTablet
    ? 'tablet'
    : 'desktop';

  useEffect(() => {
    // Set initial device info
    setDevice(getDeviceInfo());

    const handleResize = () => {
      setDevice(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getDeviceInfo]);

  return {
    device,
    breakpoint,
    isMobile: device.isMobile,
    isTablet: device.isTablet,
    isDesktop: device.isDesktop,
  };
}

/**
 * Simplified hook for just mobile detection
 */
export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

/**
 * Hook for getting screen dimensions
 */
export function useScreenSize() {
  const { device } = useResponsive();
  return {
    width: device.screenWidth,
    height: device.screenHeight,
  };
}

/**
 * Hook for touch device detection
 */
export function useIsTouchDevice(): boolean {
  const { device } = useResponsive();
  return device.touchEnabled;
}