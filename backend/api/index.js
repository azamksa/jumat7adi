// استدعاء المكتبات المطلوبة
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// ==================== Configuration ====================
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-token-key';
const BCRYPT_ROUNDS = 10;
const API_URL = process.env.API_URL || 'http://localhost:5000';

// ==================== Middleware ====================
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==================== MongoDB Connection ====================
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.log('⚠️ No MongoDB URI provided - Using in-memory storage (development only)');
}

// ==================== User Schema ====================
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    minlength: [2, 'الاسم يجب أن يكون 2 أحرف على الأقل'],
    maxlength: [50, 'الاسم يجب أن لا يزيد عن 50 حرف']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'البريد الإلكتروني غير صالح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
    select: false // لا نعيد كلمة المرور في الاستعلامات
  },
  phoneNumber: {
    type: String,
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  packageLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  gameHistory: [{
    date: Date,
    team1Name: String,
    team2Name: String,
    selectedCategories: [String],
    solvedQuestions: [{
      questionId: String,
      category: String,
      solvedAt: Date
    }],
    team1Score: Number,
    team2Score: Number,
    winner: String
  }],
  solvedQuestionIds: {
    type: [String],
    default: []
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockedUntil: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'users' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const hash = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// ==================== Bundle Progress Schema ====================
const bundleProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
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

// Compound index لتجنب التكرار
bundleProgressSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

const BundleProgress = mongoose.model('BundleProgress', bundleProgressSchema);

// Fallback in-memory storage for development
let users = [];
let userPackageLevels = {};
let bundleProgress = [];

// ==================== Helper Functions ====================

// Validation Functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // يجب أن تحتوي على: أحرف كبيرة، أحرف صغيرة، أرقام، 8 أحرف على الأقل
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Token generation
const generateTokens = (userId, email, name) => {
  const accessToken = jwt.sign(
    { id: userId, email, name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token مطلوب' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token غير صالح أو منتهي الصلاحية' });
  }
};

// ==================== User Database Functions ====================

const createUser = async (userData) => {
  if (mongoose.connection.readyState === 1) {
    // MongoDB متصل
    const user = new User(userData);
    return await user.save();
  } else {
    // Fallback to in-memory - تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);
    
    const id = String(Date.now());
    const newUser = {
      id,
      ...userData,
      password: hashedPassword, // ⭐ استبدال كلمة المرور بالمشفرة
      createdAt: new Date(),
      gameHistory: [],
      solvedQuestionIds: new Set(),
      loginAttempts: 0
    };
    users.push(newUser);
    return newUser;
  }
};

const findUserByEmail = async (email) => {
  if (mongoose.connection.readyState === 1) {
    return await User.findOne({ email: email.toLowerCase() }).select('+password');
  } else {
    return users.find(u => u.email === email.toLowerCase());
  }
};

const findUserById = async (id) => {
  if (mongoose.connection.readyState === 1) {
    return await User.findById(id);
  } else {
    return users.find(u => u.id === id);
  }
};

const updateUser = async (userId, updateData) => {
  if (mongoose.connection.readyState === 1) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  } else {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData, updatedAt: new Date() };
      return users[userIndex];
    }
    return null;
  }
};

// ==================== API Routes ====================

// 🔐 تسجيل دخول المستخدم (محسّن وآمن)
app.post('/api/login', async (req, res) => {
  try {
    const { emailOrName, password } = req.body;

    // التحقق من المدخلات
    if (!emailOrName || !password) {
      return res.status(400).json({ 
        error: 'البريد الإلكتروني أو الاسم وكلمة المرور مطلوبان' 
      });
    }

    // البحث عن المستخدم
    let user;
    if (emailOrName.includes('@')) {
      user = await findUserByEmail(emailOrName);
    } else {
      if (mongoose.connection.readyState === 1) {
        user = await User.findOne({ name: emailOrName }).select('+password');
      } else {
        user = users.find(u => u.name === emailOrName);
      }
    }

    if (!user) {
      return res.status(401).json({ 
        error: 'المستخدم غير موجود أو كلمة المرور غير صحيحة' 
      });
    }

    // التحقق من قفل الحساب
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      return res.status(429).json({ 
        error: 'الحساب مقفل مؤقتاً بسبب محاولات دخول متعددة خاطئة. حاول لاحقاً.' 
      });
    }

    // التحقق من كلمة المرور
    let isValidPassword = false;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB
      isValidPassword = await user.comparePassword(password);
    } else {
      // In-memory: compare directly with bcrypt
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!isValidPassword) {
      // زيادة عدد محاولات الفشل
      const attempts = (user.loginAttempts || 0) + 1;
      const updateData = { loginAttempts: attempts };

      // قفل الحساب بعد 5 محاولات فاشلة لمدة 15 دقيقة
      if (attempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        await updateUser(user.id, updateData);
        return res.status(429).json({ 
          error: 'تم قفل الحساب مؤقتاً بسبب محاولات دخول متعددة خاطئة' 
        });
      }

      await updateUser(user.id, updateData);
      return res.status(401).json({ 
        error: 'المستخدم غير موجود أو كلمة المرور غير صحيحة' 
      });
    }

    // إعادة تعيين محاولات الفشل
    await updateUser(user.id, {
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date()
    });

    // إنشاء التوكنات
    const { accessToken, refreshToken } = generateTokens(user._id || user.id, user.email, user.name);

    console.log('✅ User logged in:', user.name);

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        packageLevel: user.packageLevel,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'خطأ في تسجيل الدخول. يرجى المحاولة لاحقاً.' });
  }
});

