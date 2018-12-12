import { Layer } from './../util/import'
import GameOverLayer from './gameover-layer'
class UILayer extends Layer {
    constructor(controller) {
        super();
        this._gameOverLayer = undefined;
        this._controller = controller;
    }
    showWin(color) {
        if (!this._gameOverLayer) {
            this._gameOverLayer = new GameOverLayer(color);
            this.addChild(this._gameOverLayer);
        }
        this.interactive = true;
    }
    onTouchStart() {
        this.interactive = false;
        if (this._gameOverLayer) {
            this.removeChild(this._gameOverLayer);
            this._gameOverLayer = undefined;
            if (this._controller){
                this._controller.closeGameOverLayer();
            }
        }
    }
}
export default UILayer;