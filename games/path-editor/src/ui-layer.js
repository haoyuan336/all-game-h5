import {Layer, Button} from './../../../util/import'
class UILayer extends Layer{
    constructor(editorLayer){
        super();
        let clearButton = new Button({
            text: 'clear',
            touchCb: ()=>{
                if (editorLayer){
                    editorLayer.clearCb();
                }
            } 
        });
        this.addChild(clearButton);
        clearButton.position = {
            x: 100,
            y: 200
        }

        let exportButton = new Button({
            text: 'export',
            touchCb: ()=>{
                if (editorLayer){
                    editorLayer.exportCb();
                }
            } 
        });
        this.addChild(exportButton);
        exportButton.position = {
            x: 100,
            y: 400
        }
    }
}
export default UILayer;