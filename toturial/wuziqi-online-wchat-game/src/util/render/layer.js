class Layer extends PIXI.Container {
    constructor() {
        super()

        this.on('pointerdown', this.onTouchStart.bind(this))
            .on('pointerup', this.onTouchEnd.bind(this))
            .on('pointerupoutside', this.onTouchEnd.bind(this))
            .on('pointermove', this.onTouchMove.bind(this));
    }
    onLoad() {

    }
    update() {

    }
    destroy() {

    }
    onTouchStart(){

    }
    onTouchMove(){

    }
    onTouchEnd(){
        
    }
}
export default Layer;