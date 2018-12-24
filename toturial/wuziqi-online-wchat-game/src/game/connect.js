import defines from './../defines'
import global from './../global'
class Connect {
    constructor(controller) {
        this._controller = controller;
        this._messageIndex = 1;
        this._messageBack = {};
        this._connection = SocketIO(defines.socketUrl);
        this._online = false;
        this._connection.on('request-login', () => {
            console.log(' 收到了 服务器请求登陆的消息');
            this.login();
        });
        this._connection.on('disconnect', () => {
            this._online = false;
        });
        this._connection.on('login-success', (data) => {
            console.log('login success');
            this._online = true;
            global.playerInfo.id = data.id;
            this._controller.loginSuccess();
        });
        this._connection.on('sync-player-info', (data) => {
            this._online = true;
            global.playerInfo.roomId = data.roomId;
            this._controller.syncPlayerInfo(data);
        });

        this._connection.on('sync-current-color', (data) => {
            this._controller.syncCurrentColor(data);
        });
        this._connection.on('sync-board-data', (data) => {
            this._controller.syncBoardData(data);
        });
        this._connection.on('refer-rank', (data) => {
            this._controller.syncReferRank(data);
        });
        this._connection.on('game-win', (data) => {
            this._controller.gameWin(data);
        });
        this._connection.on('notify-back', (messageData) => {
            let messageType = messageData.messageType;
            let messageIndex = messageData.messageIndex;
            let data = messageData.data;
            if (this._messageBack[messageIndex]) {
                this._messageBack[messageIndex](data);
            }
        });

        wx.onShow((res) => {
            let query = res.query;
            console.log(' on show query', query);
            let friendId = query.friendId ? query.friendId : undefined;
            if (this._online) {
                this._connection.emit('enter-forward', {
                    friendId: friendId
                });
            }
        })
        wx.onHide(() => {
            if (this._online) {
                console.log('on hide');
                this._connection.emit('enter-back');
            }
        })
    }
    login() {
        let param = {
            avatarUrl: global.playerInfo.avatarUrl,
            nickName: global.playerInfo.nickName
        }
        //根据参数不同 ，组合不同的参数
        // if (global.playerInfo.roomId) {
        //     param.roomId = global.playerInfo.roomId;
        // }
        if (global.playerInfo.id) {
            param.id = global.playerInfo.id;
        }

        let query = wx.getLaunchOptionsSync().query;
        console.log('login query  = ', query);
        if (query && query.friendId) {
            param.friendId = query.friendId;
        }
        console.log('登录的参数 是+', param);

        this._connection.emit('login', param);
    }
    notify(messageType, data, cb) {
        this._messageBack[this._messageIndex] = cb;
        this._connection.emit('notify', {
            messageType: messageType,
            messageIndex: this._messageIndex,
            data: data
        });
        this._messageIndex++;
    }

    shareToFriend() {
        //     //邀请好友
        // this._connect.emit('share-to-friend');

        this.notify('share-to-friend', {}, (data) => {
            console.log('分享服务器回调', data);
            if (data.status === 'ok') {
                console.log('服务器返回的消息 ，可以分享');
                this._controller.waitFriendEnterRoom();
            } else if (data.status == 'fail') {
                console.warn('share to friend' + data.data);
            }
            let shareData = {
                title: '跟我下一盘五子棋吧',
                imageUrl: defines.resourcesUrl + '/images/share_image.png',
                query: 'friendId=' + global.playerInfo.id
            }
            console.log('share messgae = ', shareData);
            wx.shareAppMessage(shareData)
        })
    }
    cancelShareRoom(cb) {
        let p = new Promise((reo, rej) => {
            console.log();
            this.notify('cancel-share-room', {}, (data) => {
                console.log('取消分享操作');
                reo();

            });
        });
        p.then(() => {
            if (cb) {
                cb();
            }
        });
    }
    reMatchRoom() {
        this.notify('re-match-game', {}, () => {
            console.log('重新匹配请求成功');
        })
    }
    chooseBoard(data){
        this._connection.emit('choose-board', data);
    }
}
export default Connect;