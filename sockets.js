var db = require('./models');

module.exports = function (io, app) {
  io.sockets.on('connection', function (socket) {
    socket.on('joined-dashboard', function (data) {
      console.log(data);
      socket.emit('dashboard-pop', {yo: 'bomb'});
    });
    socket.on('request:cache', function (data) {
      // get cache data for that person
      console.log('request:cache', data);
      db.Widget.findById(data.widgetId).then(function (e) {
        if (e) {
          if (e.typeId == 1) {
            var x = e.cache;
            //socket.emit('updateWidget:' + data.widgetId, {data: x});
          }
        }
      });
    })
  });
};
