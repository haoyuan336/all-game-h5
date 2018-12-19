const server = require('socket.io')(3002);
const App = require('./app');
let app = new App();
server.on('connection', (socket)=>{
    console.log('a user connection');

    

    socket.on('login', (data)=>{
        console.log('玩家 login' + JSON.stringify(data));
        app.createPlayer(socket, data);
    });
    socket.on('re-connect', (data)=>{
        console.log('重连进来的' + JSON.stringify(data));
        app.reConnect(socket,data);
    });
});