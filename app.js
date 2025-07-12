const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function (socket) {
    console.log("User connected:", socket.id);
    
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    socket.on("disconnect", function () {
        console.log("User disconnected:", socket.id);
        io.emit("user-disconnected", socket.id);
    });
});

app.get('/', function (req, res) {
    res.render('index');
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));