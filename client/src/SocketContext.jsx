import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const initMedia = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error('Error accessing camera/mic:', err);
      }
    };

    initMedia();

    const handleNewId = (id) => {
      console.log('Received ID:', id);
      setMe(id);
    };

    const handleIncomingCall = ({ from, name: callerName, signal }) => {
      console.log('Incoming call from:', callerName);
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    };

    const handleCallEnded = () => {
      console.log('Call ended by peer');
      window.location.reload();
    };

    socket.on('me', handleNewId);
    socket.on('calluser', handleIncomingCall);
    socket.on('callended', handleCallEnded);

    // Request ID explicitly
    socket.emit('request-id');

    return () => {
      socket.off('me', handleNewId);
      socket.off('calluser', handleIncomingCall);
      socket.off('callended', handleCallEnded);
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    setCallEnded(false);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      console.log('Sending answer signal');
      socket.emit('answercall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      console.log('Received remote stream');
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    console.log('Calling user:', id);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('calluser', {
        userToCall: id,
        signalData: data,
        from: me,
        name: name || 'Anonymous'
      });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.once('callaccepted', (signal) => {
      console.log('Call accepted');
      setCallAccepted(true);
      setCallEnded(false);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };