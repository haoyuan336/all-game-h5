import { Layer, Sprite, Label } from './../util/import'
class RankHead extends Layer {
    constructor(spec) {
        super();
        console.log('创建排行榜数据', JSON.stringify(spec));
        let ranNumLabel = new Label((spec.rankNum + 1) + ':', { fill: 0xffffff });
        ranNumLabel.anchor.set(0.5);
        ranNumLabel.position = {
            x: 20,
            y: 30
        }
        this.addChild(ranNumLabel);
        let image = wx.createImage();
        image.src = spec.avatar;
        this._avatarUrl = spec.avatar;
        image.onload = () => {
            this._avatar = new PIXI.Sprite.from(image);
            this._avatar.scale.set(0.5);
            this.addChild(this._avatar);
            this._avatar.position = {
                x: 50,
                y: 0
            }
        }

        let rankNum = spec.rankNum;
        console.log('rank num = ', rankNum);
        this.position = {
            x: rankNum % 3 * 240 + 20,
            y: Math.floor(rankNum / 3) * 90 + 100
        }

        let nameLabel = new Label(spec.nickName, { fill: 0xffffff, fontSize: 30 });
        this.addChild(nameLabel);
        nameLabel.anchor = {
            x: 0,
            y: 0
        }
        nameLabel.position = {
            x: 120,
            y: 0
        }
        let scoreLabel = new Label(spec.score, { fill: 0xfffff, fontSize: 35 });
        this.addChild(scoreLabel);
        scoreLabel.position = {
            x: 120,
            y: 30
        }
        this._scoreLabel = scoreLabel;
    }
    referInfo(data) {
        if (this._avatarUrl !== data.avatar) {
            //这里切换头像精灵
            // this.removeChild(this._avatar);
            let image = wx.createImage();
            image.src = data.avatar;
            this._avatarUrl = data.avatar;
            image.onload = () => {
                let texture = new PIXI.Texture.from(image);
                this._avatar.texture = texture;
                this._avatar.scale.set(0.5);
                this._avatar.position = {
                    x: 50,
                    y: 0
                }
            }
        }
        this._scoreLabel.text = data.score;

    }
}
export default RankHead;