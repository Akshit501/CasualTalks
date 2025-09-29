// Notifications.jsx
import React, { useContext } from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { SocketContext } from '../SocketContext';

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  const [audio] = React.useState(new Audio('/ringtone.mp3'));

  React.useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      audio.loop = true;
      audio.play().catch(error => console.log('Audio play failed:', error));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [call.isReceivingCall, callAccepted, audio]);

  const handleAnswerCall = () => {
    audio.pause();
    audio.currentTime = 0;
    answerCall();
  };

  // Show notification only if receiving a call and not answered
  if (!call.isReceivingCall || callAccepted) return null;

  return (
    <Paper
      elevation={12}
      sx={{
        p: 3,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: 400,
        width: '90%',
        mt: 2,
        textAlign: 'center',
        mx: 'auto',
        animation: 'pulse 2s infinite',
        '@keyframes pulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
          },
        },
      }}
    >
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        sx={{ 
          color: 'white',
          fontWeight: 500,
          fontSize: '1.1rem',
        }}
      >
        {call.name || 'Someone'} is calling...
      </Typography>
      <Button
        variant="contained"
        onClick={handleAnswerCall}
        fullWidth
        sx={{ 
          mt: 2,
          background: 'rgba(76, 175, 80, 0.8)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: 'rgba(76, 175, 80, 0.9)',
          },
          textTransform: 'none',
          fontSize: '1.1rem',
          py: 1,
        }}
      >
        Answer Call
      </Button>
    </Paper>
  );
};

export default Notifications;
