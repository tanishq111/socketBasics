const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); /// need to be explained 



const app = express();
app.use(cors()); // cors middleware to allow cross-origin requests

const server = http.createServer(app);

const io = new Server(server,{
     cors:{
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
     }
})

io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('sendMessage', (data) => {
            console.log('Message received:', data);
            socket.broadcast.emit('receiveMessage', data);
        });

        socket.on("typing", () =>{
            socket.broadcast.emit("userTyping", socket.id);
        });

        socket.on("stopTyping", () =>{
            socket.broadcast.emit("stopTyping", socket.id );
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        }); 
});

// on to send a message
// event -> sendMessage
// emit -> what to do when you receive message

server.listen(3001, () =>{
    console.log('Server is running on port 3001');
});