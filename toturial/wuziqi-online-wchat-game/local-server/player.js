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

        this._online = true;
    }
    reConnect(socket) {
        //如果是重新连接进来的 ，那么重新监听这些消息
        console.log('玩家又连接上了');
        this._socket = socket;
        this._online = true;

        this.onMessage();
    }
    onMessage() {
        this._socket.on('disconnect', () => {
            console.log('掉线');
            this._online = false;
            if (this._room) {
                this._room.playerOffLine(this);
            }
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
            if (this._room) {
                this._room.playerEnterBack(this, true);
            }
        });
        this._socket.on('enter-forward', () => {
            console.log('进入了前台');
            this._isEnterBack = false;
            if (this._room) {
                this._room.playerEnterBack(this, false);
            }
        });
        this._socket.on('re-start-game', () => {
            console.log('重新开始游戏');
            this._room.reStartGame(this);
        });
        this._socket.on('share-to-friend', ()=>{
            console.log('邀请好友');
            
        })
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
        // data.room_id = this._room.id;
        // data.room_player_count = this._room.getPlayerCount();
        // this._socket.emit('refer-game-data', data);
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
        this._room.playerReferInfo();
    }
    syncPlayerInfo(data) {
        // let data = {
        //     id: player.id,
        //     score: player.getScore(),
        //     rankNum: player.getRankNum()

        // }
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
    // playerJoinRoom(playerList) {
    //     let dataList = [];
    //     for (let i = 0; i < playerList.length; i++) {
    //         let data = {
    //             id: playerList[i].id,
    //             avatarUrl: playerList[i].avatarUrl,
    //             nickName: playerList[i].nickName,
    //             pieceColor: playerList[i].getColor(),
    //             score: playerList[i].getScore(),
    //             rankNum: playerList[i].getRankNum()
    //         }
    //         dataList.push(data)
    //     }

    //     console.log('player join room ', dataList);
    //     this._socket.emit('player-join-room', dataList);
    // }
    syncRankData(data) {
        this._socket.emit('refer-rank', data);
    }
    destory() {
        console.log('销毁玩家');
        this._controller.removePlayer(this);
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
    isOnline() {
        return this._online;
    }
    outRoom() {
        this._room = undefined;
    }
    isInRoom() {
        if (this._room) {
            return true;
        }
        return false;
    }
    sendMatchingMsg(){
        //给玩家发送匹配中的消息
        this._socket.emit('matching');
    }
}
module.exports = Player;