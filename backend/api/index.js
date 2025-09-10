const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/friday-challenge');

// موديل المستخدم
const User = mongoose.model('User', {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({ message: 'Friday Challenge Backend is running on Vercel! 🚀' });
});

// API endpoints
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// تسجيل مستخدم جديد
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'المستخدم موجود بالفعل' });
    }
    
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // إنشاء المستخدم
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ 
      message: 'تم إنشاء المستخدم بنجاح', 
      user: { name, email } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تسجيل الدخول
app.post('/api/login', async (req, res) => {
  try {
    const { nameOrEmail, password } = req.body;
    
    // البحث عن المستخدم
    const user = await User.findOne({
      $or: [{ email: nameOrEmail }, { name: nameOrEmail }]
    });
    
    if (!user) {
      return res.status(400).json({ error: 'المستخدم غير موجود' });
    }
    
    // التحقق من كلمة المرور
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'كلمة مرور خاطئة' });
    }
    
    // إنشاء JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret-key');
    
    res.json({ 
      message: 'تم تسجيل الدخول بنجاح',
      token, 
      user: { name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// تصدير التطبيق كـ serverless function
module.exports = app;
