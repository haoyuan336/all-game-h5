import {
    CutFruit,
    CatchFish,
    LoadScene,
    SiCong,
    ProtectRadish,
    WuZiQiOnline,

    CutFruitResources,
    CatchFishResources,
    SiCongResources,
    ProtectRadishResources,
    WuZiQiOnlineResources,

    BezierEditor,
    PathEditor
} from './game-import'

import {director} from './../util/import'

import global from './global'
class GameContent {
    constructor() {

        director.init(710, 480);
    }
    showApp(){
        director.showApp(document.getElementById('game-div'));
    }
    showGame(key) {
        console.log('展示游戏' + key);
        // if (this.app){
        //     document.getElementById('game-div').appendChild(this.app.view);
        // }

        let gameMap = {
            'cut-fruit': CutFruit,
            'catch-fish': CatchFish,
            'bezier-editor': BezierEditor,
            'sicong': SiCong,
            'path-editor': PathEditor,
            'protect-radish': ProtectRadish,
            'wuziqi-online': WuZiQiOnline
        }
        let resourceMap = {
            'cut-fruit': CutFruitResources,
            'catch-fish': CatchFishResources,
            'sicong': SiCongResources,
            'protect-radish': ProtectRadishResources,
            'bezier-editor': {},
            'path-editor': {},
            'wuziqi-online': WuZiQiOnlineResources
        }

        if (gameMap[key]){
            global.event.offAll();//将事件监听器清空
            let gameScene = new gameMap[key];
            let loadScene = new LoadScene(resourceMap[key]);
            director.startScene(loadScene,gameScene);
        }
        
      
    }
}
export default new GameContent();