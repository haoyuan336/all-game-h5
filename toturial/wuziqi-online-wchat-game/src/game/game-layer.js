import { Layer, Sprite, director, Vec2, Button } from './../util/import'
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
        bg.position = {
            x: 0,
            y: director.screenType == 'normal' ? -50 : 0
        }
        bg.anchor.set(0);
        bg.scale.set(2);
        this._headList = [];
        this._currentColorPiece = undefined;
        this._pieceMap = {};
        this._piecePosList = [];
        let offsetY = director.screenType == 'normal' ? 368 : 418
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                let pos = new Vec2(62 + 52 * j, 52 * i + offsetY);
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
        for (let i in data) {
            if (this._pieceMap[i] == undefined) {
                let color = data[i];
                let piece = new Sprite(global.resource[color == 'black' ? resources.piece_black : resources.piece_white].texture);
                this.addChild(piece);
                piece.scale.set(2);
                piece.position = this._piecePosList[i];
                this._pieceMap[i] = piece;

                let audio = wx.createInnerAudioContext();
                audio.autoplay = true;
                audio.src = defines.resourcesUrl + + '/images/piece_audio.mp3';
                audio.onStop(() => {
                    console.log('音频播放完成，删掉音频');
                    audio.destroy();
                })
            }
        }
    }
    createHead(data) {
        // let id = data.id;
        // for (let i = 0; i < this._headList.length; i++) {
        //     console.log('已经存在的id?', this._headList[i].getId());
        //     if (this._headList[i].getId() == id) {
        //         return;
        //     }
        // }
        // // data.type = this._headList.length == 0 ? 'left' : 'right';
        // console.log('id = ', id);
        // console.log('global id = ', global.id);
        // data.type = id == global.id ? 'left' : 'right';
        // let head = new Head(data);
        // head.referInfo(data);
        // this.addChild(head);
        // this._headList.push(head);

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
        }
        this._currentColorPiece.scale.set(2);
    }
    onTouchStart(event) {
        let data = event.data.getLocalPosition(this);
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
            // console.log('dis = ' , pos);
            if (dis < 30) {
                //给服务器发消息
                // choose-board
                this._controller.playerPushPiece(i);
            }
        }
    }
    removeAllPiece() {
        for (let i in this._pieceMap) {
            this.removeChild(this._pieceMap[i]);
        }
        this._pieceMap = [];
    }
    referPlayerInfo(data) {
        // for (let i in this._headList) {
        //     this._headList[i].referPlayerInfo(data);
        // }
    }

    playerEnterBack(data) {
        for (let i in this._headList) {
            this._headList[i].playerEnterBack(data.id, data.state);
        }
    }
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