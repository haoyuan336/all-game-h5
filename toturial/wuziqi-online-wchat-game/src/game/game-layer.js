import { Layer, Sprite, director, Vec2 } from './../util/import'
import global from './../global'
import resources from './../resources'
import Head from './head'
const { pixelRatio, windowHeight, windowWidth } = wx.getSystemInfoSync()

class GameLayer extends Layer {
    constructor() {
        super();
        let bg = new Sprite(global.resource[resources.bg].texture);
        this.addChild(bg);
        bg.position = {
            x: 0,
            y: director.screenType == 'normal' ? -50 : 0
        }
        bg.anchor.set(0);
        bg.scale.set(2);
        this._headList = [];
        this._currentColorPiece = undefined;

        this._piecePosList = [];
        let offsetY = director.screenType == 'normal' ? 368 : 418
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                let pos = new Vec2(62 + 52 * j, 52 * i + offsetY);
                if (i == 0 && j == 0) {
                    console.log('pos', pos);
                }
                this._piecePosList.push(pos);
                let sp = new Sprite(global.resource[resources.piece_black].texture);
                this.addChild(sp);
                sp.position = pos;
                sp.scale.set(2);
            }
        }
        this.interactive = true;
        this.isTouching = false;
    }
    createHead(data) {
        data.type = this._headList.length == 0 ? 'left' : 'right';
        let head = new Head(data);
        this.addChild(head);
        this._headList.push(head);
    }
    changeCurrentColor(color) {
        let texture = global.resource[color == 'black' ? resources.piece_black : resources.piece_white].texture
        if (this._currentColorPiece) {
            this._currentColorPiece.texture = texture;
        } else {
            this._currentColorPiece = new Sprite(texture);
            this.addChild(this._currentColorPiece);
            this._currentColorPiece.position = {
                x: 60,
                y: director.screenType == 'normal' ? 300 : 350
            }
            this._currentColorPiece.scale.set(2);
        }
    }
    onTouchStart(event) {
       

        if (this.isTouching) {
            return
        }
        this.isTouching = true;
        setTimeout(() => {
            this.isTouching = false;
        }, 200);
        let data = event.data.getLocalPosition(this);
        let touchVec = new Vec2(data.x, data.y);
        for (let i = 0; i < this._piecePosList.length; i++) {
            let pos = this._piecePosList[i];
            let dis = touchVec.distance(pos);
            // console.log('dis = ' , pos);
            if (dis < 30) {
                console.log('index = ', i, pos);
            }
        }

    }
}
export default GameLayer;