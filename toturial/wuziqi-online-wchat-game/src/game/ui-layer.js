import { Layer } from './../util/import'
import GameOverLayer from './gameover-layer'
class UILayer extends Layer {
    constructor(controller) {
        super();
        this._gameOverLayer = undefined;
        this._controller = controller;


        // this._gameOverLayer = new GameOverLayer('black', this);
        // this.addChild(this._gameOverLayer);
    }
    showWin(color) {
        if (!this._gameOverLayer) {
            this._gameOverLayer = new GameOverLayer(color, this);
            this.addChild(this._gameOverLayer);
        }
    }
    gameOverClose() {
        if (this._gameOverLayer) {
            this.removeChild(this._gameOverLayer);
            this._gameOverLayer = undefined;

        }
        if (this._controller) {
            this._controller.closeGameOverLayer();
        }
    }
    
}
export default UILayer;