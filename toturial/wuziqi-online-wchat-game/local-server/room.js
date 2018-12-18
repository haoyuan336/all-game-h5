const GameLogic = require('./game-logic')
class Room {
    constructor(id, controller) {
        this._playerList = [];
        this.id = id;
        this._controller = controller;
        this._gameLogic = new GameLogic();
        this._currentColor = Math.random() * 10 > 5 ? "black" : "white";
    }

    assignPlayer(player) {
        this._playerList.push(player);

        if (this._playerList.length == 2) {
            player.setPieceColor(this._playerList[0].getColor() == 'black' ? 'white' : 'black');
        }
        this.syncCurrentColor();
        this.syncBoardData();
        this.syncPlayerInfo();

    }

    syncCurrentColor() {
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].syncCurrentColor(this._currentColor);
        }
    }
    syncPlayerInfo() {
        let data = [];
        for (let i = 0; i < this._playerList.length; i++) {
            data.push({
                id: this._playerList[i].id,
                score: this._playerList[i].getScore(),
                ranKNum: this._playerList[i].getRankNum(),
                avatarUrl: this._playerList[i].avatarUrl,
                nickName: this._playerList[i].nickName,
                pieceColor: this._playerList[i].getColor()
            })
        }

        console.log('sync current info = ', data);
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].syncPlayerInfo({
                roomId: this.id,
                playerInfo: data
            });
        }
    }
    playerEnterBack(player, state) {
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].playerEnterBack(player, state);
        }
    }
    playerOffLine(player) {
        //看一下房间里面的玩家都是都掉线了
        let isAllOffline = true;
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].isOnline()) {
                isAllOffline = false;
                //只要有一个人还在线 
            }
        }

        if (isAllOffline) {
            //所有人都掉线了,那么关闭房间。删掉玩家
            this.destory();
            return;
        }
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].playerOffLine(player.id);
        }
    }
    reStartGame(player) {
        //重新开始游戏
        //那么需要将掉线的玩家从房间里面删掉
        let offLinePlayer = undefined;
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].isOnline() == false) {
                offLinePlayer = this._playerList[i];
                this._playerList.splice(i, 1);
            }
        }
        if (offLinePlayer) {
            offLinePlayer.outRoom();
        }
        //然后给剩下的玩家 同步房间里面的 玩家信息
        // player.syncPlayerInfo();

        //然后将房间加到 不满房间列表里面
        this._controller.pushUnFullRoom(this);
        player.sendMatchingMsg();
        this.syncPlayerInfo();
    }
    playerChooseBoard(player, index) {
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
    destory() {
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].destory();
        }
        this._playerList = null;
        this._gameLogic = null;
        this._controller.removeRoom(this);
    }
}
module.exports = Room;