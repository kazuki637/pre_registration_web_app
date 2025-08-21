import React from 'react';
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
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmailIcon from '@mui/icons-material/Email';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import icon from '../assets/icon.png';
import instagramIcon from '../assets/instagram.png';

const RegistrationComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleRegisterCircle = () => {
    navigate('/circle');
  };

  return (
    <Container maxWidth="lg">
      {/* 成功メッセージ */}
      {location.state?.message && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {location.state.message}
        </Alert>
      )}

      {/* メイン完了セクション */}
      <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, mt: 4, textAlign: 'center' }}>
        <Box
          component="img"
          src={icon}
          alt="クルカツ アプリアイコン"
          sx={{ width: 80, height: 80, mb: 2, mx: 'auto' }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <CelebrationIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            登録完了！
          </Typography>
        </Box>

        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
          クルカツの事前登録が完了しました！
          <br />
          アプリのリリースをお楽しみに
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          ご協力ありがとうございました！
        </Typography>

        {/* 完了したステップ */}
        <Box sx={{ my: 4, textAlign: 'left', display: 'inline-block' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            完了したステップ
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="アカウント作成" secondary="メールアドレスとパスワードでアカウントを作成" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="プロフィール設定" secondary="氏名、大学名、学年、性別、生年月日を設定" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="サークル登録" secondary="サークルの詳細情報を登録" />
            </ListItem>
          </List>
        </Box>

        {/* 次のステップ */}
        <Box sx={{ my: 4, textAlign: 'left', display: 'inline-block' }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            次のステップ
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="リリース通知を受け取る" secondary="リリース時にメールまたはインスタグラムでお知らせします" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SmartphoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="アプリをダウンロード" secondary="リリース後、アプリを利用開始" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GroupIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="新入生とマッチング" secondary="登録したサークル情報で新入生とつながる" />
            </ListItem>
          </List>
        </Box>

        {/* アクションボタン */}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleGoHome}
            sx={{ fontWeight: 'bold', px: 4, py: 1.5 }}
          >
            ホームに戻る
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large" 
            onClick={handleViewProfile}
            sx={{ fontWeight: 'bold', px: 4, py: 1.5 }}
          >
            プロフィール編集
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large" 
            onClick={handleRegisterCircle}
            sx={{ fontWeight: 'bold', px: 4, py: 1.5 }}
          >
            サークル追加登録
          </Button>
        </Box>
      </Paper>

      {/* お知らせセクション */}
      <Paper elevation={2} sx={{ p: 4, my: 4, backgroundColor: 'primary.50' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          お知らせ
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          アプリの開発状況やリリース予定についての
          <br />
          最新情報は公式インスタグラムでチェックできます。
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e0852a 0%, #d55f2b 25%, #c21f33 50%, #b21a56 75%, #a30f68 100%)',
              }
            }}
            href="https://www.instagram.com/kurukatsu_app?igsh=bmRhcTk3bWsyYmVj&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Box component="img" src={instagramIcon} alt="Instagram" sx={{ width: 24, height: 24, mr: 1 }} />}
          >
            公式インスタグラム
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrationComplete;
