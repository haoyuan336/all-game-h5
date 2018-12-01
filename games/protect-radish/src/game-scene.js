import {Scene} from './../../../util/import'
import GameLayer from './game-layer'
class GameScene extends Scene{
    constructor() {
        super();
        this.setDesignSize(960, 640);
    }
    onLoad(){
        let gameLayer = new GameLayer();
        this.addLayer(gameLayer);
    }
}
export default GameScene;