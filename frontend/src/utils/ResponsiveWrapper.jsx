import React from 'react';
import { useViewport } from './responsive';

/**
 * A component that conditionally renders content based on viewport size
 * 
 * @param {React.ReactNode} mobile - Content to render on mobile screens
 * @param {React.ReactNode} desktop - Content to render on desktop screens
 * @param {React.ReactNode} tablet - Optional content to render on tablet screens
 * @returns {React.ReactNode} - The appropriate content for the current viewport
 */
export const ResponsiveWrapper = ({ mobile, desktop, tablet }) => {
  const { isMobile, isTablet, isDesktop } = useViewport();
  
  if (isMobile) return mobile;
  if (isTablet && tablet) return tablet;
  return desktop;
};

/**
 * Renders content only on mobile devices
 */
export const MobileOnly = ({ children }) => {
  const { isMobile } = useViewport();
  return isMobile ? children : null;
};

/**
 * Renders content only on tablet devices
 */
export const TabletOnly = ({ children }) => {
  const { isTablet } = useViewport();
  return isTablet ? children : null;
};

/**
 * Renders content only on desktop devices
 */
export const DesktopOnly = ({ children }) => {
  const { isDesktop } = useViewport();
  return isDesktop ? children : null;
};

/**
 * Renders content on devices larger than mobile (tablets and desktops)
 */
export const NotMobile = ({ children }) => {
  const { isMobile } = useViewport();
  return !isMobile ? children : null;
};

/**
 * Renders content on devices smaller than desktop (mobile and tablets)
 */
export const NotDesktop = ({ children }) => {
  const { isDesktop } = useViewport();
  return !isDesktop ? children : null;
}; 