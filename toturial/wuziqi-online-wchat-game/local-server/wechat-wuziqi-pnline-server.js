const server = require('socket.io')(3002);
const App = require('./app');
let app = new App();
server.on('connection', (socket)=>{
    console.log('a user connection');
    let isLogin = false;
    setTimeout(()=>{
        //如果一秒钟还没有收到 login 消息 ，那么需要让玩家在发送一次 login消息
        if (!isLogin){
            console.log('一秒钟之后 ，玩家还没有发来login 的消息')
            socket.emit('no-login-msg');
        }
    }, 500);
    socket.on('login', (data)=>{
        console.log('玩家 login' + JSON.stringify(data));
        isLogin = true;
        app.createPlayer(socket, data);
    });
    // socket.on('re-connect', (data)=>{
    //     console.log('重连进来的' + JSON.stringify(data));
    //     app.reConnect(socket,data);
    // });
});