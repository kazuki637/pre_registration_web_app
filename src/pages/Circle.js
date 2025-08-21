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
  Chip,
  FormControlLabel,
  Switch,
  FormHelperText,
  Radio,
  RadioGroup
} from '@mui/material';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, addDoc, collection, setDoc, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const FREQUENCIES = [
  '週１回',
  '週２回',
  '週３回',
  '月１回',
  '不定期',
];

const ACTIVITY_WEEKDAYS = [
  '月曜日',
  '火曜日',
  '水曜日',
  '木曜日',
  '金曜日',
  '土曜日',
  '日曜日',
  '不定期',
];

const GENDER_RATIO_OPTIONS = [
  '男性多め',
  '女性多め',
  '半々',
];

const MEMBERS_OPTIONS = [
  '1-10人',
  '11-30人',
  '31-50人',
  '51-100人',
  '100人以上',
];

const GENRES = [
  'スポーツ（球技）',
  'スポーツ（球技以外）',
  'アウトドア・旅行',
  '文化・教養',
  '芸術・芸能',
  '音楽',
  '学問・研究',
  '趣味・娯楽',
  '国際交流',
  'ボランティア',
  'イベント',
  'オールラウンド',
  'その他',
];

const FEATURES = [
  'イベント充実',
  '友達作り重視',
  '初心者歓迎',
  'ゆるめ',
  '真剣',
  '体育会系',
  'フラット',
  '和やか',
  '賑やか',
];

