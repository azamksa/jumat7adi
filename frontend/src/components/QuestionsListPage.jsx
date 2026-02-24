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
  setCategoryPickerTeam
}) => {

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

  // Theme-aware styles using CSS variables
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '0',
      margin: '0',
      background: 'var(--bg-primary)',
    },
    mainContent: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '4px'
    },
    scoreBoard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: 'var(--neu-shadow-raised)'
    },
    scoreBox: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      background: 'var(--bg-secondary)',
      padding: '10px 20px',
      borderRadius: 'var(--radius-lg)',
      minWidth: '300px',
      boxShadow: 'var(--neu-shadow-pressed)'
    },
    scoreButton: {
      fontSize: '24px',
      width: '40px',
      height: '40px',
      border: 'none',
      borderRadius: '50%',
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      boxShadow: 'var(--neu-shadow-soft)',
      '&:hover': {
        background: 'var(--color-secondary)',
        boxShadow: 'var(--neu-shadow-hover)'
      }
    },
    scoreValue: {
      fontSize: '32px',
      color: 'var(--color-primary)',
      minWidth: '80px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    turnIndicator: {
      padding: '10px 30px',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      fontSize: '24px',
      color: 'var(--text-primary)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      boxShadow: 'var(--neu-shadow-raised)'
    },
    questionsGrid: {
      display: 'grid',
      gridTemplateRows: 'auto repeat(6, 1fr)',
      gap: '5px',
      padding: '15px',
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-lg)',
      marginTop: '4px',
      boxShadow: 'var(--neu-shadow-raised)'
    },
    categoryHeader: {
      display: 'grid',
      gridTemplateColumns: `repeat(${selectedCategories.length}, 1fr)`,
      gap: '5px',
      marginBottom: '5px'
    },
    categoryItem: {
      background: 'var(--bg-secondary)',
      padding: '10px',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      position: 'relative',
      minHeight: '100px',
      overflow: 'hidden',
      boxShadow: 'var(--neu-shadow-pressed)'
    },
    categoryImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.4,
      filter: 'brightness(0.8)',
      transition: 'opacity 0.3s ease',
      zIndex: 1,
    },
    categoryTitle: {
      margin: 0,
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'var(--text-primary)',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
      position: 'relative',
      zIndex: 1
    },
    pointsRow: {
      display: 'grid',
      gridTemplateColumns: `repeat(${selectedCategories.length}, 1fr)`,
      gap: '5px'
    },
    pointsCell: (isAnswered) => ({
      background: isAnswered ? 'var(--bg-primary)' : 'var(--bg-secondary)',
      padding: '15px',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      fontSize: '24px',
      cursor: isAnswered ? 'default' : 'pointer',
      color: isAnswered ? 'var(--text-muted)' : 'var(--text-primary)',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      minHeight: '50px',
      boxShadow: isAnswered 
        ? 'var(--neu-shadow-pressed)'
        : 'var(--neu-shadow-soft)',
      '&:hover': {
        background: isAnswered ? 'var(--bg-primary)' : 'var(--color-secondary)',
        boxShadow: isAnswered 
          ? 'var(--neu-shadow-pressed)'
          : 'var(--neu-shadow-hover)'
      }
    }),
    teamName: {
      color: 'var(--text-primary)',
      fontSize: '20px',
      fontWeight: 'bold',
      marginRight: '10px',
      minWidth: '100px',
      textAlign: 'center'
    },
    arrowButton: {
      fontSize: '35px',
      background: 'var(--bg-secondary)',
      border: 'none',
      color: 'var(--color-primary)',
      cursor: 'pointer',
      padding: '5px 15px',
      borderRadius: '50%',
      transition: 'all 0.2s ease',
      boxShadow: 'var(--neu-shadow-soft)',
      '&:hover': {
        background: 'var(--color-secondary)',
        boxShadow: 'var(--neu-shadow-hover)'
      }
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
                ...styles.arrowButton,
                opacity: categoryPickerTeam === 'team1' ? 1 : 0.3
              }}
              onClick={() => {
                if (setCategoryPickerTeam) {
                  setCategoryPickerTeam('team1');
                }
              }}
              disabled={categoryPickerTeam === 'team1'}
            >
              ⟵
            </button>
            
            <div style={{ textAlign: 'center', flex: 1 }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{teams[categoryPickerTeam]}</span>
              <span style={{ color: 'var(--text-muted)' }}> يختار الفئة</span>
            </div>
            
            <button 
              style={{
                ...styles.arrowButton,
                opacity: categoryPickerTeam === 'team2' ? 1 : 0.3
              }}
              onClick={() => {
                if (setCategoryPickerTeam) {
                  setCategoryPickerTeam('team2');
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
              
              return (
                <div 
                  key={categoryId} 
                  style={styles.categoryItem}
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
                        selectQuestion(categoryId, points);
                      }
                    }}
                    style={styles.pointsCell(isAnswered)}
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
