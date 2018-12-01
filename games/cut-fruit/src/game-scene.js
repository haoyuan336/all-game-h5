import GameLayer from './game-layer'
import Scene from './../../../util/render/scene'
import ReadyLayer from './ready-layer'
class GameScene extends Scene {
    constructor() {
        super();
        console.log("显示切水果游戏");
        this.setDesignSize(800, 480);

    }
    onLoad() {
        let _gameLayer = new GameLayer();
        this.addLayer(_gameLayer);
        this.interactive = true;
        let readyLayer = new ReadyLayer(() => {
            this.removeChild(readyLayer);
            //把准备层删掉

            _gameLayer.startGame();
        });
        this.addChild(readyLayer);
    }

}
export default GameScene;