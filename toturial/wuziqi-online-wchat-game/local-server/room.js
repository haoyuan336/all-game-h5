const GameLogic = require('./game-logic');
const State = require('./state')
const RoomState = {
    Matching: 'matching',
    Gameing: 'gameing',
    Shareing: 'shareing',
    PlayerLeave: 'player-leave',
    WaitOfflinePlayer: 'wait-offline-player'
}
class Room {
    constructor(id, controller) {
        this._playerList = [];
        this.id = id;
        this._state = new State();
        this._controller = controller;
        this._gameLogic = new GameLogic();
        this._currentColor = Math.random() * 10 > 5 ? "black" : "white";
        this._state.setState(RoomState.Matching);
        this._state.addState(RoomState.PlayerLeave, () => {
            console.log('玩家离开了');
            this.syncPlayerInfo();
        });
        this._state.addState(RoomState.Shareing, () => {
            console.log('玩家分享了 这个房间');
            this.syncPlayerInfo();
        });
        this._state.addState(RoomState.Matching, () => {
            console.log('房间重新进入匹配中的状态');
            this.syncPlayerInfo();
        });
        this._state.addState(RoomState.Gameing, () => {
            for (let i = 0; i < this._playerList.length; i++) {
                this._playerList[i].setGameing();
            }
            this.syncBoardData();
            this.syncCurrentColor();
        });
        this._state.addState(RoomState.WaitOfflinePlayer, () => {
            console.log('进入等待掉线玩家的状态');
            // for (let i = 0 ; i < this._playerList.length ; i ++){
            //     this._playerList[i].waitOfflinePlayer();
            // }
            this.syncPlayerInfo();
        });
        this._state.addState(RoomState.PlayerLeave, () => {
            console.log('玩家离开了房间');
            this.syncPlayerInfo();
        });
    }

    joinPlayer(player) {
        console.log('player id = ', player.id);
        this._playerList.push(player);
        player.setRoom(this);
        if (this._playerList.length == 2) {
            let fristPlayer = this._playerList[0];
            player.setPieceColor(fristPlayer.getColor() === 'black' ? 'white' : 'black');
            this._state.setState(RoomState.Gameing);
        }
        this.syncPlayerInfo();
        this.syncCurrentColor();
    }

    syncCurrentColor() {
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].syncCurrentColor(this._currentColor);
        }
    }
    syncPlayerInfo() {
        console.log('同步玩家信息' + this.id);
        if (!this._playerList) {
            console.log('没有玩家信息');
            return;
        }
        let data = [];
        console.log('player list = ', this._playerList.length);
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
        let state = this._state.getState();
        console.log('state = ', state);
        for (let i = 0; i < this._playerList.length; i++) {
            this._playerList[i].syncPlayerInfo({
                roomId: this.id,
                roomState: state,
                playerInfo: data
            });
        }
    }
    // playerEnterBack(player, state) {
    //     for (let i = 0; i < this._playerList.length; i++) {
    //         this._playerList[i].playerEnterBack(player, state);
    //     }
    // }




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
        this.syncPlayerInfo();

    }
    removeOfflinePlayer() {
        console.log('删掉掉线的玩家');
    }
    shareRoomToFriend(player, cb) {
        console.log('邀请');
        //如果房间里面 只有一个玩家 ，并且这个玩家 是自己 
        let otherPlayer = undefined;
        let index = undefined;
        let otherIndex = undefined;
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].id === player.id) {
                index = i;
            } else {
                //取出另一个玩家
                otherPlayer = this._playerList[i];
                otherIndex = i;
            }
        }
        //如果另一个玩家存在，并且他的状态是在线的状态
        if (otherPlayer) {
            //将自己从房间里面 删掉
            //如果对方在线，那么把自己从房间里面 删掉
            if (otherPlayer.isOnline()) {
                this._playerList.splice(index, 1);
                //把自己从房间里面 删掉 ，那么房间的状态设置成匹配状态
                this._state.setState(RoomState.PlayerLeave);
            } else {

                //如果对方不在房间里面 ，那么就把他从房间里面删掉
                //把对方从房间里面 删掉，那么
                this._playerList.splice(otherIndex, 1);
                this._state.setState(RoomState.Shareing);
            }
        } else {
            this._state.setState(RoomState.Shareing);
        }
        if (cb) {
            cb();
        }
    }
    cancelShare() {
        this._state.setState(RoomState.Matching);
    }

    isHavePlayer(player) {
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].id === player.id) {
                return true;
            }
        }
        return false;
    }
    getFirstPlayer() {
        return this._playerList[0];
    }
    getPlayerCount() {
        return this._playerList.length;
    }
    playerLeaveRoom(player) {
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].id === player.id) {
                this._playerList.splice(i, 1);
            }
        }
        if (this._playerList.length === 1) {
            console.log('房间里面 还剩下一个人 ，那么就切换房间的状态未 玩家离开房间的状态');
            this._state.setState(RoomState.PlayerLeave);
        }
    }
    isInRoom(player) {
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].id === player.id) {
                return true;
            }
        }
        return false;
    }
    initGameLoginData() {
        this._gameLogic.clearGameData();
    }

    getState() {
        return this._state.getState();
    }
    // isGameing(player) {
    //     let isHave = false;
    //     for (let i = 0; i < this._playerList.length; i++) {
    //         if (this._playerList[i].id === player.id) {
    //             isHave = true;
    //         }
    //     }
    //     let isAllOnline = true;

    //     if (this._playerList.length === 2) {
    //         for (let i = 0; i < this._playerList.length; i++) {
    //             if (isAllOnline && !this._playerList[i].isOnline()) {
    //                 isAllOnline = false;
    //             }
    //         }
    //         console.log('所有人都在线' + isAllOnline);
    //     } else {
    //         console.log('房间里面 人数都不够');
    //         isAllOnline = false;
    //     }
    //     if (this._state.getState() === RoomState.Gameing && isHave && isAllOnline) {
    //         return true;
    //     }
    //     return false;
    // }
    isShareing() {
        if (this._playerList.length === 1 && this._state.getState() === RoomState.Shareing) {
            return true;
        }
        return false;
    }
    playerOffline(player) {
        this._state.setState(RoomState.WaitOfflinePlayer);
    }
    playerReOnline(player) {
        let allOnline = true;
        for (let i = 0; i < this._playerList.length; i++) {
            if (allOnline && !this._playerList[i].isOnline()) {
                allOnline = false;
            }
        }
        if (this._playerList.length === 2) {

        } else {
            allOnline = false;
        }
        if (allOnline) {
            this._state.setState(RoomState.Gameing);
        } else {
            this._state.setState(RoomState.WaitOfflinePlayer);
        }
        // this._state.setState(RoomState.Gameing);
    }
    reMatchGame(player) {
        console.log('重新匹配')
        for (let i = 0; i < this._playerList.length; i++) {
            if (this._playerList[i].id !== player.id) {
                console.log('删除除了自己之外的玩家');
                this._playerList.splice(i, 1);
            }
        }
        this._state.setState(RoomState.Matching);
    }
}
module.exports = Room;