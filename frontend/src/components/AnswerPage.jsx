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
        background: 'linear-gradient(135deg, #003262, #1F6AA5)',
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
      background: 'linear-gradient(135deg, #003262, #1F6AA5)',
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
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            whiteSpace: 'nowrap'
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
          العودة للسؤال
        </button>

        {/* Team 1 Button - 30% */}
        <button
          onClick={(e) => {
            handleTeamSelect('team1');
          }}
          disabled={selectedTeam !== null}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-120px)',
            background: selectedTeam === 'team1' 
              ? 'linear-gradient(135deg, rgba(0, 50, 98, 0.12), rgba(31, 106, 165, 0.08))' 
              : 'linear-gradient(135deg, rgba(0, 50, 98, 0.06), rgba(31, 106, 165, 0.05))',
            border: '1px solid rgba(0, 50, 98, 0.2)',
            color: '#003262',
            padding: '14px 24px',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            backdropFilter: 'none',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team1' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(0, 50, 98, 0.1), rgba(31, 106, 165, 0.08))';
              e.target.style.border = '1px solid rgba(0, 50, 98, 0.3)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
              handleTeam1Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(0, 50, 98, 0.06), rgba(31, 106, 165, 0.05))';
              e.target.style.border = '1px solid rgba(0, 50, 98, 0.2)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              handleTeam1Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
            <span style={{ textShadow: 'none', fontSize: '0.9rem' }}>{teams.team1}</span>
            <span style={{ fontSize: '1rem', display: 'inline-block', color: '#1F6AA5', fontWeight: 700 }} data-team1-score="true">{scores.team1} نقطة</span>
            {showConfirm && selectedTeam === 'team1' && (
              <span style={{
                position: 'absolute',
                bottom: '-20px',
                fontSize: '1.2rem',
                animation: 'pulse 0.5s ease-out'
              }}>✓</span>
            )}
          </div>
        </button>

        {/* Points indicator - CENTER */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.06), rgba(255, 138, 76, 0.04))',
          backdropFilter: 'none',
          border: '1px solid rgba(226, 88, 34, 0.15)',
          color: '#E25822',
          padding: '12px 32px',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          zIndex: 50,
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease'
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
            top: '20px',
            right: '50%',
            transform: 'translateX(120px)',
            background: selectedTeam === 'team2' 
              ? 'linear-gradient(135deg, rgba(226, 88, 34, 0.12), rgba(255, 138, 76, 0.08))' 
              : 'linear-gradient(135deg, rgba(226, 88, 34, 0.06), rgba(255, 138, 76, 0.05))',
            border: '1px solid rgba(226, 88, 34, 0.2)',
            color: '#E25822',
            padding: '14px 24px',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            backdropFilter: 'none',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team2' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(226, 88, 34, 0.1), rgba(255, 138, 76, 0.08))';
              e.target.style.border = '1px solid rgba(226, 88, 34, 0.3)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
              handleTeam2Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(226, 88, 34, 0.06), rgba(255, 138, 76, 0.05))';
              e.target.style.border = '1px solid rgba(226, 88, 34, 0.2)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              handleTeam2Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
            <span style={{ textShadow: 'none', fontSize: '0.9rem' }}>{teams.team2}</span>
            <span style={{ fontSize: '1rem', display: 'inline-block', color: '#E25822', fontWeight: 700 }} data-team2-score="true">{scores.team2} نقطة</span>
            {showConfirm && selectedTeam === 'team2' && (
              <span style={{
                position: 'absolute',
                bottom: '-20px',
                fontSize: '1.2rem',
                animation: 'pulse 0.5s ease-out'
              }}>✓</span>
            )}
          </div>
        </button>

        {/* Nobody Button - Right Corner */}
        <button
          onClick={() => answerQuestion(false)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.06), rgba(75, 85, 99, 0.05))',
            backdropFilter: 'none',
            border: '1px solid rgba(107, 114, 128, 0.2)',
            color: '#6b7280',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            zIndex: 40,
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.08))';
            e.target.style.border = '1px solid rgba(107, 114, 128, 0.3)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(107, 114, 128, 0.06), rgba(75, 85, 99, 0.05))';
            e.target.style.border = '1px solid rgba(107, 114, 128, 0.2)';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
          }}
        >
          لا أحد
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
            background: 'rgba(226, 88, 34, 0.15)',
            borderRadius: '20px',
            border: '3px solid rgba(226, 88, 34, 0.3)',
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
                border: '3px solid rgba(226, 88, 34, 0.3)',
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
                border: '3px solid rgba(226, 88, 34, 0.3)',
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