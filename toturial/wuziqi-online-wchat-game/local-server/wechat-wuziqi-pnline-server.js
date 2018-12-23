const server = require('socket.io')(3002);
const App = require('./app');
let app = new App();
server.on('connection', (socket)=>{
    console.log('a user connection');
    socket.on('login', (data)=>{
        console.log('玩家 login' + JSON.stringify(data));
        app.playerLogin(socket, data);
    });

    //玩家链接成功了之后，给玩家返回一条请求登陆的消息，然后玩家把登陆信息发过来
    socket.emit('request-login');
});