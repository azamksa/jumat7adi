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
  setShowAnswer,
}) => {

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

      {/* Main Question Card */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '30px',
        padding: '260px 10px',
        width: '1500px',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
         <button 
          onClick={() => setGameState('game')}
          style={{
            position: 'relative',
            zIndex: 1,
            top: '-250px',
            left: '-650px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '12px 24px',
            right: '20px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← العودة
        </button>

        {/* Timer Circle */}
        <div style={{
          position: 'relative',
          width: '150px',
          height: '150px',
          top: '-300px',
          right: '-1325px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTop: timer > 10 ? '4px solid #4CAF50' : '4px solid #f44336',
            transform: `rotate(${(60 - timer) * 6}deg)`,
            transition: 'transform 1s linear'
          }} />
          <span style={{
            fontSize: timer > 10 ? '3.5rem' : '5.5rem', // حذفنا السطر المكرر
            fontWeight: 'bold',
            color: timer > 10 ? '#4CAF50' : '#f44336',
            zIndex: 1
          }}>
            {timer}
          </span>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 255, 255, 0.1))',
          filter: 'blur(20px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.2), rgba(255, 255, 255, 0.1))',
          filter: 'blur(15px)'
        }} />

        {/* Points indicator */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '700px',
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          color: '#1a237e',
          padding: '8px 20px',
          borderRadius: '25px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
        }}>
          {currentQuestion.points} نقطة
        </div>

        {/* Team indicator */}
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '700px',
          marginBottom: '10px',
          padding: '15px 30px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          display: 'inline-block',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            color: '#FFD700',
            fontWeight: 'bold'
          }}>
            دور {activeTeam === 'team1' ? teams.team1 : teams.team2}
          </h2>
        </div>

        {/* Question text with image/video */}
        <div style={{
          position: 'relative',
          top: '-300px',
          // right: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: '1.3',
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
                maxWidth: '800px',
                maxHeight: '400px',
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
                width: '50%', // تعديل العرض
                maxWidth: '1000px', // تقليل العرض الأقصى
                height: 'auto',
                aspectRatio: '16/9',
                objectFit: 'contain',
                borderRadius: '15px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                backgroundColor: '#000',
                margin: '20px auto', // إضافة هوامش
                display: 'block' // تحسين المحاذاة
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

      {/* Control buttons */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setShowAnswer(true)}
          style={{
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '15px 30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.3)';
          }}
        >
          عرض الإجابة
        </button>

        <button
          onClick={togglePauseTimer}
          style={{
            background: isTimerPaused 
              ? 'linear-gradient(45deg, #2196F3, #1976D2)' 
              : 'linear-gradient(45deg, #FF9800, #F57C00)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '15px 30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isTimerPaused 
              ? '0 6px 20px rgba(33, 150, 243, 0.3)'
              : '0 6px 20px rgba(255, 152, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {isTimerPaused ? 'استئناف' : 'إيقاف'}
        </button>

        <button
          onClick={resetTimer}
          style={{
            background: 'linear-gradient(45deg, #9C27B0, #7B1FA2)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '15px 30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(156, 39, 176, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(156, 39, 176, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(156, 39, 176, 0.3)';
          }}
        >
          إعادة الوقت
        </button>

        <button
          onClick={skipTime}
          style={{
            background: 'linear-gradient(45deg, #f44336, #d32f2f)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '15px 30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(244, 67, 54, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(244, 67, 54, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.3)';
          }}
        >
          تخطي الوقت
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;