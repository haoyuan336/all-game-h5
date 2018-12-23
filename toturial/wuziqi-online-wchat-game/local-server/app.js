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
        this._shareFriendRoomList = []; //邀请等待好友的房间
        this._emptyRoomList = []; //添加一个空的房间
    }
    createPlayer(socket, data) {
        let player = undefined;
        if (this._playerMap[data.id]) {
            //存在此玩家
            console.log('存在此玩家' + data.id);
            this._playerMap[data.id].reConnect(socket);
            player = this._playerMap[data.id];
        } else {
            console.log('不存在此玩家');
            let id = this._idCreate.getNextID();
            console.log('创建玩家 =', id);
            player = new Player(socket, id, this, data);
            this._playerMap[id] = player;
            console.log('创建玩家' + JSON.stringify(data));
        }
        if (player.isInRoom()) {
            //因为玩家还在房间里面 ，所以不做任何操作
            //不过需要告诉房间里面玩家 ，我回来了
            console.log('玩家还在房间里面' + player.getRoom().id);
            player.getRoom().syncPlayerInfo();
        } else {
            this.assignRoom(player, data);
        }

        player.syncRankData(rank.getRankList());
    }

    createRoom() {
        let id = this._idCreate.getNextID();
        let room = new Room(id, this);
        this._roomMap[id] = room;
        return room;

    }
    assignRoom(player, data) {
        //分配房间的具体操作
        let roomId = data.roomId;
        console.log('room id = ', roomId);
        //首先取出roomID
        // console.log('share friend room list = ', this._shareFriendRoomList.length);
        let tempRoom = undefined;
        if (roomId) {
            //如果存在房间号
            // console.log('存在房间号的' + roomId);
            //在邀请房间里面 寻找是否存在
            for (let i = 0; i < this._shareFriendRoomList.length; i++) {
                console.log('share friend room list = ', this._shareFriendRoomList[i].id);
                console.log('room id = ', roomId);
                if (this._shareFriendRoomList[i].id === roomId) {
                    //存在
                    //并且邀请的房间 需要从列表里面删除
                    tempRoom = this._shareFriendRoomList[i];
                    this._shareFriendRoomList.splice(i, 1);
                }
            }
        }
        //未找到等待邀请的房间
        if (tempRoom === undefined) {
            if (this._unFullRoomList.length !== 0) {
                tempRoom = this._unFullRoomList.pop();
                console.log('取出未满的房间' + tempRoom.id);
                console.log('player count = ' + tempRoom.getPlayerCount());
            } else {

                if (this._emptyRoomList.length > 0) {
                    //如果空房间列表的长度不为0  那么 就从里面取出一个房间出来
                    tempRoom = this._emptyRoomList.pop();
                    console.log('取出空房间一个' + tempRoom.getPlayerCount());
                } else {
                    //如果空房间列表长度为0， 那么就创建一个 房间出来
                    console.log('创建一个空的房间');
                    tempRoom = this.createRoom();
                }
                // this._unFullRoomList.push(tempRoom);
                this.pushUnFullRoom(tempRoom);
            }
        }
        //给新加进来的玩家分配房间
        // let room = undefined;
        if (tempRoom) {
            console.log('将房间分配给这个玩家' + tempRoom.id);
            player.assignRoom(tempRoom);
        }
    }
    pushEmptyRoom(room) {
        console.log('将空房间 储存起来 ，备用', room.id);
        console.log('player count = ' + room.getPlayerCount())
        this._emptyRoomList.push(room);
    }
    pushUnFullRoom(room) {
        console.log('room player count ' , room.getPlayerCount());
        for (let i = 0; i < this._unFullRoomList.length; i++) {
            if (this._unFullRoomList[i].id === room.id) {
                return false;
            }
        }
        for (let i = 0; i < this._shareFriendRoomList.length; i++) {
            if (this._shareFriendRoomList[i].id === room.id) {
                this._shareFriendRoomList.splice(i, 1);
                //如果邀请的房间列表里面存在此房间 ，那么把邀请房间从列表里面删掉，就是说在自动匹配的时候，被邀请进来的玩家就不能再进去那个房间了
            }
        }

        this._unFullRoomList.push(room);
        if (this._unFullRoomList.length >= 2) {
            console.log('不满的房间的个数 大于等于2  ，这样是不合理的')
            let room = this._unFullRoomList.pop();
            let room2 = this._unFullRoomList.pop();
            let player = room.getFirstPlayer();
            room2.initGameLoginData();
            player.assignRoom(room2);
            // room.
        }
        // this.syncGameData();
        return true;
    }
    removePlayer(id) {
        delete this._playerMap[id];
        // this.syncGameData();
    }
    syncRankData(data) {
        for (let i in this._playerMap) {
            this._playerMap[i].syncRankData(data);
        }
    }
    lockRoom(room) {
        //将房间从不满房间列表里面删掉
        for (let i = 0; i < this._unFullRoomList.length; i++) {
            if (this._unFullRoomList[i].id === room.id) {
                this._unFullRoomList.splice(i, 1);
                //将此房间加入到分享的房间列表里面

            }
        }
        this._shareFriendRoomList.push(room);
        //返回删除成功
        return true;
    }
}
module.exports = App;