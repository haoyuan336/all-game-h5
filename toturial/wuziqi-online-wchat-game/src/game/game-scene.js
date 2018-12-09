import { Scene, director, Button } from './../util/import'
import GameLayer from './game-layer'
import resources from './../resources'
import global from './../global'
class GameScene extends Scene {
    constructor() {
        super();
        this.setDesignSize(750, 750 / director.sizeRate);


    }
    wxLogin(cb) {
        wx.login({
            success(res) {
                console.log('res.code', res.code);
                if (res.code) {
                    //发起网络请求
                    // wx.request({
                    //     url: 'https://test.com/onLogin',
                    //     data: {
                    //         code: res.code
                    //     }
                    // })
                    if (cb){
                        cb(res.code);
                    }
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }
    setAuthorize(cb) {
        let self = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    self.showLoginButton(cb);

                } else {
                    self.login(cb);
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
        let self = this;
        wx.getUserInfo({
            success: (res) => {
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                // var gender = userInfo.gender //性别 0：未知、1：男、2：女
                // var province = userInfo.province
                // var city = userInfo.city
                // var country = userInfo.country
                global.nickName = nickName;
                global.avatarUrl = avatarUrl;
                if (cb) {
                    cb({
                        nickName: nickName,
                        avatarUrl: avatarUrl
                    })
                }
                // self._connect.emit('login', {
                //     nickName: nickName,
                //     avatarUrl: avatarUrl
                // })
            }
        })
    }
    onLoad() {
        console.log('初始化游戏');
        this._gameLayer = new GameLayer();
        this.addLayer(this._gameLayer);
        console.log('链接服务器');
        let connect = SocketIO('localhost:3002');
        this._connect = connect;
        connect.on('login-success', () => {
            console.log('登陆成功');
        });


        this.setAuthorize((data) => {
            console.log('获取头像信息', data);
            this.wxLogin((code)=>{
                data.code = code;
                this._connect.emit('login', data);
            });

        });

    }
}
export default GameScene;