// 📝 تسجيل حساب جديد (محسّن وآمن)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // التحقق من المدخلات
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // التحقق من صحة البيانات
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ 
        error: 'الاسم يجب أن يكون بين 2 و 50 حرف' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'البريد الإلكتروني غير صالح' 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'كلمة المرور يجب أن تحتوي على: أحرف كبيرة، أحرف صغيرة، أرقام، رموز خاصة، وتكون 8 أحرف على الأقل' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: 'كلمة المرور وتأكيدها غير متطابقين' 
      });
    }

    // التحقق من عدم وجود بريد مكرر
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'هذا البريد الإلكتروني مسجل بالفعل' 
      });
    }

    // إنشاء مستخدم جديد
    const newUser = await createUser({
      name,
      email: email.toLowerCase(),
      password,
      packageLevel: 1,
      gameHistory: [],
      solvedQuestionIds: []
    });

    // إنشاء التوكنات
    const { accessToken, refreshToken } = generateTokens(
      newUser._id || newUser.id, 
      newUser.email, 
      newUser.name
    );

    console.log('✅ New user registered:', newUser.name);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        packageLevel: newUser.packageLevel,
        profilePicture: newUser.profilePicture
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: 'خطأ في إنشاء الحساب. يرجى المحاولة لاحقاً.' });
  }
});

// 🔄 تحديث التوكن (Refresh Token)
app.post('/api/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token مطلوب' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const { accessToken } = generateTokens(decoded.id, decoded.email, decoded.name);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('❌ Refresh token error:', error);
    res.status(401).json({ error: 'Refresh token غير صالح أو منتهي الصلاحية' });
  }
});
app.get('/api/user-package-level/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // التحقق من أن المستخدم يطلب بياناته فقط
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'غير مصرح بالوصول' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json({
      userId,
      packageLevel: user.packageLevel,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('❌ Error getting package level:', error);
    res.status(500).json({ error: 'خطأ في جلب معلومات المستخدم' });
  }
});

// API لزيادة مستوى الحزمة
app.post('/api/increment-package-level', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    const currentLevel = user.packageLevel || 1;
    const newLevel = Math.min(currentLevel + 1, 3); // أقصى 3 حزم

    await updateUser(userId, { packageLevel: newLevel });

    console.log(`📦 Package level updated for user ${userId}: ${currentLevel} -> ${newLevel}`);

    res.json({
      userId,
      previousLevel: currentLevel,
      newPackageLevel: newLevel
    });
  } catch (error) {
    console.error('❌ Error incrementing package level:', error);
    res.status(500).json({ error: 'خطأ في تحديث مستوى الحزمة' });
  }
});

// API لتحديث البيانات الشخصية
app.put('/api/update-profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phoneNumber, profilePicture } = req.body;

    // التحقق من أن المستخدم يعدل بياناته فقط
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'غير مصرح بالوصول' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    // التحقق من صحة البيانات الجديدة
    if (name && (name.length < 2 || name.length > 50)) {
      return res.status(400).json({ 
        error: 'الاسم يجب أن يكون بين 2 و 50 حرف' 
      });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({ 
        error: 'البريد الإلكتروني غير صالح' 
      });
    }

    // تحديث البيانات
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const updatedUser = await updateUser(userId, updateData);

    console.log('✅ Profile updated for user:', updatedUser.name);

    res.json({
      message: 'تم تحديث البيانات بنجاح',
      user: {
        id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        profilePicture: updatedUser.profilePicture
      }
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ error: 'خطأ في تحديث البيانات' });
  }
});

