import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

const Login = ({ onLogin, onRegister, error, setError }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nameOrEmail, setNameOrEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // رابط Backend الصحيح
  const API_URL = 'https://jumat7adi-rdyo.vercel.app';

  const handleLogin = async () => {
    if (!nameOrEmail || !password) {
      setError('يرجى إدخال الاسم أو البريد الإلكتروني وكلمة المرور');
      return;
    }
    if (nameOrEmail.includes('@') && !validateEmail(nameOrEmail)) {
      setError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameOrEmail, password })
      });

      const data = await response.json();
      
      // التحقق من حالة الاستجابة بدلاً من response.ok فقط
      if (response.status === 200 && data.token) {
        localStorage.setItem('token', data.token);
        setError('');
        onLogin(data.user);
      } else {
        setError(data.error || 'بيانات الدخول غير صحيحة');
      }
    } catch (error) {
      setError('فشل في الاتصال بالخادم');
      console.error('Login error:', error);
    }
  };

  const handleRegister = async () => {
    if (!name || !nameOrEmail || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (!validateEmail(nameOrEmail)) {
      setError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: nameOrEmail, password })
      });

      const data = await response.json();
      
      // التحقق من حالة الاستجابة
      if (response.status === 201 && data.user) {
        setError('');
        onRegister(data.user);
      } else {
        setError(data.error || 'فشل في إنشاء الحساب');
      }
    } catch (error) {
      setError('فشل في الاتصال بالخادم');
      console.error('Register error:', error);
    }
  };

  return (
    <div className="login-container">
      {/* Header مصغر */}
      <div className="login-header">
        <div className="title-container">
          <h1 className="game-title">تحدي الجمعة</h1>
          <p className="subtitle">🎮 منافسة ثقافية ممتعة</p>
        </div>
      </div>

      {/* كارت تسجيل الدخول مصغر */}
      <div className="login-card">
        {error && (
          <div className="error-message full-width">
            ⚠️ {error}
          </div>
        )}

        <div className="form-container">
          {/* حقل الاسم للتسجيل الجديد */}
          {isRegistering && (
            <div className="input-group">
              <label className="input-label">
                <User size={20} />
                الاسم الكامل
              </label>
              <input
                type="text"
                placeholder="أدخل اسمك الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="game-input"
              />
            </div>
          )}

          {/* حقل البريد الإلكتروني */}
          <div className={isRegistering ? "input-group" : "input-group full-width"}>
            <label className="input-label">
              <Mail size={20} />
              {isRegistering ? 'البريد الإلكتروني' : 'البريد أو اسم المستخدم'}
            </label>
            <input
              type="text"
              placeholder={isRegistering ? 'example@email.com' : 'البريد أو اسم المستخدم'}
              value={nameOrEmail}
              onChange={(e) => setNameOrEmail(e.target.value)}
              className="game-input"
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className="input-group">
            <label className="input-label">
              <Lock size={20} />
              كلمة المرور
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="game-input password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* تأكيد كلمة المرور للتسجيل الجديد */}
          {isRegistering && (
            <div className="input-group">
              <label className="input-label">
                <Lock size={20} />
                تأكيد كلمة المرور
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="game-input password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* أزرار الإجراء */}
          <div className="form-actions">
            <button
              onClick={isRegistering ? handleRegister : handleLogin}
              className="primary-button"
            >
              {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
              <span>{isRegistering ? 'إنشاء الحساب' : 'دخول'}</span>
            </button>

            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setName('');
                setNameOrEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="secondary-button"
            >
              {isRegistering ? 'لديك حساب؟ سجل دخول' : 'مستخدم جديد؟ أنشئ حساب'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
