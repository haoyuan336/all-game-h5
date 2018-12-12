import { Scene, director, Button } from './../util/import'
import GameLayer from './game-layer'
import UILayer from './ui-layer'
import resources from './../resources'
import global from './../global'
import defines from './../defines'
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
        let button = new Button({
            normalTexture: global.resource[resources.denglu_button].texture,
            touchCb: () => {
                console.log('click');
                wx.authorize({
                    scope: 'scope.userInfo',
                    success: () => {
                        this.login(cb);
                    }
                })
            }
        });
        this.addChild(button);
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
        this._uiLayer = new UILayer(this);
        this.addLayer(this._uiLayer);

        console.log('链接服务器');
        let connect = SocketIO(defines.socketUrl);
        this._connect = connect;
        connect.on('login-success', (data) => {
            console.log('登录成功');
            global.id = data;
        });

        connect.on('player-join-room', (data) => {
            console.log('create head ', data);
            for (let i = 0 ; i < data.length ; i ++){
                this._gameLayer.createHead(data[i]);
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
        })
        this.setAuthorize((data) => {
            console.log('获取头像信息', data);
            this._connect.emit('login', data);
        });
        // this._uiLayer.showWin('black');
    }
    playerPushPiece(index) {
        this._connect.emit('choose-board', index);
    }
    closeGameOverLayer(){
        //关闭了游戏结束层
        if (this._gameLayer){
            this._gameLayer.removeAllPiece();
        }
    }
}
export default GameScene;