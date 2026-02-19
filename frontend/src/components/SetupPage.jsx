import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, Grid, Card } from '@mui/material';
import { PackageTracker } from '../utils/PackageTracker';
import UserMenu from './UserMenu';
import UserProfileModal from './UserProfileModal';

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
    <Container maxWidth="lg" sx={{ 
      py: 6, 
      minHeight: '100vh',
      background: 'transparent',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Header with User Menu */}
      {!currentUser ? (
        <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
          <Button 
            variant="contained"
            onClick={() => setShowLogin(true)}
            sx={{
              background: 'linear-gradient(135deg, #E25822 0%, #FF8A4C 100%)',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              fontFamily: "'Tajawal', sans-serif"
            }}
          >
            دخول
          </Button>
        </Box>
      ) : (
        <UserMenu
          user={currentUser}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      )}

      {/* Title Section */}
      <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
        <Typography 
          variant="h1"
          sx={{
            fontSize: { xs: '2.8rem', md: '4.2rem', lg: '5rem' },
            fontWeight: 900,
            color: '#003262',
            mb: 3,
            letterSpacing: '-1px',
            fontFamily: "'Tajawal', sans-serif"
          }}
        >
          تحدي الجمعة
        </Typography>
        <Box sx={{
          width: '80px',
          height: '4px',
          background: 'linear-gradient(90deg, #E25822 0%, #FF8A4C 100%)',
          margin: '0 auto',
          borderRadius: '2px'
        }} />
      </Box>

      {/* Package Info Card */}
      {currentUser && (
        <Card sx={{
          maxWidth: 500,
          margin: '40px auto',
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(0, 50, 98, 0.05), rgba(226, 88, 34, 0.04))',
          border: '1px solid rgba(0, 50, 98, 0.15)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 1, textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, fontFamily: "'Tajawal', sans-serif" }}>
            حزمتك الحالية
          </Typography>
          <Typography sx={{ color: '#E25822', fontSize: '1.8rem', fontWeight: 900, mb: 2, fontFamily: "'Tajawal', sans-serif" }}>
            {packageInfo.name}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, mb: 3, fontFamily: "'Tajawal', sans-serif" }}>
            {packageInfo.description}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 0.5, fontFamily: "'Tajawal', sans-serif" }}>
                النقاط المتبقية
              </Typography>
              <Typography sx={{ color: '#003262', fontWeight: 700, fontSize: '1.4rem', fontFamily: "'Tajawal', sans-serif" }}>
                {packageInfo.remainingQuestions}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ borderLeft: '1px solid rgba(0, 50, 98, 0.2)' }}>
              <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 0.5, fontFamily: "'Tajawal', sans-serif" }}>
                الإجمالي
              </Typography>
              <Typography sx={{ color: '#1F6AA5', fontWeight: 700, fontSize: '1.4rem', fontFamily: "'Tajawal', sans-serif" }}>
                {packageInfo.totalQuestions}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Team Names Input */}
      <Box sx={{ maxWidth: 600, margin: '50px auto' }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#003262', mb: 3, textAlign: 'center', fontFamily: "'Tajawal', sans-serif" }}>
          أسماء الفريقين
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="الفريق الأول"
              value={teams.team1 || ''}
              onChange={(e) => onTeamNameChange('team1', e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  color: '#003262',
                  fontFamily: "'Tajawal', sans-serif"
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#ccc',
                  opacity: 0.7
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="الفريق الثاني"
              value={teams.team2 || ''}
              onChange={(e) => onTeamNameChange('team2', e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  color: '#E25822',
                  fontFamily: "'Tajawal', sans-serif"
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Categories Selection */}
      <Box sx={{ maxWidth: 1000, margin: '50px auto' }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#003262', mb: 3, textAlign: 'center', fontFamily: "'Tajawal', sans-serif" }}>
          اختر 6 فئات ({selectedCategories.length}/6)
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(basicCategories).map(([categoryKey]) => (
            <Grid item xs={12} sm={6} md={4} key={categoryKey}>
              <Button
                onClick={() => onCategorySelection(categoryKey)}
                fullWidth
                sx={{
                  p: 2,
                  border: selectedCategories.includes(categoryKey) ? '2px solid #E25822' : '1px solid #ccc',
                  borderRadius: '8px',
                  background: selectedCategories.includes(categoryKey) 
                    ? 'linear-gradient(135deg, rgba(226, 88, 34, 0.1), rgba(255, 138, 76, 0.08))'
                    : 'transparent',
                  color: '#003262',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Tajawal', sans-serif",
                  '&:hover': {
                    borderColor: '#E25822',
                    background: 'linear-gradient(135deg, rgba(226, 88, 34, 0.15), rgba(255, 138, 76, 0.1))',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(226, 88, 34, 0.15)'
                  }
                }}
              >
                {categoryKey}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Error Message */}
      {error && (
        <Box sx={{
          maxWidth: 600,
          margin: '30px auto',
          padding: '14px 16px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#991b1b',
          fontSize: '0.9rem',
          fontFamily: "'Tajawal', sans-serif"
        }}>
          {error}
        </Box>
      )}

      {/* Start Game Button */}
      <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
        <Button
          onClick={handleStartGame}
          sx={{
            background: 'linear-gradient(135deg, #E25822 0%, #FF8A4C 100%)',
            color: 'white',
            padding: '16px 48px',
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: '8px',
            textTransform: 'none',
            fontFamily: "'Tajawal', sans-serif",
            boxShadow: '0 4px 12px rgba(226, 88, 34, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(226, 88, 34, 0.3)'
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
        >
          بدء اللعبة
        </Button>
      </Box>

      {/* Profile Modal */}
      <UserProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />
    </Container>
  );
};

export default SetupPage;
