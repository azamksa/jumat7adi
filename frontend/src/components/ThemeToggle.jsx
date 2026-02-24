import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../hooks/useTheme';
import { THEMES } from '../constants/themes';

const ThemeToggle = ({ position = 'home' }) => {
  const { 
    theme, 
    toggleTheme, 
    themeIcon, 
    themeLabel,
    nextThemeLabel,
    isTransitioning 
  } = useTheme();

  const [showTooltip, setShowTooltip] = useState(false);

  // Get position styles based on page - ALL FIXED POSITION
  const getPositionStyles = () => {
    switch (position) {
      case 'home':
        // Home Page: fixed left side
        return {
          position: 'fixed',
          top: '24px',
          left: '24px',
          right: 'auto',
          transform: 'none'
        };
      case 'login':
        // Login Page: fixed left side
        return {
          position: 'fixed',
          top: '24px',
          left: '24px',
          right: 'auto',
          transform: 'none'
        };
      case 'questions':
        // Questions List Page: fixed at 70% from left
        return {
          position: 'fixed',
          top: '24px',
          left: '70%',
          right: 'auto',
          transform: 'translateX(-50%)'
        };
      case 'hidden':
        // Hidden pages
        return {
          display: 'none'
        };
      default:
        return {
          position: 'fixed',
          top: '24px',
          left: '24px',
          right: 'auto',
          transform: 'none'
        };
    }
  };

  // Get theme styles - Light or Normal only
  const getThemeStyles = () => {
    switch (theme) {
      case THEMES.LIGHT:
        return {
          background: '#f8fafc',
          color: '#ff5243',
          shadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: '#e2e8f0'
        };
      case THEMES.NORMAL:
        return {
          background: '#252d4a',
          color: '#ff7a5c',
          shadow: '0 4px 12px rgba(0,0,0,0.3)',
          borderColor: '#3a4563'
        };
      default:
        return {
          background: '#252d4a',
          color: '#ff7a5c',
          shadow: '0 4px 12px rgba(0,0,0,0.3)',
          borderColor: '#3a4563'
        };
    }
  };

  const positionStyles = getPositionStyles();
  const styles = getThemeStyles();

  // If hidden, return null
  if (positionStyles.display === 'none') {
    return null;
  }

  // Use Portal to render outside DOM tree - ensures fixed positioning works
  return createPortal(
    <div 
      style={{
        ...positionStyles,
        zIndex: 10000,
        transition: 'all 0.3s ease',
        pointerEvents: 'auto'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: position === 'questions' ? '50%' : '0',
          right: position === 'home' || position === 'login' ? 'auto' : position === 'questions' ? 'auto' : '0',
          transform: position === 'questions' ? 'translateX(-50%)' : 'none',
          background: styles.background,
          color: styles.color,
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          boxShadow: styles.shadow,
          border: `1px solid ${styles.borderColor}`,
          fontFamily: "'Tajawal', sans-serif",
          zIndex: 10001
        }}>
          {themeLabel}
        </div>
      )}

      <button
        onClick={toggleTheme}
        disabled={isTransitioning}
        title={`الوضع الحالي: ${themeLabel} - اضغط للتبديل إلى ${nextThemeLabel}`}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: styles.background,
          border: `3px solid ${styles.borderColor}`,
          color: styles.color,
          fontSize: '28px',
          cursor: isTransitioning ? 'wait' : 'pointer',
          boxShadow: styles.shadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          opacity: isTransitioning ? 0.7 : 1,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
          zIndex: 10000
        }}
        onMouseEnter={(e) => {
          if (!isTransitioning) {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = `${styles.shadow}, 0 0 20px ${styles.color}40`;
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = isTransitioning ? 'scale(0.95)' : 'scale(1)';
          e.target.style.boxShadow = styles.shadow;
        }}
      >
        {themeIcon || '☀️'}
      </button>
    </div>,
    document.body // Render directly to body, outside any Container
  );
};

export default ThemeToggle;