// API لحفظ جلسة اللعب وتتبع الأسئلة المحلولة
app.post('/api/save-game-session', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { team1Name, team2Name, selectedCategories, solvedQuestions, team1Score, team2Score, winner } = req.body;

    if (!team1Name || !team2Name || !selectedCategories || !solvedQuestions) {
      return res.status(400).json({ error: 'بيانات الجلسة غير كاملة' });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    // حفظ جلسة اللعب
    const gameSession = {
      date: new Date(),
      team1Name,
      team2Name,
      selectedCategories,
      solvedQuestions,
      team1Score,
      team2Score,
      winner
    };

    // إضافة الأسئلة المحلولة إلى قائمة المستخدم
    const existingSolved = user.solvedQuestionIds || [];
    const newSolvedIds = solvedQuestions.map(q => q.questionId);
    const updatedSolvedQuestions = [...new Set([...existingSolved, ...newSolvedIds])];

    // تحديث بيانات المستخدم
    const updatedUser = await updateUser(userId, {
      gameHistory: [...(user.gameHistory || []), gameSession],
      solvedQuestionIds: updatedSolvedQuestions
    });

    console.log(`✅ Game session saved for user ${userId}`);

    res.status(201).json({
      message: 'تم حفظ جلسة اللعب بنجاح',
      gameSession
    });
  } catch (error) {
    console.error('❌ Error saving game session:', error);
    res.status(500).json({ error: 'خطأ في حفظ جلسة اللعب' });
  }
});

// API للحصول على الأسئلة المحلولة
app.get('/api/solved-questions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json({
      userId,
      solvedQuestionIds: user.solvedQuestionIds || [],
      totalSolved: (user.solvedQuestionIds || []).length,
      gameHistory: user.gameHistory || []
    });
  } catch (error) {
    console.error('❌ Error getting solved questions:', error);
    res.status(500).json({ error: 'خطأ في جلب الأسئلة المحلولة' });
  }
});

// API للحصول على الأسئلة الجديدة (غير محلولة)
app.get('/api/new-questions/:categoryId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId } = req.params;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    const solvedQuestionIds = user.solvedQuestionIds || [];

    res.json({
      userId,
      categoryId,
      solvedQuestionIds: solvedQuestionIds,
      message: 'استخدم قائمة solvedQuestionIds لتصفية الأسئلة الجديدة من قاعدة البيانات'
    });
  } catch (error) {
    console.error('❌ Error getting new questions:', error);
    res.status(500).json({ error: 'خطأ في جلب الأسئلة' });
  }
});

// ==================== Bundle Progress APIs ====================

// API 1: جلب أرقام الحزم الحالية للمستخدم
app.get('/api/bundle-progress/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    let bundleItems = [];
    
    // محاولة من MongoDB
    if (mongoose.connection.readyState === 1) {
      bundleItems = await BundleProgress.find({ userId });
    } else {
      // في-memory fallback
      bundleItems = bundleProgress.filter(item => item.userId === userId);
    }
    
    // تحويل إلى object سهل الاستخدام
    const bundleMap = {};
    bundleItems.forEach(item => {
      bundleMap[item.categoryId] = item.currentBundleNumber;
    });
    
    res.json({
      userId,
      bundles: bundleMap,
      totalCategories: bundleItems.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API 2: زيادة رقم الحزمة بعد اللعبة
app.post('/api/bundle-progress/increment', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { categoryId } = req.body;
    
    if (!categoryId) {
      return res.status(400).json({ error: 'categoryId مطلوب' });
    }
    
    // البحث أو الإنشاء
    let item = null;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB
      item = await BundleProgress.findOne({ userId, categoryId });
      
      if (!item) {
        item = new BundleProgress({
          userId,
          categoryId,
          currentBundleNumber: 1
        });
      } else {
        item.currentBundleNumber += 1;
      }
      
      item.updatedAt = new Date();
      await item.save();
    } else {
      // In-memory
      const existing = bundleProgress.findIndex(
        i => i.userId === userId && i.categoryId === categoryId
      );
      
      if (existing === -1) {
        item = {
          userId,
          categoryId,
          currentBundleNumber: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        bundleProgress.push(item);
      } else {
        bundleProgress[existing].currentBundleNumber += 1;
        bundleProgress[existing].updatedAt = new Date();
        item = bundleProgress[existing];
      }
    }
    
    res.json({
      message: 'تم زيادة الحزمة بنجاح',
      categoryId,
      newBundleNumber: item.currentBundleNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ إضافة تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🔗 CORS enabled for:`, process.env.FRONTEND_URL || 'http://localhost:5173');
  console.log(`📦 Database: ${mongoose.connection.readyState === 1 ? 'MongoDB' : 'In-Memory Storage'}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   POST   /api/login`);
  console.log(`   POST   /api/register`);
  console.log(`   POST   /api/refresh-token`);
  console.log(`   GET    /api/user-package-level/:userId`);
  console.log(`   POST   /api/increment-package-level`);
  console.log(`   PUT    /api/update-profile`);
  console.log(`   POST   /api/save-game-session`);
  console.log(`   GET    /api/solved-questions`);
  console.log(`   GET    /api/new-questions/:categoryId`);
});

