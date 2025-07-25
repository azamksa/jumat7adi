import { 
  Container,
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(5), // increased padding for larger size
  marginBottom: theme.spacing(5), // increased margin
  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)', // stronger shadow
  border: '1px solid rgba(255, 255, 255, 0.1)'
}));

const CategoryButton = styled(Button)(({ theme, selected }) => ({
  width: '200px',
  height: '250px', // taller vertical rectangle
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
  position: 'absolute',
  top: 20,
  left: 0,
  width: '100%',
  height: '80%',
  objectFit: 'fill',
  opacity: 0.4, // slightly transparent
  filter: 'brightness(0.8)',
  transition: 'opacity 0.3s ease',
  zIndex: 1,
});

const CategoryText = styled(Typography)({
  position: 'relative',
  color: 'white',
  fontSize: '1.8rem',
  fontWeight: 'bold',
  textShadow: '0 0 8px rgba(0,0,0,0.7)',
  userSelect: 'none',
  zIndex: 2,
  textAlign: 'center',
});

const InfoIconButton = styled(IconButton)({
  position: 'absolute',
  top: '8px',
  left: '8px',
  color: 'white',
  backgroundColor: 'rgba(0,0,0,0.3)',
  zIndex: 3,
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});

const SetupPage = ({ 
  teams,
  selectedCategories,
  basicCategories,
  handleTeamNameChange,
  handleCategorySelection,
  startGame,
  error,
  setShowLogin,
  user
}) => {
  // State to track which category's description tooltip is open (for click)
  const [openTooltipId, setOpenTooltipId] = useState(null);

  const handleInfoClick = (id) => {
    setOpenTooltipId(openTooltipId === id ? null : id);
  };

  return (
    <Container maxWidth="lg">
      {/* زر تسجيل الدخول */}
      {!user && (
        <Box sx={{ position: 'absolute', right: 20, top: 20,  }}>
          <Button 
            variant="outlined" 
            onClick={() => setShowLogin(true)}
            sx={{
              padding: '16px 32px',
              fontSize: '2.0rem',
              fontWeight: 'bold',
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'gold',
                color: 'gold'
              }
            }}
          >
            تسجيل الدخول
          </Button>
        </Box>
      )}

      <Box textAlign="center" mb={6} pt={4}>
        <Typography variant="h2" component="h1" 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingY: 4,
            color: 'gold',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            fontWeight: 800,
            mb: 2
          }}>
          تحدي الجمعة
        </Typography>

        {/* شرح اللعبة */}
        <Box sx={{ 
            
          maxWidth: 600, 
          margin: '0 auto', 
          padding: 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 2
        }}>
          <Typography variant="h5" sx={{color: '#e0e0e0', mb: 1, }}>
            🎮 لعبة تحدي الجمعة هي منافسة ثقافية بين فريقين
          </Typography>
          <Typography variant="h5" sx={{ color: '#e0e0e0', mb: 1 }}>
            ⏱️ لكل سؤال 60 ثانية للإجابة و30 ثانية للفريق الأخرى
          </Typography>
          <Typography variant="h5" sx={{ color: '#e0e0e0', mb: 1 }}>
            🎯 اختر 3 فئات مختلفة لكل فريق و 6 المجموع
          </Typography>
          <Typography variant="h5" sx={{ color: '#e0e0e0'}}>
            🏆 الفريق الذي يجمع أكبر عدد من النقاط يفوز باللعبة
          </Typography>
        </Box>
      </Box>

      <StyledCard >
        <Typography variant="h4" gutterBottom sx={{ color: 'gold', textAlign: 'center' }}>
          أسماء الفرق
        </Typography>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField 
              fullWidth
              label="الفريق الأول"
              value={teams.team1}
              onChange={(e) => handleTeamNameChange('team1', e.target.value)}
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
              onChange={(e) => handleTeamNameChange('team2', e.target.value)}
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

      <StyledCard>
        <Typography variant="h4" gutterBottom sx={{ color: 'gold', textAlign: 'center' }}>
          اختيار الفئات
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#e0e0e0', textAlign: 'center' }}>
          اختر 6 فئات من القائمة أدناه ({selectedCategories.length} / 6)
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {Object.entries(basicCategories).map(([category, data]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Paper
                sx={{  
                  p: 2,
                  background: data.color,
                  borderRadius: '15px'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {category}
                </Typography>
                <Grid container spacing={1}>
                  {data.subcategories.map((subcat) => {
                    const isSelected = selectedCategories.includes(subcat.id);
                    return (
                      <Grid item xs={12} key={subcat.id}>
                        <CategoryButton
                          selected={isSelected}
                          onClick={() => handleCategorySelection(subcat.id)}
                        >
                          <CategoryImage 
                            src={subcat.image} 
                            alt={subcat.name}
                          />
                          <CategoryText>{subcat.name}</CategoryText>
<Tooltip 
  title={<span style={{ fontSize: '1.2rem' }}>{subcat.description}</span>} 
  open={openTooltipId === subcat.id} 
  onClose={() => setOpenTooltipId(null)} 
  disableFocusListener 
  disableHoverListener
  disableTouchListener
  placement="top"
>
                            <InfoIconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInfoClick(subcat.id);
                              }}
                              aria-label="info"
                            >
                              <ErrorOutlineIcon />
                            </InfoIconButton>
                          </Tooltip>
                        </CategoryButton>
                      </Grid>
                    );
                  })}
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
                  onDelete={() => handleCategorySelection(id)}
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
          onClick={startGame}
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
          {error}
        </Box>
      )}
    </Container>
  );
};

export default SetupPage;
