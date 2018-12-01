import {Scene} from './../../../util/import'
import GameLayer from './game-layer'
import ReadyLayer from './ready-layer'
class GameScene extends Scene{
    constructor(){
        super();
        this.setDesignSize(800, 480);
    }
    onLoad(){
        this.gameLayer = new GameLayer(this);
        this.addLayer(this.gameLayer);


        this.readyLayer = new ReadyLayer(this.gameLayer);
        this.addLayer(this.readyLayer);
    }
    gameOver(){
        if (this.readyLayer){
            this.readyLayer.showReady();
        }
    }
    
}
export default GameScene;