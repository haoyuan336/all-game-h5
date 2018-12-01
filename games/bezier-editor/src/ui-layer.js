import {Layer, Button} from './../../../util/import'
class UILayer extends Layer{
    constructor(editorLayer){
        super();
        let clearButton = new Button({
            text: 'clear',
            touchCb: ()=>{
                editorLayer.clear();

            }
        });
        clearButton.position = {
            x: 100,
            y: 200
        }
        this.addChild(clearButton);

        let exportButton = new Button({
            text: 'export',
            touchCb:()=>{
                editorLayer.export();
            }
        })
        exportButton.position = {
            x: 100,
            y: 300
        }
        this.addChild(exportButton);
    }
}
export default UILayer;