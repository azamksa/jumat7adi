import React from 'react';

const QuestionPage = ({
  currentQuestion,
  timer,
  activeTeam,
  teams,
  isTimerPaused,
  skipTime,
  togglePauseTimer,
  resetTimer,
  setGameState,
}) => {
  
  // معالجة حالة عدم وجود سؤال
  if (!currentQuestion) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #003262, #1F6AA5)',
        color: 'white',
        fontSize: '2rem'
      }}>
        جاري تحميل السؤال...
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #003262, #1F6AA5)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* Header with back button and timer */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
       

        
      </div>

      {/* Main Question Card - FULL SCREEN */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '0px',
        padding: '20px',
        width: '100vw',
        height: '100vh',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        border: 'none',
        boxShadow: 'none',
        position: 'fixed',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0
      }}>
        
         <button 
          onClick={() => setGameState('game')}
          style={{
            position: 'fixed',
            top: '24px',
            left: '24px',
            zIndex: 100,
            background: 'linear-gradient(135deg, rgba(0, 50, 98, 0.06), rgba(31, 106, 165, 0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 50, 98, 0.15)',
            borderRadius: '8px',
            color: '#003262',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(0, 50, 98, 0.1), rgba(31, 106, 165, 0.08))';
            e.target.style.border = '1px solid rgba(0, 50, 98, 0.25)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(0, 50, 98, 0.06), rgba(31, 106, 165, 0.05))';
            e.target.style.border = '1px solid rgba(0, 50, 98, 0.15)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
          }}
        >
          ← العودة
        </button>

        {/* Timer Circle with Control Buttons Around It */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 50,
          width: '220px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Center Timer Circle */}
          <div style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: timer <= 10 ? 'linear-gradient(135deg, rgba(255, 50, 50, 0.15), rgba(226, 88, 34, 0.1))' : 'linear-gradient(135deg, rgba(255, 138, 76, 0.1), rgba(226, 88, 34, 0.08))',
            border: timer <= 10 ? '5px solid rgba(255, 100, 100, 0.5)' : '5px solid rgba(255, 138, 76, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(15px)',
            boxShadow: timer <= 10 
              ? '0 12px 40px rgba(255, 50, 50, 0.4), inset 0 0 20px rgba(255, 100, 100, 0.2)' 
              : '0 12px 40px rgba(226, 88, 34, 0.3), inset 0 0 20px rgba(255, 138, 76, 0.1)',
            zIndex: 10,
            animation: timer <= 10 ? 'danger-pulse 0.5s ease-in-out infinite' : 'none',
            transition: 'background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease'
          }}>
            <div style={{
              position: 'absolute',
              top: '-5px',
              left: '-5px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '5px solid transparent',
              borderTop: timer > 10 ? '5px solid rgba(255, 138, 76, 0.8)' : '5px solid rgba(255, 100, 100, 0.9)',
              transform: `rotate(${(60 - timer) * 6}deg)`,
              transition: 'transform 1s linear, border-color 0.3s ease'
            }} />
            <span style={{
              fontSize: timer > 10 ? '4rem' : '5.5rem',
              fontWeight: 'bold',
              color: timer > 10 ? '#FF8A4C' : 'rgba(255, 100, 100, 0.9)',
              zIndex: 1,
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}>
              {timer}
            </span>
          </div>

          {/* Pause/Resume Button - Top Left */}
          <button
            onClick={togglePauseTimer}
            title={isTimerPaused ? 'استئناف' : 'إيقاف'}
            style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 138, 76, 0.15), rgba(226, 88, 34, 0.1))',
              border: '2px solid rgba(255, 138, 76, 0.3)',
              color: '#FF8A4C',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 18px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(255, 138, 76, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              backdropFilter: 'blur(10px)',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 138, 76, 0.25), rgba(226, 88, 34, 0.2))';
              e.target.style.border = '2px solid rgba(255, 138, 76, 0.5)';
              e.target.style.boxShadow = '0 8px 25px rgba(226, 88, 34, 0.35), inset 0 0 15px rgba(255, 138, 76, 0.15)';
              e.target.style.color = '#FFB566';
              e.target.style.transform = 'scale(1.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 138, 76, 0.15), rgba(226, 88, 34, 0.1))';
              e.target.style.border = '2px solid rgba(255, 138, 76, 0.3)';
              e.target.style.boxShadow = '0 6px 18px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(255, 138, 76, 0.1)';
              e.target.style.color = '#FF8A4C';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isTimerPaused ? '▶' : '⏸'}
          </button>

          {/* Reset Button - Bottom */}
          <button
            onClick={resetTimer}
            title="إعادة الوقت"
            style={{
              position: 'absolute',
              bottom: '0px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 138, 76, 0.15), rgba(226, 88, 34, 0.1))',
              border: '2px solid rgba(255, 138, 76, 0.3)',
              color: '#FF8A4C',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 18px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(255, 138, 76, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              backdropFilter: 'blur(10px)',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 138, 76, 0.25), rgba(226, 88, 34, 0.2))';
              e.target.style.border = '2px solid rgba(255, 138, 76, 0.5)';
              e.target.style.boxShadow = '0 8px 25px rgba(226, 88, 34, 0.35), inset 0 0 15px rgba(255, 138, 76, 0.15)';
              e.target.style.color = '#FFB566';
              e.target.style.transform = 'translateX(-50%) scale(1.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 138, 76, 0.15), rgba(226, 88, 34, 0.1))';
              e.target.style.border = '2px solid rgba(255, 138, 76, 0.3)';
              e.target.style.boxShadow = '0 6px 18px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(255, 138, 76, 0.1)';
              e.target.style.color = '#FF8A4C';
              e.target.style.transform = 'translateX(-50%)';
            }}
          >
            ↻
          </button>

          {/* Skip Button - Top Right */}
          <button
            onClick={skipTime}
            title="تخطي الوقت"
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 138, 76, 0.15), rgba(226, 88, 34, 0.1))',
              border: '2px solid rgba(255, 138, 76, 0.3)',
              color: '#FF8A4C',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 18px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(255, 138, 76, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              backdropFilter: 'blur(10px)',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 138, 76, 0.25), rgba(226, 88, 34, 0.2))';
              e.target.style.border = '2px solid rgba(255, 138, 76, 0.5)';
              e.target.style.boxShadow = '0 8px 25px rgba(226, 88, 34, 0.35), inset 0 0 15px rgba(255, 138, 76, 0.15)';
              e.target.style.color = '#FFB566';
              e.target.style.transform = 'scale(1.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 138, 76, 0.15), rgba(226, 88, 34, 0.1))';
              e.target.style.border = '2px solid rgba(255, 138, 76, 0.3)';
              e.target.style.boxShadow = '0 6px 18px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(255, 138, 76, 0.1)';
              e.target.style.color = '#FF8A4C';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ⏭
          </button>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 138, 76, 0.2), rgba(255, 255, 255, 0.1))',
          filter: 'blur(20px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(226, 88, 34, 0.2), rgba(255, 255, 255, 0.1))',
          filter: 'blur(15px)'
        }} />

        {/* Points indicator - TOP CENTER */}
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(0, 50, 98, 0.06), rgba(31, 106, 165, 0.05))',
          backdropFilter: 'blur(10px)',
          color: '#003262',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 600,
          border: '1px solid rgba(0, 50, 98, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease'
        }}>
          <span>{teams[activeTeam]}</span>
          <span style={{ color: '#999', fontSize: '0.8rem' }}>•</span>
          <span style={{ color: '#E25822', fontWeight: 700 }}>{currentQuestion.points} نقطة</span>
        </div>

        {/* Team indicator - REMOVED */}

        {/* Question text with image/video */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '25px',
          maxHeight: 'calc(100vh - 180px)',
          overflow: 'hidden'
        }}>
          <div style={{
            fontSize: '3.8rem',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: '1.4',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            wordBreak: 'break-word'
          }}>
            {currentQuestion.question}
          </div>

          {/* Image if exists */}
          {currentQuestion.image && (
            <img 
              src={currentQuestion.image} 
              alt="صورة السؤال"
              style={{
                maxWidth: '90%',
                maxHeight: '520px',
                objectFit: 'contain',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
              }}
            />
          )}

          {/* Video if exists */}
          {currentQuestion.video && (
            <video 
              controls
              preload="metadata"
              playsInline
              controlsList="nodownload"
              style={{
                maxWidth: '90%',
                maxHeight: '520px',
                aspectRatio: '16/9',
                objectFit: 'contain',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                backgroundColor: '#000',
                display: 'block'
              }}
            >
              <source 
                src={currentQuestion.video} 
                type="video/mp4"
              />
            </video>
          )}
        </div>
      </div>

      {/* Control buttons - REMOVED, now in timer circle */}

    {/* CSS Animations */}
    <style jsx>{`
      @keyframes danger-pulse {
        0% {
          box-shadow: 0 8px 32px rgba(255, 0, 0, 0.3), inset 0 0 20px rgba(255, 50, 50, 0.2);
        }
        50% {
          box-shadow: 0 8px 32px rgba(255, 50, 50, 0.6), inset 0 0 30px rgba(255, 100, 100, 0.4);
        }
        100% {
          box-shadow: 0 8px 32px rgba(255, 0, 0, 0.3), inset 0 0 20px rgba(255, 50, 50, 0.2);
        }
      }

      @keyframes points-glow {
        0% {
          box-shadow: 0 4px 15px rgba(255, 138, 76, 0.3);
        }
        50% {
          box-shadow: 0 8px 25px rgba(255, 138, 76, 0.6), 0 0 20px rgba(255, 138, 76, 0.4);
        }
        100% {
          box-shadow: 0 4px 15px rgba(255, 138, 76, 0.3);
        }
      }

      @keyframes points-pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
    `}</style>
    </div>
  );
};

export default QuestionPage;