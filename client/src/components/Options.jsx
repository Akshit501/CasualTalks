// Options.jsx
import React, { useState, useContext, useCallback } from 'react';
import { Button, TextField, Typography, Paper, Container, Box, Grid } from '@mui/material';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import { SocketContext } from '../SocketContext';

const Options = () => {
  const { me, callAccepted, callEnded, name, setName, callUser, leaveCall } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(async (e) => {
    if (e.ctrlKey) {
      if (e.key === 'c') {
        // Ctrl + C
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(me);
          setCopySuccess('ID Copied!');
          setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      } else if (e.key === 'v' && e.target.tagName !== 'INPUT') {
        // Ctrl + V (only if not already in an input field)
        e.preventDefault();
        try {
          const text = await navigator.clipboard.readText();
          setIdToCall(text);
        } catch (err) {
          console.error('Failed to paste:', err);
        }
      }
    }
  }, [me, setIdToCall]); // Add dependencies that are used inside the callback

  // Add event listener for keyboard shortcuts
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // Now we can safely add handleKeyDown as a dependency

  const copyToClipboard = async () => {
    try {
      console.log('Attempting to copy ID:', me);
      if (!me) {
        console.warn('No ID available to copy');
        setCopySuccess('No ID available!');
        setTimeout(() => setCopySuccess(''), 2000);
        return;
      }
      await navigator.clipboard.writeText(me);
      console.log('Successfully copied ID to clipboard');
      setCopySuccess('ID Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopySuccess('Failed to copy!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  return (
    <Container sx={{ maxWidth: 600, mt: 4 }}>
      <Paper 
        sx={{ 
          p: 3, 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }} 
        elevation={12}
      >
        <Grid container spacing={3}>
          {/* Account Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 500 }}>
              Account Info
            </Typography>
            <TextField 
              label="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              fullWidth 
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />
            <Box mt={2}>
              <Button 
                variant="contained"
                fullWidth
                onClick={copyToClipboard}
                sx={{ 
                  position: 'relative',
                  background: 'rgba(25, 118, 210, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(25, 118, 210, 0.9)',
                  },
                }}
              >
                <Assignment sx={{ mr: 1 }} /> 
                Copy Your ID (Ctrl+C)
                {copySuccess && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: -20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: 'success.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      zIndex: 1,
                    }}
                  >
                    {copySuccess}
                  </Typography>
                )}
              </Button>
            </Box>
          </Grid>

          {/* Call Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 500 }}>
              Make a Call
            </Typography>
            <TextField 
              label="ID to call (Ctrl+V to paste)" 
              value={idToCall} 
              onChange={(e) => setIdToCall(e.target.value)} 
              fullWidth 
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                },
              }}
            />
            <Box mt={2}>
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  startIcon={<PhoneDisabled />}
                  fullWidth
                  onClick={leaveCall}
                  sx={{
                    background: 'rgba(211, 47, 47, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(211, 47, 47, 0.9)',
                    },
                  }}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Phone />}
                  fullWidth
                  onClick={() => callUser(idToCall)}
                  sx={{
                    background: 'rgba(25, 118, 210, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(25, 118, 210, 0.9)',
                    },
                  }}
                >
                  Call
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Options;
