import { Layer, director } from './../util/import'
import { Graphics, Shape, ShapeType, Style } from './../util/render/graphics'
import RankHead from './rank-head'
class RankLayer extends Layer {
    constructor() {
        super();
        //初始化排行榜层;
        let graphics = new Graphics();
        this.addChild(graphics);
        let rect = new Shape(ShapeType.Rect, 0, 0, 750, 2000, new Style({ fill: 0x000000, alpha: 0.7 }));
        graphics.addChild(rect);

        this.position = {
            x: 0,
            y: director.screenType == 'normal' ? 1050 : 1100
        }
        // this.interactive = true;
        this._targetY = director.screenType == 'normal' ? 1050 : 1100;
        this._isDown = false;

        this._rankHeadMap = {};

    }
    onTouchStart(event) {
        if (event.data.y < this._targetY) {
            return;
        }
        this._isDown = !this._isDown;
        if (this._isDown) {
            this._targetY = director.screenType == 'normal' ? 1050 : 1100;
        } else {
            this._targetY = director.screenType == 'normal' ? 0 : 0;
        }
    }
    update(dt) {
        this.position.y += (this._targetY - this.position.y) * 0.2 * dt / 10;
    }
    referRankData(data) {
        console.log('刷新排行榜数据', data);
        for (let i = 0; i < data.length; i++) {
            if (this._rankHeadMap[i] && this._rankHeadMap[i].avatar != data[i].avatar) {
                this._rankHeadMap[i].referInfo(data[i]);
            } else if (!this._rankHeadMap[i]) {
                let head = new RankHead(data[i]);
                this._rankHeadMap[i] = head;
                this.addChild(head);
            }
        }

    }

}
export default RankLayer;