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
        this._roomId = undefined;
    }
    reConnect(socket) {
        //如果是重新连接进来的 ，那么重新监听这些消息
        console.log('玩家又连接上了');
        this._socket = socket;
        this._online = true;
        this._isEnterBack = false;
        this.onMessage();
    }
    notify(messageType, messageIndex, data) {
        this._socket.emit('notify-back', {
            messageType: messageType,
            messageIndex: messageIndex,
            data: data
        });
    }
    onMessage() {

        this._socket.on('notify', (messageData) => {
            let messageType = messageData.messageType;
            let messageIndex = messageData.messageIndex;

            switch (messageType) {
                case 'share-to-friend':
                    //分享给好友的操作
                    console.log('玩家发来的 邀请好友的消息')
                    if (this._room) {
                        this._room.shareRoomToFriend(this, (data) => {
                            this.notify('share-to-friend', messageIndex, data);
                        });
                    }
                    break;
                case 're-match-game':
                    console.log('玩家发来的 ，重新匹配的按钮')
                    if (this._room) {
                        this._room.reMatchGame(this, (data) => {
                            this.notify(messageType, messageIndex, data);
                        });
                    }
                    break;
                default:
                    break;
            }
        });


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
            // if (this._room) {
            //     this._room.playerEnterBack(this, true);
            // }
            if (this._room) {
                this._room.syncPlayerInfo();
            }
        });
        this._socket.on('enter-forward', (data) => {
            console.log('进入了前台');
            this._isEnterBack = false;
            if (data && data.roomId) {
                console.log('data room id = ', data.roomId);
                //如果拿到了roomid  那么去重新匹配一下
                if (this._room) {
                    //玩家离开了房间
                    this._room.playerLeaveRoom(this);
                }
                this._controller.assignRoom(this, data);
                //退出当前的房间
                // this._room.
            } else {
                if (this._room) {
                    this._room.syncPlayerInfo();
                }
            }
        });

    }
    assignRoom(room) {
        this._room = room;
        this._roomId = this._room.id;
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
        this._room.syncPlayerInfo();
    }
    syncPlayerInfo(data) {
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

    playerLeaveRoom(player) {
        this._socket.emit('player-leave-room', {
            playerId: player.id
        });
    }
    isOnline() {
        return this._online;
    }
    outRoom() {
        // this._room = undefined;
        // delete this._room;
        this._roomId = undefined;
    }
    isInRoom() {
        if (this._room) {
            return true;
        }
        return false;
    }
    getRoomId() {
        return this._room.id;
    }
    getRoom() {
        return this._room;
    }
    sendMatchSuccess() {
        this._socket.emit('match-success');
    }
    isInBack() {
        return this._isEnterBack;
    }

}
module.exports = Player;