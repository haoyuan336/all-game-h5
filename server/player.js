class Player {
    constructor(socket, id,controller){
        this.id = id;
        this._socket = socket;
        this._room = undefined;
        this._controller = controller;
        this._socket.emit('login-success', this.id);
    }
    assignRoom(room){
        this._room = room;
        room.assignPlayer(this);
    }
}
module.exports = Player;