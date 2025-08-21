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
          最高のサークル体験を、
          <br />
          ここから始めよう。
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          クルカツは、大学のサークル探しを最高に効率化するアプリです。
          <br />
          アプリのリリースに先立ち、あなたのサークル情報を先行登録して、誰よりも早く新入生にアピールしませんか？
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
              <ListItemText primary="リリースと同時に多くの新入生の目に留まる" />
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
              <ListItemText primary="簡単なステップで登録完了、すぐに始められる" />
            </ListItem>
          </List>
        </Box>

        <Box mt={4}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleGetStarted}
            sx={{ fontWeight: 'bold', px: 6, py: 1.5 }}
          >
            {currentUser ? 'プロフィールを編集' : '今すぐ無料で登録する'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;