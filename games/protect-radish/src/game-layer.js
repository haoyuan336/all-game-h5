import { Layer, Sprite, director } from './../../../util/import'
import resources from './../resources'
import global from './../../global'
import uiBatterySourceMap from './../ui_Battery-source-map'
import PackageTexture from './../../common/package-texture'
class GameLayer extends Layer {
    constructor() {
        super();

        let bg = new Sprite(global.resource[resources.Bg3].texture);
        this.addChild(bg);
        bg.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        }

        // let sp = new Sprite(new PackageTexture(resources.json_ui_Battery, uiBatterySourceMap.ui_Battery_01_01));
        // this.addChild(sp);
        // sp.position = {
        //     x: 100,
        //     y: 100
        // }


    }
}
export default GameLayer;