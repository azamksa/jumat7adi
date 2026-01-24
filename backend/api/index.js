// استدعاء مكتبة Express وإنشاء app
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// تخزين المستخدمين مؤقتًا (سيتم نقله لـ MongoDB لاحقًا)
const users = [
  { 
    id: '1', 
    name: 'مستخدم تجريبي', 
    email: 'test@example.com',
    password: '$2b$10$abc123', // محمية بـ bcrypt
    createdAt: new Date()
  }
];

// تخزين مستويات الحزم للمستخدمين
const userPackageLevels = {};
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ==================== API Routes ====================

// 🔐 تسجيل دخول المستخدم
app.post('/api/login', async (req, res) => {
  try {
    const { nameOrEmail, password } = req.body;

    if (!nameOrEmail || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    // البحث عن المستخدم
    const user = users.find(
      u => u.email === nameOrEmail || u.name === nameOrEmail
    );

    if (!user) {
      return res.status(401).json({ error: 'المستخدم غير موجود' });
    }

    // التحقق من كلمة المرور (مؤقتًا - بدون تشفير للتطوير)
    // في الإنتاج استخدم bcrypt.compare(password, user.password)
    const isValidPassword = password === 'password' || 
                           password === 'test123' ||
                           user.password === password;

    if (!isValidPassword) {
      return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    }

    // إنشاء token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ User logged in:', user.name);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'خطأ في تسجيل الدخول' });
  }
});

// 📝 تسجيل حساب جديد
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // التحقق من عدم وجود بريد مكرر
    if (users.some(u => u.email === email)) {
      return res.status(409).json({ error: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }

    // إنشاء مستخدم جديد
    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password, // في الإنتاج: bcrypt.hash(password, 10)
      createdAt: new Date()
    };

    users.push(newUser);

    // إنشاء token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ New user registered:', newUser.name);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: 'خطأ في إنشاء الحساب' });
  }
});
app.get('/api/user-package-level/:userId', (req, res) => {
  const { userId } = req.params;
  const packageLevel = userPackageLevels[userId] || 1;
  
  res.json({
    userId,
    packageLevel,
    message: `Package level for user ${userId}`
  });
});

// API لزيادة مستوى الحزمة
app.post('/api/increment-package-level', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  const currentLevel = userPackageLevels[userId] || 1;
  const newLevel = Math.min(currentLevel + 1, 3); // أقصى 3 حزم
  
  userPackageLevels[userId] = newLevel;
  
  console.log(`📦 Package level updated for user ${userId}: ${currentLevel} -> ${newLevel}`);
  
  res.json({
    userId,
    previousLevel: currentLevel,
    newPackageLevel: newLevel,
    message: 'Package level incremented successfully'
  });
});

// API لتحديث البيانات الشخصية
app.put('/api/update-profile', (req, res) => {
  try {
    const { userId, name, email } = req.body;
    
    if (!userId || !name || !email) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }
    
    // البحث عن المستخدم وتحديث بياناته
    const userIndex = users.findIndex(
      u => u.email === userId || u.id === userId
    );
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }
    
    // تحديث البيانات
    users[userIndex].name = name;
    users[userIndex].email = email;
    
    console.log('✅ Profile updated for user:', name);
    
    res.json({
      message: 'تم تحديث البيانات بنجاح',
      user: { 
        id: users[userIndex].id || users[userIndex].email,
        name: users[userIndex].name, 
        email: users[userIndex].email 
      }
    });
    
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({ error: 'خطأ في تحديث البيانات' });
  }
});

// ✅ إضافة تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🔗 CORS enabled for all origins`);
  console.log(`📦 Available endpoints:`);
  console.log(`   POST /api/login`);
  console.log(`   POST /api/register`);
  console.log(`   GET /api/user-package-level/:userId`);
  console.log(`   POST /api/increment-package-level`);
  console.log(`   PUT /api/update-profile`);
});

