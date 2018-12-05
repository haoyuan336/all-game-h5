import { Layer, Label, Sprite } from './../../../util/import'
import global from './../../global'
import resources from './../resources'
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
        console.log('设置当前棋子的颜色',color);
        for (let i = 0; i < this._pieceList.length; i++) {
            this._pieceList[i].scale.set(1);
            if (this._pieceList[i].pieceColor == color) {
                this._pieceList[i].scale.set(1.2);
            }
        }
    }
}
export default UILayer;