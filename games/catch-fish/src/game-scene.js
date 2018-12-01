import Scene from './../../../util/render/scene'
import GameLayer from './game-layer'
class GameScene extends Scene {
    constructor() {
        super();
        console.log('进入')
        this.setDesignSize(1024, 640);
    }
   
    onLoad() {
        //初始化游戏层
        let layer = new GameLayer();
        this.addLayer(layer);
    }
}
export default GameScene;