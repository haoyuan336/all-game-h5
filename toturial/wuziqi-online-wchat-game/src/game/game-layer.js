import { Layer, Sprite, director, Vec2 } from './../util/import'
import global from './../global'
import resources from './../resources'
import Head from './head'
import defines from './../defines'
class GameLayer extends Layer {
    constructor(controller) {
        super();
        this._controller = controller;
        let bg = new Sprite(global.resource[resources.bg].texture);
        this.addChild(bg);
        bg.anchor.set(0);
        bg.scale.set(2);
        this._headList = [];
        this._currentColorPiece = undefined;
        this._pieceList = [];
        this._piecePosList = [];
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                let pos = new Vec2(62 + 52 * j, 52 * i + 418);
                if (i == 0 && j == 0) {
                    console.log('pos', pos);
                }
                this._piecePosList.push(pos);
            }
        }
        this.interactive = true;
        this.isTouching = false;
    }
    referBoard(data) {
        let count = data.length - this._pieceList.length;
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                let piece = new Sprite(global.resource[resources.piece_black].texture);
                this.addChild(piece);
                this._pieceList.push(piece);
                //每创建一个棋子的时候，播放一下音效
                let audio = wx.createInnerAudioContext();
                audio.autoplay = true;
                audio.src = defines.resourcesUrl + '/images/piece_audio.mp3';
                audio.onStop(() => {
                    console.log('音频播放完成，删掉音频');
                    audio.destroy();
                })
            }
        } else {
            for (let i = 0; i < count * -1; i++) {
                let obj = this._pieceList.pop();
                this.removeChild(obj);
            }
        }
        for (let i = 0; i < this._pieceList.length; i++) {
            this._pieceList[i].position = this._piecePosList[parseInt(data[i].index)];
            this._pieceList[i].texture = global.resource[data[i].color === 'black' ? resources.piece_black : resources.piece_white].texture;
            this._pieceList[i].scale.set(2);
        }
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
                y: 330
            }
        }
        this._currentColorPiece.scale.set(2);
    }
    onTouchStart(event) {
        let data = event.data.getLocalPosition(this);
        console.log('data = ', data);
        if (this.isTouching) {
            return
        }
        this.isTouching = true;
        setTimeout(() => {
            this.isTouching = false;
        }, 200);

        let touchVec = new Vec2(data.x, data.y);
        for (let i = 0; i < this._piecePosList.length; i++) {
            let pos = this._piecePosList[i];
            let dis = touchVec.distance(pos);
            if (dis < 30) {
                console.log('index = ', i);
                //给服务器发消息
                // choose-board
                this._controller.playerPushPiece(i);
            }
        }
    }
    removeAllPiece() {
        for (let i in this._pieceList) {
            this.removeChild(this._pieceList[i]);
        }
        this._pieceList = [];
    }
    referPlayerInfo(data) {
        // for (let i in this._headList) {
        //     this._headList[i].referPlayerInfo(data);
        // }
    }
    // playerEnterBack(data) {
    //     for (let i in this._headList) {
    //         this._headList[i].playerEnterBack(data.id, data.state);
    //     }
    // }
    syncPlayerInfo(data) {
        let count = data.length - this._headList.length;
        if (count < 0) {
            for (let i = 0; i < count * -1; i++) {
                let head = this._headList.pop();
                this.removeChild(head);
            }
        } else {

            for (let i = 0; i < count; i++) {
                // this.createHead();
                let head = new Head();
                this.addChild(head);
                this._headList.push(head);
            }
        }
        for (let i = 0; i < data.length; i++) {
            this._headList[i].referPlayerInfo(data[i]);
        }
    }
}
export default GameLayer;