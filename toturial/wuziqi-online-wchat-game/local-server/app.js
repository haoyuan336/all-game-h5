const Player = require('./player');
const Room = require('./room');
const db = require('./db');
const rank = require('./rank');
class IDCreate {
    constructor() {
        this._id = '100000';
        this._idMap = {};
    }
    getNextID() {
        let find = false
        let nextId = '';
        while (!find) {
            let id = '1';
            for (let i = 0; i < 5; i++) {
                id += Math.floor(Math.random() * 10) + '';
            }
            nextId = id;
            if (!this._idMap[id]) {
                this._idMap[id] = true;
                find = true;
            }
        }
        return nextId;
    }
    removeID(id) {
        delete this._idMap[id];
    }
}
class App {
    constructor() {
        db.connect();
        rank.initRankList(this);
        this._playerMap = {};
        this._roomMap = {};
        this._waitMathingList = [];
        this._idCreate = new IDCreate();
    }
    playerLogin(socket, data) {
        console.log('玩家登陆了' + JSON.stringify(data));
        let playerId = data.id;
        console.log('player id = ' + playerId);
        let roomId = data.roomId;

        

        let player = undefined;
        if (this._playerMap[playerId]) {
            console.log('存在此玩家');
            player = this._playerMap[playerId];
            player.reConnect(socket);
        } else {
            let id = this._idCreate.getNextID();
            player = new Player(socket, id, this, data);
            this._playerMap[id] = player;
        }

        if (roomId && this._roomMap[roomId]) {
            //如果传过来的值存在 并且 也有这个房间，那么
            let room = this._roomMap[roomId];
            if (room.isShareing()){
                player.leaveCurrentRoom();
                room.joinPlayer(player);
            }
        }

        console.log('room id = ' + roomId);
    }
    playerMatching(player) {
        for (let i = 0; i < this._waitMathingList.length; i++) {
            if (this._waitMathingList[i].id === player.id) {
                return;
            }
        }
        let matching = this._waitMathingList.pop();
        let room = undefined;
        if (matching && matching.isInRoom()) {
            room = matching.getRoom();
            room.joinPlayer(player);
            // let room = new Room();
        } else if (matching && !matching.isInRoom()) {
            room = new Room(this._idCreate.getNextID(), this);
            room.joinPlayer(matching);
            room.joinPlayer(player);

        } else if (!matching) {
            console.log('没有匹配的玩家');
            this._waitMathingList.push(player);
        }
        if (room) {
            this._roomMap[room.id] = room;
        }

        console.log('matching player count  ', this._waitMathingList.length);
    }
    outMatchingList(player) {
        for (let i = 0; i < this._waitMathingList.length; i++) {
            if (this._waitMathingList[i].id === player.id) {
                console.log('将玩家从匹配列表里面删掉');
                this._waitMathingList.splice(i, 1);
                //将玩家从匹配列表里面删掉
            }
        }
    }

    createRoom() {
        let id = this._idCreate.getNextID();
        let room = new Room(id, this);
        this._roomMap[id] = room;
        return room;

    }

    syncRankData(data) {
        // for (let i in this._playerMap) {
        //     this._playerMap[i].syncRankData(data);
        // }
    }

}
module.exports = App;