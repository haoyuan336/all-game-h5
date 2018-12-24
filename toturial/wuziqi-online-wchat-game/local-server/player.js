const db = require('./db')
const rank = require('./rank');
const State = require('./state')
let PlayerState = {
    disconnect: 'disconnect',
    loginSuccess: 'login-success',
    // enterForward: 'enter-forward',
    shareing: 'shareing',
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
        this._oldState = this._state.getState();
        this._isInBack = false;
        this._isOffline = false;
        this._disconnectTime = undefined;
        this._state.addState(PlayerState.disconnect, () => {
            console.log('掉线');
            this._disconnectTime = new Date().getTime();
            this._isOffline = true;
            if (this._room) {
                this._room.playerOffline(this);
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
            console.log('玩家开始匹配');
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
    getDisconnectTime(){
        //获取 掉线的时间 点
        return this._disconnectTime;   
    }
    reConnect(socket) {
        this._isOffline = false;
        this._isInBack = false;
        //如果是重新连接进来的 ，那么重新监听这些消息
        console.log('玩家又连接上了');
        this._socket = socket;

        this.onMessage();
        // this._state.setState(PlayerState.loginSuccess);

        //玩家又连上的时候 ，根据当前的玩家状态 ，去做不同的操作
        console.log('玩家又连接上之后 ，当前的状态时' + this._state.getState());
        //根据房间的状态
        if (this._room) {
            if (this._room.isInRoom(this)) {
                if (this._room.getPlayerCount() === 1) {
                    console.log('房间里面 每人');
                    this._state.setState(PlayerState.isMatching);
                }else{
                    // if (this._room.isGameing(this)) {
                    //     console.log('房间里面 有人');
                    //     this._room.playerReOnline(this);
                    // }else{
                    // }
                    this._room.playerReOnline(this);
                } 
            }
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
                    this._controller.outMatchingList(this);
                    if (this._room) {
                        this._room.shareRoomToFriend(this, () => {
                            console.log('返回消息');
                            this.notify('share-to-friend', messageIndex, {
                                status: 'ok'
                            });
                        });
                    }
                    this._state.setState(PlayerState.shareing);

                    break;
                case 're-match-game':
                    console.log('玩家发来的 ，重新匹配的按钮')
                    if (this._room) {
                        this._room.reMatchGame(this);
                        this.notify(messageType, messageIndex, {
                            status: 'ok'
                        });
                    }
                    this._state.setState(PlayerState.isMatching);
                    break;
                case 'cancel-share-room':
                    console.log('玩家发来了 取消邀请 的 消息');
                    //玩家取消邀请了 那么就得重新匹配了
                    this._state.setState(PlayerState.isMatching);
                    this._room.cancelShare();
                    break;
                default:
                    break;
            }
        });


        this._socket.on('disconnect', () => {
            console.log('掉线');
            this._controller.outMatchingList(this);
            this._state.setState(PlayerState.disconnect);
        });
        this._socket.on('choose-board', (index) => {
            if (this._room) {
                this._room.playerChooseBoard(this, index);
            }
        });

        this._socket.on('enter-back', () => {
            console.log('进入后台');
            this._isInBack = true;
            this._oldState = this._state.getState();
            //保存一下当前的状态
            this._state.setState(PlayerState.enterBack);

        });
        this._socket.on('enter-forward', (data) => {
            //根据发来的数据状态 。进行判断
            console.log('收到了 进入前台的消息', JSON.stringify(data));
            this._isInBack = false;
            if (data && data.friendId) {
                // if(this._controller.canEnterFriendRoom(data.friendId)){
                //     console.log('可以进入朋友分享的房间');
                // }
                let friend = this._controller.getPlayer(data.friendId);
                if (friend && friend.isShareing()) {
                    console.log('这个玩家确实在分享游戏 ');
                    // this._room.
                    if (this._room) {
                        // this._room.p
                        this._room.playerLeaveRoom(this);
                    }
                    friend.getRoom().joinPlayer(this);
                    // friend.getRoom().joinPlayer(this);
                } else {
                    console.log('不存在的玩家');
                    this._state.setState(this._oldState);
                }
            } else {
                this._state.setState(this._oldState);
            }
        });

    }

    enterFriendRoom() {

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
        // if (this._room){
        //     //同步玩家信息
        //     this._room.syncPlayerInfo();
        // }
    }

    syncRankData(data) {
        this._socket.emit('refer-rank', data);
    }
    isOnline() {
        return !this._isOffline;
    }
    isInBack() {
        console.log('state = ', this._state.getState());
        // if (this._state.getState() === PlayerState.enterBack) {
        //     return true;
        // }
        // return false;
        return this._isInBack || this._isOffline;
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
    leaveCurrentRoom() {
        //玩家离开当前的房间
        console.log('玩家离开当前的房间');
    }
    isShareing() {
        //是否正在分享中
        if (this._state.getState() === PlayerState.shareing) {
            //如果当前的状态时分享中 ，或者老的状态也是分享中，那么说明这个玩家确实在分享游戏
            return true;
        }
        return false;
    }
    setGameing() {
        this._state.setState(PlayerState.gameing);
    }
    waitOfflinePlayer() {
        //进入等待掉线玩家的状态
    }
    getRoom() {
        return this._room;
    }
}
module.exports = Player;