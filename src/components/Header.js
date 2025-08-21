import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleCircle = () => {
    navigate('/circle');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          クルカツ
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {currentUser ? (
            <>
              <Button
                color="inherit"
                onClick={handleProfile}
              >
                プロフィール
              </Button>
              <Button
                color="inherit"
                onClick={handleCircle}
              >
                サークル登録
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
              >
                ログアウト
              </Button>
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
              >
                {currentUser.email?.charAt(0).toUpperCase()}
              </Avatar>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/signup')}
              >
                サインアップ
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;