import { Layer, Sprite, director, Vec2 } from './../../../util/import'
import resources from './../resources'
import global from './../../global'
class GameLayer extends Layer {
    constructor(controller) {
        super();
        //初始化背景
        this._controller = controller;
        let bg = new Sprite(global.resource[resources.chessboard].texture);
        this.addChild(bg);
        bg.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        }
        this._boardList = [];
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                let pos = {
                    x: 75 + j * 30,
                    y: 65 + i * 30
                }
                this._boardList.push({
                    pos: pos
                });
            }
        }
        this._boardMap = {}; //存放当前的棋子


        this.interactive = true;
        global.event.on('re-start', ()=>{
            console.log('清除棋盘里面的内容');
            for (let i in this._boardMap){
                this.removeChild(this._boardMap[i]);
            }
            this._boardMap = {};
        });
    }
    syncBoardData(data) {
        console.log('同步棋牌数据', data);
        for (let i in data) {
            let color = data[i];
            let index = i;
            if (!this._boardMap[index]) {
                let piece = new Sprite(global.resource[color == "black" ? resources.black : resources.white].texture);
                this.addChild(piece);
                piece.position = this._boardList[index].pos;
                this._boardMap[index] = piece;
            }
        }
    }
    onTouchStart(event) {
        let data = event.data.getLocalPosition(this);
        let v1 = new Vec2(data.x, data.y);
        let chooseBoardIndex = undefined;
        for (let i = 0; i < this._boardList.length; i++) {
            let v2 = new Vec2(this._boardList[i].pos.x, this._boardList[i].pos.y);
            let dis = v1.distance(v2);
            if (dis < 15) {
                chooseBoardIndex = i;
            }
        }
        if (chooseBoardIndex) {
            this._controller.chooseBoard(chooseBoardIndex);
        }
    }
};
export default GameLayer;