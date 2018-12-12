const db = require('./db')
class Player {
    constructor(socket, id, controller, data) {
        this.id = id;
        this._socket = socket;
        this._room = undefined;
        this._controller = controller;
        this._color = Math.random() * 10 > 5 ? 'black' : 'white';
        this._score = 0;
        this._socket.on('disconnect', () => {
            this._room.removePlayer(this.id);
            this._controller.removePlayer(this.id);
        });
        this._socket.on('choose-board', (index) => {
            if (this._room) {
                this._room.playerChooseBoard(this, index);
            }
        });

        this._socket.emit('login-success',this.id);
        this.avatarUrl = data.avatarUrl;
        this.nickName = data.nickName;

        db.getPlayerScore(this.avatarUrl, (data)=>{
            if (data == null){
                this.score = 0;
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
    syncCurrentColor(color) {
        this._socket.emit('sync-current-color', color);
    }
    syncBoardData(data) {
        this._socket.emit('sync-board-data', data);
    }
    sendGameWinMsg(color) {
        if (color == this._color){
            this._score ++;
        }
        this._socket.emit('game-win', color);
    }
    playerJoinRoom(playerList){
        let dataList = [];
        for (let i = 0 ; i < playerList.length ; i ++){
            let data = {
                id: playerList[i].id,
                avatarUrl: playerList[i].avatarUrl,
                nickName: playerList[i].nickName,
                pieceColor: playerList[i].getColor(),
                score: 100
            }
            dataList.push(data)
        }
        
        console.log('player join room ', dataList);
        this._socket.emit('player-join-room', dataList);
    }
}
module.exports = Player;