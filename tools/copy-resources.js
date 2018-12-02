let path = process.argv[2];
let fs = require('fs');
let files = fs.readdirSync(path);
var exec = require('child_process').exec;
console.log('files ', files);

//取出image 目录
const getImagePath = function (ph) {
    let fis = fs.readdirSync(path + '/' + ph);
    for (let i = 0; i < fis.length; i++) {
        let fn = fis[i];
        if (fn.indexOf('image') != -1) {
            return true;
        }
    }
    return false;
}

let pathList = [];

for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (file.indexOf('.') == -1 && getImagePath(file)) {
        pathList.push(file);

    }
}

function processStr(cmd, cb) {
    console.log('cmd = ' + cmd);
    exec(cmd, function (err, stdout, stderr) {
        if (err) {
            console.log('err' + err);
        } else {
            if (cb) {
                cb()
            }
        }
    });
}
const createDir = function (dir, cb) {
    processStr('mkdir ' + dir, cb);
}

processStr('rm -rf ./game-path/*', ()=>{
    createDir('./game-path/games/', ()=>{
        let index = 0;
        let cbEnd = function(){
            index ++;
            if (index == pathList.length){
                processStr('cp -rf ./libs ./game-path/', ()=>{
                    processStr('cp -r game.all.js ./game-path/', ()=>{
                        processStr('cp -f index.html ./game-path/', ()=>{
                            processStr('scp -r ./game-path/* root@chutianba.xyz:/root/webserver/public', ()=>{
                                
                            });
                        });
                    });
                });
            }
        }
        for (let i = 0; i < pathList.length; i++) {
            createDir('./game-path/games/' + pathList[i]);
            processStr('cp -rf ' + path  + '/'+ pathList[i] + '/images/' + ' ' + './game-path/games/' + pathList[i] + '/images', () => {
                cbEnd();
            })
        }
    });
});
