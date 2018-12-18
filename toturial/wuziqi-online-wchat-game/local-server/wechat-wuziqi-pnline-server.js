var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let ServerApp = require('./app');
let serverApp = new ServerApp();
io.on('connection', (socket) => {
    socket.on('login', (data) => {
        serverApp.createPlayer(socket, data);
    });
    socket.on('re-connect', (id) => {
        console.log('重连进来的' + id);
        serverApp.reConnect(socket, id);
    });
})

app.get('/', function (req, res) {

    res.send('<h1>Welcome Realtime Server</h1>');

});

http.listen(3002, function () {

    console.log('listening on *:3000');

});
// const server = require('socket.io')(3002);
// const App = require('./app');
// let app = new App();
// server.on('connection', (socket)=>{
//     console.log('a user connection');
//     socket.on('login', (data)=>{
//         app.createPlayer(socket, data);
//     });
//     socket.on('re-connect', (id)=>{
//         console.log('重连进来的' + id);
//         app.reConnect(socket,id);
//     });
// });