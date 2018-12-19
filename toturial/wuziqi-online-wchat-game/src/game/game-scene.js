import { Scene, director, Button } from './../util/import'
import GameLayer from './game-layer'
import UILayer from './ui-layer'
import resources from './../resources'
import global from './../global'
import defines from './../defines'
import RankLayer from './rank-layer'
import WaitLayer from './wait-layer'
class GameScene extends Scene {
    constructor() {
        super();
        this._roomId = undefined;
        this._callBackMap = {};
        this._messageIndex = 1;
    }
    setAuthorize(cb) {
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                    console.log('没有用户信息授权')
                    this.showLoginButton(cb);

                } else {
                    this.login(cb);
                }
            }
        });
        //监听被动分享消息
        wx.onShareAppMessage(() => {
            return {
                title: '跟我下一盘五子棋吧',
                imageUrl: defines.resourcesUrl + '/images/share_image.png',
                query: 'roomId=' + this._roomId
            }
        });
        //显示分享按钮
        wx.showShareMenu();

    }
    showLoginButton(cb) {
        let button = wx.createUserInfoButton({
            type: 'image',
            image: defines.resourcesUrl + '/images/login_button.png',
            // image: './static/textures/login_button.png',
            style: {
                left: director.windowWidth * 0.5 - 136 * 0.5,
                top: director.windowHeight * 0.5 - 74 * 0.5,
                width: 136,
                height: 74
            }
        });
        button.onTap((res) => {
            console.log('tap res  =', res);
            if (res.errMsg === 'getUserInfo:ok') {
                button.hide();
                if (cb) {
                    cb(res.userInfo);
                }
            } else {

            }
        });
    }
    login(cb) {
        wx.getUserInfo({
            success: (res) => {
                console.log('res userinfo = ', res.userInfo);
                console.log('res  = ', res);
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                if (cb) {
                    cb({
                        nickName: nickName,
                        avatarUrl: avatarUrl
                    })
                }
            }
        })
    }
    onLoad() {
        console.log('初始化游戏');
        this._gameLayer = new GameLayer(this);
        this.addLayer(this._gameLayer);
        this._rankLayer = new RankLayer(this);
        this.addLayer(this._rankLayer);
        this._uiLayer = new UILayer(this);
        this.addLayer(this._uiLayer);
        let _isOffline = false;

        let waitLayer = new WaitLayer(this);
        this.addLayer(waitLayer);
        this._waitLayer = waitLayer;

        let connect = SocketIO(defines.socketUrl);
        const onHide = function () {
            console.log('隐藏游戏');
            connect.emit('enter-back');
        }
        const onShow = function (res) {
            console.log('on show');
            let query = res.query;
            console.log('query', query);
            let roomId = query.roomId ? query.roomId : undefined;
            if (roomId !== undefined) {
                this._roomId = roomId;
            }

            connect.emit('enter-forward', {
                roomId: this._roomId
            });

            //显示
            // if (_isOffline) {
            //     console.log('重新连接 ' + global.avatarUrl);
            //     console.log('nick Name = ' + global.nickName);
            //     connect.emit('re-connect', {
            //         id: global.id,
            //         avatarUrl: global.avatarUrl,
            //         nickName: global.nickName,
            //         roomId: this._roomId
            //     });
            // } else {
            //     console.log('进入前台');
            //     connect.emit('enter-forward');
            // }
        }
        wx.onHide(onHide);
        wx.onShow(onShow);

        this._connect = connect;
        connect.on('disconnect', () => {
            console.log('掉线');
            _isOffline = true;
        });
        connect.on('login-success', (data) => {
            console.log('登录成功');
            global.id = data;
            _isOffline = false;
        });
        connect.on('player-enter-back', (data) => {
            console.log('player enter back', data);
            if (this._gameLayer) {
                this._gameLayer.playerEnterBack(data);
            }
        });
        connect.on('sync-current-color', (color) => {
            this._gameLayer.changeCurrentColor(color);
        });
        connect.on('sync-board-data', (data) => {
            console.log('同步棋盘信息');
            this._gameLayer.referBoard(data);
        });
        connect.on('game-win', (color) => {
            this._uiLayer.showWin(color);
        });
        connect.on('refer-rank', (data) => {
            //刷新排行榜数据
            this._rankLayer.referRankData(data);
        });
        connect.on('sync-player-info', (data) => {
            //刷新玩家信息
            console.log('sync player info = ', data);
            this._roomId = data.roomId;
            this._gameLayer.syncPlayerInfo(data.playerInfo);
        });
        connect.on('player-offline', (playerId) => {
            // this._gameLayer.playerOffLine(playerId);

            //有玩家掉线了
            if (this._waitLayer == undefined) {
                let waitLayer = new WaitLayer(this);
                this.addLayer(waitLayer);
                this._waitLayer = waitLayer;
            }
        });
        connect.on('player-online', (playerId) => {
            //玩家又连接上了游戏
            if (this._waitLayer) {
                this.removeChild(this._waitLayer);
                this._waitLayer = undefined;
            }
        });
        connect.on('match-success', () => {
            //匹配成功
            console.log('匹配成功');
            if (this._waitLayer) {
                this.removeChild(this._waitLayer);
                this._waitLayer = undefined;
            }
        });
        connect.on('player-leave-room', ()=>{
            //有玩家离开了房间
             //有玩家掉线了
             if (this._waitLayer == undefined) {
                let waitLayer = new WaitLayer(this);
                this.addLayer(waitLayer);
                this._waitLayer = waitLayer;
            }
        });
        connect.on('notify-back', (data) => {
            let messageType = data.messageType;
            let messageIndex = data.messageIndex;
            if (this._callBackMap[messageIndex]) {
                this._callBackMap[messageIndex](data.data);
                delete this._callBackMap[messageIndex];
            }
            switch (messageType) {
                case 'share-to-friend':
                    console.log('收到了，分享消息的回调');
                    break;
                default:
                    break;
            }

        });
        this._connect = connect;
        this.setAuthorize((data) => {
            console.log('获取头像信息', data);
            let query = wx.getLaunchOptionsSync().query;
            console.log('data', query);
            if (query && query.roomId) {
                data.roomId = query.roomId;
            }

            console.log('登录' + JSON.stringify(data));

            this._connect.emit('login', data);
        });
        // this._uiLayer.showWin('black');
    }
    notify(messageType, data, cb) {
        this._connect.emit('notify', {
            messageType: messageType,
            messageIndex: this._messageIndex,
            data: data
        })
        this._callBackMap[this._messageIndex] = cb;
        this._messageIndex++;
    }
    playerPushPiece(index) {
        this._connect.emit('choose-board', index);
    }
    closeGameOverLayer() {
        //关闭了游戏结束层
        if (this._gameLayer) {
            this._gameLayer.removeAllPiece();
        }
    }
    reStartGame() {
        //充新开始游戏
        // this._connect.emit('re-start-game');
        this.notify('re-match-game', {}, (data) => {
            console.log('re metch game = ', data);
            if (data.status === 'ok') {
                console.log('可以重新开始游戏了');
                if (this._waitLayer) {
                    this._waitLayer.reMatchGame();
                }
            }
            if (data.status === 'fail') {
                console.warn('re match game = ', data.data);
            }
        });
    }
    shareToFriend() {
        //邀请好友
        // this._connect.emit('share-to-friend');

        this.notify('share-to-friend', {}, (data) => {
            if (data.status === 'ok') {
                console.log('服务器返回的消息 ，可以分享');
                if (this._waitLayer) {
                    this._waitLayer.shareToFriend();
                }
            } else if (data.status == 'fail') {
                console.warn('share to friend' + data.data);
            }
            wx.shareAppMessage({
                title: '跟我下一盘五子棋吧',
                imageUrl: defines.resourcesUrl + '/images/share_image.png',
                query: 'roomId=' + this._roomId
            })
        })
    }
}
export default GameScene;