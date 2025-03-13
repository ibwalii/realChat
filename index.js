import express from "express";
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from "url"; // new in Node.js 13.2.0
import path from "path";

const app = express();
const port = 3000;

// create http server
const server = http.createServer(app);

// create socket server and attach it to http server
const io = new Server(server);

// Get the directory name (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// listen for incoming connections
io.on("connection", (socket) => {
    console.log('A user connected:', socket.id);

    // Send a welcome message to the client
    socket.emit('welcome', 'Welcome to the Socket.IO server!');

    // Listen for the 'setUsername' event
    socket.on('setUsername', (username) => {
        socket.username = username;
        io.emit('broadcast', `${username} has joined the chat!`);
    });

    // Listen for the 'message' event
    socket.on('message', (data) => {
        const message = `${socket.username}: ${data}`;
        io.emit('broadcast', message);
    });
    // handle disconnection
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});


// start server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});


