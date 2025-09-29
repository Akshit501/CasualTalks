// App.js
import React from 'react';
import { Typography, AppBar, Toolbar, Box } from '@mui/material';
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';
import backgroundImage from './earth.jpg';

const App = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #dbeafe 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: { xs: '90%', md: 600 },
          mb: 4,
        }}
      >
        <Toolbar>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              width: '100%',
              color: 'white',
              fontWeight: 600,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Video Chat
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Video Boxes */}
      <VideoPlayer />

      {/* Options / Sidebar */}
      <Options />
      
      {/* Notifications for incoming calls */}
      <Notifications />
      
    </Box>
  );
};

export default App;
