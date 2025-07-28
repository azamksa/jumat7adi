import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SetupPage from './components/SetupPage';
import QuestionsListPage from './components/QuestionsListPage';
import QuestionPage from './components/QuestionPage';
import AnswerPage from './components/AnswerPage';
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
        { id: 'saudi_league', name: 'الدوري السعودي', image: '/images/saudi-league.png', description: 'هذه الفئة ستحتوي على أسئلة في الدوري السعودي وما يشمله من أشياء لها علاقة به' },
        { id: 'english_league', name: 'الدوري الإنجليزي', image: '/images/english-league.png', description: 'هذه الفئة ستحتوي على أسئلة في الدوري الإنجليزي الممتاز وما يشمله من أشياء لها علاقة به' },
        { id: 'clasico', name: 'الكلاسيكو', image: '/images/clasico.png', description: 'هذه الفئة ستحتوي على أسئلة في مباريات الكلاسيكو بين ريال مدريد وبرشلونة' },
        { id: 'world_cup', name: 'كأس العالم', image: '/images/world-cup.png', description: 'هذه الفئة ستحتوي على أسئلة في بطولة كأس العالم لكرة القدم' },
        { id: 'champions', name: 'دوري الأبطال', image: '/images/champions.png', description: 'هذه الفئة ستحتوي على أسئلة في دوري أبطال أوروبا لكرة القدم' }
      ]
    },
    'أفلام ومسلسلات': {
      icon: '🎬',
      color: '#9C27B0',
      subcategories: [
        { id: 'hollywood', name: 'هوليوود', image: '/images/hollywood.png', description: 'هذه الفئة ستحتوي على أسئلة في أفلام هوليوود والمسلسلات' },
        { id: 'TvShow', name: 'مسلسلات', image: '/images/TvShow.png', description: 'هذه الفئة ستحتوي على أسئلة في المسلسلات التلفزيونية' },
        { id: 'animation', name: 'الرسوم المتحركة', image: '/images/animation.png', description: 'هذه الفئة ستحتوي على أسئلة في الرسوم المتحركة' },
        { id: 'game_of_thrones', name: 'قيم اوف ثرونز', image: '/images/game_of_thrones.png', description: 'هذه الفئة ستحتوي على أسئلة في مسلسل قيم اوف ثرونز' },
        { id: 'breaking_bad', name: 'بريكن باد', image: '/images/breaking_bad.png', description: 'هذه الفئة ستحتوي على أسئلة في مسلسل بريكن باد' },
        { id: 'from', name: 'فروم', image: '/images/from.png', description: 'هذه الفئة ستحتوي على أسئلة في مسلسل فروم' },
      ]
    },
    'العالم': {
      icon: '👗',
      color: '#E91E63',
      subcategories: [
        { id: 'flags', name: 'اعلام دول', image: '/images/flags.png', description: 'هذه الفئة ستحتوي على أسئلة في أعلام الدول' },
        { id: 'icons', name: 'شعارات دول', image: '/images/icons.png', description: 'هذه الفئة ستحتوي على أسئلة في شعارات الدول' },
        { id: 'Tourist_attractions', name: 'معالم سياحية', image: '/images/Tourist_attractions.png', description: 'هذه الفئة ستحتوي على أسئلة في المعالم السياحية' },
        { id: 'capital', name: 'عاصمة', image: '/images/capital.png', description: 'هذه الفئة ستحتوي على أسئلة في عواصم الدول' },
        { id: 'map', name: 'الخريطة', image: '/images/map.png', description: 'هذه الفئة ستحتوي على أسئلة في الخرائط' }
      ]
    },
    'مطبخ': {
      icon: '🍳',
      color: '#FF9800',
      subcategories: [
        { id: 'arabic_cuisine', name: 'المطبخ العربي', image: '/images/arabic_cuisine.png', description: 'هذه الفئة ستحتوي على أسئلة في المطبخ العربي' },
        { id: 'international', name: 'المطبخ العالمي', image: '/images/international.png', description: 'هذه الفئة ستحتوي على أسئلة في المطبخ العالمي' },
        { id: 'desserts', name: 'الحلويات', image: '/images/desserts.png', description: 'هذه الفئة ستحتوي على أسئلة في الحلويات' },
        { id: 'what_is_the_food', name: 'وش الاكله', image: '/images/what_is_the_food.png', description: 'هذه الفئة ستحتوي على أسئلة في الأكلات' },
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
        <Footer />
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
        setGameState={setGameState}
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
const Footer = () => (
  <footer style={{
    marginTop: 40,
    padding: '20px 0',
    textAlign: 'center',
    color: '#888',
    fontSize: '0.9rem',
    borderTop: '1px solid #444'
  }}>
    هذا الموقع مصمم من مطور سعودي لهدف إنشاء لعبة تجمع الأهل والأصدقاء للاستمتاع. جميع الحقوق محفوظة.
  </footer>
);

export default FridayChallenge;

