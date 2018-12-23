const db = require('./db')
const rank = require('./rank');
const State = require('./state')
let PlayerState = {
    disconnect: 'disconnect',
    loginSuccess: 'login-success',
    enterBack: 'enter-back',
    // enterForward: 'enter-forward',
    isMatching: 'is-matching',
    gameing: 'gameing',
    outRoom: 'out-room'
}
class Player {
    constructor(socket, id, controller, data) {
        this.id = id;
        this._socket = socket;
        this._room = undefined;
        this._controller = controller;
        this._color = Math.random() * 10 > 5 ? 'black' : 'white';
        this._score = 0;
        this._rankNum = 9999;
        this.avatarUrl = data.avatarUrl;
        this.nickName = data.nickName;
        this._online = true;
        this._state = new State();

        this._state.addState(PlayerState.disconnect, () => {
            console.log('掉线');
            if (this._state.getState() === PlayerState.isMatching) {
                //如果正在匹配的玩家掉线了 ，那么需要把它从匹配里面里面删掉

            }

        });
        this._state.addState(PlayerState.loginSuccess, () => {
            let data = {
                score: this._score,
                id: this.id
            }
            console.log('玩家登陆成功了' + JSON.stringify(data));
            this._socket.emit('login-success', {
                id: this.id
            });
            this._state.setState(PlayerState.isMatching);

        });
        this._state.addState(PlayerState.enterBack, () => {
            if (this._room) {
                this._room.syncPlayerInfo();
            }
        });
        this._state.addState(PlayerState.gameing, () => {
            console.log('进入前台');
            if (this._room) {
                this._room.syncPlayerInfo();
            }
        });
        this._state.addState(PlayerState.isMatching, () => {
            console.log('player matching');
            this._controller.playerMatching(this);
        });
        db.getPlayerScore(this.avatarUrl, (err, data) => {
            if (err == null && data !== null) {
                this._score = data.value;
            } else {
                this._score = 0;
            }
            this._state.setState(PlayerState.loginSuccess);
        });
        this.onMessage();
    }
    reConnect(socket) {
        //如果是重新连接进来的 ，那么重新监听这些消息
        console.log('玩家又连接上了');
        this._socket = socket;
        this.onMessage();

        //玩家又连上的时候 ，根据当前的玩家状态 ，去做不同的操作
        switch (this._state.getState()) {
            case PlayerState.disconnect:
                //如果仅仅是断开链接
                if (!this._room) {
                    //如股没有房间 ，那么就去重新匹配
                    this._state.setState(PlayerState.isMatching);
                } else if (this._room && this._room.isGameing(this)) {
                    //玩家还在房间里面 
                    this._state.setState(PlayerState.gameing);
                }
                break;
            case PlayerState.outRoom:
                break;
            default:
                break;
        }
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
                            console.log('返回消息');
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
            this._controller.outMatchingList(this);
            this._state.setState('disconnect');
        });
        this._socket.on('choose-board', (index) => {
            if (this._room) {
                this._room.playerChooseBoard(this, index);
            }
        });

        this._socket.on('enter-back', () => {
            this._state.setState(PlayerState.enterBack);

        });
        this._socket.on('enter-forward', () => {
            //根据发来的数据状态 。进行判断
            console.log('收到了 进入前台的消息');
            if (this._room && this._room.getState() === 'gameing') {
                this._state.setState(PlayerState.gameing);
            } else {
                this._state.setState(PlayerState.isMatching);
            }

        });

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

    }
    syncPlayerInfo(data) {
        this._socket.emit('sync-player-info', data);
    }

    setPieceColor(value) {
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
    isOnline() {
        if (this._state.getState() !== PlayerState.disconnect) {
            return true;
        }
        return false;
    }
    isInBack() {
        console.log('state = ', this._state.getState());
        if (this._state.getState() === PlayerState.enterBack) {
            return true;
        }
        return false;
    }

    isInRoom() {

    }
    setRoom(room) {
        this._room = room;
    }
    enterForWord() {
        this._state.setState(PlayerState.gameing);

    }
    isMatching() {
        if (this._state.getState() === PlayerState.isMatching) {
            return true;
        }
        return false;
    }
    leaveCurrentRoom(){
        //玩家离开当前的房间
        console.log('玩家离开当前的房间');
    }
}
module.exports = Player;