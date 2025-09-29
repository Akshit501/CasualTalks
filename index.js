require('dotenv').config();
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const cors = require('cors');
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : "*"
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
  res.send("Server is running");

});


io.on("connection",(socket)=>{
  console.log('New client connected with ID:', socket.id);
  
  // Ensure we have a valid socket ID before sending
  if (socket.id) {
    // Send ID immediately on connection
    console.log('Sending initial ID to client:', socket.id);
    socket.emit("me", socket.id);
  }
  
  // Handle explicit ID requests
  socket.on('request-id', () => {
    if (socket.id) {
      console.log('ID requested by client, sending:', socket.id);
      socket.emit("me", socket.id);
    } else {
      console.error('Socket ID not available for request-id event');
    }
  });

  socket.on('disconnect',()=>{
    console.log('Client disconnected:', socket.id);
    socket.broadcast.emit("callended");
  });


  socket.on('calluser',({userToCall, signalData, from, name})=>{
    io.to(userToCall).emit("calluser",{signal: signalData, from, name});
  });



socket.on("answercall", (data) => {
  io.to(data.to).emit("callaccepted", data.signal);
});


});


server.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});

