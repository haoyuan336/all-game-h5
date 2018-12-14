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


        this._isEnterBack = false;

       this.onMessage();
        this.avatarUrl = data.avatarUrl;
        this.nickName = data.nickName;

    }
    reConnect(socket){
        //如果是重新连接进来的 ，那么重新监听这些消息
        console.log('玩家又连接上了');
        this._socket = socket;
        this.onMessage();
    }
    onMessage(){
        this._socket.on('disconnect', () => {
            console.log('掉线');
            this._room.playerEnterBack(this, true);

            // if (this._isEnterBack) {
            //     this._room.playerEnterBack(this, true);
            // } else {
            //     this._room.removePlayer(this.id);
            //     this._controller.removePlayer(this.id);
            // }
            // this._room.removePlayer(this.id);
            // this._controller.removePlayer(this.id);
        });
        this._socket.on('choose-board', (index) => {
            if (this._room) {
                this._room.playerChooseBoard(this, index);
            }
        });
        this._socket.emit('login-success', this.id);

        this._socket.on('enter-back', () => {
            console.log('进入了后台');
            this._isEnterBack = true;
        });
        this._socket.on('enter-forward', () => {
            console.log('进入了前台');
            this._isEnterBack = false;
            if (this._room) {
                this._room.playerEnterBack(this, false);
            }
        });
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
            // this.addScore();
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
    getRankNum() {
        return this._rankNum;
    }
    addScore() {
        this._score++;
        this._rankNum = rank.rank(this);
        db.setPlayerScore(this.avatarUrl, this._score);
        this._room.playerReferInfo(this);
    }
    syncPlayerInfo(player) {
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
            // this._score++;
            this.addScore(); //自己加分的同时将分数下发
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
    syncRankData(data) {
        this._socket.emit('refer-rank', data);
    }
    destory() {
        console.log('销毁玩家');
    }
    playerOffLine(playerId) {
        this._socket.emit('player-offline', playerId);
    }
    playerEnterBack(player, state) {
        this._socket.emit('player-enter-back', {
            id: player.id,
            state: state
        })
    }
}
module.exports = Player;