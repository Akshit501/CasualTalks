// VideoPlayer.jsx
import React, { useContext } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { SocketContext } from '../SocketContext';

const VideoPlayer = () => {
  const { name, callAccepted, callEnded, myVideo, userVideo, stream, call } = useContext(SocketContext);

  return (
    <Grid container spacing={3} justifyContent="center">
      {stream ? (
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={12}
            sx={{ 
              p: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center', fontWeight: 500 }}>
              {name || 'You'}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                '& video': {
                  width: '100%',
                  transform: 'scaleX(-1)',  // Mirror effect
                  borderRadius: 2,
                }
              }}
            >
              <video playsInline muted ref={myVideo} autoPlay />
            </Box>
          </Paper>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Paper 
            elevation={12}
            sx={{ 
              p: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}
          >
            <Typography variant="body1" sx={{ color: '#ff1744' }}>
              Camera/Microphone access denied. Some features may be limited.
            </Typography>
          </Paper>
        </Grid>
      )}

      {callAccepted && !callEnded && (
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={12}
            sx={{ 
              p: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center', fontWeight: 500 }}>
              {call.name || 'Caller'}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                '& video': {
                  width: '100%',
                  borderRadius: 2,
                }
              }}
            >
              <video playsInline ref={userVideo} autoPlay />
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default VideoPlayer;
