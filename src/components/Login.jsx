import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

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

  const handleLogin = () => {
    if (!nameOrEmail || !password) {
      setError('يرجى إدخال الاسم أو البريد الإلكتروني وكلمة المرور');
      return;
    }
    if (nameOrEmail.includes('@') && !validateEmail(nameOrEmail)) {
      setError('يرجى إدخال بريد إلكتروني صالح');
      return;
    }
    setError('');
    onLogin({ nameOrEmail, password });
  };

  const handleRegister = () => {
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
    setError('');
    onRegister({ name, email: nameOrEmail, password });
  };

  const InputField = ({ icon: Icon, type, placeholder, value, onChange, showToggle, onToggle, showValue }) => {
    return (
      <div className="relative group">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input
          type={showToggle ? (showValue ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pr-10 pl-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-700/50 backdrop-blur-sm hover:bg-gray-700/70 text-white placeholder-gray-400 text-right"
          dir="rtl"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRegistering ? 'تسجيل حساب جديد' : 'تسجيل الدخول'}
            </h2>
            <p className="text-gray-300">
              {isRegistering ? 'أنشئ حسابك الجديد' : 'مرحباً بك مرة أخرى'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {isRegistering && (
              <InputField
                icon={User}
                type="text"
                placeholder="الاسم"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            )}
            
            <InputField
              icon={nameOrEmail.includes('@') ? Mail : User}
              type="text"
              placeholder={isRegistering ? "البريد الإلكتروني" : "الاسم أو البريد الإلكتروني"}
              value={nameOrEmail}
              onChange={e => setNameOrEmail(e.target.value)}
            />
            
            <InputField
              icon={Lock}
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              showToggle={true}
              onToggle={() => setShowPassword(!showPassword)}
              showValue={showPassword}
            />
            
            {isRegistering && (
              <InputField
                icon={Lock}
                type="password"
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                showToggle={true}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                showValue={showConfirmPassword}
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={isRegistering ? handleRegister : handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
          >
            {isRegistering ? 'تسجيل' : 'دخول'}
          </button>

          {/* Toggle Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setError('');
                setIsRegistering(!isRegistering);
                setName('');
                setNameOrEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
            >
              {isRegistering ? 'لديك حساب؟ تسجيل الدخول' : 'ليس لديك حساب؟ سجل الآن'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          مرحباً بك في تحدي الجمعة
        </p>
      </div>
    </div>
  );
};

export default Login;