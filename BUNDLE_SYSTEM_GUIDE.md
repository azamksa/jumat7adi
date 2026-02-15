# 🔧 دليل تفعيل نظام الحزم (Bundles System)

---

## 📌 ملخص سريع

**الحالة الحالية:**
- البيانات تحتوي على `packages[0], packages[1], packages[2]...` ✅
- لكن الـ Frontend يستخدم فقط `packages[0]` دائماً ❌

**المطلوب:**
- ربط Bundle Number مع المستخدم
- زيادة Bundle عند انتهاء اللعبة بنفس الفئة
- عدم تكرار الأسئلة

---

## 🔍 كيف يعمل النظام

### المثال الواضح:

```
مستخدم: أحمد
الفئة: الدوري السعودي

اللعبة الأولى:
├─ يستخدم: packages[0] (الحزمة الأولى)
├─ 6 أسئلة جديدة
└─ انتهى ← حفظ bundleNumber = 1

اللعبة الثانية:
├─ يستخدم: packages[1] (الحزمة الثانية)
├─ 6 أسئلة جديدة تماماً
└─ انتهى ← حفظ bundleNumber = 2

اللعبة الثالثة:
├─ يستخدم: packages[2] (الحزمة الثالثة)
├─ 6 أسئلة جديدة تماماً
└─ انتهى ← حفظ bundleNumber = 3

وهكذا...
```

---

## 🛠️ الخطوات العملية

### الخطوة 1: تحديث Backend (API)

**الملف:** `backend/api/index.js`

**التعديل المطلوب:**

```javascript
// 1. أضف schema جديد لتتبع الحزم
const bundleProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: false
  },
  categoryId: {
    type: String,
    required: true
  },
  currentBundleNumber: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'bundle_progress' });

const BundleProgress = mongoose.model('BundleProgress', bundleProgressSchema);

// 2. أضف endpoint جديد لجلب رقم الحزمة الحالية
app.get('/api/bundle-progress/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // جلب جميع حزم المستخدم
    const bundleProgress = await BundleProgress.find({ userId });
    
    // تحويل إلى object سهل الاستخدام
    const bundleMap = {};
    bundleProgress.forEach(item => {
      bundleMap[item.categoryId] = item.currentBundleNumber;
    });
    
    res.json({
      userId,
      bundles: bundleMap,
      totalCategories: bundleProgress.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. أضف endpoint لزيادة الحزمة بعد الانتهاء من اللعبة
app.post('/api/bundle-progress/increment', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { categoryId } = req.body;
    
    // جد البند الموجود أو أنشئ جديد
    let bundleProgress = await BundleProgress.findOne({ userId, categoryId });
    
    if (!bundleProgress) {
      bundleProgress = new BundleProgress({
        userId,
        categoryId,
        currentBundleNumber: 1 // ابدأ من الحزمة الثانية (0 = الأولى)
      });
    } else {
      bundleProgress.currentBundleNumber += 1;
    }
    
    bundleProgress.updatedAt = new Date();
    await bundleProgress.save();
    
    res.json({
      message: 'تم زيادة الحزمة',
      categoryId,
      newBundleNumber: bundleProgress.currentBundleNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### الخطوة 2: تحديث Frontend - App.jsx

**الملف:** `frontend/src/App.jsx`

**التعديلات:**

```javascript
// أضف state جديد لتخزين أرقام الحزم
const [userBundles, setUserBundles] = useState({});

// عند تسجيل الدخول أو استعادة جلسة، جلب أرقام الحزم
useEffect(() => {
  const savedAccessToken = localStorage.getItem('accessToken');
  const savedUser = localStorage.getItem('user');
  
  if (savedAccessToken && savedUser) {
    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // 1. جلب الأسئلة المحلولة
      fetchSolvedQuestions(userData.id, savedAccessToken);
      
      // 2. جلب أرقام الحزم ⭐ جديد
      fetchUserBundles(userData.id, savedAccessToken);
      
      console.log('✅ User restored from localStorage');
    } catch (error) {
      console.error('❌ Error:', error);
      localStorage.clear();
    }
  }
}, []);

// دالة جديدة لجلب أرقام الحزم
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
      setUserBundles(data.bundles);
      console.log('✅ User bundles loaded:', data.bundles);
    }
  } catch (error) {
    console.error('❌ Error fetching bundles:', error);
  }
};

// تحديث دالة selectQuestion لاستخدام رقم الحزمة الصحيح
const selectQuestion = (category, points) => {
  console.log('Selecting question:', { category, points });
  setFadeOut(true);
  
  setTimeout(() => {
    const questionId = `${category}-${points}`;
    
    if (!answeredQuestions.has(questionId)) {
      // احصل على رقم الحزمة للفئة (default: 0 إذا لم توجد)
      const bundleNumber = userBundles[category] || 0;
      
      // جلب السؤال من الحزمة الصحيحة ⭐
      const question = questions[category]?.packages[bundleNumber]?.find(q => q.points === points);
      
      if (question) {
        setCurrentQuestion({
          ...question,
          category,
          id: questionId,
          bundleNumber // أضف رقم الحزمة للسؤال
        });
        setGameState('question');
        setTimer(60);
        setIsTimerPaused(false);
        setShowAnswer(false);
        setActiveTeam(categoryPickerTeam);
        setFadeOut(false);
      } else {
        console.warn(`❌ سؤال غير موجود: ${category} - points: ${points} - bundle: ${bundleNumber}`);
      }
    }
  }, 300);
};

