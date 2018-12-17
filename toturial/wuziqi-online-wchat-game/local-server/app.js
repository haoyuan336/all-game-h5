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
        this._idCreate = new IDCreate();
        this._playerMap = {};
        this._roomMap = {};
        this._unFullRoomList = []; //不满的房间的房间列表
    }
    createPlayer(socket, data) {
        let id = this._idCreate.getNextID();
        console.log('创建玩家 =', id);
        let player = new Player(socket, id, this, data);
        this._playerMap[id] = player;
        this.assignRoom(player);
        this.syncGameData();
        player.syncRankData(rank.getRankList());
    }
    reConnect(socket, data) {
        console.log('app reconnect = ', data);

        if (this._playerMap[data.id]) {
            console.log('存在此玩家');
            //如果存在此玩家的id 说明内存里还有次玩家的信息，那么重新监听一下 socket 信息
            this._playerMap[data.id].reConnect(socket);

            //如果这个玩家 没有在房间里面 。那么给他分配一个新的房间
            if (!this._playerMap[data.id].isInRoom()) {
                //如果这个玩家 没有在房间里面 。那么再给他分配一个新的房间
                this.assignRoom(this._playerMap[data.id]);
            }
        } else {
            //如果不存在此玩家 ，那么就得重新创建玩家了
            this.createPlayer(socket, data);
        }
    }
    createRoom() {
        let id = this._idCreate.getNextID();
        let room = new Room(id, this);
        this._roomMap[id] = room;
        return room;

    }
    assignRoom(player) {
        //给新加进来的玩家分配房间
        let room = undefined;
        if (this._unFullRoomList.length !== 0) {
            room = this._unFullRoomList.pop();
            console.log('取出未满的房间');
        } else {
            room = this.createRoom();
            this._unFullRoomList.push(room);
        }
        if (room) {
            player.assignRoom(room);

        } else {
            console.warn('未找到房间');
        }
        return room;
    }
    pushUnFullRoom(room) {
        this._unFullRoomList.push(room);
        this.syncGameData();
    }
    removePlayer(id) {
        delete this._playerMap[id];
        this.syncGameData();
    }
    removeRoom(room) {
        console.log("删除空房间");
        //把房间从房间map里面删掉
        delete this._roomMap[room.id];
        //从不满房间的列表里面 把房间删掉
        for (let i = 0; i < this._unFullRoomList.length; i++) {
            if (this._unFullRoomList[i].id == room.id) {
                this._unFullRoomList.splice(i, 1);
            }
        }
        this.syncGameData();
    }
    syncGameData() {
        let gameData = {
            room_count: Object.keys(this._roomMap).length,
            unfull_room_count: this._unFullRoomList.length,
            online_player_count: Object.keys(this._playerMap).length,
        }
        for (let i in this._playerMap) {
            this._playerMap[i].referGameData(gameData);
        }
    }

    syncRankData(data) {
        for (let i in this._playerMap) {
            this._playerMap[i].syncRankData(data);
        }
    }
}
module.exports = App;