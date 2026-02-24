import React, { useState, useEffect } from 'react';
import { 
  Container,
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import UserMenu from './UserMenu';
import UserProfileModal from './UserProfileModal';
import { PackageTracker } from '../utils/PackageTracker';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'var(--bg-secondary)',
  borderRadius: 'var(--radius-lg)',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  boxShadow: 'var(--neu-shadow-raised)',
  border: 'none',
  transition: 'all 0.4s ease',
  '&:hover': {
    boxShadow: 'var(--neu-shadow-hover)',
    transform: 'translateY(-5px)'
  }
}));

const CategoryButton = styled(Button)(({ selected }) => ({
  width: '220px',
  height: '280px',
  borderRadius: 'var(--radius-lg)',
  background: selected 
    ? 'var(--color-secondary)' 
    : 'var(--bg-secondary)',
  border: selected ? '2px solid var(--color-primary)' : 'none',
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  boxShadow: selected 
    ? 'var(--neu-shadow-pressed)' 
    : 'var(--neu-shadow-raised)',
  '&:hover': {
    background: selected 
      ? 'var(--color-secondary)' 
      : 'var(--color-secondary)',
    transform: 'scale(1.05) translateY(-8px)',
    boxShadow: 'var(--neu-shadow-hover)'
  },
  '&:active': {
    transform: 'scale(0.98)',
    boxShadow: 'var(--neu-shadow-pressed)'
  }
}));

const CategoryImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.6,
  transition: 'opacity 0.3s ease'
});

