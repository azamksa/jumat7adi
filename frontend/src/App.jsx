import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import SetupPage from './components/SetupPage';
import QuestionsListPage from './components/QuestionsListPage';
import QuestionPage from './components/QuestionPage';
import AnswerPage from './components/AnswerPage';
import Login from './components/Login';
import ThemeToggle from './components/ThemeToggle';
import { basicCategories } from './data/categories';
import { questions } from './data/questions';

const API_URL = 'http://localhost:5000';

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
  const [solvedQuestionIds, setSolvedQuestionIds] = useState(new Set());
  const [activeTeam, setActiveTeam] = useState('team1');
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState('');
  const [categoryPickerTeam, setCategoryPickerTeam] = useState(Math.random() < 0.5 ? 'team1' : 'team2');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [userBundles, setUserBundles] = useState({});

  const timerRef = useRef(null);

  // ==================== Authentication & User Recovery ====================
  useEffect(() => {
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    
    if (savedAccessToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // جلب الأسئلة المحلولة سابقاً
        fetchSolvedQuestions(userData.id, savedAccessToken);
        // جلب أرقام الحزم الحالية
        fetchUserBundles(userData.id, savedAccessToken);
        console.log('✅ User restored from localStorage');
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        localStorage.clear();
      }
    }
  }, []);

  // ==================== Fetch Solved Questions ====================
  const fetchSolvedQuestions = async (userId, accessToken) => {
    try {
      const response = await fetch(`${API_URL}/api/solved-questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        // تأكد أن البيانات array قبل إنشاء Set
        const solvedIds = Array.isArray(data.solvedQuestionIds) ? data.solvedQuestionIds : [];
        setSolvedQuestionIds(new Set(solvedIds));
        console.log('✅ Solved questions loaded:', solvedIds.length);
      }
    } catch (error) {
      console.error('❌ Error fetching solved questions:', error);
      // لا تتوقف إذا فشل تحميل الأسئلة المحلولة
    }
  };

  // ==================== Fetch User Bundles ====================
  const fetchUserBundles = async (userId, accessToken) => {
    try {
      const response = await fetch(`${API_URL}/api/bundle-progress/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserBundles(data.bundles || {});
        console.log('✅ User bundles loaded:', data.bundles);
      }
    } catch (error) {
      console.error('❌ Error fetching bundles:', error);
    }
  };

  // ==================== Timer Effect ====================

  // ==================== Timer Effect ====================
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

  // ==================== Game Logic ====================

  const handleTimerEnd = () => {
    if (activeTeam === categoryPickerTeam) {
      setActiveTeam(categoryPickerTeam === 'team1' ? 'team2' : 'team1');
      setTimer(30);
    } else {
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
        const bundleNumber = userBundles[category] || 0;
        const question = questions[category]?.packages[bundleNumber]?.find(q => q.points === points);
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

  const answerQuestion = async (correct, team = null) => {
    if (correct && team) {
      setScores(prev => ({
        ...prev,
        [team]: prev[team] + currentQuestion.points
      }));
    }

    // حفظ الأسئلة المحلولة
    setSolvedQuestionIds(prev => new Set([...prev, currentQuestion.id]));
    setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));

    setFadeOut(true);
    setTimeout(() => {
      setCurrentQuestion(null);
      setShowAnswer(false);
      setCategoryPickerTeam(prev => prev === 'team1' ? 'team2' : 'team1');
      
      if (answeredQuestions.size + 1 >= selectedCategories.length * 6) {
        // زيادة أرقام الحزم قبل حفظ جلسة اللعب
        if (user && selectedCategories.length > 0) {
          incrementUserBundles();
        }
        // حفظ جلسة اللعب قبل الذهاب لصفحة النتائج
        if (user) {
          saveGameSession();
        }
        setGameState('results');
      } else {
        setGameState('game');
      }
      setFadeOut(false);
    }, 400);
  };

  // ==================== Increment User Bundles ====================
  const incrementUserBundles = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      for (let categoryId of selectedCategories) {
        await fetch(`${API_URL}/api/bundle-progress/increment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ categoryId })
        });
      }
      
      // إعادة جلب الأرقام
      if (user) {
        await fetchUserBundles(user.id, accessToken);
      }
      console.log('✅ Bundle numbers incremented');
    } catch (error) {
      console.error('❌ Error incrementing bundles:', error);
    }
  };

  // ==================== Save Game Session ====================
  const saveGameSession = async () => {
    if (!user) return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_URL}/api/save-game-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          team1Name: teams.team1,
          team2Name: teams.team2,
          selectedCategories,
          solvedQuestions: Array.from(answeredQuestions).map(id => ({
            questionId: id,
            category: id.split('-')[0],
            solvedAt: new Date()
          })),
          team1Score: scores.team1,
          team2Score: scores.team2,
          winner: scores.team1 > scores.team2 ? teams.team1 : 
                  scores.team2 > scores.team1 ? teams.team2 : 'تعادل'
        })
      });

      if (response.status === 201) {
        console.log('✅ Game session saved');
      }
    } catch (error) {
      console.error('❌ Error saving game session:', error);
    }
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

  // ==================== User Authentication ====================
  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setError('');
    console.log('✅ User logged in:', userData);
    
    // جلب الأسئلة المحلولة سابقاً
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && userData.id) {
      fetchSolvedQuestions(userData.id, accessToken);
    }
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowLogin(false);
    setError('');
    console.log('✅ User registered:', userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setSolvedQuestionIds(new Set());
    setError('');
    setShowLogin(false);
    resetGame();
    console.log('✅ User logged out successfully');
  };

  // إذا طُلبت صفحة تسجيل الدخول، اعرضها
  if (showLogin) {
    return (
      <>
        <ThemeToggle position="login" />
        <Login 
          onLogin={handleLogin}
          onRegister={handleRegister}
          error={error}
          setError={setError}
        />
      </>
    );
  }

  // اعرض اللعبة (بغض النظر عن تسجيل الدخول)
  return (
    <div className="app" style={{
      animation: fadeOut ? 'fadeOut 0.3s ease-out forwards' : 'fadeIn 0.4s ease-in',
      opacity: 1
    }}>
      {gameState === 'setup' && <ThemeToggle position="home" />}
      {gameState === 'game' && <ThemeToggle position="questions" />}
      {gameState === 'question' && <ThemeToggle position="hidden" />}
      {gameState === 'answer' && <ThemeToggle position="hidden" />}
      {gameState === 'results' && <ThemeToggle position="home" />}
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
