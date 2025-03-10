import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true,
    }
});

const userSocketMap = {};

// Function to get the socket ID of a user
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // ✅ Listen for reactions
    socket.on("sendReaction", ({ messageId, userId, emoji }) => {
        io.emit("messageReaction", { messageId, userId, emoji });
    });

    // ✅ Handle user joining a chat room
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // ✅ Handle synchronized music playback
    socket.on("music-sync", ({ roomId, action, songUrl, songName, currentTime }) => {
        console.log(`Syncing music in room ${roomId}:`, { action, songUrl, songName, currentTime });
    
        // Broadcast to all users in the room except the sender
        io.to(roomId).emit("music-sync", { action, songUrl, songName, currentTime });
    });
    
    

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
