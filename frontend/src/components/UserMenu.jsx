import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Typography, 
  Avatar, 
  Divider,
  ListItemIcon 
} from '@mui/material';
import { 
  AccountCircle, 
  Edit, 
  ExitToApp 
} from '@mui/icons-material';

const UserMenu = ({ user, onEditProfile, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleClose();
    onEditProfile();
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  // تحديد الأحرف الأولى من الاسم
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 20, 
      right: 20, 
      zIndex: 9999
    }}>
      <Button
        onClick={handleClick}
        sx={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 138, 76, 0.3)',
          borderRadius: '25px',
          padding: '10px 20px',
          color: '#FF8A4C',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          '&:hover': {
            background: 'rgba(0,0,0,0.8)',
            borderColor: '#FF8A4C'
          }
        }}
        startIcon={
          <Avatar sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: '#FF8A4C',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {getInitials(user.name)}
          </Avatar>
        }
      >
        {user.name}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 138, 76, 0.3)',
            borderRadius: '15px',
            mt: 1,
            '& .MuiMenuItem-root': {
              color: 'white',
              fontSize: '16px',
              padding: '12px 20px',
              '&:hover': {
                background: 'rgba(255, 138, 76, 0.1)'
              }
            }
          }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditProfile}>
          <ListItemIcon sx={{ color: '#FF8A4C' }}>
            <Edit fontSize="small" />
          </ListItemIcon>
          تعديل البيانات الشخصية
        </MenuItem>
        
        <Divider sx={{ borderColor: 'rgba(255, 138, 76, 0.2)' }} />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ color: '#ff5252' }}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          تسجيل الخروج
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
