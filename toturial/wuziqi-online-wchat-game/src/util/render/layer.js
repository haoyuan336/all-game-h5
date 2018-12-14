import director from './director'
const { windowWidth } = wx.getSystemInfoSync()

class Layer extends PIXI.Container {
    constructor() {
        super()

        this.on('pointerdown', this.onTouchStart.bind(this))
            .on('pointerup', this.onTouchEnd.bind(this))
            .on('pointerupoutside', this.onTouchEnd.bind(this))
            .on('pointermove', this.onTouchMove.bind(this));
        // wx.onTouchStart((event) => {
        //     let data = {
        //         x: event.touches[0].clientX * 750 / windowWidth,
        //         y: event.touches[0].clientY * 750 / windowWidth
        //     }
        //     if (director.screenType == 'length') {
        //         data = {
        //             x: event.touches[0].clientX * 2,
        //             y: event.touches[0].clientY * 2
        //         }
        //     }
        //     this.onTouchStart({ data: data });
        // });
    }
    onLoad() {

    }
    update() {

    }
    destroy() {

    }
    onTouchStart() {

    }
    onTouchMove() {

    }
    onTouchEnd() {

    }
}
export default Layer;