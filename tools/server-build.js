var exec = require('child_process').exec;
// var cmdStr = 'curl http://www.weather.com.cn/data/sk/101010100.html';

// let str = "rm -rf /root/chutianbawebserver/server/public/games/dist/"
// let cmdStr = "mv /root/chutianbawebserver/webserver/dist/ /root/chutianbawebserver/server/public/games"
function processStr(cmd, cb) {
    console.log('cmd = ' + cmd);
    exec(cmd, function (err, stdout, stderr) {
        if (err) {
            console.log('get weather api error:' + stderr);
        } else {
            /*
            这个stdout的内容就是上面我curl出来的这个东西：
            {"weatherinfo":{"city":"北京","cityid":"101010100","temp":"3","WD":"西北风","WS":"3级","SD":"23%","WSE":"3","time":"21:20","isRadar":"1","Radar":"JC_RADAR_AZ9010_JB","njd":"暂无实况","qy":"1019"}}
            */
            // var data = JSON.parse(stdout);
            // console.log(stdout);
            if (cb) {
                cb()
            }
        }
    });
}

let targetPath = process.argv[2];

let gamePath = ['index.html', 'games', 'dist'];
let strList = [];
for (let i = 0; i < gamePath.length; i++) {
    let s = '-rf';
    if (gamePath[i].indexOf('.') !== -1) {
        s = '-f';
    }
    strList.push(

        'cp ' + s + ' ' + gamePath[i] + ' ' + targetPath
    )
}
// let strEnd = 'scp -r ' + 'game-path' +'  root@chutianba.xyz:/root/webserver/public'
// strList.push(strEnd)

// processStr(strList.shift(), () => {

// })

const enter = function () {
    if (strList.length > 0) {

        let str = strList.shift();

        processStr(str, () => {
            enter();
        })
    }
}
enter();