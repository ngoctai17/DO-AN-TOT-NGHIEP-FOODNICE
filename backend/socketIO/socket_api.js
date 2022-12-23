const socket_io = require('socket.io');
const io = socket_io();
const socketAPI = {};
socketAPI.io = io;
// io.on('connection', (socket) => {
//     // console.log(`A client connected: [id = ${socket.id}]`);
//     // socket.emit('server_message', {msg: 'server hello world'});
//     socket.on('client_message', (msg) => {
//         console.log(`Client ${socket.id} message: `, msg);
//         // notify all
//         // io.sockets.emit('server_message', {msg: msg});
//         // notify specific 
//         // io.sockets.connected['5a2058s_80R36rqpAAAL'].emit('server_message', {msg: msg})
//     })
// })

socketAPI.sendNotify = (msg) => {
    io.sockets.emit('server_message', msg);
}

module.exports = socketAPI;