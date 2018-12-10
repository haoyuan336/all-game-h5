const GameLogic = require('./game-logic')
class Room {
    constructor(id, controller) {
        this._playerList = [];
        this.id = id;
        this._controller = controller;
        this._gameLogic = new GameLogic();
        this._currentColor = Math.random() * 10 > 5 ? "black" : "white";
    }
    getPlayerCount() {
        return this._playerList.length;
    }
    assignPlayer(player) {
        this._playerList.push(player);

        if (this._playerList.length == 2) {
            player.setPieceColor(this._playerList[0].getColor() == 'black' ? 'white' : 'black');
        }
        this.syncCurrentColor();
        this.syncBoardData();
        this.playerJoinRoom(player);

    }
    playerJoinRoom(player){
        for (let i = 0 ; i < this._playerList.length ; i ++){
            this._playerList[i].playerJoinRoom(player);
        }
    }
    syncCurrentColor() {
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].syncCurrentColor(this._currentColor);
        }
    }

    removePlayer(playerId) {
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].id == playerId) {
                this._playerList.splice(i, 1);
            }
        }
        if (this._playerList.length == 1) {
            this._controller.pushUnFullRoom(this);
        } else if (this._playerList.length == 0) {
            this._controller.removeRoom(this);
        }
    }
    playerChooseBoard(player, index) {
        console.log('current color = ', this._currentColor);
        console.log('player color', player.getColor());
        if (this._currentColor == player.getColor()) {
            console.log('是你在玩游戏');
            if (this._gameLogic.movePiece(index, player.getColor())) {
                this.syncBoardData();
                //如果下子成功了
                //切换棋子的颜色
                if (this._gameLogic.checkWin(index, this._currentColor)) {
                    console.log(this._currentColor, 'win');
                    //如果胜利了 ，就不允许任何人下子了
                    this.sendGameWinMsg(this._currentColor);
                    this._currentColor = 'none';
                } else {
                    this._currentColor = this._currentColor == 'black' ? 'white' : 'black';
                }
                //如果没有胜利 就进行下一步
                this.syncCurrentColor();

            }
        }
    }
    syncBoardData() {
        let boardData = this._gameLogic.getBoardData();
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].syncBoardData(boardData);
        }
    }
    sendGameWinMsg(color) {
        //下发游戏胜利的消息
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].sendGameWinMsg(color);
        }
        //等两秒钟，继续下发该谁游戏的消息
        setTimeout(() => {
            this._currentColor = color == 'black' ? 'white' : 'black';
            this.syncCurrentColor();
            this._gameLogic.clearGameData();
        }, 2000);

    }
}
module.exports = Room;