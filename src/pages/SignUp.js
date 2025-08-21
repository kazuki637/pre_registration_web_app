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
  Link,
  FormControl,
  FormHelperText
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // パスワード検証関数
  const validatePassword = (password) => {
    const errors = [];
    // 8文字以上
    if (password.length < 8) {
      errors.push("・8文字以上で入力してください。");
    }
    // アルファベットを含む
    if (!/[a-zA-Z]/.test(password)) {
      errors.push("・アルファベットを1文字以上含めてください。");
    }
    // 数字を含む
    if (!/[0-9]/.test(password)) {
      errors.push("・数字を1文字以上含めてください。");
    }
    return errors;
  };

  // パスワード入力時のリアルタイムバリデーション
  const handlePasswordChange = (text) => {
    setPassword(text);
    const errors = validatePassword(text);
    setPasswordErrors(errors);
  };

  const handleSignup = async () => {
    // パスワード確認チェック
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    // パスワード条件チェック
    if (passwordErrors.length > 0) {
      setError('パスワードの条件を満たしていません。');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // ユーザープロフィールドキュメントを作成
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        createdAt: new Date(),
        // 初期値として空の配列を設定
        joinedCircleIds: [],
        favoriteCircleIds: [],
        // プロフィール情報は後で設定
        name: '',
        university: '',
        grade: '',
        gender: '',
        birthday: '',
        profileImageUrl: '',
        isUniversityPublic: true,
        isGradePublic: true
      });
      
      // プロフィール編集画面に遷移
      navigate('/profile', { state: { fromSignup: true } });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openTermsOfService = () => {
    window.open('https://kazuki637.github.io/kurukatsu-docs/terms.html', '_blank');
  };

  const openPrivacyPolicy = () => {
    window.open('https://kazuki637.github.io/kurukatsu-docs/privacy.html', '_blank');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            クルカツへようこそ！
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <TextField
            fullWidth
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="パスワード"
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            margin="normal"
            required
            autoComplete="new-password"
            error={passwordErrors.length > 0}
          />

          {passwordErrors.length > 0 && (
            <FormControl fullWidth error sx={{ mt: 1 }}>
              <FormHelperText>
                {passwordErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </FormHelperText>
            </FormControl>
          )}

          <TextField
            fullWidth
            label="パスワード（確認）"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !email || !password || !confirmPassword || passwordErrors.length > 0}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : '登録'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            続行することでクルカツの
            <Link component="button" variant="body2" onClick={openTermsOfService}>
              利用規約
            </Link>
            に同意し、クルカツの
            <Link component="button" variant="body2" onClick={openPrivacyPolicy}>
              プライバシーポリシー
            </Link>
            を読んだものとみなされます。
          </Typography>

          <Button
            variant="text"
            onClick={() => navigate('/')}
            sx={{ mt: 1 }}
          >
            ログイン画面へ戻る
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
