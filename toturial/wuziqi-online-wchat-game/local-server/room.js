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
            this.sendMatchSuccess();
        }
        this.syncCurrentColor();
        this.syncBoardData();
        this.syncPlayerInfo();

    }
    sendMatchSuccess() {
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].sendMatchSuccess();
        }
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
                pieceColor: this._playerList[i].getColor(),
                online: this._playerList[i].isOnline(),
                enterBack: this._playerList[i].isInBack()
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
    // playerEnterBack(player, state) {
    //     for (let i = 0; i < this._playerList.length; i++) {
    //         this._playerList[i].playerEnterBack(player, state);
    //     }
    // }

    playerLeaveRoom(player) {
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].id === player.id) {
                this._playerList.splice(i, 1);
            }
        }
        if(this._playerList.length === 0){
            //玩家都走光了 ，这时候 把房间销毁
            this.destory();
        }
        this.sendPlayerLeaveRoom(player);
        this.syncPlayerInfo();
    }
    sendPlayerLeaveRoom(player){
        for (let i = 0 ; i < this._playerList.length ; i ++){
            this._playerList[i].playerLeaveRoom(player);
        }
    }
    playerOffLine(player) {
        //看一下房间里面的玩家都是都掉线了
        console.log('玩家掉线');
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
        this._playerList = null;
        this._gameLogic = null;
        this._controller.removeRoom(this);
    }
    shareRoomToFriend(player, cb) {
        //玩家发来了 分享房间的操作，
        this.removeOfflinePlayer();
        this.syncPlayerInfo();
        if (this._playerList.length !== 2) {
            //首先房间里面玩家的个数 不能等于2 ，如果等于2 的话 ，说明正在游戏中，就不能再邀请其他的玩家了
        } else {
            cb({
                'status': 'fail',
                'data': 'room is full!',
                'title': '房间人数已满！'
            })
            return;
        }

        if (this._controller.lockRoom(this)) {
            //房间锁定成功
            cb({
                'status': 'ok'
            })
        } else {
            cb({
                'status': 'fail',
                'data': 'room lock fail!',
                'title': '房间已经不能邀请！'
            })
        }
    }
    removeOfflinePlayer() {
        //删掉掉线的玩家
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
    }
    reMatchGame(player, cb) {
        this.removeOfflinePlayer();
        //然后给剩下的玩家 同步房间里面的 玩家信息
        // player.syncPlayerInfo();

        //然后将房间加到 不满房间列表里面
        if (this._controller.pushUnFullRoom(this)) {
            if (cb) {
                cb({
                    status: 'ok'
                });
            }
        } else {
            if (cb) {
                cb({
                    status: 'fail',
                    data: 'is matching!'
                });
            }
        }
        this.syncPlayerInfo();
    }
  
}
module.exports = Room;