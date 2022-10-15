const express = require("express");

const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";

const app = express();
app.use((_req, res) => res.sendFile(INDEX, { root: __dirname }));

const server = app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}...`)
);

// socket server
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: `http://localhost:3000`,
},});

io.on("connection", (socket) => {
  socket.on("reqTurn", (data) => {
    const room = JSON.parse(data).room;
    socket.to(room).emit("playerTurn", data);
  });

  socket.on("create", (room) => {
    socket.join(room);
  });

  socket.on("join", (room) => {
    socket.join(room);
    io.to(room).emit("opponent_joined");
  });

  socket.on("reqRestart", (room) => {
    io.to(room).emit("restart");
  });

  socket.on("setDeck", (data) => {
    const room = JSON.parse(data).room;
    socket.broadcast.to(room).emit("deckID", data);
  });
});
