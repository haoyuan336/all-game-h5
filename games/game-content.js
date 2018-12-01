import {
    CutFruit,
    CatchFish,
    LoadScene,
    SiCong,
    ProtectRadish,

    CutFruitResources,
    CatchFishResources,
    SiCongResources,
    ProtectRadishResources,

    BezierEditor,
    PathEditor
} from './game-import'

import {director} from './../util/import'

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
            'protect-radish': ProtectRadish
        }
        let resourceMap = {
            'cut-fruit': CutFruitResources,
            'catch-fish': CatchFishResources,
            'sicong': SiCongResources,
            'protect-radish': ProtectRadishResources,
            'bezier-editor': {},
            'path-editor': {}
        }

        if (gameMap[key]){
            let gameScene = new gameMap[key];
            let loadScene = new LoadScene(resourceMap[key]);
            director.startScene(loadScene,gameScene);
        }
        
      
    }
}
export default new GameContent();