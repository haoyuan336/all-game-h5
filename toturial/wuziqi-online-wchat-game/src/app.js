import 'core-js' // 兼容性，在 .babelrc 里配置会有问题所以放这里了
import {game, prepare} from './scenes'

prepare().then(() => {
    game.show()
})

