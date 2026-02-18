import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #003262, #E25822, #003262)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 138, 76, 0.3)',
    borderRadius: '20px',
    color: 'white',
    minWidth: '500px'
  }
}));

const UserProfileModal = ({ open, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('الاسم مطلوب');
      return;
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // استدعاء API لتحديث البيانات
      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          userId: user.id,
          name: formData.name,
          email: formData.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم تحديث البيانات بنجاح');
        
        // تحديث البيانات المحلية
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        onSave(updatedUser);
        
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000);
      } else {
        setError(data.error || 'فشل في تحديث البيانات');
      }
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#FF8A4C'
      }}>
        تعديل البيانات الشخصية
      </DialogTitle>

      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 3,
          mt: 2
        }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: '#FF8A4C',
            color: '#fff',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            {formData.name ? getInitials(formData.name) : '?'}
          </Avatar>

          <Typography variant="body2" sx={{ color: '#e0e0e0', textAlign: 'center' }}>
            معرف المستخدم: #{user?.id || 'غير محدد'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            label="الاسم الكامل"
            value={formData.name}
            onChange={handleChange('name')}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { 
                  borderColor: 'rgba(255, 255, 255, 0.3)' 
                },
                '&:hover fieldset': { 
                  borderColor: '#FF8A4C' 
                },
                '&.Mui-focused fieldset': { 
                  borderColor: '#FF8A4C' 
                }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)' 
              },
              '& .MuiInputLabel-root.Mui-focused': { 
                color: '#FF8A4C' 
              }
            }}
          />

          <TextField
            fullWidth
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { 
                  borderColor: 'rgba(255, 255, 255, 0.3)' 
                },
                '&:hover fieldset': { 
                  borderColor: '#FF8A4C' 
                },
                '&.Mui-focused fieldset': { 
                  borderColor: '#FF8A4C' 
                }
              },
              '& .MuiInputLabel-root': { 
                color: 'rgba(255, 255, 255, 0.7)' 
              },
              '& .MuiInputLabel-root.Mui-focused': { 
                color: '#FF8A4C' 
              }
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{
            borderColor: '#fff',
            color: '#fff',
            '&:hover': {
              borderColor: '#FF8A4C',
              color: '#FF8A4C'
            }
          }}
        >
          إلغاء
        </Button>
        
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(90deg, #FF8A4C, #E25822)',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(90deg, #fff, #FF8A4C)',
              color: '#003262'
            },
            '&:disabled': {
              background: '#888',
              color: '#fff'
            }
          }}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default UserProfileModal;
