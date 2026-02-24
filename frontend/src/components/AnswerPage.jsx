import React, { useState } from 'react';

const AnswerPage = ({
  currentQuestion,
  teams,
  scores,
  answerQuestion,
  setShowAnswer,
  setGameState,
  resetTimer,
}) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setShowConfirm(true);
    
    setTimeout(() => {
      answerQuestion(true, team);
      setSelectedTeam(null);
      setShowConfirm(false);
    }, 800);
  };

  const handleTeam1Hover = () => {
    const team1ScoreSpan = document.querySelector('[data-team1-score="true"]');
    if (team1ScoreSpan) {
      team1ScoreSpan.textContent = scores.team1 + currentQuestion.points;
    }
  };

  const handleTeam1Leave = () => {
    const team1ScoreSpan = document.querySelector('[data-team1-score="true"]');
    if (team1ScoreSpan) {
      team1ScoreSpan.textContent = scores.team1;
    }
  };

  const handleTeam2Hover = () => {
    const team2ScoreSpan = document.querySelector('[data-team2-score="true"]');
    if (team2ScoreSpan) {
      team2ScoreSpan.textContent = scores.team2 + currentQuestion.points;
    }
  };

  const handleTeam2Leave = () => {
    const team2ScoreSpan = document.querySelector('[data-team2-score="true"]');
    if (team2ScoreSpan) {
      team2ScoreSpan.textContent = scores.team2;
    }
  };
  
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
        جاري تحميل الإجابة...
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
          onClick={() => {
            resetTimer();
            setShowAnswer(false);
            setGameState('question');
          }}
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
            boxShadow: 'var(--neu-shadow-raised)',
            whiteSpace: 'nowrap'
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
          العودة للسؤال
        </button>

        <button
          onClick={() => {
            handleTeamSelect('team1');
          }}
          disabled={selectedTeam !== null}
          style={{
            position: 'fixed',
            top: '15px',
            left: '30%',
            transform: 'translateX(-50%)',
            background: selectedTeam === 'team1' 
              ? 'var(--color-secondary)' 
              : 'var(--bg-secondary)',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '15px 30px',
            borderRadius: 'var(--radius-full)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: selectedTeam === 'team1'
              ? 'var(--neu-shadow-pressed)'
              : 'var(--neu-shadow-raised)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team1' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'var(--color-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-hover)';
              handleTeam1Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'var(--bg-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-raised)';
              handleTeam1Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
            <span>🔵 {teams.team1}</span>
            <span style={{ fontSize: '1.1rem', display: 'inline-block', color: 'var(--color-primary)', fontWeight: 'bold' }} data-team1-score="true">{scores.team1}</span>
            {showConfirm && selectedTeam === 'team1' && (
              <span style={{
                position: 'absolute',
                bottom: '-25px',
                fontSize: '2rem',
                animation: 'pulse 0.5s ease-out'
              }}>✅</span>
            )}
          </div>
        </button>

        <div style={{
          position: 'fixed',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-secondary)',
          border: 'none',
          color: 'var(--color-primary)',
          padding: '15px 40px',
          borderRadius: 'var(--radius-full)',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          boxShadow: 'var(--neu-shadow-raised)',
          zIndex: 50,
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease'
        }}>
          ⭐ {currentQuestion.points} نقطة 🏆
        </div>

        <button
          onClick={() => {
            handleTeamSelect('team2');
          }}
          disabled={selectedTeam !== null}
          style={{
            position: 'fixed',
            top: '15px',
            right: '30%',
            transform: 'translateX(50%)',
            background: selectedTeam === 'team2' 
              ? 'var(--color-error)' 
              : 'var(--bg-secondary)',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '15px 30px',
            borderRadius: 'var(--radius-full)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: selectedTeam === 'team2'
              ? 'var(--neu-shadow-pressed)'
              : 'var(--neu-shadow-raised)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team2' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'var(--color-error)';
              e.target.style.boxShadow = 'var(--neu-shadow-hover)';
              handleTeam2Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'var(--bg-secondary)';
              e.target.style.boxShadow = 'var(--neu-shadow-raised)';
              handleTeam2Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
            <span>🟠 {teams.team2}</span>
            <span style={{ fontSize: '1.1rem', display: 'inline-block', color: 'var(--color-primary)', fontWeight: 'bold' }} data-team2-score="true">{scores.team2}</span>
            {showConfirm && selectedTeam === 'team2' && (
              <span style={{
                position: 'absolute',
                bottom: '-25px',
                fontSize: '2rem',
                animation: 'pulse 0.5s ease-out'
              }}>✅</span>
            )}
          </div>
        </button>

        <button
          onClick={() => answerQuestion(false)}
          style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            background: 'var(--bg-secondary)',
            border: 'none',
            color: 'var(--text-muted)',
            padding: '15px 30px',
            borderRadius: 'var(--radius-full)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--neu-shadow-raised)',
            zIndex: 40,
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'var(--text-muted)';
            e.target.style.color = 'var(--bg-secondary)';
            e.target.style.boxShadow = 'var(--neu-shadow-hover)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'var(--bg-secondary)';
            e.target.style.color = 'var(--text-muted)';
            e.target.style.boxShadow = 'var(--neu-shadow-raised)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span>❌ لا أحد</span>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>✗</span>
          </div>
        </button>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          width: '95%',
          maxHeight: 'calc(100vh - 180px)',
          overflow: 'hidden'
        }}>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            lineHeight: '1.4',
            wordBreak: 'break-word',
            padding: '35px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            textAlign: 'center',
            marginTop: '50px',
            boxShadow: 'var(--neu-shadow-pressed)'
          }}>
            {currentQuestion.answer}
          </div>

          {currentQuestion.answerImage && (
            <img 
              src={currentQuestion.answerImage} 
              alt="صورة الإجابة" 
              style={{ 
                width: '75vw',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--neu-shadow-raised)',
                border: 'none',
                maxWidth: '60vw'
              }} 
            />
          )}

          {currentQuestion.answerVideo && (
            <video 
              controls
              autoPlay
              style={{ 
                width: '75vw',
                height: 'auto',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--neu-shadow-raised)',
                border: 'none',
                maxWidth: '55vw'
              }} 
            >
              <source src={currentQuestion.answerVideo} type="video/mp4" />
              المتصفح لا يدعم تشغيل الفيديو
            </video>
          )}

          <div style={{ height: '30px' }}></div>
        </div>
      </div>

    </div>
  );
};

export default AnswerPage;
