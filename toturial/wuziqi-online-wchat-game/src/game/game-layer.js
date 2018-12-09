import {Layer, Sprite, director} from './../util/import'  
import global from './../global'
import resources from './../resources'
class GameLayer extends Layer{
    constructor() {
        super();
        let bg = new Sprite(global.resource[resources.bg].texture);
        this.addChild(bg);
        bg.position = {
            x: director.designSize.width * 0.5,
            y: director.designSize.height * 0.5
        } 
        bg.scale.set(2);
    }
}
export default GameLayer;