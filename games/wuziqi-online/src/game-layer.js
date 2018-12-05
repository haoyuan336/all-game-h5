import {Layer, Sprite, director} from './../../../util/import'
import resources from './../resources'
import global from './../../global'
import Socket from 'socket.io-client'
class GameLayer extends Layer{
    constructor(){
        super();
        //初始化背景
        let bg = new Sprite(global.resource[resources.chessboard].texture);
        this.addChild(bg);
        bg.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        }

        //链接服务器
        let connect = Socket("localhost:3001");
        connect.on('login-success', (id)=>{
            console.log('login success', id);
        });

    }
};
export default GameLayer;