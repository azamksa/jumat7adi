import React from 'react';

const AnswerPage = ({
  currentQuestion,
  teams,
  answerQuestion,
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
      overflow: 'hidden'
    }
    // ... باقي الأنماط
  };

  return (
    <div className="answer-section" style={styles.container}>
      <div className="correct-answer">
        <h3>الإجابة الصحيحة:</h3>
        <p>{currentQuestion?.answer}</p>
      </div>
      <div className="answer-options">
        <button
          onClick={() => answerQuestion(true, 'team1')}
          className="answer-btn team1-btn"
        >
          {teams.team1} أجاب صحيح
        </button>
        <button
          onClick={() => answerQuestion(true, 'team2')}
          className="answer-btn team2-btn"
        >
          {teams.team2} أجاب صحيح
        </button>
        <button
          onClick={() => answerQuestion(false)}
          className="answer-btn no-answer-btn"
        >
          لا أحد أجاب صحيح
        </button>
      </div>
    </div>
  );
};

export default AnswerPage;
