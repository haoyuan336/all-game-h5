import { Layer, Label, Sprite, director } from './../../../util/import'
import global from './../../global'
import resources from './../resources'
import { Graphics, Shape, ShapeType, Style } from './../../../util/render/graphics'
class UILayer extends Layer {
    constructor() {
        super();
        this._playerIdLabel = new Label('hello world');
        this.addChild(this._playerIdLabel);
        this._playerIdLabel.position = {
            x: 0,
            y: 0
        }
        this._roomCountLabel = new Label('room count:');
        this.addChild(this._roomCountLabel);
        this._roomCountLabel.position = {
            x: 200,
            y: 0
        }


        this._unfullRoomCountLabel = new Label("unfull room count:");
        this.addChild(this._unfullRoomCountLabel);
        this._unfullRoomCountLabel.position = {
            x: 400,
            y: 0
        }

        this._roomIdLabel = new Label("room id:");
        this.addChild(this._roomIdLabel);
        this._roomIdLabel.position = {
            x: 600,
            y: 0
        }
        this._roomPlayerCountLabel = new Label('room player count:');
        this.addChild(this._roomPlayerCountLabel);
        this._roomPlayerCountLabel.position = {
            x: 0,
            y: 20
        }
        this._allPlayerCountLabel = new Label('all player count:');
        this.addChild(this._allPlayerCountLabel);
        this._allPlayerCountLabel.position = {
            x: 200,
            y: 20
        }
        this._pieceList = [];
        for (let i = 0; i < 2; i++) {
            let piece = new Sprite(global.resource[i ? resources.black : resources.white].texture);
            piece.pieceColor = i ? "black" : 'white';
            this.addChild(piece);
            this._pieceList.push(piece);
            piece.position = {
                x: 20,
                y: 80 + i * 40
            }
        }
        this._graphics = new Graphics();
        this.addChild(this._graphics);
    }
    setPlayerId(id) {
        console.log('刷新玩家id', id);
        this._playerIdLabel.text = 'player id:' + id;
    }
    referGameData(data) {
        console.log('refer game data ', data);
        this._roomCountLabel.text = 'room count:' + data.room_count;
        this._unfullRoomCountLabel.text = 'unfull room count:' + data.unfull_room_count;
        this._roomIdLabel.text = "room id:" + data.room_id;
        this._roomPlayerCountLabel.text = "room player count:" + data.room_player_count;
        this._allPlayerCountLabel.text = "all player count:" + data.online_player_count;
    }
    setCurrentColor(color) {
        console.log('设置当前棋子的颜色', color);
        for (let i = 0; i < this._pieceList.length; i++) {
            this._pieceList[i].scale.set(1);
            if (this._pieceList[i].pieceColor == color) {
                this._pieceList[i].scale.set(1.2);
            }
        }
    }
    showGameWin(color) {
        console.log('显示游戏胜利的界面', color);
        this.interactive = true;
        let rect = new Shape(ShapeType.Rect, 0, 0, director.designSize.width, director.designSize.height, new Style({ fill: 0x222222, fillAlpha: 0.8 }));
        this._graphics.addChild(rect);
        let piece = new Sprite(global.resource[color == 'black' ? resources.black : resources.white].texture);
        this.addChild(piece);
        piece.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5 - 100
        }
        let winLabel = new Label('WIN', { fontSize: 100, fill: 0xffffff });
        this.addChild(winLabel);
        winLabel.anchor = {
            x: 0.5,
            y: 0.5
        }
        winLabel.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        }
        this.winLabel = winLabel;
        this.winPiece = piece;
    }
    onTouchStart() {
        this.interactive = false;
        this._graphics.removeAllChild();
        this.removeChild(this.winLabel);
        this.removeChild(this.winPiece);
        global.event.fire('re-start');
    }
}
export default UILayer;