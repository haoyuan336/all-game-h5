const db = require('./db')
const rank = require('./rank');
class Player {
    constructor(socket, id, controller, data) {
        this.id = id;
        this._socket = socket;
        this._room = undefined;
        this._controller = controller;
        this._color = Math.random() * 10 > 5 ? 'black' : 'white';
        this._score = 0;
        this._rankNum = 9999;
        this._socket.on('disconnect', () => {
            this._room.removePlayer(this.id);
            this._controller.removePlayer(this.id);
        });
        this._socket.on('choose-board', (index) => {
            if (this._room) {
                this._room.playerChooseBoard(this, index);
            }
        });
        this._socket.emit('login-success', this.id);
        this.avatarUrl = data.avatarUrl;
        this.nickName = data.nickName;

    }
    assignRoom(room) {
        this._room = room;
        //从数据库里面取出来数据之后 ，才去
        db.getPlayerScore(this.avatarUrl, (err, data) => {
            if (err == null && data !== null) {
                this._score = data.value;
            } else {
                this._score = 0;
            }
            console.log('this. score = ', this._score);
            room.assignPlayer(this);
            this.addScore();
        });
    }
    referGameData(data) {
        data.room_id = this._room.id;
        data.room_player_count = this._room.getPlayerCount();
        this._socket.emit('refer-game-data', data);
    }
    getColor() {
        return this._color;
    }
    getScore() {
        return this._score;
    }
    getRankNum(){
        return this._rankNum;
    }
    addScore() {
        this._score++;
        this._rankNum = rank.rank(this);
        db.setPlayerScore(this.avatarUrl, this._score);
        this._room.playerReferInfo(this);
    }
    syncPlayerInfo(player){
        let data = {
            id: player.id,
            score: player.getScore(),
            rankNum: player.getRankNum()

        }
        this._socket.emit('sync-player-info', data);
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
        if (color == this._color) {
            this._score++;
        }
        this._socket.emit('game-win', color);
    }
    playerJoinRoom(playerList) {
        let dataList = [];
        for (let i = 0; i < playerList.length; i++) {
            let data = {
                id: playerList[i].id,
                avatarUrl: playerList[i].avatarUrl,
                nickName: playerList[i].nickName,
                pieceColor: playerList[i].getColor(),
                score: playerList[i].getScore(),
                rankNum: playerList[i].getRankNum()
            }
            dataList.push(data)
        }

        console.log('player join room ', dataList);
        this._socket.emit('player-join-room', dataList);
    }
    syncRankData(data){
        this._socket.emit('refer-rank', data);
    }
}
module.exports = Player;