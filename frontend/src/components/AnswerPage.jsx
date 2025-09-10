import React from 'react';

const AnswerPage = ({
  currentQuestion,
  teams,
  answerQuestion,
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
      
      

      {/* Main Answer Card */}
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
        
         {/* Header with checkmark icon */}
      <div style={{
        position: 'absolute',
        top: '90px',
        left: '-100px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <button 
          onClick={() => setShowAnswer(false)}
          style={{
          position: 'relative',
          zIndex: 1,
          top: '-80px',
          left: '120px', 
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          // left: '400px',
          borderRadius: '50px',
          color: 'white',
          padding: '12px 24px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ← العودة للسؤال
        </button>

        {/* Answer indicator circle */}
        {/* <div style={{
          position: 'relative',
          width: '150px',
          height: '150px',
          top: '-80px',
          right: '0px',
          borderRadius: '50%',
          background: 'rgba(76, 175, 80, 0.2)',
          border: '4px solid #4CAF50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          animation: 'pulse 2s infinite'
        }}>
          <span style={{
            fontSize: '3rem',
            color: '#4CAF50',
            zIndex: 1
          }}>
            ✓
          </span>
        </div> */}
      </div>


        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(255, 255, 255, 0.1))',
          filter: 'blur(20px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(255, 255, 255, 0.1))',
          filter: 'blur(15px)'
        }} />

        {/* Points indicator */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '700px',
          background: 'linear-gradient(45deg, #4CAF50, #45a049)',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '25px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
        }}>
          {currentQuestion.points} نقطة
        </div>

        {/* Answer header
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '640px',
          marginBottom: '40px',
          padding: '15px 30px',
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: '50px',
          display: 'inline-block',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(76, 175, 80, 0.3)'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '2.2rem',
            color: '#4CAF50',
            fontWeight: 'bold'
          }}>
            الإجابة الصحيحة
          </h2>
        </div> */}

        {/* Answer text with media */}
        <div style={{
          position: 'relative',
          top: '-150px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: '1.3',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            wordBreak: 'break-word',
            padding: '10px',
            background: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '20px',
            border: '2px solid rgba(76, 175, 80, 0.2)',
            width: '100%',
            textAlign: 'center'
          }}>
             الإجابة الصحيحة :  {currentQuestion.answer}
          </div>

          {/* Answer Image if exists */}
          {currentQuestion.answerImage && (
            <img 
              src={currentQuestion.answerImage} 
              alt="صورة الإجابة" 
              style={{ 
                maxWidth: '800px',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                border: '3px solid rgba(76, 175, 80, 0.3)'
              }} 
            />
          )}

          {/* Answer Video if exists */}
          {currentQuestion.answerVideo && (
            <video 
              controls
              autoPlay
              style={{ 
                maxWidth: '800px',
                maxHeight: '400px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                border: '3px solid rgba(76, 175, 80, 0.3)'
              }} 
            >
              <source src={currentQuestion.answerVideo} type="video/mp4" />
              المتصفح لا يدعم تشغيل الفيديو
            </video>
          )}
        </div>

        {/* Original question reminder (smaller) */}
        <div style={{
          position: 'relative',
          top: '-140px',
          marginTop: '5px',
          padding: '5px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            margin: 0,
            fontSize: '1.5rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic'
          }}>
            السؤال: {currentQuestion.question}
          </p>
        </div>
      </div>

      {/* Answer evaluation buttons */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '25px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => answerQuestion(true, 'team1')}
          style={{
            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '18px 35px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
            backdropFilter: 'blur(10px)',
            minWidth: '200px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
          }}
        >
            ✓ أجاب فريق {teams.team1}        
          </button>

          <button
          onClick={() => answerQuestion(false)}
          style={{
            background: 'linear-gradient(45deg, #607D8B, #455A64)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '18px 35px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(96, 125, 139, 0.4)',
            backdropFilter: 'blur(10px)',
            minWidth: '200px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(96, 125, 139, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(96, 125, 139, 0.4)';
          }}
        >
          ✗ لا أحد أجاب
        </button>

        <button
          onClick={() => answerQuestion(true, 'team2')}
          style={{
            background: 'linear-gradient(45deg, #9C27B0, #7B1FA2)',
            border: 'none',
            borderRadius: '50px',
            color: 'white',
            padding: '18px 35px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(156, 39, 176, 0.4)',
            backdropFilter: 'blur(10px)',
            minWidth: '200px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 35px rgba(156, 39, 176, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(156, 39, 176, 0.4)';
          }}
        >
          ✓ أجاب فريق {teams.team2} 
        </button>

        
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default AnswerPage;