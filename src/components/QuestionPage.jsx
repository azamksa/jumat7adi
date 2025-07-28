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
  showAnswer,
}) => {
  const styles = {
    container: {
      display: 'flex',
      width: '100vw',
      height: '100vh',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '0',
      margin: '0',
      background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
      overflow: 'hidden',
    },
  };

  return (
    <div className="question-container" style={styles.container}>
      <div className="question-card" style={{ maxWidth: 1100, minHeight: 600, padding: '60px 30px' }}>
        <div className="question-header" style={{ marginBottom: 20 }}>
          <button className="back-button" onClick={() => setGameState('game')}>
            &larr; العودة
          </button>
          <div className="team-turn">
            <h2>دور {activeTeam === 'team1' ? teams.team1 : teams.team2}</h2>
          </div>
          <div className="timer-display">
            <div className="timer-icon">⏱️</div>
            <div className="timer-value">{timer}</div>
          </div>
        </div>
        <div className="question-content">
          <div className="question-points-display">
            {currentQuestion.points} نقطة
          </div>
          <div className="question-text big-question" style={{ fontSize: '2.5rem', margin: '30px 0' }}>
            {currentQuestion.question}
          </div>
          {currentQuestion.image && (
            <img src={currentQuestion.image} alt="" style={{ maxWidth: '100%', borderRadius: 16, margin: '20px auto' }} />
          )}
          {currentQuestion.video && (
            <video src={currentQuestion.video} controls style={{ maxWidth: '100%', borderRadius: 16, margin: '20px auto' }} />
          )}
        </div>
        <div className="timer-controls" style={{ marginBottom: 10 }}>
          <button onClick={skipTime} className="control-btn skip-btn">
            تخطي الوقت
          </button>
          <button onClick={togglePauseTimer} className={`control-btn ${isTimerPaused ? 'resume-btn' : 'pause-btn'}`}>
            {isTimerPaused ? 'استئناف' : 'إيقاف'}
          </button>
          <button onClick={resetTimer} className="control-btn reset-btn">
            إعادة الوقت
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
