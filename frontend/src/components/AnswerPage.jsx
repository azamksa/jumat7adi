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
            top: '15px',
            left: '30%',
            transform: 'translateX(-50%)',
            background: selectedTeam === 'team1' 
              ? 'linear-gradient(135deg, rgba(31, 106, 165, 0.5), rgba(1, 50, 98, 0.4))' 
              : 'linear-gradient(135deg, rgba(31, 106, 165, 0.25), rgba(1, 50, 98, 0.15))',
            border: '2px solid rgba(31, 106, 165, 0.5)',
            color: '#FF8A4C',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(31, 106, 165, 0.2), inset 0 0 10px rgba(31, 106, 165, 0.1)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team1' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(31, 106, 165, 0.35), rgba(1, 50, 98, 0.25))';
              e.target.style.border = '2px solid rgba(31, 106, 165, 0.65)';
              e.target.style.boxShadow = '0 12px 30px rgba(31, 106, 165, 0.35), inset 0 0 15px rgba(31, 106, 165, 0.15)';
              handleTeam1Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(31, 106, 165, 0.25), rgba(1, 50, 98, 0.15))';
              e.target.style.border = '2px solid rgba(31, 106, 165, 0.5)';
              e.target.style.boxShadow = '0 8px 20px rgba(31, 106, 165, 0.2), inset 0 0 10px rgba(31, 106, 165, 0.1)';
              handleTeam1Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
            <span style={{ textShadow: 'none' }}>🔵 {teams.team1}</span>
            <span style={{ fontSize: '1.1rem', display: 'inline-block', color: '#FF8A4C', fontWeight: 'bold' }} data-team1-score="true">{scores.team1}</span>
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

        {/* Points indicator - CENTER */}
        <div style={{
          position: 'fixed',
          top: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(255, 138, 76, 0.2), rgba(226, 88, 34, 0.15))',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255, 138, 76, 0.4)',
          color: '#FF8A4C',
          padding: '15px 40px',
          borderRadius: '30px',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          boxShadow: '0 12px 35px rgba(226, 88, 34, 0.3), inset 0 0 15px rgba(255, 138, 76, 0.1)',
          zIndex: 50,
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease'
        }}>
          ⭐ {currentQuestion.points} نقطة 🏆
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
            background: selectedTeam === 'team2' 
              ? 'linear-gradient(135deg, rgba(226, 88, 34, 0.5), rgba(255, 138, 76, 0.4))' 
              : 'linear-gradient(135deg, rgba(226, 88, 34, 0.25), rgba(255, 138, 76, 0.15))',
            border: '2px solid rgba(226, 88, 34, 0.5)',
            color: '#FF8A4C',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            cursor: selectedTeam !== null ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(226, 88, 34, 0.1)',
            zIndex: 40,
            whiteSpace: 'nowrap',
            opacity: selectedTeam !== null && selectedTeam !== 'team2' ? '0.5' : '1'
          }}
          onMouseOver={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(226, 88, 34, 0.35), rgba(255, 138, 76, 0.25))';
              e.target.style.border = '2px solid rgba(226, 88, 34, 0.65)';
              e.target.style.boxShadow = '0 12px 30px rgba(226, 88, 34, 0.35), inset 0 0 15px rgba(226, 88, 34, 0.15)';
              handleTeam2Hover();
            }
          }}
          onMouseOut={(e) => {
            if (selectedTeam === null) {
              e.target.style.background = 'linear-gradient(135deg, rgba(226, 88, 34, 0.25), rgba(255, 138, 76, 0.15))';
              e.target.style.border = '2px solid rgba(226, 88, 34, 0.5)';
              e.target.style.boxShadow = '0 8px 20px rgba(226, 88, 34, 0.2), inset 0 0 10px rgba(226, 88, 34, 0.1)';
              handleTeam2Leave();
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
            <span style={{ textShadow: 'none' }}>🟠 {teams.team2}</span>
            <span style={{ fontSize: '1.1rem', display: 'inline-block', color: '#FF8A4C', fontWeight: 'bold' }} data-team2-score="true">{scores.team2}</span>
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

        {/* Nobody Button - Right Corner */}
        <button
          onClick={() => answerQuestion(false)}
          style={{
            position: 'fixed',
            top: '15px',
            right: '15px',
            background: 'linear-gradient(135deg, rgba(100, 100, 100, 0.2), rgba(80, 80, 80, 0.15))',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(150, 150, 150, 0.3)',
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(150, 150, 150, 0.08)',
            zIndex: 40,
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(100, 100, 100, 0.3), rgba(80, 80, 80, 0.25))';
            e.target.style.border = '2px solid rgba(150, 150, 150, 0.5)';
            e.target.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(150, 150, 150, 0.12)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(100, 100, 100, 0.2), rgba(80, 80, 80, 0.15))';
            e.target.style.border = '2px solid rgba(150, 150, 150, 0.3)';
            e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(150, 150, 150, 0.08)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ textShadow: 'none' }}>❌ لا أحد</span>
            <span style={{ fontSize: '1.1rem', color: 'rgba(255, 150, 150, 0.8)' }}>✗</span>
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