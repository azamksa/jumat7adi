// utils/PackageTracker.js
export class PackageTracker {
  static async getUserPackageLevel(userId) {
    try {
      const response = await fetch(`http://localhost:5000/api/user-package-level/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      return data.packageLevel || 1; // افتراضي للحزمة الأولى
    } catch (error) {
      console.error('Error fetching package level:', error);
      return 1;
    }
  }

  static async incrementUserPackageLevel(userId) {
    try {
      const response = await fetch('http://localhost:5000/api/increment-package-level', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      return data.newPackageLevel;
    } catch (error) {
      console.error('Error incrementing package level:', error);
      return null;
    }
  }

  static getPackageQuestions(category, packageLevel) {
    const maxPackages = 3; // أقصى عدد حزم
    const actualPackage = Math.min(packageLevel, maxPackages);
    
    // إرجاع أسئلة الحزمة المحددة
    return questions[category]?.packages[actualPackage - 1] || [];
  }

  static getPackageInfo(packageLevel) {
    const packages = {
      1: { name: 'الحزمة الأساسية', difficulty: 'سهل', color: '#4CAF50' },
      2: { name: 'الحزمة المتوسطة', difficulty: 'متوسط', color: '#FF9800' },
      3: { name: 'الحزمة المتقدمة', difficulty: 'صعب', color: '#F44336' }
    };
    
    return packages[Math.min(packageLevel, 3)] || packages[1];
  }
}
