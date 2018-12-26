import { Layer, Sprite } from './../util/import'
import global from './../global'
import resources from './../resources'
class HeadImage extends Layer {
    constructor() {
        super();
        this._sprite = new PIXI.Sprite();
        this.addChild(this._sprite);
        this._sprite.position = {
            x: 50,
            y: 50
        }
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x00dd00, 0.4);
        graphics.drawCircle(this._sprite.position.x, this._sprite.position.y, 60);
        graphics.endFill();
        this.addChild(graphics);
        this._sprite.mask = graphics;
        // this._sprite.addChild(graphics);
        this._sprite.anchor.set(0.5);
        let kuang = new Sprite(global.resource[resources.head_image_kuang].texture);
        this.addChild(kuang);
        kuang.scale.set(0.96);
        kuang.position = this._sprite.position;
    }
    setImageAvatar(avatar) {
        if (global.resource[avatar]) {
            let texture = new PIXI.Texture.from(global.resource[avatar]);
            this._sprite.texture = texture;
        } else {
            let image = wx.createImage();
            image.src = avatar;
            image.onload = () => {
                console.log('加载完成');
                global.resource[avatar] = image;
                this._sprite.texture = new PIXI.Texture.from(image);
            };
        }
    }
}
export default HeadImage;