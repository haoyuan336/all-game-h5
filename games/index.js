import gameContent from './game-content'
import {helper} from './../util/import'
window.onload = function(){
    console.log('window load');
    gameContent.showApp();

    let key = helper.getQueryString('game-type');
    console.log('key', key);

    gameContent.showGame(key);
}