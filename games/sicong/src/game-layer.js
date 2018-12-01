import { Layer, Sprite, director, State, Vec2 } from './../../../util/import'
import global from './../../global'
import resources from './../resources'
import SiCong from './sicong'
import HotDog from './hot-dog'
import Enemy from './enemy'
class GameLayer extends Layer {
    constructor(controller) {
        super();
        this._controller = controller;
        this._bgList = [];

        for (let i = 0; i < 2; i++) {
            let bg = new Sprite(global.resource[resources.bg].texture);
            bg.position = {
                x: director.designSize.width * 0.5 + bg.width * i,
                y: director.designSize.height * 0.5
            }
            this.addChild(bg);
            this._bgList.push(bg);
        }
        this._siCong = new SiCong(this);
        this.addChild(this._siCong);
        this._siCong.position.y = director.designSize.height * 0.5;
        this._siCong.position.x = this._siCong.width * 0.5;
        this._bullet = undefined;
        this._state = new State();
        // this._state.setState('run');
        this._weaponList = [];
        // this.addBullt();

        //取出游戏数据
        this._gameConfig = global.resource[resources["json_game-config"]].data;
        console.log('game config ', this._gameConfig);
        this._currentLevelNum = 0;
        this._currentwaveNum = 0;
        this._enemyCount = 0;
        this._enemyTypeNum = 0;
        this._addEnemyTime = 0;

        this._enemyList = [];

        this._state.addState('game-over', ()=>{
            console.log('游戏结束');
            if (this._gameConfig){
                this._gameConfig.gameOver();
            }
        })
    }
    addBullt() {
        let bullet = new HotDog();
        bullet.position = {
            x: this._siCong.position.x + 5,
            y: this._siCong.position.y - 6
        }
        this._weaponList.push(bullet);
        this.addChild(bullet);

        return bullet;
    }
    update(dt) {
    

       

        if (this._state.getState() == 'run') {
            this.addEnemy(dt);
            for (let i = 0; i < this._bgList.length; i++) {
                let bg = this._bgList[i];
                bg.position.x -= dt * 0.04;
                if ((bg.position.x + bg.width * 0.5) < 0) {
                    bg.position.x = this._bgList[i ? 1 : 0].position.x + bg.width * 2;
                }
            }

            for (let i = 0 ; i < this._enemyList.length ; i ++){
                let enemy = this._enemyList[i];
                let r1 = enemy.getBounds();
                let r2 = this._siCong.getBounds();

                
                // let v1 = new Vec2(enemy.position.x, enemy.position.y);
                // let v2 = new Vec2(this._siCong.position.x, this._siCong.position.y);
                // let dis = v1.distance(v2);
                // console.log('dis = ' , dis);
                // if (dis < (enemy.width + this._siCong.width) * 0.5){
                //     //相交
                //     this._state.setState('game-over');
                // }
                // let r1 = enemy.get
                
            }
        }

    }
    addEnemy(dt) {
        if (!this._waveConfig) {
            this._waveConfig = this.getWaveConfig();
        }
        if (this._waveConfig == 'game-end') {
        }

        let currentEnemeyConfig = undefined;
        if (this._waveConfig && this._waveConfig !== 'game-end') {
            // console.log('wave config = ' , this._waveConfig);
            if (this._enemyTypeNum < this._waveConfig.length) {
                currentEnemeyConfig = this._waveConfig[this._enemyTypeNum];

            } else {
                this._currentwaveNum++;
                this._enemyTypeNum = 0;
                this._waveConfig = undefined;
            }
        }

        if (currentEnemeyConfig) {
            let type = currentEnemeyConfig.type;
            let count = currentEnemeyConfig.count;
            let duraction = currentEnemeyConfig.duraction;
            if (this._addEnemyTime > duraction) {
                this._addEnemyTime = 0;
                if (this._enemyCount < count) {
                    this._enemyCount++;
                    this.addOneEnemy(type);
                } else {
                    this._enemyCount = 0;
                    this._enemyTypeNum++;
                }
            } else {
                this._addEnemyTime += dt;
            }
        }
    }

    addOneEnemy(type) {
        let enemy = new Enemy(type, this);
        this.addChild(enemy);
        this._enemyList.push(enemy);
    }
    getWaveConfig() {
        if (this._currentLevelNum < Object.keys(this._gameConfig).length) {
            let levelConfig = this._gameConfig['level_' + this._currentLevelNum];
            if (this._currentwaveNum < levelConfig.length) {

                return levelConfig[this._currentwaveNum];
            } else {
                this._currentwaveNum = 0;
                this._currentLevelNum++;
            }
        } else {
            return 'game-end';
        }
    }


    shootBullet() {
        let bullet = this.addBullt();
        bullet.fire(() => {
            for (let i = 0; i < this._weaponList.length; i++) {
                if (this._weaponList[i] == bullet) {
                    this._weaponList.splice(i, 1);
                }
            }
            this.removeChild(bullet);
        });
    }
    startGame() {
        this._siCong.startGame();
        this._state.setState('run');
    }

    enemyRunEnd(enemy){
        // this._enemyList.
        for (let i = 0 ; i < this._enemyList.length ; i ++){
            if (this._enemyList[i] == enemy){
                this._enemyList.splice(i, 1);
                console.log('删除敌人');
            }
        }
        this.removeChild(enemy);
    }
}
export default GameLayer;