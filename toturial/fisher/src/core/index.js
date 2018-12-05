import config from '../config'

const {pixelRatio, windowHeight, windowWidth} = wx.getSystemInfoSync()

/* 根据需要 */
PIXI.utils.isWebGLSupported = function() {
    return true
}

PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = (point, x, y) => {
    point.x = x * pixelRatio
    point.y = y * pixelRatio
}


config.screen.width = windowWidth
config.screen.height = windowHeight
config.screen.resolution = pixelRatio

const app = new PIXI.Application({
    view: canvas,
    width: windowWidth * pixelRatio,
    height: windowHeight * pixelRatio,
    backgroundColor: config.bkgColor,
    antialias: true,
    sharedLoader: true
})

config.zoom.mix.push(
    app.screen.width / config.design.width,
    app.screen.height / config.design.height
)


// 设置节点相对屏幕中心的偏移
app.translate = (node, x=0, y=0) => {
    const rect = node.getBounds(false)
    node.position.set(
        (app.screen.width + rect.width) * .5 - rect.right + x,
        (app.screen.height + rect.height) * .5 - rect.bottom + y
    )
}

export default app
export const monitor = new PIXI.utils.EventEmitter()
