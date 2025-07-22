import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SetupPage from './components/SetupPage';
import Login from './components/Login';


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
    'أفلام ومسلسلات': {
      icon: '🎬',
      color: '#9C27B0',
      subcategories: [
        { id: 'hollywood', name: 'هوليوود', image: '/images/hollywood.png' },
        { id: 'TvShow', name: 'مسلسلات', image: '/images/TvShow.png' },
        { id: 'animation', name: 'الرسوم المتحركة', image: '/images/animation.png' },
        { id: 'game_of_thrones', name: 'قيم اوف ثرونز', image: '/images/game_of_thrones.png' },
        { id: 'breaking_bad', name: 'بريكن باد', image: '/images/breaking_bad.png' },
        { id: 'from', name: 'فروم', image: '/images/from.png' },
      ]
    },
    'العالم': {
      icon: '👗',
      color: '#E91E63',
      subcategories: [
        { id: 'flags', name: 'اعلام دول', image: '/images/flags.png' },
        { id: 'icons', name: 'شعارات دول', image: '/images/icons.png' },
        { id: 'Tourist_attractions', name: 'معالم سياحية', image: '/images/Tourist_attractions.png' },
        { id: 'capital', name: 'عاصمة', image: '/images/capital.png' },
        { id: 'map', name: 'الخريطة', image: '/images/map.png' }
      ]
    },
    'مطبخ': {
      icon: '🍳',
      color: '#FF9800',
      subcategories: [
        { id: 'arabic_cuisine', name: 'المطبخ العربي', image: '/images/arabic_cuisine.png' },
        { id: 'international', name: 'المطبخ العالمي', image: '/images/international.png' },
        { id: 'desserts', name: 'الحلويات', image: '/images/desserts.png' },
        { id: 'what_is_the_food', name: 'وش الاكله', image: '/images/what_is_the_food.png' },
      ]
    },
    // 'تكنولوجيا': {
    //   icon: '💻',
    //   color: '#00b4d8',
    //   subcategories: [
    //     { id: 'smartphones', name: 'الهواتف الذكية', image: '/images/champions.png' },
    //     { id: 'internet', name: 'الإنترنت', image: '/images/champions.png' }
    //   ]
    // },
    // 'تاريخ': {
    //   icon: '🏺',
    //   color: '#b68900',
    //   subcategories: [
    //     { id: 'arab_history', name: 'تاريخ العرب', image: '/images/champions.png' }
    //   ]
    // },
    // 'رياضيات': {
    //   icon: '➗',
    //   color: '#43aa8b',
    //   subcategories: [
    //     { id: 'math_easy', name: 'رياضيات سهلة', image: '/images/champions.png' },
    //     { id: 'math_hard', name: 'رياضيات صعبة', image: '/images/champions.png' }
    //   ]
    // },
    // 'موسيقى': {
    //   icon: '🎵',
    //   color: '#ffb300',
    //   subcategories: [
    //     { id: 'arabic_music', name: 'موسيقى عربية', image: '/images/champions.png' },
    //     { id: 'international_music', name: 'موسيقى عالمية', image: '/images/champions.png' }
    //   ]
    // }
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
    hollywood: {
      300: { question: 'ما هو ناتج 2 + 2؟', answer: '4' },
      400: { question: 'ما هو العدد الزوجي بين 1 و 10؟', answer: '2, 4, 6, 8, 10' },
      500: { question: 'كم زاوية توجد في مثلث قائم الزاوية؟', answer: '2 زاوية' },
      600: { question: 'إذا كان لديك 3 تفاحات وأعطيت صديقك واحدة، كم تفاحة تبقى لديك؟', answer: '2 تفاحة' },
      700: { question: 'ما هو العدد الذي يأتي بعد 9 مباشرة؟', answer: '10' },
      800: { question: 'إذا كانت الساعة الآن 3:00، فمتى ستكون بعد ساعتين؟', answer: '5:00' }
    },
    animation: {
      300: { question: 'ما نتيجة 12 × 12؟', answer: '144' },
      400: { question: 'كم يساوي الجذر التربيعي لـ 169؟', answer: '13' },
      500: { question: 'ما هو العدد الأولي التالي بعد 17؟', answer: '19' },
      600: { question: 'ما هو ناتج 7 × 8 × 2؟', answer: '112' },
      700: { question: 'ما هو حاصل قسمة 144 على 12؟', answer: '12' },
      800: { question: 'ما هو العدد الذي إذا ضربته بنفسه يعطي 225؟', answer: '15' }
    },
    game_of_thrones: {
      300: { question: 'من هو مؤسس الدولة الأموية؟', answer: 'معاوية بن أبي سفيان' },
      400: { question: 'ما هي العاصمة الأولى للدولة العباسية؟', answer: 'الكوفة' },
      500: { question: 'من هو القائد الذي فتح الأندلس؟', answer: 'طارق بن زياد' },
      600: { question: 'ما هي المعركة التي انتصر فيها المسلمون على الفرس عام 636م؟', answer: 'معركة القادسية' },
      700: { question: 'من هو الصحابي الذي لقب بـ "أسد الله"؟', answer: 'حمزة بن عبد المطلب' },
      800: { question: 'ما هي السنة التي هاجر فيها النبي محمد إلى المدينة المنورة؟', answer: '622م' }
    },
    breaking_bad: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    from: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    flags: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    icons: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    Tourist_attractions: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    capital: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    map: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    arabic_cuisine: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    international: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    desserts: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
    what_is_the_food: {
      300: { question: 'من هو فنان العرب؟', answer: 'محمد عبده' },
      400: { question: 'ما اسم آلة موسيقية وترية مشهورة في العالم العربي؟', answer: 'العود' },
      500: { question: 'من غنى أغنية الأماكن؟', answer: 'محمد عبده' },
      600: { question: 'من هو ملحن النشيد الوطني السعودي؟', answer: 'سراج عمر' },
      700: { question: 'ما اسم أول ألبوم للفنان عبدالمجيد عبدالله؟', answer: 'سيد أهلي' },
      800: { question: 'من هو مؤسس فرقة الأخوة البحرينية؟', answer: 'ناصر صالح' }
    },
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
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10000 }}>
          {user ? (
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
          ) : null}
        </div>
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
      </>
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

  // صفحة السؤال (تظهر إذا كان هناك سؤال أو إذا كنا نعرض الإجابة)
  if (gameState === 'question' && (currentQuestion || showAnswer)) {
    return (
      <div className="question-container">
        <div className="question-card" style={{maxWidth: 1100, minHeight: 600, padding: '60px 30px'}}>
          <div className="question-header" style={{marginBottom: 20}}>
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
            <div className="question-text big-question" style={{fontSize: '2.5rem', margin: '30px 0'}}>
              {currentQuestion.question}
            </div>
            {/* مستقبلاً: صورة أو فيديو للسؤال */}
            {currentQuestion.image && (
              <img src={currentQuestion.image} alt="" style={{maxWidth: '100%', borderRadius: 16, margin: '20px auto'}} />
            )}
            {currentQuestion.video && (
              <video src={currentQuestion.video} controls style={{maxWidth: '100%', borderRadius: 16, margin: '20px auto'}} />
            )}
          </div>
          <div className="timer-controls" style={{marginBottom: 10}}>
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

  // صفحة الأسئلة
  if (gameState === 'game') {
    const allSubcategories = Object.values(basicCategories).flatMap(cat => cat.subcategories);
    const pointValues = [300, 400, 500, 600, 700, 800];
    return (
      <div className="game-container">
        <div className="score-board" style={{marginBottom: 18}}>
          <div className="team-score team1">
            <h3>{teams.team1}</h3>
            <div className="score-edit">
              <button onClick={() => setScores(s => ({ ...s, team1: Math.max(0, s.team1 - 100) }))}>-</button>
              <p>{scores.team1}</p>
              <button onClick={() => setScores(s => ({ ...s, team1: s.team1 + 100 }))}>+</button>
            </div>
          </div>
          <div className="game-title-container">
            <h2 style={{marginBottom: 6}}>تحدي الجمعة</h2>
            <div className="turn-indicator" style={{margin: 0, fontSize: '1.1rem', padding: '8px 12px'}}>
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
        <div className="questions-horizontal-grid" style={{padding: '10px 2px', marginTop: 10}}>
          <div className="categories-row" style={{marginBottom: 6}}>
            {selectedCategories.map(categoryId => {
              const category = allSubcategories.find(sub => sub.id === categoryId);
              const categoryData = Object.values(basicCategories).find(cat =>
                cat.subcategories.some(sub => sub.id === categoryId)
              );
              return (
                <div key={categoryId} className="category-header-horizontal" style={{ backgroundColor: categoryData?.color, minWidth: 80, padding: '6px 8px' }}>
                  <div className="category-icon">
                    <img src={category?.image} alt={category?.name} style={{width: 48, height: 48, borderRadius: '50%'}} />
                  </div>
                  <h3 style={{fontSize: '1rem', margin: 0}}>{category?.name}</h3>
                </div>
              );
            })}
          </div>
          {pointValues.map(points => (
            <div className="questions-row" key={points} style={{marginBottom: 4}}>
              {selectedCategories.map(categoryId => {
                const questionId = `${categoryId}-${points}`;
                const isAnswered = answeredQuestions.has(questionId);
                return (
                  <div
                    key={questionId}
                    onClick={() => !isAnswered && selectQuestion(categoryId, points)}
                    className={`question-point-horizontal ${isAnswered ? 'answered' : ''}`}
                    style={{minWidth: 80, fontSize: '1.1rem', padding: '10px 0'}}
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

