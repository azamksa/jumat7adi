import React from 'react';

const QuestionsPage = ({
  gameState,
  currentQuestion,
  showAnswer,
  timer,
  activeTeam,
  teams,
  answeredQuestions,
  selectedCategories,
  basicCategories,
  categoryPickerTeam,
  setGameState,
  setTimer,
  setIsTimerPaused,
  setShowAnswer,
  setCurrentQuestion,
  setAnsweredQuestions,
  setScores,
  selectQuestion,
  answerQuestion,
  skipTime,
  togglePauseTimer,
  resetTimer,
}) => {
  if (gameState === 'results') {
    const winner = teams.team1 && teams.team2
      ? (teams.team1 && teams.team2 && (teams.team1 === teams.team2 ? null : (teams.team1 > teams.team2 ? teams.team1 : teams.team2)))
      : null;
    return (
      <div className="results-container">
        <div className="results-card">
          <div className="trophy-animation">🏆</div>
          <h1 className="winner-title">
            {winner ? `🎉 ${winner}` : '🤝 تعادل'}
          </h1>
          <p className="winner-subtitle">
            {winner ? 'الفائز بتحدي الجمعة!' : 'اللعبة انتهت بالتعادل!'}
          </p>
          <div className="scores-container">
            <div className="team-score-card team1-score">
              <h3>{teams.team1}</h3>
              <div className="score-value">{teams.team1}</div>
              <p>نقطة</p>
            </div>
            <div className="vs-text">VS</div>
            <div className="team-score-card team2-score">
              <h3>{teams.team2}</h3>
              <div className="score-value">{teams.team2}</div>
              <p>نقطة</p>
            </div>
          </div>
          <button onClick={() => setGameState('setup')} className="new-game-btn">
            لعبة جديدة
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'question' && (currentQuestion || showAnswer)) {
    return (
      <div className="question-container">
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
          {(showAnswer || timer === 0) && (
            <div className="answer-section">
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
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'game') {
    const allSubcategories = Object.values(basicCategories).flatMap(cat => cat.subcategories);
    const pointValues = [300, 400, 500, 600, 700, 800];
    return (
      <div className="game-container">
        <div className="score-board" style={{ marginBottom: 18 }}>
          <div className="team-score team1">
            <h3>{teams.team1}</h3>
            <div className="score-edit">
              <button onClick={() => setScores(s => ({ ...s, team1: Math.max(0, s.team1 - 100) }))}>-</button>
              <p>{scores.team1}</p>
              <button onClick={() => setScores(s => ({ ...s, team1: s.team1 + 100 }))}>+</button>
            </div>
          </div>
          <div className="game-title-container">
            <h2 style={{ marginBottom: 6 }}>تحدي الجمعة</h2>
            <div className="turn-indicator" style={{ margin: 0, fontSize: '1.1rem', padding: '8px 12px' }}>
              <span className="arrow">{categoryPickerTeam === 'team1' ? '⬅️' : '➡️'}</span>
              <span className="turn-team">{teams[categoryPickerTeam]} يختار الفئة ويبدأ الإجابة</span>
            </div>
          </div>
          <div className="team-score team2">
            <h3>{teams.team2}</h3>
            <div className="score-edit">
              <button onClick={() => setScores(s => ({ ...s, team2: Math.max(0, s.team2 - 100) }))}>-</button>
              <p>{scores.team2}</p>
              <button onClick={() => setScores(s => ({ ...s, team2: s.team2 + 100 }))}>+</button>
            </div>
          </div>
        </div>
        <div className="questions-horizontal-grid" style={{ padding: '10px 2px', marginTop: 10 }}>
          <div className="categories-row" style={{ marginBottom: 6 }}>
            {selectedCategories.map(categoryId => {
              const category = allSubcategories.find(sub => sub.id === categoryId);
              const categoryData = Object.values(basicCategories).find(cat =>
                cat.subcategories.some(sub => sub.id === categoryId)
              );
              return (
                <div key={categoryId} className="category-header-horizontal" style={{ backgroundColor: categoryData?.color, minWidth: 80, padding: '6px 8px' }}>
                  <div className="category-icon">
                    <img src={category?.image} alt={category?.name} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  </div>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>{category?.name}</h3>
                </div>
              );
            })}
          </div>
          {pointValues.map(points => (
            <div className="questions-row" key={points} style={{ marginBottom: 4 }}>
              {selectedCategories.map(categoryId => {
                const questionId = `${categoryId}-${points}`;
                const isAnswered = answeredQuestions.has(questionId);
                return (
                  <div
                    key={questionId}
                    onClick={() => !isAnswered && selectQuestion(categoryId, points)}
                    className={`question-point-horizontal ${isAnswered ? 'answered' : ''}`}
                    style={{ minWidth: 80, fontSize: '1.1rem', padding: '10px 0' }}
                  >
                    {points}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default FridayChallenge;
