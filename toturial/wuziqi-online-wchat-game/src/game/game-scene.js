import { Scene, director, Button } from './../util/import'
import GameLayer from './game-layer'
import UILayer from './ui-layer'
import resources from './../resources'
import global from './../global'
import defines from './../defines'
import RankLayer from './rank-layer'
class GameScene extends Scene {
    constructor() {
        super();



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
        })
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
            console.log('res  =', res);
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
        let connect = SocketIO(defines.socketUrl);

        wx.onHide(() => {
            //隐藏
            console.log('隐藏游戏');
            connect.emit('enter-back');
        });
        wx.onShow(() => {
            //显示
            connect.emit('enter-forward');
            if (global.id){
                //如果存在用户id 说明是重连游戏 ，那么给服务器发送一条消息 ，重新连接的消息
                connect.emit('re-connect', global.id);
            }
        })

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

        connect.on('player-join-room', (data) => {
            console.log('create head ', data);
            for (let i = 0; i < data.length; i++) {
                this._gameLayer.createHead(data[i]);
            }
        });

        connect.on('player-enter-back', (data)=>{
            console.log('player enter back', data);
            if (this._gameLayer){
                this._gameLayer.playerEnterBack(data);
            }
        });
        connect.on('sync-current-color', (color) => {
            this._gameLayer.changeCurrentColor(color);
        });
        connect.on('sync-board-data', (data) => {
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
            this._gameLayer.referPlayerInfo(data);
        });
        connect.on('player-offline', (playerId) => {
            this._gameLayer.playerOffLine(playerId);
        });
        this.setAuthorize((data) => {
            console.log('获取头像信息', data);
            this._connect.emit('login', data);
        });
        // this._uiLayer.showWin('black');
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
}
export default GameScene;