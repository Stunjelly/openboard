module.exports = function (io) {
  io.sockets.on('connection', function (socket) {
    socket.on('joined-dashboard', function (data) {
      console.log(data);
      socket.emit('dashboard-pop', {yo: 'bomb'});
    });
  });
};
