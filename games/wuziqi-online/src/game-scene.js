import { Scene, director } from './../../../util/import'
import GameLayer from './game-layer'
import UILayer from './ui-layer'
import Socket from 'socket.io-client'
class GameScene extends Scene {
    constructor() {
        super();
        this.setDesignSize(800, 800 / director.sizeRate);

    }
    onLoad() {
        this._gameLayer = new GameLayer(this);
        this.addLayer(this._gameLayer);

        this._uiLayer = new UILayer();
        this.addLayer(this._uiLayer);



         //链接服务器
         let connect = Socket("localhost:3001");
         connect.on('login-success', (id)=>{
             console.log('login success', id);
             if (this._uiLayer){
                this._uiLayer.setPlayerId(id);
             }
         });
         connect.on('refer-game-data', (data)=>{
             console.log('refer game data', data);
            if (this._uiLayer){
                this._uiLayer.referGameData(data);
            }
        });
        connect.on('set-color', (color)=>{
            console.log('设置颜色', color);
        });
        connect.on('sync-current-color', (color)=>{
            console.log('同步当前的颜色', color);
            if (this._uiLayer){
                this._uiLayer.setCurrentColor(color);
            }
        });
        connect.on('sync-board-data', (data)=>{
            //同步棋盘的数据
            this._gameLayer.syncBoardData(data);
        });
        connect.on('game-win', (color)=>{
            console.log('游戏胜利', color);
            this._uiLayer.showGameWin(color);
        });
        this._connect = connect;
    }
    chooseBoard(index){ 
        if (this._connect){
            this._connect.emit('choose-board', index);
        }
    }
}
export default GameScene;