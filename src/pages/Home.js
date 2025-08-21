import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../context/AuthContext';
import icon from '../assets/icon.png';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      // ログイン済みの場合はプロフィール編集画面へ
      navigate('/profile');
    } else {
      // 未ログインの場合はサインアップ画面へ
      navigate('/signup');
    }
  };

  return (
    <Container maxWidth="md">
      {location.state?.message && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {location.state.message}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, mt: 4, textAlign: 'center' }}>
        <Box
          component="img"
          src={icon}
          alt="クルカツ アプリアイコン"
          sx={{ width: 80, height: 80, mb: 2, mx: 'auto' }}
        />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          あなたのサークル活動を
          <br />
          もっと便利に
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          クルカツは、大学生のサークル活動をサポートします。
          <br />
          アプリのリリースに先立ち、事前登録をお願いします！
        </Typography>

        <Box sx={{ my: 4, textAlign: 'left', display: 'inline-block' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center'}}>
            事前登録のメリット
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="事前登録サークルには限定特典あり！" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="無料でサークルの魅力を最大限にアピール" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="アプリリリース時に多くの新入生の目に留まる" />
            </ListItem>
          </List>
        </Box>

        <Box mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{ px: 4, py: 2, fontSize: '1.2rem' }}
          >
            {currentUser ? 'サークル情報を編集' : '今すぐ始める'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;