import React, { createContext, useState, useEffect } from 'react';
import { THEMES, THEME_ICONS, THEME_LABELS, THEME_CYCLE, DEFAULT_THEME } from '../constants/themes';

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to Normal
  const getInitialTheme = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('friday-challenge-theme');
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      return savedTheme;
    }
    
    // Default to Normal mode (no system preference check for dark mode)
    return DEFAULT_THEME;
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transitioning class for smooth animation
    setIsTransitioning(true);
    root.classList.add('theme-transitioning');
    
    // Set the theme attribute
    root.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('friday-challenge-theme', theme);
    
    // Remove transitioning class after animation
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      root.classList.remove('theme-transitioning');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [theme]);

  // Toggle between Light and Normal themes only
  const toggleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    setTheme(THEME_CYCLE[nextIndex]);
  };

  // Set specific theme
  const setSpecificTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  // Get next theme (for preview)
  const getNextTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    return THEME_CYCLE[nextIndex];
  };

  // Context value
  const value = {
    theme,
    setTheme: setSpecificTheme,
    toggleTheme,
    getNextTheme,
    isTransitioning,
    themeIcon: THEME_ICONS[theme],
    themeLabel: THEME_LABELS[theme],
    nextThemeIcon: THEME_ICONS[getNextTheme()],
    nextThemeLabel: THEME_LABELS[getNextTheme()],
    isLight: theme === THEMES.LIGHT,
    isNormal: theme === THEMES.NORMAL
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
