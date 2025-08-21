import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Circle from './pages/Circle';
import RegistrationComplete from './pages/RegistrationComplete';

// カスタムテーマを定義
const theme = createTheme({
  typography: {
    fontFamily: [
      'Noto Sans JP',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#007bff', // クルカツのテーマカラー
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/circle" element={<Circle />} />
                <Route path="/complete" element={<RegistrationComplete />} />
              </Routes>
            </Container>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
