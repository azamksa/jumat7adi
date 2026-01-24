import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import SetupPage from './components/SetupPage';
import QuestionsListPage from './components/QuestionsListPage';
import QuestionPage from './components/QuestionPage';
import AnswerPage from './components/AnswerPage';
import Login from './components/Login';
import { basicCategories } from './data/categories';
import { questions } from './data/questions';

const FridayChallenge = () => {
  const [gameState, setGameState] = useState('setup');
  const [fadeOut, setFadeOut] = useState(false);
  const [teams, setTeams] = useState({ team1: '', team2: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [activeTeam, setActiveTeam] = useState('team1');
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState('');
  const [categoryPickerTeam, setCategoryPickerTeam] = useState(Math.random() < 0.5 ? 'team1' : 'team2');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const timerRef = useRef(null);

  // فحص localStorage عند تشغيل التطبيق
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        console.log('✅ User restored from localStorage');
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        localStorage.clear();
      }
    }
  }, []);

  useEffect(() => {
    if (timer > 0 && !isTimerPaused && gameState === 'question') {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && gameState === 'question') {
      handleTimerEnd();
    }

    return () => clearTimeout(timerRef.current);
  }, [timer, gameState, isTimerPaused]);

  const handleTimerEnd = () => {
    if (activeTeam === categoryPickerTeam) {
      setActiveTeam(categoryPickerTeam === 'team1' ? 'team2' : 'team1');
      setTimer(30);
    } else {
      // انتقل لصفحة الإجابة تلقائياً
      setGameState('answer');
      setShowAnswer(true);
    }
  };

  const handleTeamNameChange = (team, name) => {
    setTeams(prev => ({ ...prev, [team]: name }));
  };

  const removeCategorySelection = (subcategoryId) => {
    setSelectedCategories(prev => prev.filter(id => id !== subcategoryId));
    setError('');
  };

  const handleCategorySelection = (subcategoryId) => {
    if (selectedCategories.includes(subcategoryId)) {
      removeCategorySelection(subcategoryId);
    } else if (selectedCategories.length < 6) {
      setSelectedCategories(prev => [...prev, subcategoryId]);
      setError('');
    } else {
      setError('لا يمكنك اختيار أكثر من 6 فئات!');
    }
  };

  const startGame = () => {
    // التحقق من تسجيل الدخول أولاً
    if (!user) {
      alert('يجب أن تقوم بتسجيل الدخول قبل بدء اللعب!');
      setShowLogin(true);
      return;
    }

    if (!teams.team1 || !teams.team2) {
      setError('يرجى إدخال أسماء الفريقين');
      return;
    }

    if (selectedCategories.length !== 6) {
      setError('يجب اختيار 6 فئات فقط');
      return;
    }

    setError('');
    setGameState('game');
  };

  const selectQuestion = (category, points) => {
    console.log('Selecting question:', { category, points });
    setFadeOut(true);
    setTimeout(() => {
      const questionId = `${category}-${points}`;
      if (!answeredQuestions.has(questionId)) {
        const question = questions[category]?.packages[0]?.find(q => q.points === points);
        if (question) {
          setCurrentQuestion({
            ...question,
            category,
            id: questionId
          });
          setGameState('question');
          setTimer(60);
          setIsTimerPaused(false);
          setShowAnswer(false);
          setActiveTeam(categoryPickerTeam);
          setFadeOut(false);
        }
      }
    }, 300);
  };

  const answerQuestion = (correct, team = null) => {
    if (correct && team) {
      setScores(prev => ({
        ...prev,
        [team]: prev[team] + currentQuestion.points
      }));
    }

    setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
    setFadeOut(true);
    setTimeout(() => {
      setCurrentQuestion(null);
      setShowAnswer(false);
      setCategoryPickerTeam(prev => prev === 'team1' ? 'team2' : 'team1');
      
      if (answeredQuestions.size + 1 >= selectedCategories.length * 6) {
        setGameState('results');
      } else {
        setGameState('game');
      }
      setFadeOut(false);
    }, 400);
  };

  const resetGame = () => {
    setGameState('setup');
    setTeams({ team1: '', team2: '' });
    setSelectedCategories([]);
    setScores({ team1: 0, team2: 0 });
    setCurrentQuestion(null);
    setAnsweredQuestions(new Set());
    setActiveTeam('team1');
    setCategoryPickerTeam(Math.random() < 0.5 ? 'team1' : 'team2');
    setError('');
  };

  const skipTime = () => {
    handleTimerEnd();
  };

  const togglePauseTimer = () => {
    setIsTimerPaused(!isTimerPaused);
  };

  const resetTimer = () => {
    setTimer(activeTeam === categoryPickerTeam ? 60 : 30);
  };

  // دالة تسجيل الدخول
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token || 'dummy-token');
    setShowLogin(false);
    setError('');
    console.log('✅ User logged in:', userData);
  };

  // دالة التسجيل
  const handleRegister = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token || 'dummy-token');
    setShowLogin(false);
    setError('');
    console.log('✅ User registered:', userData);
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setError('');
    setShowLogin(false);
    resetGame();
    console.log('✅ User logged out successfully');
  };

  // إذا طُلبت صفحة تسجيل الدخول، اعرضها
  if (showLogin) {
    return (
      <Login 
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={error}
        setError={setError}
      />
    );
  }

  // اعرض اللعبة (بغض النظر عن تسجيل الدخول)
  return (
    <div className="app" style={{
      animation: fadeOut ? 'fadeOut 0.3s ease-out forwards' : 'fadeIn 0.4s ease-in',
      opacity: 1
    }}>
      <style>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      {/* زر تسجيل الخروج (يظهر فقط إذا كان المستخدم مسجل دخول)
      {user && (
        <div className="simple-user-bar">
          <span className="user-greeting">مرحباً، {user.name}</span>
          <button 
            onClick={handleLogout}
            className="simple-logout-button"
          >
            تسجيل الخروج
          </button>
        </div>
      )} */}

      {gameState === 'setup' && (
        <SetupPage
          teams={teams}
          onTeamNameChange={handleTeamNameChange}
          selectedCategories={selectedCategories}
          onCategorySelection={handleCategorySelection}
          removeCategorySelection={removeCategorySelection}
          basicCategories={basicCategories}
          onStartGame={startGame}
          error={error}
          user={user}
          setShowLogin={() => setShowLogin(true)}
        />
      )}

      {gameState === 'game' && (
        <QuestionsListPage
          teams={teams}
          scores={scores}
          setScores={setScores}
          selectedCategories={selectedCategories}
          basicCategories={basicCategories}
          answeredQuestions={answeredQuestions}
          selectQuestion={selectQuestion}
          categoryPickerTeam={categoryPickerTeam}
          setCategoryPickerTeam={setCategoryPickerTeam}
        />
      )}

      {gameState === 'question' && currentQuestion && (
        <QuestionPage
          currentQuestion={currentQuestion}
          teams={teams}
          timer={timer}
          isTimerPaused={isTimerPaused}
          activeTeam={activeTeam}
          skipTime={skipTime}
          togglePauseTimer={togglePauseTimer}
          resetTimer={resetTimer}
          setGameState={setGameState}
          setShowAnswer={setShowAnswer}
        />
      )}

      {gameState === 'answer' && currentQuestion && (
        <AnswerPage
          currentQuestion={currentQuestion}
          teams={teams}
          scores={scores}
          answerQuestion={answerQuestion}
          setShowAnswer={setShowAnswer}
          setGameState={setGameState}
          resetTimer={resetTimer}
        />
      )}

      {gameState === 'results' && (
        <div className="results-page">
          <h1>النتائج النهائية</h1>
          <div className="final-scores">
            <div className="team-result">
              <h2>{teams.team1}</h2>
              <p>{scores.team1} نقطة</p>
            </div>
            <div className="team-result">
              <h2>{teams.team2}</h2>
              <p>{scores.team2} نقطة</p>
            </div>
          </div>
          <div className="winner">
            <h3>
              الفائز: {scores.team1 > scores.team2 ? teams.team1 : 
                      scores.team2 > scores.team1 ? teams.team2 : 'تعادل!'}
            </h3>
          </div>
          <button onClick={resetGame} className="reset-button">
            لعبة جديدة
          </button>
        </div>
      )}
    </div>
  );
};

export default FridayChallenge;
