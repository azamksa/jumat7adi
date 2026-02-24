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

  const validatePasswordStrength = (pwd) => {
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      fontFamily: "'Tajawal', 'Poppins', sans-serif",
      background: 'var(--bg-primary)'
    }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>تحدي الجمعة</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>منافسة ثقافية ممتعة وتحديات مثيرة</p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--neu-shadow-raised)'
        }}>
          {/* Tab Navigation */}
          <div className="flex" style={{ borderBottom: '1px solid var(--color-secondary)' }}>
            <button
              onClick={() => {
                setIsRegistering(false);
                setError('');
              }}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.3s',
                background: !isRegistering ? 'var(--color-secondary)' : 'transparent',
                color: !isRegistering ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setError('');
              }}
              style={{
                flex: 1,
                padding: '16px 24px',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 0.3s',
                background: isRegistering ? 'var(--color-secondary)' : 'transparent',
                color: isRegistering ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              إنشاء حساب
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div style={{
                marginBottom: '24px',
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderLeft: '4px solid var(--color-error)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--neu-shadow-pressed)'
              }}>
                <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', fontWeight: 500 }}>{error}</p>
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
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    الاسم
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      style={{
                        width: '100%',
                        padding: '12px 48px 12px 16px',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        boxShadow: 'var(--neu-shadow-pressed)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Email/Username Field */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {isRegistering ? 'البريد الإلكتروني' : 'البريد الإلكتروني أو اسم المستخدم'}
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={emailOrName}
                    onChange={(e) => setEmailOrName(e.target.value)}
                    placeholder={isRegistering ? 'example@email.com' : 'البريد أو الاسم'}
                    style={{
                      width: '100%',
                      padding: '12px 48px 12px 16px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      boxShadow: 'var(--neu-shadow-pressed)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    style={{
                      width: '100%',
                      padding: '12px 48px',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      boxShadow: 'var(--neu-shadow-pressed)',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Strength (Register Only) */}
                {isRegistering && password && (
                  <div className="mt-2">
                    <p style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 600,
                      color: validatePasswordStrength(password) ? 'var(--color-secondary)' : 'var(--color-primary)'
                    }}>
                      {getPasswordStrengthMessage()}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Register Only) */}
              {isRegistering && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      style={{
                        width: '100%',
                        padding: '12px 48px',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        boxShadow: 'var(--neu-shadow-pressed)',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)'
                      }}
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
                style={{
                  width: '100%',
                  background: 'var(--color-secondary)',
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--neu-shadow-raised)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'var(--color-primary)';
                    e.target.style.boxShadow = 'var(--neu-shadow-hover)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.background = 'var(--color-secondary)';
                    e.target.style.boxShadow = 'var(--neu-shadow-raised)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid var(--text-primary)',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
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
            <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)', fontFamily: "'Tajawal', sans-serif" }}>
              {isRegistering
                ? 'بإنشاء حساب، فإنك توافق على شروط الاستخدام'
                : 'هل نسيت كلمة المرور؟ تواصل مع الدعم'}
            </p>
          </div>
        </div>

        {/* Server Status Warning */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--neu-shadow-raised)'
        }}>
          <p className="text-sm text-center" style={{ color: 'var(--color-primary)', fontFamily: "'Tajawal', sans-serif" }}>
            تأكد من تشغيل الخادم على http://localhost:5000
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
