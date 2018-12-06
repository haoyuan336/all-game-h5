class Player {
    constructor(socket, id, controller) {
        this.id = id;
        this._socket = socket;
        this._room = undefined;
        this._controller = controller;
        this._socket.emit('login-success', this.id);
        this._color = Math.random() * 10 > 5 ? 'black' : 'white';
        this._socket.on('disconnect', () => {
            this._room.removePlayer(this.id);
            this._controller.removePlayer(this.id);
        });
        this._socket.on('make-a-move', (data) => {
            if (this._room) {
                this._room.playerMakeAMove(this, data);
            }
        })
        this._socket.on('choose-board', (index)=>{
            if (this._room){
                this._room.playerChooseBoard(this, index);
            }
        });
    }
    assignRoom(room) {
        this._room = room;
        room.assignPlayer(this);
    }
    referGameData(data) {
        data.room_id = this._room.id;
        data.room_player_count = this._room.getPlayerCount();
        this._socket.emit('refer-game-data', data);
    }
    getColor() {
        return this._color;
    }
    setPieceColor(value) {
        // this._socket.emit('set-color', value);
        this._color = value;
    }
    syncCurrentColor(color){
        this._socket.emit('sync-current-color', color);
    }
    syncBoardData(data){
        this._socket.emit('sync-board-data', data);
    }
    sendGameWinMsg(color){
        this._socket.emit('game-win', color);
    }
}
module.exports = Player;