// تحديث answerQuestion لزيادة الحزمة عند الانتهاء من جميع الأسئلة
const answerQuestion = async (correct, team = null) => {
  if (correct && team) {
    setScores(prev => ({
      ...prev,
      [team]: prev[team] + currentQuestion.points
    }));
  }

  setSolvedQuestionIds(prev => new Set([...prev, currentQuestion.id]));
  setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));

  setFadeOut(true);
  setTimeout(() => {
    setCurrentQuestion(null);
    setShowAnswer(false);
    setCategoryPickerTeam(prev => prev === 'team1' ? 'team2' : 'team1');
    
    // إذا انتهت اللعبة
    if (answeredQuestions.size + 1 >= selectedCategories.length * 6) {
      // زيادة أرقام الحزم لكل الفئات المختارة ⭐
      if (user && selectedCategories.length > 0) {
        incrementUserBundles();
      }
      
      // حفظ جلسة اللعب
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

// دالة جديدة لزيادة الحزم بعد انتهاء اللعبة
const incrementUserBundles = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    // زيادة رقم الحزمة لكل فئة تم لعبها
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
    
    // إعادة جلب أرقام الحزم المحدثة
    await fetchUserBundles(user.id, accessToken);
    console.log('✅ Bundle numbers incremented');
  } catch (error) {
    console.error('❌ Error incrementing bundles:', error);
  }
};
```

---

### الخطوة 3: نقل ملف البيانات إلى Backend

**ملاحظة:** الأسئلة الآن في `frontend/data/questions.js`

**الخطة المستقبلية:**
```
1. نقل الأسئلة من frontend إلى قاعدة البيانات
2. إنشاء admin panel لإضافة أسئلة جديدة
3. API لجلب الأسئلة من البيانات
```

**الآن:** الاحتفاظ بالأسئلة في frontend آمن (طالما الأسئلة ليست حساسة)

---

## 📋 اختبار التعديلات

### خطوات الاختبار:

```bash
# 1. ابدأ Backend
cd backend
npm start
# ستظهر: ✅ MongoDB connected

# 2. ابدأ Frontend (terminal جديد)
cd frontend
npm run dev
# اذهب إلى http://localhost:5173

# 3. اختبر النظام:
- تسجيل دخول (أو إنشاء حساب جديد)
- اختر 6 فئات (مثل: الدوري السعودي × 6)
- ابدأ لعبة أولى
- أكمل 6 أسئلة
- انتهِ من اللعبة
- ابدأ لعبة ثانية بنفس الفئات
  ✅ يجب أن ترى 6 أسئلة جديدة تماماً!

# 4. تحقق من الـ Console
- أسئلة جديدة يجب أن تظهر بـ bundleNumber: 1
- أول مرة يجب أن تكون bundleNumber: 0
```

---

## ⚠️ حالات خاصة

### إذا لم توجد حزمة (أكثر من 3 حزم)

```javascript
// في selectQuestion، إضافة check:
const bundleNumber = userBundles[category] || 0;
const availableBundles = questions[category]?.packages?.length || 0;

if (bundleNumber >= availableBundles) {
  // إرجاع إلى الحزمة الأولى (إعادة لعب)
  bundleNumber = 0;
}

const question = questions[category]?.packages[bundleNumber]?.find(...)
```

---

## 📊 قاعدة البيانات (MongoDB)

### مثال على الـ documents:

```javascript
// Bundle Progress Collection
{
  "_id": ObjectId("..."),
  "userId": "507f1f77bcf86cd799439011",
  "categoryId": "saudi_league",
  "currentBundleNumber": 2,
  "createdAt": "2026-02-10T10:00:00Z",
  "updatedAt": "2026-02-15T15:30:00Z"
}

{
  "_id": ObjectId("..."),
  "userId": "507f1f77bcf86cd799439011",
  "categoryId": "english_league",
  "currentBundleNumber": 1,
  "createdAt": "2026-02-11T10:00:00Z",
  "updatedAt": "2026-02-14T20:00:00Z"
}
```

---

## 🎯 النتيجة بعد التطبيق

```
✅ نظام حزم كامل يعمل
✅ عدم تكرار الأسئلة
✅ مستخدم يقدر يلعب آلاف الساعات
✅ إمكانية إضافة حزم جديدة بسهولة
✅ جاهز للإطلاق! 🚀
```

---

## 📝 الملفات المتأثرة

```
✏️ backend/api/index.js          (تعديل)
✏️ frontend/src/App.jsx          (تعديل)
✏️ frontend/src/data/questions.js (لا حاجة لتعديل - البيانات موجودة!)
```

---

**هل تريد أساعدك بتطبيق هذا الآن؟** 🚀

سأقوم بـ:
1. تحديث `backend/api/index.js` - إضافة endpoints جديدة
2. تحديث `frontend/src/App.jsx` - ربط Bundle System
3. اختبار شامل

**الوقت المتوقع:** 30 دقيقة ⚡