const Circle = () => {
  const navigate = useNavigate();
  const [circleName, setCircleName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [features, setFeatures] = useState([]);
  const [frequency, setFrequency] = useState('');
  const [activityDays, setActivityDays] = useState([]);
  const [genderratio, setGenderratio] = useState('');
  const [genre, setGenre] = useState('');
  const [members, setMembers] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [isRecruiting, setIsRecruiting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [circleType, setCircleType] = useState('学内サークル');
  const [error, setError] = useState('');
  
  // 既存サークル情報の状態
  const [existingCircle, setExistingCircle] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUniversityName(userData.university || '');
          setContactInfo(user.email || '');
          setRepresentativeName(userData.name || '');
        }
        
        // ユーザーの既存サークル情報を取得
        await checkExistingCircle(user.uid);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  // ユーザーの既存サークル情報をチェック
  const checkExistingCircle = async (userId) => {
    try {
      const circlesRef = collection(db, 'circles');
      const q = query(circlesRef, where('leaderId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const circleDoc = querySnapshot.docs[0];
        const circleData = circleDoc.data();
        setExistingCircle({
          id: circleDoc.id,
          ...circleData
        });
        setIsEditMode(true);
        
        // 既存データをフォームに設定
        setCircleName(circleData.name || '');
        setFeatures(circleData.features || []);
        setFrequency(circleData.frequency || '');
        setActivityDays(circleData.activityDays || []);
        setGenderratio(circleData.genderratio || '');
        setGenre(circleData.genre || '');
        setMembers(circleData.members || '');
        setCircleType(circleData.circleType || '学内サークル');
        setIsRecruiting(circleData.welcome?.isRecruiting || false);
      }
    } catch (error) {
      console.error('既存サークル情報の取得エラー:', error);
    }
  };

  const handleFeatureToggle = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((i) => i !== feature) : [...prev, feature]
    );
  };

  const handleActivityDayToggle = (day) => {
    setActivityDays((prev) =>
      prev.includes(day) ? prev.filter((i) => i !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    // 必須項目バリデーション
    if (!circleName || !universityName || !representativeName || !contactInfo || !genre || features.length === 0 || !frequency || !members || !genderratio) {
      setError('必須項目をすべて入力してください。');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('ユーザー情報が取得できませんでした。');
        return;
      }

      if (isEditMode && existingCircle) {
        // 既存サークルの更新
        const circleDocRef = doc(db, 'circles', existingCircle.id);
        await updateDoc(circleDocRef, {
          name: circleName,
          universityName,
          features,
          frequency,
          activityDays,
          genderratio,
          genre,
          members,
          contactInfo,
          circleType,
          welcome: {
            isRecruiting,
          },
          updatedAt: new Date(),
        });

        // 更新完了後、完了画面に遷移
        navigate('/complete', { state: { message: 'サークル情報が正常に更新されました。' } });
      } else {
        // 新規サークルの登録
        const circleDocRef = await addDoc(collection(db, 'circles'), {
          name: circleName,
          universityName,
          features,
          frequency,
          activityDays,
          genderratio,
          genre,
          members,
          contactInfo,
          circleType,
          welcome: {
            isRecruiting,
          },
          createdAt: new Date(),
          leaderId: user.uid,
          leaderName: representativeName,
        });

        // 作成者をmembersサブコレクションに追加（代表者として）
        await setDoc(doc(db, 'circles', circleDocRef.id, 'members', user.uid), { 
          joinedAt: new Date(),
          role: 'leader'
        });

        // ユーザーのjoinedCircleIdsに新しいサークルIDを追加
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          joinedCircleIds: arrayUnion(circleDocRef.id)
        });

        // 登録完了後、完了画面に遷移
        navigate('/complete', { state: { message: 'サークル情報が正常に登録されました。' } });
      }
    } catch (error) {
      console.error('Error saving circle:', error);
      setError(isEditMode ? 'サークル情報の更新中にエラーが発生しました。' : 'サークル情報の登録中にエラーが発生しました。');
    } finally {
      setUploading(false);
    }
  };

  if (!auth.currentUser) {
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

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            読み込み中...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          {isEditMode ? 'サークル情報編集' : 'サークル登録'}
        </Typography>

        {isEditMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            既存のサークル情報を編集できます。変更を保存すると、更新された情報が反映されます。
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 3 }}>
          {/* サークル種別選択 */}
          <Typography variant="h6" sx={{ mb: 2 }}>サークル種別</Typography>
          <FormControl component="fieldset" sx={{ mb: 3 }} required>
            <RadioGroup
              row
              value={circleType}
              onChange={(e) => setCircleType(e.target.value)}
            >
              <FormControlLabel
                value="学内サークル"
                control={<Radio />}
                label="学内サークル"
              />
              <FormControlLabel
                value="インカレサークル"
                control={<Radio />}
                label="インカレサークル"
              />
            </RadioGroup>
            <FormHelperText sx={{ color: '#e74c3c' }}>*必須項目</FormHelperText>
          </FormControl>

          <TextField
            fullWidth
            label="サークル名"
            value={circleName}
            onChange={(e) => setCircleName(e.target.value)}
            margin="normal"
            required
            placeholder="サークル名を入力してください"
            helperText="*必須項目"
            FormHelperTextProps={{ sx: { color: '#e74c3c' } }}
          />

          <TextField
            fullWidth
            label="大学名"
            value={universityName}
            margin="normal"
            required
            disabled
            helperText="登録時に設定された大学名 *必須項目"
            FormHelperTextProps={{ sx: { color: '#e74c3c' } }}
          />

          <TextField
            fullWidth
            label="代表者連絡先"
            value={contactInfo}
            margin="normal"
            required
            disabled
            helperText="登録時に設定された連絡先 *必須項目"
            FormHelperTextProps={{ sx: { color: '#e74c3c' } }}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>ジャンル</InputLabel>
            <Select
              value={genre}
              label="ジャンル"
              onChange={(e) => setGenre(e.target.value)}
            >
              {GENRES.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: '#e74c3c' }}>*必須項目</FormHelperText>
          </FormControl>

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>特色（複数選択可）</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {FEATURES.map((item) => (
              <Chip
                key={item}
                label={item}
                onClick={() => handleFeatureToggle(item)}
                color={features.includes(item) ? 'primary' : 'default'}
                variant={features.includes(item) ? 'filled' : 'outlined'}
                clickable
              />
            ))}
          </Box>
          <FormHelperText sx={{ mb: 2, color: '#e74c3c' }}>*必須項目（1つ以上選択してください）</FormHelperText>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>活動頻度</InputLabel>
            <Select
              value={frequency}
              label="活動頻度"
              onChange={(e) => setFrequency(e.target.value)}
            >
              {FREQUENCIES.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: '#e74c3c' }}>*必須項目</FormHelperText>
          </FormControl>

          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>活動曜日（複数選択可）</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {ACTIVITY_WEEKDAYS.map((item) => (
              <Chip
                key={item}
                label={item}
                onClick={() => handleActivityDayToggle(item)}
                color={activityDays.includes(item) ? 'primary' : 'default'}
                variant={activityDays.includes(item) ? 'filled' : 'outlined'}
                clickable
              />
            ))}
          </Box>
          <FormHelperText sx={{ mb: 2, color: '#e74c3c' }}>*必須項目（1つ以上選択してください）</FormHelperText>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>人数</InputLabel>
            <Select
              value={members}
              label="人数"
              onChange={(e) => setMembers(e.target.value)}
            >
              {MEMBERS_OPTIONS.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: '#e74c3c' }}>*必須項目</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>男女比</InputLabel>
            <Select
              value={genderratio}
              label="男女比"
              onChange={(e) => setGenderratio(e.target.value)}
            >
              {GENDER_RATIO_OPTIONS.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: '#e74c3c' }}>*必須項目</FormHelperText>
          </FormControl>

          {/* 入会募集状況 */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 3 }}>
            <Typography variant="h6">入会募集状況</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {isRecruiting ? '入会募集中' : '現在入会の募集はありません'}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isRecruiting}
                    onChange={(e) => setIsRecruiting(e.target.checked)}
                  />
                }
                label=""
              />
            </Box>
          </Box>
          <FormHelperText sx={{ mb: 2, color: '#e74c3c' }}>*必須項目（入会募集の有無を選択してください）</FormHelperText>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={uploading}
              sx={{ minWidth: 200 }}
            >
              {uploading ? <CircularProgress size={24} /> : (isEditMode ? 'サークル情報を更新' : 'サークルを登録')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Circle;
