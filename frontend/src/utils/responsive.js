import { useState, useEffect } from 'react';

// Custom hook to detect current viewport size
export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Return viewport dimensions and helper booleans
  return { 
    width, 
    height, 
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024 
  };
};

// Breakpoint constants
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Media query helper (for use in styled components if needed)
export const mediaQuery = (key) => {
  return `@media (min-width: ${BREAKPOINTS[key]}px)`;
}; 