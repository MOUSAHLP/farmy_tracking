const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.get("/", function (req, res) {
    res.send("Connect The Socket On Port:" + port);
});

io.on('connection', (socket) => {
    // console.log('A new user connected');

    const orderID = socket.handshake.query.order_id;
    const driverID = socket.handshake.query.driver_id;

    socket.on('track_' + orderID, (data) => {
        io.emit('track_' + orderID, data);

        data.order_id = parseInt(orderID);
        data.driver_id = parseInt(driverID);
        io.emit('track_all_drivers', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log('Server listening on port 3000');
});