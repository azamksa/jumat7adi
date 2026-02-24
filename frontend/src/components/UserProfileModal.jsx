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
    background: 'var(--bg-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-primary)',
    minWidth: '500px',
    boxShadow: 'var(--neu-shadow-raised)'
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
        color: 'var(--color-primary)'
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
            bgcolor: 'var(--color-primary)',
            color: 'var(--bg-secondary)',
            fontSize: '32px',
            fontWeight: 'bold',
            boxShadow: 'var(--neu-shadow-raised)'
          }}>
            {formData.name ? getInitials(formData.name) : '?'}
          </Avatar>

          <Typography variant="body2" sx={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            معرف المستخدم: #{user?.id || 'غير محدد'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ 
              width: '100%',
              background: 'var(--bg-secondary)',
              color: 'var(--color-error)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--neu-shadow-pressed)'
            }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ 
              width: '100%',
              background: 'var(--bg-secondary)',
              color: 'var(--color-secondary)',
              border: '1px solid var(--color-secondary)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--neu-shadow-pressed)'
            }}>
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
                color: 'var(--text-primary)',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--neu-shadow-pressed)',
                '& fieldset': { 
                  borderColor: 'transparent' 
                },
                '&:hover fieldset': { 
                  borderColor: 'var(--color-secondary)' 
                },
                '&.Mui-focused fieldset': { 
                  borderColor: 'var(--color-primary)' 
                }
              },
              '& .MuiInputLabel-root': { 
                color: 'var(--text-muted)' 
              },
              '& .MuiInputLabel-root.Mui-focused': { 
                color: 'var(--color-primary)' 
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
                color: 'var(--text-primary)',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--neu-shadow-pressed)',
                '& fieldset': { 
                  borderColor: 'transparent' 
                },
                '&:hover fieldset': { 
                  borderColor: 'var(--color-secondary)' 
                },
                '&.Mui-focused fieldset': { 
                  borderColor: 'var(--color-primary)' 
                }
              },
              '& .MuiInputLabel-root': { 
                color: 'var(--text-muted)' 
              },
              '& .MuiInputLabel-root.Mui-focused': { 
                color: 'var(--color-primary)' 
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
            borderColor: 'var(--text-muted)',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-full)',
            padding: '10px 24px',
            '&:hover': {
              borderColor: 'var(--color-error)',
              color: 'var(--color-error)',
              background: 'transparent'
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
            background: 'var(--color-secondary)',
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            borderRadius: 'var(--radius-full)',
            padding: '10px 24px',
            boxShadow: 'var(--neu-shadow-raised)',
            '&:hover': {
              background: 'var(--color-primary)',
              boxShadow: 'var(--neu-shadow-hover)'
            },
            '&:disabled': {
              background: 'var(--text-muted)',
              color: 'var(--bg-secondary)'
            }
          }}
          startIcon={loading && <CircularProgress size={20} sx={{ color: 'var(--text-primary)' }} />}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default UserProfileModal;
