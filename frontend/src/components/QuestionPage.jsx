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
  
  if (!currentQuestion) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
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
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '0px',
        padding: '20px',
        width: '100vw',
        height: '100vh',
        textAlign: 'center',
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
            background: 'var(--bg-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--neu-shadow-raised)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'var(--color-secondary)';
            e.target.style.boxShadow = 'var(--neu-shadow-hover)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'var(--bg-secondary)';
            e.target.style.boxShadow = 'var(--neu-shadow-raised)';
          }}
        >
          ← العودة
        </button>

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
          <div style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: timer <= 10 ? '5px solid var(--color-error)' : '5px solid var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: timer <= 10 
              ? 'var(--neu-shadow-pressed), 0 0 20px var(--color-error-alpha)' 
              : 'var(--neu-shadow-pressed)',
            zIndex: 10,
            animation: timer <= 10 ? 'danger-pulse 0.5s ease-in-out infinite' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              position: 'absolute',
              top: '-5px',
              left: '-5px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '5px solid transparent',
              borderTop: timer > 10 ? '5px solid var(--color-secondary)' : '5px solid var(--color-error)',
              transform: `rotate(${(60 - timer) * 6}deg)`,
              transition: 'transform 1s linear, border-color 0.3s ease'
            }} />
            <span style={{
              fontSize: timer > 10 ? '4rem' : '5.5rem',
              fontWeight: 'bold',
              color: timer > 10 ? 'var(--text-primary)' : 'var(--color-error)',
              zIndex: 1
            }}>
              {timer}
            </span>
          </div>

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
              background: 'var(--bg-secondary)',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--neu-shadow-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--color-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-hover)';
              e.target.style.transform = 'scale(1.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--bg-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-soft)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isTimerPaused ? '▶' : '⏸'}
          </button>

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
              background: 'var(--bg-secondary)',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--neu-shadow-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--color-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-hover)';
              e.target.style.transform = 'translateX(-50%) scale(1.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--bg-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-soft)';
              e.target.style.transform = 'translateX(-50%) scale(1)';
            }}
          >
            ↻
          </button>

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
              background: 'var(--bg-secondary)',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--neu-shadow-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--color-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-hover)';
              e.target.style.transform = 'scale(1.08)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--bg-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-soft)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ⏭
          </button>
        </div>

        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          padding: '12px 32px',
          borderRadius: 'var(--radius-lg)',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'var(--neu-shadow-raised)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          transition: 'all 0.3s ease'
        }}>
          <span>{teams[activeTeam]}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{currentQuestion.points} نقطة</span>
        </div>

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
            color: 'var(--text-primary)',
            lineHeight: '1.4',
            wordBreak: 'break-word'
          }}>
            {currentQuestion.question}
          </div>

          {currentQuestion.image && (
            <img 
              src={currentQuestion.image} 
              alt="صورة السؤال"
              style={{
                maxWidth: '90%',
                maxHeight: '520px',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--neu-shadow-raised)'
              }}
            />
          )}

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
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--neu-shadow-raised)',
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

    <style jsx>{`
      @keyframes danger-pulse {
        0% {
          box-shadow: var(--neu-shadow-pressed), 0 0 20px var(--color-error-alpha);
        }
        50% {
          box-shadow: var(--neu-shadow-pressed), 0 0 40px var(--color-error-alpha-strong);
        }
        100% {
          box-shadow: var(--neu-shadow-pressed), 0 0 20px var(--color-error-alpha);
        }
      }
    `}</style>
    </div>
  );
};

export default QuestionPage;
