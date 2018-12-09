var http = require('http');
var qs = require('querystring');
class Player {
    constructor(socket, id, controller) {
        this.id = id;
        this._socket = socket;
        this._room = undefined;
        this._controller = controller;
        this._color = Math.random() * 10 > 5 ? 'black' : 'white';
        this._socket.on('disconnect', () => {
            this._room.removePlayer(this.id);
            this._controller.removePlayer(this.id);
        });
        this._socket.on('choose-board', (index) => {
            if (this._room) {
                this._room.playerChooseBoard(this, index);
            }
        });





        // //req 请求信息   res返回信息
        // http.createServer(function (req, res) {
        //     res.writeHeader(200, { 'Content-Type': 'text/javascript;charset=UTF-8' });  //状态码+响应头属性

        //     // 解析 url 参数
        //     var params = url.parse(req.url, true).query;  //parse将字符串转成对象,req.url="/?url=123&name=321"，true表示params是{url:"123",name:"321"}，false表示params是url=123&name=321
        //     res.write("网站名：" + params.name);
        //     res.write("\n");
        //     res.write("网站 URL：" + params.url);
        //     res.end();

        // }).listen(3000);

        // // GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
        this._socket.on('login', (data) => {
            console.log('player login ', data);
            let param = {
                appid: '',
                secret: '',
                js_code: data.code,
                grant_type: 'authorization_code'
            }
            var content = qs.stringify(param);

            var options = {
                hostname: 'https://api.weixin.qq.com',
                port: 443,
                path: '/sns/jscode2session?' + content,
                method: 'GET'
            };

            var req = http.request(options, function (res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                });
            });

            req.on('error', function (e) {
                console.log('problem with request: ' , e);
            });

            req.end();
            // this._socket.emit('login-success', this.id);

        });
    }
    assignRoom(room) {
        this._room = room;
        room.assignPlayer(this);
    }
    referGameData(data) {
        data.room_id = this._room.id;
        data.room_player_count = this._room.getPlayerCount();
        this._socket.emit('refer-game-data', data);
    }
    getColor() {
        return this._color;
    }
    setPieceColor(value) {
        // this._socket.emit('set-color', value);
        this._color = value;
    }
    syncCurrentColor(color) {
        this._socket.emit('sync-current-color', color);
    }
    syncBoardData(data) {
        this._socket.emit('sync-board-data', data);
    }
    sendGameWinMsg(color) {
        this._socket.emit('game-win', color);
    }
}
module.exports = Player;