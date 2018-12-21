import { Layer, Sprite, Label } from './../util/import'
import global from './../global'
import resources from './../resources'
class RankHead extends Layer {
    constructor() {
        super();
        let ranNumLabel = new Label('', { fill: 0xffffff, fontSize: 28 });
        ranNumLabel.anchor.set(0.5);
        ranNumLabel.position = {
            x: 20,
            y: 30
        }
        this.addChild(ranNumLabel);
        this._rankNumLabel = ranNumLabel;

        let nameLabel = new Label('', { fill: 0xffffff, fontSize: 30 });
        this.addChild(nameLabel);
        nameLabel.anchor = {
            x: 0,
            y: 0
        }
        nameLabel.position = {
            x: 120,
            y: 0
        }
        this._nameLabel = nameLabel;


        let scoreLabel = new Label('', { fill: 0xfffff, fontSize: 35 });
        this.addChild(scoreLabel);
        scoreLabel.position = {
            x: 120,
            y: 30
        }
        this._scoreLabel = scoreLabel;

        this._avatar = new Sprite(global.resource[resources.piece_black].texture);
        this.addChild(this._avatar);
        this._avatar.anchor.set(0.5);

    }
    referInfo(data) {
        let rankNum = data.rankNum;
        //这里切换头像精灵
        // this.removeChild(this._avatar);
        let image = wx.createImage();
        image.src = data.avatar;
        image.onload = () => {
            let texture = new PIXI.Texture.from(image);
            this._avatar.texture = texture;
            this._avatar.scale.set(0.5);
            this._avatar.position = {
                x: 80,
                y: 30
            }
        }
        this._rankNumLabel.text = (data.rankNum + 1) + ':';
        this._scoreLabel.text = data.score;
        this._nameLabel.text = data.nickName;
        this.position = {
            x: rankNum % 3 * 240 + 20,
            y: Math.floor(rankNum / 3) * 90 + 50
        }
    }
}
export default RankHead;