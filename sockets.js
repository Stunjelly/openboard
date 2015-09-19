module.exports = function (io) {
  io.sockets.on('connection', function (socket) {
    socket.on('captain', function (data) {
      console.log(data);
      socket.emit('Hello');
    });
  });
};
