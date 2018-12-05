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
        } else {
            room = this.createRoom();
            this._unFullRoomList.push(room);
        }
        if (room) {
            player.assignRoom(room);

        } else {
            console.warn('未找到房间');
        }
    }

}
module.exports = App;