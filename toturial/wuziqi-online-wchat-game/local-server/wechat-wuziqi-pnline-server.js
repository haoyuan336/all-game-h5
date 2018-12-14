const server = require('socket.io')(3002);
const App = require('./app');
let app = new App();
server.on('connection', (socket)=>{
    console.log('a user connection');
    socket.on('login', (data)=>{
        app.createPlayer(socket, data);
    });
    socket.on('re-connect', (id)=>{
        console.log('重连进来的' + id);
        app.reConnect(socket,id);
    });
});