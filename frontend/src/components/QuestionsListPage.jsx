import React from 'react';


const QuestionsListPage = ({
  teams,
  scores,
  setScores,
  selectedCategories,
  basicCategories,
  answeredQuestions,
  selectQuestion,
  categoryPickerTeam,
  setCategoryPickerTeam // أضف هذا
}) => {

  // تعديل دالة استخراج الفئات الفرعية
  const getSubcategories = () => {
    const allSubcategories = [];
    Object.entries(basicCategories).forEach(([_, category]) => {
      if (category.subcategories) {
        category.subcategories.forEach(sub => {
          allSubcategories.push(sub);
        });
      }
    });
    return allSubcategories;
  };

  const allSubcategories = getSubcategories();
  const pointValues = [300, 400, 500, 600, 700, 800];

  // الأنماط المشتركة
  const styles = {
    container: {
      
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      LEFT: 10,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '0',
      margin: '0',
      background: 'transparent',
      // background: 'linear-gradient(135deg, #1a237e, #0d47a1)',
      // overflow: 'hidden'
    },
    mainContent: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '4px' // إضافة padding صغير للمحتوى فقط
    },
    scoreBoard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      background: 'rgba(0,0,0,0.3)',
      borderRadius: '15px',
      width: '100%', // تأكيد على العرض الكامل
      boxSizing: 'border-box' // لضمان عدم تجاوز العرض
    },
    scoreBox: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(0,0,0,0.2)',
      padding: '10px 20px',
      borderRadius: '10px',
      minWidth: '300px' // زيادة العرض لاستيعاب الاسم
    },
    scoreButton: {
      fontSize: '24px',
      width: '40px',
      height: '40px',
      border: 'none',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.1)',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      '&:hover': {
        background: 'rgba(255,255,255,0.2)'
      }
    },
    scoreValue: {
      fontSize: '32px',
      color: '#FF8A4C',
      minWidth: '80px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    turnIndicator: {
      padding: '10px 30px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '10px',
      fontSize: '24px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    questionsGrid: {
      display: 'grid',
      gridTemplateRows: 'auto repeat(6, 1fr)',
      gap: '5px',
      padding: '15px',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '15px',
      marginTop: '4px'
    },
    categoryHeader: {
      display: 'grid',
      gridTemplateColumns: `repeat(${selectedCategories.length}, 1fr)`,
      gap: '5px',
      marginBottom: '5px'
    },
    categoryItem: {
      background: 'rgba(255,255,255,0.1)',
      padding: '10px',
      borderRadius: '10px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center', // إضافة جديدة
      gap: '8px',
      position: 'relative',
      minHeight: '100px',
      overflow: 'hidden' // إضافة جديدة
    },
    categoryImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.4, // slightly transparent
      filter: 'brightness(0.8)',
      transition: 'opacity 0.3s ease',
      zIndex: 1,
      
    },
    categoryTitle: {
      margin: 0,
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
      position: 'relative', // إضافة جديدة
      zIndex: 1 // جعل النص فوق الصورة
    },
    pointsRow: {
      display: 'grid',
      gridTemplateColumns: `repeat(${selectedCategories.length}, 1fr)`,
      gap: '5px'
    },
    pointsCell: (isAnswered) => ({
      background: isAnswered ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)',
      padding: '15px',
      borderRadius: '10px',
      textAlign: 'center',
      fontSize: '24px',
      cursor: isAnswered ? 'default' : 'pointer',
      color: 'white',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      minHeight: '50px',
      '&:hover': {
        background: isAnswered ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.2)'
      }
    }),
    teamName: {
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      marginRight: '10px',
      minWidth: '100px',
      textAlign: 'center' // محاذاة بالمنتصف
     }

  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.scoreBoard}>
          {/* النتيجة - الفريق 1 */}
          <div style={styles.scoreBox}>
            <span style={styles.teamName}>{teams.team1}</span>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => setScores(prev => ({ ...prev, team1: Math.max(0, prev.team1 - 100) }))}
                style={styles.scoreButton}
              >
                -
              </button>
              <span style={styles.scoreValue}>{scores.team1}</span>
              <button 
                onClick={() => setScores(prev => ({ ...prev, team1: prev.team1 + 100 }))}
                style={styles.scoreButton}
              >
                +
              </button>
            </div>
          </div>

          {/* مؤشر الدور */}
