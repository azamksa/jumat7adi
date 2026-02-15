#!/usr/bin/env node

/**
 * 🧪 نص اختبار النظام الآمن
 * تشغيل بـ: node test-secure-system.js
 */

const API_URL = 'http://localhost:5000';

// ألوان للطباعة
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

// بيانات الاختبار
const testData = {
  register: {
    name: 'Test User ' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'SecurePass123@',
    confirmPassword: 'SecurePass123@'
  },
  login: {
    emailOrName: null, // سيتم ملؤه بعد التسجيل
    password: 'SecurePass123@'
  },
  weakPassword: {
    name: 'Weak Pass User',
    email: `weak${Date.now()}@example.com`,
    password: 'weak123', // كلمة مرور ضعيفة
    confirmPassword: 'weak123'
  }
};

// متغيرات لتخزين النتائج
let registeredUserId = null;
let accessToken = null;
let refreshToken = null;

// ==================== Tests ====================

async function testConnection() {
  log.test('اختبار الاتصال بالخادم');
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrName: 'test', password: 'test' })
    });
    log.success('الخادم يستجيب');
  } catch (error) {
    log.error(`فشل الاتصال بالخادم: ${error.message}`);
    process.exit(1);
  }
}

async function testRegisterSuccess() {
  log.test('اختبار التسجيل الناجح');
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.register)
    });

    if (response.status !== 201) {
      log.error(`فشل التسجيل: ${response.status}`);
      const data = await response.json();
      log.error(data.error);
      return false;
    }

    const data = await response.json();
    if (!data.accessToken || !data.user) {
      log.error('البيانات المرجعة غير صحيحة');
      return false;
    }

    registeredUserId = data.user.id;
    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
    testData.login.emailOrName = testData.register.email;

    log.success(`تسجيل ناجح: ${data.user.name}`);
    log.info(`Token: ${accessToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    return false;
  }
}

async function testWeakPassword() {
  log.test('اختبار كلمة مرور ضعيفة (يجب أن تفشل)');
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.weakPassword)
    });

    const data = await response.json();
    
    if (response.status !== 400) {
      log.error('كان يجب أن يرفض كلمة المرور الضعيفة');
      return false;
    }

    log.success('تم رفض كلمة المرور الضعيفة بنجاح');
    log.info(`الرسالة: ${data.error}`);
    return true;
  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    return false;
  }
}

async function testLoginSuccess() {
  log.test('اختبار تسجيل دخول ناجح');
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.login)
    });

    if (response.status !== 200) {
      log.error(`فشل تسجيل الدخول: ${response.status}`);
      const data = await response.json();
      log.error(data.error);
      return false;
    }

    const data = await response.json();
    if (!data.accessToken) {
      log.error('لم يتم استقبال access token');
      return false;
    }

    log.success(`تسجيل دخول ناجح: ${data.user.name}`);
    return true;
  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    return false;
  }
}

async function testWrongPassword() {
  log.test('اختبار كلمة مرور خاطئة (يجب أن تفشل)');
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrName: testData.register.email,
        password: 'WrongPassword123@'
      })
    });

    if (response.status !== 401) {
      log.error('كان يجب أن يرفض كلمة المرور الخاطئة');
      return false;
    }

    const data = await response.json();
    log.success('تم رفض كلمة المرور الخاطئة بنجاح');
    log.info(`الرسالة: ${data.error}`);
    return true;
  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    return false;
  }
}

async function testProtectedEndpoint() {
  log.test('اختبار API محمي (يتطلب token)');
  try {
    // بدون token
    const response1 = await fetch(`${API_URL}/api/solved-questions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (response1.status === 200) {
      log.error('كان يجب أن يرفض الطلب بدون token');
      return false;
    }

    log.success('رفض الطلب بدون token ✓');

    // مع token صحيح
    const response2 = await fetch(`${API_URL}/api/solved-questions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response2.status !== 200) {
      log.error('فشل الطلب مع token صحيح');
      return false;
    }

    log.success('قبول الطلب مع token صحيح ✓');
    return true;
  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    return false;
  }
}

async function testRefreshToken() {
  log.test('اختبار تحديث Token');
  try {
    if (!refreshToken) {
      log.warn('لا يوجد refresh token');
      return false;
    }

    const response = await fetch(`${API_URL}/api/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (response.status !== 200) {
      log.error(`فشل تحديث Token: ${response.status}`);
      return false;
    }

    const data = await response.json();
    if (!data.accessToken) {
      log.error('لم يتم استقبال access token جديد');
      return false;
    }

    accessToken = data.accessToken;
    log.success('تم تحديث Token بنجاح');
    return true;
  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    return false;
  }
}

async function testDuplicateEmail() {
  log.test('اختبار منع البريد الإلكتروني المكرر');
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.register)
    });

    if (response.status !== 409) {
      log.error('كان يجب أن يرفض البريد المكرر');
      return false;
    }

    const data = await response.json();
    log.success('تم رفض البريد المكرر بنجاح');
    log.info(`الرسالة: ${data.error}`);
    return true;
  } catch (error) {
    log.error(`خطأ في الاختبار: ${error.message}`);
    return false;
  }
}

// ==================== Main ====================

async function runAllTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════╗`);
  console.log(`║  🧪 اختبارات النظام الآمن لتحدي الجمعة  ║`);
  console.log(`╚════════════════════════════════════════╝${colors.reset}\n`);

  const tests = [
    { name: 'الاتصال بالخادم', fn: testConnection },
    { name: 'التسجيل الناجح', fn: testRegisterSuccess },
    { name: 'كلمة مرور ضعيفة', fn: testWeakPassword },
    { name: 'تسجيل دخول ناجح', fn: testLoginSuccess },
    { name: 'كلمة مرور خاطئة', fn: testWrongPassword },
    { name: 'API محمي', fn: testProtectedEndpoint },
    { name: 'تحديث Token', fn: testRefreshToken },
    { name: 'منع البريد المكرر', fn: testDuplicateEmail }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n${colors.yellow}───────────────────────────────────${colors.reset}`);
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`\n${colors.cyan}═════════════════════════════════════${colors.reset}`);
  console.log(`\n📊 النتائج:`);
  log.success(`نجح: ${passed}`);
  if (failed > 0) log.error(`فشل: ${failed}`);
  console.log(`\nإجمالي: ${passed + failed}`);
  console.log(`النسبة: ${Math.round((passed / (passed + failed)) * 100)}%\n`);

  if (failed === 0) {
    console.log(`${colors.green}🎉 جميع الاختبارات نجحت!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}⚠️  بعض الاختبارات فشلت${colors.reset}\n`);
  }
}

runAllTests().catch(err => {
  log.error(`خطأ عام: ${err.message}`);
  process.exit(1);
});
