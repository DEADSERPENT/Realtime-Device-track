import express from 'express';
import path from 'path';
import http from 'http';
import { Server as socketio } from 'socket.io';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from "cors";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(pkg());
app.use(cookieParser({Credential:true}));

// Required to replicate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(app);
const io = new socketio(server);

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
app.use('/api/auth', authRouter)


server.listen(PORT, () => console.log(`server running on port ${PORT}`));
