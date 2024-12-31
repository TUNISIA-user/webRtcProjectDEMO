const express = require('express');
const http = require('http');
const { off } = require('process');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
    origin:"*"
});

// Serve your index.html and other static files
app.use(express.static('../public')); // Make sure your index.html and main.js are in the 'public' directory
 
io.on('connection', (socket) => {
    
    socket.on("offer",data=>{
       
        
        socket.broadcast.emit("getOffer",  data);
       

        
    })
    

    socket.on("sendAnswer",ice=>{
        
        socket.broadcast.emit("sendtheAnswer",ice)
    })
     
     
      


    socket.on('disconnect', () => {
        console.log('user left the room',socket.id);
    });
});

// Start server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
