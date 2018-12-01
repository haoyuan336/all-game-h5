import {Scene} from './../../../util/import'
import EditorLayer from './editor-layer'
import UILayer from './ui-layer'
class EditorScene extends Scene{
    constructor(){
        super();
        this.setDesignSize(1920, 1280);

    }
    onLoad(){
        let editorLayer = new EditorLayer();
        this.addLayer(editorLayer);
        let uiLayer = new UILayer(editorLayer);
        this.addLayer(uiLayer);
    }
}
export default EditorScene;