import Sprite from './sprite'
import Layer from './layer'
import Label from './label'
import { Graphics, Shape, Style, ShapeType } from './graphics'
const TouchType = {
    Sprite: 1,
    Scale: 2,
    Alpha: 3
}
class Button extends Layer {
    constructor(spec) {
        /**
         * text 按钮的默认label
         * touchType 按钮按下的效果形式
         * normalTexture 按钮的正常纹理
         * pressedTexture 按钮的按下纹理
         * normalScale 按钮的原始大小 
         * pressedTexture 按钮的按下的大小
         * normalAlpha 按钮的原始透明值
         * pressedAlpha 按钮的按下的透明值
         * touchCb 按钮的回调
         * 
         */
        super();

        this._buttonStyle = {
            text: '',
            touchType: TouchType.Scale,

            normalTexture: undefined,
            pressedTexture: undefined,

            normalScale: 1,
            pressedScale: 1.2,

            normalAlpha: 1,
            pressedAlpha: 0.5,
            touchCb: () => {

            }

        }

        if (spec) {
            for (let i in this._buttonStyle) {
                let key = i;
                this._buttonStyle[key] = spec[key] ? spec[key] : this._buttonStyle[key];
            }

            if (spec.click) {
                this._buttonStyle.touchCb = spec.click;
            }
        }

        if (this._buttonStyle.normalTexture) {
            this._sprite = new Sprite(this._buttonStyle.normalTexture);
            if (this._buttonStyle.normalTexture.textureInfo) {
                this._sprite.width = this._buttonStyle.normalTexture.textureInfo.rotate ? this._buttonStyle.normalTexture.height : this._buttonStyle.normalTexture.width;
                this._sprite.height = this._buttonStyle.normalTexture.textureInfo.rotate ? this._buttonStyle.normalTexture.width : this._buttonStyle.normalTexture.height;

            }



            this.addChild(this._sprite);
        } else {
            this._graphics = new Graphics();
            this.addChild(this._graphics);
            this._graphics.rectDraw(-50, - 30, 100, 60);
        }
        if (this._buttonStyle.pressedTexture) {
            this._buttonStyle.touchType = TouchType.Sprite;
        }

        let label = new Label(this._buttonStyle.text, {
            fontSize: 30
        });
        label.anchor.set(0.5)
        this.addChild(label);

        this.interactive = true;
        this.buttonMode = true;

    }
    update() {
    }
    onTouchStart() {
        switch (this._buttonStyle.touchType) {
            case TouchType.Sprite:
                this._sprite.texture = this._buttonStyle.pressedTexture;
                break;
            case TouchType.Scale:
                this.scale.set(this._buttonStyle.pressedScale);
                break;
            case TouchType.Alpha:
                this._sprite.alpha = this._buttonStyle.pressedAlpha;
                break;
            default:
                break;
        }
    }
    onTouchEnd() {
        switch (this._buttonStyle.touchType) {
            case TouchType.Sprite:
                this._sprite.texture = this._buttonStyle.normalTexture;

                break;
            case TouchType.Scale:
                this.scale.set(this._buttonStyle.normalScale)
                break;
            case TouchType.Alpha:
                this.scale.set(this._buttonStyle.normalAlpha);
                break;
            default:
                break;
        }

        if (this._buttonStyle.touchCb) {
            this._buttonStyle.touchCb();
        }
    }
}
Button.TouchType = TouchType
export default Button;