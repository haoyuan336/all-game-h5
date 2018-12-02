import global from './../../global'
import resources from './../resources'
import {Layer, Button, Sprite, director} from './../../../util/import'
class ReadyLayer extends Layer {
    constructor(readyCb) {
        super();
        // let sp = new PIXI.Sprite

        let logo = new Sprite(global.resource[resources.logo].texture);
        this.addChild(logo);
        logo.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.45
        }
        //放一个按钮
        let button = new Button({
            normalTexture: global.resource[resources.icon_start].texture,
            touchCb: clickCb
        });
        this.addChild(button)
        button.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.8
        }
        


        function clickCb() {
            let action = new TWEEN.Tween(logo.position)
                .to({ x: director.designSize.width * 0.5, y: -100 }, 600)
                .onComplete(() => {
                })
            // action.easing(TWEEN.Easing.Quadratic)
            action.start();


            let action1 = new TWEEN.Tween(button.position)
                .to({ x: director.designSize.width * 0.5, y: 600 }, 400)
                .onComplete(() => {
                    if (readyCb) {
                        readyCb();
                    }
                });
            action1.delay(200);
            action1.start();
        }
    }
}
export default ReadyLayer;