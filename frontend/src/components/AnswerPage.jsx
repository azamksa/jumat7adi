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



  // دالة لمعالجة اختيار الفريق
  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setShowConfirm(true);
    
    // تأخير 800ms ثم الانتقال
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
  
  // معالجة حالة عدم وجود سؤال
  if (!currentQuestion) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
        color: 'white',
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
      background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      
      

      {/* Main Answer Card */}
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
        
        {/* Back Button - Left Corner */}
        <button 
          onClick={() => {
            resetTimer();
            setShowAnswer(false);
            setGameState('question');
          }}
          style={{
            position: 'fixed',
            top: '15px',
            left: '15px',
            zIndex: 100,
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '12px 24px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
            backdropFilter: 'blur(10px)',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          ← العودة للسؤال
        </button>

        {/* Team 1 Button - 30% */}
        <button
          onClick={(e) => {
            handleTeamSelect('team1');
          }}
          disabled={selectedTeam !== null}
          style={{
            position: 'fixed',
            top: '15px',
            left: '30%',
            transform: 'translateX(-50%)',
            background: selectedTeam === 'team1' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.25)',
            border: '2px solid rgba(76, 175, 80, 0.5)',
            color: 'rgba(255, 255, 255, 0.95)',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(8px)',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s ease',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team1' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.opacity = '0.8';
              handleTeam1Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.opacity = '1';
              handleTeam1Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
            <span style={{ textShadow: 'none' }}>{teams.team1}</span>
            <span style={{ fontSize: '1.1rem', display: 'inline-block' }} data-team1-score="true">{scores.team1}</span>
            {showConfirm && selectedTeam === 'team1' && (
              <span style={{
                position: 'absolute',
                bottom: '-25px',
                fontSize: '2rem'
              }}>✓</span>
            )}
          </div>
        </button>

        {/* Points indicator - CENTER */}
        <div style={{
          position: 'fixed',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(76, 175, 80, 0.3)',
          border: '2px solid rgba(76, 175, 80, 0.6)',
          color: 'white',
          padding: '15px 40px',
          borderRadius: '30px',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)',
          zIndex: 50,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)'
        }}>
          {currentQuestion.points} نقطة
        </div>

        {/* Team 2 Button - 70% */}
        <button
          onClick={(e) => {
            handleTeamSelect('team2');
          }}
          disabled={selectedTeam !== null}
          style={{
            position: 'fixed',
            top: '15px',
            right: '30%',
            transform: 'translateX(50%)',
            background: selectedTeam === 'team2' ? 'rgba(156, 39, 176, 0.5)' : 'rgba(156, 39, 176, 0.25)',
            border: '2px solid rgba(156, 39, 176, 0.5)',
            color: 'rgba(255, 255, 255, 0.95)',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(8px)',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s ease',
            boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team2' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.opacity = '0.8';
              handleTeam2Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.opacity = '1';
              handleTeam2Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
            <span style={{ textShadow: 'none' }}>{teams.team2}</span>
            <span style={{ fontSize: '1.1rem', display: 'inline-block' }} data-team2-score="true">{scores.team2}</span>
            {showConfirm && selectedTeam === 'team2' && (
              <span style={{
                position: 'absolute',
                bottom: '-25px',
                fontSize: '2rem'
              }}>✓</span>
            )}
          </div>
        </button>

        {/* Nobody Button - Right Corner */}
        <button
          onClick={() => answerQuestion(false)}
          style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            background: 'rgba(96, 125, 139, 0.25)',
            border: '2px solid rgba(96, 125, 139, 0.5)',
            color: 'rgba(255, 255, 255, 0.95)',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            boxShadow: '0 4px 15px rgba(96, 125, 139, 0.3)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: '1'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.8'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ textShadow: 'none' }}>لا أحد</span>
            <span style={{ fontSize: '1.1rem' }}>✗</span>
          </div>
        </button>

        {/* Answer text with media */}
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
            color: 'white',
            lineHeight: '1.4',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            wordBreak: 'break-word',
            padding: '35px',
            background: 'rgba(76, 175, 80, 0.15)',
            borderRadius: '20px',
            border: '3px solid rgba(76, 175, 80, 0.3)',
            textAlign: 'center',
            marginTop: '50px'
          }}>
            {currentQuestion.answer}
          </div>

          {/* Answer Image if exists */}
          {currentQuestion.answerImage && (
            <img 
              src={currentQuestion.answerImage} 
              alt="صورة الإجابة" 
              style={{ 
                width: '75vw',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                border: '3px solid rgba(76, 175, 80, 0.3)',
                maxWidth: '60vw'
              }} 
            />
          )}

          {/* Answer Video if exists */}
          {currentQuestion.answerVideo && (
            <video 
              controls
              autoPlay
              style={{ 
                width: '75vw',
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                border: '3px solid rgba(76, 175, 80, 0.3)',
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