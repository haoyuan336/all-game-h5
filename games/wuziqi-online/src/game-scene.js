import { Scene, director } from './../../../util/import'
import GameLayer from './game-layer'
class GameScene extends Scene {
    constructor() {
        super();
        this.setDesignSize(800, 800 / director.sizeRate);
    }
    onLoad() {
        let gameLayer = new GameLayer();
        this.addLayer(gameLayer);
    }
}
export default GameScene;