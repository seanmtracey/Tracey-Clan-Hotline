const debug = require('debug')("bin:lib:sockets");
const socketio = require('socket.io');

let io;

function startWebSocketServer(server){

    io = socketio(server);

    io.on('connection', (socket) => {

        socket.on('data', (data) => {
            debug(data);
        });

    });

}

module.exports = {
	start : startWebSocketServer
};