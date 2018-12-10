var http = require('http');
var qs = require('querystring');
class Player {
    constructor(socket, id, controller, data) {
        this.id = id;
        this._socket = socket;
        this._room = undefined;
        this._controller = controller;
        this._color = Math.random() * 10 > 5 ? 'black' : 'white';
        this._socket.on('disconnect', () => {
            this._room.removePlayer(this.id);
            this._controller.removePlayer(this.id);
        });
        this._socket.on('choose-board', (index) => {
            if (this._room) {
                this._room.playerChooseBoard(this, index);
            }
        });
        this.avatarUrl = data.avatarUrl;
        this.nickName = data.nickName;

        // this._socket.on('login', (data) => {
        //     this.avatarUrl = data.avatarUrl;
        //     this.nickName = data.nickName;
        //     data.id = id;
        //     // this._socket.emit('login-success', data);
        // });
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
    syncCurrentColor(color) {
        this._socket.emit('sync-current-color', color);
    }
    syncBoardData(data) {
        this._socket.emit('sync-board-data', data);
    }
    sendGameWinMsg(color) {
        this._socket.emit('game-win', color);
    }
    playerJoinRoom(player){
        let data = {
            id: player.id,
            avatarUrl: player.avatarUrl,
            nickName: player.nickName,
            pieceColor: player.getColor(),
            score: 100
        }
        this._socket.emit('player-join-room', data);
    }
}
module.exports = Player;