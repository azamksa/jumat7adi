import React, { useState } from 'react';

const Login = ({ onLogin, onRegister, error, setError }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nameOrEmail, setNameOrEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{isRegistering ? 'تسجيل حساب جديد' : 'تسجيل الدخول'}</h2>
      {isRegistering && (
        <input
          type="text"
          placeholder="الاسم"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
      )}
      <input
        type="text"
        placeholder={isRegistering ? "البريد الإلكتروني" : "الاسم أو البريد الإلكتروني"}
        value={nameOrEmail}
        onChange={e => setNameOrEmail(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      {isRegistering && (
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
      )}
      <button
        onClick={isRegistering ? handleRegister : handleLogin}
        style={{ width: '100%', padding: 10, backgroundColor: '#4cc9f0', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: 4 }}
      >
        {isRegistering ? 'تسجيل' : 'دخول'}
      </button>
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <button
          onClick={() => {
            setError('');
            setIsRegistering(!isRegistering);
          }}
          style={{ background: 'none', border: 'none', color: '#4cc9f0', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isRegistering ? 'لديك حساب؟ تسجيل الدخول' : 'ليس لديك حساب؟ سجل الآن'}
        </button>
      </div>
      {error && (
        <div style={{ marginTop: 10, color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Login;
