import React from 'react';

// هذا المكون يعرض الوقت وأزرار التحكم بالأيقونات
const TimerDisplay = ({
  timer,
  isTimerPaused,
  togglePauseTimer,
  resetTimer,
  skipTime,
}) => {

  // دالة لتحويل الثواني إلى صيغة MM:SS
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      color: 'white', 
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%'
    }}>
      {/* عرض الوقت */}
      <div style={{
        fontSize: '9rem',
        fontWeight: 200,
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        {formatTime(timer)}
      </div>

      {/* أزرار التحكم */}
      <div style={{ marginTop: '25px' }}>
        <button onClick={skipTime} title="تخطي" style={buttonStyle}>
          <i className="fa-solid fa-forward-step"></i>
        </button>
        <button onClick={togglePauseTimer} title={isTimerPaused ? 'استئناف' : 'إيقاف'} style={buttonStyle}>
          {isTimerPaused ? <i className="fa-solid fa-play"></i> : <i className="fa-solid fa-pause"></i>}
        </button>
        <button onClick={resetTimer} title="إعادة الوقت" style={buttonStyle}>
          <i className="fa-solid fa-arrow-rotate-left"></i>
        </button>
      </div>
    </div>
  );
};

// تنسيقات الأزرار لتجنب التكرار
const buttonStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '2.5rem',
  cursor: 'pointer',
  margin: '0 20px',
  transition: 'all 0.2s ease',
};

export default TimerDisplay;