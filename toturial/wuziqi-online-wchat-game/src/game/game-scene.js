import { Scene, director, Button } from './../util/import'
import GameLayer from './game-layer'
import resources from './../resources'
import global from './../global'
import defines from './../defines'
class GameScene extends Scene {
    constructor() {
        super();
    }
    setAuthorize(cb) {
        wx.getSetting({
            success:(res)=> {
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
                    success() {
                        this.login(cb);
                    }
                })
            }
        });
        button.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        }
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
        this._gameLayer = new GameLayer();
        this.addLayer(this._gameLayer);
        console.log('链接服务器');
        let connect = SocketIO(defines.socketUrl);
        this._connect = connect;
        connect.on('login-success', (data) => {
            console.log('登陆成功');
            global.avatarUrl = data.avatarUrl;
            global.nickName = data.nickName;
            global.id = data.id;
            this._gameLayer.createHead(data);
        });

        connect.on('player-join-room', (data)=>{
            this._gameLayer.createHead(data);
        });
        connect.on('sync-current-color', (color)=>{
            this._gameLayer.changeCurrentColor(color);
        });
        this.setAuthorize((data) => {
            console.log('获取头像信息', data);
            this._connect.emit('login', data);
        });

    }
}
export default GameScene;