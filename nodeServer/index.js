// Node Server that will handle the socket io connections.

const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

io.on('connection', socket =>{

    // In case any New User joins. notify other users connected to the server about it.
    socket.on('new-user-joined', name =>{
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people.
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // When any user leaves the chat, notify others.
    // This event is fired when connection is lost or user has left.
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
