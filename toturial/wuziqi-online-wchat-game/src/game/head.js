import { Layer, Sprite, director, Label } from './../util/import'
import global from './../global'
import resources from './../resources'
class Head extends Layer {
    constructor(spec) {
        super();
        this._id = spec.id;
        this._avatar = undefined;
        let image = wx.createImage();
        image.src = spec.avatarUrl;
        let type = spec.type;
        this.position = {
            x: type == "left" ? 30 : director.designSize.width - 160,
            y: director.screenType == 'normal' ? 100 : 150
        }
        image.onload = () => {
            this._avatar = new PIXI.Sprite.from(image);
            this.addChild(this._avatar);
        }
        this._nickNameLabel = new Label(spec.nickName, {
            fontSize: 40
        });
        this.addChild(this._nickNameLabel);
        this._nickNameLabel.anchor = {
            x: type == 'left' ? 0 : 1,
            y: 0
        }
        this._nickNameLabel.position = {
            x: type == 'left' ? 140 : 0,
            y: 0
        }

        this._scoreLabel = new Label(type == "left"? '分:' + spec.score : spec.score + ":分", {
            fontSize: 40
        });

        this._scoreLabel.anchor = {
            x: type == 'left' ? 0 : 1,
            y: 0
        }
        this._scoreLabel.position = {
            x: type == 'left' ? 140 : 0,
            y: 40
        }
        this.addChild(this._scoreLabel);

        this.colorPiece = new Sprite(global.resource[spec.pieceColor == 'black' ? resources.piece_black : resources.piece_white].texture);
        this.addChild(this.colorPiece);
        this.colorPiece.position = {
            x: type == 'left' ? 170 : -30,
            y: 120
        }
        this.colorPiece.scale.set(2);

    }
}
export default Head;