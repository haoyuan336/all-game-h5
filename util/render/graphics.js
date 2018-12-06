import Vec2 from './../math/vec2'
import Rect from './../math/rect'
const ShapeType = {
    Circle: 1,
    Rect: 2
}
class Style {
    constructor() {
        this.fill = 0xFFFFFF;
        this.fillAlpha = 1;
        this.lineColor = 0xFFFFFF;
        this.lineAlpha = 1;
        this.lineWidth = 0;
        if (arguments.length !== 0 && arguments[0] != undefined) {
            let param = arguments[0];
            this.fill = param.fill != undefined ? param.fill : this.fill;
            console.log('this.fill', this.fill);
            this.fillAlpha = param.fillAlpha ? param.fillAlpha : this.fillAlpha || param.alpha ? param.alpha : this.fillAlpha;
            this.lineAlpha = param.lineAlpha ? param.lineAlpha : this.lineAlpha;
            this.lineColor = param.lineColor ? param.lineColor : this.lineColor;
            this.lineWidth = param.lineWidth ? param.lineWidth : this.lineWidth;
        }
    }
}
class Shape {
    constructor() {
        let type = arguments[0];
        this.type = type;
        this.style = new Style();
        switch (type) {
            case ShapeType.Circle:
                this.x = arguments[1];
                this.y = arguments[2];
                this.radiu = arguments[3];
                this.style = arguments[4] ? arguments[4] : this.style;

                break;
            case ShapeType.Rect:
                this.x = arguments[1];
                this.y = arguments[2];
                this.width = arguments[3];
                this.heigth = arguments[4];
                this.style = arguments[5] ? arguments[5] : this.style;
                break;
            default:
                break;
        }
    }
    isContain() {
        let x = 0;
        let y = 0;
        if (arguments.length == 2) {
            x = arguments[0];
            y = arguments[1];
        }
        if (arguments.length == 1) {
            x = arguments[0].x;
            y = arguments[0].y;
        }


        switch (this.type) {
            case ShapeType.Circle:
                let vec = new Vec2(x, y);
                let dis = vec.distance(this.x, this.y);
                if (dis < this.radiu) {
                    return true;
                }
                break;
            case ShapeType.Rect:
                let rect = new Rect(this.x, this.y, this.width, this.heigth);
                if (rect.isContain(x, y)) {
                    return true;
                }
                break;
            default:
                break;
        }

        return false;


    }
};


class Graphics extends PIXI.Graphics {
    constructor() {
        super();
        this._childList = [];
    }
    update(dt) {
        this.draw();
    }
    rectDraw(x, y, width, height, param) {
        // let style = new Style(param);
        // this.lineStyle(style.lineWidth, style.lineColor, style.lineAlpha);
        // this.beginFill(style.fill, style.fillAlpha);
        // this.drawRect(x, y, width, hieght);
        this.addChild(new Shape(ShapeType.Rect, x, y, width, height, param));
    }
    // circleDraw(x, y, radiu, param) {
    //     let style = new Style(param);
    //     this.lineStyle(style.lintWidth);
    //     this.beginFill(style.fill, style.fillAlpha);
    //     this.drawCircle(x, y, radiu);
    //     this.endFill();
    // }
    draw() {
        this.clear();
        for (let i = 0; i < this._childList.length; i++) {
            let child = this._childList[i];
            let style = child.style;
            switch (child.type) {
                case ShapeType.Circle:
                    this.lineStyle(style.lineWidth, style.lineColor, style.lineAlpha);
                    this.beginFill(style.fill, style.fillAlpha);
                    this.drawCircle(child.x, child.y, child.radiu);
                    break;
                case ShapeType.Rect:
                    this.lineStyle(style.lineWidth, style.lineColor, style.lineAlpha);
                    this.beginFill(style.fill, style.fillAlpha);
                    this.drawRect(child.x, child.y, child.width, child.heigth);
                    break;
            }
        }
        this.endFill();

    }

    addChild(child) {
        this._childList.push(child);
    }
    removeAllChild() {
        this._childList = [];
    }
    removeChild(child) {
        this._childList.forEach((v, k) => {
            if (child === v) {
                this._childList.splice(k, 1);
            }
        });
    }
}
export { Graphics, Style, Shape, ShapeType };