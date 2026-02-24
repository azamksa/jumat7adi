// Theme Constants - 2 Modes Only (Light | Normal)
export const THEMES = {
  LIGHT: 'light',
  NORMAL: 'normal'
};

// Theme Icons
export const THEME_ICONS = {
  [THEMES.LIGHT]: '☀️',
  [THEMES.NORMAL]: '⚪'
};

// Theme Labels (Arabic)
export const THEME_LABELS = {
  [THEMES.LIGHT]: 'الوضع النهاري',
  [THEMES.NORMAL]: 'الوضع المتوازن'
};

// Theme Colors for reference
export const THEME_COLORS = {
  [THEMES.LIGHT]: {
    primary: '#ff5243',
    background: '#ffffff',
    surface: '#f8fafc'
  },
  [THEMES.NORMAL]: {
    primary: '#ff7a5c',
    background: '#1a1f3a',
    surface: '#252d4a'
  }
};

// Default theme
export const DEFAULT_THEME = THEMES.NORMAL;

// Theme cycle order
export const THEME_CYCLE = [THEMES.LIGHT, THEMES.NORMAL];
