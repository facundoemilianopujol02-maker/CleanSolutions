import { useState, useEffect } from 'react';

const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width <= breakpoints.mobile;
  const isTablet = windowSize.width > breakpoints.mobile && windowSize.width <= breakpoints.tablet;
  const isDesktop = windowSize.width > breakpoints.tablet && windowSize.width <= breakpoints.desktop;
  const isLargeDesktop = windowSize.width > breakpoints.desktop;

  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    return 4;
  };

  const getCardSize = () => {
    if (isMobile) return '100%';
    if (isTablet) return 'calc(50% - 10px)';
    if (isDesktop) return 'calc(33.333% - 14px)';
    return 'calc(25% - 15px)';
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    getGridColumns,
    getCardSize,
    breakpoints,
    width: windowSize.width,
    height: windowSize.height
  };
};