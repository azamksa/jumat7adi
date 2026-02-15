import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

const Login = ({ onLogin, onRegister, error, setError }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrName, setEmailOrName] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://localhost:5000';

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // تحقق من قوة كلمة المرور
  const validatePasswordStrength = (pwd) => {
    // يجب أن تحتوي على: أحرف كبيرة، أحرف صغيرة، أرقام، رموز خاصة، 8 أحرف
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const getPasswordStrengthMessage = () => {
    if (!password) return '';
    if (password.length < 8) return '❌ الحد الأدنى 8 أحرف';
    if (!/[A-Z]/.test(password)) return '❌ يجب أن تحتوي على أحرف كبيرة';
    if (!/[a-z]/.test(password)) return '❌ يجب أن تحتوي على أحرف صغيرة';
    if (!/\d/.test(password)) return '❌ يجب أن تحتوي على أرقام';
    if (!/[@$!%*?&]/.test(password)) return '❌ يجب أن تحتوي على رموز خاصة (@$!%*?&)';
    return '✅ كلمة مرور قوية';
  };

  const handleLogin = async () => {
    if (!emailOrName || !password) {
      setError('يرجى إدخال البريد الإلكتروني/الاسم وكلمة المرور');
      return;
    }

    if (emailOrName.includes('@') && !validateEmail(emailOrName)) {
      setError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrName, password })
      });

      const data = await response.json();

      if (response.status === 200 && data.accessToken) {
        // حفظ التوكنات بشكل آمن
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setError('');
        onLogin(data.user);
      } else {
        setError(data.error || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError('فشل في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !emailOrName || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    if (name.length < 2 || name.length > 50) {
      setError('الاسم يجب أن يكون بين 2 و 50 حرف');
      return;
    }

    if (!validateEmail(emailOrName)) {
      setError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }

    if (!validatePasswordStrength(password)) {
      setError('كلمة المرور ضعيفة جداً. يجب أن تحتوي على: أحرف كبيرة، صغيرة، أرقام، رموز خاصة');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: emailOrName,
          password,
          confirmPassword
        })
      });

      const data = await response.json();

      if (response.status === 201 && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setError('');
        onRegister(data.user);
      } else {
        setError(data.error || 'فشل إنشاء الحساب');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError('فشل في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden" style={{ fontFamily: "'Tajawal', 'Poppins', sans-serif" }}>
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-slate-900 via-blue-900 to-black relative overflow-hidden items-center justify-center p-12">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 900 }}>
              تحدي الجمعة
            </h1>
            <p className="text-xl text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 500 }}>منافسة ثقافية ممتعة وتحديات مثيرة</p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-8">
            <div className="flex items-center gap-3 text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              <span className="text-2xl">💡</span>
              <span>أسئلة متنوعة من مختلف الفئات</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              <span className="text-2xl">🏅</span>
              <span>تنافس مع الأصدقاء والعائلة</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              <span className="text-2xl">📊</span>
              <span>تتبع تقدمك وإحصائياتك</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              <span className="text-2xl">🛡️</span>
              <span>حساب آمن وموثوق تماماً</span>
            </div>
          </div>

          {/* Large emoji */}
          <div className="text-7xl">🎯</div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 900 }}>
              تحدي الجمعة
            </h1>
            <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>منافسة ثقافية ممتعة</p>
          </div>

          {/* Form Card */}
          <div className="space-y-6">
            {/* Tab Switcher */}
            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>
              <button
                onClick={() => {
                  if (isRegistering) {
                    setIsRegistering(false);
                    setError('');
                  }
                }}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${
                  !isRegistering
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                دخول
              </button>
              <button
                onClick={() => {
                  if (!isRegistering) {
                    setIsRegistering(true);
                    setError('');
                  }
                }}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${
                  isRegistering
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                تسجيل جديد
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3.5 flex gap-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                <span className="text-lg flex-shrink-0">❌</span>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Info Alert */}
            {isRegistering && !error && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3.5 flex gap-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                <span className="text-lg flex-shrink-0">✅</span>
                <div className="text-blue-300 text-sm">
                  <p>كلمة مرور قوية تحتوي على:</p>
                  <p className="text-xs mt-1 opacity-80">أحرف كبيرة وصغيرة + أرقام + رموز (@$!%*?&)</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); isRegistering ? handleRegister() : handleLogin(); }} style={{ fontFamily: "'Tajawal', sans-serif" }}>
              {/* Name Input - Register Only */}
              {isRegistering && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    placeholder="أحمد محمد"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                    disabled={isLoading}
                  />
                  {name && (name.length < 2 || name.length > 50) && (
                    <p className="text-red-400 text-xs" style={{ fontFamily: "'Tajawal', sans-serif" }}>الاسم يجب أن يكون بين 2 و 50 حرف</p>
                  )}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  placeholder={isRegistering ? 'example@email.com' : 'أدخل بريدك الإلكتروني'}
                  value={emailOrName}
                  onChange={(e) => setEmailOrName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  style={{ fontFamily: "'Tajawal', 'Poppins', sans-serif" }}
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-11"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3.5 text-gray-400 hover:text-blue-400 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isRegistering && password && (
                  <p className={`text-xs ${getPasswordStrengthMessage().includes('✅') ? 'text-green-400' : 'text-amber-400'}`} style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    {getPasswordStrengthMessage()}
                  </p>
                )}
              </div>

              {/* Confirm Password - Register Only */}
              {isRegistering && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300" style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600 }}>
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition pr-11"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-3.5 text-gray-400 hover:text-blue-400 transition"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-green-400 text-xs" style={{ fontFamily: "'Tajawal', sans-serif" }}>✅ كلمات المرور متطابقة</p>
                  )}
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-400 text-xs" style={{ fontFamily: "'Tajawal', sans-serif" }}>❌ كلمات المرور غير متطابقة</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 700 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
                    {isRegistering ? 'إنشاء الحساب' : 'دخول'}
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-500 text-xs pt-4" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              بالاستخدام أنت توافق على سياسة الخصوصية وشروط الاستخدام
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
