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
  const [user, setUser] = useState(null); // لا يوجد مستخدم افتراضي
  const [showLogout, setShowLogout] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // تحكم في ظهور صفحة الدخول
  const [loginName, setLoginName] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const timerRef = useRef(null);

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
      setShowAnswer(true);
      // احذف أي انتقال تلقائي هنا
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
    console.log('Selecting question:', { category, points }); // إضافة للتتبع
    const questionId = `${category}-${points}`;
    
    if (!answeredQuestions.has(questionId)) {
      // البحث عن السؤال في ملف الأسئلة
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
      }
    }
  };

  // تصحيح العودة للأسئلة بعد الإجابة أو انتهاء الوقت
  const answerQuestion = (correct, team = null) => {
    if (correct && team) {
      setScores(prev => ({
        ...prev,
        [team]: prev[team] + currentQuestion.points
      }));
    }
    setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
    setCurrentQuestion(null);
    setShowAnswer(false);
    setCategoryPickerTeam(prev => prev === 'team1' ? 'team2' : 'team1');

    // بعد تحديد النتيجة، ارجع مباشرة لصفحة الأسئلة
    setTimeout(() => {
      // إذا انتهت كل الأسئلة انتقل للنتائج، غير ذلك ارجع لقائمة الأسئلة
      if (answeredQuestions.size + 1 >= selectedCategories.length * 6) {
        setGameState('results');
      } else {
        setGameState('game');
      }
    }, 400); // تأخير بسيط ليظهر زر النتيجة للمستخدم
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

  // صفحة تسجيل الدخول (تظهر فقط عند الضغط على زر تسجيل الدخول)
  if (showLogin) {
    const handleLogin = ({ nameOrEmail, password }) => {
      if (nameOrEmail && password) {
        setUser({ id: Date.now(), name: nameOrEmail });
        setShowLogin(false);
        setError('');
      } else {
        setError('يرجى إدخال جميع البيانات');
      }
    };

    const handleRegister = ({ name, email, password }) => {
      setUser({ id: Date.now(), name });
      setShowLogin(false);
      setError('');
    };

    return (
      <Login
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={error}
        setError={setError}
      />
    );
  }

  // الصفحة الرئيسية (الإعداد)
  if (gameState === 'setup') {
    return (
      <>
        <UserMenu user={user} setUser={setUser} setShowLogin={setShowLogin} showLogout={showLogout} setShowLogout={setShowLogout} />
        <SetupPage
          teams={teams}
          selectedCategories={selectedCategories}
          basicCategories={basicCategories}
          handleTeamNameChange={handleTeamNameChange}
          handleCategorySelection={handleCategorySelection}
          startGame={startGame}
          error={error}
          setShowLogin={setShowLogin}
          user={user}
        />
        {/* <Footer /> */}
      </>
    );
  }

  // صفحة الأسئلة
  if (gameState === 'game') {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        background: 'linear-gradient(135deg, #1a1e5b, #862d2d)'
      }}>
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
      </div>
    );
  }

  // صفحة عرض السؤال
  if (gameState === 'question' && currentQuestion && !showAnswer) {
    return (
      <QuestionPage
        currentQuestion={currentQuestion}
        timer={timer}
        isTimerPaused={isTimerPaused}
        togglePauseTimer={togglePauseTimer}
        resetTimer={resetTimer}
        skipTime={skipTime}
        setGameState={setGameState}
        activeTeam={activeTeam}
        teams={teams}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        
      />
    );
  }

  // صفحة عرض الإجابة
  if (showAnswer) {
    return (
      <AnswerPage
        currentQuestion={currentQuestion}
        teams={teams}
        activeTeam={activeTeam}
        answerQuestion={answerQuestion}
        setShowAnswer={setShowAnswer}  // تأكد من تمرير هذا
        setGameState={setGameState}    // وهذا أيضاً
      />
    );
  }

  // صفحة النتائج
  if (gameState === 'results') {
    return (
      <ResultsPage
        teams={teams}
        scores={scores}
        resetGame={resetGame}
      />
    );
  }
};

// كومبوننت القائمة العلوية للمستخدم
const UserMenu = ({ user, setUser, setShowLogin, showLogout, setShowLogout }) => {
  if (!user) return null;
  
  return (
    <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10000 }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <span
          onClick={() => setShowLogout(!showLogout)}
          style={{
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '8px 16px',
            userSelect: 'none',
          }}
        >
          {user.name || user.email}
        </span>
        {showLogout && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#333',
              padding: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 1000,
            }}
            onClick={() => {
              setUser(null);
              setShowLogout(false);
              setShowLogin(false);
            }}
          >
            تسجيل الخروج
          </div>
        )}
      </div>
    </div>
  );
};

// كومبوننت الفوتر


export default FridayChallenge;
