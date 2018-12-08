import {director} from './util/import'
import {ScreenSize} from './config'
import GameScene from './game/game-scene'
import LoadScene from './common/load-scene'
class App{
    constructor() {
        console.log('启动app');
        director.init(ScreenSize.width, ScreenSize.height);
        director.startScene(new LoadScene(), new GameScene());
    }
}
export default new App();
