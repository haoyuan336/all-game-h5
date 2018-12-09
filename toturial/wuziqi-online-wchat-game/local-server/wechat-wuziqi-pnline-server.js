const server = require('socket.io')(3002);
const App = require('./app');
let app = new App();
server.on('connection', (socket)=>{
    app.createPlayer(socket);
});