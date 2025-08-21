import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' クルカツ. All rights reserved. '}
          <Link color="inherit" href="https://kazuki637.github.io/kurukatsu-docs/terms.html" target="_blank">
            利用規約
          </Link>
          {' | '}
          <Link color="inherit" href="https://kazuki637.github.io/kurukatsu-docs/privacy.html" target="_blank">
            プライバシーポリシー
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;