import Rect from '../math/rect'
class Sprite extends PIXI.Sprite {
    constructor(texture, textureInfo) {
        let frame = {
            x: 0,
            y: 0,
            width: texture.width,
            height: texture.height
        }
        let rotate = 0;
        let spriteFrame;
        if (textureInfo) {
            frame = textureInfo.frame ? textureInfo.frame : frame;
            rotate = textureInfo.rotate ? textureInfo.rotate : rotate;
            spriteFrame = new PIXI.Texture(texture, frame, undefined, undefined, rotate);
        }else{
            spriteFrame = texture;
        }

        // texture.rotation = Math.PI;
        super(spriteFrame);
        this.width = rotate ? frame.height : frame.width;
        this.height = rotate ? frame.width : frame.height;
        this.anchor.set(0.5);

        this.on('pointerdown', this.onTouchStart.bind(this))
            .on('pointerup', this.onTouchEnd.bind(this))
            .on('pointerupoutside', this.onTouchEnd.bind(this))
            .on('pointermove', this.onTouchMove.bind(this));
    }
    update(dt) {

    }
    onTouchStart() {

    }
    onTouchMove() {

    }
    onTouchEnd() {

    }
    getBounds() {
        /**
         * 返回一个矩形
         * 
         */
        return new Rect(
            this.position.x - this.width * this.anchor.x,
            this.position.y - this.height * this.anchor.y,
            this.width,
            this.height
        )
    }
}
export default Sprite;