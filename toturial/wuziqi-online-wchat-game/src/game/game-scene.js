import { Scene, director, Button, Sprite, State } from './../util/import'
import GameLayer from './game-layer'
import UILayer from './ui-layer'
import resources from './../resources'
import global from './../global'
import defines from './../defines'
import RankLayer from './rank-layer'
import WaitLayer from './wait-layer'
import Connect from './connect'
const GameState = {
    Matching: 'matching',
    Shareing: 'shareing',
    Gameing: 'gameing',
    WaitOffline: 'wait-offline',
    PlayerLeave: 'player-leave'
}
class GameScene extends Scene {
    constructor() {
        super();
        this._roomId = undefined;
        this._callBackMap = {};
        this._messageIndex = 1;
        this._state = new State();

        this._state.addState(GameState.Matching, () => {
            console.log('切换到匹配中的状态');
            this.showMatchingState()
        });
        this._state.addState(GameState.Shareing, () => {
            console.log('分享的状态');
            this.showWaitFriendState();
        });
        this._state.addState(GameState.WaitOffline, () => {
            this.showWaitOfflineState();
        });
        this._state.addState(GameState.PlayerLeave, () => {
            this.showWaitOfflineState();
        });
    }
    setAuthorize(cb) {
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                    console.log('没有用户信息授权')
                    this.showLoginButton(cb);

                } else {
                    // this.login(cb);
                    if (cb) {
                        cb();
                    }
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
            }
        });
    }
    // getUserInfo(cb) {
    //     wx.getUserInfo({
    //         success: (res) => {
    //             console.log('res userinfo = ', res.userInfo);
    //             console.log('res  = ', res);
    //             var userInfo = res.userInfo
    //             var nickName = userInfo.nickName
    //             var avatarUrl = userInfo.avatarUrl
    //             if (cb) {
    //                 cb({
    //                     nickName: nickName,
    //                     avatarUrl: avatarUrl
    //                 })
    //             }
    //         }
    //     })
    // }
    onLoad() {
        console.log('初始化游戏');
        this._gameLayer = new GameLayer(this);
        this.addLayer(this._gameLayer);
        this._rankLayer = new RankLayer(this);
        this.addLayer(this._rankLayer);
        this._uiLayer = new UILayer(this);
        this.addLayer(this._uiLayer);

        this._titleLabel = new Sprite(global.resource[resources.matching_title].texture);
        this.addChild(this._titleLabel);
        this._titleLabel.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5 - 150
        }
        this._titleLabel.scale.set(2);
        this._titleLabel.visible = false;

        this.setAuthorize(() => {
            console.log('授权成功');
            wx.getUserInfo({
                withCredentials: false,
                success: res => {
                    console.log('data ' + JSON.stringify(res))

                    global.playerInfo.avatarUrl = res.userInfo.avatarUrl;
                    global.playerInfo.nickName = res.userInfo.nickName;
                    this._connect = new Connect(this);
                },
                fail: () => { },
                complete: () => { }
            });
            //授权成功之后 ，开始链接服务器
            //首选成功之后，保存当前的 头像信息等
        });


        // let connect = SocketIO(defines.socketUrl);
        // const onHide = function () {
        //     console.log('隐藏游戏');
        //     connect.emit('enter-back');
        // }
        // const onShow = function (res) {
        //     console.log('on show');
        //     let query = res.query;
        //     console.log('query', query);
        //     let roomId = query.roomId ? query.roomId : undefined;
        //     if (roomId !== undefined) {
        //         this._roomId = roomId;
        //     }
        //     connect.emit('enter-forward', {
        //         roomId: this._roomId
        //     });
        // }
        // wx.onHide(onHide);
        // wx.onShow(onShow);

        // this._connect = connect;
        // connect.on('disconnect', () => {
        //     console.log('掉线');
        // });
        // connect.on('request-login', () => {
        //     //那么这时候 ，玩家需要重新发送 login的消息
        //     this.connectServer();
        // })
        // connect.on('login-success', (data) => {
        //     console.log('登录成功');
        //     global.id = data;
        // });
        // connect.on('sync-current-color', (color) => {
        //     this._gameLayer.changeCurrentColor(color);
        // });
        // connect.on('sync-board-data', (data) => {
        //     console.log('同步棋盘信息');
        //     this._gameLayer.referBoard(data);
        // });
        // connect.on('game-win', (color) => {
        //     this._uiLayer.showWin(color);
        // });
        // connect.on('refer-rank', (data) => {
        //     //刷新排行榜数据
        //     this._rankLayer.referRankData(data);
        // });
        // connect.on('sync-player-info', (data) => {
        //     //刷新玩家信息
        //     console.log('sync player info = ', data);
        //     this._roomId = data.roomId;
        //     //同步玩家信息的时候，如果是两个玩家在房间里面
        //     let allOnline = true;
        //     if (data.playerInfo.length !== 2) {
        //         allOnline = false;
        //         //如果房间里面的 玩家人数 不等于2  那么 不能继续游戏哦
        //     }
        //     for (let i = 0; i < data.playerInfo.length; i++) {
        //         if (allOnline) {
        //             //只要有一个玩家 不在线 或者是 没有在前台的状态 ,那么就不能开始游戏
        //             allOnline = data.playerInfo[i].online;
        //         }
        //     }
        //     if (allOnline && this._waitLayer) {
        //         this.removeChild(this._waitLayer);
        //         this._waitLayer = undefined;
        //     }
        //     if (data.playerInfo.length === 1) {
        //         _shareButton.visible = true;
        //     } else {
        //         _shareButton.visible = false;
        //     }
        //     this._gameLayer.syncPlayerInfo(data.playerInfo);
        // });
        // connect.on('player-offline', (playerId) => {
        //     // this._gameLayer.playerOffLine(playerId);

        //     //有玩家掉线了
        //     if (this._waitLayer == undefined) {
        //         let waitLayer = new WaitLayer(this);
        //         this.addLayer(waitLayer);
        //         this._waitLayer = waitLayer;
        //     }
        // });
        // connect.on('player-online', (playerId) => {
        //     //玩家又连接上了游戏
        //     if (this._waitLayer) {
        //         this.removeChild(this._waitLayer);
        //         this._waitLayer = undefined;
        //     }
        // });
        // connect.on('match-success', () => {
        //     //匹配成功
        //     console.log('匹配成功');
        //     if (this._waitLayer) {
        //         this.removeChild(this._waitLayer);
        //         this._waitLayer = undefined;
        //     }
        // });
        // connect.on('player-leave-room', () => {
        //     //有玩家离开了房间
        //     //有玩家掉线了
        //     if (this._waitLayer == undefined) {
        //         let waitLayer = new WaitLayer(this);
        //         this.addLayer(waitLayer);
        //         this._waitLayer = waitLayer;
        //     }
        // });
        // connect.on('notify-back', (data) => {
        //     let messageType = data.messageType;
        //     let messageIndex = data.messageIndex;
        //     if (this._callBackMap[messageIndex]) {
        //         this._callBackMap[messageIndex](data.data);
        //         delete this._callBackMap[messageIndex];
        //     }
        //     switch (messageType) {
        //         case 'share-to-friend':
        //             console.log('收到了，分享消息的回调');
        //             break;
        //         default:
        //             break;
        //     }
        // });
        // this._connect = connect;
        // this._uiLayer.showWin('black');
    }
    loginSuccess() {
        if (!this._shareButton) {
            this._shareButton = new Button({
                normalTexture: global.resource[resources.shard_friend_button].texture,
                touchCb: () => {
                    console.log('邀请按钮');

                    switch (this._state.getState()) {
                        case GameState.Matching:
                        case GameState.WaitOffline:
                            //等在的状态 或者是 匹配的状态
                            this._connect.shareToFriend();
                            break;
                        case GameState.Shareing:
                            //  取消分享
                            this._connect.cancelShareRoom();
                            break;
                    }

                }
            })
            this._shareButton.position = {
                x: director.designSize.width * 0.5,
                y: director.designSize.height * 0.5
            }
            this._shareButton.scale.set(2);
            this.addChild(this._shareButton);

            this._titleLabel.texture = global.resource[resources.matching_title].texture;
            this._titleLabel.scale.set(2);
            this._titleLabel.visible = true;

        }
        if (!this._matchButton) {
            this._matchButton = new Button({
                normalTexture: global.resource[resources.re_start_button].texture,
                touchCb: () => {
                    console.log('从新匹配');
                    this._connect.reMatchRoom();
                }
            });
            this._matchButton.position = {
                x: director.designSize.width * 0.5,
                y: director.designSize.height * 0.5 + 150
            }
            this._matchButton.scale.set(2);
            this.addChild(this._matchButton);
            this._matchButton.visible = false;
        }
    }
    syncPlayerInfo(data) {
        console.log('sync player info = ', data);
        let playerInfo = data.playerInfo;
        this._gameLayer.syncPlayerInfo(playerInfo);
        let state = data.roomState;
        switch (state) {
            case 'gameing':
                console.log('游戏中');
                if (this._titleLabel) {
                    this._titleLabel.visible = false;

                }
                if (this._shareButton) {
                    this._shareButton.visible = false;
                }
            case 'matching':
                console.log('展示匹配中的字样');
                this._state.setState(GameState.Matching);
                // this.showMatchingState();
                break;
            case 'wait-offline-player':
                console.log('等待掉线玩家');
                this._state.setState(GameState.WaitOffline);
                break;
            case 'player-leave':
                console.log('玩家离开了 房间');
                this._state.setState(GameState.PlayerLeave);
                break;
            default:
                break;
        }

    }
    // connectServer() {
    //     this.setAuthorize((data) => {
    //         console.log('获取头像信息', data);
    //         let query = wx.getLaunchOptionsSync().query;
    //         console.log('data', query);
    //         if (query && query.roomId) {
    //             data.roomId = query.roomId;
    //         }
    //         if (global.id) {
    //             data.id = global.id;
    //         }
    //         console.log('登录' + JSON.stringify(data));
    //         this._connect.emit('login', data);
    //     });
    // }
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
        // this._connect.emit('choose-board', index);
        this._connect.chooseBoard(index);
    }
    closeGameOverLayer() {
        //关闭了游戏结束层
        if (this._gameLayer) {
            this._gameLayer.removeAllPiece();
        }
    }
    // reStartGame() {
    //     //充新开始游戏
    //     // this._connect.emit('re-start-game');
    //     this.notify('re-match-game', {}, (data) => {
    //         console.log('re metch game = ', data);
    //         if (data.status === 'ok') {
    //             console.log('可以重新开始游戏了');
    //             if (this._waitLayer) {
    //                 this._waitLayer.reMatchGame();
    //             }
    //         }
    //         if (data.status === 'fail') {
    //             console.warn('re match game = ', data.data);
    //         }
    //     });
    // }
    // shareToFriend() {
    //     //邀请好友
    //     // this._connect.emit('share-to-friend');

    //     this.notify('share-to-friend', {}, (data) => {
    //         if (data.status === 'ok') {
    //             console.log('服务器返回的消息 ，可以分享');
    //             if (this._waitLayer) {
    //                 this._waitLayer.shareToFriend();
    //             }
    //         } else if (data.status == 'fail') {
    //             console.warn('share to friend' + data.data);
    //         }
    //         wx.shareAppMessage({
    //             title: '跟我下一盘五子棋吧',
    //             imageUrl: defines.resourcesUrl + '/images/share_image.png',
    //             query: 'roomId=' + this._roomId
    //         })
    //     })
    // }
    noPSharedButton() {
        //没有参数的分享按钮
        wx.shareAppMessage({
            title: '跟我下一盘五子棋吧',
            imageUrl: defines.resourcesUrl + '/images/share_image.png'
        })
    }
    waitFriendEnterRoom() {
        this._state.setState(GameState.Shareing);

        // let p = new Promise((reo, rej) => {
        //     this._shareButton.setCallBack(() => {
        //         console.log('取消邀请');
        //         if (reo) {
        //             reo();
        //         }
        //     })
        // }).then(() => {
        //     this._connect.cancelShareRoom();

        // });
    }

    showWaitFriendState() {
        console.log('等待好友进入房间');
        this._titleLabel.texture = global.resource[resources.wait_friend_tips].texture;
        this._titleLabel.scale.set(2);
        this._matchButton.visible = false;
        this._shareButton.setNormalTexture(global.resource[resources.cancel_share_button].texture);
    }
    showMatchingState() {
        console.log('展示匹配中的ui')
        this._shareButton.setNormalTexture(global.resource[resources.shard_friend_button].texture);
        this._titleLabel.texture = global.resource[resources.matching_title].texture;
        this._titleLabel.scale.set(2);
        this._matchButton.visible = false;
    }
    showWaitOfflineState() {
        console.log('展示等待掉线玩家的ui');
        this._titleLabel.texture = global.resource[resources.wait_tips].texture;
        this._titleLabel.scale.set(2);
        this._titleLabel.visible = true;
        this._shareButton.visible = true;
        this._matchButton.visible = true;


    }
    syncCurrentColor(data) {
        this._gameLayer.changeCurrentColor(data);
    }
    syncBoardData(data) {
        this._gameLayer.referBoard(data);
    }
    syncReferRank(data) {
        this._rankLayer.referRankData(data);
    }
    gameWin(color) {
        this._uiLayer.showWin(color);
    }

    // connect.on('sync-board-data', (data) => {
    //     console.log('同步棋盘信息');
    //     this._gameLayer.referBoard(data);
    // });
    // connect.on('game-win', (color) => {
    //     this._uiLayer.showWin(color);
    // });
    // connect.on('refer-rank', (data) => {
    //     //刷新排行榜数据
    //     this._rankLayer.referRankData(data);
    // });
}
export default GameScene;