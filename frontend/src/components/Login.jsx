import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

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
    if (password.length < 8) return 'الحد الأدنى 8 أحرف';
    if (!/[A-Z]/.test(password)) return 'يجب أن تحتوي على أحرف كبيرة';
    if (!/[a-z]/.test(password)) return 'يجب أن تحتوي على أحرف صغيرة';
    if (!/\d/.test(password)) return 'يجب أن تحتوي على أرقام';
    if (!/[@$!%*?&]/.test(password)) return 'يجب أن تحتوي على رموز خاصة';
    return 'كلمة مرور قوية';
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
      setError('فشل في الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000');
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
      setError('فشل في الاتصال بالخادم. تأكد من تشغيل الخادم على http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 flex items-center justify-center p-4" style={{ fontFamily: "'Tajawal', 'Poppins', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">تحدي الجمعة</h1>
          <p className="text-gray-400 text-sm">منافسة ثقافية ممتعة وتحديات مثيرة</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setIsRegistering(false);
                setError('');
              }}
              className={`flex-1 py-4 px-6 font-semibold text-sm transition-all ${
                !isRegistering
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setError('');
              }}
              className={`flex-1 py-4 px-6 font-semibold text-sm transition-all ${
                isRegistering
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              إنشاء حساب
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              if (isRegistering) {
                handleRegister();
              } else {
                handleLogin();
              }
            }}>
              {/* Name Field (Register Only) */}
              {isRegistering && (
                <div className="mb-5">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    الاسم
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    />
                  </div>
                </div>
              )}

              {/* Email/Username Field */}
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  {isRegistering ? 'البريد الإلكتروني' : 'البريد الإلكتروني أو اسم المستخدم'}
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={emailOrName}
                    onChange={(e) => setEmailOrName(e.target.value)}
                    placeholder={isRegistering ? 'example@email.com' : 'البريد أو الاسم'}
                    className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full pr-12 pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Strength (Register Only) */}
                {isRegistering && password && (
                  <div className="mt-2">
                    <p className={`text-sm font-semibold ${
                      validatePasswordStrength(password)
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}>
                      {getPasswordStrengthMessage()}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Register Only) */}
              {isRegistering && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className="w-full pr-12 pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    {isRegistering ? 'إنشاء حساب' : 'تسجيل الدخول'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <p className="text-center text-gray-600 text-xs mt-4" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              {isRegistering
                ? 'بإنشاء حساب، فإنك توافق على شروط الاستخدام'
                : 'هل نسيت كلمة المرور؟ تواصل مع الدعم'}
            </p>
          </div>
        </div>

        {/* Server Status Warning */}
        <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg">
          <p className="text-yellow-100 text-sm text-center" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            تأكد من تشغيل الخادم على http://localhost:5000
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
