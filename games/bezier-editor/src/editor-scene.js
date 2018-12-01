import {Scene} from './../../../util/import'
import EditorLayer from './editor-layer'
import UILayer from './ui-layer'
class BezierScene extends Scene{
    constructor(){
        super();
        console.log('初始化贝塞尔曲线编辑器');
        this.setDesignSize(1920, 1280);
    }
    onLoad(){   
        let layer = new EditorLayer();
        this.addLayer(layer);
        let uiLayer = new UILayer(layer);
        this.addLayer(uiLayer);
    }
}
export default BezierScene;