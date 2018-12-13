const db = require('./db');
let rankList = [];
let oldRanList = [];
let app = undefined;
exports.initRankList = function (target) {
    app = target;
    db.getRankList((err, data) => {
        if (!err && data.length !== 0) {
            rankList = JSON.parse(data[0].value);
            rankList.sort((a, b)=>{
                b.score - a.score;
            })
            console.log('rank list = ', JSON.stringify(rankList));
        } else {
            rankList = [];
        }
        oldRanList = rankList.slice(0);
        //取出排行榜数据之后，就要给在游戏里面的所有人都发送一下排行榜数据
    });
}
const rank = function (player) {
    let isHavePlayer = false;
    let rankNum = 9999;
    for (let i = 0; i < rankList.length; i++) {
        if (rankList[i].avatar == player.avatarUrl) {
            isHavePlayer = true;
        }
    }
    if (!isHavePlayer) {
        //如果不存在新来的数据，那么将其push进来


        // for (let i = 0; i < 66; i++) {
            rankList.push({
                avatar: player.avatarUrl,
                score: player.getScore(),
                id: player.id,
                nickName: player.nickName,
                rankNum: rankList.length
            });
        // }

    }
    //然后进行排序
    if (rankList.length > 1) {
        rankList.sort((a, b) => {
            b.score - a.score
        })
    } else {
        //如果列表的长度等于1，那么返回0 
        rankNum = 0;
    }
    //然后然后把列表截断 100以内
    if (rankList.length > 50) {
        rankList.splice(50, rankList.length - 50);
    }
    //然后在寻找自己是否存在在排行榜里面
    for (let i = 0; i < rankList.length; i++) {
        if (rankList[i].avatarUrl == player.avatarUrl) {
            console.log('列表里面存在此人的排行榜数据');
            rankNum = i;
        }
    }
    //首先判断一下 排行榜数据是否改变了，如果改变了 就同步并且储存到数据库里面 
    if (oldRanList.toString() !== rankList.toString()) {
        //
        console.log('更新数据库 ');
        db.updateRankList(rankList);
        oldRanList = rankList.slice(0);
        app.syncRankData(rankList);
    } else {
        console.log('排行榜数据未做改变，不做任何操作');
    }


    //每次操作完成。更新一下
    return rankNum;
}
exports.rank = rank;
exports.getRankList = function () {
    return rankList;
}