import defines from './../defines'
import global from './../global'
class Connect {
    constructor(controller) {
        this._controller = controller;
        this._messageIndex = 1;
        this._messageBack = {};
        this._connection = SocketIO(defines.socketUrl);
        this._connection.on('request-login', () => {
            console.log(' 收到了 服务器请求登陆的消息');
            this.login();
        });
        this._connection.on('login-success', (data)=>{
            console.log('login success');
            global.playerInfo.id = data.id;
            this._controller.loginSuccess();
        });
        this._connection.on('sync-player-info', (data)=>{
            this._controller.syncPlayerInfo(data);
        });
    }
    login(data) {
        let param = {
            avatarUrl: global.playerInfo.avatarUrl,
            nickName: global.playerInfo.nickName
        }
        //根据参数不同 ，组合不同的参数
        if (data) {

        } else {

        }
        this._connection.emit('login', param);
    }
    notify(messageType, cb) {
        this._messageBack[this._messageIndex] = cb;
        this._connection.emit('notify', {
            messageType: messageType,
            messageIndex: this._messageIndex
        });
        this._messageIndex++;
    }
}
export default Connect;