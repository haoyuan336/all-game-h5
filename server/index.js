const IO = require('socket.io')(3001);
const App = require('./app');
let app = new App();
IO.on('connection', (socket)=>{
    console.log('a user connection');
    app.createPlayer(socket);
});
console.log('启动成功');