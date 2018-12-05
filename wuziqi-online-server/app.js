const Player = require('./player');
const Room = require('./room');
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
        this._idCreate = new IDCreate();
        this._playerMap = {};
        this._roomMap = {};
        this._unFullRoomList = []; //不满的房间的房间列表
    }
    createPlayer(socket) {
        let id = this._idCreate.getNextID();
        console.log('创建玩家 =', id);
        let player = new Player(socket, id, this);
        this._playerMap[id] = player;
        this.assignRoom(player);
        this.syncGameData();
       
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
    pushUnFullRoom(room){
        this._unFullRoomList.push(room);
        this.syncGameData();
    }
    removePlayer(id){
        delete this._playerMap[id];
        this.syncGameData();
    }
    removeRoom(room){
        console.log("删除空房间");
        //把房间从房间map里面删掉
        delete this._roomMap[room.id];
        //从不满房间的列表里面 把房间删掉
        for (let i = 0 ; i < this._unFullRoomList.length ; i ++){
            if (this._unFullRoomList[i].id == room.id){
                this._unFullRoomList.splice(i, 1);
            }
        }
        this.syncGameData();
    }
    syncGameData(){
        let gameData = {
            room_count: Object.keys(this._roomMap).length,
            unfull_room_count: this._unFullRoomList.length,
            online_player_count: Object.keys(this._playerMap).length,
        }
        for(let i in this._playerMap){
            this._playerMap[i].referGameData(gameData);
        }
    }

}
module.exports = App;