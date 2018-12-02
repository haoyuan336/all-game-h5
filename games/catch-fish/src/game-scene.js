import Scene from './../../../util/render/scene'
import GameLayer from './game-layer'
import { director } from '../../../util/import';
class GameScene extends Scene {
    constructor() {
        super();
        console.log('进入')

        let sizeRate = director.width/director.height

        this.setDesignSize(1024, 1024 / sizeRate);
    }
   
    onLoad() {
        //初始化游戏层
        let layer = new GameLayer();
        this.addLayer(layer);
    }
}
export default GameScene;