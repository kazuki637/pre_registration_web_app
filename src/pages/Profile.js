import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import universitiesData from '../universities.json';

const GRADES = ['大学1年', '大学2年', '大学3年', '大学4年', '大学院1年', '大学院2年', 'その他'];
const GENDERS = ['男性', '女性', 'その他', '回答しない'];

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromSignup = location.state?.fromSignup || false;
  
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [grade, setGrade] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState(new Date(2000, 0, 1));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 大学名の候補
  const [universitySuggestions, setUniversitySuggestions] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          setName(d.name || '');
          setUniversity(d.university || '');
          setGrade(d.grade || '');
          setGender(d.gender || '');
          setBirthday(d.birthday ? new Date(d.birthday) : new Date(2000, 0, 1));
        }
      } catch (error) {
        console.error('ユーザーデータの取得エラー:', error);
        setError('ユーザーデータの取得に失敗しました。');
      }
    };

    fetchUserData();
  }, [user]);

  // 大学名の候補をフィルタリングする関数
  const filterUniversities = (input) => {
    if (!input.trim()) {
      setUniversitySuggestions([]);
      return;
    }
    
    const filtered = universitiesData.filter(uni => 
      uni.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 10);
    
    setUniversitySuggestions(filtered);
  };

  const handleSave = async () => {
    if (!name.trim() || !university.trim() || !grade || !gender || !birthday) {
      setError('全ての必須項目を入力してください。');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        university,
        isUniversityPublic: true,
        grade,
        isGradePublic: true,
        gender,
        birthday: birthday.getFullYear() + '-' + 
                 String(birthday.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(birthday.getDate()).padStart(2, '0'),
      }, { merge: true });

      setSuccess('プロフィールを保存しました。');
      
      // 新規登録からの場合は少し遅延を入れてから画面遷移
      if (fromSignup) {
        setTimeout(() => {
          navigate('/circle');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('プロフィールの保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            ログインが必要です
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          プロフィール編集
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="氏名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            helperText="*必須項目"
            FormHelperTextProps={{ sx: { color: '#e74c3c' } }}
          />

          <Autocomplete
            freeSolo
            options={universitySuggestions}
            value={university}
            onChange={(event, newValue) => {
              setUniversity(newValue || '');
            }}
            onInputChange={(event, newInputValue) => {
              setUniversity(newInputValue);
              filterUniversities(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="大学名"
                margin="normal"
                required
                helperText="*必須項目"
                FormHelperTextProps={{ sx: { color: '#e74c3c' } }}
              />
            )}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>学年</InputLabel>
            <Select
              value={grade}
              label="学年"
              onChange={(e) => setGrade(e.target.value)}
            >
              {GRADES.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: '#e74c3c' }}>*必須項目</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>性別</InputLabel>
            <Select
              value={gender}
              label="性別"
              onChange={(e) => setGender(e.target.value)}
            >
              {GENDERS.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: '#e74c3c' }}>*必須項目</FormHelperText>
          </FormControl>

          <Box sx={{ mb: 2 }} />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="生年月日"
              value={birthday}
              onChange={(newValue) => setBirthday(newValue)}
              maxDate={new Date()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  required
                />
              )}
            />
          </LocalizationProvider>
          <FormHelperText sx={{ color: '#e74c3c', mt: 1, ml: 2 }}>*必須項目</FormHelperText>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving || loading}
              sx={{ minWidth: 200 }}
            >
              {saving ? <CircularProgress size={24} /> : '保存する'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;