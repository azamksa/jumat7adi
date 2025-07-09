import React, { useState, useEffect, useRef } from 'react';

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
  const [user, setUser] = useState({ id: 1, name: "مستخدم تجريبي" }); // مؤقتاً لتجربة الواجهة

  const timerRef = useRef(null);

  // بيانات الفئات
  const basicCategories = {
    'رياضة': {
      icon: '/images/saudi-league.png',
      color: '#4CAF50',
      subcategories: [
        { id: 'saudi_league', name: 'الدوري السعودي', image: '/images/saudi-league.png' },
        { id: 'english_league', name: 'الدوري الإنجليزي', image: '/images/english-league.png' },
        { id: 'clasico', name: 'الكلاسيكو', image: '/images/clasico.png' },
        { id: 'world_cup', name: 'كأس العالم', image: '/images/world-cup.png' },
        { id: 'champions', name: 'دوري الأبطال', image: '/images/champions.png' }
      ]
    },
    'أفلام': {
      icon: '🎬',
      color: '#9C27B0',
      subcategories: [
        { id: 'hollywood', name: 'هوليوود', image: '🎭' },
        { id: 'arabic_movies', name: 'أفلام عربية', image: '🎪' },
        { id: 'animation', name: 'أفلام الرسوم المتحركة', image: '🎨' },
        { id: 'action', name: 'أفلام الأكشن', image: '💥' },
        { id: 'comedy', name: 'أفلام الكوميديا', image: '😂' }
      ]
    },
    'موضة': {
      icon: '👗',
      color: '#E91E63',
      subcategories: [
        { id: 'luxury_brands', name: 'العلامات الفاخرة', image: '💎' },
        { id: 'street_fashion', name: 'موضة الشارع', image: '👟' },
        { id: 'accessories', name: 'الإكسسوارات', image: '👜' },
        { id: 'beauty', name: 'الجمال والعناية', image: '💄' },
        { id: 'fashion_history', name: 'تاريخ الموضة', image: '🕰️' }
      ]
    },
    'مطبخ': {
      icon: '🍳',
      color: '#FF9800',
      subcategories: [
        { id: 'arabic_cuisine', name: 'المطبخ العربي', image: '🥘' },
        { id: 'international', name: 'المطبخ العالمي', image: '🌍' },
        { id: 'desserts', name: 'الحلويات', image: '🍰' },
        { id: 'healthy_food', name: 'الطعام الصحي', image: '🥗' },
        { id: 'cooking_tips', name: 'نصائح الطبخ', image: '👨‍🍳' }
      ]
    },
    'تكنولوجيا': {
      icon: '💻',
      color: '#00b4d8',
      subcategories: [
        { id: 'smartphones', name: 'الهواتف الذكية', image: '📱' },
        { id: 'internet', name: 'الإنترنت', image: '🌐' }
      ]
    },
    'تاريخ': {
      icon: '🏺',
      color: '#b68900',
      subcategories: [
        { id: 'arab_history', name: 'تاريخ العرب', image: '🕌' }
      ]
    },
    'رياضيات': {
      icon: '➗',
      color: '#43aa8b',
      subcategories: [
        { id: 'math_easy', name: 'رياضيات سهلة', image: '🔢' },
        { id: 'math_hard', name: 'رياضيات صعبة', image: '🧮' }
      ]
    },
    'موسيقى': {
      icon: '🎵',
      color: '#ffb300',
      subcategories: [
        { id: 'arabic_music', name: 'موسيقى عربية', image: '🪘' },
        { id: 'international_music', name: 'موسيقى عالمية', image: '🎸' }
      ]
    }
  };

  // الأسئلة (مثال، أضف المزيد حسب الحاجة)
  const questions = {
    saudi_league: {
      300: { question: 'ما هو لقب نادي الهلال؟', answer: 'الزعيم' },
      400: { question: 'ما هو اسم ملعب نادي الهلال الرئيسي؟', answer: 'الأمير فيصل بن فهد' },
      500: { question: 'من هو الهداف التاريخي لنادي الهلال؟', answer: 'سامي الجابر' },
      600: { question: 'كم مرة فاز الهلال بالدوري السعودي حتى عام 2023؟', answer: '18 مرة' },
      700: { question: 'في أي عام تأسس نادي الهلال؟', answer: '1957' },
      800: { question: 'من هو أول مدرب أجنبي لنادي الهلال؟', answer: 'ماريو زاجالو' }
    },
    english_league: {
      300: { question: 'أي نادي يلعب في ملعب أولد ترافورد؟', answer: 'مانشستر يونايتد' },
      400: { question: 'كم فريق يلعب في الدوري الإنجليزي الممتاز؟', answer: '20 فريق' },
      500: { question: 'من هو الهداف التاريخي للدوري الإنجليزي؟', answer: 'آلان شيرير' },
      600: { question: 'في أي عام بدأ الدوري الإنجليزي الممتاز؟', answer: '1992' },
      700: { question: 'أي فريق فاز بالدوري الإنجليزي بدون هزيمة؟', answer: 'آرسنال (2003-2004)' },
      800: { question: 'من هو أصغر لاعب سجل هدف في الدوري الإنجليزي؟', answer: 'جيمس فوغان' }
    },
    clasico: {
      300: { question: 'ما هو اسم مباراة ريال مدريد وبرشلونة؟', answer: 'الكلاسيكو' },
      400: { question: 'في أي ملعب يلعب ريال مدريد؟', answer: 'سانتياغو برنابيو' },
      500: { question: 'من هو الهداف التاريخي لمباريات الكلاسيكو؟', answer: 'ليونيل ميسي' },
      600: { question: 'كم مرة فاز ريال مدريد بدوري أبطال أوروبا؟', answer: '15 مرة' },
      700: { question: 'من هو أكثر لاعب شارك في مباريات الكلاسيكو؟', answer: 'سيرجيو راموس' },
      800: { question: 'ما هو أكبر فوز في تاريخ الكلاسيكو؟', answer: 'ريال مدريد 11-1 برشلونة (1943)' }
    },
    world_cup: {
      300: { question: 'كم سنة تقام كأس العالم؟', answer: 'كل 4 سنوات' },
      400: { question: 'أي منتخب فاز بكأس العالم 2022؟', answer: 'الأرجنتين' },
      500: { question: 'من هو الهداف التاريخي لكأس العالم؟', answer: 'ميروسلاف كلوزه' },
      600: { question: 'كم مرة فازت البرازيل بكأس العالم؟', answer: '5 مرات' },
      700: { question: 'من هو أصغر لاعب سجل في كأس العالم؟', answer: 'بيليه' },
      800: { question: 'أي منتخب فاز بأول كأس عالم؟', answer: 'الأوروغواي (1930)' }
    },
    champions: {
      300: { question: 'ما هو اسم دوري أبطال أوروبا بالإنجليزية؟', answer: 'Champions League' },
      400: { question: 'أي نادي فاز بدوري الأبطال 2023؟', answer: 'مانشستر سيتي' },
      500: { question: 'من هو الهداف التاريخي لدوري الأبطال؟', answer: 'كريستيانو رونالدو' },
      600: { question: 'كم مرة فاز ليفربول بدوري الأبطال؟', answer: '6 مرات' },
      700: { question: 'ما هو أكبر فوز في تاريخ دوري الأبطال؟', answer: 'برشلونة 7-1 باير ليفركوزن' },
      800: { question: 'من هو أصغر لاعب سجل في دوري الأبطال؟', answer: 'أنسو فاتي' }
    },
    math_easy: {
      300: { question: 'ما هو ناتج 2 + 2؟', answer: '4' },
      400: { question: 'ما هو العدد الزوجي بين 1 و 10؟', answer: '2, 4, 6, 8, 10' },
      500: { question: 'كم زاوية توجد في مثلث قائم الزاوية؟', answer: '2 زاوية' },
      600: { question: 'إذا كان لديك 3 تفاحات وأعطيت صديقك واحدة، كم تفاحة تبقى لديك؟', answer: '2 تفاحة' },
      700: { question: 'ما هو العدد الذي يأتي بعد 9 مباشرة؟', answer: '10' },
      800: { question: 'إذا كانت الساعة الآن 3:00، فمتى ستكون بعد ساعتين؟', answer: '5:00' }
    },
    math_hard: {
      300: { question: 'ما نتيجة 12 × 12؟', answer: '144' },
      400: { question: 'كم يساوي الجذر التربيعي لـ 169؟', answer: '13' },
      500: { question: 'ما هو العدد الأولي التالي بعد 17؟', answer: '19' },
      600: { question: 'ما هو ناتج 7 × 8 × 2؟', answer: '112' },
      700: { question: 'ما هو حاصل قسمة 144 على 12؟', answer: '12' },
      800: { question: 'ما هو العدد الذي إذا ضربته بنفسه يعطي 225؟', answer: '15' }
    },
    arab_history: {
      300: { question: 'من هو مؤسس الدولة الأموية؟', answer: 'معاوية بن أبي سفيان' },
      400: { question: 'ما هي العاصمة الأولى للدولة العباسية؟', answer: 'الكوفة' },
      500: { question: 'من هو القائد الذي فتح الأندلس؟', answer: 'طارق بن زياد' },
      600: { question: 'ما هي المعركة التي انتصر فيها المسلمون على الفرس عام 636م؟', answer: 'معركة القادسية' },
      700: { question: 'من هو الصحابي الذي لقب بـ "أسد الله"؟', answer: 'حمزة بن عبد المطلب' },
      800: { question: 'ما هي السنة التي هاجر فيها النبي محمد إلى المدينة المنورة؟', answer: '622م' }
    },
    arabic_music: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    }
  };

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
    const questionId = `${category}-${points}`;
    if (!answeredQuestions.has(questionId)) {
      const question = questions[category]?.[points];
      if (question) {
        setCurrentQuestion({ ...question, category, points, id: questionId });
        setGameState('question');
        setTimer(60);
        setIsTimerPaused(false);
        setShowAnswer(false);
        setActiveTeam(categoryPickerTeam); // الفريق الذي اختار الفئة يبدأ
      }
    }
  };

  const answerQuestion = (correct, team = null) => {
    if (correct && team) {
      setScores(prev => ({
        ...prev,
        [team]: prev[team] + currentQuestion.points
      }));
    }
    setAnsweredQuestions(prev => {
      const newSet = new Set([...prev, currentQuestion.id]);
      if (newSet.size >= selectedCategories.length * 6) {
        setGameState('results');
      } else {
        setGameState('game');
      }
      return newSet;
    });
    setCurrentQuestion(null);
    setShowAnswer(false);
    setCategoryPickerTeam(prev => prev === 'team1' ? 'team2' : 'team1');
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

  // صفحة تسجيل الدخول (مؤقت)
  if (!user) {
    return (
      <div className="login-container">
        <h2>تسجيل الدخول</h2>
        <button className="start-button" onClick={() => setUser({ id: 1, name: "مستخدم تجريبي" })}>
          دخول تجريبي
        </button>
      </div>
    );
  }

  // صفحة الإعداد
  if (gameState === 'setup') {
    const allSubcategories = Object.values(basicCategories).flatMap(cat => cat.subcategories);
    return (
      <div className="game-container">
        <div className="header">
          <div className="title-container">
            <h1 className="game-title">تحدي الجمعة</h1>
            <p className="subtitle">لعبة الأسئلة التنافسية</p>
          </div>
        </div>

        {/* شرح طريقة اللعبة */}
        <div className="card instructions-card">
          <h2>طريقة اللعب</h2>
          <div className="instructions-grid">
            <div className="instruction">
              <div className="icon">👥</div>
              <h3>الفرق</h3>
              <p>يجب أن يكون هناك فريقين، كل فريق يتكون من لاعبين أو أكثر</p>
            </div>
            <div className="instruction">
              <div className="icon">⭐</div>
              <h3>اختيار الفئات</h3>
              <p>يجب اختيار 6 فئات متنوعة من القائمة المتاحة</p>
            </div>
            <div className="instruction">
              <div className="icon">⏱️</div>
              <h3>وقت الإجابة</h3>
              <p>كل سؤال له 60 ثانية للإجابة، مع خيارات للتحكم في الوقت</p>
            </div>
          </div>
        </div>

        {/* فريق الإدخال */}
        <div className="card setup-card">
          <h2>إدخال أسماء الفرق</h2>
          <div className="team-inputs">
            <div className="input-group">
              <label>الفريق الأول</label>
              <input
                type="text"
                placeholder="اسم الفريق الأول"
                value={teams.team1}
                onChange={(e) => handleTeamNameChange('team1', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>الفريق الثاني</label>
              <input
                type="text"
                placeholder="اسم الفريق الثاني"
                value={teams.team2}
                onChange={(e) => handleTeamNameChange('team2', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* اختيار الفئات */}
        <div className="card setup-card">
          <h2>اختيار الفئات</h2>
          <p className="selection-info">
            اختر 6 فئات من القائمة أدناه
            {selectedCategories.length > 0 && <span> (تم اختيار {selectedCategories.length})</span>}
          </p>
          <div className="categories-grid">
            {Object.entries(basicCategories).map(([category, data]) => (
              <div key={category} className="category-card" style={{ backgroundColor: data.color }}>
                <div className="category-header">
                  <span className="category-icon">{category}</span>
                </div>
                <div className="subcategories">
                  {data.subcategories.map((subcat) => {
                    const isSelected = selectedCategories.includes(subcat.id);
                    return (
                      <div
                        key={subcat.id}
                        onClick={() => isSelected ? removeCategorySelection(subcat.id) : handleCategorySelection(subcat.id)}
                        className={`subcategory ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="subcategory-content" style={{ flexDirection: 'column', alignItems: 'center' }}>
                          <img src={subcat.image} alt={subcat.name} className="subcategory-img" />
                          <span className="subcategory-name" style={{ marginTop: 8 }}>{subcat.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الفئات المختارة */}
        {selectedCategories.length > 0 && (
          <div className="card setup-card">
            <h2>الفئات المختارة</h2>
            <div className="selected-categories">
              {selectedCategories.map(id => {
                const subcategory = allSubcategories.find(sub => sub.id === id);
                return (
                  <div key={id} className="selected-category">
                    <span className="category-icon">{subcategory?.image}</span>
                    <span>{subcategory?.name}</span>
                    <button onClick={() => removeCategorySelection(id)} className="remove-btn">&times;</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* زر بدء اللعبة */}
        <div className="start-button-container">
          <button
            onClick={startGame}
            disabled={selectedCategories.length !== 6 || !teams.team1 || !teams.team2}
            className="start-button"
          >
            ابدأ اللعبة
          </button>
        </div>

        {/* عرض الرسائل الخطأ */}
        {error && (
          <div className="notification-bar">
            {error}
          </div>
        )}
      </div>
    );
  }

  // صفحة اللعبة
  if (gameState === 'game') {
    const allSubcategories = Object.values(basicCategories).flatMap(cat => cat.subcategories);
    const pointValues = [300, 400, 500, 600, 700, 800];
    return (
      <div className="game-container">
        {/* شريط النقاط */}
        <div className="score-board">
          <div className="team-score team1">
            <h3>{teams.team1}</h3>
            <div className="score-edit">
              <button onClick={() => setScores(s => ({ ...s, team1: Math.max(0, s.team1 - 100) }))}>-</button>
              <p>{scores.team1}</p>
              <button onClick={() => setScores(s => ({ ...s, team1: s.team1 + 100 }))}>+</button>
            </div>
          </div>
          <div className="game-title-container">
            <h2>تحدي الجمعة</h2>
            <div className="turn-indicator">
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

        {/* شبكة الأسئلة بشكل أفقي */}
        <div className="questions-horizontal-grid">
          {/* صف الفئات */}
          <div className="categories-row">
            {selectedCategories.map(categoryId => {
              const category = allSubcategories.find(sub => sub.id === categoryId);
              const categoryData = Object.values(basicCategories).find(cat =>
                cat.subcategories.some(sub => sub.id === categoryId)
              );
              return (
                <div key={categoryId} className="category-header-horizontal" style={{ backgroundColor: categoryData?.color }}>
                  <div className="category-icon">{category?.image}</div>
                  <h3>{category?.name}</h3>
                </div>
              );
            })}
          </div>
          {/* صفوف الأسئلة */}
          {pointValues.map(points => (
            <div className="questions-row" key={points}>
              {selectedCategories.map(categoryId => {
                const questionId = `${categoryId}-${points}`;
                const isAnswered = answeredQuestions.has(questionId);
                return (
                  <div
                    key={questionId}
                    onClick={() => !isAnswered && selectQuestion(categoryId, points)}
                    className={`question-point-horizontal ${isAnswered ? 'answered' : ''}`}
                  >
                    {points}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="category-picker-info">
          <strong>دور اختيار الفئة:</strong> {teams[categoryPickerTeam]}
        </div>
        <div className="turn-indicator">
          <span className="arrow">{categoryPickerTeam === 'team1' ? '⬅️' : '➡️'}</span>
          <span className="turn-team">{teams[categoryPickerTeam]} يختار الفئة ويبدأ الإجابة</span>
        </div>
      </div>
    );
  }

  // صفحة السؤال
  if (gameState === 'question') {
    return (
      <div className="question-container">
        <div className="question-card">
          <div className="question-header">
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
            <div className="question-text big-question">
              {currentQuestion.question}
            </div>
          </div>
          <div className="timer-controls">
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
                <p>{currentQuestion.answer}</p>
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

  // صفحة النتائج
  if (gameState === 'results') {
    const winner = scores.team1 > scores.team2 ? teams.team1 : scores.team2 > scores.team1 ? teams.team2 : null;
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
              <div className="score-value">{scores.team1}</div>
              <p>نقطة</p>
            </div>
            <div className="vs-text">VS</div>
            <div className="team-score-card team2-score">
              <h3>{teams.team2}</h3>
              <div className="score-value">{scores.team2}</div>
              <p>نقطة</p>
            </div>
          </div>
          <button onClick={resetGame} className="new-game-btn">
            لعبة جديدة
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default FridayChallenge;

// إضافة الأنماط إلى DOM
const styles = `
  body {
    background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c);
    min-height: 100vh;
    color: white;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .game-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
  }
  .title-container {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 20px;
    padding: 20px;
    display: inline-block;
  }
  .game-title {
    font-size: 3.5rem;
    font-weight: 800;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    margin: 10px 0;
    color: #FFD700;
  }
  .subtitle {
    font-size: 1.5rem;
    color: #e0e0e0;
    margin-bottom: 10px;
  }
  .card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .setup-card h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    color: #FFD700;
  }
  .team-inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 768px) {
    .team-inputs {
      grid-template-columns: 1fr;
    }
  }
  .input-group {
    margin-bottom: 15px;
  }
  .input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 1.1rem;
  }
  .input-group input {
    width: 100%;
    padding: 12px 15px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  .input-group input:focus {
    outline: none;
    border-color: #4cc9f0;
    box-shadow: 0 0 0 3px rgba(76, 201, 240, 0.3);
  }
  .selection-info {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: #e0e0e0;
  }
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  .category-card {
    border-radius: 15px;
    padding: 20px;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  .category-icon {
    font-size: 2rem;
  }
  .category-card h3 {
    font-size: 1.5rem;
    margin: 0;
  }
  .subcategories {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .subcategory {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 12px;
    transition: all 0.3s ease;
  }
  .subcategory:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
  }
  .subcategory.selected {
    background: rgba(76, 201, 240, 0.3);
    border: 2px solid #4cc9f0;
  }
  .subcategory-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .subcategory-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #FFD700;
    background: #fff;
    box-shadow: 0 2px 8px #0002;
    margin-bottom: 5px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .subcategory-name {
    font-size: 1.1rem;
    font-weight: 500;
  }
  .error-message {
    color: #ff5252;
    background: #fff3;
    padding: 10px 20px;
    border-radius: 10px;
    margin: 10px 0 20px 0;
    text-align: center;
    font-weight: bold;
  }
  .selected-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }
  .selected-category {
    background: linear-gradient(45deg, #4361ee, #3a0ca3);
    padding: 10px 20px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    font-size: 1.1rem;
  }
  .remove-btn {
    background: transparent;
    border: none;
    color: #FFD700;
    font-size: 1.5rem;
    cursor: pointer;
    margin-right: 5px;
  }
  .instructions-grid {
    display: flex;
    gap: 30px;
    justify-content: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .instruction {
    background: rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 18px 24px;
    min-width: 180px;
    text-align: center;
  }
  .instruction .icon {
    font-size: 2.2rem;
    margin-bottom: 10px;
    display: block;
  }
  .start-button-container {
    text-align: center;
    margin-top: 20px;
  }
  .start-button {
    background: linear-gradient(90deg, #FFD700, #ffb300);
    color: #222;
    font-size: 1.4rem;
    font-weight: bold;
    border: none;
    border-radius: 30px;
    padding: 16px 50px;
    cursor: pointer;
    box-shadow: 0 2px 10px #0002;
    transition: background 0.2s;
  }
  .start-button:disabled {
    background: #888;
    color: #fff;
    cursor: not-allowed;
  }
  .score-board {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;
  }
  .team-score {
    background: rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 18px 24px;
    min-width: 180px;
    text-align: center;
  }
  .score-edit {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }
  .score-edit button {
    background: #fff;
    color: #222;
    border: 2px solid #FFD700;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, border 0.2s;
    box-shadow: 0 2px 8px #0001;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .score-edit button:hover {
    background: #FFD700;
    color: #222;
    border: 2px solid #fff;
  }
  .game-title-container {
    text-align: center;
    flex: 1;
  }
  .questions-horizontal-grid {
    margin-top: 30px;
    background: rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 20px 10px;
    box-shadow: 0 2px 10px #0002;
  }
  .categories-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 12px;
  }
  .category-header-horizontal {
    background: rgba(0,0,0,0.12);
    border-radius: 12px;
    padding: 10px 18px;
    text-align: center;
    min-width: 120px;
  }
  .questions-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 8px;
  }
  .question-point-horizontal {
    background: linear-gradient(90deg, #FFD700, #ffb300);
    color: #222;
    font-size: 1.3rem;
    font-weight: bold;
    border-radius: 12px;
    padding: 16px 0;
    min-width: 80px;
    text-align: center;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 2px 8px #0001;
    border: none;
    user-select: none;
  }
  .question-point-horizontal.answered {
    background: #888;
    color: #fff;
    cursor: not-allowed;
    text-decoration: line-through;
  }
  .category-picker-info {
    text-align: center;
    font-size: 1.3rem;
    margin-bottom: 10px;
    color: #FFD700;
    font-weight: bold;
  }
  .turn-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #222b;
    border-radius: 16px;
    padding: 16px 32px;
    margin: 0 auto 24px auto;
    font-size: 1.5rem;
    font-weight: bold;
    color: #FFD700;
    max-width: 500px;
    box-shadow: 0 2px 10px #0002;
  }
  .turn-indicator .arrow {
    font-size: 2.2rem;
    margin: 0 16px;
  }
  .question-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  .question-card {
    background: rgba(0, 10, 20, 0.92);
    border-radius: 30px;
    padding: 50px 30px;
    max-width: 900px;
    width: 100%;
    min-height: 500px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .question-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }
  .back-button {
    background: transparent;
    border: none;
    color: #FFD700;
    font-size: 1.3rem;
    cursor: pointer;
    font-weight: bold;
  }
  .team-turn {
    flex: 1;
    text-align: center;
    font-size: 1.3rem;
    color: #FFD700;
    font-weight: bold;
  }
  .timer-display {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.5rem;
    color: #FFD700;
    font-weight: bold;
  }
  .timer-icon {
    font-size: 1.7rem;
  }
  .question-content {
    text-align: center;
    margin-bottom: 30px;
  }
  .question-points-display {
    font-size: 1.2rem;
    color: #FFD700;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .big-question {
    font-size: 3.2rem;
    font-weight: bold;
    color: #fff;
    margin: 40px 0 20px 0;
    word-break: break-word;
  }
  @media (max-width: 600px) {
    .big-question {
      font-size: 1.7rem;
    }
    .question-card { padding: 20px 5px; }
  }
  .timer-controls {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 20px;
  }
  .control-btn {
    background: #FFD700;
    color: #222;
    border: none;
    border-radius: 20px;
    padding: 10px 22px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }
  .control-btn:hover {
    background: #fff;
    color: #FFD700;
  }
  .answer-section {
    margin-top: 30px;
    text-align: center;
  }
  .correct-answer {
    font-size: 1.3rem;
    color: #FFD700;
    margin-bottom: 18px;
  }
  .answer-options {
    display: flex;
    gap: 18px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .answer-btn {
    background: #fff;
    color: #222;
    border: none;
    border-radius: 20px;
    padding: 12px 30px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    margin-bottom: 10px;
  }
  .answer-btn.team1-btn { background: #4CAF50; color: #fff; }
  .answer-btn.team2-btn { background: #9C27B0; color: #fff; }
  .answer-btn.no-answer-btn { background: #888; color: #fff; }
  .answer-btn:hover { opacity: 0.85; }
  .results-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  .results-card {
    background: rgba(0, 10, 20, 0.92);
    border-radius: 30px;
    padding: 50px 30px;
    max-width: 700px;
    width: 100%;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  .trophy-animation {
    font-size: 4rem;
    margin-bottom: 20px;
    animation: bounce 1.2s infinite alternate;
  }
  @keyframes bounce {
    0% { transform: translateY(0);}
    100% { transform: translateY(-15px);}
  }
  .winner-title {
    font-size: 2.5rem;
    color: #FFD700;
    margin-bottom: 10px;
  }
  .winner-subtitle {
    font-size: 1.3rem;
    color: #fff;
    margin-bottom: 30px;
  }
  .scores-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin-bottom: 30px;
  }
  .team-score-card {
    background: rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 18px 24px;
    min-width: 120px;
    text-align: center;
  }
  .score-value {
    font-size: 2.2rem;
    color: #FFD700;
    font-weight: bold;
    margin: 10px 0;
  }
  .vs-text {
    font-size: 2rem;
    color: #FFD700;
    font-weight: bold;
    margin: 0 20px;
  }
  .new-game-btn {
    background: linear-gradient(90deg, #FFD700, #ffb300);
    color: #222;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-radius: 30px;
    padding: 14px 40px;
    cursor: pointer;
    box-shadow: 0 2px 10px #0002;
    transition: background 0.2s;
  }
  .login-container {
    max-width: 400px;
    margin: 80px auto;
    background: rgba(0,0,0,0.7);
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  .notification-bar {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff5252;
    color: #fff;
    padding: 16px 32px;
    border-radius: 16px;
    font-size: 1.2rem;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 2px 12px #0003;
    animation: fadeInDown 0.5s;
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px) translateX(-50%);}
    to { opacity: 1; transform: translateY(0) translateX(-50%);}
  }
`;

if (typeof window !== "undefined") {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}