<div style={styles.turnIndicator}>
  <button 
    style={{
      fontSize: '35px',
      background: 'transparent',
      border: 'none',
      color: '#FF8A4C',
      cursor: 'pointer',
      padding: '5px 10px',
      borderRadius: '5px',
      transition: 'all 0.2s ease',
      opacity: categoryPickerTeam === 'team1' ? 1 : 0.3
    }}
    onClick={() => {
      console.log('تم الضغط على السهم الأيسر'); // للتتبع
      console.log('setCategoryPickerTeam موجود؟', typeof setCategoryPickerTeam); // للتأكد
      if (setCategoryPickerTeam) {
        setCategoryPickerTeam('team1');
      } else {
        console.log('setCategoryPickerTeam غير موجود!');
      }
    }}
    disabled={categoryPickerTeam === 'team1'}
  >
    ⟵
  </button>
  
  <div style={{ textAlign: 'center', flex: 1 }}>
    <span>{teams[categoryPickerTeam]} يختار الفئة</span>
  </div>
  
  <button 
    style={{
      fontSize: '35px',
      background: 'transparent',
      border: 'none',
      color: '#FF8A4C',
      cursor: 'pointer',
      padding: '5px 10px',
      borderRadius: '5px',
      transition: 'all 0.2s ease',
      opacity: categoryPickerTeam === 'team2' ? 1 : 0.3
    }}
    onClick={() => {
      console.log('تم الضغط على السهم الأيمن'); // للتتبع
      if (setCategoryPickerTeam) {
        setCategoryPickerTeam('team2');
      } else {
        console.log('setCategoryPickerTeam غير موجود!');
      }
    }}
    disabled={categoryPickerTeam === 'team2'}
  >
    ⟶
  </button>
</div>

          {/* النتيجة - الفريق 2 */}
          <div style={styles.scoreBox}>
            <span style={styles.teamName}>{teams.team2}</span>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => setScores(prev => ({ ...prev, team2: Math.max(0, prev.team2 - 100) }))}
                style={styles.scoreButton}
              >
                -
              </button>
              <span style={styles.scoreValue}>{scores.team2}</span>
              <button 
                onClick={() => setScores(prev => ({ ...prev, team2: prev.team2 + 100 }))}
                style={styles.scoreButton}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div style={styles.questionsGrid}>
          {/* عناوين الفئات */}
          <div style={styles.categoryHeader}>
            {selectedCategories.map(categoryId => {
              const category = allSubcategories.find(sub => sub.id === categoryId);
              if (!category) return null;
              
              const parentCategory = Object.values(basicCategories).find(
                cat => cat.subcategories?.some(sub => sub.id === categoryId)
              );
              
              return (
                <div 
                  key={categoryId} 
                  style={{
                    ...styles.categoryItem,
                    background: parentCategory?.color || 'rgba(255,255,255,0.1)'
                  }}
                >
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      style={styles.categoryImage}
                    />
                  )}
                  <h3 style={styles.categoryTitle}>
                    {category.name}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* شبكة النقاط */}
          {pointValues.map(points => (
            <div key={points} style={styles.pointsRow}>
              {selectedCategories.map(categoryId => {
                const isAnswered = answeredQuestions.has(`${categoryId}-${points}`);
                return (
                  <div
                    key={`${categoryId}-${points}`}
                    onClick={() => {
                      if (!isAnswered) {
                        console.log('Clicking cell:', { categoryId, points });
                        selectQuestion(categoryId, points);
                      }
                    }}
                    style={{
                      ...styles.pointsCell(isAnswered),
                      cursor: isAnswered ? 'default' : 'pointer',
                      // إضافة تأثير عند التحويم
                      '&:hover': !isAnswered && {
                        background: 'rgba(255,255,255,0.3)',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    {isAnswered ? '' : points}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsListPage;