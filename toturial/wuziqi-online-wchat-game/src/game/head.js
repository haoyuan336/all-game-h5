import { Layer, Sprite, director, Label } from './../util/import'
import global from './../global'
import resources from './../resources'
import HeadImage from './head-image'
class Head extends Layer {
    constructor(spec) {
        super();
        this._id = '';
        this._avatar = undefined;
        // let type = spec.type;
        // this.position = {
        //     x: type == "left" ? 30 : director.designSize.width - 160,
        //     y: director.screenType == 'normal' ? 100 : 150
        // }
        // if (global.resource[spec.avatarUrl]) {
        //     this._avatar = new PIXI.Sprite.from(global.resource[spec.avatarUrl]);
        //     this.addChild(this._avatar);
        // } else {
        //     let image = wx.createImage();
        //     image.src = spec.avatarUrl;
        //     image.onload = () => {
        //         this._avatar = new PIXI.Sprite.from(image);
        //         global.resource[spec.avatarUrl] = image;
        //         this.addChild(this._avatar);

        //     }
        // }

        this._wifiLogo = new Sprite(global.resource[resources.wifi_logo].texture);
        this.addChild(this._wifiLogo);
        this._wifiLogo.scale.set(0.5);
        this._wifiLogo.position = {
            x: 30,
            y: 150
        }
        this._nickNameLabel = new Label('', {
            fontSize: 30
        });
        this.addChild(this._nickNameLabel);


        this._scoreLabel = new Label('', {
            fontSize: 35
        });


        this.addChild(this._scoreLabel);

        this._colorPiece = new Sprite(global.resource[resources.piece_black].texture);
        this.addChild(this._colorPiece);

        this._colorPiece.scale.set(2);

        this._rankLabel = new Label('', { fontSize: 30 });
        this.addChild(this._rankLabel);

        //只有排行榜小于100的时候，才会显示这个排行榜标识
        // this._rankLabel.visible = spec.rankNum < 100;

        this._avatar = new HeadImage();
        this.addChild(this._avatar);

    }

    getId() {
        return this._id;
    }
    referPlayerInfo(data) {
        console.log('refer player info  head data', data);
        let type = 'right';
        type = (data.id == global.playerInfo.id) ? 'left' : 'right';
        let isOnline = data.online;
        let enterBack = data.enterBack;
        if (data.id == global.playerInfo.id) {
            global.avatarUrl = data.avatarUrl;
            global.nickName = data.nickName;
        }

        this._type = type;
        this.position = {
            x: this._type == "left" ? 30 : director.designSize.width - 160,
            y: 100
        }
        this._id = data.id;
        // this._scoreLabel.text = this._type == "left" ? '分:' + data.score : data.score + ":分";
        this._scoreLabel.text = '分:' + data.score;
        // this._rankLabel.visible = data.rankNum < 100?true:false;
        this._rankLabel.visible = true;

        this._rankLabel.text = '排行:' + (data.rankNum + 1);
        this._nickNameLabel.text = data.nickName;
        let avatarUrl = data.avatarUrl;
        this._colorPiece.texture = global.resource[data.pieceColor == 'black' ? resources.piece_black : resources.piece_white].texture;
        this._colorPiece.scale.set(2);
        this._colorPiece.position = {
            x: type == 'left' ? 170 : -30,
            y: 120
        }
        this._scoreLabel.anchor = {
            x: type == 'left' ? 0 : 1,
            y: 0
        }
        this._scoreLabel.position = {
            x: type == 'left' ? 140 : 0,
            y: 40
        }
        this._rankLabel.position = {
            x: type == 'left' ? 195 : -55,
            y: 120
        }
        this._rankLabel.anchor = {
            x: type == 'left' ? 0 : 1,
            y: 0.5
        }
        this._nickNameLabel.anchor = {
            x: type == 'left' ? 0 : 1,
            y: 0
        }
        this._nickNameLabel.position = {
            x: type == 'left' ? 140 : 0,
            y: 0
        }
        this._avatar.setImageAvatar(avatarUrl);

        this._avatar.position = {
            x: type == 'left' ? -0 : 30,
            y: 0
        }
        if (this._wifiLogo) {
            this._wifiLogo.alpha = isOnline && !enterBack ? 1 : 0.3;

        }
    }
    playerEnterBack(playerId, value) {
    }
}
export default Head;