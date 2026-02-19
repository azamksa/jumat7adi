import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
    if (!/[A-Z]/.test(password)) return 'يجب أحرف كبيرة';
    if (!/[a-z]/.test(password)) return 'يجب أحرف صغيرة';
    if (!/\d/.test(password)) return 'يجب أرقام';
    if (!/[@$!%*?&]/.test(password)) return 'يجب رموز (@$!%*?&)';
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Tajawal', 'Poppins', sans-serif"
    }}>
      {/* Main Container */}
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        background: '#ffffff',
        minHeight: '600px'
      }}>
        {/* Left Side - Branding */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #003262 0%, #1F6AA5 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          color: 'white',
          textAlign: 'center',
          minHeight: '600px'
        }} className="hidden md:flex">
          {/* Logo/Title */}
          <div style={{
            fontSize: '48px',
            fontWeight: 900,
            marginBottom: '30px',
            letterSpacing: '-1px'
          }}>
            تحدي الجمعة
          </div>

          {/* Description */}
          <p style={{
            fontSize: '18px',
            fontWeight: 400,
            marginBottom: '50px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            منافسة ثقافية ممتعة مع أصدقائك وعائلتك
          </p>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gap: '20px',
            width: '100%',
            marginBottom: '30px'
          }}>
            {[
              { title: 'أسئلة متنوعة', desc: 'من مختلف الفئات' },
              { title: 'منافسة عادلة', desc: 'مع الأصدقاء' },
              { title: 'محفوظ وآمن', desc: 'بيانات مشفرة' }
            ].map((feature, idx) => (
              <div key={idx} style={{
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  marginBottom: '4px'
                }}>
                  {feature.title}
                </div>
                <div style={{
                  fontSize: '12px',
                  opacity: 0.8
                }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Circle */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            marginTop: 'auto',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
            <div style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          flex: '1',
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff'
        }}>
          {/* Tab Switcher */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '40px',
            background: '#f3f4f6',
            padding: '6px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            <button
              onClick={() => {
                if (isRegistering) {
                  setIsRegistering(false);
                  setError('');
                }
              }}
              style={{
                flex: 1,
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: !isRegistering ? '#003262' : 'transparent',
                color: !isRegistering ? 'white' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Tajawal', sans-serif",
                fontWeight: 600
              }}
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
              style={{
                flex: 1,
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: isRegistering ? '#003262' : 'transparent',
                color: isRegistering ? 'white' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Tajawal', sans-serif",
                fontWeight: 600
              }}
            >
              تسجيل جديد
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              padding: '14px 16px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '24px',
              color: '#991b1b',
              fontSize: '13px',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {/* Password Strength Indicator */}
          {isRegistering && password && (
            <div style={{
              padding: '12px 16px',
              background: getPasswordStrengthMessage() === 'كلمة مرور قوية' ? '#dcfce7' : '#fef3c7',
              border: '1px solid ' + (getPasswordStrengthMessage() === 'كلمة مرور قوية' ? '#86efac' : '#fde68a'),
              borderRadius: '8px',
              marginBottom: '24px',
              color: getPasswordStrengthMessage() === 'كلمة مرور قوية' ? '#166534' : '#92400e',
              fontSize: '13px',
              fontWeight: 500
            }}>
              {getPasswordStrengthMessage()}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Name Field - Register Only */}
            {isRegistering && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                  fontFamily: "'Tajawal', sans-serif"
                }}>
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  placeholder="أحمد محمد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    letterSpacing: '0.3px',
                    fontFamily: "'Tajawal', sans-serif",
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    background: '#ffffff',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#003262';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 50, 98, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1f2937',
                fontFamily: "'Tajawal', sans-serif"
              }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={emailOrName}
                onChange={(e) => setEmailOrName(e.target.value)}
                disabled={isLoading}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  letterSpacing: '0.3px',
                  fontFamily: "'Poppins', 'Tajawal', sans-serif",
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  background: '#ffffff',
                  color: '#1f2937'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#003262';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 50, 98, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1f2937',
                fontFamily: "'Tajawal', sans-serif"
              }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    background: '#ffffff',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#003262';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 50, 98, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Register Only */}
            {isRegistering && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                  fontFamily: "'Tajawal', sans-serif"
                }}>
                  تأكيد كلمة المرور
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      letterSpacing: '2px',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      background: '#ffffff',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#003262';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 50, 98, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={isLoading}
            style={{
              marginTop: '40px',
              padding: '14px 32px',
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #E25822 0%, #FF8A4C 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: "'Tajawal', sans-serif",
              boxShadow: '0 4px 12px rgba(226, 88, 34, 0.2)',
              transform: 'translateY(0)',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(226, 88, 34, 0.35)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(226, 88, 34, 0.2)';
              }
            }}
          >
            {isLoading ? 'جاري المعالجة...' : (isRegistering ? 'إنشاء الحساب' : 'دخول')}
          </button>

          {/* Footer */}
          <p style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#9ca3af',
            fontFamily: "'Tajawal', sans-serif"
          }}>
            بالاستخدام أنت توافق على سياسة الخصوصية وشروط الاستخدام
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
