const path = require("path");
const express = require("express");
const http = require("http");
const Filter = require("bad-words");
const socketio = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 8000;
const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

io.on("connection", (socket) => {
  console.log("new websocket connection");
  socket.emit("welcome");
  socket.broadcast.emit("display-text", "A new user has joined");
  socket.on("message", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("profanity isn't allowed");
    }
    io.emit("display-text", message);
    callback();
  });
  socket.on("share-location", (coords, callback) => {
    io.emit(
      "display-text",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("display-text", "User left the chat");
  });
});

server.listen(port, () => {
  console.log("server started");
});
