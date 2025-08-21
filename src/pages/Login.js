import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  CircularProgress,
  Link
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ログイン成功後、ホーム画面に遷移
      navigate('/', { state: { message: 'ログインが完了しました。' } });
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setError('このメールアドレスは登録されていません。');
          break;
        case 'auth/wrong-password':
          setError('パスワードが間違っています。');
          break;
        case 'auth/invalid-email':
          setError('有効なメールアドレスを入力してください。');
          break;
        case 'auth/too-many-requests':
          setError('ログイン試行回数が多すぎます。しばらく時間をおいてから再試行してください。');
          break;
        default:
          setError('ログインに失敗しました。もう一度お試しください。');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            ログイン
          </Typography>
          <Typography variant="body1" color="text.secondary">
            既存のアカウントでログインしてください
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
            autoFocus
          />

          <TextField
            fullWidth
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'ログイン'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            アカウントをお持ちでない方は
            <Link component="button" variant="body2" onClick={() => navigate('/signup')}>
              こちら
            </Link>
            から新規登録してください。
          </Typography>

          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{ mt: 1 }}
          >
            ホームに戻る
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
