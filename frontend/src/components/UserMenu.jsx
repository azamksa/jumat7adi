import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider,
  ListItemIcon 
} from '@mui/material';
import { 
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
          background: 'var(--bg-secondary)',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          padding: '10px 20px',
          color: 'var(--text-primary)',
          fontWeight: 'bold',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: 'var(--neu-shadow-raised)',
          '&:hover': {
            background: 'var(--color-secondary)',
            boxShadow: 'var(--neu-shadow-hover)'
          }
        }}
        startIcon={
          <Avatar sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'var(--color-primary)',
            color: 'var(--bg-secondary)',
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
            background: 'var(--bg-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            mt: 1,
            boxShadow: 'var(--neu-shadow-raised)',
            '& .MuiMenuItem-root': {
              color: 'var(--text-primary)',
              fontSize: '16px',
              padding: '12px 20px',
              '&:hover': {
                background: 'var(--color-secondary)'
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
          <ListItemIcon sx={{ color: 'var(--color-primary)' }}>
            <Edit fontSize="small" />
          </ListItemIcon>
          تعديل البيانات الشخصية
        </MenuItem>
        
        <Divider sx={{ borderColor: 'var(--color-secondary)' }} />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'var(--color-error)' }}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          تسجيل الخروج
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