const SetupPage = ({
  teams,
  selectedCategories,
  basicCategories,
  onTeamNameChange,
  onCategorySelection,
  onStartGame,
  error,
  setShowLogin,
  user
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [userPackageLevel, setUserPackageLevel] = useState(1);

  useEffect(() => {
    if (user?.id) {
      PackageTracker.getUserPackageLevel(user.id)
        .then(level => setUserPackageLevel(level));
    }
  }, [user]);

  const handleStartGame = async () => {
    if (!currentUser) {
      alert('يجب أن تقوم بتسجيل الدخول قبل بدء اللعب!');
      setShowLogin(true);
      return;
    }

    if (!teams.team1 || !teams.team2) {
      alert('يرجى إدخال أسماء الفريقين');
      return;
    }

    if (selectedCategories.length !== 6) {
      alert('يجب اختيار 6 فئات فقط');
      return;
    }

    await PackageTracker.incrementUserPackageLevel(currentUser.id);
    onStartGame();
  };

  const handleEditProfile = () => {
    setShowProfileModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSaveProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const packageInfo = PackageTracker.getPackageInfo(userPackageLevel);

  return (
    <Container
      maxWidth="xxl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        position: 'relative',
        background: 'var(--bg-primary)',
        minHeight: '100vh'
      }}
    >
      {/* قائمة المستخدم - تظهر فقط عند تسجيل الدخول */}
      {currentUser && (
        <UserMenu
          user={currentUser}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      )}

      {/* زر تسجيل الدخول - يظهر فقط إذا لم يكن المستخدم مسجل دخول */}
      {!currentUser && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999
          }}
        >
          <Button
            onClick={() => setShowLogin(true)}
            variant="contained"
            sx={{
              background: 'var(--color-secondary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '12px 32px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--neu-shadow-raised)',
              '&:hover': {
                background: 'var(--color-primary)',
                transform: 'scale(1.05)',
                boxShadow: 'var(--neu-shadow-hover)'
              }
            }}
          >
            تسجيل الدخول
          </Button>
        </Box>
      )}

      {/* العنوان الرئيسي */}

      <Box textAlign="center" mb={8} pt={6}>
        <Box sx={{ 
          position: 'relative',
          mb: 6,
          animation: 'slideInDown 0.8s ease-out'
        }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2.8rem', md: '4.2rem', lg: '5rem' },
              fontWeight: 700,
              color: 'var(--color-primary)',
              letterSpacing: '-0.5px',
              mb: 3,
              textAlign: 'center',
              lineHeight: 1.2
            }}
          >
            تحدي الجمعة
          </Typography>
          
          <Box sx={{
            width: '80px',
            height: '3px',
            background: 'var(--color-primary)',
            margin: '0 auto',
            borderRadius: '2px'
          }} />
        </Box>

        {/* معلومات الحزمة */}
        {currentUser && (
          <Box sx={{
            background: 'var(--bg-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 40px',
            margin: '50px auto',
            maxWidth: '520px',
            boxShadow: 'var(--neu-shadow-raised)',
            transition: 'all 0.4s ease'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.9rem',
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}
            >
              حزمتك الحالية
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '1.8rem',
                mb: 2
              }}
            >
              {packageInfo.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              {packageInfo.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box>
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', mb: 0.5 }}>
                  النقاط المتبقية
                </Typography>
                <Typography sx={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.4rem' }}>
                  {packageInfo.remainingQuestions}
                </Typography>
              </Box>
              <Box sx={{ borderLeft: '1px solid var(--color-secondary)', pl: 3 }}>
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', mb: 0.5 }}>
                  الإجمالي المتاح
                </Typography>
                <Typography sx={{ color: 'var(--color-secondary)', fontWeight: 700, fontSize: '1.4rem' }}>
                  {packageInfo.totalQuestions}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* قسم قواعد اللعبة */}
        <Box sx={{ 
          maxWidth: 1000, 
          margin: '60px auto 0', 
          padding: '0 20px',
          width: '100%'
        }}>
          <Typography 
            variant="h5" 
            sx={{
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '1.6rem',
              mb: 5,
              textAlign: 'center'
            }}
          >
            قواعد اللعبة
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                minHeight: '200px',
                boxShadow: 'var(--neu-shadow-raised)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 'var(--neu-shadow-hover)'
                }
              }}>
                <Typography variant="h6" sx={{color: 'var(--color-primary)', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  آلية اللعب
                </Typography>
                <Typography variant="body2" sx={{color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  منافسة ثقافية شيقة بين فريقين، حيث يختار كل فريق الفئات ويجيب على الأسئلة
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                minHeight: '200px',
                boxShadow: 'var(--neu-shadow-raised)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 'var(--neu-shadow-hover)'
                }
              }}>
                <Typography variant="h6" sx={{color: 'var(--color-primary)', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  الوقت
                </Typography>
                <Typography variant="body2" sx={{color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  60 ثانية للفريق، و30 ثانية للفريق المنافس
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                minHeight: '200px',
                boxShadow: 'var(--neu-shadow-raised)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 'var(--neu-shadow-hover)'
                }
              }}>
                <Typography variant="h6" sx={{color: 'var(--color-primary)', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  الفئات
                </Typography>
                <Typography variant="body2" sx={{color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  اختر 6 فئات مختلفة من الخيارات المتنوعة
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={5.5}>
              <Box sx={{
                background: 'var(--bg-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                minHeight: '200px',
                boxShadow: 'var(--neu-shadow-raised)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 'var(--neu-shadow-hover)'
                }
              }}>
                <Typography variant="h6" sx={{color: 'var(--color-primary)', fontWeight: 700, mb: 1.5, fontSize: '1.1rem'}}>
                  الفائز
                </Typography>
                <Typography variant="body2" sx={{color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.95rem'}}>
                  الفريق الذي يجمع أكبر عدد من النقاط يفوز
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* أسماء الفرق */}
      <StyledCard>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: 'var(--text-primary)',
            textAlign: 'center',
            fontSize: '1.1rem',
            fontWeight: 700,
            mb: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          أسماء الفرق
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: 'var(--color-secondary)', 
                  fontWeight: 700, 
                  mb: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                🔵 الفريق الأول
              </Typography>
              <TextField 
                fullWidth
                placeholder="أدخل اسم فريقك..."
                value={teams.team1}
                onChange={(e) => onTeamNameChange('team1', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    boxShadow: 'var(--neu-shadow-pressed)',
                    '& fieldset': { 
                      borderColor: 'transparent',
                      borderWidth: '0px'
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--color-secondary)',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'var(--text-muted)',
                    opacity: 1
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: 'var(--color-error)', 
                  fontWeight: 700, 
                  mb: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                🟠 الفريق الثاني
              </Typography>
              <TextField
                fullWidth
                placeholder="أدخل اسم فريقك..."
                value={teams.team2}
                onChange={(e) => onTeamNameChange('team2', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-primary)',
                    boxShadow: 'var(--neu-shadow-pressed)',
                    '& fieldset': { 
                      borderColor: 'transparent',
                      borderWidth: '0px'
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--color-error)',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'var(--text-muted)',
                    opacity: 1
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </StyledCard>

      {/* اختيار الفئات */}
      <StyledCard>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: 'var(--color-primary)', 
            textAlign: 'center',
            fontSize: '1.8rem',
            fontWeight: 800,
            mb: 1
          }}
        >
          🎲 اختيار الفئات
        </Typography>
        <Typography 
          variant="subtitle1" 
          gutterBottom 
          sx={{ 
            color: 'var(--color-primary)', 
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 700,
            mb: 4,
            background: 'var(--bg-secondary)',
            padding: '15px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--neu-shadow-pressed)'
          }}
        >
          📊 اختر 6 فئات ({selectedCategories.length} / 6)
        </Typography>
        
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {Object.entries(basicCategories).map(([category, data]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Box sx={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '25px',
                border: 'none',
                boxShadow: 'var(--neu-shadow-raised)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 'var(--neu-shadow-hover)'
                }
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: 'var(--text-primary)',
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  {category}
                </Typography>
                <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                  {data.subcategories.map((subcat) => (
                    <Grid item xs={12} key={subcat.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CategoryButton
                        selected={selectedCategories.includes(subcat.id)}
                        onClick={() => onCategorySelection(subcat.id)}
                      >
                        <CategoryImage src={subcat.image} alt={subcat.name} />
                        <Box sx={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          background: selectedCategories.includes(subcat.id) 
                            ? 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.3))'
                            : 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.4))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--radius-lg)'
                        }}>
                          <Typography
                            sx={{
                              color: 'var(--text-primary)',
                              fontSize: '1.1rem',
                              fontWeight: 800,
                              textShadow: '0 3px 8px rgba(0,0,0,0.6)',
                              textAlign: 'center',
                              padding: '0 10px'
                            }}
                          >
                            {subcat.name}
                          </Typography>
                        </Box>
                        {selectedCategories.includes(subcat.id) && (
                          <Box sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'var(--color-primary)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            color: '#fff',
                            boxShadow: 'var(--neu-shadow-soft)'
                          }}>
                            ✓
                          </Box>
                        )}
                      </CategoryButton>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
      </StyledCard>

      {/* الفئات المختارة */}
      {selectedCategories.length > 0 && (
        <StyledCard>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '1.1rem',
              mb: 3,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            الفئات المختارة ({selectedCategories.length}/6)
          </Typography>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={2}
            justifyContent="center"
          >
            {selectedCategories.map((id) => {
              const category = Object.values(basicCategories)
                .flatMap(cat => cat.subcategories)
                .find(sub => sub.id === id);
              return (
                <Chip
                  key={id}
                  label={category?.name}
                  onDelete={() => onCategorySelection(id)}
                  deleteIcon={<DeleteIcon />}
                  sx={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    padding: '8px 4px',
                    fontWeight: 600,
                    border: 'none',
                    boxShadow: 'var(--neu-shadow-raised)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'var(--color-secondary)',
                      transform: 'scale(1.05)',
                      boxShadow: 'var(--neu-shadow-hover)'
                    },
                    '& .MuiChip-deleteIcon': {
                      color: 'var(--text-muted)',
                      '&:hover': {
                        color: 'var(--color-error)'
                      }
                    }
                  }}
                />
              );
            })}
          </Box>
        </StyledCard>
      )}

      {/* زر البدء */}
      <Box 
        textAlign="center" 
        mt={8} 
        mb={4}
        sx={{
          animation: 'slideInUp 0.8s ease-out 0.2s both'
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleStartGame}
          disabled={selectedCategories.length !== 6 || !teams.team1 || !teams.team2}
          sx={{
            background: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2)
              ? 'var(--bg-secondary)' 
              : 'var(--color-secondary)',
            color: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2) ? 'var(--text-muted)' : 'var(--text-primary)',
            fontSize: '1.1rem',
            fontWeight: 600,
            padding: '16px 48px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: (selectedCategories.length !== 6 || !teams.team1 || !teams.team2)
              ? 'var(--neu-shadow-pressed)'
              : 'var(--neu-shadow-raised)',
            textTransform: 'none',
            letterSpacing: '0.3px',
            '&:hover:not(:disabled)': {
              background: 'var(--color-primary)',
              transform: 'translateY(-2px)',
              boxShadow: 'var(--neu-shadow-hover)',
            },
            '&:active:not(:disabled)': {
              transform: 'translateY(0)',
              boxShadow: 'var(--neu-shadow-pressed)'
            }
          }}
        >
          ابدأ اللعبة
        </Button>
        
        {(selectedCategories.length !== 6 || !teams.team1 || !teams.team2) && (
          <Typography 
            variant="body2" 
            sx={{
              color: 'var(--color-error)',
              mt: 2.5,
              fontSize: '0.95rem',
              fontWeight: 500
            }}
          >
            {!teams.team1 || !teams.team2 
              ? 'يرجى إدخال أسماء الفريقين' 
              : `اختر ${6 - selectedCategories.length} فئة أخرى`}
          </Typography>
        )}
      </Box>
          
      {error && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-secondary)',
            color: 'var(--color-error)',
            padding: '14px 28px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--neu-shadow-raised)',
            zIndex: 9999,
            animation: 'slideInDown 0.5s ease-out',
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          {error}
        </Box>
      )}

      <UserProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />

      <footer style={{
        width: '100%',
        padding: '48px 30px 32px',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--color-secondary)',
        marginTop: '80px',
        color: 'var(--text-muted)'
      }}>
        <Typography variant="body2" sx={{color: 'var(--text-muted)', fontSize: '0.9rem', mb: 1, fontWeight: 500}}>
          تحدي الجمعة - اختبر معلومات الدوري السعودي
        </Typography>
        <Typography variant="caption" sx={{color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400}}>
          جميع الحقوق محفوظة © 2024
        </Typography>
      </footer>
    </Container>  
  );
};

export default SetupPage;
