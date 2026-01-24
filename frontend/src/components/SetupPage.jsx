import React, { useState, useEffect } from 'react';
import { 
  Container,
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Chip,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import UserMenu from './UserMenu';
import UserProfileModal from './UserProfileModal';
import { PackageTracker } from '../utils/PackageTracker';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(5),
  marginBottom: theme.spacing(5),
  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
}));

const CategoryButton = styled(Button)(({ theme, selected }) => ({
  width: '200px',
  height: '250px',
  borderRadius: '10px',
  background: selected ? 'rgba(76, 201, 240, 0.3)' : 'rgba(255, 255, 255, 0.15)',
  border: selected ? '2px solid #4cc9f0' : 'none',
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    background: selected ? 'rgba(76, 201, 240, 0.4)' : 'rgba(255, 255, 255, 0.25)'
  }
}));

const CategoryImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.6
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
      // جلب مستوى الحزمة للمستخدم
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

    // زيادة مستوى الحزمة بعد بدء اللعب
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
        position: 'relative'
      }}
    >
      {/* قائمة المستخدم */}
      {!currentUser ? (
        <Box sx={{ 
          position: 'fixed', 
          right: 20, 
          top: 20, 
          zIndex: 1000 
        }}>
          <Button 
            variant="outlined" 
            onClick={() => setShowLogin(true)}
            sx={{
              padding: '12px 24px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'white',
              borderColor: 'white',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              '&:hover': {
                borderColor: 'gold',
                color: 'gold',
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              }
            }}
          >
            تسجيل الدخول
          </Button>
        </Box>
      ) : (
        <UserMenu
          user={currentUser}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      )}

      <Box textAlign="center" mb={6} pt={4}>
        <Typography variant="h2" component="h1" 
          sx={{ 
            color: 'gold',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontWeight: 800,
            mb: 2
          }}>
          تحدي الجمعة
        </Typography>

        {/* عرض معلومات الحزمة */}
        {currentUser && (
          <Box sx={{
            background: packageInfo.color + '20',
            border: `2px solid ${packageInfo.color}`,
            borderRadius: '15px',
            padding: '15px 25px',
            margin: '20px auto',
            maxWidth: '400px'
          }}>
            <Typography variant="h6" sx={{ color: packageInfo.color, fontWeight: 'bold' }}>
              {packageInfo.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
              مستوى الصعوبة: {packageInfo.difficulty}
            </Typography>
          </Box>
        )}

        <Box sx={{ 
          maxWidth: 600, 
          margin: '0 auto', 
          padding: 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 2
        }}>
          <Typography variant="h5" sx={{color: '#e0e0e0', mb: 1}}>
            🎮 لعبة تحدي الجمعة هي منافسة ثقافية بين فريقين
          </Typography>
          <Typography variant="h5" sx={{color: '#e0e0e0', mb: 1}}>
            ⏱️ لكل سؤال 60 ثانية للإجابة و30 ثانية للفريق الأخرى
          </Typography>
          <Typography variant="h5" sx={{color: '#e0e0e0', mb: 1}}>
            🎯 اختر 3 فئات مختلفة لكل فريق و 6 المجموع
          </Typography>
          <Typography variant="h5" sx={{color: '#e0e0e0'}}>
            🏆 الفريق الذي يجمع أكبر عدد من النقاط يفوز باللعبة
          </Typography>
        </Box>
      </Box>

      {/* باقي المحتوى كما هو... */}
      <StyledCard>
        <Typography variant="h4" gutterBottom sx={{ color: 'gold', textAlign: 'center' }}>
          أسماء الفرق
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth
              label="الفريق الأول"
              value={teams.team1}
              onChange={(e) => onTeamNameChange('team1', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: 'white' }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="الفريق الثاني"
              value={teams.team2}
              onChange={(e) => onTeamNameChange('team2', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                },
                '& .MuiInputLabel-root': { color: 'white' }
              }}
            />
          </Grid>
        </Grid>
      </StyledCard>

      {/* اختيار الفئات */}
      <StyledCard>
        <Typography variant="h4" gutterBottom sx={{ color: 'gold', textAlign: 'center' }}>
          اختيار الفئات
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#e0e0e0', textAlign: 'center' }}>
          اختر 6 فئات من القائمة أدناه ({selectedCategories.length} / 6)
        </Typography>
        
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {Object.entries(basicCategories).map(([category, data]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Paper sx={{ 
                p: 2, 
                background: data.color, 
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <Typography variant="h6" gutterBottom>
                  {category}
                </Typography>
                <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
                  {data.subcategories.map((subcat) => (
                    <Grid item xs={12} key={subcat.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CategoryButton
                        selected={selectedCategories.includes(subcat.id)}
                        onClick={() => onCategorySelection(subcat.id)}
                      >
                        <CategoryImage src={subcat.image} alt={subcat.name} />
                        <Typography
                          sx={{
                            position: 'absolute',
                            color: 'white',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            textAlign: 'center',
                            padding: '0 8px'
                          }}
                        >
                          {subcat.name}
                        </Typography>
                      </CategoryButton>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </StyledCard>

      {selectedCategories.length > 0 && (
        <StyledCard>
          <Typography variant="h6" gutterBottom sx={{ color: '#e0e0e0' }}>
            الفئات المختارة
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedCategories.map(id => {
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
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'white'
                    }
                  }}
                />
              );
            })}
          </Box>
        </StyledCard>
      )}

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          size="large"
          onClick={handleStartGame}
          disabled={selectedCategories.length !== 6 || !teams.team1 || !teams.team2}
          sx={{
            background: 'linear-gradient(90deg, #FFD700, #ffb300)',
            color: '#222',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            padding: '12px 40px',
            '&:disabled': {
              background: '#888',
              color: '#fff'
            }
          }}
        >
          ابدأ اللعبة
        </Button>
      </Box>
          
      {error && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ff5252',
            color: '#fff',
            padding: '16px 32px',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            zIndex: 9999
          }}
        >
          ⚠️ {error}
        </Box>
      )}

      {/* نافذة تعديل البيانات */}
      <UserProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />

      <footer style={{
        width: '100%',
        padding: '20px 0',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.9rem',
        borderTop: '1px solid #444',
        backdropFilter: 'blur(10px)',
        marginTop: 'auto',
        paddingRight: '100px'
        }}>
        .هذا الموقع مصمم من مطور سعودي لهدف إنشاء لعبة تجمع الأهل والأصدقاء للاستمتاع. جميع الحقوق محفوظة
      </footer>
    </Container>  
  );
};

export default SetupPage;
